namespace SalusConnect.Api.Helpers;

public class DuplicateException : Exception
{
    public DuplicateException(string message) : base(message)
    {
    }
}