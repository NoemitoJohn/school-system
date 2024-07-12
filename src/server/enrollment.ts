import { TEnromentStudent } from "@/components/EnrollmentSearch"
import { db } from "@/database/db"
import { enrolled_students, grade_levels, sections, students } from "@/database/schema"
import { getSchoolYear } from "@/lib/utils"
import { asc, eq, ne, sql } from "drizzle-orm"

export const getEnrolledStudent = async () => {
  const school_year = getSchoolYear()

  try {
    const getStudents = db.select(
    {
      id : sql<number>`${students.student_id}`.as('id'),
      lrn : sql<string>`${students.lrn}`.as('lrn'),
      first_name : sql<string>`${students.first_name}`.as('first_name'),
      last_name : sql<string>`${students.last_name}`.as('last_name'),
      middle_name : sql<string>`${students.middle_name}`.as('middle_name'),
      enrollment_id : sql<string>`COALESCE(${enrolled_students.enrolled_student_id}, -1)`.as('enrollment_id'),
      enrolled_id :  enrolled_students.enrolled_student_id,
      grade_level_name : sql<string>`COALESCE(${grade_levels.level_name}, '')`.as('grade_level_name'),
      section_name : sql<string>`COALESCE(${sections.section_name}, '')`.as('section_name'),
      enrolled_year : sql<string>`COALESCE(${enrolled_students.school_year}, '')`.as('enrolled_year'),
      is_id_paid : enrolled_students.is_id_paid
    })
    .from(students)
    .leftJoin(enrolled_students, eq(students.student_id, enrolled_students.student_id))
    .leftJoin(grade_levels, eq(enrolled_students.grade_level_id, grade_levels.grade_level_id))
    .leftJoin(sections, eq(sections.section_id, enrolled_students.section_id))
    .orderBy(asc(sections.school_year))
    .as('sq')

    const getNotEnrolledStudent = await db.select().from(getStudents).where(ne(getStudents.enrolled_year, ''))

    const formatStudent : TEnromentStudent[] = getNotEnrolledStudent.map(s => ({
      id : s.id,
      lrn : s.lrn,
      full_name : `${s.last_name}, ${s.first_name} .${s.middle_name?.at(0)}`,
      grade_level : s.grade_level_name,
      section : s.section_name,
      enrolled_id : s.enrolled_id,
      is_paid_id : s.is_id_paid,
      year_enrolled : s.enrolled_year
    }))
    return formatStudent

  } catch (error) {
    console.log(error)
  }
}