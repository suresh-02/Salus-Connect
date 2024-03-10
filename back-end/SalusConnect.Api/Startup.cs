using DbUp;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using Serilog;
using SalusConnect.Api.HttpHelpers;

using System.IO;
using System.Net.Mime;
using System.Reflection;
using System.Text;
using System.Text.Json;

namespace SalusConnect.Api;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        try
        {
            Log.Information($"Executing {nameof(ConfigureServices)} method from Startup.");

            #region Read appsettings.json

            services.AddOptions();
            services.Configure<AppSettings>(Configuration);
            var appSettings = Configuration.Get<AppSettings>();
            //Directory.CreateDirectory(appSettings.ImagePath);

            #endregion Read appsettings.json

            // #region Stripe

            // Stripe.StripeConfiguration.AppInfo = new Stripe.AppInfo
            // {
            //     Name = "SalusConnect.ca",
            //     Url = "https://www.salusconnect.ca",
            //     Version = "1.0.0"
            // };

            // services.Configure<StripeOptions>(options =>
            // {
            //     options.PublishableKey = Environment.GetEnvironmentVariable("STRIPE_PUBLISHABLE_KEY");
            //     options.SecretKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");
            //     options.WebhookSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET");
            // });

            // #endregion Stripe

            #region Health check

            services.AddHealthChecks()
                .AddNpgSql(appSettings.ConnectionStrings.DefaultConnection, name: "PostgreSQL",
                    failureStatus: HealthStatus.Unhealthy, tags: new[] { "pgsql", "all" });
            //.AddRedis(appSettings.RedisCache.HostAndPort, "Redis",
            //    HealthStatus.Degraded, new[] { "redis", "all" });

            //services.AddHealthChecksUI();

            #endregion Health check

            #region Database migrations

            //Log.Information("Performing database migrations...");
            // EnsureDatabase.For.PostgresqlDatabase(appSettings.ConnectionStrings.DefaultConnection);
            var upgrader = DeployChanges.To
                .PostgresqlDatabase(appSettings.ConnectionStrings.DefaultConnection)
                .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
                .WithExecutionTimeout(TimeSpan.FromMinutes(60))
                .WithVariablesDisabled()
                //.LogToConsole()
                .LogToAutodetectedLog()
                .Build();
            var result = upgrader.PerformUpgrade();
            if (!result.Successful)
            {
                Log.Error(result.Error, $"Database migration failed with error: {result.Error.Message}");
                throw new ApplicationException($"Database migration failed with error: {result.Error.Message}", result.Error);
            }

            #endregion Database migrations

            #region CORS - Cross-Origin Resource Sharing

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins(appSettings.CorsOrigins)
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .AllowCredentials()
                        .AllowAnyMethod()
                        //.WithMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                        .AllowAnyHeader();
                });
            });

            #endregion CORS - Cross-Origin Resource Sharing

            #region Fileupload limit

            services.Configure<FormOptions>(options =>
            {
                options.ValueLengthLimit = int.MaxValue;
                options.MultipartBodyLengthLimit = int.MaxValue;
                options.MemoryBufferThreshold = int.MaxValue;
            });

            #endregion Fileupload limit

            #region API Controllers, Error handler and Json serialization/deserialization options

            services.AddControllers(options =>
                {
                    options.Conventions.Add(new RouteTokenTransformerConvention(new SlugifyParameterTransformer()));
                })
                .ConfigureApiBehaviorOptions(options =>
                {
                    options.InvalidModelStateResponseFactory = actionContext =>
                    {
                        var result = new ValidationFailedResult(actionContext.ModelState);
                        result.ContentTypes.Add(MediaTypeNames.Application.Json);
                        return result;
                    };
                    //options.SuppressConsumesConstraintForFormFileParameters = true;
                    //options.SuppressInferBindingSourcesForParameters = true;
                    //options.SuppressModelStateInvalidFilter = false;    // this should be FALSE to send correct ModelState errors
                    //options.SuppressMapClientErrors = true;
                    //options.ClientErrorMapping[StatusCodes.Status404NotFound].Link = "https://httpstatuses.com/404";
                })
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                    options.JsonSerializerOptions.AllowTrailingCommas = true;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                });
            //services.AddRouting(options => options.LowercaseUrls = true);

            #endregion API Controllers, Error handler and Json serialization/deserialization options

            #region DataProtection

            //string machineKey = @"<?xml version=""1.0"" encoding=""utf-8"" ?>
            //    <machineKey decryption=""Auto"" decryptionKey =""DEC_KEY"" validation=""HMACSHA256"" validationKey=""VAL_KEY"" />";
            //var machineKeyConfig = new XmlMachineKeyConfig(machineKey);
            //MachineKeyDataProtectionOptions machinekeyOptions = new MachineKeyDataProtectionOptions();
            //machinekeyOptions.MachineKey = new MachineKey(machineKeyConfig);
            //MachineKeyDataProtectionProvider machineKeyDataProtectionProvider = new MachineKeyDataProtectionProvider(machinekeyOptions);
            //MachineKeyDataProtector machineKeyDataProtector = new MachineKeyDataProtector(machinekeyOptions.MachineKey);

            ////purposes from owin middleware
            //Microsoft.AspNetCore.DataProtection.IDataProtector dataProtector =
            //machineKeyDataProtector.CreateProtector("Microsoft.Owin.Security.OAuth", "Access_Token", "v1");

            #endregion DataProtection

            #region JWT Authentication

            //services.AddAuthentication(options =>
            //{
            //    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            //});
            ////.AddOAuthValidation(option =>
            ////{
            ////    option.AccessTokenFormat = new OwinTicketDataFormat(new OwinTicketSerializer(), dataProtector);
            ////});

            services.AddAuthentication(configureOptions =>
                {
                    configureOptions.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    configureOptions.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = true;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = appSettings.JwtTokenConfig.Issuer,
                        ValidAudience = appSettings.JwtTokenConfig.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(appSettings.JwtTokenConfig.Secret)),
                        ClockSkew = TimeSpan.Zero //TimeSpan.FromMinutes(1)
                    };
                    //options.Events = new JwtBearerEvents
                    //{
                    //    OnMessageReceived = context =>
                    //    {
                    //        context.Token = context.Request.Cookies["token"];
                    //        return Task.CompletedTask;
                    //    }
                    //};
                });

            #endregion JWT Authentication

            #region Swagger Open API Documentation

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "SalusConnect API",
                    Description = "Providing list of APIs for SalusConnect"
                });
                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    c.IncludeXmlComments(xmlPath);
                }

                c.AddSecurityDefinition("Bearer",
                    new OpenApiSecurityScheme
                    {
                        Name = "Authorization",
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer",
                        BearerFormat = "JWT",
                        In = ParameterLocation.Header,
                        Description = "JWT Authorization header using the Bearer scheme."
                    });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference=new OpenApiReference{Type=ReferenceType.SecurityScheme, Id="Bearer"}
                        },
                        Array.Empty<string>()
                    }
                });
            });

            #endregion Swagger Open API Documentation

            #region API Versioning

            services.AddApiVersioning(config =>
            {
                config.AssumeDefaultVersionWhenUnspecified = true;
                config.ReportApiVersions = true;
                config.ApiVersionReader = new UrlSegmentApiVersionReader();
                config.DefaultApiVersion = new ApiVersion(1, 0);
            });

            #endregion API Versioning

            #region Redis cache

            //services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(appSettings.RedisCache.HostAndPort));

            //services.AddStackExchangeRedisCache(options =>
            //{
            //    options.Configuration = appSettings.RedisCache.HostAndPort;
            //    //",abortConnect = False"
            //    options.InstanceName = appSettings.RedisCache.InstanceName;
            //});

            #endregion Redis cache

            #region HttpClient

            services.AddHttpClient();

            #endregion HttpClient

            #region Services

            services.AddSingleton<ITokenService, TokenService>();
            services.AddSingleton<IEmailService, EmailService>();

            services.AddScoped<IDatabaseHelper, DatabaseHelper>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProviderService, ProviderService>();
            services.AddScoped<IAddressService, AddressService>();
            services.AddScoped<IDoctorService, DoctorService>();
            services.AddScoped<IDoctorSlotService, DoctorSlotService>();
            services.AddScoped<ISpecialtyService, SpecialtyService>();
            services.AddScoped<IFacilityService, FacilityService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IHolidayService, HolidayService>();

            services.AddScoped<IDashboardService, DashboardService>();

            services.AddScoped<IAmazonS3Service, AmazonS3Service>();

            #endregion Services
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, $"Execution of {nameof(ConfigureServices)} method from Startup failed.");
        }
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        try
        {
            Log.Information($"Executing {nameof(Configure)} method from Startup.");
            //Stripe.StripeConfiguration.ApiKey = "sk_test_51KJKV9HBvZl6iQMjyrcgMBt1SeocFPPJcDQeJIaDqkNcqzIfGWH7ubVo7SB3mtXNNUQVBqHqfm80f44QxEapXU0E00PbEr5xpj";
            // SalusConnect -
            // Bala - "sk_test_51KNK2qSFdmEmcCd0i7JBGSaklhhQlTsbN37EpqnzLLQ1lQob9BJ8Yl0nrueLLlufzQcPcdhDUrPOlQadmYbNMfcq00SjIqLsPI"
            //var stripeOptions = Configuration.Get<StripeOptions>();
            //Stripe.StripeConfiguration.ApiKey = stripeOptions.SecretKey;

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SalusConnect API v1"));
            }
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseCors();
            app.UseSerilogRequestLogging();
            //app.UseHttpsRedirection();
            app.UseRouting();
            //app.UseHealthChecksUI(config => config.UIPath = "/health-ui");
            app.UseAuthentication();
            app.UseAuthorization();

            // custom jwt auth middleware
            // app.UseMiddleware<JwtMiddleware>();

            #region Static file with cache control

            //var appSettings = Configuration.Get<AppSettings>();
            //// const string cacheMaxAgeSeconds = "600";    // 10 minutes
            //app.UseStaticFiles(new StaticFileOptions
            //{
            //    ServeUnknownFileTypes = true,
            //    FileProvider = new PhysicalFileProvider(
            //        Path.Combine(env.ContentRootPath, appSettings.ImagePath)),
            //    RequestPath = appSettings.ImageUrl,
            //    OnPrepareResponse = ctx =>
            //    {
            //        ctx.Context.Response.Headers.Append("Cache-Control", "public, max-age=600");  // "no-store");
            //        ctx.Context.Response.Headers["Access-Control-Allow-Origin"] = "*";

            //        //var user = (UserDto)ctx.Context.Items["User"];
            //        //if (user == null)
            //        //{
            //        //    ctx.Context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            //        //    ctx.Context.Response.ContentLength = 0;
            //        //    ctx.Context.Response.Body = Stream.Null;
            //        //}
            //    }
            //});

            #endregion Static file with cache control

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                #region Healthcheck endpoints

                endpoints.MapHealthChecks("/health");
                endpoints.MapHealthChecks("/health/pgsql", new HealthCheckOptions
                {
                    Predicate = check => check.Tags.Contains("pgsql")
                });
                endpoints.MapHealthChecks("/health/redis", new HealthCheckOptions
                {
                    Predicate = check => check.Tags.Contains("redis")
                });

                #endregion Healthcheck endpoints
            });
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, $"Execution of {nameof(Configure)} method from Startup failed.");
        }
    }
}

/*
 * https://stackoverflow.com/questions/54661107/consuming-oauth-bearer-issued-by-owin-from-asp-net-core
 * https://github.com/daixinkai/AspNetCore.Owin/tree/master/src
 * https://github.com/aspnet/AspNetKatana/blob/e2b18ec84ceab7ffa29d80d89429c9988ab40144/src/Microsoft.Owin.Security/DataHandler/Serializer/TicketSerializer.cs
 * Complete: https://github.com/turgayozgur/Owin.Token.AspNetCore
 */