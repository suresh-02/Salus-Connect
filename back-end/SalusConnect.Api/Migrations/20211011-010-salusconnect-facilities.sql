/**********************************************************
*
*	DELETE FACILITY
*
**********************************************************/
CREATE OR REPLACE FUNCTION fn_facility_delete (
	_id INT
) RETURNS void LANGUAGE 'plpgsql' AS
$BODY$

	DECLARE _address_id int;
		_doctor_ids int[];

    BEGIN
		_address_id := (SELECT address_id FROM facilities WHERE id = _id);
		_doctor_ids := ARRAY(SELECT user_id FROM doctors WHERE facility_id = _id);

		-- doctors and users
		DELETE FROM doctors WHERE facility_id = _id;
		DELETE FROM users WHERE id = ANY(_doctor_ids);

		DELETE FROM facilities WHERE id = _id;
		DELETE FROM addresses WHERE id = _address_id;
    END;

$BODY$;

/**********************************************************
*
*	UPDATE STATUS FACILITY
*
**********************************************************/
CREATE OR REPLACE FUNCTION fn_facility_update_status (
	_id INT,
	_status varchar 
) RETURNS void LANGUAGE 'plpgsql' AS
$BODY$

    BEGIN
		-- Facility
		UPDATE facilities SET status = _status::userstatus, updated_at = now() at time zone 'Asia/Kolkata' 
		WHERE id = _id;
		-- Doctors
		UPDATE users SET status = _status::userstatus, updated_at = now() at time zone 'Asia/Kolkata' 
		FROM doctors, facilities 
		WHERE doctors.facility_id = facilities.id 
		AND doctors.user_id = users.id
		AND facilities.id = _id;
    END;

$BODY$;
