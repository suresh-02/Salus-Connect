DO $$ 
    BEGIN
        BEGIN
            DROP INDEX IF EXISTS appointments_doctor_id_appointment_date_appointment_time_idx;
            ALTER TABLE appointments ADD COLUMN current_status appointmentstatus NULL;
            CREATE UNIQUE INDEX IF NOT EXISTS appointments_doctor_id_appointment_date_appointment_time_idx 
                ON appointments(doctor_id, appointment_date, appointment_time) 
                WHERE current_status NOT IN ('Cancelled', 'Rejected');
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'Column current_status already exists in table appointments.';
        END;
    END;
$$;
