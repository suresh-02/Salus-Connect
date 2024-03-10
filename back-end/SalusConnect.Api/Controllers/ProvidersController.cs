namespace SalusConnect.Api.Controllers;

[Authorize(Roles = "Administrator")]
[Route("[controller]")]
[ApiController]
[ApiVersion("1.0")]
[Produces("application/json")]
public class ProvidersController : ControllerBase
{
    private readonly IProviderService _service;
    private readonly ILogger<ProvidersController> _logger;

    public ProvidersController(IProviderService service, ILogger<ProvidersController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all providers
    /// </summary>
    /// <returns>Providers</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Get(int pageIndex = 0, int pageSize = 0, string search = null,
        string sortField = "ProviderName", string sortDirection = "asc")
    {
        try
        {
            var providers = await _service.GetAll(pageIndex, pageSize, search, sortField, sortDirection);
            return Ok(providers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching providers: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Activate or deactivate a provider
    /// </summary>
    /// <param name="id">Provider Id</param>
    /// <param name="model">Update Status Model</param>
    /// <returns>None</returns>
    [HttpPatch("{id:int}/[action]")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UpdateStatus(int id, UpdateStatusDto model)
    {
        try
        {
            await _service.UpdateStatus(id, model);
            return Ok();
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning updating status: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning updating status: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating status: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    // /// <summary>
    // /// Send invite to a provider
    // /// </summary>
    // /// <param name="id">Provider Id</param>
    // /// <param name="model">Send Invite Model</param>
    // /// <returns>None</returns>
    // [AllowAnonymous]
    // [HttpPost("{id:int}/[action]")]
    // [ProducesResponseType(StatusCodes.Status204NoContent),
    //  ProducesResponseType(StatusCodes.Status404NotFound),
    //  ProducesResponseType(StatusCodes.Status500InternalServerError)]
    // public async Task<ActionResult> SendInvite(int id, [FromBody] SendInviteDto model)
    // {
    //     try
    //     {
    //         //await _service.SendInvite(id, model);
    //         return Ok();
    //     }
    //     catch (NotFoundException nex)
    //     {
    //         _logger.LogWarning(nex, "Warning send invite: {Message}", nex.Message);
    //         return NotFound(new { nex.Message });
    //     }
    //     catch (BadRequestException brx)
    //     {
    //         _logger.LogWarning(brx, "Warning send invite: {Message}", brx.Message);
    //         return BadRequest(new { brx.Message });
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError(ex, "Error send invite: {Message}", ex.Message);
    //         return StatusCode(500, new { ex.Message });
    //     }
    // }

    ///// <summary>
    ///// Search specialties
    ///// </summary>
    ///// <returns>Specialties</returns>
    //[AllowAnonymous]
    //[HttpGet("specialties")]
    //[ProducesResponseType(StatusCodes.Status200OK),
    // ProducesResponseType(StatusCodes.Status401Unauthorized),
    // ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //public async Task<ActionResult> SearchSpecialties(string search)
    //{
    //    try
    //    {
    //        var specialties = await _service.SearchSpecialties(search);
    //        return Ok(specialties);
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error search specialties: {Message}", ex.Message);
    //        return StatusCode(500, new { ex.Message });
    //    }
    //}

    /// <summary>
    /// Search specialties or providers
    /// </summary>
    /// <returns>Specialties</returns>
    [AllowAnonymous]
    [HttpGet("specialties-or-providers")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> SearchSpecialtiesOrProviders(string search)
    {
        try
        {
            var specialties = await _service.SearchSpecialtiesOrProviders(search);
            return Ok(specialties);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error search specialties: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Search cities
    /// </summary>
    /// <returns>Cities</returns>
    [AllowAnonymous]
    [HttpGet("locations")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> SearchLocations(string search = "") // locType = "city" or "postalcode"
    {
        //if (!locType.Equals("city", StringComparison.OrdinalIgnoreCase) &&
        //    locType.Equals("postalcode", StringComparison.OrdinalIgnoreCase))
        //{
        //    throw new ArgumentException("Location type can be either 'city' or 'postalcode'.");
        //}

        try
        {
            if (string.IsNullOrEmpty(search)) return Ok(Array.Empty<string>());
            bool isPostalCode = false;
            var caPostalCode = new System.Text.RegularExpressions.Regex("[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy][0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz]");
            // "[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy][0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz] ?[0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][0-9]"
            if (caPostalCode.IsMatch(search))
            {
                isPostalCode = true;
                if (!string.IsNullOrEmpty(search) && search.Length > 3)
                {
                    if (search[3] != ' ')
                        search = $"{search[..3]} {search[3..]}";
                }
            }
            var cities = await _service.SearchLocations(isPostalCode ? LocationType.PostalCode : LocationType.City, search);
            return Ok(cities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error search cities: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Search providers
    /// </summary>
    /// <returns>Providers</returns>
    [AllowAnonymous]
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Search(string specialty, string city, string state,
        DateTime? date, int? id)
    {
        try
        {
            var providers = await _service.SearchProviders(specialty, city, state, date, id);
            return Ok(providers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error search providers: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get provider slots by doctor id, treatment id and date
    /// </summary>
    /// <param name="id">Doctor Id</param>
    /// <param name="treatmentId">Treatment Id</param>
    /// <param name="date">Date</param>
    /// <returns>Slots</returns>
    [AllowAnonymous]
    [HttpGet("{id:int}/slots")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetSlots(int id, int treatmentId, DateTime? date)
    {
        try
        {
            var slots = await _service.GetProviderSlots(id, treatmentId, date);
            return Ok(slots);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning getting doctor slots: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting doctor slots: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get all treatments by doctor id
    /// </summary>
    /// <param name="id">Doctor Id</param>
    /// <returns>Treatments</returns>
    [AllowAnonymous]
    [HttpGet("{id:int}/treatments")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetTreatments(int id)
    {
        try
        {
            var treatments = await _service.GetTreatments(id);
            return Ok(treatments);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning getting doctor treatments: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting doctor treatments: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }
}