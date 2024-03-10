using System.IO;

namespace SalusConnect.Api.Services;

public interface IUserService
{
    Task<(UserDto, FacilityInfoDto)> Authenticate(LoginDto model);

    Task<UserDto> Create(IDbConnection conn, UserDto user);

    Task Update(IDbConnection conn, int id, UserDto user);

    // Task<UserDto> Create(UserDto user);
    // Task Update(int id, UserDto user);
    // Task Delete(IDbConnection conn, int id);

    Task<UserDto> GetById(int id);

    Task<UserDto> GetByEmail(string email);

    Task<UserDto> GetByEmail(IDbConnection conn, string email);

    Task SendInvite(IDbConnection conn, UserDto user);

    Task SendInvite(UserDto user);

    Task SendInvite(IDbConnection conn, int userId, SendInviteDto model);

    Task<UserDto> ConfirmEmail(ConfirmEmailDto model);

    Task ForgotPassword(string email);

    Task ChangePassword(ChangePasswordDto model);

    Task UpdateStatus(int id, UserStatus status);

    Task<bool> IsEmailAvailable(string email, int? userId = null);

    Task<bool> IsPhoneAvailable(string phone, int? userId = null);

    Task UpdateProfile(IDbConnection conn, int id, UserProfileDto profile);

    Task<string> UploadProfileImage(int id, IFormFile formFile);

    Task RemoveProfileImage(int id);
}

public class UserService : IUserService
{
    private readonly IDatabaseHelper _db;
    private readonly IEmailService _emailService;
    private readonly IAmazonS3Service _amazonS3Service;
    private readonly AppSettings _settings;

    public UserService(IDatabaseHelper db, IEmailService emailService, IAmazonS3Service amazonS3Service,
        IOptions<AppSettings> options)
    {
        _db = db;
        _emailService = emailService;
        _amazonS3Service = amazonS3Service;
        _settings = options.Value;
    }

    public async Task<(UserDto, FacilityInfoDto)> Authenticate(LoginDto model)
    {
        UserDto user = await GetByEmail(model.EmailAddress);
        if (user == null)
        {
            return (null, null);
        }
        if (!PasswordStorage.VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
        {
            return (null, null);
        }
        if (!user.IsEmailConfirmed)
        {
            throw new BadRequestException(
                "Your email is not verified. Please check your email and follow the instructions or contact administrator.");
        }

        // ReSharper disable once SwitchStatementHandlesSomeKnownEnumValuesWithDefault
        switch (user.Status)
        {
            case UserStatus.Inactive:
                throw new BadRequestException(
                    "Your account is in Inactive state. Please contact administrator.");
            case UserStatus.Published:
                throw new BadRequestException(
                    "Your account is published, but login restricted. Please contact administrator.");
            case UserStatus.Invited:
                throw new BadRequestException(
                    "Invitation email already sent, please follow the instructions or contact administrator.");
            case UserStatus.Active:
                break;

                //default:
                //    throw new ArgumentOutOfRangeException();
        }

        var facility = await GetFacilityInfo(user.UserId, user.RoleId);

        return (user, facility);
    }

    //public async Task<UserDto> Create(UserDto user)
    //{
    //    using (var conn = _db.Connect())
    //    {
    //        return await Create(conn, user);
    //    }
    //}

    public async Task<UserDto> Create(IDbConnection conn, UserDto user)
    {
        user.EmailAddress = user.EmailAddress.Trim().ToLower();
        user.PhoneNumber = user.PhoneNumber?.Trim().ToUpper();

        #region Check duplicate of email and phone

        var (existsEmail, errorEmail) = await ExistsEmail(conn, user.EmailAddress);
        var (existsPhone, errorPhone) = await ExistsPhone(conn, user.PhoneNumber);

        if (existsEmail || existsPhone)
        {
            var e = new DuplicateException("Duplicate values are found in email/phone.");
            if (existsEmail)
            {
                e.Data.Add("Email", errorEmail);
            }

            if (existsPhone)
            {
                e.Data.Add("Phone", errorPhone);
            }

            throw e;
        }

        #endregion Check duplicate of email and phone

        PasswordStorage.CreatePasswordHash(user.Password, out string passwordHash, out string passwordSalt);
        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;

        const string sql = @"
                INSERT INTO users (first_name, last_name, phone_number,
                    email_address, password_hash, password_salt, role_id, is_email_confirmed, status)
                VALUES(@FirstName, @LastName, @PhoneNumber,
                    @EmailAddress, @PasswordHash, @PasswordSalt, @RoleId, @IsEmailConfirmed, @StatusString::userstatus)
                RETURNING id;";
        // "SELECT fn_user_create(@FirstName, @LastName, @PhoneNumber, @EmailAddress, @PasswordHash, @PasswordSalt, @RoleId, @MiddleName, @StatusString);"
        int id = await conn.ExecuteScalarAsync<int>(sql, user);
        user.UserId = id;
        return user;
    }

    //public async Task Update(int id, UserDto user)
    //{
    //    using (var conn = _db.Connect())
    //    {
    //        if (!await IsIdExists(conn, id))
    //        {
    //            throw new NotFoundException("User is not found.");
    //        }

    //        await Update(conn, id, user);
    //    }
    //}

    public async Task Update(IDbConnection conn, int id, UserDto user)
    {
        if (id != user.UserId)
        {
            throw new BadRequestException("User Id is not match.");
        }
        var getUser = await GetById(conn, id);
        if (getUser == null)
        {
            throw new NotFoundException("User is not found.");
        }

        user.EmailAddress = user.EmailAddress.Trim().ToLower();
        user.PhoneNumber = user.PhoneNumber?.Trim().ToUpper();

        #region Check duplicate of email and phone

        var (existsEmail, errorEmail) = await ExistsEmail(conn, user.EmailAddress, id);
        var (existsPhone, errorPhone) = await ExistsPhone(conn, user.PhoneNumber, id);

        if (existsEmail || existsPhone)
        {
            var e = new DuplicateException("Duplicate values are found in email/phone.");
            if (existsEmail)
            {
                e.Data.Add("Email", errorEmail);
            }

            if (existsPhone)
            {
                e.Data.Add("Phone", errorPhone);
            }

            throw e;
        }

        #endregion Check duplicate of email and phone

        // "SELECT fn_user_update(@UserId, @FirstName, @LastName, @PhoneNumber, @EmailAddress, @MiddleName);"
        const string sql = @"
                UPDATE users SET first_name = @FirstName, last_name = @LastName,
                    phone_number = @PhoneNumber, email_address = @EmailAddress,
                    updated_at = now() at time zone 'Asia/Kolkata'
                WHERE id = @UserId;";
        await conn.ExecuteAsync(sql, user);
    }

    //public async Task Delete(IDbConnection conn, int id)
    //{
    //    await conn.ExecuteAsync("SELECT fn_user_delete(@id);", new { id });
    //}

    public async Task<UserDto> GetById(int id)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("User is not found.");
            }

            return await GetById(conn, id);
        }
    }

    public async Task<UserDto> GetById(IDbConnection conn, int id)
    {
        var users = await GetByInput(conn, id);
        if (users == null || !users.Any())
        {
            return null;
        }
        var user = users[0];
        if (user == null || user.UserId != id)
        {
            return null;
        }

        return user;
    }

    public async Task<UserDto> GetByEmail(string email)
    {
        using (var conn = _db.Connect())
        {
            return await GetByEmail(conn, email);
        }
    }

    public async Task<UserDto> GetByEmail(IDbConnection conn, string email)
    {
        var users = await GetByInput(conn, email);
        if (users == null || !users.Any())
        {
            // throw new BadRequestException("Email or password is incorrect.");
            return null;
        }
        var user = users[0];
        if (user == null || user.EmailAddress != email)
        {
            // throw new BadRequestException("Email or password is incorrect.");
            return null;
        }

        return user;
    }

    public async Task SendInvite(UserDto user)
    {
        using (var conn = _db.Connect())
        {
            await SendInvite(conn, user);
        }
    }

    public async Task SendInvite(IDbConnection conn, UserDto user)
    {
        string email = user.EmailAddress;
        string confirmCode = Guid.NewGuid().ToString().Replace("-", string.Empty);
        string loginUrl = $"{_settings.BaseUrl}/verify-email?email={email}&id={confirmCode}";
        string termsOfServiceUrl = $"{_settings.BaseUrl}/terms-of-service";
        string termsOfUseUrl = $"{_settings.BaseUrl}/terms-of-use";
        string privacyPolicyUrl = $"{_settings.BaseUrl}/privacy";

        string patientBody = $@"
                <p>Hey {user.FirstName},</p>
                <p>Welcome to SalusConnect! You are almost done.</p>
                <p>Click <a href='{loginUrl}'>here</a> to confirm your email address and start using SalusConnect to book your medical appointments.</p>
                <p>Alternately, copy and paste the URL below directly into your browser:<br>
                {loginUrl}</p>
                <p>By choosing to sign up on SalusConnect, you are agreeing to our <a href='{termsOfUseUrl}'>Terms of Use</a> and <a href='{privacyPolicyUrl}'>Privacy Policy</a>.</p>
                <p>Once again, we are so glad that you signed up. SalusConnect is transforming the way Canadians find and book medical appointments. We are adding more medical practitioners to the platform every week so that you are able to find them.</p>
                <p>We wish you the best of health. Always.</p>
                <p>SalusConnect Team</p>
                <p>Note: This is a system alert message. Please do not reply to this email.</p>";
        string doctorBody = $@"
	            <p>Dear {user.FirstName},</p>
	            <p>Welcome to SalusConnect! You’re receiving this email because your practice is ready to be setup on the SalusConnect platform.</p>
	            <p>Click <a href='{loginUrl}'>here</a> to confirm your email address and set a new password to start using SalusConnect for managing your medical appointments. Once you set your new password, you may login. Your user ID is always your email address on which you are receiving this registration email.</p>
	            <p>If you are unable to click on the link above, please copy and paste the URL below directly into your browser:<br>
	            {loginUrl}</p>
	            <p>By choosing to sign up on SalusConnect, you are agreeing to our <a href='{termsOfServiceUrl}'>Terms of Service</a>,
                    <a href='{termsOfUseUrl}'>Terms of Use</a> and <a href='{privacyPolicyUrl}'>Privacy Policy</a>.</p>
	            <p>Once again, we are so glad you are joining us. SalusConnect is transforming the way medical providers help Canadians find and book medical appointments.</p>
	            <p>Thank you for helping Canadians live healthier and better lives.</p>
	            <p>SalusConnect Team</p>
	            <p>Note: This is a system alert message. Please do not reply to this email.</p>";

        await _emailService.SendEmailAsync(new MailRequest
        {
            ToEmail = email,
            Subject = "Registration",
            Body = user.RoleId is RoleEnum.Doctor ? doctorBody : patientBody
        });

        const string sql = @"
                UPDATE users SET
                    confirm_email_code = @confirmCode,
                    status = 'Invited',
                    updated_at = now() at time zone 'Asia/Kolkata'
                WHERE id = @id;";
        await conn.ExecuteAsync(sql, new { id = user.UserId, confirmCode });
    }

    public async Task SendInvite(IDbConnection conn, int userId, SendInviteDto model)
    {
        var user = await GetById(conn, userId);
        await SendInvite(conn, user);
    }

    public async Task<UserDto> ConfirmEmail(ConfirmEmailDto model)
    {
        using (var conn = _db.Connect())
        {
            var user = await GetByEmail(model.EmailAddress);
            if (user == null || model.EmailAddress != user.EmailAddress || model.ConfirmEmailCode != user.ConfirmEmailCode)
            {
                throw new BadRequestException("Email and token does not match.");
            }
            model.Id = user.UserId;
            const string sql = @"
                    UPDATE users SET
                        is_email_confirmed = true,
                        status = 'Active',
                        updated_at = now() at time zone 'Asia/Kolkata'
                    WHERE id = @id;";
            await conn.ExecuteAsync(sql, new { id = model.Id });

            return user;
        }
    }

    public async Task ForgotPassword(string email)
    {
        var user = await GetByEmail(email);
        if (user == null)
        {
            throw new BadRequestException($"Email '{email}' is not valid one.");
        }
        if (user.Status != UserStatus.Active)
        {
            throw new BadRequestException("Your account is NOT in active state. Please contact administrator.");
        }
        string resetCode = Guid.NewGuid().ToString().Replace("-", string.Empty);

        using (var conn = _db.Connect())
        {
            const string sql = @"
                    UPDATE users SET
                        reset_password_code = @resetCode,
                        updated_at = now() at time zone 'Asia/Kolkata'
                    WHERE id = @id;";
            await conn.ExecuteAsync(sql, new { id = user.UserId, resetCode });
        }

        string resetPasswordUrl = $"{_settings.BaseUrl}/reset-password?email={email}&id={resetCode}";
        string body = $@"
                Hey <strong>{user.FirstName}</strong>,<br>
                <br>
                Greetings from SalusConnect!<br>
                <br>
                You have requested to reset your password.<br>
                Click <a href='{resetPasswordUrl}'>here</a> to change the password.<br>
                <br>
                Alternately you can use below URL directly in browser.<br>
                <a href='{resetPasswordUrl}'>{resetPasswordUrl}</a><br>
                <br>
                Thanks,<br>
                SalusConnect Team<br>
                <br>
                Note: This is a system alert message. Please do not reply to this email.<br>
                ";
        await _emailService.SendEmailAsync(new MailRequest
        {
            ToEmail = email,
            Subject = "Reset password",
            Body = body
        });
    }

    public async Task ChangePassword(ChangePasswordDto model)
    {
        using (var conn = _db.Connect())
        {
            var user = await GetByEmail(model.EmailAddress);
            if (user == null || model.EmailAddress != user.EmailAddress ||
                model.ResetPasswordCode != user.ResetPasswordCode && model.ResetPasswordCode != user.ConfirmEmailCode)
            {
                throw new BadRequestException("Email and token does not match.");
            }
            model.Id = user.UserId;
            PasswordStorage.CreatePasswordHash(model.Password, out string passwordHash, out string passwordSalt);
            model.PasswordHash = passwordHash;
            model.PasswordSalt = passwordSalt;

            const string sql = @"
                    UPDATE users SET
                        password_hash = @PasswordHash,
                        password_salt = @PasswordSalt,
			            reset_password_code = NULL,
			            updated_at = now() at time zone 'Asia/Kolkata'
		            WHERE id = @Id;";
            await conn.ExecuteAsync(sql, model);

            // if (user.RoleId is RoleEnum.Doctor)
            // {
            //     await SendChangePasswordMail(user);
            // }
        }
    }

    private async Task SendChangePasswordMail(UserDto user)
    {
        string body = $@"
                Dear {user.FirstName},<br>
                <p>Welcome onboard! You’re all set. If you haven’t already, log into <u>your account</u> now to set up your calendar availability.
                Or, if applicable, request a member of your staff to do.</p>

                <p>SalusConnect does all the heavy lifting for you when it comes to managing your appointments.</p>

                <p>Once again, we are so glad you joined us. If you have a question, please send an email to support@salusconnect.ca or reach out to your Client Success manager.</p>

                <p>Thank you for helping Canadians live healthier and better lives. We are in your debt.</p>

                <p>SalusConnect Team</p>

                <p>Note: This is a system alert message. Please do not reply to this email.<p>";
        await _emailService.SendEmailAsync(new MailRequest
        {
            ToEmail = user.EmailAddress,
            Subject = "Password",
            Body = body
        });
    }

    /*
    <p>We’ll also be thrilled if you chose to join the <strong><i>1 for Canada pledge</i></strong> where for every 100 appointments you complete through SalusConnect,
    you pledge to provide a free 15 minute consultation to one underprivileged Canadian.
    All you need to do is to enable it in your Appointments module. The platform will do the rest.
    Our goal is to create at least 10,000 free appointments for some of the 4.9 million Canadians in need by the end of 2023. To read more, click here</p>
    */

    public async Task UpdateStatus(int id, UserStatus status)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("User is not found.");
            }
            const string sql = @"
                    UPDATE users SET
                        status = @status::userstatus,
                        updated_at = now() at time zone 'Asia/Kolkata'
                    WHERE id = @Id;";

            await conn.ExecuteAsync(sql, new { Id = id, Status = status.ToString() });
        }
    }

    public async Task<bool> IsEmailAvailable(string email, int? userId = null)
    {
        using (var conn = _db.Connect())
        {
            var (exists, _) = await ExistsEmail(conn, email, userId);
            return !exists;
        }
    }

    public async Task<bool> IsPhoneAvailable(string phone, int? userId = null)
    {
        using (var conn = _db.Connect())
        {
            var (exists, _) = await ExistsPhone(conn, phone, userId);
            return !exists;
        }
    }

    public async Task UpdateProfile(IDbConnection conn, int id, UserProfileDto profile)
    {
        await conn.ExecuteAsync("UPDATE users SET phone_number = @phoneNumber, updated_at = now() at time zone 'Asia/Kolkata' WHERE id = @id",
            new { id, phoneNumber = profile.PhoneNumber });
    }

    public async Task<string> UploadProfileImage(int id, IFormFile formFile)
    {
        using (var conn = _db.Connect())
        {
            string fileExtension = Path.GetExtension(System.Net.Http.Headers.ContentDispositionHeaderValue
                    .Parse(formFile.ContentDisposition).FileName?.Trim('"'))
                ?.ToLower();
            // Read profile image url from db
            string profileImageUrl = await conn.ExecuteScalarAsync<string>("SELECT image_url FROM users WHERE id = @id", new { id });
            string fileNameWithoutExt;
            if (string.IsNullOrEmpty(profileImageUrl))
            {
                fileNameWithoutExt = Guid.NewGuid().ToString();
            }
            else
            {
                //var uri = new Uri(profileImageUrl);
                fileNameWithoutExt = Path.GetFileNameWithoutExtension(profileImageUrl);
            }
            string fileName = $"{fileNameWithoutExt}{fileExtension}";
            //string dbPath = $"{imageUrl}/{fileNameWithoutExt}{fileExtension}";
            //string fullFilePath = $"{fullPath}/{fileNameWithoutExt}{fileExtension}";

            // Save file in physical location
            //Directory.CreateDirectory(fullPath);
            //await using (var stream = new FileStream(fullFilePath, FileMode.Create))
            //{
            //    await formFile.CopyToAsync(stream);
            //}

            string imageUrl = await _amazonS3Service.UploadProfileImage(formFile, fileName);

            // Update filename in user table
            await conn.ExecuteAsync("UPDATE users SET image_url=@imageUrl, updated_at = now() at time zone 'Asia/Kolkata' WHERE id = @id",
                new { id, imageUrl });

            return imageUrl;
        }
    }

    public async Task RemoveProfileImage(int id)
    {
        using (var conn = _db.Connect())
        {
            string profileImageUrl = await conn.ExecuteScalarAsync<string>("SELECT image_url FROM users WHERE id = @id",
                new { id });
            if (!string.IsNullOrEmpty(profileImageUrl))
            {
                //string fileName = Path.GetFileName(profileImageUrl);  //profileImageUrl.Replace(_settings.ImageUrl, _settings.ImagePath);
                //File.Delete(profileImagePath);
                await _amazonS3Service.DeleteFile(profileImageUrl.TrimStart("/"), String.Empty);

                await conn.ExecuteAsync("UPDATE users SET image_url = NULL, updated_at = now() at time zone 'Asia/Kolkata' WHERE id = @id",
                    new { id });
            }
        }
    }

    #region Private methods

    private static async Task<(bool, string)> ExistsEmail(IDbConnection conn, string email, int? userId = null)
    {
        string sql = "SELECT EXISTS(SELECT 1 FROM users WHERE email_address ILIKE @email";
        if (userId.HasValue)
        {
            sql += " AND id != @userId";
        }
        sql += " );";

        bool exists = await conn.ExecuteScalarAsync<bool>(sql, new { email, userId });

        return exists ? (true, $"Email '{email}' is already exists") : (false, string.Empty);
    }

    private static async Task<(bool, string)> ExistsPhone(IDbConnection conn, string phone, int? userId = null)
    {
        if (string.IsNullOrEmpty(phone))
        {
            return (false, string.Empty);
        }
        string sql = "SELECT EXISTS(SELECT 1 FROM users WHERE phone_number ILIKE @phone";
        if (userId.HasValue)
        {
            sql += " AND id != @userId";
        }
        sql += " );";

        bool exists = await conn.ExecuteScalarAsync<bool>(sql, new { phone, userId });

        return exists ? (true, $"Phone '{phone}' is already exists") : (false, string.Empty);
    }

    private async Task<FacilityInfoDto> GetFacilityInfo(int userId, RoleEnum role)
    {
        if (role != RoleEnum.Doctor)
            return null;

        const string facilityDoctorSql = @"
            SELECT f.id AS FacilityId, f.facility_name AS FacilityName, f.facility_type AS FacilityType
            FROM doctors d
            INNER JOIN facilities f ON d.facility_id = f.id
            WHERE d.user_id = @userId;";
        const string facilityStaffSql = @"
            SELECT f.id AS FacilityId, f.facility_name AS FacilityName, f.facility_type AS FacilityType
            FROM staff s
            INNER JOIN facilities f ON s.facility_id = f.id
            WHERE s.user_id = @userId;";

        using (var conn = _db.Connect())
        {
            var facility = await conn.QueryFirstOrDefaultAsync<FacilityInfoDto>(
                role == RoleEnum.Doctor ? facilityDoctorSql : facilityStaffSql,
                new { userId });
            return facility;
        }
    }

    private static async Task<UserDto[]> GetByInput(IDbConnection conn, dynamic input)
    {
        string sql = @"
                SELECT u.id AS UserId, u.first_name AS FirstName,
                    u.last_name AS LastName, u.phone_number AS PhoneNumber, u.email_address AS EmailAddress,
                    u.password_hash AS PasswordHash, u.password_salt AS PasswordSalt,
                    u.is_email_confirmed AS IsEmailConfirmed,
                    u.confirm_email_code AS ConfirmEmailCode, u.reset_password_code AS ResetPasswordCode,
                    u.status::varchar AS Status, u.image_url AS ImageUrl,
                    u.role_id AS RoleId, r.role_name AS RoleName
		        FROM users u
		        INNER JOIN roles r ON u.role_id = r.id";
        if (input is string)
            sql += " WHERE u.email_address = @input;";
        else
            sql += " WHERE u.id = @input;";

        var users = (await conn.QueryAsync<UserDto, RoleDto, UserDto>(sql, (user, role) =>
        {
            user.RoleId = (RoleEnum)role.RoleId;
            // user.RoleName = role.RoleName;
            user.Role = role;
            return user;
        }, new { input }, splitOn: "roleid")).ToArray();

        return users;
    }

    private static async Task<bool> IsIdExists(IDbConnection conn, int id)
    {
        bool found = await conn.ExecuteScalarAsync<bool>("SELECT EXISTS( SELECT 1 FROM users WHERE id = @id );", new { id });
        return found;
    }

    #endregion Private methods
}