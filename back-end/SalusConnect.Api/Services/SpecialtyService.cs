namespace SalusConnect.Api.Services;

public interface ISpecialtyService
{
    Task<List<SpecialtyDto>> GetAll();

    Task<SpecialtyDto> Create(SpecialtyDto specialty);

    Task<SpecialtyDto> Create(IDbConnection conn, SpecialtyDto specialty);

    Task Update(int id, SpecialtyDto specialty);

    Task Delete(int id);

    Task<SpecialtyDto> GetById(int id);
}

public class SpecialtyService : ISpecialtyService
{
    private readonly IDatabaseHelper _db;

    public SpecialtyService(IDatabaseHelper db)
    {
        _db = db;
    }

    public async Task<List<SpecialtyDto>> GetAll()
    {
        using (var conn = _db.Connect())
        {
            const string sql = @"
                    SELECT s.id AS SpecialtyId, s.specialty_name AS SpecialtyName, s.category_id AS CategoryId, c.category_name AS CategoryName
                    FROM specialties s
                    INNER JOIN categories c ON s.category_id = c.id;";
            return (await conn.QueryAsync<SpecialtyDto>(sql)).ToList();
        }
    }

    public async Task<SpecialtyDto> Create(SpecialtyDto specialty)
    {
        using (var conn = _db.Connect())
        {
            return await Create(conn, specialty);
        }
    }

    public async Task<SpecialtyDto> Create(IDbConnection conn, SpecialtyDto specialty)
    {
        specialty.SpecialtyName = specialty.SpecialtyName.Trim();

        #region Check duplicate of name

        var (existsName, errorName) = await ExistsName(conn, specialty.SpecialtyName);

        if (existsName)
        {
            var e = new DuplicateException("Duplicate values found in name.");
            e.Data.Add("Name", errorName);

            throw e;
        }

        #endregion Check duplicate of name

        //string sql = "SELECT fn_specialty_create(@SpecialtyName, @CategoryId);";
        const string sql = @"
                INSERT INTO specialties (specialty_name, category_id) VALUES (@SpecialtyName, @CategoryId)
		        RETURNING id;";
        int id = await conn.ExecuteScalarAsync<int>(sql, specialty);
        specialty.SpecialtyId = id;
        return specialty;
    }

    public async Task Update(int id, SpecialtyDto specialty)
    {
        if (id != specialty.SpecialtyId)
        {
            throw new BadRequestException("Specialty id not match.");
        }

        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Specialty not found");
            }

            specialty.SpecialtyName = specialty.SpecialtyName.Trim();

            #region Check duplicate of email and phone

            var (existsName, errorName) = await ExistsName(conn, specialty.SpecialtyName, id);

            if (existsName)
            {
                var e = new DuplicateException("Duplicate values found in name.");
                e.Data.Add("Name", errorName);

                throw e;
            }

            #endregion Check duplicate of email and phone

            //string sql = "SELECT fn_specialty_update(@SpecialtyId, @SpecialtyName, @CategoryId);";
            const string sql = @"
                    UPDATE specialties SET specialty_name = @SpecialtyName, category_id = @CategoryId
		            WHERE id = @SpecialtyId;";
            await conn.ExecuteAsync(sql, specialty);
        }
    }

    public async Task Delete(int id)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Specialty not found");
            }
            // "SELECT * FROM fn_specialty_used_count(@id)"
            int assignedDoctorCount = await conn.ExecuteScalarAsync<int>(
                "SELECT COUNT(*)::int FROM doctors WHERE specialty_id = @id;", new { id });
            if (assignedDoctorCount == 0)
            {
                // "SELECT fn_specialty_delete(@id);"

                await conn.ExecuteAsync("DELETE FROM specialties WHERE id = @id;", new { id });
            }
            else
            {
                throw new BadRequestException($"Unable to delete specialty - assigned to {assignedDoctorCount} doctor(s)");
            }
        }
    }

    public async Task<SpecialtyDto> GetById(int id)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Specialty not found");
            }
            return await GetById(conn, id);
        }
    }

    #region Private methods

    private static async Task<SpecialtyDto> GetById(IDbConnection conn, int id)
    {
        const string sql = @"
                SELECT s.id AS SpecialtyId, s.specialty_name AS SpecialtyName, s.category_id AS CategoryId, c.category_name AS CategoryName
                FROM specialties s
                INNER JOIN categories c ON s.category_id = c.id
                WHERE id = @id;";
        return await conn.QuerySingleOrDefaultAsync<SpecialtyDto>(sql, new { id });
    }

    private static async Task<(bool, string)> ExistsName(IDbConnection conn, string name, int? id = null)
    {
        string sql = "SELECT EXISTS( SELECT 1 FROM specialties WHERE specialty_name ILIKE @name";
        if (id.HasValue)
        {
            sql += " AND id != @id";
        }
        sql += " );";

        bool exists = await conn.ExecuteScalarAsync<bool>(sql, new { name, id });

        return exists ? (true, $"Specialty name '{name}' already exists") : (false, "");
    }

    private static async Task<bool> IsIdExists(IDbConnection conn, int id)
    {
        const string sql = "SELECT EXISTS( SELECT 1 FROM specialties WHERE id = @id );";
        bool exists = await conn.ExecuteScalarAsync<bool>(sql, new { id });
        return exists;
    }

    #endregion Private methods
}