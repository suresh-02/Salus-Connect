@REM SET PGPASSFILE=D:\Projects\salus-connect\src\SalusConnect\back-end\sql\pgpass.conf
@SET PGHOST=192.168.1.14
@SET PGPORT=5432
@SET PGUSER=postgres
@SET PGPASSWORD=tbm@123
@SET PGDATABASE=salusconnect1
psql -c "\copy postal_codes(postal_code,city,province_abbr,time_zone,latitude,longitude) FROM './CanadianPostalCodes202203.csv' delimiter ',' csv header"