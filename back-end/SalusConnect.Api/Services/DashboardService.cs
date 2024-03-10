namespace SalusConnect.Api.Services;

public interface IDashboardService
{
    Task<AppointmentDashboardDto> AppointmentsDashboard(int? facilityId = null, int? doctorId = null, int? treatmentId = null,
        DateTime? from = null, DateTime? to = null);

    Task<RevenueDashboardDto> RevenueDashboard(int? facilityId = null, int? doctorId = null, int? treatmentId = null,
        DateTime? from = null, DateTime? to = null);
}

public class DashboardService : IDashboardService
{
    private readonly IDatabaseHelper _db;

    public DashboardService(IDatabaseHelper db)
    {
        _db = db;
    }

    public async Task<AppointmentDashboardDto> AppointmentsDashboard(int? facilityId = null, int? doctorId = null, int? treatmentId = null,
        DateTime? from = null, DateTime? to = null)
    {
        switch (facilityId)
        {
            case null when doctorId == null:
                throw new BadRequestException("Either facility id or doctor id is required.");
            case > 0:
                doctorId = null;
                break;

            default:
                {
                    if (doctorId is > 0)
                    {
                        facilityId = null;
                    }

                    break;
                }
        }

        var appointmentDashboard = new AppointmentDashboardDto();
        using (var conn = _db.Connect())
        {
            try
            {
                await conn.ExecuteAsync(
                    @"BEGIN;SELECT fn_dashboard_appointments('patient', 'appointment', 'cancel', 'bookings',
                            @facilityId, @doctorId, @treatmentId, @from, @to);",
                    new
                    {
                        facilityId,
                        doctorId,
                        treatmentId,
                        from = from?.ToString("yyyy-MM-dd"),
                        to = to?.ToString("yyyy-MM-dd")
                    });

                appointmentDashboard.Patient =
                    await conn.QueryFirstOrDefaultAsync<AppointmentPatientDashboardDto>("FETCH ALL IN patient;");

                appointmentDashboard.Appointment =
                    await conn.QueryFirstOrDefaultAsync<AppointmentAppointmentDashboardDto>(
                        "FETCH ALL IN appointment;");
                appointmentDashboard.Cancel =
                    await conn.QuerySingleOrDefaultAsync<AppointmentCancelDashboardDto>("FETCH ALL IN cancel;");
                appointmentDashboard.Bookings =
                    (await conn.QueryAsync<AppointmentBookingDashboardDto>("FETCH ALL IN bookings;"))
                    .ToList();
            }
            finally
            {
                await conn.ExecuteAsync("COMMIT;");
            }

            return appointmentDashboard;
        }
    }

    public async Task<RevenueDashboardDto> RevenueDashboard(int? facilityId = null, int? doctorId = null, int? treatmentId = null, DateTime? from = null,
        DateTime? to = null)
    {
        switch (facilityId)
        {
            case null when doctorId == null:
                throw new BadRequestException("Either facility id or doctor id is required.");
            case > 0:
                doctorId = null;
                break;

            default:
                {
                    if (doctorId is > 0)
                    {
                        facilityId = null;
                    }

                    break;
                }
        }

        var revenueDashboard = new RevenueDashboardDto();
        using (var conn = _db.Connect())
        {
            try
            {
                await conn.ExecuteAsync(
                    @"BEGIN;SELECT fn_dashboard_revenue('patient', 'fee', 'cancel',
                            @facilityId, @doctorId, @treatmentId, @from, @to);",
                    new
                    {
                        facilityId,
                        doctorId,
                        treatmentId,
                        from = from?.ToString("yyyy-MM-dd"),
                        to = to?.ToString("yyyy-MM-dd")
                    });

                revenueDashboard.Patient =
                    await conn.QueryFirstOrDefaultAsync<RevenuePatientDashboardDto>("FETCH ALL IN patient;");

                revenueDashboard.Fee =
                    await conn.QueryFirstOrDefaultAsync<RevenueFeeDashboardDto>(
                        "FETCH ALL IN fee;");
                revenueDashboard.Cancel =
                    await conn.QuerySingleOrDefaultAsync<RevenueCancelDashboardDto>("FETCH ALL IN cancel;");
            }
            finally
            {
                await conn.ExecuteAsync("COMMIT;");
            }

            return revenueDashboard;
        }
    }
}