import { db } from "@/database/db";
import { sections, users } from "@/database/schema";
import { TeacherSchema } from "@/validation/schema";
import { NextRequest, NextResponse } from "next/server";
import  bcrypt from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { getObjectFormData, } from "@/lib/utils";
import { supabase } from "@/database/supabase";
import path from "path";
import { nanoid } from "nanoid";
import { getTeachers } from "@/server/teachers";
import { uploadProfile } from "@/server/lib";


// export const uploadProfile = async (file : File, folder : 'student' | 'users/teachers' | 'users/parents') => {
//   const ext = path.extname(file.name)

//   const fileName = nanoid()

//   const {data : res , error} = await supabase.storage.from('profile').upload(`${folder}/${fileName + ext}`, file)
  
//   if(error){
//     console.log(21, error)
//     throw error
//   };

//   return res?.fullPath
// }

export async function POST(request: NextRequest) { 

  const formData = await request.formData()

  const body = getObjectFormData(formData)

  const parse = TeacherSchema.safeParse(body)
  
  if(!parse.success) { return NextResponse.error() }
  
  const {data} = parse

  const salt = await bcrypt.genSalt(10) // generate salt
  const hash = await bcrypt.hash(data.password, salt)
  
  try {
    let profilePath = '' 
    
    if(data.profile != null && data.profile instanceof File ) {
      profilePath = await uploadProfile(data.profile, 'users/teachers')
    }

    const insertedTeacher = await db.transaction(async (tx) => {
      const [teacher] = await tx.insert(users).values({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone_number,
        active: true,
        email: data.email,
        role_id: 'teacher',
        password: hash,
        //TODO: add img url
      }).returning({ 
        id: users.id,  
        full_name : sql<string>`UPPER( CONCAT(${users.last_name}, ', ', ${users.first_name}) )`.as('full_name'),
        status: sql<string>`CASE ${users.active} WHEN TRUE THEN 'ACTIVE' ELSE 'NOT ACTIVE' END`.as('status'),
        email: users.email,
        approval: sql<string>`CASE ${users.approval} WHEN TRUE THEN 'APPROVED' ELSE 'PENDING' END`.as('approval')
      })

      await tx.update(sections).set({adviser_id : teacher.id}).where(eq(sections.id, data.section))
      
      return teacher
    })

    return NextResponse.json({status: 200, data : insertedTeacher})

  } catch (error) {
    return NextResponse.error()
  }
}

export async function DELETE(request: NextRequest) {
  
  const body : {id : string} = await request.json()

  try {
    const [deleteTeacher] = await db.delete(users).where(eq(users.id, body.id)).returning({id : users.id})
    return NextResponse.json({status: 200, data : deleteTeacher.id})
  
  } catch (error) {
    return NextResponse.error()
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
 
  const query = searchParams.get('search')

  try {

    if(query) {
      const teachers = await getTeachers(query)
      return NextResponse.json({status : 200, data :teachers})
    }
    
    const teachers = await getTeachers()

    return NextResponse.json({status: 200, data: teachers})
    
  } catch (error) {
    
    return NextResponse.error()
  }
}
