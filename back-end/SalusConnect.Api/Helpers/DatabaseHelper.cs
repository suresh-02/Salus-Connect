namespace SalusConnect.Api.Helpers;

public interface IDatabaseHelper
{
    IDbConnection Connect();

    DatabasePaging PagingViewToDatabase(ViewPaging paging);
}

public class DatabaseHelper : IDatabaseHelper
{
    private readonly AppSettings _appSettings;

    public DatabaseHelper(IOptions<AppSettings> options)
    {
        _appSettings = options.Value;
    }

    public IDbConnection Connect()
    {
        var dbConn = new Npgsql.NpgsqlConnection(_appSettings.ConnectionStrings.DefaultConnection);
        dbConn.Open();

        return dbConn;
    }

    public DatabasePaging PagingViewToDatabase(ViewPaging paging)
    {
        switch (paging.PageIndex)
        {
            // Default Page Size to 10
            case > 0 when paging.PageSize == 0:
                paging.PageSize = 10;
                break;
            // Default Page Index to 1
            case 0 when paging.PageSize > 0:
                paging.PageIndex = 1;
                break;
        }

        if (paging.IsEmpty) return new DatabasePaging { Limit = null, Offset = null };
        int? limit = paging.PageSize;
        int? offset = (paging.PageIndex - 1) * paging.PageSize;

        return new DatabasePaging { Limit = limit, Offset = offset };
    }
}