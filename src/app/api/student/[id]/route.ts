import { db } from "@/database/db"
import { enrolled_students, students } from "@/database/schema"
import { TStudentEnrollmentSchema } from "@/validation/schema"
import { eq, sql } from "drizzle-orm"


export async function GET(request: Request, {params} : {params  : {id : string}}) {
  const {id} = params
  
  try {
    let getStudents =  db.select({
      id : students.student_id,
      first_name : students.first_name,
      last_name : students.last_name,
      middle_name : students.middle_name,
      enrollment_id : sql<number>`COALESCE(${students.enrollment_id}, -1)`.as('enrollment_id')
    }).from(students)
    .where(eq(students.student_id, Number(id)))
    .as('sq');

    const [enrollments] = await db.select({
      id : sql<string>`CAST(${getStudents.id} as TEXT)`,
      first_name : getStudents.first_name,
      last_name : getStudents.last_name,
      middle_name : getStudents.middle_name,
      grade_level : sql<string>`COALESCE(CAST(${enrolled_students.grade_level_id} as TEXT), '')`.as('grade_level') ,
      section : sql<string>`COALESCE(CAST(${enrolled_students.section_id} as TEXT), '')`.as('section'),
      school_year : sql<string>`COALESCE(CAST(${enrolled_students.school_year} as TEXT), '')`.as('school_year')
    }).from(getStudents).leftJoin(enrolled_students, eq(getStudents.enrollment_id, enrolled_students.enrolled_student_id));

    const enrollmentValue : TStudentEnrollmentSchema = { // default values
      id : enrollments.id,
      full_name : `${enrollments.last_name}, ${enrollments.first_name} .${enrollments.middle_name?.at(0)}`,
      grade_level : enrollments.grade_level ,
      school_year : enrollments.school_year, 
      section : enrollments.section,
    }

    return Response.json(enrollmentValue)
  } catch (error) {
    Response.error()
  }
}

export async function POST(request: Request, {params} : {params  : {id : string}}) {


}