import { decrypt } from "@/app/lib/session";
import { db } from "@/database/db";
import { class_attendance, enrolled_students, grade_levels, sections, students } from "@/database/schema";
import { supabase } from "@/database/supabase";
import { ScannerCodeSchema } from "@/validation/schema";
import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) { // 127873170125
  const body = await request.json()
  
  const validate = ScannerCodeSchema.safeParse({...body, date: new Date(body.date)})
  if(!validate.success) { 
    console.log(validate.error)
    return NextResponse.error() 
  }
  
  const {code, date : now} = validate.data
  
  console.log('format-data',new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(now))

  console.log('now', now)
  const cookieStore = cookies()
  const session = cookieStore.get('session')?.value
  
  const user = await decrypt(session)

  try {
    const attendanceInfo =  await db.transaction(async (tx) => {
      const parent = alias(class_attendance, 'parent')
      // subquery get max created_date 
      const subquery =  db.select({
        max_date: sql<string>`MAX(${class_attendance.created_date})`.as('sq_max_date'),
        attendance_date: sql<string>`${class_attendance.attendance_date}`.as('sq_attendance_date'),
        student_id: sql<string>`${class_attendance.student_id}`.as('sq_student_id'),
      })
      .from(class_attendance)
      .innerJoin(students, eq(students.id, class_attendance.student_id))
      .where(
        and(
          eq(students.lrn, code), 
          eq(class_attendance.attendance_date, sql`DATE(${new Intl.DateTimeFormat('en-US').format(now)})`)
        )
      )
      .groupBy(class_attendance.student_id, class_attendance.attendance_date).as('sq')
      // main query
      const latestAttendance = await db.select({
        is_time_out: parent.is_time_out
      }).from(subquery)
      .innerJoin(parent, sql`${subquery.max_date} = ${parent.created_date} AND ${subquery.attendance_date} = ${parent.attendance_date} AND ${subquery.student_id} = ${parent.student_id}`)
      
      const studentInfo = await db.select(
        {
          student_id: students.id,
          full_name: sql<string>`CONCAT(${students.last_name},', ',${students.first_name}, '. ',  COALESCE(${students.middle_name}, ''))`.as('full_name'),
          grade_level: sql<string>`${grade_levels.level_name}`.as('grade_level'),
          section_name: sql<string>`${sections.section_name}`.as('section_name'),
          img_url: students.img_url,
          section_id: sections.id,
          school_year: enrolled_students.school_year
        }
      ).from(students).where(eq(students.lrn, code))
      .innerJoin(enrolled_students, eq(enrolled_students.id, students.enrollment_id))
      .innerJoin(sections, eq(sections.id, enrolled_students.section_id))
      .innerJoin(grade_levels, eq(grade_levels.id, sql`CAST (${sections.grade_level_id} as TEXT)`))

      if(studentInfo.length === 0) return null; // return null if the scanned code is not valid

      const attendanceHistory = await db.select({
        is_time_out : class_attendance.is_time_out,
        time_in: class_attendance.time_in,
        time_out: class_attendance.time_out,
      }).from(class_attendance).where(
        and(
          eq(class_attendance.student_id, studentInfo[0].student_id), 
          eq(class_attendance.attendance_date, sql`DATE(${new Intl.DateTimeFormat('en-US').format(now)})`)
        )
      )
      let profile : string | null = null

      if(studentInfo[0].img_url)  {
          const {data : {publicUrl}} = await supabase.storage.from('profile').getPublicUrl(studentInfo[0].img_url)
          profile = publicUrl
      }

      if(latestAttendance.length === 0) {
        // insert time in attendance
        console.log('insert') 
        const insertTimeIn = await db.insert(class_attendance).values({
          attendance_date: new Intl.DateTimeFormat('en-US').format(now),
          is_time_out: false,
          time_in_procedure: 'Scan',
          created_by: user?.id as string,
          created_date: now,
          section_id: studentInfo[0].section_id,
          student_id: studentInfo[0].student_id,
          time_in: new Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(now),
          updated_by: user?.id as string,
          updated_date: now,
        }).returning( {
          is_time_out: class_attendance.is_time_out, 
          time_in: class_attendance.time_in, 
          current: class_attendance.created_date,
          time_out: class_attendance.time_out
        })
        
        return {
          full_name : studentInfo[0].full_name,
          grade_level: studentInfo[0].grade_level,
          school_year:  studentInfo[0].school_year,
          section_name: studentInfo[0].section_name,
          profile_url: profile,
          history: [...attendanceHistory, ...insertTimeIn]
        }
      }
      
      const time_out = !latestAttendance[0].is_time_out
      let addedAttendance : { is_time_out: boolean | null; time_in: string | null; time_out: string | null; }[] = [] 
      
      if(time_out) {
        const insertTimeOut = await db.insert(class_attendance).values({
          attendance_date: new Intl.DateTimeFormat('en-US').format(now),
          is_time_out: time_out,
          time_out_procedure: 'Scan',
          created_by: user?.id as string,
          created_date: now,
          section_id: studentInfo[0].section_id,
          student_id: studentInfo[0].student_id,
          time_out:  new Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(now),
          updated_by: user?.id as string,
          updated_date: now,
        }).returning( {
          is_time_out: class_attendance.is_time_out, 
          time_in: class_attendance.time_in, 
          current: class_attendance.created_date,
          time_out: class_attendance.time_out
        })
        
        addedAttendance = insertTimeOut
      } else {
        
        const insertTimeIn = await db.insert(class_attendance).values({
          attendance_date: new Intl.DateTimeFormat('en-US').format(now),
          is_time_out: time_out,
          time_in_procedure: 'Scan',
          created_by: user?.id as string,
          created_date: now,
          section_id: studentInfo[0].section_id,
          student_id: studentInfo[0].student_id,
          time_in:  new Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(now),
          updated_by: user?.id as string,
          updated_date: now,
        }).returning({
          is_time_out: class_attendance.is_time_out, 
          time_in: class_attendance.time_in, 
          current: class_attendance.created_date,
          time_out: class_attendance.time_out
        })
        
        addedAttendance = insertTimeIn
      }
      
      return {
        full_name : studentInfo[0].full_name,
        grade_level: studentInfo[0].grade_level,
        section_name: studentInfo[0].section_name,
        school_year:  studentInfo[0].school_year,
        profile_url: profile,
        history: [...attendanceHistory, ...addedAttendance]
      }
    })
    console.log(170, attendanceInfo)
    
    if(attendanceInfo == null) { return NextResponse.json({success: false, message: 'Cant find student info in enrolled list!'})}
    
    return NextResponse.json({success: true, data: attendanceInfo})
    
  } catch (error) {
    console.log(error)
    return NextResponse.error() 
  }

}