CREATE TABLE IF NOT EXISTS "class" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" text,
	"created_date" timestamp DEFAULT now(),
	"school_id" text,
	"school_year" varchar(20),
	"section_id" text,
	"updated_by" text,
	"updated_date" timestamp DEFAULT now(),
	"imported" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "enrolled_students" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"grade_level_id" text NOT NULL,
	"school_id" text,
	"section_id" text,
	"is_id_paid" boolean,
	"school_year" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "grade_levels" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"icon" varchar,
	"id_template" text,
	"level_name" text,
	"order_number" integer,
	"school_id" text,
	"elementary" boolean,
	"jhs" boolean,
	"shs" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text,
	"icon" text,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "school_districts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"division_id" uuid,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "school_divisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rigion_id" uuid,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "school_regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schools" (
	"id" text PRIMARY KEY NOT NULL,
	"active" boolean,
	"created_by" text,
	"created_date" timestamp DEFAULT now(),
	"email_address" text,
	"id_template_path" text,
	"logo_path" text,
	"logo_url" text,
	"school_address" text,
	"school_contact" text,
	"school_name" text,
	"school_principal" text,
	"school_short_name" text,
	"school_type" text,
	"signature_path" text,
	"signature_url" text,
	"updated_by" text,
	"updated_date" timestamp DEFAULT now(),
	"website" text,
	"school_region_id" uuid,
	"school_division_id" uuid,
	"school_district_id" uuid,
	"school_year" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sections" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_tvl" text,
	"created_by" text,
	"created_date" timestamp DEFAULT now(),
	"school_id" text,
	"section_name" text,
	"school_year" text,
	"grade_level_id" uuid,
	"track_and_strand" text,
	"updated_by" text,
	"updated_date" timestamp DEFAULT now(),
	"adviser_id" text,
	"semester" text,
	"imported" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"active" integer,
	"barangay" varchar,
	"birth_date" date,
	"city_municipality" text,
	"ethnic_group" text,
	"father_name" text,
	"mother_name" text,
	"first_name" varchar,
	"last_name" varchar,
	"ext_name" varchar,
	"middle_name" varchar,
	"full_name" text,
	"gender" text,
	"guardian_name" text,
	"guardian_relationship" text,
	"learning_modality" text,
	"lrn" text,
	"mother_tongue" text,
	"parent_mobile_number" text,
	"province" text,
	"religion" text,
	"remarks" text,
	"school_id" text,
	"section_id" text,
	"street_address" text,
	"enrollment_id" text,
	"piture_path" text,
	"picture_url" text,
	"created_date" timestamp DEFAULT now(),
	"updated_date" timestamp DEFAULT now(),
	"updated_by" text,
	"created_by" text,
	"qrcode" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"first_name" text,
	"last_name" text,
	"password" text,
	"role_id" text,
	"phone" text,
	"active" boolean,
	"locked" boolean,
	"last_successful_login" timestamp,
	"created_date" timestamp DEFAULT now(),
	"updated_date" timestamp DEFAULT now(),
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"created_by" text,
	"updated_by" text,
	"approval" boolean DEFAULT false,
	"school_id" text,
	"reference_number" text,
	"region_id" uuid,
	"division_id" uuid,
	"district_id" uuid,
	"remarks" text
);
