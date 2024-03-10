namespace SalusConnect.Api.Models;

#region Analysis Dashboard for Appointments

public class AppointmentDashboardDto
{
    public AppointmentPatientDashboardDto Patient { get; set; }
    public AppointmentAppointmentDashboardDto Appointment { get; set; }
    public AppointmentCancelDashboardDto Cancel { get; set; }
    public List<AppointmentBookingDashboardDto> Bookings { get; set; }
}

public class AppointmentPatientDashboardDto
{
    public int NewPatients { get; set; }
    public int ReturningPatients { get; set; }
}

public class AppointmentAppointmentDashboardDto
{
    public int AcceptedCount { get; set; }
    public int CompletedCount { get; set; }
    public int FollowupCount { get; set; }
    public int RescheduledCount { get; set; }
    public int NoShowCount { get; set; }
}

public class AppointmentCancelDashboardDto
{
    public int CancelledByDoctorCount { get; set; }
    public int CancelledByPatientCount { get; set; }
}

public class AppointmentBookingDashboardDto
{
    public int DoctorId { get; set; }
    public int EfficiencySeconds { get; set; }
}

#endregion Analysis Dashboard for Appointments

#region Analysis Dashboard for Revenue

public class RevenueDashboardDto
{
    public RevenuePatientDashboardDto Patient { get; set; }
    public RevenueFeeDashboardDto Fee { get; set; }
    public RevenueCancelDashboardDto Cancel { get; set; }
}

public class RevenuePatientDashboardDto
{
    public decimal NewPatients { get; set; }
    public decimal ReturningPatients { get; set; }
}

public class RevenueFeeDashboardDto
{
    public decimal StatedFee { get; set; }
    public decimal ActualBilled { get; set; }
}

public class RevenueCancelDashboardDto
{
    public decimal CancelledByDoctorAmount { get; set; }
    public decimal CancelledByPatientAmount { get; set; }
}

#endregion Analysis Dashboard for Revenue