namespace SalusConnect.Api.Services;
public interface IProviderService
{
    Task<ProvidersDto> GetAll(int pageIndex = 0, int pageSize = 0, string search = null,
        string sortField = "ProviderName", string sortDirection = "asc");

    //int pageIndex = 0, int pageSize = 0, string search = null

    //Task Activate(ActivateDto model);

    Task UpdateStatus(int id, UpdateStatusDto model);

    //Task<IEnumerable<SearchSpecialtyDto>> SearchSpecialties(string specialty);

    Task<IEnumerable<SearchSpecialtyOrProviderDto>> SearchSpecialtiesOrProviders(string specialty);

    Task<IEnumerable<SearchLocationDto>> SearchLocations(LocationType locationType, string location);

    Task<IEnumerable<SearchProviderDto>> SearchProviders(string specialty,
        string city, string stateAbbr, DateTime? date, int? id);

    Task<List<SearchProviderSlotDto>> GetProviderSlots(int doctorId, int treatmentId, DateTime? date);

    Task<List<DoctorTreatmentDto>> GetTreatments(int doctorId);

    Task<List<DoctorTreatmentDto>> GetTreatments(IDbConnection conn, int doctorId);
}

public class ProviderService : IProviderService
{
    private readonly IDatabaseHelper _db;
    private readonly IUserService _userService;
    private readonly IFacilityService _facilityService;
    private readonly IEmailService _emailService;

    public ProviderService(IDatabaseHelper db, IUserService userService,
        IFacilityService facilityService, IEmailService emailService)
    {
        _db = db;
        _userService = userService;
        _facilityService = facilityService;
        _emailService = emailService;
    }

    public async Task<ProvidersDto> GetAll(int pageIndex = 0, int pageSize = 0, string search = null,
        string sortField = "ProviderName", string sortDirection = "asc")
    //(int pageIndex = 0, int pageSize = 0, string search = null)
    {
        //const string sql = @"
        //        BEGIN;
        //            SELECT fn_provider_getall('ref1','ref2', @Limit, @Offset, @Search);
        //            FETCH ALL IN ref1;
        //            FETCH ALL IN ref2;
        //        COMMIT;";
        const string sql = @"
            WITH data_cte AS (
                SELECT pr.id AS ProviderId, pr.name::text AS ProviderName,
                    a.postal_code AS PostalCode, a.city, a.state_abbr AS StateAbbr,
                    pr.prov_type::text AS ProviderType, pr.specialty_name AS SpecialtyName, pr.status,
                    pr.doctors::int, pr.ActiveDoctors::int,
                    pr.created_at AS DateCreated
                FROM (
                    SELECT d.user_id AS id, u.first_name || ' ' || u.last_name AS name, d.address_id, 'Individual' AS prov_type,
                        s.specialty_name, u.status, NULL AS doctors, NULL AS ActiveDoctors,
                        d.created_at
                    FROM doctors d
                    INNER JOIN specialties s ON d.specialty_id = s.id
                    INNER JOIN users u ON d.user_id = u.id
		            WHERE d.facility_id IS NULL AND (
		                (@search IS NULL OR u.first_name     ILIKE @search || '%') OR
	                    (@search IS NULL OR u.last_name      ILIKE @search || '%') OR
	                    (@search IS NULL OR s.specialty_name ILIKE @search || '%') OR
                        (@search IS NULL OR u.status::text   ILIKE @search || '%') OR
                        (@search IS NULL OR u.email_address  ILIKE @search || '%') )
		            UNION ALL
                    SELECT f.id AS id, f.facility_name AS name, f.address_id, f.facility_type::text AS prov_type,
                        array_to_string(array_agg(DISTINCT sp.specialty_name), ', ') AS specialty_name,
                        f.status, COUNT(DISTINCT d.user_id) AS doctors,
                        COUNT(DISTINCT d.user_id) FILTER (WHERE du.status='Active') AS ActiveDoctors,
                        f.created_at
                    FROM facilities f
                    LEFT JOIN ((doctors d INNER JOIN users du ON d.user_id = du.id) INNER JOIN specialties sp ON d.specialty_id = sp.id) ON f.id = d.facility_id
		            WHERE
			            (@search IS NULL OR f.facility_name   ILIKE @search || '%') OR
		                (@search IS NULL OR du.first_name     ILIKE @search || '%') OR
		                (@search IS NULL OR du.last_name      ILIKE @search || '%') OR
                        (@search IS NULL OR du.email_address  ILIKE @search || '%') OR
		                (@search IS NULL OR sp.specialty_name ILIKE @search || '%') OR
                        (@search IS NULL OR f.status::text    ILIKE @search || '%')
		            GROUP BY f.id
	            ) pr
	            INNER JOIN addresses a ON pr.address_id = a.id
            ), count_cte AS (
	            SELECT count(*) AS Rows FROM data_cte
            )
            SELECT *
            FROM data_cte AS da CROSS JOIN count_cte AS co
            ORDER BY
	            CASE WHEN (@sortField ILIKE 'ProviderName' and @sortDirection ILIKE 'asc')  THEN da.ProviderName END ASC,
	            CASE WHEN (@sortField ILIKE 'ProviderName' and @sortDirection ILIKE 'desc') THEN da.ProviderName END DESC,
	            CASE WHEN (@sortField ILIKE 'City'         and @sortDirection ILIKE 'asc')  THEN da.City         END ASC,
	            CASE WHEN (@sortField ILIKE 'City'         and @sortDirection ILIKE 'desc') THEN da.City         END DESC,
	            CASE WHEN (@sortField ILIKE 'State'        and @sortDirection ILIKE 'asc')  THEN da.StateAbbr END ASC,
	            CASE WHEN (@sortField ILIKE 'State'        and @sortDirection ILIKE 'desc') THEN da.StateAbbr END DESC,
	            CASE WHEN (@sortField ILIKE 'DateCreated'  and @sortDirection ILIKE 'asc')  THEN da.DateCreated  END ASC,
	            CASE WHEN (@sortField ILIKE 'DateCreated'  and @sortDirection ILIKE 'desc') THEN da.DateCreated  END DESC,
	            da.ProviderId ASC
            LIMIT @limit OFFSET @offset;";

        var dbPaging = _db.PagingViewToDatabase(new ViewPaging { PageIndex = pageIndex, PageSize = pageSize });
        int totalRows = 0;
        using (var conn = _db.Connect())
        {
            var providers = (await conn.QueryAsync<ProviderDto, ProvidersDto, ProviderDto>(sql, (provider, list) =>
            {
                totalRows = list.Rows;
                return provider;
            }, new { limit = dbPaging.Limit, offset = dbPaging.Offset, search, sortField, sortDirection }, splitOn: "rows")).ToList();
            return new ProvidersDto { Data = providers, Rows = totalRows };
        }
    }

    //public async Task Activate(ActivateDto model)
    //{
    //    if (model.ProviderType == ProviderType.Individual)
    //    {
    //        await _userService.Activate(model.Id, model);
    //    }
    //    else
    //    {
    //        await _facilityService.Activate(model.Id, model);
    //    }
    //}

    public async Task UpdateStatus(int id, UpdateStatusDto model)
    {
        if (id != model.Id)
        {
            throw new BadRequestException("Provider Id does not match.");
        }
        if (model.ProviderType == ProviderType.Individual)
        {
            await _userService.UpdateStatus(model.Id, model.Status);
        }
        else
        {
            await _facilityService.UpdateStatus(model.Id, model.Status);
        }
    }

    /*
     Payment Method: {subscription.PaymentMethod}<br />
    <div style=""width: 50%"">
	    <div style=""text-transform: uppercase; border-bottom: 1px rgb(200, 200, 200) solid;"">
            <p>Details of your current plan:</p>
        </div>
        <div style=""display: flex; justify-content: space-between"">
            <div style=""display: flex; flex-direction: column;"">
                <span>Base Plan</span>
                <span>Base Plan Fee</span>
                <span>Add-on Practitioners</span>
                <span>Add-on Practitioner Fee</span>
                <span>Add-on Staff Members</span>
                <span style=""border-bottom: 1px rgb(200, 200, 200) solid;padding:4px"">Add-on Staff Member Fee</span>
                {(discountAmount > 0 ? $@"<span style=""border-bottom: 1px rgb(200, 200, 200) solid;padding: 4px;"">Discount</span>" : string.Empty) }
                <span>Invoice Amount</span>
            </div>
            <div style=""display: flex; flex-direction: column;"">
                <span>{basePlan.Name}</span>
                <span>{basePlan.Amount}</span>
                <span>{providerPlan.Qty}</span>
                <span>{providerPlan.Amount}</span>
                <span>{staffPlan.Qty}</span>
                <span>{staffPlan.Amount}</span>
                {(discountAmount > 0 ? $"<span>{discountAmount}</span>" : string.Empty)}
                <span>{invoiceAmount}</span>
            </div>
        </div>
     */

    //public async Task<IEnumerable<SearchSpecialtyDto>> SearchSpecialties(string specialty)
    //{
    //    using (var conn = _db.Connect())
    //    {
    //        const string sql = @"
    //                SELECT id AS Id, specialty_name AS SpecialtyName
    //                FROM specialties
    //                WHERE (@specialty IS NULL OR specialty_name ILIKE @specialty || '%')
    //                ORDER BY specialty_name;";
    //        return await conn.QueryAsync<SearchSpecialtyDto>(sql, new { specialty });
    //    }
    //}

    public async Task<IEnumerable<SearchSpecialtyOrProviderDto>> SearchSpecialtiesOrProviders(string specialty)
    {
        int? specialtyId = null, providerId = null, facilityId = null;
        if (!string.IsNullOrEmpty(specialty))
        {
            if (specialty.StartsWith("s-"))
            {
                specialtyId = Convert.ToInt32(specialty[2..]);
                specialty = null;
            }
            else if (specialty.StartsWith("p-"))
            {
                providerId = Convert.ToInt32(specialty[2..]);
                specialty = null;
            }
            else if (specialty.StartsWith("f-"))
            {
                facilityId = Convert.ToInt32(specialty[2..]);
                specialty = null;
            }
        }

        using (var conn = _db.Connect())
        {
            //const string sql = @"
            //        SELECT 's' || id AS Id, specialty_name AS SpecialtyName
            //        FROM specialties
            //        WHERE @specialty IS NULL OR specialty_name ILIKE @specialty || '%'
            //        ORDER BY specialty_name;";
            const string splSql = @"
            SELECT 's-' || s.id AS Value, s.specialty_name AS Label
            FROM specialties s
            WHERE (@specialtyId IS NULL OR s.id = @specialtyId)
                AND (@specialty IS NULL OR s.specialty_name ILIKE @specialty || '%')";

            const string proSql = @"
            SELECT 'p-' || u.id AS Value, u.first_name || ' ' || u.last_name AS Label
            FROM users u INNER JOIN doctors d ON u.id = d.user_id
            WHERE u.status IN ('Active', 'Published')
                AND (@providerId IS NULL OR d.user_id = @providerId)
                AND (@specialty IS NULL OR u.first_name || ' ' || u.last_name ILIKE @specialty || '%')";

            const string facSql = @"
            SELECT 'f-' || f.id AS Value, f.facility_name AS Label
            FROM facilities f
            WHERE (@facilityId IS NULL OR f.id = @facilityId)
                AND (@specialty IS NULL OR f.facility_name ILIKE @specialty || '%')";

            string sql = $"{splSql} ORDER BY Label;";
            if (!string.IsNullOrEmpty(specialty))
            {
                sql = $"{proSql} UNION ALL {facSql} ORDER BY Label;";
            }
            if (specialtyId.HasValue)
            {
                sql = $"{splSql};";
            }
            else if (providerId.HasValue)
            {
                sql = $"{proSql};";
            }
            else if (facilityId.HasValue)
            {
                sql = $"{facSql};";
            }

            return await conn.QueryAsync<SearchSpecialtyOrProviderDto>(sql,
                new { specialty, specialtyId, providerId, facilityId });
        }
    }

    public async Task<IEnumerable<SearchLocationDto>> SearchLocations(LocationType locationType, string location)
    {
        using (var conn = _db.Connect())
        {
            return await conn.QueryAsync<SearchLocationDto>("SELECT * FROM fn_search_locations(@locationType, @location);",
                new { locationType = locationType.ToString(), location });
        }
    }

    public async Task<IEnumerable<SearchProviderDto>> SearchProviders(string specialty,
        string city, string stateAbbr, DateTime? date, int? id)
    {
        int? specialtyId = null, providerId = null, facilityId = null;
        if (!string.IsNullOrEmpty(specialty))
        {
            if (specialty.StartsWith("s-"))
            {
                specialtyId = Convert.ToInt32(specialty[2..]);
                specialty = null;
            }
            else if (specialty.StartsWith("p-"))
            {
                providerId = Convert.ToInt32(specialty[2..]);
                specialty = null;
            }
            else if (specialty.StartsWith("f-"))
            {
                facilityId = Convert.ToInt32(specialty[2..]);
                specialty = null;
            }
        }

        using (var conn = _db.Connect())
        {
            const string sql = @"
                    SELECT u.id as Id, u.first_name as FirstName, u.last_name as LastName,
	                    u.status as Status, u.image_url AS ImageUrl,
	                    d.biography as Biography, s.specialty_name as SpecialtyName,
	                    array_to_string(d.tags, ',') TagsString,
	                    f.facility_name as FacilityName,
	                    ds.cancellation_policy_days as CancellationPolicyDays, ds.doctor_id AS SlotDoctorId,
                        ad.city AS City, ad.state_abbr AS StateAbbr
                    FROM (doctors d INNER JOIN users u ON d.user_id = u.id)
                    INNER JOIN specialties s ON d.specialty_id = s.id
                    LEFT JOIN doctor_slots ds ON d.user_id = ds.doctor_id
                    LEFT JOIN facilities f ON d.facility_id = f.id
                    INNER JOIN addresses ad ON coalesce(d.address_id, f.address_id) = ad.id
                    WHERE u.status IN ('Active', 'Published')
                        -- AND (@specialty IS NULL OR s.specialty_name ILIKE @specialty)
                        AND (@specialtyId IS NULL OR s.id = @specialtyId)
                        AND (@providerId IS NULL OR d.user_id = @providerId)
                        AND (@facilityId IS NULL OR f.id = @facilityId)
                        AND (@city IS NULL OR ad.city ILIKE @city)
                        AND (@stateAbbr IS NULL OR ad.state_abbr ILIKE @stateAbbr)
                        AND (@id IS NULL OR u.id = @id);";

            #region Commented query

            //$@"SELECT doc.id AS Id, doc.first_name AS FirstName, doc.last_name AS LastName,
            //doc.middle_name AS MiddleName, doc.biography AS Biography, doc.specialty_name AS SpecialtyName,
            //doc.tags AS TagsString, doc.facility_id AS FacilityId, doc.facility_name AS FacilityName,
            //doc.address_id AS AddressId,
            //doc.is_accept_new AS IsAcceptNew, doc.is_auto_approve AS IsAutoApprove,
            //doc.cancellation_policy_days AS CancellationPolicyDays,
            //pc.id AS PostalCodeId, pc.city AS City, pc.province_abbr AS ProvinceAbbr
            //FROM
            //    (SELECT u.id, u.first_name, u.last_name, u.middle_name, u.status,
            //    d.biography, s.specialty_name, array_to_string(d.tags, ',') tags,
            //    f.id facility_id, f.facility_name, coalesce(d.address_id, f.address_id) address_id,
            //    ds.is_accept_new, ds.is_auto_approve, ds.cancellation_policy_days
            //    FROM doctors d
            //    INNER JOIN users u ON d.user_id = u.id
            //    INNER JOIN specialties s ON d.specialty_id = s.id
            //    LEFT JOIN doctor_slots ds ON d.user_id = ds.doctor_id
            //    LEFT JOIN facilities f ON d.facility_id = f.id
            //    ) doc
            //INNER JOIN (addresses ad INNER JOIN postal_codes pc ON ad.postal_code_id = pc.id) ON doc.address_id = ad.id
            //WHERE doc.status IN ('Active', 'Published')
            //AND (@specialty IS NULL OR doc.specialty_name ILIKE @specialty)
            //AND (@city IS NULL OR pc.city ILIKE @city)
            //AND (@provinceAbbr IS NULL OR pc.province_abbr ILIKE @provinceAbbr)
            //AND (@id IS NULL OR doc.id = @id);";
            // "SELECT * FROM fn_search_providers(@specialty, @city, @provinceAbbr, @id);"

            #endregion Commented query

            var providers = await conn.QueryAsync<SearchProviderDto>(sql, new { specialtyId, providerId, facilityId, city, stateAbbr, id });

            var searchProviders = providers as SearchProviderDto[] ?? providers.ToArray();
            foreach (var provider in searchProviders)
            {
                if (provider.Status == "Published")
                    continue;

                //provider.Slots = (await GetProviderSlots(conn, provider.Id, date)).ToList();
                provider.Treatments = (await GetTreatments(conn, provider.Id)).ToList();
                if (!provider.Treatments.Any()) continue;
                var defaultTreatment = provider.Treatments.Find(t => t.IsDefault);
                if (defaultTreatment == null)
                {
                    defaultTreatment = provider.Treatments[^1]; // last treatment as default one
                    defaultTreatment.IsDefault = true;
                }
                provider.Slots = (await GetProviderSlots(conn, provider.Id, defaultTreatment.TreatmentId, date)).ToList();
            }

            var sortedProviders = from s in searchProviders
                                  orderby s.Status, s.SlotDoctorId descending, s.Slots?.Count descending
                                  select s;
            return sortedProviders;
        }
    }

    public async Task<List<DoctorTreatmentDto>> GetTreatments(int doctorId)
    {
        using (var conn = _db.Connect())
        {
            return await GetTreatments(conn, doctorId);
        }
    }

    public async Task<List<SearchProviderSlotDto>> GetProviderSlots(int doctorId, int treatmentId, DateTime? date = null)
    {
        using (var conn = _db.Connect())
        {
            return await GetProviderSlots(conn, doctorId, treatmentId, date);
        }
    }

    public async Task<List<DoctorTreatmentDto>> GetTreatments(IDbConnection conn, int doctorId)
    {
        return (await conn.QueryAsync<DoctorTreatmentDto>(DoctorSlotQueries.TreatmentGetAll, new { doctorId }))
            .ToList();
    }

    private static async Task<List<SearchProviderSlotDto>> GetProviderSlots(IDbConnection conn,
        int doctorId, int treatmentId, DateTime? date = null)
    {
        var slots = (await conn.QueryAsync<SearchProviderSlotDto>(
            "SELECT * FROM fn_search_provider_slots2(@doctorId, @treatmentId, @date);",
            new { doctorId, treatmentId, date = date?.ToString("yyyy-MM-dd") })).ToList();
        return slots;
    }
}