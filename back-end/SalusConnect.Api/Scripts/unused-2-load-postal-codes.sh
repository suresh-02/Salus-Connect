#@REM SET PGPASSFILE=D:\Projects\salus-connect\src\SalusConnect\back-end\sql\pgpass.conf
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=tbm@123
export PGDATABASE=salus_connect
psql -c "\copy postal_codes(postal_code,city,province_abbr,time_zone,latitude,longitude) FROM './CanadianPostalCodes202203.csv' delimiter ',' csv header"