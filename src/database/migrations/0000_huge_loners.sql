CREATE TABLE IF NOT EXISTS "enrolled_students" (
	"enrolled_student_id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"grade_level_id" integer NOT NULL,
	"school_id" integer,
	"section_id" integer,
	"school_year" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "grade_levels" (
	"grade_level_id" serial PRIMARY KEY NOT NULL,
	"description" text,
	"icon" varchar,
	"id_template" integer,
	"level_name" varchar,
	"order_number" integer,
	"school_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sections" (
	"section_id" serial PRIMARY KEY NOT NULL,
	"course_tvl" varchar(50),
	"created_by" varchar,
	"created_date" timestamp DEFAULT CURRENT_TIMESTAMP,
	"grade_level_id" integer,
	"school_id" integer,
	"school_year" varchar(50),
	"section_name" varchar(50),
	"track_and_strand" varchar(50),
	"updated_by" varchar,
	"updated_date" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"active" integer,
	"barangay" varchar,
	"birth_date" date,
	"city_municipality" varchar,
	"ethnic_group" varchar,
	"father_name" varchar,
	"mother_name" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"ext_name" varchar,
	"middle_name" varchar,
	"full_name" varchar,
	"gender" varchar(10),
	"grade_level" varchar(50),
	"guardian_name" varchar,
	"guardian_relationship" varchar(50),
	"learning_modality" varchar,
	"lrn" varchar,
	"mother_tongue" varchar,
	"parent_mobile_number" varchar(20),
	"province" varchar,
	"religion" varchar,
	"remarks" text,
	"school_id" integer,
	"section_id" integer,
	"street_address" varchar,
	"enrollment_id" integer
);
