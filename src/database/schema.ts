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
  created_at : text('created_at').default(sql`CURRENT_DATE`)
});



