namespace SalusConnect.Api.Helpers;

public class AppSettings
{
    public ConnectionStrings ConnectionStrings { get; set; }
    public string[] CorsOrigins { get; set; }
    public JwtTokenConfig JwtTokenConfig { get; set; }

    public RedisCache RedisCache { get; set; }
    //public string DatabaseNamespace { get; set; }
    //public string ImagePath { get; set; }
    //public string ImageUrl { get; set; }

    public AmazonS3 AmazonS3 { get; set; }
    public string CryptoKey { get; set; }
    public string DefaultPassword { get; set; }
    public MailSettings MailSettings { get; set; }
    public string BaseUrl { get; set; }
}

public class ConnectionStrings
{
    public string DefaultConnection { get; set; }
}

public class JwtTokenConfig
{
    public string Secret { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
    //public int AccessTokenExpiration { get; set; }
    //public int RefreshTokenExpiration { get; set; }
}

public class RedisCache
{
    public string InstanceName { get; set; }
    public string HostAndPort { get; set; }
}

public class AmazonS3
{
    public string AccessKeyId { get; set; }
    public string SecretAccessKey { get; set; }
    public string BucketName { get; set; }
    public string ImagesDirectory { get; set; }
}

public class MailSettings
{
    public string FromEmail { get; set; }
    public string DisplayName { get; set; }
    public string Host { get; set; }
    public int Port { get; set; }
    public string Password { get; set; }
}