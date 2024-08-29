import MarginContainer from "@/components/container/MarginContainer";
import Attendance from "./Attendance";
import { alias } from "drizzle-orm/pg-core";
import { enrolled_students, students } from "@/database/schema";
import { db } from "@/database/db";
import { and, eq, sql } from "drizzle-orm";

export type TStudentsAttendance = Awaited<ReturnType<typeof getLatestStudentEndrolled>>

async function  getLatestStudentEndrolled () {
  const es = alias(enrolled_students, 'es')
  
  const getMaxSchoolYear  = db.select({
    student_id: enrolled_students.student_id,
    school_year: sql`MAX(${enrolled_students.school_year})`.as('max_school_year')
  }).from(enrolled_students)
  .groupBy(enrolled_students.student_id).as('max_year')

  const getLatestEnrollment = await db.select({
    student_id: getMaxSchoolYear.student_id,
    section_id: sql<string>`${es.section_id}`.as('section_id'),
    full_name: sql<string>`CONCAT(${students.last_name},' ' , ${students.first_name}, ' ',  COALESCE(${students.middle_name}, ''))`.as('full_name'),
    formated_full_name: sql<string>`CONCAT(${students.last_name},', ' , ${students.first_name}, '. ', COALESCE(${students.middle_name}, ''))`.as('formated_full_name')
  }).from(es)
    .innerJoin(getMaxSchoolYear, 
      and(
        eq(es.student_id, getMaxSchoolYear.student_id),
        eq(getMaxSchoolYear.school_year, es.school_year)
    ))
    .innerJoin(students, eq(students.id, getMaxSchoolYear.student_id))

  return getLatestEnrollment
}

export default async function AttendancePage() {
  
  const students = await getLatestStudentEndrolled()

  return (
    <MarginContainer>
      <p className="uppercase font-semibold">Attendance</p>
      <Attendance students={students}/>
    </MarginContainer>
  )
}
