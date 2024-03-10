using Xunit;

namespace SalusConnect.Api
{
    public class ApplicationTest
    {
        //private readonly string ConnectionString;

        //public DatabaseHelperTest()
        //{
        //    var config = InitConfiguration();
        //    ConnectionString = config["ConnectionStrings:DefaultConnection"];  //ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        //}

        //public static IConfiguration InitConfiguration()
        //{
        //    string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        //    var config = new ConfigurationBuilder()
        //       .AddJsonFile("appsettings.json")
        //       .AddJsonFile($"appsettings.{env}.json")
        //        .AddEnvironmentVariables()
        //        .Build();
        //    return config;
        //}

        //[Fact]
        //public void TestDatabaseConnection()
        //{
        //    var appSettings = Options.Create(new AppSettings
        //    {
        //        ConnectionStrings = new ConnectionStrings
        //        {
        //            DefaultConnection = ConnectionString
        //        }
        //    });
        //    var db = new DatabaseHelper(appSettings);
        //    using (var con = db.Connect())
        //    {
        //        Assert.True(con.State == System.Data.ConnectionState.Open);
        //    }
        //}

        [Fact]
        public void TestApplication()
        {
            Assert.True(1 == 1);
        }
    }
}