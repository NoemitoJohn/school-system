import { db } from "@/database/db";
import { TInsertUser, users } from "@/database/schema";
import { TTeacherFileSchema } from "@/validation/schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body: {password: string, teachers : TTeacherFileSchema[]} = await request.json()
  
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(body.password, salt)

    const transformTeacher : TInsertUser[] = body.teachers.map(v => ({
      first_name : v.first_name,
      last_name : v.last_name, 
      password: hash,
      email: v.email,
      phone: v.phone,
      active: true,
      role_id: 'teacher'
    }))

    const insertTeacher = await db.insert(users).values(transformTeacher).returning({
      id: users.id,
      full_name: sql<string>`UPPER( CONCAT(${users.last_name}, ', ', ${users.first_name}) )`.as('full_name'),
      status: sql<string>`CASE ${users.active} WHEN TRUE THEN 'ACTIVE' ELSE 'NOT ACTIVE' END`.as('status'),
      email: users.email,
      approval: sql<string>`CASE ${users.approval} WHEN TRUE THEN 'APPROVED' ELSE 'PENDING' END`.as('approval')
    })
    return NextResponse.json({status: 200, data : insertTeacher})
  
  } catch (error) {
    return NextResponse.error()
  }
}