namespace SalusConnect.Api.Controllers;

[Authorize(Roles = $"{Roles.Administrator},{Roles.Doctor}")]
[Route("[controller]/[action]")]
[ApiController]
[ApiVersion("1.0")]
[Produces("application/json")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IDashboardService service, ILogger<DashboardController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Appointment Dashboard
    /// </summary>
    /// <returns>Providers</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Appointments(int? facilityId = null, int? doctorId = null, int? treatmentId = null,
        DateTime? from = null, DateTime? to = null)
    {
        try
        {
            var data = await _service.AppointmentsDashboard(facilityId, doctorId, treatmentId, from, to);
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching appointments dashboard: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Revenue Dashboard
    /// </summary>
    /// <returns>Providers</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Revenues(int? facilityId = null, int? doctorId = null, int? treatmentId = null,
        DateTime? from = null, DateTime? to = null)
    {
        try
        {
            var data = await _service.RevenueDashboard(facilityId, doctorId, treatmentId, from, to);
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching revenue dashboard: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }
}