import { TEnromentStudent } from "@/components/EnrollmentSearch"
import { db } from "@/database/db"
import { enrolled_students, grade_levels, sections, students } from "@/database/schema"
import { StudentEnrollmentSchema, TStudentEnrollmentSchema } from "@/validation/schema"
import { and, eq, sql } from "drizzle-orm"

export async function POST(request: Request) {
  const body : TStudentEnrollmentSchema = await request.json()

  const validation =  StudentEnrollmentSchema.safeParse(body)
  if(validation.error) {
    return Response.error()
  }


  const {data} = validation
  let isInsertAction = false
  try {
    let enrolmentId = 0
    await db.transaction(async (tx) => {
      try {
        const [enrolled] = await tx.select({
          id : sql<number>`COALESCE(${enrolled_students.enrolled_student_id}, 0)`.as('id')
        }).from(enrolled_students).where(and(eq(enrolled_students.student_id, Number(data.id)), eq(enrolled_students.school_year, data.school_year)))

        if(enrolled) {
          const updateEnrolment = await tx.update(enrolled_students).set({
            grade_level_id : +data.grade_level,
            section_id : +data.section,
          }).where(eq(enrolled_students.enrolled_student_id, enrolled.id))

          enrolmentId = enrolled.id

        } else {
          const [insert] = await tx.insert(enrolled_students).values({
            grade_level_id : +data.grade_level,
            section_id : +data.section,
            student_id : +data.id,
            school_year : data.school_year
          }).returning()
          
          enrolmentId  = insert.enrolled_student_id
          isInsertAction = true
        }
        await tx.update(students).set({
          enrollment_id : enrolmentId
        }).where(eq(students.student_id, +data.id))
        
      } catch (error) {
        await tx.rollback()
        return Response.error()
      }
    })

    const [getStudent] = await db.select({
      id : students.student_id,
      lrn : sql<string>`${students.lrn}`,
      first_name : students.first_name,
      last_name : students.last_name,
      middle_name : students.middle_name,
      grade_level : sql<string>`${grade_levels.level_name}`,
      enrolled_year : sql<string>`${enrolled_students.school_year}`,
      section_name : sql<string>`${sections.section_name}`,
    })
    .from(students)
    .innerJoin(enrolled_students, eq(students.student_id, enrolled_students.student_id))
    .innerJoin(sections, eq(sections.section_id, enrolled_students.section_id))
    .innerJoin(grade_levels, eq(grade_levels.grade_level_id, enrolled_students.grade_level_id))
    .where(eq(enrolled_students.enrolled_student_id, enrolmentId))
    
    const formatStudent : TEnromentStudent = {
      full_name : `${getStudent.last_name}, ${getStudent.first_name} .${getStudent.middle_name?.at(0)}`,
      // enrolled_id : getStudent.enrolled_id,
      grade_level : getStudent.grade_level,
      lrn : getStudent.lrn,
      id : getStudent.id,
      section : getStudent.section_name,
      year_enrolled : getStudent.enrolled_year
    }
    const action = isInsertAction ? 'ADD' : 'UPDATE'
    // console.log(action ,formatStudent)
    return Response.json({action : action,  student : formatStudent})
  } catch (error) {

  }

}