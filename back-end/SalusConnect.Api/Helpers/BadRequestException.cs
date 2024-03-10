namespace SalusConnect.Api.Helpers;

public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message)
    {
    }
}