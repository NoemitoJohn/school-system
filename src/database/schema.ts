import { sql } from "drizzle-orm";
import { bigserial, boolean, date, integer, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const students = pgTable('students', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  active : integer('active'),
  barangay : varchar('barangay'),
  birth_date : date('birth_date'), 
  city_municipality : text('city_municipality'),
  ethnic_group : text('ethnic_group'),
  father_name : text('father_name'),
  mother_name : text('mother_name'),
  first_name : varchar('first_name'),
  last_name : varchar('last_name'),
  ext_name : varchar('ext_name'),
  middle_name : varchar('middle_name'),
  full_name : text('full_name'),
  gender : text('gender'),
  // grade_level : varchar('grade_level', { length : 50}),
  guardian_name : text('guardian_name'),
  guardian_relationship : text('guardian_relationship'),
  learning_modality : text('learning_modality'),
  lrn : text('lrn'),
  mother_tongue : text('mother_tongue'),
  parent_mobile_number : text('parent_mobile_number'),
  province : text('province'),
  religion : text('religion'),
  remarks : text('remarks'),
  school_id : text('school_id'),
  section_id : text('section_id'),
  street_address : text('street_address'),
  enrollment_id : text('enrollment_id'),
  piture_path : text('piture_path'),
  img_url : text('picture_url'),
  created_date : timestamp('created_date', { withTimezone: false }).defaultNow(),
  updated_date : timestamp('updated_date', { withTimezone: false }).defaultNow(),
  updated_by : text('updated_by'),
  created_by : text('created_by'),
  qrcode : text('qrcode')
})

export const enrolled_students = pgTable('enrolled_students', {
  id : text('id').primaryKey().default(sql`gen_random_uuid()`),
  student_id : text('student_id').notNull(),
  grade_level_id : text('grade_level_id').notNull(),
  school_id : text('school_id'),
  section_id : text('section_id'),
  is_id_paid : boolean('is_id_paid'),
  school_year : varchar('school_year')
})

export const sections = pgTable('sections', {
  id : text('id').primaryKey().default(sql`gen_random_uuid()`),
  course_tvl : text('course_tvl'),
  created_by : text('created_by'),
  created_date : timestamp('created_date', { withTimezone: false }).defaultNow(),
  school_id : text('school_id'),
  section_name : text('section_name'),
  school_year : text('school_year'),
  grade_level_id : uuid('grade_level_id'),
  track_and_strand : text('track_and_strand'),
  updated_by : text('updated_by'),
  updated_date : timestamp('updated_date', { withTimezone: false }).defaultNow(),
  adviser_id: text('adviser_id'),
  semester: text('semester'),
  imported: boolean('imported'),
})

export const grade_levels = pgTable('grade_levels', {
  id : text('id').primaryKey().default(sql`gen_random_uuid()`),
  description : text('description'),
  icon : varchar('icon'),
  id_template : text('id_template'),
  level_name : text('level_name'),
  order_number : integer('order_number'),
  school_id: text('school_id'),
  elementary : boolean('elementary'),
  jhs : boolean('jhs'),
  shs : boolean('shs'),
})

export const roles = pgTable('roles', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  code : text('code'),
  icon : text('icon'),
  name : text('name')
});

export const classes = pgTable('class', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  created_by : text('created_by'),
  created_date : timestamp('created_date', { withTimezone: false }).defaultNow(),
  school_id : text('school_id'),
  school_year : varchar('school_year', {length : 20}),
  section_id: text('section_id'),
  updated_by: text('updated_by'),
  updated_date: timestamp('updated_date', { withTimezone: false }).defaultNow(),
  imported: boolean('imported')
});

export const schools = pgTable('schools', {
  id: text('id').primaryKey(),
  active: boolean('active'),
  created_by : text('created_by'),
  created_date: timestamp('created_date', {withTimezone : false}).defaultNow(),
  email_address: text('email_address'),
  id_template_path: text('id_template_path'),
  logo_path: text('logo_path'),
  logo_url: text('logo_url'),
  school_address: text('school_address'),
  school_contact: text('school_contact'),
  school_name: text('school_name'),
  school_principal: text('school_principal'),
  school_short_name: text('school_short_name'),
  school_type: text('school_type'),
  signature_path: text('signature_path'),
  signature_url: text('signature_url'),
  updated_by: text('updated_by'),
  updated_date: timestamp('updated_date', {withTimezone : false}).defaultNow(),
  website: text('website'),
  school_region_id: uuid('school_region_id'),
  school_division_id: uuid('school_division_id'),
  school_district_id: uuid('school_district_id'),
  school_year: text('school_year'),
})

export const school_districts = pgTable('school_districts', {
  id : uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  division_id: uuid('division_id'),
  name: text('name')
})

export const school_divisions = pgTable('school_divisions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  rigion_id : uuid('rigion_id'),
  name : text('name')
})

export const school_regions = pgTable('school_regions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name')
})

export const users = pgTable('users', {
  first_name: text('first_name'),
  last_name: text('last_name'),
  password: text('password'),
  role_id: text('role_id'),
  phone: text('phone'),
  active: boolean('active'),
  locked: boolean('locked'),
  last_last_successful_login: timestamp('last_successful_login', {withTimezone: false}),
  created_date: timestamp('created_date', {withTimezone : false}).defaultNow(),
  updated_date: timestamp('updated_date', {withTimezone: false}).defaultNow(),
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  approval: boolean('approval').default(false),
  school_id: text('school_id'),
  reference_number: text('reference_number'),
  region_id: uuid('region_id'),
  division_id: uuid('division_id'),
  district_id: uuid('district_id'),
  remarks: text('remarks'),
})


// export const students = sqliteTable('students', {
//   id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
//   active : integer('active', {mode : "boolean"}),
//   first_name : text('first_name'),
//   middle_name : text('middle_name'),
//   last_name : text('last_name'),
//   ext_name : text('ext_name'),
//   barangay : text('barangay'),
//   birth_date: text('birth_date'),
//   city_municipality : text('city_municipality'),
//   ethnic_group : text('ethnic_group'),
//   father_name : text('father_name'),
//   gender : text('gender', {enum : ['MALE', 'FEMALE']}),
//   grade_level : text('grade_level'),
//   guardian_name : text('guardian_name'),
//   guardian_relationship : text('guardian_relationship'),
//   learning_modality: text('learning_modality'),
//   lrn: text('lrn'),
//   mother_name : text('mother_name'),
//   mother_tongue : text('mother_tongue'),
//   parent_mobile_number : text('parent_mobile_number'),
//   province : text('province'),
//   religion: text('religion'),
//   remarks : text('remarks'),
//   school_id : integer('school_id'),
//   section_id : integer('section_id'),
//   street_address : text('street_address'),
//   enrollment_id : integer('enrollment_id', {mode : "number"}),
//   created_at : text('created_at').default(sql`CURRENT_DATE`)
// });


// export const enrolled_students = sqliteTable('enrolled_students', {
//   id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
//   student_id : integer('student_id', {mode : 'number'}).notNull(),
//   grade_level : integer('grade_level', {mode : 'number'}).notNull(),
//   school_id : integer('school_id', {mode : 'number'}),
//   section_id : integer('section_id', {mode : 'number'}),
//   school_year : text('school_year', {length : 20}).notNull(),
// })


// export const sections = sqliteTable('sections', {
//   id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
//   course_tvl : text('course_tvl', {length : 50}),
//   created_by : text('created_by', {length : 255}),
//   created_date : text('created_date').default(sql`CURRENT_DATE`),
//   grade_level_id : integer('grade_level_id', { mode : 'number'}),
//   school_id : integer('school_id', {mode : 'number'}),
//   school_year : text('school_year', {length : 50}).notNull(),
//   section_name : text('section_name', { length : 50}).notNull(),
//   track_and_strand : text('track_and_strand', { length : 50}),
//   updated_by : text('updated_by', {length : 255}),
//   updated_date : text('updated_date').default(sql`CURRENT_DATE`)
// })


// export const grade_levels = sqliteTable('grade_levels', {
//   id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
//   description : text('description'),
//   icon : text('icon', {length : 255}),
//   id_template : integer('id_template', {mode : 'number'}),
//   level_name : text('level_name', { length : 50}).notNull(), 
//   order_number : integer('order_number', { mode : 'number'}),
//   school_id : integer('school_id', { mode : 'number'})
// })
