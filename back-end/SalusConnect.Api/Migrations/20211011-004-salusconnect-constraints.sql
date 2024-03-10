CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE doctor_slots ADD EXCLUDE USING gist (doctor_id WITH =, date_range WITH &&);
