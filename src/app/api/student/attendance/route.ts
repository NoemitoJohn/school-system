import { decrypt } from "@/app/lib/session";
import { db } from "@/database/db";
import { class_attendance, enrolled_students, grade_levels, sections, students } from "@/database/schema";
import { supabase } from "@/database/supabase";
import { ScannerCodeSchema } from "@/validation/schema";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request, {params} : {params  : {id : string}}) {
  const body = await request.json()
  
  const validate = ScannerCodeSchema.safeParse(body)
  if(!validate.success) { return NextResponse.error() }
  
  const {code} = validate.data
  const cookieStore = cookies()

  try {
    const attendance =  await db.transaction(async (tx) => {
      const studentInfo = await tx.select({
        student_id: students.id,
        full_name: sql<string>`CONCAT(${students.last_name},', ',${students.first_name}, '. ',  COALESCE(${students.middle_name}, ''))`.as('full_name'),
        grade_level: sql<string>`CONCAT(${grade_levels.level_name}, ': ', ${sections.section_name})`.as('grade_level'),
        img_url: students.img_url,
        section_id: sections.id,
        school_year: enrolled_students.school_year
      }).from(students).where(eq(students.lrn, code))
      .innerJoin(enrolled_students, eq(enrolled_students.id, students.enrollment_id))
      .innerJoin(sections, eq(sections.id, enrolled_students.section_id))
      .innerJoin(grade_levels, eq(grade_levels.id, sql`CAST (${sections.grade_level_id} as TEXT)`))

      const student = studentInfo[0]
      
      if(!student) { return null }
      let profile : string | null = null      
      
      if(student.img_url)  {
        const {data : {publicUrl}} = await supabase.storage.from('profile').getPublicUrl(student.img_url)
        profile = publicUrl
      }
      
      const session = cookieStore.get('session')?.value
      
      const user = await decrypt(session)
      const now = new Date()
      
      await tx.insert(class_attendance).values({
        attendance_date: now.toISOString(),
        created_by: user?.id as string,
        created_date: now,
        section_id: student.section_id,
        student_id: student.student_id,
        time_in: now.toLocaleTimeString(),
        updated_by: user?.id as string,
        updated_date: now,
      })

      return {
        full_name : student.full_name,
        grade_level: student.grade_level,
        school_year: student.school_year,
        profile_url: profile 
      }
    })


    if(!attendance) { return NextResponse.json({success: false}) }
    
    return NextResponse.json({success: true, data: attendance})

  } catch (error) {
    return NextResponse.error() 
  }

}