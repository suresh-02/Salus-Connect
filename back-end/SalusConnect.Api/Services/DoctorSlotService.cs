namespace SalusConnect.Api.Services;

public interface IDoctorSlotService
{
    Task<DoctorSlotDto> CreateSlot(int doctorId, DoctorSlotDto slot);

    Task UpdateSlot(int doctorId, DoctorSlotDto slot);

    Task<DoctorSlotDto> GetSlot(int doctorId);
}

public class DoctorSlotService : IDoctorSlotService
{
    private readonly IDatabaseHelper _db;
    private readonly IProviderService _providerService;

    public DoctorSlotService(IDatabaseHelper db, IProviderService providerService)
    {
        _db = db;
        _providerService = providerService;
    }

    #region Doctor Slots

    public async Task<DoctorSlotDto> CreateSlot(int doctorId, DoctorSlotDto slot)
    {
        if (doctorId != slot.DoctorId)
        {
            throw new BadRequestException("Doctor id is not match.");
        }

        using (var tranScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            using (var conn = _db.Connect())
            {
                await CreateSlot(conn, slot);

                // Treatments
                foreach (var treatment in slot.Treatments)
                {
                    treatment.DoctorId = slot.DoctorId;
                    int treatmentId = await conn.ExecuteScalarAsync<int>(DoctorSlotQueries.TreatmentCreate, treatment);
                    treatment.TreatmentId = treatmentId;
                }

                // Exceptions
                foreach (var exception in slot.SlotExceptions)
                {
                    exception.DoctorId = slot.DoctorId;
                    int exceptionId = await conn.ExecuteScalarAsync<int>(DoctorSlotQueries.SlotExceptionCreate, exception);
                    exception.ExceptionId = exceptionId;
                }
            }
            tranScope.Complete();
        }
        return slot;
    }

    private static async Task CreateSlot(IDbConnection conn, DoctorSlotDto slot)
    {
        await conn.ExecuteAsync(DoctorSlotQueries.DoctorSlotCreate, slot);
    }

    public async Task UpdateSlot(int doctorId, DoctorSlotDto slot)
    {
        if (doctorId != slot.DoctorId)
        {
            throw new BadRequestException("Doctor id not match to update.");
        }

        using (var tranScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            using (var conn = _db.Connect())
            {
                if (await IsSlotIdExists(conn, slot.DoctorId))
                {
                    await conn.ExecuteAsync(DoctorSlotQueries.DoctorSlotUpdate, slot);
                }
                else
                {
                    await CreateSlot(conn, slot);
                }

                // Treatments
                await SaveTreatments(conn, slot.DoctorId, slot.Treatments);

                // Exceptions
                await SaveExceptions(conn, slot.DoctorId, slot.SlotExceptions);
            }
            tranScope.Complete();
        }
    }

    public async Task<DoctorSlotDto> GetSlot(int doctorId)
    {
        using (var conn = _db.Connect())
        {
            var slot = await conn.QuerySingleOrDefaultAsync<DoctorSlotDto>(DoctorSlotQueries.DoctorSlotGetOne, new { doctorId });

            if (slot != null)
            {
                // Treatments
                var treatments = await _providerService.GetTreatments(conn, doctorId);
                slot.Treatments = treatments;

                // Exceptions
                var exceptions = (await conn.QueryAsync<SlotExceptionDto>(DoctorSlotQueries.SlotExceptionGetAll, new { doctorId })).ToList();
                slot.SlotExceptions = exceptions;
            }
            else
            {
                slot = new DoctorSlotDto
                {
                    DoctorId = doctorId,
                    Treatments = new List<DoctorTreatmentDto>(),
                    SlotExceptions = new List<SlotExceptionDto>()
                };
            }

            return slot;
        }
    }

    #endregion Doctor Slots

    #region Private methods

    private static async Task SaveExceptions(IDbConnection conn, int doctorId, List<SlotExceptionDto> exceptions)
    {
        // get ids from database
        string sql = "SELECT id FROM doctor_slot_exceptions WHERE doctor_id = @doctorId";
        List<int> dbIds = (await conn.QueryAsync<int>(sql, new { doctorId })).ToList();

        // delete all exceptions that are no longer exists
        int[] delIds = dbIds.Where(dbId => exceptions.All(slot => dbId != slot.ExceptionId)).ToArray();
        sql = "DELETE FROM doctor_slot_exceptions WHERE id = ANY(@delIds)";
        await conn.ExecuteAsync(sql, new { delIds });

        // save exceptions
        foreach (SlotExceptionDto exception in exceptions)
        {
            exception.DoctorId = doctorId;
            if (exception.ExceptionId == 0)
            {
                await conn.ExecuteAsync(DoctorSlotQueries.SlotExceptionCreate, exception);
            }
            else
            {
                await conn.ExecuteAsync(DoctorSlotQueries.SlotExceptionUpdate, exception);
            }
        }
    }

    private static async Task SaveTreatments(IDbConnection conn, int doctorId, List<DoctorTreatmentDto> treatments)
    {
        // get ids from database
        string sql = "SELECT id FROM doctor_treatments WHERE doctor_id = @doctorId";
        List<int> dbIds = (await conn.QueryAsync<int>(sql, new { doctorId })).ToList();

        // delete all treatments that are no longer exists
        int[] delIds = dbIds.Where(dbId => treatments.All(treatment => dbId != treatment.TreatmentId)).ToArray();
        sql = "DELETE FROM doctor_treatments WHERE id = ANY(@delIds)";
        await conn.ExecuteAsync(sql, new { delIds });

        // save treatments
        foreach (DoctorTreatmentDto treatment in treatments)
        {
            treatment.DoctorId = doctorId;
            if (treatment.TreatmentId == 0)
            {
                await conn.ExecuteAsync(DoctorSlotQueries.TreatmentCreate, treatment);
            }
            else
            {
                await conn.ExecuteAsync(DoctorSlotQueries.TreatmentUpdate, treatment);
            }
        }
    }

    private static async Task<bool> IsSlotIdExists(IDbConnection conn, int doctorId)
    {
        bool exists = await conn.ExecuteScalarAsync<bool>("SELECT EXISTS(" +
                                                          "SELECT 1 FROM doctor_slots WHERE doctor_id = @doctorId);", new { doctorId });
        return exists;
    }

    #endregion Private methods
}

internal class DoctorSlotQueries
{
    internal const string DoctorSlotCreate = @"
            INSERT INTO doctor_slots (doctor_id, cancellation_policy_days, date_range)
            VALUES (@DoctorId, @CancellationPolicyDays, @DateRangeString::daterange);";

    internal const string DoctorSlotUpdate = @"
            UPDATE doctor_slots SET
                cancellation_policy_days = @CancellationPolicyDays,
                date_range = @DateRangeString::daterange
            WHERE doctor_id = @DoctorId;";

    internal const string DoctorSlotGetOne = @"
            SELECT ds.doctor_id AS DoctorId,
                ds.cancellation_policy_days AS CancellationPolicyDays, ds.date_range::text AS DateRangeString
            FROM doctor_slots ds
            WHERE ds.doctor_id = @doctorId;";

    internal const string TreatmentCreate = @"
            INSERT INTO doctor_treatments ( doctor_id, nick_name, treatment_type, treatment_description, time_range,
                duration_min, break_min, treatment_days, exclude_holidays,
                insurance_coverage, fee_per_visit, is_default )
            VALUES ( @DoctorId, @Nickname, @TreatmentType, @Description, @TimeRangeString::timerange,
                @DurationMinutes, @BreakMinutes, string_to_array(@TreatmentDaysString, ',')::int[],
                @ExcludeHolidays, @InsuranceCoverageString::insurancecoverage, @FeePerVisit, @IsDefault )
            RETURNING id;";

    internal const string TreatmentUpdate = @"
            UPDATE doctor_treatments SET
                nick_name = @Nickname,
                treatment_type = @TreatmentType,
                treatment_description = @Description,
                time_range = @TimeRangeString::timerange,
                duration_min = @DurationMinutes,
                break_min = @BreakMinutes,
                treatment_days = string_to_array(@TreatmentDaysString, ',')::int[],
                exclude_holidays = @ExcludeHolidays,
                insurance_coverage = @InsuranceCoverageString::insurancecoverage,
                fee_per_visit = @FeePerVisit,
                is_default = @IsDefault
            WHERE id = @TreatmentId;";

    internal const string TreatmentGetAll = @"
            SELECT dt.id AS TreatmentId, dt.doctor_id AS DoctorId, nick_name AS Nickname, treatment_type AS TreatmentType,
                treatment_description AS Description, dt.time_range::text AS TimeRangeString,
                duration_min AS DurationMinutes, break_min AS BreakMinutes, array_to_string(treatment_days, ',') AS TreatmentDaysString,
                exclude_holidays AS ExcludeHolidays,
                insurance_coverage::text AS InsuranceCoverageString, fee_per_visit AS FeePerVisit, is_default AS IsDefault
            FROM doctor_treatments dt
            WHERE dt.doctor_id = @doctorId
            ORDER BY dt.id;";

    internal const string SlotExceptionCreate = @"
            INSERT INTO doctor_slot_exceptions ( doctor_id, exception_date, exception_time_range, not_available )
            VALUES ( @DoctorId, @ExceptionDate::date, @ExceptionTimeRangeString::timerange, @NotAvailable );";

    internal const string SlotExceptionUpdate = @"
            UPDATE doctor_slot_exceptions SET
                exception_date = @ExceptionDate::date,
                exception_time_range = @ExceptionTimeRangeString::timerange,
                not_available = @NotAvailable
            WHERE id = @ExceptionId;";

    internal const string SlotExceptionGetAll = @"
            SELECT id AS ExceptionId, doctor_id AS DoctorId, exception_date::text AS ExceptionDate,
                exception_time_range::text AS ExceptionTimeRangeString, not_available AS NotAvailable
            FROM doctor_slot_exceptions
            WHERE doctor_id = @doctorId
            ORDER BY exception_date;";

    //internal const string DateSlotCreate =
    //    $@"INSERT INTO date_slots ( doctor_id, slot_date, slot_times )
    //    VALUES ( @DoctorId, @SlotDate::date, string_to_array(@SlotTimesString, ',')::time[] )
    //    RETURNING id;";

    //internal const string DateSlotUpdate =
    //    $@"UPDATE date_slots SET slot_date = @SlotDate::date, slot_times = string_to_array(@SlotTimesString, ',')::time[]
    //    WHERE id = @DateSlotId;";

    //internal const string DateSlotGetAll =
    //    $@"SELECT ds.id AS DateSlotId, ds.doctor_id AS DoctorId, ds.slot_date::varchar AS SlotDate, array_to_string(ds.slot_times, ',') AS SlotTimesString
    //    FROM date_slots ds
    //    WHERE ds.doctor_id = @doctorId AND ds.slot_date >= current_date;";
}