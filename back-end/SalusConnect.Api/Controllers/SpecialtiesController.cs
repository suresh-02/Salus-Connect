namespace SalusConnect.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
[ApiVersion("1.0")]
[Produces("application/json")]
public class SpecialtiesController : ControllerBase
{
    private readonly ISpecialtyService _service;
    private readonly ILogger<SpecialtiesController> _logger;

    public SpecialtiesController(ISpecialtyService service, ILogger<SpecialtiesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get specialty by id
    /// </summary>
    /// <returns>Specialty</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Get()
    {
        try
        {
            var specialties = await _service.GetAll();
            var specialtiesGroupedByCategory = specialties.GroupBy(spl => new { spl.CategoryId, spl.CategoryName });

            var specialtiesByCategory = new List<SpecialtyByCategoryDto>();
            foreach (var group in specialtiesGroupedByCategory)
            {
                var category = new SpecialtyByCategoryDto
                {
                    CategoryId = group.Key.CategoryId,
                    CategoryName = group.Key.CategoryName,
                    Specialties = new List<SpecialtyAloneDto>()
                };
                specialtiesByCategory.Add(category);
                foreach (var spl in group)
                {
                    category.Specialties.Add(new SpecialtyAloneDto
                    {
                        SpecialtyId = spl.SpecialtyId,
                        SpecialtyName = spl.SpecialtyName
                    });
                }
            }

            return Ok(specialtiesByCategory);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching all specialties: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Create new specialty
    /// </summary>
    /// <param name="specialty">New Specialty</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>Newly created specialty</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Create([FromBody] SpecialtyDto specialty,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            var createdSpecialty = await _service.Create(specialty);
            return CreatedAtAction(nameof(Get), new { Id = createdSpecialty.SpecialtyId }, createdSpecialty);
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning creating new specialty: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning creating new specialty: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new specialty: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Update a specialty
    /// </summary>
    /// <param name="id">ID</param>
    /// <param name="specialty">Specialty</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>None</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Update(int id, [FromBody] SpecialtyDto specialty,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            await _service.Update(id, specialty);
            return Ok();
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning updating a specialty: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning updating a specialty: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning updating a specialty: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating a specialty: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get specialty by id
    /// </summary>
    /// <param name="id">Specialty ID</param>
    /// <returns>Specialty</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Get(int id)
    {
        try
        {
            var specialty = await _service.GetById(id);
            if (specialty == null)
            {
                return NotFound(new { Message = "Specialty not found." });
            }

            return Ok(specialty);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning fetching a specialty: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching a specialty: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Delete specialty by id
    /// </summary>
    /// <param name="id">Specialty ID</param>
    /// <returns>None</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status400BadRequest),
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
            _logger.LogWarning(nex, "Warning deleting a specialty: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning deleting a specialty: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting a specialty: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }
}