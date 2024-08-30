import { decrypt } from "@/app/lib/session";
import { db } from "@/database/db";
import { class_attendance, enrolled_students, grade_levels, sections, students } from "@/database/schema";
import { supabase } from "@/database/supabase";
import { ScannerCodeSchema } from "@/validation/schema";
import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json()
  
  const validate = ScannerCodeSchema.safeParse({...body, date: new Date(body.date)})
  if(!validate.success) { 
    console.log(validate.error)
    return NextResponse.error() 
  }
  
  const {code, date : now} = validate.data
  const cookieStore = cookies()

  try {
    const attendance =  await db.transaction(async (tx) => {
      const parent = alias(class_attendance, 'parent')

      const subquery = await db.select({
        max_date: sql<string>`MAX(${class_attendance.created_date})`.as('max_date'),
        attendance_date: sql<string>`${class_attendance.attendance_date}`,
        student_id: sql<string>`${class_attendance.student_id}`.as('student_id'),
      })
      .from(class_attendance)
      .innerJoin(students, eq(students.id, class_attendance.student_id))
      .where(
        and(
          eq(students.lrn, code), 
          eq(class_attendance.attendance_date, sql`DATE(${now.toLocaleDateString()})`)
        )
      )
      .groupBy(class_attendance.student_id, class_attendance.attendance_date)

      console.log(subquery)

      // const studentInfo = await tx.select({
      //   student_id: students.id,
      //   full_name: sql<string>`CONCAT(${students.last_name},', ',${students.first_name}, '. ',  COALESCE(${students.middle_name}, ''))`.as('full_name'),
      //   grade_level: sql<string>`CONCAT(${grade_levels.level_name}, ': ', ${sections.section_name})`.as('grade_level'),
      //   img_url: students.img_url,
      //   section_id: sections.id,
      //   school_year: enrolled_students.school_year
      // }).from(students).where(eq(students.lrn, code))
      // .innerJoin(enrolled_students, eq(enrolled_students.id, students.enrollment_id))
      // .innerJoin(sections, eq(sections.id, enrolled_students.section_id))
      // .innerJoin(grade_levels, eq(grade_levels.id, sql`CAST (${sections.grade_level_id} as TEXT)`))

      // const student = studentInfo[0]
      
      // if(!student) { return null }
      // let profile : string | null = null      
      
      // if(student.img_url)  {
      //   const {data : {publicUrl}} = await supabase.storage.from('profile').getPublicUrl(student.img_url)
      //   profile = publicUrl
      // }
      
      // const session = cookieStore.get('session')?.value
      
      // const user = await decrypt(session)
      
      // await tx.insert(class_attendance).values({
      //   attendance_date: now.toISOString(),
      //   created_by: user?.id as string,
      //   created_date: now,
      //   section_id: student.section_id,
      //   student_id: student.student_id,
      //   time_in: now.toLocaleTimeString(),
      //   updated_by: user?.id as string,
      //   updated_date: now,
      // })

      // return {
      //   full_name : student.full_name,
      //   grade_level: student.grade_level,
      //   school_year: student.school_year,
      //   profile_url: profile 
      // }
    })

    return NextResponse.json({success: true, data: attendance})

    // if(!attendance) { return NextResponse.json({success: false}) }
    

  } catch (error) {
    console.log(error)
    return NextResponse.error() 
  }

}