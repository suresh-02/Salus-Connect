using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Text;

namespace SalusConnect.Api.Helpers;

public class PasswordStorage
{
    public static void CreatePasswordHash(string password, out string passwordHash, out string passwordSalt)
    {
        if (password == null || string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentNullException(nameof(password), "Password is required");
        }

        //if (string.IsNullOrWhiteSpace(password))
        //{
        //    throw new ArgumentException("Password cannot be empty or whitespace only string.", nameof(password));
        //}

        using (var hmac = new HMACSHA512())
        {
            passwordSalt = Convert.ToBase64String(hmac.Key);
            passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }
    }

    public static bool VerifyPasswordHash(string password, string base64Hash, string base64Salt)
    {
        if (password == null || string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentNullException(nameof(password), "Password is required");
        }

        //if (string.IsNullOrWhiteSpace(password))
        //{
        //    throw new ArgumentException("Password cannot be empty or whitespace only string.", nameof(password));
        //}

        var storedHash = Convert.FromBase64String(base64Hash);
        var storedSalt = Convert.FromBase64String(base64Salt);

        if (storedHash.Length != 64)
        {
            throw new ArgumentOutOfRangeException(nameof(password), "Password: Invalid length of password hash 64 bytes expected");
        }

        if (storedSalt.Length != 128)
        {
            throw new ArgumentOutOfRangeException(nameof(password), "Password: Invalid length of password salt 128 bytes expected");
        }

        using (var hmac = new HMACSHA512(storedSalt))
        {
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            if (computedHash.Where((t, i) => t != storedHash[i]).Any())
            {
                return false;
            }
        }

        return true;
    }

    /// <summary>
    /// Generates a Random Password
    /// respecting the given strength requirements.
    /// </summary>
    /// <param name="opts">A valid PasswordOptions object
    /// containing the password strength requirements.</param>
    /// <returns>A random password</returns>
    public static string GenerateRandomPassword(PasswordOptions opts = null)
    {
        opts ??= new PasswordOptions
        {
            RequiredLength = 8,
            RequiredUniqueChars = 4,
            RequireDigit = true,
            RequireLowercase = true,
            RequireNonAlphanumeric = true,
            RequireUppercase = true
        };

        string[] randomChars = {
            "ABCDEFGHJKLMNOPQRSTUVWXYZ",    // uppercase
            "abcdefghijkmnopqrstuvwxyz",    // lowercase
            "0123456789",                   // digits
            "!@$?_-"                        // non-alphanumeric
        };

        var rand = new Random(Environment.TickCount);
        var chars = new List<char>();

        if (opts.RequireUppercase)
            chars.Insert(rand.Next(0, chars.Count),
                randomChars[0][rand.Next(0, randomChars[0].Length)]);

        if (opts.RequireLowercase)
            chars.Insert(rand.Next(0, chars.Count),
                randomChars[1][rand.Next(0, randomChars[1].Length)]);

        if (opts.RequireDigit)
            chars.Insert(rand.Next(0, chars.Count),
                randomChars[2][rand.Next(0, randomChars[2].Length)]);

        if (opts.RequireNonAlphanumeric)
            chars.Insert(rand.Next(0, chars.Count),
                randomChars[3][rand.Next(0, randomChars[3].Length)]);

        for (int i = chars.Count; i < opts.RequiredLength
                                  || chars.Distinct().Count() < opts.RequiredUniqueChars; i++)
        {
            string rcs = randomChars[rand.Next(0, randomChars.Length)];
            chars.Insert(rand.Next(0, chars.Count),
                rcs[rand.Next(0, rcs.Length)]);
        }

        return new string(chars.ToArray());
    }
}