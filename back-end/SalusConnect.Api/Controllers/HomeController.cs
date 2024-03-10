namespace SalusConnect.Api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Produces("application/json")]
    public class HomeController : ControllerBase
    {
        private readonly AppSettings _settings;
        private readonly StripeOptions _stripeOptions;

        private const string AppName = "SalusConnect backend API";
        private readonly string AppVersion;
        private readonly string AppEnvironment;

        public HomeController(IOptions<AppSettings> settings, IOptions<StripeOptions> stripeOptions)
        {
            //System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
            string[] args = Environment.GetCommandLineArgs();
            System.Diagnostics.FileVersionInfo fvi = System.Diagnostics.FileVersionInfo.GetVersionInfo(args[0]);   // assembly.Location
            AppVersion = fvi.FileVersion;
            AppEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
            _settings = settings.Value;
            _stripeOptions = stripeOptions.Value;
        }

        [HttpGet("/[action]")]
        public IActionResult Version()
        {
            return Ok(new
            {
                name = AppName,
                version = AppVersion,
                environment = AppEnvironment,
            });
        }

        [HttpGet("/[action]")]
        public IActionResult Config()
        {
            return Ok(new
            {
                name = AppName,
                version = AppVersion,
                environment = AppEnvironment
            });
        }
    }
}

//
//
// {_settings.AmazonS3.AccessKeyId[^5]}
// {_settings.AmazonS3.SecretAccessKey[^5]}