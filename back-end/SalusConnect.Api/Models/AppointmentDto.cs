namespace SalusConnect.Api.Models;

public class AppointmentRequestDto
{
    [JsonIgnore]
    public int PatientId { get; set; }

    public int DoctorId { get; set; }
    public string AppointmentDate { get; set; } // yyyy-MM-dd
    public string AppointmentTime { get; set; } // HH:mm

    [StringLength(300, ErrorMessage = "{0} should not exceed {1} characters")]
    public string Symptoms { get; set; }

    public int? TreatmentId { get; set; }
}

public class AppointmentByPhoneDto
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public bool EmailConsent { get; set; }
    public int? TreatmentId { get; set; }
    public string AppointmentDate { get; set; } // yyyy-MM-dd
    public string AppointmentTime { get; set; } // HH:mm

    [StringLength(300, ErrorMessage = "{0} should not exceed {1} characters")]
    public string Symptoms { get; set; }

    [JsonIgnore]
    public int PatientId { get; set; }

    [JsonIgnore]
    public int DoctorId { get; set; }
}

public class FollowupRequestDto
{
    public string AppointmentDate { get; set; } // yyyy-MM-dd

    public string AppointmentTime { get; set; } // HH:mm

    public int TreatmentId { get; set; }

    [JsonIgnore]
    public int AppointmentId { get; set; }
}

public class AppointmentResponseDto
{
    #region Appointment details

    public int AppointmentId { get; set; }
    public string AppointmentCode { get; set; }
    public DateTime AppointmentDate { get; set; } // yyyy-MM-dd
    public string AppointmentTime { get; set; } // HH:mm
    public int DurationMinutes { get; set; }
    public int PatientId { get; set; }

    #endregion Appointment details

    #region Provider details

    public string ProviderName { get; set; }
    public string FacilityName { get; set; }
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string City { get; set; }
    public string StateAbbr { get; set; }
    public string PostalCode { get; set; }
    public string PhoneNumber { get; set; }
    public string EmailAddress { get; set; }

    #endregion Provider details

    #region Patient details

    public string PatientName { get; set; }
    public string PatientEmailAddress { get; set; }

    #endregion Patient details
}

public class AppointmentDto     // Common for Provider and Patient
{
    public int AppointmentId { get; set; }
    public DateTime AppointmentDate { get; set; } // yyyy-MM-dd
    public string AppointmentTime { get; set; } // HH:mm
    public int DurationMin { get; set; }
    public string AppointmentCode { get; set; }
    public string DoctorName { get; set; }
    public string PatientName { get; set; }
    public string FacilityName { get; set; }
    public string PhoneNumber { get; set; }
    public string EmailAddress { get; set; }
    public string Address { get; set; }
    public string Location { get; set; }
    public string Status { get; set; }
    public bool? IsRead { get; set; }
    public DateTime? NewAppointmentTime { get; set; }
    public int? ParentId { get; set; }
    public CompleteStatus CompleteStatus { get; set; }
    public int CancellationPolicyDays { get; set; }
    public string Symptoms { get; set; }

    //[StringLength(8000, ErrorMessage = "{0} can have maximum of {1} characters")]
    public string DoctorNotes { get; set; }

    public decimal? BilledAmount { get; set; }
    public int TreatmentId { get; set; }
    public string TreatmentNickname { get; set; }
    public string TreatmentType { get; set; }
    public string TreatmentDescription { get; set; }
    public decimal? TreatmentFees { get; set; }
    public string TreatmentInsuranceCoverage { get; set; }
    [JsonIgnore]
    public string CompleteStatusString
    {
        get => CompleteStatus.ToString();
        set => CompleteStatus = (CompleteStatus)Enum.Parse(typeof(CompleteStatus), value, true);
    }
}

public class AppointmentsDto
{
    public List<AppointmentDto> Data { get; set; }
    public int Rows { get; set; }
}

public class AppointmentStatusDto
{
    public int AppointmentId { get; set; }
    public AppointmentStatus AppointmentStatus { get; set; }
    public NotifyParty NotifyParty { get; set; }
    public string NewAppointmentTime { get; set; }

    public string ToStatusString()
    {
        return AppointmentStatus switch
        {
            AppointmentStatus.ProposeNew => "Proposed New Time",
            _ => AppointmentStatus.ToString()
        };
    }
}

public class CompleteStatusDto
{
    public CompleteStatus CompleteStatus { get; set; }

    [JsonIgnore]
    public string CompleteStatusString
    {
        get => CompleteStatus.ToString();
        set => CompleteStatus = (CompleteStatus)Enum.Parse(typeof(CompleteStatus), value, true);
    }

    [JsonIgnore]
    public int AppointmentId { get; set; }
}

public class NotesDto
{
    public string DoctorNotes { get; set; }

    [JsonIgnore]
    public int AppointmentId { get; set; }
}

public class BilledAmountDto
{
    public decimal BilledAmount { get; set; }

    [JsonIgnore]
    public int AppointmentId { get; set; }
}

public enum AppointmentStatus
{
    Unknown,
    Requested = 1, // Patient  -> Patient can be Cancelled
    Accepted,      // Provider -> Patient can be Cancelled
    Rejected,      // Provider -> Closed
    ProposeNew,    // Provider -> Patient can be Confirmed/Cancelled
    Confirmed,     // Patient  -> ProposeNew -> Confirmed/Cancelled
    Cancelled      // Patient  -> ProposeNew -> Confirmed/Cancelled
}

public enum NotifyParty
{
    Provider = 1,

    Patient
}

public enum CompleteStatus
{
    Unknown,
    Complete = 1,
    NoShow
}