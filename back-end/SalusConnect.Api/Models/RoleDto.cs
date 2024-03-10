namespace SalusConnect.Api.Models;

public class RoleDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "{0} should be between {1} and {2}")]
    public int RoleId { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 5, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string RoleName { get; set; }

    public bool IsActive { get; set; } = true;
}

public static class Roles
{
    public const string Administrator = "Administrator";
    public const string Doctor = "Doctor";
    public const string Patient = "Patient";
    public const string Guest = "Guest";
}

public enum RoleEnum
{
    Unknown,
    Guest = 1,
    Patient = 21,
    Doctor = 41,
    Administrator = 161
}