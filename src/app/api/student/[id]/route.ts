import { db } from "@/database/db"
import { enrolled_students, students } from "@/database/schema"
import { TStudentEnrollmentSchema } from "@/validation/schema"
import { eq, sql } from "drizzle-orm"


export async function GET(request: Request, {params} : {params  : {id : string}}) {
  const {id} = params
  try {
    let getStudents =  db.select({
      id : students.id,
      first_name : students.first_name,
      last_name : students.last_name,
      middle_name : students.middle_name,
      enrollment_id : sql<string>`COALESCE(${students.enrollment_id}, '')`.as('enrollment_id')
    }).from(students)
    .where(eq(students.id, id))
    .as('sq');

    const [enrollments] = await db.select({
      id : sql<string>`CAST(${getStudents.id} as TEXT)`,
      first_name : getStudents.first_name,
      last_name : getStudents.last_name,
      middle_name : getStudents.middle_name,
      grade_level : sql<string>`COALESCE(CAST(${enrolled_students.grade_level_id} as TEXT), '')`.as('grade_level') ,
      section : sql<string>`COALESCE(CAST(${enrolled_students.section_id} as TEXT), '')`.as('section'),
      school_year : sql<string>`COALESCE(CAST(${enrolled_students.school_year} as TEXT), '')`.as('school_year')
    }).from(getStudents).leftJoin(enrolled_students, eq(getStudents.enrollment_id, enrolled_students.id));
    
    const mName = enrollments.middle_name ? enrollments.middle_name?.at(0) : ''
    
    const enrollmentValue : TStudentEnrollmentSchema = { // default values
      id : enrollments.id,
      full_name : `${enrollments.last_name}, ${enrollments.first_name} .${mName}`,
      grade_level : enrollments.grade_level ,
      school_year : enrollments.school_year, 
      section : enrollments.section,
    }

    return Response.json(enrollmentValue)
  } catch (error) {
    console.log(error)
    Response.error()
  }
}

export async function POST(request: Request, {params} : {params  : {id : string}}) {


}