import { db } from "@/database/db";
import { users } from "@/database/schema";
import { SignUpSchema } from "@/validation/schema";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = SignUpSchema.safeParse(body)
  if(!validation.success) { return NextResponse.error() }
  const {data} = validation
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(data.password, salt)

    const insertUser = await db.insert(users).values({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email, 
      phone: data.phone_number,
      password: hash,
      role_id: 'teacher'
    }).returning({
      id: users.id,
      role: users.role_id
    })
    
    return NextResponse.json({success: true})
    
  } catch (error) {
    return NextResponse.error()
  }

}