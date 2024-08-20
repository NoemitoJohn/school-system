import { TEnromentStudent } from "@/components/EnrollmentSearch"
import { db } from "@/database/db"
import { enrolled_students, grade_levels, sections, students } from "@/database/schema"
import { StudentEnrollmentSchema, TStudentEnrollmentSchema } from "@/validation/schema"
import { and, asc, eq, ne, sql } from "drizzle-orm"

export async function POST(request: Request) {
  const body : TStudentEnrollmentSchema = await request.json()

  const validation =  StudentEnrollmentSchema.safeParse(body)

  if(validation.error) {
    return Response.error()
  }

  const {data} = validation
  
  const studentId = await db.transaction(async (tx) => {
    try {
      const [insert] = await tx.insert(enrolled_students).values({
        grade_level_id : data.grade_level,
        section_id : data.section,
        student_id : data.id,
        school_year : data.school_year
      }).returning()
        
      const enrolmentId  = insert.id
        
      await tx.update(students).set({
        enrollment_id : enrolmentId
      }).where(eq(students.id, data.id))

      return insert.student_id
      
    } catch (error) {
      tx.rollback()
    }
  })

  if(studentId) {
    return Response.json({student_id : studentId})
  }
  return Response.error()
}

export async function GET() {
  try {
    const getStudents = db.select(
    {
      id : sql<string>`${students.id}`.as('id'),
      lrn : sql<string>`${students.lrn}`.as('lrn'),
      first_name : sql<string>`${students.first_name}`.as('first_name'),
      last_name : sql<string>`${students.last_name}`.as('last_name'),
      middle_name : sql<string>`${students.middle_name}`.as('middle_name'),
      enrollment_id : sql<string>`COALESCE(${enrolled_students.id}, -1)`.as('enrollment_id'),
      grade_level_name : sql<string>`COALESCE(${grade_levels.level_name}, '')`.as('grade_level_name'),
      section_name : sql<string>`COALESCE(${sections.section_name}, '')`.as('section_name'),
      enrolled_year : sql<string>`COALESCE(${enrolled_students.school_year}, '')`.as('enrolled_year'),
    })
    .from(students)
    .leftJoin(enrolled_students, eq(students.id, enrolled_students.student_id))
    .leftJoin(grade_levels, eq(enrolled_students.grade_level_id, grade_levels.id))
    .leftJoin(sections, eq(sections.id, enrolled_students.section_id))
    .orderBy(asc(sections.school_year))
    .as('sq')

    const getNotEnrolledStudent = await db.select().from(getStudents).where(ne(getStudents.enrolled_year, ''))

    const formatStudent : TEnromentStudent[] = getNotEnrolledStudent.map(s => ({
      id : s.id,
      lrn : s.lrn,
      full_name : `${s.last_name}, ${s.first_name} .${s.middle_name?.at(0)}`,
      grade_level : s.grade_level_name,
      section : s.section_name,
      year_enrolled : s.enrolled_year
    }))
    return Response.json(formatStudent)

  } catch (error) {
    console.log(error)
    return Response.error()
  }
}


