namespace SalusConnect.Api.Services;

public interface IFacilityService
{
    Task<FacilityDto> Create(FacilityDto facility);

    Task Update(int id, FacilityDto facility);

    Task Delete(int id);

    Task<FacilityDto> GetById(int id, bool includeChildren = false);

    Task<List<FacilityDoctorDto>> GetDoctors(int facilityId);

    Task SendInvite(IDbConnection conn, int id, SendInviteDto model);

    Task UpdateStatus(int id, UserStatus status);
}

public class FacilityService : IFacilityService
{
    private readonly IDatabaseHelper _db;
    private readonly IAddressService _addressService;
    private readonly IDoctorService _doctorService;
    private readonly IUserService _userService;

    public FacilityService(IDatabaseHelper db, IAddressService addressService,
        IDoctorService doctorService,
        IUserService userService)
    {
        _db = db;
        _addressService = addressService;
        _doctorService = doctorService;
        _userService = userService;
    }

    public async Task<FacilityDto> Create(FacilityDto facility)
    {
        using (var tranScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            using (var conn = _db.Connect())
            {
                // duplicate validation
                var (existsName, errorName) = await ExistsName(conn, facility.FacilityName);
                if (existsName)
                {
                    var e = new DuplicateException("Duplicate values are found in facility name.");
                    e.Data.Add("Name", errorName);
                    throw e;
                }

                // address
                var address = await _addressService.Save(conn, facility.Address);
                if (address.AddressId != null) facility.AddressId = (int)address.AddressId;

                //string sql = "SELECT fn_facility_create(@FacilityName, @AddressId, @FacilityType, @StatusString);";
                int id = await conn.ExecuteScalarAsync<int>(FacilityQueries.FacilityCreate, facility);
                facility.FacilityId = id;
                // doctors
                foreach (FacilityDoctorDto doctor in facility.Doctors)
                {
                    doctor.FacilityId = facility.FacilityId;
                    await _doctorService.Create(conn, doctor);
                }
            }
            tranScope.Complete();
            return facility;
        }
    }

    public async Task Update(int id, FacilityDto facility)
    {
        if (id != facility.FacilityId)
        {
            throw new BadRequestException("Facility Id not match.");
        }

        using (var tranScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            using (var conn = _db.Connect())
            {
                if (!await IsIdExists(conn, id))
                {
                    throw new NotFoundException("Facility not found.");
                }

                // duplicate validation
                var (existsName, errorName) = await ExistsName(conn, facility.FacilityName, id);
                if (existsName)
                {
                    var e = new DuplicateException("Duplicate values are found in facility name.");
                    e.Data.Add("Name", errorName);
                    throw e;
                }

                // address
                var address = await _addressService.Save(conn, facility.Address);
                if (address.AddressId != null) facility.AddressId = (int)address.AddressId;

                //string sql = "SELECT fn_facility_update(@FacilityId, @FacilityName, @AddressId, @FacilityTypeString);";
                await conn.ExecuteAsync(FacilityQueries.FacilityUpdate, facility);
                // doctors
                await SaveDoctors(conn, id, facility.Doctors);
            }
            tranScope.Complete();
        }
    }

    public async Task Delete(int id)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Facility not found.");
            }

            string sql = "SELECT fn_facility_delete(@id);";
            await conn.ExecuteAsync(sql, new { id });
        }
    }

    public async Task<FacilityDto> GetById(int id, bool includeChildren = false)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Facility not found.");
            }

            var facilities = (await conn.QueryAsync<FacilityDto, AddressDto, FacilityDto>(
                FacilityQueries.FacilityGetOne, (facility, address) =>
                {
                    facility.Address = address;
                    if (address.AddressId != null) facility.AddressId = (int)address.AddressId;
                    return facility;
                }, new { id }, splitOn: "addressid")).ToArray();

            if (!facilities.Any()) return null;

            var facility = facilities[0];
            if (!includeChildren) return facility;
            facility.Doctors = await GetDoctors(conn, id);
            return facility;
        }
    }

    public async Task<List<FacilityDoctorDto>> GetDoctors(int facilityId)
    {
        using (var conn = _db.Connect())
        {
            return await GetDoctors(conn, facilityId);
        }
    }

    //public async Task Activate(int id, ActivateDto model)
    //{
    //    if (id != model.Id)
    //    {
    //        throw new BadRequestException("Id not match");
    //    }

    //    using (var conn = _db.Connect())
    //    {
    //        if (!await IsIdExists(conn, id))
    //        {
    //            throw new NotFoundException("Facility not found");
    //        }

    //        await conn.ExecuteAsync($"SELECT fn_facility_activate(@Id, @Active);", model);
    //    }
    //}

    public async Task SendInvite(IDbConnection conn, int id, SendInviteDto model)
    {
        if (id != model.Id)
        {
            throw new BadRequestException("Id not match");
        }

        var doctors = await GetDoctors(conn, id);
        foreach (var doctor in doctors)
        {
            await _userService.SendInvite(conn, doctor.UserId, model);
        }
        await UpdateStatus(id, UserStatus.Invited);
    }

    public async Task UpdateStatus(int id, UserStatus status)
    {
        using (var conn = _db.Connect())
        {
            if (!await IsIdExists(conn, id))
            {
                throw new NotFoundException("Facility is not found");
            }

            await conn.ExecuteAsync("SELECT fn_facility_update_status(@Id, @Status);",
                new { Id = id, Status = status.ToString() });
        }
    }

    #region Private methods

    private async Task SaveDoctors(IDbConnection conn, int facilityId, List<FacilityDoctorDto> doctors)
    {
        // get doctor id from database
        string sql = "SELECT user_id FROM doctors WHERE facility_id = @facilityId";
        List<int> dbDoctorIds = (await conn.QueryAsync<int>(sql, new { facilityId })).ToList();

        try
        {
            // delete all doctors that are no longer exists
            int[] delDoctorIds = dbDoctorIds.Where(dbDoctorId => doctors.All(doctor => dbDoctorId != doctor.UserId)).ToArray();
            sql = "DELETE FROM doctors WHERE user_id = ANY(@delDoctorIds)";
            await conn.ExecuteAsync(sql, new { delDoctorIds });
        }
        catch (Exception ex)
        {
            throw new BadRequestException($"Removing one or more doctor(s) not allowed. Error: {ex.Message}");
        }

        // save doctors
        foreach (FacilityDoctorDto doctor in doctors)
        {
            doctor.FacilityId = facilityId;
            if (doctor.UserId == 0)
            {
                await _doctorService.Create(conn, doctor);
            }
            else
            {
                await _doctorService.Update(conn, doctor.UserId, doctor);
            }
        }
    }

    private static async Task<List<FacilityDoctorDto>> GetDoctors(IDbConnection conn, int facilityId)
    {
        //string sql = "SELECT * FROM fn_facility_get_doctors(@facilityId);";
        List<FacilityDoctorDto> doctors = (await conn.QueryAsync<FacilityDoctorDto, SpecialtyDto, FacilityDoctorDto>(FacilityQueries.FacilityGetDoctors,
            (doctor, specialty) =>
            {
                doctor.Specialty = specialty;
                doctor.SpecialtyId = specialty.SpecialtyId;
                return doctor;
            }, new { facilityId }, splitOn: "specialtyid")).ToList();

        if (!doctors.Any()) return doctors;

        foreach (FacilityDoctorDto doctor in doctors)
        {
            doctor.Tags = doctor.TagsString.Split(',');
        }

        return doctors;
    }

    private static async Task<(bool, string)> ExistsName(IDbConnection conn, string name, int? id = null)
    {
        const string sql = @"SELECT EXISTS( SELECT 1 FROM facilities WHERE facility_name = @name AND (@id IS NULL OR id != @id) );";
        bool exists = await conn.ExecuteScalarAsync<bool>(sql, new { name, id });

        return exists ? (true, $"Facility name '{name}' already exists.") : (false, "");
    }

    private static async Task<bool> IsIdExists(IDbConnection conn, int id)
    {
        bool found = await conn.ExecuteScalarAsync<bool>("SELECT EXISTS(" +
                                                         "SELECT 1 FROM facilities WHERE id = @id);", new { id });
        return found;
    }

    #endregion Private methods
}

internal class FacilityQueries
{
    internal const string FacilityCreate = @"
            INSERT INTO facilities (facility_name, address_id, facility_type, status)
            VALUES (@FacilityName, @AddressId, @FacilityTypeString::facilitytype, @StatusString::userstatus)
		    RETURNING id;";

    internal const string FacilityUpdate = @"
            UPDATE facilities SET
                facility_name = @FacilityName,
                address_id = @AddressId,
                facility_type = @FacilityTypeString::facilitytype,
                updated_at = now() at time zone 'Asia/Kolkata'
            WHERE id = @FacilityId;";

    internal const string FacilityGetOne = @"
            SELECT f.id AS FacilityId, f.facility_name AS FacilityName, f.facility_type::varchar AS FacilityType,
                f.status::varchar AS FacilityStatus, f.address_id AS AddressId,
                a.address_line1 AS AddressLine1,
                a.address_line2 AS AddressLine2,
                a.city AS City,
                a.state_abbr AS StateAbbr
		    FROM facilities f
		    LEFT JOIN addresses a ON f.address_id = a.id
		    WHERE f.id = @id;";

    internal const string FacilityGetDoctors = @"
            SELECT u.id AS UserId, u.first_name AS FirstName, u.last_name AS LastName,
                u.phone_number AS PhoneNumber, u.email_address AS EmailAddress, u.role_id AS RoleId, u.status AS Status,
                u.image_url AS ImageUrl,
                d.facility_id AS FacilityId, d.biography AS Biography, array_to_string(d.tags, ',')::varchar AS TagsString,
                d.specialty_id AS SpecialtyId, s.specialty_name AS SpecialtyName, s.category_id AS CategoryId
            FROM doctors d
            INNER JOIN users u ON d.user_id = u.id
            INNER JOIN specialties s ON d.specialty_id = s.id
            WHERE d.facility_id = @facilityId;";

}