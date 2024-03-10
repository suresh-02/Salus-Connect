namespace SalusConnect.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
[ApiVersion("1.0")]
[Produces("application/json")]
public class FacilitiesController : ControllerBase
{
    private readonly IFacilityService _service;
    private readonly ILogger<FacilitiesController> _logger;

    public FacilitiesController(IFacilityService service, ILogger<FacilitiesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Create new facility
    /// </summary>
    /// <param name="facility">New Facility</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>Newly created facility</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Create([FromBody] FacilityDto facility,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            var createdFacility = await _service.Create(facility);
            return CreatedAtAction(nameof(Get), new { Id = createdFacility.FacilityId }, createdFacility);
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning creating new facility: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning creating new facility: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new facility: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Update a facility
    /// </summary>
    /// <param name="id">ID</param>
    /// <param name="facility">Facility</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>None</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Update(int id, [FromBody] FacilityDto facility,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            await _service.Update(id, facility);
            return Ok();
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning updating a facility: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning updating a facility: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning updating a facility: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating a facility: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get facility by id
    /// </summary>
    /// <param name="id">Facility ID</param>
    /// <param name="includeChildren">Include doctors and staff</param>
    /// <returns>Facility</returns>
    [Authorize(Roles = Roles.Administrator + "," + Roles.Doctor)]
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Get(int id, bool includeChildren = false)
    {
        try
        {
            var facility = await _service.GetById(id, includeChildren);
            if (facility == null)
            {
                return NotFound(new { Message = "Facility not found." });
            }

            return Ok(facility);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning fetching a facility: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching a facility: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Delete facility by id
    /// </summary>
    /// <param name="id">Facility ID</param>
    /// <returns>None</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
       ProducesResponseType(StatusCodes.Status404NotFound),
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
            _logger.LogWarning(nex, "Warning deleting a facility: " + nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting a facility: " + ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get doctors by facility id
    /// </summary>
    /// <param name="id">Facility ID</param>
    /// <returns>Facility</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpGet("{id:int}/doctors")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetDoctors(int id)
    {
        try
        {
            var doctors = await _service.GetDoctors(id);
            if (doctors == null)
            {
                return NotFound(new { Message = "Facility not found." });
            }

            return Ok(doctors);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning fetching doctors from a facility: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching doctors from a facility: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }
}