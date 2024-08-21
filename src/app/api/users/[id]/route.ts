import { db } from "@/database/db";
import { users } from "@/database/schema";
import { getObjectFormData } from "@/lib/utils";
import { OPTeacherSchema, TTeacherSchema } from "@/validation/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

  try {
    const [teacherInfo] = await db.select({
      id: sql<string>`${users.id}`.as('id'),
      first_name: sql<string>`${users.first_name}`.as('first_name'),
      last_name: sql<string>`${users.last_name}`.as('last_name'),
      email: sql<string>`${users.email}`.as('email'),
      phone_number: sql<string>`${users.phone}`
      
    }).from(users).where(eq(users.id, params.id))

    const proneTeacherInfo : Partial<TTeacherSchema> = {
      id: teacherInfo.id,
      first_name : teacherInfo.first_name,
      last_name : teacherInfo.last_name,
      email: teacherInfo.email,
      phone_number: teacherInfo.phone_number,
    }

    return NextResponse.json({
      teacher: proneTeacherInfo,
      status: 200
    })

  } catch (error) {
    return NextResponse.error()
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  
  const forData = await request.formData()
  const data = getObjectFormData(forData)
  
  const parse = OPTeacherSchema.safeParse(data)
  
  if(!parse.success) { return NextResponse.error() }

  //TODO: delete previous saved image in supabase

  const {data : teacherData} = parse

  try {
    const [updateTeacherInfo] = await db.update(users).set({
      first_name : teacherData.first_name,
      last_name : teacherData.last_name,
      phone : teacherData.phone_number,
      email: teacherData.email,
    }).where(eq(users.id, params.id))
    .returning({
      id: users.id,  
      full_name : sql<string>`UPPER( CONCAT(${users.last_name}, ', ', ${users.first_name}) )`.as('full_name'),
      status: sql<string>`CASE ${users.active} WHEN TRUE THEN 'ACTIVE' ELSE 'NOT ACTIVE' END`.as('status'),
      email: users.email,
      approval: sql<string>`CASE ${users.approval} WHEN TRUE THEN 'APPROVED' ELSE 'PENDING' END`.as('approval')
    })

    return NextResponse.json({status: 200, data : updateTeacherInfo})
  } catch (error) {
    return NextResponse.error()
  }
  // return NextResponse.json({})
}