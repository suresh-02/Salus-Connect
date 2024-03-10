using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.Email;
using System.Net;

[assembly: System.Reflection.AssemblyVersion("1.0.*")]

namespace SalusConnect.Api;

public class Program
{
    public static void Main(string[] args)
    {
        string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        //var configuration = new ConfigurationBuilder()
        //    .SetBasePath(Directory.GetCurrentDirectory())
        //    .AddJsonFile("appsettings.json")
        //    .AddJsonFile($"appsettings.{env}.json")
        //    .AddEnvironmentVariables()
        //    .Build();

        // string errorToEmail;
        // if (env.Equals("Development", StringComparison.OrdinalIgnoreCase))
        // {
        //     errorToEmail = "software.balu@gmail.com";
        // }
        // else
        // {
        //     errorToEmail = "sdit@salusconnect.ca";
        // }

        Log.Logger = new LoggerConfiguration()
            //.ReadFrom.Configuration(configuration)
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console(/*new RenderedCompactJsonFormatter()*/)
            .WriteTo.File("logs/salusconnect-.log", rollingInterval: RollingInterval.Hour)
            // .WriteTo.Email(new EmailConnectionInfo
            // {
            //     FromEmail = "info@salusconnect.ca",
            //     ToEmail = errorToEmail,  //,
            //     MailServer = "smtp.office365.com",
            //     NetworkCredentials = new NetworkCredential
            //     {
            //         UserName = "info@salusconnect.ca",
            //         Password = "SimplyLeapFrog@01172022"
            //     },
            //     EnableSsl = false,
            //     ServerCertificateValidationCallback = (sender, certificate, chain, sslError) => true,
            //     Port = 587,
            //     EmailSubject = $"SalusConnect-{env}: Error occured"
            // }, restrictedToMinimumLevel: LogEventLevel.Error, batchPostingLimit: 1)
            //.WriteTo.Seq("http://localhost:5341/")
            .CreateLogger();

        try
        {
            Log.Information("SalusConnect API application starting.");
            var builder = CreateHostBuilder(args);
            var host = builder.Build();
            host.Run();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "SalusConnect API application failed to start.");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    public static IHostBuilder CreateHostBuilder(string[] args)
    {
        return Host.CreateDefaultBuilder(args)
            .UseSerilog()
            //.UseSerilog((context, services, configuration) => configuration
            //    //.MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            //    .Enrich.FromLogContext()
            //    .ReadFrom.Configuration(context.Configuration)
            //    .ReadFrom.Services(services)
            //    .WriteTo.Debug(outputTemplate: DateTime.Now.ToString())
            //    .WriteTo.Console(/*new RenderedCompactJsonFormatter()*/)
            //    .WriteTo.File("log.txt", rollingInterval: RollingInterval.Day)
            ////.WriteTo.Seq("http://localhost:5341/")
            //)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
                //.UseUrls("http://0.0.0.0:5000");
            });
    }
}