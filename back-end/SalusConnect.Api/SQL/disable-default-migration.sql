
-- public.schemaversions definition

-- Drop table

-- DROP TABLE schemaversions;

CREATE TABLE schemaversions (
	schemaversionsid serial4 NOT NULL,
	scriptname varchar(255) NOT NULL,
	applied timestamp NOT NULL,
	CONSTRAINT "PK_schemaversions_Id" PRIMARY KEY (schemaversionsid)
);
TRUNCATE TABLE schemaversions;
ALTER SEQUENCE schemaversions_schemaversionsid_seq RESTART WITH 1;
INSERT INTO schemaversions (scriptname,applied) VALUES
	 ('SalusConnect.Api.Migrations.20211011-001-salusconnect-types.sql','2022-04-09 11:45:03.361186'),
	 ('SalusConnect.Api.Migrations.20211011-002-salusconnect-tables.sql','2022-04-09 11:45:04.951707'),
	 ('SalusConnect.Api.Migrations.20211011-003-salusconnect-data.sql','2022-04-09 11:45:04.999391'),
	 ('SalusConnect.Api.Migrations.20211011-004-salusconnect-constraints.sql','2022-04-09 11:45:05.344227'),
	 ('SalusConnect.Api.Migrations.20211011-005-salusconnect-views.sql','2022-04-09 11:45:05.395264'),
	 ('SalusConnect.Api.Migrations.20211011-006-salusconnect-functions.sql','2022-04-09 11:45:05.440983'),
	 ('SalusConnect.Api.Migrations.20211011-007-salusconnect-appointments.sql','2022-04-09 11:45:05.499669'),
	 ('SalusConnect.Api.Migrations.20211011-008-salusconnect-dashboard.sql','2022-04-09 11:45:05.527404'),
	 ('SalusConnect.Api.Migrations.20211011-009-salusconnect-doctors.sql','2022-04-09 11:45:05.540954'),
	 ('SalusConnect.Api.Migrations.20211011-010-salusconnect-facilities.sql','2022-04-09 11:45:05.558847'),
	 ('SalusConnect.Api.Migrations.20211011-011-salusconnect-subscriptions.sql','2022-04-09 11:45:05.576768')
	 ('SalusConnect.Api.Migrations.20211011-012-salusconnect-postal-codes.sql','2022-04-09 11:45:05.576768');
