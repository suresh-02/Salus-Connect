/**********************************************************
*
*	get all booked appointments by patient id
*
**********************************************************/
CREATE OR REPLACE FUNCTION fn_patient_get_appointments (_patient_id int) 
RETURNS TABLE(AppointmentId int, AppointmentDate date, AppointmentTime varchar, DurationMin int, 
	AppointmentCode varchar, ParentId int, Symptoms text,
    TreatmentId int, TreatmentNickName text, TreatmentType text, TreatmentDescription text, 
    TreatmentFees numeric(10,2), TreatmentInsuranceCoverage text,
    DoctorName varchar, FacilityName varchar, CancellationPolicyDays int,
    Status varchar, IsRead bool, NewAppointmentTime varchar,
	AddressId int, Address varchar, Location varchar) LANGUAGE 'plpgsql' AS
$BODY$
	BEGIN
		RETURN QUERY
		SELECT t.*,
			(a2.address_line1 || ',' || a2.address_line2)::varchar AS address,
			(a2.city || ' ' || a2.state_abbr)::varchar AS Location
		FROM (
			SELECT 
			a.id,
			a.appointment_date, 
			a.appointment_time::varchar, 
			a.duration_min, 
			a.appointment_code, 
            a.parent_id,
            a.symptoms,
            t.id AS treatment_id, t.nick_name, t.treatment_type, t.treatment_description, 
            t.fee_per_visit, t.insurance_coverage::text, 
			-- pu.first_name || ' ' || pu.last_name as patient_name,
			(du.first_name || ' ' || du.last_name)::varchar AS doctor_name,
			f.facility_name,
            ds.cancellation_policy_days,
			it.appointment_status::varchar, 
			it.read_status, 
			a.new_appointment_time::varchar, 
			coalesce(d.address_id, f.address_id) AS address_id 
			FROM appointments a 
			INNER JOIN 
				(SELECT appointment_id, appointment_status,  
					(CASE WHEN notify_party='Patient' THEN read_status ELSE NULL END) AS read_status, 
					row_number() OVER (PARTITION BY appointment_id ORDER BY updated_at DESC) AS rn
				FROM appointment_statuses apst
				) it ON a.id = it.appointment_id 
			--inner join (patients p inner join users pu on p.user_id = pu.id) on a.patient_id = p.user_id 
            INNER JOIN doctor_treatments t ON a.treatment_id = t.id
			INNER JOIN ((doctors d LEFT JOIN facilities f ON d.facility_id = f.id) INNER JOIN users du ON d.user_id = du.id) 
                ON a.doctor_id = d.user_id
            INNER JOIN doctor_slots ds ON d.user_id = ds.doctor_id
			WHERE a.patient_id = _patient_id AND it.rn = 1 AND a.appointment_date >= CURRENT_DATE
			--(a.appointment_date||'T'|| appointment_time)::timestamp >= NOW()
		) t
		LEFT JOIN addresses a2 ON t.address_id = a2.id
		ORDER BY t.appointment_date, t.appointment_time;
	END;
$BODY$;

/**********************************************************
*
*	get all booked appointments by doctor id
*
**********************************************************/
CREATE OR REPLACE FUNCTION fn_doctor_get_appointments (
    _doctor_id int,
    _date_from text DEFAULT NULL,
    _date_to text DEFAULT NULL
) 
RETURNS TABLE(AppointmentId int, AppointmentDate date, AppointmentTime varchar, DurationMin int, 
	AppointmentCode varchar, ParentId int, CompleteStatus text, Symptoms text, DoctorNotes text, 
    BilledAmount numeric(10,2),
    TreatmentId int, TreatmentNickName text, TreatmentType text, TreatmentDescription text, 
    TreatmentFees numeric(10,2), TreatmentInsuranceCoverage text,
    PatientName varchar, PhoneNumber varchar, EmailAddress varchar, 
    Status varchar, IsRead boolean, NewAppointmentTime varchar, 
    AddressId int, Address varchar, Location varchar) LANGUAGE 'plpgsql' AS
$BODY$
	BEGIN
		RETURN QUERY
        SELECT 
        a.id,
        a.appointment_date, 
        a.appointment_time::varchar, 
        a.duration_min, 
        a.appointment_code, 
        a.parent_id,
        a.complete_status::text, 
        a.symptoms,
        a.doctor_notes,
        a.billed_amount,
        t.id AS treatment_id, t.nick_name, t.treatment_type, t.treatment_description, 
        t.fee_per_visit, t.insurance_coverage::text, 
        -- pu.first_name || ' ' || pu.last_name as patient_name,
        (pu.first_name || ' ' || pu.last_name)::varchar AS patient_name, 
        pu.phone_number, pu.email_address, 
		s.appointment_status::varchar, 
		s.read_status, 
		a.new_appointment_time::varchar, 
        p.address_id, 
        (a2.address_line1 || ', ' || a2.address_line2)::varchar AS address, 
        (a2.city || ' ' || a2.state_abbr)::varchar AS Location 
        FROM appointments a 
		INNER JOIN 
			(SELECT appointment_id, appointment_status,  
				(CASE WHEN notify_party='Provider' THEN read_status ELSE NULL END) AS read_status, 
				row_number() OVER (PARTITION BY appointment_id ORDER BY updated_at desc) as rn
			FROM appointment_statuses apst
			) s ON a.id = s.appointment_id 
        INNER JOIN doctor_treatments t ON a.treatment_id = t.id
        INNER JOIN (patients p INNER JOIN users pu ON p.user_id = pu.id) ON a.patient_id = p.user_id 
        LEFT JOIN addresses a2 ON p.address_id = a2.id
        WHERE a.doctor_id = _doctor_id AND s.rn = 1 AND
			( 
                (_date_from IS NULL OR (a.appointment_date||'T'|| appointment_time)::timestamp >= to_date(_date_from,'YYYY-MM-DD'))
			    AND (_date_to IS NULL OR (a.appointment_date||'T'|| appointment_time) <= _date_to||'T'||'23:59:59')
            )
		ORDER BY a.appointment_date, a.appointment_time;
	END;
$BODY$;

/**********************************************************
*
*	GET DOCTOR NOTIFICATION COUNT
*
**********************************************************/
CREATE OR REPLACE FUNCTION fn_doctor_notification_count(_doctor_id int) 
RETURNS int LANGUAGE 'plpgsql' AS
$BODY$
	DECLARE _notification_count int;
	BEGIN

		_notification_count := (SELECT COUNT(*)
			FROM appointments a 
			INNER JOIN 
				(SELECT appointment_id, 
					(CASE WHEN appointment_status='Requested' THEN 1 ELSE NULL END) AS requested, 
					row_number() OVER (PARTITION BY appointment_id ORDER BY updated_at desc) as rn
				FROM appointment_statuses apst
				) t ON a.id = t.appointment_id 
			WHERE a.doctor_id = _doctor_id AND t.rn = 1 AND t.requested = 1 AND
			a.appointment_date >= CURRENT_DATE);

		RETURN _notification_count;
	END;
$BODY$;

/**********************************************************
*
*	UPDATE APPOINTMENT STATUS BY APPOINTMENT ID (updated)
*
**********************************************************/
CREATE OR REPLACE FUNCTION fn_appointment_update_status (
	_appointment_id int,
	_appointment_status varchar,
	_notify_party varchar,
	_new_time varchar DEFAULT NULL) 
RETURNS table(AppointmentId int, AppointmentCode varchar, AppointmentDate date,
	AppointmentTime varchar, DurationMinutes int, PatientId int, 
    ProviderName text, FacilityName varchar, PhoneNumber varchar, EmailAddress varchar, 
    PatientName text, PatientEmailAddress varchar, 
    AddressId int, AddressLine1 varchar, AddressLine2 varchar, 
    City varchar, StateAbbr varchar, PostalCode varchar) LANGUAGE 'plpgsql' AS
$BODY$
	BEGIN
		INSERT INTO appointment_statuses(appointment_id, appointment_status, notify_party, 
			updated_at, read_status)
		VALUES(_appointment_id, _appointment_status::appointmentstatus, _notify_party::notifyparty, 
			now() at time zone 'Asia/Kolkata', false);
		
		IF _appointment_status ILIKE 'Confirmed' THEN
			UPDATE appointments SET appointment_date = to_date(_new_time, 'yyyy-mm-dd'), 
				appointment_time = _new_time::time,
                new_appointment_time = NULL,
                current_status = _appointment_status::appointmentstatus
			WHERE id = _appointment_id;
        ELSIF _new_time IS NOT NULL THEN
            UPDATE appointments SET new_appointment_time = _new_time::timestamp,
                current_status = _appointment_status::appointmentstatus
            WHERE id = _appointment_id;
        ELSE
            UPDATE appointments SET current_status = _appointment_status::appointmentstatus
            WHERE id = _appointment_id;
		END IF;
        
        RETURN QUERY SELECT * FROM fn_appointment_getone(_appointment_id);
	END;
$BODY$;


/**********************************************************
*
*   GET LOCATION FOR SEARCH (updated)
*
**********************************************************/
-- DROP FUNCTION fn_search_locations;
CREATE OR REPLACE FUNCTION fn_search_locations (
    _loc_type varchar,
    _location varchar DEFAULT NULL
) RETURNS TABLE(City varchar, StateAbbr varchar) LANGUAGE 'plpgsql' AS
$BODY$
    BEGIN        
        IF _loc_type ILIKE 'City' THEN
        	RETURN QUERY
            SELECT DISTINCT a2.city, a2.state_abbr
            FROM addresses a2 
            WHERE a2.city ILIKE _location || '%'
            ORDER BY a2.city;
        ELSE
        	RETURN QUERY
            SELECT DISTINCT a2.city, a2.state_abbr
            FROM addresses a2 
            WHERE a2.postal_code ILIKE _location || '%'
            ORDER BY a2.city;
        END IF;
    END;
$BODY$;


create or replace function fn_search_provider_slots2 (
    _doctor_id int, 
    _treatment_id int,
    _date text default null
) returns table(DoctorId int, SlotDate date, SlotTimes text, DurationMinutes int) language 'plpgsql' as
$body$
    
    declare _date_diff int; _start_date date; _end_date date; --_date_range daterange;
    
    begin
	    if _date is null then
			select t.start_date, t.end_date into _start_date, _end_date
			from
			(
				select lower(ec.date_range) as start_date, upper(ec.date_range)-1 as end_date
				from doctor_slots ec 
				where ec.doctor_id = _doctor_id
			) t
			where t.start_date is not null and t.end_date is not null;
	    else
	        _date_diff := extract(day from to_date(_date, 'yyyy-mm-dd')::timestamp - CURRENT_DATE);
			
	        if _date_diff <= 3 then
	            _start_date := CURRENT_DATE;
	            _end_date   := _start_date + interval '6 days'; 
	        elsif _date_diff > 3 then
	            _start_date := _date::date + make_interval(days => -3);
	            _end_date   := _start_date + interval '6 days'; 
	        end if;
       	end if;

        return query
        select slots.doctor_id, slots.slot_date, string_agg(slots.slot_time::text, ',' order by slot_time) time_str, slots.duration_min 
        from
        (
            select dsdt.doctor_id, dsdt.slot_date, 
                fn_generate_times(coalesce(dse.exception_time_range, dsdt.time_range), dsdt.duration_min, dsdt.break_min) as slot_time,
                dsdt.duration_min, dsdt.exclude_holidays, dsdt.state_abbr
            from
            (
                select ds.doctor_id, generate_series( lower(ds.date_range), upper(ds.date_range)-1, '1 day' )::date slot_date,
                    dt.time_range, dt.duration_min, dt.break_min, dt.treatment_days, 
                    dt.exclude_holidays,
                    a.state_abbr
                from (doctors d left join facilities f on d.facility_id = f.id)
                inner join addresses a on coalesce(d.address_id, f.address_id) = a.id 
                inner join doctor_slots ds on d.user_id = ds.doctor_id 
                inner join doctor_treatments dt ON ds.doctor_id = dt.doctor_id
                -- apply doctor id and treatment id filter
                where ds.doctor_id = _doctor_id and dt.id = _treatment_id
                and ( ds.date_range && daterange(_start_date, _end_date, '[]') )
            ) dsdt
            left join doctor_slot_exceptions dse on dsdt.doctor_id = dse.doctor_id and dsdt.slot_date = dse.exception_date
            left join ( select hday_date from vw_holidays ) ph on dsdt.slot_date = ph.hday_date
            -- apply treatment days
            where extract(dow from dsdt.slot_date) = ANY(dsdt.treatment_days) 
			-- apply within 7 days (optional)
			and dsdt.slot_date between _start_date and _end_date
            -- apply holidays
            and not (dsdt.exclude_holidays and hday_date is not null)
            -- apply not available exception
            and not (dse.not_available and dse.exception_date is not null)
            order by dsdt.doctor_id, dsdt.slot_date, slot_time
        ) slots
        left join ( appointments appt inner join 
            -- release Cancelled or Rejected slots
            (select appointment_id, appointment_status, row_number() over (partition by appointment_id order by updated_at desc) as rn
			from appointment_statuses) apst on appt.id = apst.appointment_id and apst.rn = 1 and apst.appointment_status not in ('Cancelled','Rejected') )
            on slots.doctor_id = appt.doctor_id and slots.slot_date = appt.appointment_date and --slots.slot_time = appt.appointment_time
            timerange(slots.slot_time, slots.slot_time+make_interval(mins => slots.duration_min), '[]') && 
            timerange(appt.appointment_time, appt.appointment_time+make_interval(mins=> appt.duration_min), '[]')
        -- apply appointment filter
        where appt.id is null        
        -- apply slots greater than current date and time
        and (slots.slot_date || 'T' || slots.slot_time)::timestamp > now()
        group by slots.doctor_id, slots.slot_date, slots.duration_min;
    end;
	
$body$;


CREATE OR REPLACE FUNCTION fn_appointment_getone (
    _appointment_id int
) RETURNS table(AppointmentId int, AppointmentCode varchar, AppointmentDate date,
	AppointmentTime varchar, DurationMinutes int,
    PatientId int,
    ProviderName text, FacilityName varchar, PhoneNumber varchar, EmailAddress varchar, 
    PatientName text, PatientEmailAddress varchar, 
    AddressId int, AddressLine1 varchar, AddressLine2 varchar, 
    City varchar, StateAbbr varchar, PostalCode varchar) LANGUAGE 'plpgsql' AS
$BODY$
BEGIN
    RETURN QUERY 
    SELECT ap.*, 
        addr.address_line1, addr.address_line2, addr.city, addr.state_abbr, addr.postal_code
    FROM (
        SELECT a.id, a.appointment_code, a.appointment_date, a.appointment_time::varchar, 
        a.duration_min, a.patient_id, 
        u.first_name || ' ' || u.last_name AS provider_name, f.facility_name, 
        u.phone_number, u.email_address, 
        pu.first_name || ' ' || pu.last_name as patient_name, pu.email_address as patient_email_address, 
        coalesce(d.address_id, f.address_id) AS address_id
        FROM appointments a 
        INNER JOIN ((doctors d INNER JOIN users u ON d.user_id = u.id) LEFT JOIN facilities f ON d.facility_id = f.id) ON a.doctor_id = d.user_id
        INNER JOIN (patients p INNER JOIN users pu ON p.user_id = pu.id) ON a.patient_id = p.user_id 
        INNER JOIN doctor_slots ds on d.user_id = ds.doctor_id 
        WHERE a.id = _appointment_id) ap
    LEFT JOIN addresses addr ON ap.address_id = addr.id;
END;
$BODY$;

create or replace function fn_patient_book_appointment (
    _patient_id int,
    _doctor_id int,
    _appointment_date varchar,
    _appointment_time varchar,
    _symptoms text,
    _treatment_id int,
    _duration_min int,
    _fee_per_visit numeric(10,2),
    _is_created_by_phone boolean DEFAULT false
) returns table(AppointmentId int, AppointmentCode varchar, AppointmentDate date,
	AppointmentTime varchar, DurationMinutes int, PatientId int, 
    ProviderName text, FacilityName varchar, PhoneNumber varchar, EmailAddress varchar, 
    PatientName text, PatientEmailAddress varchar, 
    AddressId int, AddressLine1 varchar, AddressLine2 varchar, 
    City varchar, StateAbbr varchar, PostalCode varchar) language 'plpgsql' as
$body$

  declare newid int; 
      _appointment_status varchar;
      _doctor_first_name varchar;
      _doctor_last_name varchar;
      _notify_party text;

  begin
    select first_name, last_name        into _doctor_first_name, _doctor_last_name from users where id = _doctor_id;

    -- if _is_auto_approve OR _is_created_by_phone then
    --    _appointment_status := 'Accepted';
    -- else
    _appointment_status := 'Requested';
    -- end if;

    -- if _is_created_by_phone then
    --    _notify_party = 'Patient';
    -- else
    _notify_party = 'Provider';
    -- end if;

    insert into appointments(patient_id, appointment_code, doctor_id, 
        appointment_date, appointment_time, duration_min, symptoms, treatment_id, 
        fee_per_visit, billed_amount, current_status)
    values(_patient_id, fn_generate_appointment_code(_doctor_first_name, _doctor_last_name)::varchar, _doctor_id,
        to_date(_appointment_date, 'yyyy-mm-dd'), _appointment_time::time, _duration_min, _symptoms, _treatment_id,
        _fee_per_visit, _fee_per_visit, _appointment_status::appointmentstatus)
    returning id into newid;    

    insert into appointment_statuses(appointment_id, appointment_status, notify_party, updated_at, read_status)
    values(newid, _appointment_status::appointmentstatus, _notify_party::notifyparty, now() at time zone 'Asia/Kolkata', false);

    RETURN QUERY SELECT * FROM fn_appointment_getone(newid);
  end;
$body$;


create or replace function fn_doctor_book_followup (
    _appointment_id int,
    _appointment_date varchar,
    _appointment_time varchar,
    _treatment_id int
) returns table(AppointmentId int, AppointmentCode varchar, AppointmentDate date,
	AppointmentTime varchar, DurationMinutes int, PatientId int, 
    ProviderName text, FacilityName varchar, PhoneNumber varchar, EmailAddress varchar, 
    PatientName text, PatientEmailAddress varchar, 
    AddressId int, AddressLine1 varchar, AddressLine2 varchar, 
    City varchar, StateAbbr varchar, PostalCode varchar) language 'plpgsql' as
$body$

  declare newid int;
    _doctor_first_name varchar;
    _doctor_last_name varchar;
    _appointment_status appointmentstatus := 'Accepted'::appointmentstatus;

  begin
    select first_name, last_name into _doctor_first_name, _doctor_last_name 
    from users where id = 
      (select doctor_id from appointments where id = _appointment_id);

    insert into appointments(patient_id, appointment_code, doctor_id, 
        appointment_date, appointment_time, duration_min, symptoms, parent_id, treatment_id,
        fee_per_visit, doctor_notes, billed_amount, current_status)
    select patient_id, fn_generate_appointment_code(_doctor_first_name, _doctor_last_name)::varchar, doctor_id,
        to_date(_appointment_date, 'yyyy-mm-dd'), _appointment_time::time, duration_min, 
        symptoms, _appointment_id, _treatment_id, fee_per_visit, doctor_notes, billed_amount,
        _appointment_status
    from appointments    
    where id = _appointment_id
   	returning id into newid;
    
    insert into appointment_statuses(appointment_id, appointment_status, notify_party, updated_at, read_status)
    values(newid, _appointment_status, 'Patient', now() at time zone 'Asia/Kolkata', false);

    RETURN QUERY SELECT * FROM fn_appointment_getone(newid);
  end;
$body$;
