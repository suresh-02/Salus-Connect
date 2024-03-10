namespace SalusConnect.Api.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
[ApiVersion("1.0")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;
    private readonly ITokenService _tokenService;
    private readonly ILogger<UsersController> _logger;
    //private readonly AppSettings _settings;

    public UsersController(IUserService service,
        ITokenService tokenService, ILogger<UsersController> logger)
    {
        _service = service;
        _tokenService = tokenService;
        _logger = logger;
    }

    /// <summary>
    /// Login
    /// </summary>
    /// <param name="model"></param>
    /// <returns>Token</returns>
    [AllowAnonymous]
    [HttpPost("[action]")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status400BadRequest),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Authenticate([FromBody] LoginDto model)
    {
        try
        {
            var (user, facility) = await _service.Authenticate(model);

            if (user == null)
            {
                return BadRequest(new { Message = "Email and/or password is incorrect." });
            }

            string token = _tokenService.BuildToken(user);
            string refreshToken = _tokenService.GenerateRefreshToken(IpAddress());
            SetTokenCookies(token, refreshToken);       // CryptoHelper.EncryptString(token, _appSettings.CryptoKey)
            return Ok(new { user, token, facility });
        }
        catch (UnauthorizedAccessException uax)
        {
            _logger.LogWarning(uax, "Warning authenticating an user: {Message}", uax.Message);
            return Unauthorized(new { uax.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning authenticating an user: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error authenticating an user: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    ///// <summary>
    ///// Get all users
    ///// </summary>
    ///// <returns>Users</returns>
    //[HttpGet()]
    //[ProducesResponseType(StatusCodes.Status200OK),
    //    ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //public async Task<ActionResult> Get()
    //{
    //    try
    //    {
    //        var users = await _service.GetAll();
    //        return Ok(users);
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error fetching users: {Message}", ex.Message);
    //        return StatusCode(500, new { ex.Message });
    //    }
    //}

    ///// <summary>
    ///// Register new user
    ///// </summary>
    ///// <param name="user">New User</param>
    ///// <param name="apiBehaviorOptions"></param>
    ///// <returns>Newly registered user</returns>
    //[AllowAnonymous]
    //[HttpPost("[action]")]
    //[ProducesResponseType(StatusCodes.Status201Created),
    //    ProducesResponseType(StatusCodes.Status400BadRequest),
    //    ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //public async Task<ActionResult> Register([FromBody] UserDto user,
    //    [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    //{
    //    try
    //    {
    //        // user.RoleId = (int)RoleEnum.Patient;
    //        var createdUser = await _service.Create(user);
    //        return CreatedAtAction(nameof(Get), new { Id = createdUser.UserId }, createdUser);
    //    }
    //    catch (DuplicateException dex)
    //    {
    //        _logger.LogWarning(dex, "Warning creating new user: {Message}", dex.Message);
    //        foreach (var k in dex.Data.Keys)
    //        {
    //            ModelState.AddModelError(k.ToString(), dex.Data[k].ToString());
    //        }

    //        return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
    //    }
    //    catch (BadRequestException brx)
    //    {
    //        _logger.LogWarning(brx, "Warning creating new user: {Message}", brx.Message);
    //        return BadRequest(new { brx.Message });
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error creating new user: {Message}", ex.Message);
    //        return StatusCode(500, new { ex.Message });
    //    }
    //}

    ///// <summary>
    ///// Update an user
    ///// </summary>
    ///// <param name="id">User ID</param>
    ///// <param name="user">User</param>
    ///// <param name="apiBehaviorOptions"></param>
    ///// <returns>None</returns>
    //[HttpPut("{id:int}")]
    //[ProducesResponseType(StatusCodes.Status204NoContent),
    //    ProducesResponseType(StatusCodes.Status400BadRequest),
    //    ProducesResponseType(StatusCodes.Status404NotFound),
    //    ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //public async Task<ActionResult> Update(int id, [FromBody] UserDto user,
    //    [FromServices] IOptions<ApiBehaviorOptions> apiBehaviorOptions)
    //{
    //    try
    //    {
    //        await _service.Update(id, user);
    //        return NoContent();
    //    }
    //    catch (DuplicateException dex)
    //    {
    //        _logger.LogWarning(dex, "Warning creating new user: {Message}", dex.Message);
    //        foreach (var k in dex.Data.Keys)
    //            ModelState.AddModelError(k.ToString(), dex.Data[k].ToString());
    //        return (ActionResult)apiBehaviorOptions.Value.InvalidModelStateResponseFactory(ControllerContext);
    //    }
    //    catch (NotFoundException nex)
    //    {
    //        _logger.LogWarning(nex, "Warning updating an user: {Message}", nex.Message);
    //        return NotFound(new { nex.Message });
    //    }
    //    catch (BadRequestException brx)
    //    {
    //        _logger.LogWarning(brx, "Warning updating an user: {Message}", brx.Message);
    //        return BadRequest(new { brx.Message });
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error updating an user: {Message}", ex.Message);
    //        return StatusCode(500, new { ex.Message });
    //    }
    //}

    /// <summary>
    /// Get user by id
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Get(int id)
    {
        try
        {
            var user = await _service.GetById(id);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            return Ok(user);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning fetching an user: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching an user: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Send invite
    /// </summary>
    /// <param name="sendInvite">Send Invite Model</param>
    /// <returns>None</returns>
    [AllowAnonymous]
    [HttpPost("[action]")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> SendInvite([FromBody] SendInviteDto sendInvite)
    {
        try
        {
            UserDto user;
            if (sendInvite.Id.HasValue)
                user = await _service.GetById(sendInvite.Id.Value);
            else
                user = await _service.GetByEmail(sendInvite.EmailAddress);

            if (user == null)
            {
                return NotFound("User not found");
            }

            await _service.SendInvite(user);
            return Ok();
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning send invite: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning send invite: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error send invite: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Confirm email
    /// </summary>
    /// <param name="model">Confirm Email Model</param>
    /// <returns>None</returns>
    [AllowAnonymous]
    [HttpPatch("[action]")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> ConfirmEmail(ConfirmEmailDto model)
    {
        try
        {
            var user = await _service.ConfirmEmail(model);
            return Ok(user);
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning verify email: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning verify email: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verify email: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Forgot password
    /// </summary>
    /// <param name="forgotPassword"></param>
    /// <returns>None</returns>
    [AllowAnonymous]
    [HttpPost("[action]")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status404NotFound),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPassword)
    {
        try
        {
            // var baseUrl = $"{Request.Scheme}://{Request.Host}{Url.Content("~/")}";
            await _service.ForgotPassword(forgotPassword.EmailAddress);
            return Ok();
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning forgot password: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning forgot password: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error forgot password: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Change password
    /// </summary>
    /// <param name="model">Change Password Model</param>
    /// <returns>None</returns>
    [AllowAnonymous]
    [HttpPatch("[action]")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> ChangePassword(ChangePasswordDto model)
    {
        try
        {
            await _service.ChangePassword(model);
            return Ok();
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning changing password: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning changing password: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Is Email Available
    /// </summary>
    /// <param name="email">Email</param>
    /// <param name="userId">UserId for editing</param>
    /// <returns>None</returns>
    [AllowAnonymous]
    [HttpGet("[action]")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> IsEmailAvailable(string email, int? userId = null)
    {
        try
        {
            bool isAvailable = await _service.IsEmailAvailable(email, userId);
            return Ok(new { isAvailable });
        }
        catch (NotFoundException nex)
        {
            _logger.LogWarning(nex, "Warning check email availability: {Message}", nex.Message);
            return NotFound(new { nex.Message });
        }
        catch (BadRequestException brx)
        {
            _logger.LogWarning(brx, "Warning check email availability: {Message}", brx.Message);
            return BadRequest(new { brx.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error check email availability: {Message}", ex.Message);
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Is Phone Available
    /// </summary>
    /// <param name="phone">Phone</param>
    /// <param name="userId">UserId for editing</param>
    /// <returns>None</returns>
    [AllowAnonymous]
    [HttpGet("[action]")]
    [ProducesResponseType(StatusCodes.Status204NoContent),
     ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> IsPhoneAvailable(string phone, int? userId = null)
    {
        try
        {
            bool isAvailable = await _service.IsPhoneAvailable(phone, userId);
            return Ok(new { isAvailable });
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
    /// Upload profile image
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns></returns>
    [HttpPost("{id:int}/[action]"), DisableRequestSizeLimit]
    public async Task<IActionResult> UploadImage(int id /*, [FromServices] IWebHostEnvironment env*/)
    {
        try
        {
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files[0];

            if (file.Length <= 0) return BadRequest();
            //var folderName = Path.Combine("Resources", "Images");
            //var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            //string profileImagePath = $"{_settings.AmazonS3Url}";
            //string pathToSave = $"{env.ContentRootPath}/{profileImagePath}";

            string imageUrl = await _service.UploadProfileImage(id, file);
            return Ok(new { imageUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { ex.Message });
        }
    }

    /// <summary>
    /// Remove profile image
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns></returns>
    [HttpDelete("{id:int}/[action]")]
    public async Task<IActionResult> RemoveImage(int id)

    {
        try
        {
            await _service.RemoveProfileImage(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { ex.Message });
        }
    }

    ///// <summary>
    ///// Activate or deactivate an user
    ///// </summary>
    ///// <param name="model">Update Status Model</param>
    ///// <returns>None</returns>
    //[Authorize(Roles = Roles.Administrator)]
    //[HttpPatch("[action]")]
    //[ProducesResponseType(StatusCodes.Status204NoContent),
    //    ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //public async Task<ActionResult> UpdateStatus(UpdateStatusDto model)
    //{
    //    try
    //    {
    //        await _service.UpdateStatus(model.Id, model.Status);
    //        return Ok();
    //    }
    //    catch (NotFoundException nex)
    //    {
    //        _logger.LogWarning(nex, "Warning updating status: {Message}", nex.Message);
    //        return NotFound(new { nex.Message });
    //    }
    //    catch (BadRequestException brx)
    //    {
    //        _logger.LogWarning(brx, "Warning updating status: {Message}", brx.Message);
    //        return BadRequest(new { brx.Message });
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error updating status: {Message}", ex.Message);
    //        return StatusCode(500, new { ex.Message });
    //    }
    //}

    #region Private methods

    private void SetTokenCookies(string token, string refreshToken)
    {
        // append cookie with token and refresh token to the http response
        Response.Cookies.Append("token", token, new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(1),
            SameSite = SameSiteMode.Strict,
            Secure = true
        });
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            SameSite = SameSiteMode.Strict,
            Secure = true
        });
    }

    private string IpAddress()
    {
        // get source ip address for the current request
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            return Request.Headers["X-Forwarded-For"];
        }

        return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();
    }

    #endregion Private methods
}