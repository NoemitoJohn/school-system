import { sql } from "drizzle-orm";
import { bigserial, boolean, date, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const students = pgTable('students', {
  student_id: serial('id').primaryKey(),
  active : integer('active'),
  barangay : varchar('barangay'),
  birth_date : date('birth_date'), 
  city_municipality : varchar('city_municipality'),
  ethnic_group : varchar('ethnic_group'),
  father_name : varchar('father_name'),
  mother_name : varchar('mother_name'),
  first_name : varchar('first_name'),
  last_name : varchar('last_name'),
  ext_name : varchar('ext_name'),
  middle_name : varchar('middle_name'),
  full_name : varchar('full_name'),
  gender : varchar('gender', {length : 10}),
  grade_level : varchar('grade_level', { length : 50}),
  guardian_name : varchar('guardian_name'),
  guardian_relationship : varchar('guardian_relationship', {length : 50}),
  learning_modality : varchar('learning_modality'),
  lrn : varchar('lrn'),
  mother_tongue : varchar('mother_tongue'),
  parent_mobile_number : varchar('parent_mobile_number', {length : 20}),
  province : varchar('province'),
  religion : varchar('religion'),
  remarks : text('remarks'),
  school_id : integer('school_id'),
  section_id : integer('section_id'),
  street_address : varchar('street_address'),
  enrollment_id : integer('enrollment_id'),
  img_url : text('img_url'),
  qrcode : text('qrcode')
})

export const enrolled_students = pgTable('enrolled_students', {
  enrolled_student_id : serial('enrolled_student_id').primaryKey(),
  student_id : integer('student_id').notNull(),
  grade_level_id : integer('grade_level_id').notNull(),
  school_id : integer('school_id'),
  section_id : integer('section_id'),
  is_id_paid : boolean('is_id_paid'),
  school_year : varchar('school_year')
})

export const sections = pgTable('sections', {
  section_id : serial('section_id').primaryKey(),
  course_tvl : varchar('course_tvl', {length : 50}),
  created_by : varchar('created_by'),
  created_date : timestamp('created_date').default(sql`CURRENT_TIMESTAMP`),
  grade_level_id : integer('grade_level_id'),
  school_id : integer('school_id'),
  school_year : varchar('school_year', {length : 50}),
  section_name : varchar('section_name', {length : 50}),
  track_and_strand : varchar('track_and_strand', {length : 50}),
  updated_by : varchar('updated_by'),
  updated_date : timestamp('updated_date').default(sql`CURRENT_TIMESTAMP`),
})

export const grade_levels = pgTable('grade_levels', {
  grade_level_id : serial('grade_level_id').primaryKey(),
  description : text('description'),
  icon : varchar('icon'),
  id_template : integer('id_template'),
  level_name : varchar('level_name'),
  order_number : integer('order_number'),
  school_id: integer('school_id')
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
