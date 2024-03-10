namespace SalusConnect.Api.Models;

public class UserDto
{
    public UserDto()
    {
        Status = UserStatus.Inactive;
    }

    //[Required]
    //[Range(1, int.MaxValue, ErrorMessage = "{0} should be between {1} and {2}")]
    public int UserId { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string LastName { get; set; }

    [Required]
    [StringLength(15, MinimumLength = 10, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string PhoneNumber { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(100, MinimumLength = 5, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string EmailAddress { get; set; }

    public string Password { get; set; }

    [JsonIgnore]
    public string PasswordSalt { get; set; }

    [JsonIgnore]
    public string PasswordHash { get; set; }

    [JsonIgnore]
    public RoleEnum RoleId { get; set; }

    public RoleDto Role { get; set; }

    public string ImageUrl { get; set; }

    [JsonIgnore]
    public string ConfirmEmailCode { get; set; }

    [JsonIgnore]
    public string ResetPasswordCode { get; set; }

    [JsonIgnore]
    public bool IsEmailConfirmed { get; set; }

    public UserStatus Status { get; set; }

    [JsonIgnore]
    public string StatusString
    {
        get => Status.ToString();
        set => Status = (UserStatus)Enum.Parse(typeof(UserStatus), value, true);
    }

    public string FullName => $"{FirstName} {LastName}";
}


public class UpdateStatusDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "{0} should be between {1} and {2}")]
    public int Id { get; set; }

    [Required]
    public ProviderType ProviderType { get; set; }

    [Required]
    public UserStatus Status { get; set; }
}

public class SendInviteDto
{
    public int? Id { get; set; }
    public string EmailAddress { get; set; }

    [Required]
    public ProviderType ProviderType { get; set; }
}

public class ConfirmEmailDto
{
    public string EmailAddress { get; set; }

    [JsonIgnore]
    public int Id { get; set; }

    public string ConfirmEmailCode { get; set; }
}

public class ForgotPasswordDto
{
    public int? Id { get; set; }
    public string EmailAddress { get; set; }
}

public class ChangePasswordDto
{
    [Required]
    public string EmailAddress { get; set; }

    public string ResetPasswordCode { get; set; }

    [Required]
    [StringLength(15, MinimumLength = 5, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string Password { get; set; }

    [JsonIgnore]
    public int Id { get; set; }

    [JsonIgnore]
    public string PasswordSalt { get; set; }

    [JsonIgnore]
    public string PasswordHash { get; set; }
}

public class ProfileImageDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "{0} should be between {1} and {2}")]
    public int UserId { get; set; }

    public string ImageUrl { get; set; }
}

public class UserProfileDto
{
    [Required]
    [StringLength(15, MinimumLength = 10, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string PhoneNumber { get; set; }
}

public enum UserStatus
{
    Inactive,
    Published,
    Invited,
    Active
}