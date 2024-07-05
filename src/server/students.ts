'use server'
import { TEnromentStudent } from "@/components/EnrollmentSearch"
import { db } from "@/database/db"
import { enrolled_students, grade_levels, sections, students } from "@/database/schema"
import { TStudentEnrollmentSchema } from "@/validation/schema"
import { eq, like, max, or, sql, } from "drizzle-orm"

export async function getStudentEnrollment() {
  try {
    const getEnrolledStudent =  db.select({
      id : enrolled_students.id,
      student_id : enrolled_students.student_id,
      school_id : enrolled_students.school_id,
      section_name : sections.section_name,
      grade_level : grade_levels.level_name,
      school_year : max(enrolled_students.school_year).as('school_year')
    })
    .from(enrolled_students)
    .leftJoin(sections, eq(sections.id, enrolled_students.section_id))
    .leftJoin(grade_levels, eq(grade_levels.id, enrolled_students.grade_level))
    .groupBy(enrolled_students.student_id)
    .as('sq')

    const getStudents = await db.select(
    {
      id : sql<number>`students.id`,
      first_name : sql<string>`${students.first_name}`,
      last_name : sql<string>`${students.last_name}`,
      middle_name : sql<string>`${students.middle_name}`,
      grade_level : sql<string>`IFNULL(${getEnrolledStudent.grade_level}, '')`.as('grade_level'),
      enrolled_year : sql<string>`IFNULL(${getEnrolledStudent.school_year}, '')`.as('enrolled_year'),
      section_name : sql<string>`IFNULL(${getEnrolledStudent.section_name}, '')`.as('section_name'),
    }
    )
    .from(students)
    .leftJoin(getEnrolledStudent, eq(students.id, getEnrolledStudent.student_id))

    console.log(getStudents)
    const formatStudent : TEnromentStudent[] = getStudents.map(s => ({
      id : s.id,
      full_name : `${s.last_name}, ${s.first_name} .${s.middle_name?.at(0)}`,
      grade_level : s.grade_level,
      section : s.section_name,
      year_enrolled : s.enrolled_year
    }))


    return formatStudent

  } catch (error) {
    
  }
}

export async function searchStudentEnrollment(search : string) {
  try {
    const getEnrolledStudent = db.select({
      id : enrolled_students.id,
      student_id : enrolled_students.student_id,
      school_id : enrolled_students.school_id,
      section_name : sections.section_name,
      grade_level : grade_levels.level_name,
      school_year : max(enrolled_students.school_year).as('school_year')
    })
    .from(enrolled_students)
    .innerJoin(sections, eq(sections.id, enrolled_students.section_id))
    .innerJoin(grade_levels, eq(grade_levels.id, enrolled_students.grade_level))
    .groupBy(enrolled_students.student_id).as('sq')
  

    const searchStudent = await db.select(
    {
      id : students.id,
      first_name : students.first_name,
      last_name : students.last_name,
      middle_name : students.middle_name,
      grade_level : sql<string>`IFNULL(${getEnrolledStudent.grade_level}, '')`.as('grade_level'),
      enrolled_year : sql<string>`IFNULL(${getEnrolledStudent.school_year}, '')`.as('enrolled_year'),
      section_name : sql<string>`IFNULL(${getEnrolledStudent.section_name}, '')`.as('section_name'),
    }
    ).from(students)
    .where(or(like(students.last_name, `%${search}%`), like(students.first_name, `%${search}%`)))
    .leftJoin(getEnrolledStudent, eq(students.id, getEnrolledStudent.student_id))

    const formatSearchStudent : TEnromentStudent[] = searchStudent.map(s => ({
      id : s.id,
      full_name : `${s.last_name}, ${s.first_name} .${s.middle_name?.at(0)}`,
      grade_level : s.grade_level,
      section : s.section_name,
      year_enrolled : s.enrolled_year
    })) 

    return formatSearchStudent
  } catch (error) {
    throw new Error('Something went wrong')
  }
  
}

export async function getStudentInfo(id : string) {
  try {
    const student = await db.select({
      id : students.id,
      first_name : students.first_name,
      last_name : students.last_name,
      middle_name : students.middle_name
    }).from(students).where(eq(students.id, Number(id)))
    return student
  } catch (error) {
  }
}

export async function insertEnrollment(data : TStudentEnrollmentSchema) {
   
  try {
    let enrolmentId = 0

    await db.transaction(async (tx) => {
      try {
        const [enrollment] = await tx.insert(enrolled_students).values({
            grade_level : Number(data.grade_level),
            school_year : data.school_year,
            section_id : Number(data.section),
            student_id : Number(data.id),
        }).returning()
        
        enrolmentId = enrollment.id
        // const [grade_level] = await tx.select({level_name : grade_levels.level_name}).from(grade_levels).where(eq(grade_levels.id, enrollment.grade_level))
        
        await tx.update(students).set({
          enrollment_id : enrollment.id
        }).where(eq(students.id, enrollment.student_id))
        
      } catch (error) {
        await tx.rollback()
      }
    })

    const [getStudent] = await db.select({
      id : students.id,
      first_name : students.first_name,
      last_name : students.last_name,
      middle_name : students.middle_name,
      grade_level : grade_levels.level_name,
      enrolled_year : enrolled_students.school_year,
      section_name : sections.section_name,
    })
    .from(students)
    .innerJoin(enrolled_students, eq(students.id, enrolled_students.student_id))
    .innerJoin(sections, eq(sections.id, enrolled_students.section_id))
    .innerJoin(grade_levels, eq(grade_levels.id, enrolled_students.grade_level))
    .where(eq(enrolled_students.id, enrolmentId))
    
    const formatStudent : TEnromentStudent = {
      full_name : `${getStudent.last_name}, ${getStudent.first_name} .${getStudent.middle_name?.at(0)}`,
      // enrolled_id : getStudent.enrolled_id,
      grade_level : getStudent.grade_level,
      id : getStudent.id,
      section : getStudent.section_name,
      year_enrolled : getStudent.enrolled_year
    }
    return formatStudent
    
  } catch (error) {

  }

  
  // revalidatePath('/student/enrollment')
}
