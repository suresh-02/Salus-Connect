namespace SalusConnect.Api.Controllers;

[Authorize(Roles = "Administrator")]
[Route("[controller]")]
[ApiController]
[ApiVersion("1.0")]
[Produces("application/json")]
public class HolidaysController : ControllerBase
{
    private readonly IHolidayService _service;
    private readonly ILogger<HolidaysController> _logger;

    public HolidaysController(IHolidayService service, ILogger<HolidaysController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all holidays
    /// </summary>
    /// <returns>Holidays</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Get([FromQuery] int year)
    {
        try
        {
            var holidays = await _service.GetAll(year);
            return Ok(holidays);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching holidays: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get holiday by ID
    /// </summary>
    /// <returns>Holiday</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetById([FromRoute] int id)
    {
        try
        {
            var holiday = await _service.GetById(id);
            return Ok(holiday);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning fetching holiday by id: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching holiday by id: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Create holiday
    /// </summary>
    /// <param name="model">Update Status Model</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>Holiday</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status422UnprocessableEntity),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Create(HolidayDto model,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            var holiday = await _service.Create(model);
            return CreatedAtAction(nameof(Get), new { holiday.HolidayId }, holiday);
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning creating holiday: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning creating holiday: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating holiday: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Update holiday
    /// </summary>
    /// <param name="id"></param>
    /// <param name="model">Update Status Model</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>Holiday</returns>
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status422UnprocessableEntity),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Update(int id, HolidayDto model,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            await _service.Update(id, model);
            return Ok();
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning updating holiday: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning updating holiday: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning updating holiday: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating holiday: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Delete holiday
    /// </summary>
    /// <param name="id"></param>
    /// <returns>None</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await _service.Delete(id);
            return NoContent();
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning deleting holiday: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting holiday: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }
}