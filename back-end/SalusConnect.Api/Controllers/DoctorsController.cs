namespace SalusConnect.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
[ApiVersion("1.0")]
[Produces("application/json")]
public class DoctorsController : ControllerBase
{
    private readonly IDoctorService _service;
    private readonly IDoctorSlotService _slotService;
    private readonly ILogger<DoctorsController> _logger;

    public DoctorsController(IDoctorService service, IDoctorSlotService slotService,
        ILogger<DoctorsController> logger)
    {
        _service = service;
        _slotService = slotService;
        _logger = logger;
    }

    /// <summary>
    /// Create new doctor
    /// </summary>
    /// <param name="doctor">New Doctor</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>Newly created doctor</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Create([FromBody] IndividualDoctorDto doctor,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            var createdDoctor = await _service.Create(doctor);
            return CreatedAtAction(nameof(Get), new { Id = createdDoctor.UserId }, createdDoctor);
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning creating new doctor: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning creating new doctor: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new doctor: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Update a doctor
    /// </summary>
    /// <param name="id">ID</param>
    /// <param name="doctor">Doctor</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>None</returns>
    [Authorize(Roles = Roles.Administrator)]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Update(int id, [FromBody] IndividualDoctorDto doctor,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            await _service.Update(id, doctor);
            return Ok();
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning updating a doctor: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning updating a doctor: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning updating a doctor: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating a doctor: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get doctor by id
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <returns>Doctor</returns>
    [Authorize(Roles = Roles.Administrator + "," + "," + Roles.Doctor)]
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Get(int id)
    {
        try
        {
            var doctor = await _service.GetById(id);
            if (doctor == null)
            {
                return NotFound(new { Message = "Doctor not found." });
            }

            return Ok(doctor);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning fetching a doctor: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching a doctor: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Delete doctor by id
    /// </summary>
    /// <param name="id">Doctor ID</param>
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
            _logger.LogWarning(nex, "Warning deleting a doctor: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting a doctor: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Create doctor slot
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <param name="model">New Doctor Slot</param>
    /// <returns>Newly created doctor slot</returns>
    [Authorize(Roles = Roles.Doctor)]
    [HttpPost("{id:int}/slots")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> CreateSlot(int id, [FromBody] DoctorSlotDto model)
    {
        try
        {
            var slot = await _slotService.CreateSlot(id, model);
            return Ok(slot);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning creating new doctor slot: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new doctor slot: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Update doctor slot
    /// </summary>
    /// <param name="id"></param>
    /// <param name="slot">New Doctor Slot</param>
    /// <returns>Newly created doctor slot</returns>
    [Authorize(Roles = Roles.Doctor)]
    [HttpPut("{id:int}/slots")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UpdateSlot(int id, [FromBody] DoctorSlotDto slot)
    {
        try
        {
            await _slotService.UpdateSlot(id, slot);
            return Ok(slot);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning updating a doctor slot: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning updating a doctor slot: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating a doctor slot: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get doctor slot
    /// </summary>
    /// <param name="id">Doctor Id</param>
    /// <returns>Newly created doctor slot</returns>
    [Authorize(Roles = Roles.Doctor)]
    [HttpGet("{id:int}/slots")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetSlot(int id)
    {
        try
        {
            var slot = await _slotService.GetSlot(id);
            return Ok(slot);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning fetching a doctor slot: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning fetching a doctor slot: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching a doctor slot: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get all tags
    /// </summary>
    /// <returns>Tag string array</returns>
    [Authorize(Roles = Roles.Administrator + "," + Roles.Doctor)]
    [HttpGet("tags")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> AllTags()
    {
        try
        {
            string[] tags = await _service.GetAllTags();

            return Ok(new { tags });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching tags: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get all appointments by doctor id
    /// </summary>
    /// <param name="id">Doctor Id</param>
    /// <param name="from">Date from</param>
    /// <param name="to">Date To</param>
    /// <param name="pageIndex">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="search">Search text</param>
    /// <param name="status">Status</param>
    /// <param name="sortField">Sort field</param>
    /// <param name="sortDirection">Sort direction</param>
    /// <returns>Appointments</returns>
    [Authorize(Roles = Roles.Administrator + "," + Roles.Doctor + ",")]
    [HttpGet("{id:int}/appointments")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetAppointments(int id, DateTime? from, DateTime? to,
        int pageIndex = 0, int pageSize = 0, string search = null, string status = null,
        string sortField = null, string sortDirection = "asc")
    {
        try
        {
            var appointments = await _service.GetAppointments(id, from, to, pageIndex, pageSize, search, status, sortField, sortDirection);
            return Ok(appointments);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning getting appointments: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting appointments: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get notification count by doctor id
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <returns>Notification count</returns>
    [Authorize(Roles = Roles.Administrator + "," + Roles.Doctor + ",")]
    [HttpGet("{id:int}/notifications/count")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetNotificationCount(int id)
    {
        try
        {
            int notificationCount = await _service.GetNotificationCount(id);
            return Ok(new { id, notificationCount });
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning fetching a doctors' notification count: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching a doctors' notification count: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    ///// <summary>
    ///// Mark as read notifications by doctor id
    ///// </summary>
    ///// <param name="id">Doctor ID</param>
    ///// <returns>None</returns>
    //[Authorize(Roles = Roles.Administrator + "," + Roles.Doctor + "," + Roles.SupportStaff)]
    //[HttpPatch("{id:int}/notifications/mark-as-read")]
    //[ProducesResponseType(StatusCodes.Status200OK),
    //    ProducesResponseType(StatusCodes.Status404NotFound),
    //    ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //public async Task<ActionResult> MarkAsReadNotifications(int id)
    //{
    //    try
    //    {
    //        await _service.MarkAsReadNotification(id);
    //        return Ok();
    //    }
    //    catch (NotFoundException nex)
    //    {
    //        _logger.LogWarning(nex, "Warning fetching a doctor's mark as read notifications: " + nex.Message);
    //        return NotFound(new { nex.Message });
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error fetching a doctor's mark as read notifications: " + ex.Message);
    //        return StatusCode(500, new { ex.Message });
    //    }
    //}

    /// <summary>
    /// Update profile
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <param name="profile">Profile</param>
    /// <returns>None</returns>
    [HttpPatch("{id:int}/[action]")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UpdateProfile(int id, DoctorProfileDto profile)
    {
        try
        {
            await _service.UpdateProfile(id, profile);
            return Ok();
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning check phone availability: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning check phone availability: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error check phone availability: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Book an appointment
    /// </summary>
    /// <param name="id"></param>
    /// <param name="appointment">Appointment model</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>Newly created appointment</returns>
    // [Authorize(Roles = Roles.Administrator + "," + Roles.Patient)]
    [HttpPost("{id:int}/appointments")]
    [ProducesResponseType(StatusCodes.Status201Created),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> BookAppointment(int id, [FromBody] AppointmentByPhoneDto appointment,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            var createdAppointment = await _service.BookAppointment(id, appointment);
            return Ok(createdAppointment);
            //CreatedAtAction(nameof(Get), new { Id = createdAppointment.Id }, createdAppointment);
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning booking appointment: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning booking appointment: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error booking appointment: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }
}