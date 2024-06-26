import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";


export const students = sqliteTable('students', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  first_name : text('first_name'),
  middle_name : text('middle_name'),
  last_name : text('last_name'),
  ext_name : text('ext_name'),
  gender : text('gender', {enum : ['MALE', 'FEMALE']}),
  birthdate: text('birthdate'),
  religion: text('religion'),
  parents_contact_num : text('parents_contact_num'),
  created_at : text('created_at').default(sql`CURRENT_DATE`)
});

export const parents = sqliteTable('parents', {
  id : integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  student_id : integer('student_id', {mode : "number"}), 
  first_name : text('first_name'),
  last_name : text('last_name'),
  ext_name : text('ext_name'),
  middle_name : text('middle_name'),
  gender : text('gender', {enum : ['MALE', 'FEMALE']}),
  created_at : text('created_at').default(sql`CURRENT_DATE`)
})


