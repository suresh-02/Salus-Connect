namespace SalusConnect.Api.Services;

public interface IDoctorService
{
    Task<IndividualDoctorDto> Create(IndividualDoctorDto doctor);

    Task<BaseDoctorDto> Create(IDbConnection conn, BaseDoctorDto doctor);

    Task Update(int id, IndividualDoctorDto doctor);

    Task Update(IDbConnection conn, int id, BaseDoctorDto doctor);

    Task Delete(int id);

    Task<IndividualDoctorDto> GetById(int id);

    Task<string[]> GetAllTags();

    Task<AppointmentsDto> GetAppointments(int id, DateTime? dateFrom, DateTime? dateTo,
        int pageIndex = 0, int pageSize = 0, string search = null, string status = null,
        string sortField = null, string sortDirection = "asc");

    Task<int> GetNotificationCount(int id);

    //Task MarkAsReadNotification(int id);

    Task UpdateProfile(int id, DoctorProfileDto profile);

    Task<AppointmentResponseDto> BookAppointment(int doctorId, AppointmentByPhoneDto appointment);

}

public class DoctorService : IDoctorService
{
    private readonly IDatabaseHelper _db;
    private readonly IUserService _userService;
    private readonly IAddressService _addressService;
    private readonly ISpecialtyService _specialtyService;
    private readonly IEmailService _emailService;

    public DoctorService(IDatabaseHelper db, IUserService userService,
        IAddressService addressService, ISpecialtyService specialtyService,
        IEmailService emailService)
    {
        _db = db;
        _userService = userService;
        _addressService = addressService;
        _specialtyService = specialtyService;
        _emailService = emailService;
    }

    #region Doctor

    // Individual doctor
    public async Task<IndividualDoctorDto> Create(IndividualDoctorDto doctor)
    {
        if (doctor.Address == null || doctor.Address.IsEmpty())
        {
            throw new BadRequestException("Address is required.");
        }

        using (var tranScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            IndividualDoctorDto createdDoctor;
            using (var conn = _db.Connect())
            {
                // postal code update
                createdDoctor = (IndividualDoctorDto)await Create(conn, doctor);
            }
            tranScope.Complete();
            return createdDoctor;
        }
    }

    // Doctor from individual and facility
    public async Task<BaseDoctorDto> Create(IDbConnection conn, BaseDoctorDto doctor)
    {
        // set random password
        string randomPassword = PasswordStorage.GenerateRandomPassword();
        doctor.Password = "Welcome@123";
        doctor.IsEmailConfirmed = true;

        var user = await _userService.Create(conn, doctor);
        doctor.UserId = user.UserId;

        doctor.SpecialtyId = doctor.Specialty.SpecialtyId;
        if (doctor.Specialty.SpecialtyId == 0)
        {
            var specialty = await _specialtyService.Create(conn, doctor.Specialty);
            doctor.SpecialtyId = specialty.SpecialtyId;
        }
        doctor.TagsString = string.Join(',', doctor.Tags);

        switch (doctor)
        {
            case IndividualDoctorDto individualDoctor:
                {
                    var address = await _addressService.Save(conn, individualDoctor.Address);
                    individualDoctor.AddressId = address.AddressId ?? 0;    // if addressId is 0 then it is an error
                    await conn.ExecuteAsync(DoctorQueries.IndividualDoctorCreate, individualDoctor);

                    individualDoctor.Password = null;
                    // await _userService.SendInvite(conn, doctor);
                    return individualDoctor;
                }
            case FacilityDoctorDto facilityDoctor:
                await conn.ExecuteAsync(DoctorQueries.FacilityDoctorCreate, facilityDoctor);

                facilityDoctor.Password = null;
                // await _userService.SendInvite(conn, doctor);
                return facilityDoctor;

            default:
                return doctor;
        }
    }

    // Individual Doctor
    public async Task Update(int id, IndividualDoctorDto doctor)
    {
        if (id != doctor.UserId)
        {
            throw new BadRequestException("Doctor Id not match.");
        }

        if (doctor.Address == null || doctor.Address.IsEmpty())
        {
            throw new BadRequestException("Address is required.");
        }

        using (var tranScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            using (var conn = _db.Connect())
            {
                if (!await IsIdExists(conn, id))
                {
                    throw new NotFoundException("Doctor not found.");
                }

                await Update(conn, id, doctor);
            }
            tranScope.Complete();
        }
    }

    // Doctor from individual and facility
    public async Task Update(IDbConnection conn, int id, BaseDoctorDto doctor)
    {
        await _userService.Update(conn, doctor.UserId, doctor);

        doctor.SpecialtyId = doctor.Specialty.SpecialtyId;
        if (doctor.Specialty.SpecialtyId == 0)
        {
            var specialty = await _specialtyService.Create(conn, doctor.Specialty);
            doctor.SpecialtyId = specialty.SpecialtyId;
        }
        doctor.TagsString = string.Join(',', doctor.Tags);

        switch (doctor)
        {
            case IndividualDoctorDto individualDoctor:
                // address
                var address = await _addressService.Save(conn, individualDoctor.Address);
                individualDoctor.AddressId = address.AddressId ?? 0;
                // doctor
                await conn.ExecuteAsync(DoctorQueries.IndividualDoctorUpdate, individualDoctor);
                //doctor.Password = null;
                break;

            case FacilityDoctorDto facilityDoctor:
                await conn.ExecuteAsync(DoctorQueries.FacilityDoctorUpdate, facilityDoctor);
                //doctor.Password = null;
                break;
        }
    }

    // TODO: check slots and appointments are exists for a doctor
    public async Task Delete(int id)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Doctor not found.");
            }

            await Delete(conn, id);
        }
    }

    public async Task<IndividualDoctorDto> GetById(int id)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Doctor not found.");
            }

            DefaultDoctorDto doctor = await GetById(conn, id);
            if (doctor == null) return null;

            var individualDoctor = new IndividualDoctorDto
            {
                Address = doctor.Address,
                AddressId = doctor.AddressId,
                Biography = doctor.Biography,
                ConfirmEmailCode = doctor.ConfirmEmailCode,
                EmailAddress = doctor.EmailAddress,
                FirstName = doctor.FirstName,
                ImageUrl = doctor.ImageUrl,
                LastName = doctor.LastName,
                IsEmailConfirmed = doctor.IsEmailConfirmed,
                Password = doctor.Password,
                PasswordHash = doctor.PasswordHash,
                PasswordSalt = doctor.PasswordSalt,
                PhoneNumber = doctor.PhoneNumber,
                ResetPasswordCode = doctor.ResetPasswordCode,
                Role = doctor.Role,
                RoleId = doctor.RoleId,
                Specialty = doctor.Specialty,
                SpecialtyId = doctor.SpecialtyId,
                Status = doctor.Status,
                StatusString = doctor.StatusString,
                Tags = doctor.Tags,
                TagsString = doctor.TagsString,
                UserId = doctor.UserId,
            };

            return individualDoctor;
        }
    }

    #endregion Doctor

    #region Appointments and Notifications

    public async Task<AppointmentsDto> GetAppointments(int id, DateTime? dateFrom, DateTime? dateTo,
        int pageIndex = 0, int pageSize = 0, string search = null, string status = null,
        string sortField = null, string sortDirection = "asc")
    {
        string from = dateFrom?.ToString("yyyy-MM-dd");
        string to = dateTo?.ToString("yyyy-MM-dd");
        using (var conn = _db.Connect())
        {
            var dbPaging = _db.PagingViewToDatabase(new ViewPaging { PageIndex = pageIndex, PageSize = pageSize });
            int totalRows = 0;
            var appointments = (await conn.QueryAsync<AppointmentDto, AppointmentsDto, AppointmentDto>(
                DoctorQueries.GetDoctorAppointments, (appointment, list) =>
                {
                    totalRows = list.Rows;
                    return appointment;
                }, new { id, from, to, limit = dbPaging.Limit, offset = dbPaging.Offset, search, status, sortField, sortDirection },
                splitOn: "rows")).ToList();
            return new AppointmentsDto { Data = appointments, Rows = totalRows };
        }
    }

    public async Task<int> GetNotificationCount(int id)
    {
        using (var conn = _db.Connect())
        {
            const string sql = "SELECT fn_doctor_notification_count(@id);";
            int notificationCount = await conn.ExecuteScalarAsync<int>(sql, new { id });
            return notificationCount;
        }
    }

    //public async Task MarkAsReadNotification(int id)
    //{
    //    using (var conn = _db.Connect())
    //    {
    //        string sql = "SELECT fn_doctor_mark_as_read_notification(@id);";
    //        await conn.ExecuteAsync(sql, new { id });
    //    }
    //}

    #endregion Appointments and Notifications

    public async Task<string[]> GetAllTags()
    {
        using (var conn = _db.Connect())
        {
            // "SELECT * FROM fn_doctor_get_all_tags();"
            string tags = await conn.ExecuteScalarAsync<string>(DoctorQueries.DoctorGetAllTags);
            return string.IsNullOrEmpty(tags)
                ? new[] { string.Empty }
                : tags.Split(',');
        }
    }

    public async Task UpdateProfile(int id, DoctorProfileDto profile)
    {
        using (var tranScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            using (var conn = _db.Connect())
            {
                await _userService.UpdateProfile(conn, id, profile);
                await conn.ExecuteAsync(DoctorQueries.ProfileUpdate, new { id, biography = profile.Biography });
            }
            tranScope.Complete();
        }
    }

    public async Task<AppointmentResponseDto> BookAppointment(int doctorId, AppointmentByPhoneDto appointment)
    {
        //var emailService = new EmailService(_options);
        var patientService = new PatientService(_db, _userService, _addressService, _emailService);
        string[] names = appointment.Name.Split(" ");
        string firstName = names[0];
        string lastName = names.Length > 1 ? names[1] : string.Empty;
        var patient = new PatientDto
        {
            FirstName = firstName,
            LastName = lastName,
            EmailAddress = appointment.Email,
            PhoneNumber = string.IsNullOrEmpty(appointment.PhoneNumber) ? string.Empty : appointment.PhoneNumber,
            Password = PasswordStorage.GenerateRandomPassword(),
        };
        var registeredPatient = await patientService.Register(patient, false);
        var appointmentRequest = new AppointmentRequestDto
        {
            AppointmentDate = appointment.AppointmentDate,
            AppointmentTime = appointment.AppointmentTime,
            DoctorId = doctorId,
            PatientId = registeredPatient.UserId,
            Symptoms = appointment.Symptoms,
            TreatmentId = appointment.TreatmentId,
        };
        var appointmentResponse = await patientService.BookAppointment(registeredPatient.UserId, appointmentRequest, appointment.EmailConsent);
        return appointmentResponse;
        //appointment.DoctorId = doctorId;
        //using (var conn = _db.Connect())
        //{
        //    //if (!await IsIdExists(conn, patientId))
        //    //{
        //    //    throw new NotFoundException("Patients only can book the appointments.");
        //    //}

        //    var (existsAppointment, errorAppointment) = await ExistsAppointment(conn, appointment.DoctorId,
        //        appointment.AppointmentDate, appointment.AppointmentTime);
        //    if (existsAppointment)
        //    {
        //        var e = new DuplicateException("Duplicate values found in appointments.");
        //        e.Data.Add("Appointment", errorAppointment);

        //        throw e;
        //    }

        //    const string sql = "SELECT * FROM fn_patient_book_appointment(@PatientId, " +
        //                       "@DoctorId, @AppointmentDate, @AppointmentTime, @Symptoms, @TreatmentId);";

        //    var appointmentResponse = await conn.QueryFirstOrDefaultAsync<AppointmentResponseDto>(sql, appointment);
        //    //appointment.Id = appointmentResponse.AppointmentId;
        //    //appointment.AppointmentCode = appointmentResponse.AppointmentCode;
        //    if (appointment.EmailConsent)
        //    {
        //        await SendAppointmentMail(appointmentResponse);
        //    }
        //    return appointmentResponse;
        //}
        //throw new NotImplementedException();
    }

    #region Private methods

    private static async Task<DefaultDoctorDto> GetById(IDbConnection conn, int id)
    {
        var doctors = (await conn.QueryAsync<DefaultDoctorDto, SpecialtyDto,
            AddressDto, DefaultDoctorDto>(DoctorQueries.DoctorGetOne, (doctor, specialty, address) =>
        {
            doctor.SpecialtyId = specialty.SpecialtyId;
            doctor.Specialty = specialty;
            doctor.AddressId = address?.AddressId ?? 0;
            doctor.Address = address;
            return doctor;
        }, new { id }, splitOn: "specialtyid, addressid")).ToArray();

        if (!doctors.Any()) return null;

        var doctor = doctors[0];
        doctor.Tags = doctor.TagsString.Split(',');
        return doctor;
    }

    private static async Task Delete(IDbConnection conn, int id)
    {
        const string sql = "SELECT fn_doctor_delete(@id);";
        await conn.ExecuteAsync(sql, new { id });
    }

    private static async Task<bool> IsIdExists(IDbConnection conn, int userId)
    {
        bool exists = await conn.ExecuteScalarAsync<bool>(@"SELECT EXISTS(SELECT 1 FROM doctors WHERE user_id = @userId);", new { userId });
        return exists;
    }

    #endregion Private methods
}

internal class DoctorQueries
{
    // CREATE
    internal const string IndividualDoctorCreate = @"
            INSERT INTO doctors ( user_id, facility_id, biography, specialty_id, tags, address_id )
		    VALUES ( @UserId, null, @Biography, @SpecialtyId, string_to_array(@TagsString, ','), @AddressId);";

    internal const string FacilityDoctorCreate = @"
            INSERT INTO doctors ( user_id, facility_id, biography, specialty_id, tags, address_id )
		    VALUES ( @UserId, @FacilityId, @Biography, @SpecialtyId, string_to_array(@TagsString, ','), null );";

    // UPDATE
    internal const string IndividualDoctorUpdate = @"
            UPDATE doctors SET
                biography = @Biography,
                specialty_id = @SpecialtyId,
                tags = string_to_array(@TagsString, ','),
                address_id = @AddressId,
                updated_at = now() at time zone 'Asia/Kolkata'
            WHERE user_id = @UserId;";

    internal const string FacilityDoctorUpdate = @"
            UPDATE doctors SET
                biography = @Biography,
                specialty_id = @SpecialtyId,
                tags = string_to_array(@TagsString, ','),
                updated_at = now() at time zone 'Asia/Kolkata'
            WHERE user_id = @UserId;";

    internal const string ProfileUpdate = @"
            UPDATE doctors SET
                biography = @biography
            WHERE user_id = @id;";

    // READ
    internal const string DoctorGetOne = @"
           SELECT d.user_id AS UserId, u.first_name AS FirstName, u.last_name AS LastName,
                u.phone_number AS PhoneNumber, u.email_address AS EmailAddress, u.role_id AS RoleId, u.image_url AS ImageUrl,
			    d.facility_id AS FacilityId, d.biography AS Biography, array_to_string(d.tags, ',')::varchar AS TagsString,
                f.facility_name AS FacilityName,
			    d.specialty_id AS SpecialtyId, s.specialty_name AS SpecialtyName, s.category_id AS CategoryId,
			    d.address_id AS AddressId, a.address_line1 AS AddressLine1, a.address_line2 AS AddressLine2,
			    a.postal_code AS PostalCode, a.city AS City, a.state_abbr StateAbbr
		    FROM doctors d
		    INNER JOIN users u ON d.user_id = u.id
		    INNER JOIN specialties s ON d.specialty_id = s.id
		    LEFT JOIN facilities f ON d.facility_id = f.id
		    LEFT JOIN addresses a ON d.address_id = a.id
		    WHERE d.user_id = @id;";   // -- d.facility_id IS NULL AND

    // Get all appointments for the doctor
    internal const string GetDoctorAppointments = @"
            WITH data_cte AS (
	            SELECT a.id AS AppointmentId, a.appointment_date AS AppointmentDate, a.appointment_time::varchar AS AppointmentTime,
                    a.duration_min AS DurationMin, a.appointment_code AS AppointmentCode, a.parent_id AS ParentId,
                    a.complete_status::text AS CompleteStatus, a.symptoms AS Symptoms, a.doctor_notes AS DoctorNotes,
                    a.billed_amount AS BilledAmount,
                    t.id AS TreatmentId, t.nick_name AS TreatmentNickname, t.treatment_type AS TreatmentType,
                    t.treatment_description AS TreatmentDescription, t.fee_per_visit AS TreatmentFees,
                    t.insurance_coverage::text AS InsuranceCoverage,
                    (pu.first_name || ' ' || pu.last_name)::varchar AS PatientName,
                    pu.phone_number AS PhoneNumber, pu.email_address AS EmailAddress,
		            s.appointment_status::text AS Status, s.read_status AS IsRead,
		            a.new_appointment_time::varchar AS NewAppointmentTime, p.address_id AddressId,
                    (a2.address_line1 || ', ' || a2.address_line2)::varchar AS Address,
                    (a2.city || ' ' || a2.state_abbr)::varchar AS Location
                FROM appointments a
	            INNER JOIN
	            (
                    SELECT *
                    FROM (
                        SELECT appointment_id, appointment_status,
			            (CASE WHEN notify_party = 'Provider' THEN read_status ELSE NULL END) AS read_status,
			            row_number() OVER (PARTITION BY appointment_id ORDER BY updated_at desc) AS rn
		                FROM appointment_statuses apst
                    ) a
                    WHERE a.rn = 1
	            ) s ON a.id = s.appointment_id AND ( @status IS NULL OR s.appointment_status::text = @status )
                INNER JOIN doctor_treatments t ON a.treatment_id = t.id
                INNER JOIN (patients p INNER JOIN users pu ON p.user_id = pu.id) ON a.patient_id = p.user_id
                LEFT JOIN addresses a2 ON p.address_id = a2.id
                WHERE a.doctor_id = @id AND
		            (
                        (@from IS NULL OR a.appointment_date >= to_date(@from, 'YYYY-MM-DD')) AND
		                (@to IS NULL OR a.appointment_date <= to_date(@to, 'YYYY-MM-DD'))
                    ) AND
                    (
      	                (@search IS NULL OR a.appointment_code                      ILIKE '%' || @search || '%') OR
      	                (@search IS NULL OR t.nick_name                             ILIKE '%' || @search || '%') OR
      	                (@search IS NULL OR t.treatment_type                        ILIKE '%' || @search || '%') OR
      	                (@search IS NULL OR (pu.first_name || ' ' || pu.last_name)  ILIKE '%' || @search || '%') OR
      	                (@search IS NULL OR pu.phone_number                         ILIKE '%' || @search || '%') OR
      	                (@search IS NULL OR (a2.city || ' ' || a2.state_abbr)       ILIKE '%' || @search || '%')
                    )
            ),
            count_cte AS (
	            SELECT COUNT(*) AS Rows FROM data_cte
            )
            SELECT *
            FROM data_cte AS da CROSS JOIN count_cte AS co
            ORDER BY
                CASE WHEN (@sortField ILIKE 'AppointmentDate'   AND @sortDirection ILIKE 'asc')  THEN da.AppointmentDate    END ASC,
                CASE WHEN (@sortField ILIKE 'AppointmentDate'   AND @sortDirection ILIKE 'asc')  THEN da.AppointmentTime    END ASC,
                CASE WHEN (@sortField ILIKE 'AppointmentDate'   AND @sortDirection ILIKE 'desc') THEN da.AppointmentDate    END DESC,
                CASE WHEN (@sortField ILIKE 'AppointmentDate'   AND @sortDirection ILIKE 'desc') THEN da.AppointmentTime    END DESC,
	            CASE WHEN (@sortField ILIKE 'AppointmentCode'   AND @sortDirection ILIKE 'asc')  THEN da.AppointmentCode    END ASC,
	            CASE WHEN (@sortField ILIKE 'AppointmentCode'   AND @sortDirection ILIKE 'desc') THEN da.AppointmentCode    END DESC,
	            CASE WHEN (@sortField ILIKE 'TreatmentNickname' AND @sortDirection ILIKE 'asc')  THEN da.TreatmentNickname  END ASC,
	            CASE WHEN (@sortField ILIKE 'TreatmentNickname' AND @sortDirection ILIKE 'desc') THEN da.TreatmentNickname  END DESC,
	            CASE WHEN (@sortField ILIKE 'TreatmentType'     AND @sortDirection ILIKE 'asc')  THEN da.TreatmentType      END ASC,
	            CASE WHEN (@sortField ILIKE 'TreatmentType'     AND @sortDirection ILIKE 'desc') THEN da.TreatmentType      END DESC,
	            CASE WHEN (@sortField ILIKE 'PatientName'       AND @sortDirection ILIKE 'asc')  THEN da.PatientName        END ASC,
	            CASE WHEN (@sortField ILIKE 'PatientName'       AND @sortDirection ILIKE 'desc') THEN da.PatientName        END DESC,
	            CASE WHEN (@sortField ILIKE 'Status'            AND @sortDirection ILIKE 'asc')  THEN da.Status             END ASC,
	            CASE WHEN (@sortField ILIKE 'Status'            AND @sortDirection ILIKE 'desc') THEN da.Status             END DESC,
	            da.AppointmentId ASC
            LIMIT @limit OFFSET @offset;";

    internal const string DoctorGetAllTags = @"
            SELECT array_to_string(array_agg(a.all_tags), ',') AS TagsString
            FROM (SELECT DISTINCT unnest(tags) all_tags FROM doctors d) a;";
}