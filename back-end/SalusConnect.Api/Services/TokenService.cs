using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SalusConnect.Api.Services;

public interface ITokenService
{
    string BuildToken(UserDto user);

    JwtSecurityToken ValidateToken(string token);

    public string GenerateRefreshToken(string ipAddress);
}

public class TokenService : ITokenService
{
    private readonly AppSettings _appSettings;

    public TokenService(IOptions<AppSettings> options)
    {
        _appSettings = options.Value;
    }

    public string BuildToken(UserDto user)
    {
        //var claims = new[] {
        //    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
        //    // new Claim(ClaimTypes.Email, user.EmailAddress),
        //    // new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
        //    new Claim(ClaimTypes.Role, user.Role.RoleName)
        //};

        // generate token that is valid for 1 day
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.JwtTokenConfig.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _appSettings.JwtTokenConfig.Issuer,
            Audience = _appSettings.JwtTokenConfig.Audience,
            Subject = new ClaimsIdentity(new[] { new Claim("id", user.UserId.ToString()), new Claim("role", user.Role.RoleName) }),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);

        //var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JwtTokenConfig.Secret));
        //var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
        //var tokenDescriptor = new JwtSecurityToken(_appSettings.JwtTokenConfig.Issuer,
        //    _appSettings.JwtTokenConfig.Audience, claims,
        //    expires: DateTime.Now.AddDays(1), signingCredentials: credentials);
        //return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    public JwtSecurityToken ValidateToken(string token)
    {
        //var mySecret = Encoding.UTF8.GetBytes(_appSettings.JwtTokenConfig.Secret);
        //var mySecurityKey = new SymmetricSecurityKey(mySecret);
        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            tokenHandler.ValidateToken(token,
                new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _appSettings.JwtTokenConfig.Issuer,
                    ValidAudience = _appSettings.JwtTokenConfig.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JwtTokenConfig.Secret)), //mySecurityKey,
                    ClockSkew = TimeSpan.Zero //TimeSpan.FromMinutes(1)
                }, out SecurityToken validatedToken);

            return (JwtSecurityToken)validatedToken;
        }
        catch
        {
            return null;
        }
    }

    public string GenerateRefreshToken(string ipAddress)
    {
        // generate token that is valid for 7 days
        using var rngCryptoServiceProvider = RandomNumberGenerator.Create(); //new RNGCryptoServiceProvider();
        var randomBytes = new byte[64];
        rngCryptoServiceProvider.GetBytes(randomBytes);
        //var refreshToken = new RefreshToken
        //{
        //    Token = Convert.ToBase64String(randomBytes),
        //    Expires = DateTime.UtcNow.AddDays(7),
        //    Created = DateTime.UtcNow,
        //    CreatedByIp = ipAddress
        //};

        return Convert.ToBase64String(randomBytes);
    }
}