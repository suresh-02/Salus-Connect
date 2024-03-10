namespace SalusConnect.Api.Services;

public interface IHolidayService
{
    Task<List<HolidayDto>> GetAll(int year);

    Task<HolidayDto> GetById(int id);

    Task<HolidayDto> Create(HolidayDto holiday);

    Task Update(int id, HolidayDto holiday);

    Task Delete(int id);
}

public class HolidayService : IHolidayService
{
    private readonly IDatabaseHelper _db;

    public HolidayService(IDatabaseHelper db)
    {
        _db = db;
    }

    public async Task<List<HolidayDto>> GetAll(int year)
    {
        if (year is not (1900 or >= 2021))
        {
            throw new BadRequestException("Invalid year");
        }

        using (var conn = _db.Connect())
        {
            const string sql = @"
                    SELECT id AS HolidayId, to_char(hday_date, 'YYYY-MM-DD') AS Date, hday_name AS Name
                    FROM  vw_holidays
                    WHERE date_part('year', hday_date) = @year
                    ORDER BY hday_date;";
            return (await conn.QueryAsync<HolidayDto>(sql, new { year })).ToList();
        }
    }

    public async Task<HolidayDto> GetById(int id)
    {
        using (var conn = _db.Connect())
        {
            const string sql = @"
                    SELECT id AS HolidayId, to_char(hday_date, 'YYYY-MM-DD') AS Date, hday_name AS Name
                    FROM vw_holidays
                    WHERE id = @id;";
            var holidays = (await conn.QueryAsync<HolidayDto>(sql, new { id })).ToArray();

            if (holidays == null || !holidays.Any())
            {
                throw new NotFoundException("Holiday not found.");
            }
            var holiday = holidays[0];
            if (holiday == null || holiday.HolidayId != id)
            {
                throw new NotFoundException("Holiday not found.");
            }
            return holiday;
        }
    }

    public async Task<HolidayDto> Create(HolidayDto holiday)
    {
        holiday.Name = holiday.Name.Trim();
        using (var conn = _db.Connect())
        {
            #region Check duplicate of date and name

            var (existsDateAndName, errorDateAndName) = await ExistsDateAndName(conn, holiday.Date, holiday.Name);

            if (existsDateAndName)
            {
                var e = new DuplicateException("Duplicate values are found in date/name.");
                e.Data.Add("Date/Name", errorDateAndName);

                throw e;
            }

            #endregion Check duplicate of date and name

            const string sql = @"
                    INSERT INTO holidays ( hday_date, hday_name )
                    VALUES ( to_date(@Date, 'YYYY-MM-DD'), @Name )
                    RETURNING id;";
            int id = await conn.ExecuteScalarAsync<int>(sql, holiday);
            holiday.HolidayId = id;
        }
        return holiday;
    }

    public async Task Update(int id, HolidayDto holiday)
    {
        if (id != holiday.HolidayId)
        {
            throw new BadRequestException("Holiday ID not match.");
        }

        holiday.Name = holiday.Name.Trim();
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Holiday not found");
            }

            #region Check duplicate of date and name

            var (existsDateAndName, errorDateAndName) = await ExistsDateAndName(conn, holiday.Date, holiday.Name, id);

            if (existsDateAndName)
            {
                var e = new DuplicateException("Duplicate values are found in date/name.");
                e.Data.Add("Date/Name", errorDateAndName);

                throw e;
            }

            #endregion Check duplicate of date and name

            const string sql = @"
                    UPDATE holidays SET hday_date = to_date(@Date, 'YYYY-MM-DD'),
                        hday_name = @Name, updated_at = now() at time zone 'Asia/Kolkata'
                    WHERE id = @HolidayId;";
            await conn.ExecuteAsync(sql, holiday);
        }
    }

    public async Task Delete(int id)
    {
        using (var conn = _db.Connect())
        {
            //if (!await IsIdExists(conn, id))
            //{
            //    throw new NotFoundException("Holiday not found");
            //}
            const string sql = "DELETE FROM holidays WHERE id = @id;";
            int rowsAffected = await conn.ExecuteAsync(sql, new { id });
            if (rowsAffected == 0)
            {
                throw new NotFoundException("Holiday not found");
            }
        }
    }

    #region Private methods

    private static async Task<(bool, string)> ExistsDateAndName(IDbConnection conn, string date, string name, int? id = null)
    {
        const string sql = @"
                SELECT EXISTS(
                    SELECT 1 FROM holidays
                    WHERE hday_date = to_date(@date, 'YYYY-MM-DD') AND hday_name ILIKE @name
                        AND (@id IS NULL OR id != @id)
                );";

        bool exists = await conn.ExecuteScalarAsync<bool>(sql, new { date, name, id });

        return exists ? (true, $"Date '{Convert.ToDateTime(date):MMMM, dd}' and/or name '{name}' already exists.") : (false, "");
    }

    private static async Task<bool> IsIdExists(IDbConnection conn, int id)
    {
        bool exists = await conn.ExecuteScalarAsync<bool>("SELECT EXISTS( SELECT 1 FROM holidays WHERE id = @id );", new { id });
        return exists;
    }

    #endregion Private methods
}