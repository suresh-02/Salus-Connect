namespace SalusConnect.Api.Helpers;

public static class ImageHelpers
{
    public static string BytearrayToBase64(byte[] input)
    {
        return input == null ? null : Convert.ToBase64String(input);
    }

    public static byte[] Base64ToBytearray(string input)
    {
        return input == null ? null : Convert.FromBase64String(input);
    }
}