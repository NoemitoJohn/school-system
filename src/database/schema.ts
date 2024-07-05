import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";


export const students = sqliteTable('students', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  active : integer('active', {mode : "boolean"}),
  first_name : text('first_name'),
  middle_name : text('middle_name'),
  last_name : text('last_name'),
  ext_name : text('ext_name'),
  barangay : text('barangay'),
  birth_date: text('birth_date'),
  city_municipality : text('city_municipality'),
  ethnic_group : text('ethnic_group'),
  father_name : text('father_name'),
  gender : text('gender', {enum : ['MALE', 'FEMALE']}),
  grade_level : text('grade_level'),
  guardian_name : text('guardian_name'),
  guardian_relationship : text('guardian_relationship'),
  learning_modality: text('learning_modality'),
  lrn: text('lrn'),
  mother_name : text('mother_name'),
  mother_tongue : text('mother_tongue'),
  parent_mobile_number : text('parent_mobile_number'),
  province : text('province'),
  religion: text('religion'),
  remarks : text('remarks'),
  school_id : integer('school_id'),
  section_id : integer('section_id'),
  street_address : text('street_address'),
  enrollment_id : integer('enrollment_id', {mode : "number"}),
  created_at : text('created_at').default(sql`CURRENT_DATE`)
});


export const enrolled_students = sqliteTable('enrolled_students', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  student_id : integer('student_id', {mode : 'number'}).notNull(),
  grade_level : integer('grade_level', {mode : 'number'}).notNull(),
  school_id : integer('school_id', {mode : 'number'}),
  section_id : integer('section_id', {mode : 'number'}),
  school_year : text('school_year', {length : 20}).notNull(),
})


export const sections = sqliteTable('sections', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  course_tvl : text('course_tvl', {length : 50}),
  created_by : text('created_by', {length : 255}),
  created_date : text('created_date').default(sql`CURRENT_DATE`),
  grade_level_id : integer('grade_level_id', { mode : 'number'}),
  school_id : integer('school_id', {mode : 'number'}),
  school_year : text('school_year', {length : 50}).notNull(),
  section_name : text('section_name', { length : 50}).notNull(),
  track_and_strand : text('track_and_strand', { length : 50}),
  updated_by : text('updated_by', {length : 255}),
  updated_date : text('updated_date').default(sql`CURRENT_DATE`)
})


export const grade_levels = sqliteTable('grade_levels', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  description : text('description'),
  icon : text('icon', {length : 255}),
  id_template : integer('id_template', {mode : 'number'}),
  level_name : text('level_name', { length : 50}).notNull(), 
  order_number : integer('order_number', { mode : 'number'}),
  school_id : integer('school_id', { mode : 'number'})
})
