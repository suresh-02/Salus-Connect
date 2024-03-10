namespace SalusConnect.Api.Controllers;

[Authorize]
[Route("[controller]/{id:int}/[action]")]
[ApiController]
[ApiVersion("1.0")]
[Produces("application/json")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _service;
    private readonly ILogger<AppointmentsController> _logger;

    public AppointmentsController(IAppointmentService service, ILogger<AppointmentsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Update appointment status
    /// </summary>
    /// <returns>Providers</returns>
    [Authorize(Roles = Roles.Patient + "," + "," + Roles.Doctor)]
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> ChangeStatus(int id, AppointmentStatusDto status)
    {
        try
        {
            status.AppointmentId = id;
            await _service.ChangeStatus(status);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating appointment status: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Book follow-up
    /// </summary>
    /// <param name="id">Appointment ID</param>
    /// <param name="model">Followup model</param>
    /// /// <param name="apiBehaviorOptions"></param>
    /// <returns>Follow-up response</returns>
    [Authorize(Roles = Roles.Doctor)]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> FollowUp(int id, [FromBody] FollowupRequestDto model,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            var followupResponse = await _service.BookFollowup(id, model);
            return Ok(followupResponse);
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning booking followup: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning booking followup: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error booking followup: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Mark As Complete
    /// </summary>
    /// <param name="id">Appointment ID</param>
    /// <param name="model">CompleteStatus model</param>
    /// <returns>None</returns>
    [Authorize(Roles = Roles.Doctor)]
    [HttpPatch]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> MarkAsComplete(int id, [FromBody] CompleteStatusDto model)
    {
        try
        {
            await _service.MarkAsComplete(id, model);
            return Ok();
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning while mark as complete: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning while mark as complete: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while mark as complete: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get Notes
    /// </summary>
    /// <param name="id">Appointment ID</param>
    /// <returns>None</returns>
    [Authorize(Roles = Roles.Doctor)]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Notes(int id)
    {
        try
        {
            var notes = await _service.GetNotes(id);
            return Ok(notes);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning while fetch notes: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning while fetch notes: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while fetch notes: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Update Notes
    /// </summary>
    /// <param name="id">Appointment ID</param>
    /// <param name="model">Notes model</param>
    /// <returns>None</returns>
    [Authorize(Roles = Roles.Doctor)]
    [HttpPatch]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Notes(int id, [FromBody] NotesDto model)
    {
        try
        {
            await _service.SaveNotes(id, model);
            return Ok();
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning while save notes: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning while save notes: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while save notes: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Update Billed Amount
    /// </summary>
    /// <param name="id">Appointment ID</param>
    /// <param name="model">Billed amount model</param>
    /// <returns>None</returns>
    [Authorize(Roles = Roles.Doctor)]
    [HttpPatch]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> BilledAmount(int id, [FromBody] BilledAmountDto model)
    {
        try
        {
            await _service.SaveBilledAmount(id, model);
            return Ok();
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning while save billed amount: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning while save billed amount: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while save billed amount: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }
}
