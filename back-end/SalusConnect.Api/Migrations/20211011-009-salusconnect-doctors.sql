/**********************************************************
*
*	DELETE DOCTOR
*
**********************************************************/
CREATE OR REPLACE FUNCTION fn_doctor_delete (
	_user_id INT
) RETURNS void LANGUAGE 'plpgsql' AS
$BODY$

	DECLARE _address_id INT;

    BEGIN
		_address_id := (SELECT address_id FROM doctors WHERE user_id = _user_id);

		DELETE FROM doctors WHERE user_id = _user_id;
		DELETE FROM addresses WHERE id = _address_id;
		DELETE FROM users WHERE id = _user_id;
    END;

$BODY$;
