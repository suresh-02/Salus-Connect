namespace SalusConnect.Api.Services;

public interface IPatientService
{
    Task<PatientDto> Register(PatientDto patient, bool sendInviteMail = true);

    Task<PatientDto> GetById(int id);

    Task<AddressDto> UpdateAddress(int id, AddressDto address);

    Task<AppointmentResponseDto> BookAppointment(int patientId, AppointmentRequestDto appointment, bool sendAppointmentMail = true);

    Task<List<AppointmentDto>> GetAppointments(int id);

    //Task<int> GetNotificationCount(int id);
    // Task MarkAsReadNotification(int id);

    Task<PatientsDto> GetAll(int pageIndex = 0, int pageSize = 0, string search = null,
        string sortField = null, string sortDirection = null);

    Task UpdateStatus(int id, UpdateStatusDto model);
}

public class PatientService : IPatientService
{
    private readonly IDatabaseHelper _db;
    private readonly IUserService _userService;
    private readonly IAddressService _addressService;
    private readonly IEmailService _emailService;
    // private readonly AppSettings _settings;

    public PatientService(IDatabaseHelper db, IUserService userService,
        IAddressService addressService, IEmailService emailService) //, IOptions<AppSettings> options)
    {
        _db = db;
        _userService = userService;
        _addressService = addressService;
        _emailService = emailService;
        // _settings = options.Value;
    }

    public async Task<PatientDto> Register(PatientDto patient, bool sendInviteMail = true)
    {
        //if (patient.Address == null || patient.Address.IsEmpty())
        //{
        //    throw new BadRequestException("Address is required.");
        //}

        using (var tranScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            using (var conn = _db.Connect())
            {
                // set default password - from app settings
                // string randomPassword = PasswordStorage.GenerateRandomPassword();
                // patient.Password = randomPassword;  //_settings.DefaultPassword;

                UserDto user = await _userService.GetByEmail(conn, patient.EmailAddress);
                if (user == null)
                {
                    user = await _userService.Create(conn, patient);
                    var address = await _addressService.Save(conn, patient.Address);
                    patient.UserId = user.UserId;
                    patient.AddressId = address?.AddressId;
                    await conn.ExecuteAsync("INSERT INTO patients (user_id, address_id) VALUES(@UserId, @AddressId);", patient);
                    if (sendInviteMail)
                    {
                        // Send invite mail
                        await _userService.SendInvite(conn, patient);
                    }
                }
                else
                {
                    patient.UserId = user.UserId;
                }

                patient.Password = null;
            }
            tranScope.Complete();
        }
        return patient;
    }

    public async Task<PatientDto> GetById(int id)
    {
        using (var conn = _db.Connect())
        {
            const string sql = @"
                    SELECT pt.user_id AS UserId, u.first_name AS FirstName, u.middle_name AS MiddleName,
                        u.last_name AS LastName, u.phone_number AS PhoneNumber, u.email_address AS EmailAddress,
                        u.role_id AS RoleId, u.image_url AS ImageUrl, pt.address_id AS AddressId, a.address_line1 AS AddressLine1,
                        a.address_line2 AS AddressLine2, pc.id AS PostalCodeId, pc.postal_code AS PostalCode,
                        pc.city AS City, pc.province_abbr AS ProvinceAbbr, p.province_name AS ProvinceName
		            FROM patients pt
		            INNER JOIN users u ON pt.user_id = u.id
		            LEFT JOIN
			            (addresses a INNER JOIN (postal_codes pc INNER JOIN provinces p ON pc.province_abbr = p.province_abbr)
			            ON a.postal_code_id = pc.id)
		            ON pt.address_id = a.id
		            WHERE pt.user_id = @id;";
            var patients = (await conn.QueryAsync<PatientDto, AddressDto, PatientDto>(sql, (patient, address) =>
            {
                patient.Address = address;
                patient.AddressId = address?.AddressId;
                return patient;
            }, new { id }, splitOn: "addressid")).ToArray();

            if (!patients.Any()) return null;

            var patient = patients[0];
            return patient;
        }
    }

    public async Task<AddressDto> UpdateAddress(int id, AddressDto model)
    {
        using (var tranScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            AddressDto address;
            using (var conn = _db.Connect())
            {
                if (!await IsIdExists(conn, id))
                {
                    throw new NotFoundException("Patient not found.");
                }
                address = await _addressService.Save(conn, model);

                const string sql = @"
                        UPDATE patients SET
                            address_id = @addressId,
                            updated_at = now() at time zone 'Asia/Kolkata'
                        WHERE user_id = @id;";
                await conn.ExecuteAsync(sql, new { addressId = address.AddressId, id });
            }
            tranScope.Complete();
            return address;
        }
    }

    public async Task<AppointmentResponseDto> BookAppointment(int patientId, AppointmentRequestDto appointment, bool sendAppointmentMail = true)
    {
        appointment.PatientId = patientId;
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, patientId))
            {
                throw new NotFoundException("Patients only can book the appointments.");
            }

            (int durationMin, decimal feePerVisit) = await AppointmentService.GetTreatmentInfo(conn, (int)appointment.TreatmentId);
            var (existsAppointment, errorAppointment) = await AppointmentService.ExistsAppointment(conn, appointment.DoctorId,
                appointment.AppointmentDate, appointment.AppointmentTime, durationMin);

            if (existsAppointment)
            {
                var e = new DuplicateException("Duplicate values found in appointments.");
                e.Data.Add("Appointment", errorAppointment);

                throw e;
            }

            const string sql = @"
                SELECT * FROM fn_patient_book_appointment(@PatientId,
                    @DoctorId, @AppointmentDate, @AppointmentTime, @Symptoms,
                    @TreatmentId, @durationMin, @feePerVisit);";

            var appointmentResponse = await conn.QueryFirstOrDefaultAsync<AppointmentResponseDto>(sql,
                new
                {
                    appointment.PatientId,
                    appointment.DoctorId,
                    appointment.AppointmentDate,
                    appointment.AppointmentTime,
                    appointment.Symptoms,
                    appointment.TreatmentId,
                    durationMin,
                    feePerVisit
                });
            //appointment.Id = appointmentResponse.AppointmentId;
            //appointment.AppointmentCode = appointmentResponse.AppointmentCode;
            // if (sendAppointmentMail)
            // {
            //     await SendAppointmentMail(appointmentResponse);
            // }
            return appointmentResponse;
        }
    }

    private async Task SendAppointmentMail(AppointmentResponseDto appointment)
    {
        //var user = await _userService.GetById(patientId);
        //string email = user.EmailAddress;
        //string confirmCode = Guid.NewGuid().ToString().Replace("-", string.Empty);  // CryptoHelper.AesEncrypt(user.UserId.ToString(), _settings.CryptoKey)
        //resetId = System.Web.HttpUtility.UrlEncode(resetId); //System.Net.WebUtility.UrlEncode(resetId);
        //await conn.ExecuteAsync("SELECT fn_user_update_confirm_code(@id, @confirmCode);",
        //    new { id = user.UserId, confirmCode });

        //string loginUrl = $"{_settings.BaseUrl}/verify-email?email={email}&id={confirmCode}";
        string body = $@"
                <p>Hey <strong>{appointment.PatientName}</strong>,</p>
                <p>Your appointment request has been sent to provider.<br>You will receive a confirmation email once their office accepts it.</p>
                <p>
                The appointment details are below:<br>
                Appointment ID: {appointment.AppointmentCode}<br>
                Provider: {appointment.ProviderName}<br>
                Clinic: {appointment.FacilityName}<br>
                Address: {appointment.AddressLine1} {appointment.AddressLine2}<br>
                Location: {appointment.City} {appointment.StateAbbr} {appointment.PostalCode}<br>
                Phone Number: {appointment.PhoneNumber}<br>
                Appointment Request Date: {appointment.AppointmentDate:MM/dd/yy}<br>
                Appointment Request Time: {Convert.ToDateTime(appointment.AppointmentTime):HH:mm}<br>
                Duration: {appointment.DurationMinutes} minutes<br>
                </p>
                <p>SalusConnect Team</p>
                <p>Note: This is a system alert message. Please do not reply to this email.</p>
                ";
        await _emailService.SendEmailAsync(new MailRequest
        {
            ToEmail = appointment.PatientEmailAddress,
            Subject = $"Appointment ID: {appointment.AppointmentCode} - Requested",
            Body = body
        });
    }

    public async Task<List<AppointmentDto>> GetAppointments(int id)
    {
        using (var conn = _db.Connect())
        {
            const string sql = "SELECT * FROM fn_patient_get_appointments(@id);";
            var appointments = (await conn.QueryAsync<AppointmentDto>(sql, new { id })).ToList();
            return appointments;
        }
    }

    public async Task<PatientsDto> GetAll(int pageIndex = 0, int pageSize = 0, string search = null,
        string sortField = "FirstName", string sortDirection = "asc")
    {
        const string sql = @"
                WITH data_cte AS (
                    SELECT u.id AS UserId, u.first_name AS FirstName,
                    u.last_name AS LastName, u.phone_number AS PhoneNumber, u.email_address AS EmailAddress,
                    u.image_url AS ImageUrl, u.status, p.created_at AS DateCreated,
                    a.id AS AddressId, a.address_line1 AS AddressLine1,
                    a.address_line2 AS AddressLine2,
                    a.city AS City, a.state_abbr AS StateAbbr
                    FROM (patients p INNER JOIN users u ON p.user_id = u.id)
                    LEFT JOIN addresses a ON p.address_id = a.id
                    WHERE 1 = 1 AND
                        (
                            (@search IS NULL OR u.first_name     ILIKE '%'||@search||'%') OR
                            (@search IS NULL OR u.last_name      ILIKE '%'||@search||'%') OR
                            (@search IS NULL OR u.phone_number   ILIKE '%'||@search||'%') OR
                            (@search IS NULL OR u.email_address  ILIKE '%'||@search||'%') OR
                            (@search IS NULL OR a.city           ILIKE '%'||@search||'%') OR
                            (@search IS NULL OR a.state_abbr     ILIKE '%'||@search||'%')
                        )
                ),
                count_cte AS (
                    SELECT count(*) AS Rows FROM data_cte
                )
                SELECT *
                FROM data_cte AS da CROSS JOIN count_cte AS co
                ORDER BY
                    CASE WHEN ( @sortField ILIKE 'FirstName'    AND @sortDirection ILIKE 'asc'  ) THEN da.FirstName    END ASC,
                    CASE WHEN ( @sortField ILIKE 'FirstName'    AND @sortDirection ILIKE 'desc' ) THEN da.FirstName    END DESC,
                    CASE WHEN ( @sortField ILIKE 'LastName'     AND @sortDirection ILIKE 'asc'  ) THEN da.LastName     END ASC,
                    CASE WHEN ( @sortField ILIKE 'LastName'     AND @sortDirection ILIKE 'desc' ) THEN da.LastName     END DESC,
                    CASE WHEN ( @sortField ILIKE 'City'         AND @sortDirection ILIKE 'asc'  ) THEN da.City         END ASC,
                    CASE WHEN ( @sortField ILIKE 'City'         AND @sortDirection ILIKE 'desc' ) THEN da.City         END DESC,
                    CASE WHEN ( @sortField ILIKE 'StateAbbr'    AND @sortDirection ILIKE 'asc'  ) THEN da.StateAbbr    END ASC,
                    CASE WHEN ( @sortField ILIKE 'StateAbbr'    AND @sortDirection ILIKE 'desc' ) THEN da.StateAbbr    END DESC,
                    CASE WHEN ( @sortField ILIKE 'DateCreated'  AND @sortDirection ILIKE 'asc'  ) THEN da.DateCreated  END ASC,
                    CASE WHEN ( @sortField ILIKE 'DateCreated'  AND @sortDirection ILIKE 'desc' ) THEN da.DateCreated  END DESC,
                    da.UserId ASC
                LIMIT @limit OFFSET @offset;";

        var dbPaging = _db.PagingViewToDatabase(new ViewPaging { PageIndex = pageIndex, PageSize = pageSize });
        int totalRows = 0;
        using (var conn = _db.Connect())
        {
            var patients = (await conn.QueryAsync<PatientDto, AddressDto, PatientsDto, PatientDto>(sql, (patient, address, list) =>
            {
                patient.Address = address;
                patient.AddressId = address?.AddressId;
                totalRows = list.Rows;
                return patient;
            }, new { limit = dbPaging.Limit, offset = dbPaging.Offset, search, sortField, sortDirection }, splitOn: "addressid,rows")).ToList();
            return new PatientsDto { Data = patients, Rows = totalRows };
        }
    }

    public async Task UpdateStatus(int id, UpdateStatusDto model)
    {
        if (id != model.Id)
        {
            throw new BadRequestException("Patient Id does not match.");
        }
        await _userService.UpdateStatus(model.Id, model.Status);
    }

    //public async Task<int> GetNotificationCount(int id)
    //{
    //    using (var conn = _db.Connect())
    //    {
    //        string sql = "SELECT fn_patient_notification_count(@id);";
    //        int notificationCount = await conn.ExecuteScalarAsync<int>(sql, new { id });
    //        return notificationCount;
    //    }
    //}

    //public async Task MarkAsReadNotification(int id)
    //{
    //    using (var conn = _db.Connect())
    //    {
    //        string sql = "SELECT fn_patient_mark_as_read_notification(@id);";
    //        await conn.ExecuteAsync(sql, new { id });
    //    }
    //}

    #region Private methods

    //const string sql = @"
    //        SELECT appointment_code
    //        FROM appointments
    //        WHERE
    //            --patient_id = @patientId
    //            doctor_id = @doctorId
    //            AND appointment_date = to_date(@appointmentDate, 'yyyy-mm-dd')
    //            AND appointment_time = @appointmentTime::time;";

    private static async Task<bool> IsIdExists(IDbConnection conn, int id)
    {
        bool found = await conn.ExecuteScalarAsync<bool>("SELECT EXISTS(" +
                                                         "SELECT 1 FROM patients WHERE user_id = @id);", new { id });
        return found;
    }

    #endregion Private methods
}