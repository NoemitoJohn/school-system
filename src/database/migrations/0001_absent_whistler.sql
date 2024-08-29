CREATE TABLE IF NOT EXISTS "class_attendance" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attendance_date" date,
	"created_by" text,
	"created_date" timestamp,
	"is_time_out" boolean,
	"procedure_name" text,
	"remarks" text,
	"school_id" text,
	"section_id" text,
	"student_id" text,
	"time_in" time,
	"time_in_status" text,
	"time_out" time,
	"updated_by" text,
	"updated_date" timestamp,
	"time_in_procedure" text,
	"time_out_procedure" text
);
