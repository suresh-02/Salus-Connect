namespace SalusConnect.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
[ApiVersion("1.0")]
[Produces("application/json")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;
    private readonly ILogger<DoctorsController> _logger;

    public PatientsController(IPatientService service, ILogger<DoctorsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Create new patient
    /// </summary>
    /// <param name="patient">Register new patient</param>
    /// <param name="apiBehaviorOptions"></param>
    /// <returns>Newly created patient</returns>
    [AllowAnonymous]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Register([FromBody] PatientDto patient,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            var createdPatient = await _service.Register(patient, false);
            return CreatedAtAction(nameof(Get), new { Id = createdPatient.UserId }, createdPatient);
        }
        catch (DuplicateException dex)
        {
            _logger.LogWarning(dex, "Warning creating new patient: {Message}", dex.Message);
            foreach (var k in dex.Data.Keys)
            {
                ModelState.AddModelError(k.ToString() ?? string.Empty, dex.Data[k]?.ToString() ?? string.Empty);
            }

            return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning creating new patient: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating new patient: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Get patient by id
    /// </summary>
    /// <param name="id">Patient ID</param>
    /// <returns>Patient</returns>
    [Authorize(Roles = Roles.Administrator + "," + Roles.Patient)]
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Get(int id)
    {
        try
        {
            var patient = await _service.GetById(id);
            if (patient == null)
            {
                return NotFound(new { Message = "Patient not found." });
            }

            return Ok(patient);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning fetching a patient: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching a patient: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Update patient address
    /// </summary>
    /// <param name="id">Patient ID</param>
    /// <param name="model">Address</param>
    /// <returns>OK</returns>
    [Authorize(Roles = Roles.Patient)]
    [HttpPut("{id:int}/addresses")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status422UnprocessableEntity),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UpdateAddress([FromRoute] int id, [FromBody] AddressDto model)
    {
        try
        {
            var address = await _service.UpdateAddress(id, model);
            return Ok(address);
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning updating patient address: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating patient address: {Message}", ex.Message);
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
    public async Task<ActionResult> BookAppointment(int id, [FromBody] AppointmentRequestDto appointment,
        [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    {
        try
        {
            var createdAppointment = await _service.BookAppointment(id, appointment, true);
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

    /// <summary>
    /// Get all appointments by patient id
    /// </summary>
    /// <param name="id">Patient Id</param>
    /// <returns>Appointments</returns>
    [Authorize(Roles = Roles.Administrator + "," + Roles.Patient)]
    [HttpGet("{id:int}/appointments")]
    [ProducesResponseType(StatusCodes.Status201Created),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetAppointments(int id)
    {
        try
        {
            var appointments = await _service.GetAppointments(id);
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
    /// Get all patients
    /// </summary>
    /// <returns>Patients</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status401Unauthorized),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetAll(int pageIndex = 0, int pageSize = 0, string search = null,
        string sortField = "FirstName", string sortDirection = "asc")
    {
        try
        {
            var patients = await _service.GetAll(pageIndex, pageSize, search, sortField, sortDirection);
            return Ok(patients);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching patients: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Activate or deactivate a patient
    /// </summary>
    /// <param name="id">Patient Id</param>
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

    ///// <summary>
    ///// Get notification count by patient id
    ///// </summary>
    ///// <param name="id">Patient ID</param>
    ///// <returns>Notification count</returns>
    //[Authorize(Roles = Roles.Administrator + "," + Roles.Patient)]
    //[HttpGet("{id:int}/notifications/count")]
    //[ProducesResponseType(StatusCodes.Status200OK),
    //    ProducesResponseType(StatusCodes.Status404NotFound),
    //    ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //public async Task<ActionResult> GetNotificationCount(int id)
    //{
    //    try
    //    {
    //        int notificationCount = await _service.GetNotificationCount(id);
    //        return Ok(new { id, notificationCount });
    //    }
    //    catch (NotFoundException nex)
    //    {
    //        _logger.LogWarning(nex, "Warning fetching a patient's notification count: " + nex.Message);
    //        return NotFound(new { nex.Message });
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error fetching a patient's notification count: " + ex.Message);
    //        return StatusCode(500, new { ex.Message });
    //    }
    //}

    ///// <summary>
    ///// Mark as read notifications by patient id
    ///// </summary>
    ///// <param name="id">Patient ID</param>
    ///// <returns>None</returns>
    //[Authorize(Roles = Roles.Administrator + "," + Roles.Patient)]
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
    //        _logger.LogWarning(nex, "Warning fetching a patient's mark as read notifications: " + nex.Message);
    //        return NotFound(new { nex.Message });
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error fetching a patient's mark as read notifications: " + ex.Message);
    //        return StatusCode(500, new { ex.Message });
    //    }
    //}
}