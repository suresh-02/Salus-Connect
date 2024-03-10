namespace SalusConnect.Api.Services;

public interface IAppointmentService
{
    Task ChangeStatus(AppointmentStatusDto status);

    Task<AppointmentResponseDto> BookFollowup(int id, FollowupRequestDto followup);

    Task MarkAsComplete(int id, CompleteStatusDto status);

    Task<NotesDto> GetNotes(int id);

    Task SaveNotes(int id, NotesDto notes);

    Task SaveBilledAmount(int id, BilledAmountDto billedAmount);

    //Task<(int, decimal)> GetTreatmentInfo(IDbConnection conn, int treatmentId);
}

public class AppointmentService : IAppointmentService
{
    private readonly IDatabaseHelper _db;
    private readonly IEmailService _emailService;

    public AppointmentService(IDatabaseHelper db, IEmailService emailService)
    {
        _db = db;
        _emailService = emailService;
    }

    public async Task ChangeStatus(AppointmentStatusDto status)
    {
        using (var conn = _db.Connect())
        {
            const string sql = "SELECT * FROM fn_appointment_update_status(@AppointmentId, @AppointmentStatus, " +
                               "@NotifyParty, @NewAppointmentTime);";
            var appointmentResponse = await conn.QueryFirstOrDefaultAsync<AppointmentResponseDto>(sql, new
            {
                status.AppointmentId,
                AppointmentStatus = status.AppointmentStatus.ToString(),
                NotifyParty = status.NotifyParty.ToString(),
                status.NewAppointmentTime
            });

            // if (status.NotifyParty == NotifyParty.Patient)
            // {
            //     await SendStatusMail(appointmentResponse, status);
            // }
        }
    }

    private async Task SendStatusMail(AppointmentResponseDto appointment, AppointmentStatusDto status)
    {
        //var appointment = await conn.QuerySingleOrDefaultAsync<AppointmentResponseDto>(
        //    "SELECT * FROM fn_appointment_get_provider(@appointmentId);",
        //    new { appointmentId = status.AppointmentId });
        //if (appointment == null)
        //    return;

        //var user = await _userService.GetById(appointment.PatientId);

        string statusMessage = string.Empty;
        switch (status.AppointmentStatus)
        {
            case AppointmentStatus.Accepted:
                statusMessage = @"<p>Your appointment request has been <strong>Accepted</strong>. Please find the details below.</p>
                    The appointment details are below:";
                break;

            case AppointmentStatus.ProposeNew:
                statusMessage = @"<p>A <strong>New Time</strong> has been proposed by the clinic for your requested appointment.
                    Please go into your SalusConnect dashboard to confirm it.
                    Alternatively, please call or email the provider’s office directly to discuss other suitable options.</p>
                    The appointment details are below:";
                break;

            case AppointmentStatus.Rejected:
                statusMessage = @"<p>Unfortunately, your appointment request was <strong>Not Accepted</strong> by the provider’s office.
                    There can be a number of reasons for this and typically happens if your intended medical provider
                    is no longer available to see you at the previously available time.</p>
                    <p>Please consider going back to <a href='https://www.salusconnect.ca'>www.salusconnect.ca</a> and finding another time with this provider.
                    Alternatively, you could consider another provider in case their availability suits you better.</p>
                    For your records, the appointment details from your cancelled appointment are below:";
                break;
        }
        // {(status.AppointmentStatus == AppointmentStatus.ProposeNew ? $"Doctor <strong>{status.ToStatusString()}</strong>." : $"Your appointment <strong>{status.ToStatusString()}</strong> by the Doctor.")}

        string email = appointment.PatientEmailAddress;
        string body = $@"
                <p>Hey <strong>{appointment.PatientName}</strong>,</p>
                {statusMessage}
                <p>
                Appointment ID: {appointment.AppointmentCode}<br>
                Provider: {appointment.ProviderName}<br>
                Clinic: {appointment.FacilityName}<br>
                Address: {appointment.AddressLine1} {appointment.AddressLine2}<br>
                Location: {appointment.City} {appointment.StateAbbr} {appointment.PostalCode}<br>
                Phone Number: {appointment.PhoneNumber}<br>
                Appointment Date: {appointment.AppointmentDate:MM/dd/yy}<br>
                Appointment Time: {Convert.ToDateTime(status.AppointmentStatus == AppointmentStatus.ProposeNew ? status.NewAppointmentTime : appointment.AppointmentTime):HH:mm}<br>
                Duration: {appointment.DurationMinutes} minutes<br>
                </p>
                <p>SalusConnect Team</p>
                <p>Note: This is a system alert message. Please do not reply to this email.</p>
                ";
        await _emailService.SendEmailAsync(new MailRequest
        {
            ToEmail = email,
            Subject = $"Appointment ID: {appointment.AppointmentCode} - {status.ToStatusString()}",
            Body = body
        });
    }

    public async Task<AppointmentResponseDto> BookFollowup(int id, FollowupRequestDto followup)
    {
        //appointment.PatientId = patientId;
        using (var conn = _db.Connect())
        {
            //if (!await IsIdExists(conn, patientId))
            //{
            //    throw new NotFoundException("Patient profile can only book the appointments.");
            //}

            //var (existsAppointment, errorAppointment) = await ExistsAppointment(conn, patientId, appointment.DoctorId,
            //    appointment.AppointmentDate, appointment.AppointmentTime);
            //if (existsAppointment)
            //{
            //    var e = new DuplicateException("Duplicate values found in appointments.");
            //    if (existsAppointment)
            //    {
            //        e.Data.Add("Appointment", errorAppointment);
            //    }

            //    throw e;
            //}

            int doctorId = await GetDoctorId(conn, followup.AppointmentId);
            (int durationMin, decimal feePerVisit) = await AppointmentService.GetTreatmentInfo(conn, (int)followup.TreatmentId);
            var (existsAppointment, errorAppointment) = await AppointmentService.ExistsAppointment(conn, doctorId,
                followup.AppointmentDate, followup.AppointmentTime, durationMin);
            if (existsAppointment)
            {
                var e = new DuplicateException("Duplicate values found in appointments.");
                e.Data.Add("Appointment", errorAppointment);

                throw e;
            }

            followup.AppointmentId = id;
            const string sql = "SELECT * FROM fn_doctor_book_followup(@AppointmentId, @AppointmentDate, @AppointmentTime, @TreatmentId);";

            var appointmentResponse = await conn.QueryFirstOrDefaultAsync<AppointmentResponseDto>(sql, followup);
            //followup.Id = appointmentResponse.AppointmentId;
            //followup.AppointmentCode = appointmentResponse.AppointmentCode;
            // await SendFollowupMail(appointmentResponse);
            return appointmentResponse;
        }
    }

    public static async Task<int> GetDoctorId(IDbConnection conn, int appointmentId)
    {
        int doctorId = await conn
            .ExecuteScalarAsync<int>(@"
                SELECT doctor_id
                FROM appointments
                WHERE id = @appointmentId;", new { appointmentId });
        return doctorId;
    }

    private async Task SendFollowupMail(AppointmentResponseDto appointment)
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
                <p>Your follow-up appointment booked by Doctor.</p>
                <p>Your follow-up appointment is confirmed and Doctor's office has sent the appointment details. If you need any assistance, please contact the doctor's office via email or phone.</p>
                <p>
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

    public async Task MarkAsComplete(int id, CompleteStatusDto status)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Appointment ID not found");
            }
            status.AppointmentId = id;
            const string sql =
                @"UPDATE appointments SET complete_status = @CompleteStatusString::completestatus
                    WHERE id = @AppointmentId";
            await conn.ExecuteAsync(sql, status);
        }
    }

    public async Task<NotesDto> GetNotes(int id)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Appointment ID not found.");
            }
            const string sql = @"
                SELECT doctor_notes AS DoctorNotes, staff_notes AS StaffNotes
                FROM appointments
                WHERE id = @id";
            var notes = await conn.QuerySingleOrDefaultAsync<NotesDto>(sql, new { id });
            if (notes == null)
            {
                notes = new NotesDto { DoctorNotes = string.Empty };
            }
            else
            {
                notes.DoctorNotes ??= string.Empty;
            }
            notes.AppointmentId = id;
            return notes;
        }
    }

    public async Task SaveNotes(int id, NotesDto notes)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Appointment ID not found.");
            }
            notes.AppointmentId = id;
            const string sql =
                @"UPDATE appointments SET doctor_notes = @DoctorNotes, staff_notes=@StaffNotes
                    WHERE id = @AppointmentId";
            await conn.ExecuteAsync(sql, notes);
        }
    }

    public async Task SaveBilledAmount(int id, BilledAmountDto billedAmount)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Appointment ID not found");
            }
            billedAmount.AppointmentId = id;
            const string sql =
                @"UPDATE appointments SET billed_amount = @BilledAmount
                    WHERE id = @AppointmentId";
            await conn.ExecuteAsync(sql, billedAmount);
        }
    }

    public static async Task<(int, decimal)> GetTreatmentInfo(IDbConnection conn, int treatmentId)
    {
        string sql = @"
            SELECT duration_min AS DurationMin, fee_per_visit AS FeePerVisit
            FROM doctor_treatments
            WHERE id = @treatmentId;";
        var treatmentInfo = await conn.QuerySingleOrDefaultAsync<(int, decimal)>(sql, new { treatmentId });
        return treatmentInfo;
    }

    public static async Task<(bool, string)> ExistsAppointment(IDbConnection conn, int doctorId,
    string appointmentDate, string appointmentTime, int durationMin)
    {
        string sql = @"
            SELECT a.appointment_code
            FROM appointments a
            INNER JOIN (SELECT appointment_id, appointment_status, row_number() OVER (PARTITION BY appointment_id ORDER BY updated_at desc) AS rn
	        FROM appointment_statuses) apst ON a.id = apst.appointment_id
            WHERE a.doctor_id = @doctorId AND a.appointment_date = to_date(@appointmentDate, 'yyyy-mm-dd') AND
	            timerange( a.appointment_time, a.appointment_time + make_interval(mins => a.duration_min) ) &&
	            timerange( @appointmentTime::time, @appointmentTime::time + make_interval(mins => @durationMin) ) AND
                apst.rn = 1 AND apst.appointment_status NOT IN ('Cancelled','Rejected');";
        string appointmentCode = await conn.ExecuteScalarAsync<string>(sql,
            new { doctorId, appointmentDate, appointmentTime, durationMin });

        return !string.IsNullOrEmpty(appointmentCode)
            ? (true, $"Appointment already exists with ID '{appointmentCode}' same doctor and same time.")
            : (false, "");
    }

    private static async Task<bool> IsIdExists(IDbConnection conn, int id)
    {
        bool exists = await conn.ExecuteScalarAsync<bool>("SELECT EXISTS(" +
                                                          "SELECT 1 FROM appointments WHERE id = @id);", new { id });
        return exists;
    }
}