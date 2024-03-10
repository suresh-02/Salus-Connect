CREATE TYPE "facilitytype" AS ENUM (
  'Hospital',
  'Clinic'
);

CREATE TYPE "appointmentstatus" AS ENUM (
  'Requested',
  'Accepted',
  'Rejected',
  'ProposeNew',
  'Confirmed',
  'Cancelled'
);

CREATE TYPE "notifyparty" AS ENUM (
  'Provider',
  'Patient'
);

CREATE TYPE "userstatus" AS ENUM (
  'Inactive',
  'Published',
  'Invited',
  'Active'
);

CREATE TYPE "insurancecoverage" AS ENUM (
  'None',
  'Partial',
  'Full'
);

CREATE TYPE "completestatus" AS ENUM (
  'Complete',
  'NoShow'
);

CREATE TYPE "frequency" AS ENUM (
  'Recurring',
  'OneTime'
);

CREATE TABLE "categories" (
  "id" int PRIMARY KEY NOT NULL,
  "category_name" varchar UNIQUE NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'Asia/Kolkata'),
  "updated_at" timestamptz
);

CREATE TABLE "specialties" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "specialty_name" varchar UNIQUE NOT NULL,
  "category_id" int NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'Asia/Kolkata'),
  "updated_at" timestamptz
);

CREATE TABLE "roles" (
  "id" int PRIMARY KEY NOT NULL,
  "role_name" varchar UNIQUE NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true
);

CREATE TABLE "addresses" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "address_line1" varchar,
  "address_line2" varchar,
  "city" varchar,
  "state_abbr" varchar,
  "postal_code" varchar
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "phone_number" varchar,
  "email_address" varchar UNIQUE NOT NULL,
  "password_hash" varchar NOT NULL,
  "password_salt" varchar NOT NULL,
  "role_id" int NOT NULL,
  "image_url" varchar,
  "is_email_confirmed" boolean,
  "confirm_email_code" varchar,
  "reset_password_code" varchar,
  "status" userstatus NOT NULL DEFAULT 'Active',
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'Asia/Kolkata'),
  "updated_at" timestamptz
);

CREATE TABLE "facilities" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "facility_name" varchar UNIQUE NOT NULL,
  "facility_type" facilitytype NOT NULL,
  "address_id" int NOT NULL,
  "status" userstatus NOT NULL DEFAULT 'Active',
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'Asia/Kolkata'),
  "updated_at" timestamptz
);

CREATE TABLE "doctors" (
  "user_id" int PRIMARY KEY NOT NULL,
  "biography" varchar,
  "specialty_id" int NOT NULL,
  "tags" varchar[],
  "facility_id" int,
  "address_id" int,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'Asia/Kolkata'),
  "updated_at" timestamptz
);

CREATE TABLE "patients" (
  "user_id" int PRIMARY KEY NOT NULL,
  "address_id" int,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'Asia/Kolkata'),
  "updated_at" timestamptz
);

CREATE TABLE "doctor_slots" (
  "doctor_id" int PRIMARY KEY NOT NULL,
  "cancellation_policy_days" int NOT NULL DEFAULT 1,
  "date_range" daterange,
  "time_range" timerange
);

CREATE TABLE "doctor_slot_exceptions" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "doctor_id" int NOT NULL,
  "exception_date" date NOT NULL,
  "exception_time_range" timerange,
  "not_available" boolean
);

CREATE TABLE "doctor_treatments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "doctor_id" int NOT NULL,
  "nick_name" text NOT NULL,
  "treatment_type" text NOT NULL,
  "treatment_description" text NOT NULL,
  "time_range" timerange,
  "duration_min" int NOT NULL,
  "break_min" int,
  "treatment_days" int[],
  "exclude_holidays" boolean,
  "insurance_coverage" insurancecoverage NOT NULL,
  "fee_per_visit" numeric(10,2),
  "is_default" boolean NOT NULL DEFAULT false
);

CREATE TABLE "appointments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "patient_id" int NOT NULL,
  "appointment_code" varchar NOT NULL,
  "doctor_id" int NOT NULL,
  "appointment_date" date NOT NULL,
  "appointment_time" time NOT NULL,
  "treatment_id" int,
  "duration_min" int NOT NULL DEFAULT 0,
  "symptoms" text,
  "fee_per_visit" numeric(10,2),
  "parent_id" int,
  "complete_status" completestatus,
  "doctor_notes" text,
  "billed_amount" numeric(10,2),
  "new_appointment_time" timestamp,
  "is_created_by_phone" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'Asia/Kolkata'),
  "current_status" appointmentstatus
);

CREATE TABLE "appointment_statuses" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "appointment_id" int NOT NULL,
  "appointment_status" appointmentstatus NOT NULL,
  "notify_party" notifyparty NOT NULL,
  "read_status" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'Asia/Kolkata'),
  "updated_at" timestamptz NOT NULL
);

CREATE TABLE "holidays" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "hday_date" date NOT NULL,
  "hday_name" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'Asia/Kolkata'),
  "updated_at" timestamptz
);


ALTER TABLE "specialties" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "facilities" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id");

ALTER TABLE "doctors" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "doctors" ADD FOREIGN KEY ("specialty_id") REFERENCES "specialties" ("id");

ALTER TABLE "doctors" ADD FOREIGN KEY ("facility_id") REFERENCES "facilities" ("id");

ALTER TABLE "doctors" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id");

ALTER TABLE "patients" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "patients" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id");

ALTER TABLE "doctor_slots" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("user_id");

ALTER TABLE "doctor_slot_exceptions" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctor_slots" ("doctor_id");

ALTER TABLE "doctor_treatments" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctor_slots" ("doctor_id");

ALTER TABLE "appointments" ADD FOREIGN KEY ("patient_id") REFERENCES "patients" ("user_id");

ALTER TABLE "appointments" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("user_id");

ALTER TABLE "appointments" ADD FOREIGN KEY ("treatment_id") REFERENCES "doctor_treatments" ("id");

ALTER TABLE "appointment_statuses" ADD FOREIGN KEY ("appointment_id") REFERENCES "appointments" ("id");


CREATE UNIQUE INDEX ON "doctor_treatments" ("doctor_id", "nick_name");

CREATE UNIQUE INDEX ON "doctor_treatments" ("doctor_id", "treatment_type");

CREATE UNIQUE INDEX ON "appointments" ("doctor_id", "appointment_date", "appointment_time");

CREATE UNIQUE INDEX ON "holidays" ("hday_name", "hday_date");
