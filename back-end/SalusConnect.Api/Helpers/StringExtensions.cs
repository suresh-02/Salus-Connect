namespace SalusConnect.Api.Helpers;

public static class StringExtensions
{
    public static string Between(this string target, string firstString, string lastString)
    {
        int pos1 = target.IndexOf(firstString, StringComparison.Ordinal) + firstString.Length;
        int pos2 = target.IndexOf(lastString, pos1, StringComparison.Ordinal);
        if (pos1 >= 0 && target.Length > pos1)
        {
            string finalString = target[pos1..pos2];
            return finalString;
        }

        return target;
    }

    public static string ToBase64(this string target)
    {
        byte[] plainTextBytes = System.Text.Encoding.UTF8.GetBytes(target);
        return Convert.ToBase64String(plainTextBytes);
    }

    public static string FromBase64(this string target)
    {
        byte[] encodedTextBytes = Convert.FromBase64String(target);
        return System.Text.Encoding.UTF8.GetString(encodedTextBytes);
    }

    public static string TrimStart(this string target, string trimString)
    {
        if (string.IsNullOrEmpty(trimString))
        {
            return target;
        }

        string result = target;
        while (result.StartsWith(trimString))
        {
            result = result[trimString.Length..];
        }

        return result;
    }

    public static string TrimEnd(this string target, string trimString)
    {
        if (string.IsNullOrEmpty(trimString))
        {
            return target;
        }

        string result = target;
        while (result.EndsWith(trimString))
        {
            result = result[..^trimString.Length];
        }

        return result;
    }
}