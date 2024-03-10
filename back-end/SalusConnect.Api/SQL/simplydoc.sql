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

CREATE TYPE "billingperiod" AS ENUM (
  'Monthly',
  'Yearly'
);

CREATE TYPE "plancategory" AS ENUM (
  'Base',
  'Practitioner',
  'Staff'
);

CREATE TYPE "paymentmethod" AS ENUM (
  'Automatic',
  'Manual'
);

CREATE TYPE "couponduration" AS ENUM (
  'Forever',
  'Once',
  'MultipleMonths'
);

CREATE TYPE "billingfrequency" AS ENUM (
  'Monthly',
  'Yearly'
);

CREATE TYPE "platformusage" AS ENUM (
  'FullAccess',
  'InfoOnly'
);

CREATE TABLE "categories" (
  "id" int PRIMARY KEY NOT NULL,
  "category_name" varchar UNIQUE NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "specialties" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "specialty_name" varchar UNIQUE NOT NULL,
  "category_id" int NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "provinces" (
  "province_abbr" varchar PRIMARY KEY NOT NULL,
  "province_name" varchar UNIQUE NOT NULL
);

CREATE TABLE "postal_codes" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "postal_code" varchar NOT NULL,
  "city" varchar NOT NULL,
  "province_abbr" varchar NOT NULL,
  "time_zone" int NOT NULL,
  "latitude" real NOT NULL,
  "longitude" real NOT NULL,
  "is_new" boolean NOT NULL DEFAULT false
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
  "postal_code_id" int NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "first_name" varchar NOT NULL,
  "middle_name" varchar,
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
  "is_created_by_phone" boolean NOT NULL DEFAULT false,
  "status" userstatus NOT NULL DEFAULT 'Active',
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "facilities" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "facility_name" varchar UNIQUE NOT NULL,
  "facility_type" facilitytype NOT NULL,
  "address_id" int NOT NULL,
  "status" userstatus NOT NULL DEFAULT 'Active',
  "platform_usage" platformusage NOT NULL DEFAULT 'FullAccess',
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "doctors" (
  "user_id" int PRIMARY KEY NOT NULL,
  "biography" varchar,
  "specialty_id" int NOT NULL,
  "tags" varchar[],
  "facility_id" int,
  "address_id" int,
  "platform_usage" platformusage,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "staff" (
  "user_id" int PRIMARY KEY NOT NULL,
  "facility_id" int NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "patients" (
  "user_id" int PRIMARY KEY NOT NULL,
  "address_id" int,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "doctor_slots" (
  "doctor_id" int PRIMARY KEY NOT NULL,
  "is_accept_new" boolean NOT NULL DEFAULT false,
  "is_auto_approve" boolean NOT NULL DEFAULT false,
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
  "exclude_federal_holidays" boolean,
  "exclude_provincial_holidays" boolean,
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
  "staff_notes" text,
  "billed_amount" numeric(10,2),
  "new_appointment_time" timestamp,
  "is_created_by_phone" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "current_status" appointmentstatus
);

CREATE TABLE "appointment_statuses" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "appointment_id" int NOT NULL,
  "appointment_status" appointmentstatus NOT NULL,
  "notify_party" notifyparty NOT NULL,
  "read_status" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz NOT NULL
);

CREATE TABLE "holidays" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "hday_date" date NOT NULL,
  "hday_name" text NOT NULL,
  "hday_provinces" text[] NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "plans" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "stripe_product_id" text UNIQUE NOT NULL,
  "stripe_price_id" text UNIQUE NOT NULL,
  "plan_nickname" text UNIQUE NOT NULL,
  "plan_name" text UNIQUE NOT NULL,
  "plan_description" text,
  "unit_label" text NULL,
  "base_fee" numeric(10,2) NOT NULL DEFAULT 0,
  "fee_frequency" frequency NOT NULL,
  "billing_period" billingperiod NOT NULL,
  "plan_category" plancategory NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "coupons" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "stripe_id" text UNIQUE NOT NULL,
  "coupon_nickname" text UNIQUE NOT NULL,
  "coupon_name" text UNIQUE NOT NULL,
  "coupon_description" text,
  "discount_pct" decimal(5,2),
  "discount_amt" decimal(10,2),
  "duration" couponduration NOT NULL,
  "duration_months" int,
  "redemption_date_limit" date,
  "redemption_num_limit" int,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "coupon_codes" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "stripe_id" text UNIQUE NOT NULL,
  "coupon_id" int NOT NULL,
  "coupon_code" text UNIQUE NOT NULL,
  "is_first_time_only" boolean NOT NULL DEFAULT false,
  "redemption_num_limit" int,
  "expiry_date" date,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "coupon_plans" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "coupon_id" int NOT NULL,
  "plan_id" int NOT NULL
);

CREATE TABLE "subscriptions" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "stripe_subscription_id" text NOT NULL,
  "stripe_customer_id" text NOT NULL,
  "doctor_id" int,
  "facility_id" int,
  "start_date" date NOT NULL,
  "end_date" date,
  "billing_start_date" date NOT NULL,
  "free_trial_days" int NOT NULL DEFAULT 0,
  "payment_method" paymentmethod NOT NULL,
  "memo" text,
  "invoice_footer" text,
  "designated_email" text NOT NULL,
  "designated_phone" text NOT NULL,
  "billing_frequency" billingfrequency NOT NULL DEFAULT 'Monthly',
  "stripe_payment_method_id" text,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
  "updated_at" timestamptz
);

CREATE TABLE "subscription_plans" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "subscription_id" int NOT NULL,
  "plan_id" int NOT NULL,
  "qty" int NOT NULL DEFAULT 0,
  "cost" decimal(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE "subscription_discounts" (
  "subscription_id" int NOT NULL,
  "coupon_id" int NOT NULL,
  PRIMARY KEY ("subscription_id", "coupon_id")
);

CREATE TABLE "subscription_auth_doctors" (
  "subscription_id" int NOT NULL,
  "doctor_id" int NOT NULL,
  PRIMARY KEY ("subscription_id", "doctor_id")
);

CREATE TABLE "subscription_auth_staff" (
  "subscription_id" int NOT NULL,
  "staff_id" int NOT NULL,
  PRIMARY KEY ("subscription_id", "staff_id")
);

ALTER TABLE "specialties" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "postal_codes" ADD FOREIGN KEY ("province_abbr") REFERENCES "provinces" ("province_abbr");

ALTER TABLE "addresses" ADD FOREIGN KEY ("postal_code_id") REFERENCES "postal_codes" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "facilities" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id");

ALTER TABLE "doctors" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "doctors" ADD FOREIGN KEY ("specialty_id") REFERENCES "specialties" ("id");

ALTER TABLE "doctors" ADD FOREIGN KEY ("facility_id") REFERENCES "facilities" ("id");

ALTER TABLE "doctors" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id");

ALTER TABLE "staff" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "staff" ADD FOREIGN KEY ("facility_id") REFERENCES "facilities" ("id");

ALTER TABLE "patients" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "patients" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id");

ALTER TABLE "doctor_slots" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("user_id");

ALTER TABLE "doctor_slot_exceptions" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctor_slots" ("doctor_id");

ALTER TABLE "doctor_treatments" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctor_slots" ("doctor_id");

ALTER TABLE "appointments" ADD FOREIGN KEY ("patient_id") REFERENCES "patients" ("user_id");

ALTER TABLE "appointments" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("user_id");

ALTER TABLE "appointments" ADD FOREIGN KEY ("treatment_id") REFERENCES "doctor_treatments" ("id");

ALTER TABLE "appointment_statuses" ADD FOREIGN KEY ("appointment_id") REFERENCES "appointments" ("id");

ALTER TABLE "coupon_codes" ADD FOREIGN KEY ("coupon_id") REFERENCES "coupons" ("id");

ALTER TABLE "coupon_plans" ADD FOREIGN KEY ("coupon_id") REFERENCES "coupons" ("id");

ALTER TABLE "coupon_plans" ADD FOREIGN KEY ("plan_id") REFERENCES "plans" ("id");

ALTER TABLE "subscriptions" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("user_id");

ALTER TABLE "subscriptions" ADD FOREIGN KEY ("facility_id") REFERENCES "facilities" ("id");

ALTER TABLE "subscription_plans" ADD FOREIGN KEY ("subscription_id") REFERENCES "subscriptions" ("id");

ALTER TABLE "subscription_plans" ADD FOREIGN KEY ("plan_id") REFERENCES "plans" ("id");

ALTER TABLE "subscription_discounts" ADD FOREIGN KEY ("subscription_id") REFERENCES "subscriptions" ("id");

ALTER TABLE "subscription_discounts" ADD FOREIGN KEY ("coupon_id") REFERENCES "coupons" ("id");

ALTER TABLE "subscription_auth_doctors" ADD FOREIGN KEY ("subscription_id") REFERENCES "subscriptions" ("id");

ALTER TABLE "subscription_auth_doctors" ADD FOREIGN KEY ("doctor_id") REFERENCES "doctors" ("user_id");

ALTER TABLE "subscription_auth_staff" ADD FOREIGN KEY ("subscription_id") REFERENCES "subscriptions" ("id");

ALTER TABLE "subscription_auth_staff" ADD FOREIGN KEY ("staff_id") REFERENCES "staff" ("user_id");

CREATE INDEX ON "postal_codes" ("city");

CREATE UNIQUE INDEX ON "postal_codes" ("postal_code", "city");

CREATE UNIQUE INDEX ON "doctor_treatments" ("doctor_id", "nick_name");

CREATE UNIQUE INDEX ON "doctor_treatments" ("doctor_id", "treatment_type");

CREATE UNIQUE INDEX ON "appointments" ("doctor_id", "appointment_date", "appointment_time");

CREATE UNIQUE INDEX ON "holidays" ("hday_name", "hday_date");

CREATE UNIQUE INDEX ON "coupon_plans" ("coupon_id", "plan_id");

CREATE UNIQUE INDEX ON "subscription_plans" ("subscription_id", "plan_id");
