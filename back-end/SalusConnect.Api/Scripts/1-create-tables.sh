#@REM SET PGPASSFILE=D:\Projects\salues-conect\src\SalusConnect\back-end\sql\pgpass.conf
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=tbm@123
export PGDATABASE=salus_connect
psql -f ./../Migrations/20201011-001-salusconnect-types.sql
psql -f ./../Migrations/20201011-002-salusconnect-tables.sql
psql -f ./../Migrations/20201011-003-salusconnect-data.sql
psql -f ./../Migrations/20201011-004-salusconnect-constraints.sql
psql -f ./../Migrations/20201011-005-salusconnect-views.sql
psql -f ./../Migrations/20201011-006-salusconnect-functions.sql
psql -f ./../Migrations/20201011-007-salusconnect-appointments.sql
psql -f ./../Migrations/20201011-008-salusconnect-dashboard.sql
psql -f ./../Migrations/20201011-009-salusconnect-doctors.sql
psql -f ./../Migrations/20201011-010-salusconnect-facilities.sql
psql -f ./../Migrations/20201011-011-salusconnect-subscriptions.sql
psql -f ./../Migrations/20211011-012-salusconnect-postal-codes.sql
