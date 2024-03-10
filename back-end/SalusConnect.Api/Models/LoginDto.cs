namespace SalusConnect.Api.Models;

public class LoginDto
{
    public string EmailAddress { get; set; }
    public string Password { get; set; }
    public bool RememberMe { get; set; }
}