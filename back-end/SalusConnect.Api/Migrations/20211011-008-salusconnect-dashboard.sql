create or replace function fn_dashboard_appointments (
	_patients_rc refcursor,
	_appointments_rc refcursor,
	_cancel_rc refcursor,
	_book_rc refcursor,
	_facility_id int default null,
	_doctor_id int default null,
	_treatment_id int default null,
	_from_date varchar default null,
	_to_date varchar default null
) returns setof refcursor language 'plpgsql' as
$$
begin
	-- patients (new or returning)
	open _patients_rc for
	select 
		sum(case when rn = 1 then 1 else null end) NewPatients,
		sum(case when rn != 1 then 1 else null end) ReturningPatients
	from
	(
		select a.treatment_id, a.appointment_date,
			row_number() over (partition by a.doctor_id, a.patient_id order by a.id) as rn
		from appointments a
		where a.complete_status = 'Complete' and 
			( _facility_id is null or a.doctor_id in (select user_id from doctors where facility_id = _facility_id) ) and
			( _doctor_id is null or a.doctor_id = _doctor_id ) and 
			( _from_date is null or a.appointment_date >= to_date(_from_date, 'yyyy-mm-dd') ) and 
			( _to_date is null or a.appointment_date <= to_date(_to_date, 'yyyy-mm-dd') )
	) a;
	return next _patients_rc;
	
	-- appointments
	open _appointments_rc for
	select sum(case when a.appointment_status='Accepted' then a.count else null end) AcceptedCount,
		sum(case when a.complete_status='Complete' then a.count else null end) CompletedCount,
		sum(case when a.parent_id is not null then a.count else null end) FollowupCount,
		sum(case when a.appointment_status='ProposeNew' then a.count else null end) RescheduledCount,
		sum(case when a.complete_status='NoShow' then a.count else null end) NoShowCount
	from
	(
		select a.doctor_id, as2.appointment_status, a.complete_status, a.parent_id, count(*)
		from appointments a 
		inner join appointment_statuses as2 on a.id = as2.appointment_id
		where ( as2.appointment_status in ('Accepted', 'ProposeNew') or complete_status in('Complete', 'NoShow') or a.parent_id is not null)
			and
			( _facility_id is null or a.doctor_id in (select user_id from doctors where facility_id = _facility_id) ) and
			( _doctor_id is null or a.doctor_id = _doctor_id ) and 
			( _treatment_id is null or a.treatment_id = _treatment_id ) and 
			( _from_date is null or a.appointment_date >= to_date(_from_date, 'yyyy-mm-dd') ) and 
			( _to_date is null or a.appointment_date <= to_date(_to_date, 'yyyy-mm-dd') )
		group by a.doctor_id, as2.appointment_status, a.complete_status, a.parent_id 
		order by a.doctor_id, as2.appointment_status
	) a;
	return next _appointments_rc;

	-- cancelled
	open _cancel_rc for
	select sum(case when a.appointment_status='Rejected' then a.count else null end) CancelledByDoctorCount,
		sum(case when a.appointment_status='Cancelled' or a.complete_status = 'NoShow' then a.count else null end) CancelledByPatientCount
	from
	(
		select a.doctor_id, as2.appointment_status, a.complete_status, count(*)
		from appointments a 
		inner join appointment_statuses as2 on a.id = as2.appointment_id
		where (as2.appointment_status in ('Cancelled', 'Rejected') or a.complete_status = 'NoShow')
			and
			( _facility_id is null or a.doctor_id in (select user_id from doctors where facility_id = _facility_id) ) and
			( _doctor_id is null or a.doctor_id = _doctor_id ) and 
			( _treatment_id is null or a.treatment_id = _treatment_id ) and 
			( _from_date is null or a.appointment_date >= to_date(_from_date, 'yyyy-mm-dd') ) and 
			( _to_date is null or a.appointment_date <= to_date(_to_date, 'yyyy-mm-dd') )
		group by a.doctor_id, as2.appointment_status, a.complete_status
		order by a.doctor_id
	) a;
	return next _cancel_rc;
	
	-- booking efficiency
	open _book_rc for
	select doctor_id as DoctorId, avg( extract(epoch from ( end_date - start_date ) ) )::int EfficiencySeconds
	from
	(
		select doctor_id, appointment_id, max(start_date) start_date, max(end_date) end_date
		from 
		(
			select doctor_id, appointment_id, (case when rn=1 then updated_at else null end) start_date,
				(case when rn=2 then updated_at else null end) end_date
			from
			(
				select a.doctor_id, as2.appointment_id, as2.updated_at,
					row_number() over (partition by as2.appointment_id order by as2.appointment_id, as2.updated_at) rn
				from appointments a 
				inner join appointment_statuses as2 on a.id = as2.appointment_id
				where as2.appointment_status in ('Requested', 'Accepted', 'Rejected', 'ProposeNew')
					and
					( _facility_id is null or a.doctor_id in (select user_id from doctors where facility_id = _facility_id) ) and
					( _doctor_id is null or a.doctor_id = _doctor_id ) and 
					( _treatment_id is null or a.treatment_id = _treatment_id ) and 
					( _from_date is null or a.appointment_date >= to_date(_from_date, 'yyyy-mm-dd') ) and 
					( _to_date is null or a.appointment_date <= to_date(_to_date, 'yyyy-mm-dd') )
			) i1
			where rn in(1,2)
		) i2
		group by doctor_id, appointment_id
	) a
	where end_date is not null
	group by doctor_id;
	return next _book_rc;
end;
$$;

create or replace function fn_dashboard_revenue (
	_patients_rc refcursor,
	_fee_rc refcursor,
	_cancel_rc refcursor,
	_facility_id int default null,
	_doctor_id int default null,
	_treatment_id int default null,
	_from_date varchar default null,
	_to_date varchar default null
) returns setof refcursor language 'plpgsql' as
$$
begin
	-- patient type (new or returning)
	open _patients_rc for
	select sum(case when rn = 1 then fee_amount else 0.0 end) NewPatients,
		sum(case when rn != 1 then fee_amount else 0.0 end) ReturningPatients
	from
	(
		select case when coalesce(a.billed_amount, 0.0) = 0.0 then coalesce(a.fee_per_visit, 0.0) else a.billed_amount end fee_amount, 
			a.treatment_id, a.appointment_date,
			row_number() over (partition by a.doctor_id, a.patient_id order by a.id) as rn
		from appointments a
		where a.complete_status = 'Complete' and 
			( _facility_id is null or a.doctor_id in (select user_id from doctors where facility_id = _facility_id) ) and
			( _doctor_id is null or a.doctor_id = _doctor_id ) and 
			( _from_date is null or a.appointment_date >= to_date(_from_date, 'yyyy-mm-dd') ) and 
			( _to_date is null or a.appointment_date <= to_date(_to_date, 'yyyy-mm-dd') )

	) a;
	return next _patients_rc;
	
	-- fee charged
	open _fee_rc for
	select sum(fee_per_visit) StatedFee, sum(billed_amount) ActualBilled
	from
	(
		select sum(coalesce(a.fee_per_visit,0.0)) fee_per_visit, sum(coalesce(a.billed_amount,0.0)) billed_amount
		from appointments a 
		where a.complete_status = 'Complete' 
			and
			( _facility_id is null or a.doctor_id in (select user_id from doctors where facility_id = _facility_id) ) and
			( _doctor_id is null or a.doctor_id = _doctor_id ) and 
			( _treatment_id is null or a.treatment_id = _treatment_id ) and 
			( _from_date is null or a.appointment_date >= to_date(_from_date, 'yyyy-mm-dd') ) and 
			( _to_date is null or a.appointment_date <= to_date(_to_date, 'yyyy-mm-dd') )
	) a;
	return next _fee_rc;

	-- loss from cancellations
	open _cancel_rc for
	select sum(case when a.appointment_status='Rejected' then a.sum else null end) CancelledByDoctorAmount,
		sum(case when a.appointment_status='Cancelled' or a.complete_status = 'NoShow' then a.sum else null end) CancelledByPatientAmount
	from
	(
		select a.doctor_id, as2.appointment_status, a.complete_status, sum(coalesce(a.billed_amount, a.fee_per_visit))
		from appointments a 
		inner join appointment_statuses as2 on a.id = as2.appointment_id
		where (as2.appointment_status in ('Cancelled', 'Rejected') or complete_status = 'NoShow')
			and
			( _facility_id is null or a.doctor_id in (select user_id from doctors where facility_id = _facility_id) ) and
			( _doctor_id is null or a.doctor_id = _doctor_id ) and 
			( _treatment_id is null or a.treatment_id = _treatment_id ) and 
			( _from_date is null or a.appointment_date >= to_date(_from_date, 'yyyy-mm-dd') ) and 
			( _to_date is null or a.appointment_date <= to_date(_to_date, 'yyyy-mm-dd') )
		group by a.doctor_id, as2.appointment_status, a.complete_status 
		order by a.doctor_id
	) a;
	return next _cancel_rc;
end;
$$;
