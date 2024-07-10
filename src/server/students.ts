'use server'
import { TEnromentStudent } from "@/components/EnrollmentSearch"
import { db } from "@/database/db"
import { enrolled_students, grade_levels, sections, students } from "@/database/schema"
import { TStudentEnrollmentSchema } from "@/validation/schema"
import { and, asc, desc, eq, ilike, like, max, or, sql, } from "drizzle-orm"
import { revalidatePath } from "next/cache"


export async function getStudentEnrollment() {
  try {
    const getStudents = await db.select(
    {
      id : sql<number>`${students.student_id}`,
      lrn : sql<string>`${students.lrn}`,
      first_name : sql<string>`${students.first_name}`,
      last_name : sql<string>`${students.last_name}`,
      middle_name : sql<string>`${students.middle_name}`,
      enrollment_id : sql<string>`COALESCE(${enrolled_students.enrolled_student_id}, -1)`.as('enrollment_id'),
      grade_level_name : sql<string>`COALESCE(${grade_levels.level_name}, '')`.as('grade_level_name'),
      section_name : sql<string>`COALESCE(${sections.section_name}, '')`.as('section_name'),
      enrolled_year : sql<string>`COALESCE(${enrolled_students.school_year}, '')`.as('enrolled_year'),
    })
    .from(students)
    .leftJoin(enrolled_students, eq(students.student_id, enrolled_students.student_id))
    .leftJoin(grade_levels, eq(enrolled_students.grade_level_id, grade_levels.grade_level_id))
    .leftJoin(sections, eq(sections.section_id, enrolled_students.section_id)).orderBy(asc(sections.school_year))

    const formatStudent : TEnromentStudent[] = getStudents.map(s => ({
      id : s.id,
      lrn : s.lrn,
      full_name : `${s.last_name}, ${s.first_name} .${s.middle_name?.at(0)}`,
      grade_level : s.grade_level_name,
      section : s.section_name,
      year_enrolled : s.enrolled_year
    }))
    return formatStudent

  } catch (error) {
    console.log(error)
  }
}

export async function searchStudentEnrollment(search : string) {
  try {
    const searchStudent =  await db.select({
      id : sql<number>`${students.student_id}`,
      lrn : sql<string>`${students.lrn}`,
      first_name : sql<string>`${students.first_name}`,
      last_name : sql<string>`${students.last_name}`,
      middle_name : sql<string>`${students.middle_name}`,
      enrollment_id : sql<string>`COALESCE(${enrolled_students.enrolled_student_id}, -1)`.as('enrollment_id'),
      grade_level_name : sql<string>`COALESCE(${grade_levels.level_name}, '')`.as('grade_level_name'),
      section_name : sql<string>`COALESCE(${sections.section_name}, '')`.as('section_name'),
      enrolled_year : sql<string>`COALESCE(${enrolled_students.school_year}, '')`.as('enrolled_year'),
    })
    .from(students)
    .leftJoin(enrolled_students, eq(students.student_id, enrolled_students.student_id))
    .leftJoin(grade_levels, eq(enrolled_students.grade_level_id, grade_levels.grade_level_id))
    .leftJoin(sections, eq(sections.section_id, enrolled_students.section_id)).orderBy(asc(sections.school_year))
    .where(or(ilike(students.last_name, `%${search}%`), ilike(students.first_name, `%${search}%`)))

    console.log(searchStudent)

    const formatSearchStudent : TEnromentStudent[] = searchStudent.map(s => ({
      id : s.id,
      lrn : s.lrn,
      full_name : `${s.last_name}, ${s.first_name} .${s.middle_name?.at(0)}`,
      grade_level : s.grade_level_name,
      section : s.section_name,
      year_enrolled : s.enrolled_year
    })) 

    return formatSearchStudent
  } catch (error) {
    // throw new Error('Something went wrong')
    console.log(error)
  }
  
}

export async function getStudentInfo(id : string) {
  try {
    const student = await db.select({
      id : students.student_id,
      first_name : students.first_name,
      last_name : students.last_name,
      middle_name : students.middle_name
    }).from(students).where(eq(students.student_id, Number(id)))
    return student
  } catch (error) {
  }
}

export async function insertEnrollment(data : TStudentEnrollmentSchema) {
   
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
        console.log(error)
        await tx.rollback()
      }
    })

    const [getStudent] = await db.select({
      id : students.student_id,
      first_name : students.first_name,
      last_name : students.last_name,
      middle_name : students.middle_name,
      lrn : sql<string>`${students.lrn}`,
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
      lrn : getStudent.lrn,
      grade_level : getStudent.grade_level,
      id : getStudent.id,
      section : getStudent.section_name,
      year_enrolled : getStudent.enrolled_year
    }
    return formatStudent
    
  } catch (error) {

  }

  if(isInsertAction) 
  {
    revalidatePath('/student/enrollment')
  }
}
