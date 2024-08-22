import { db } from "@/database/db";
import { users } from "@/database/schema";
import { LoginSchema } from "@/validation/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { createSession, encrypt } from "@/app/lib/session";

export async function POST(request: NextRequest) {
  
  const body = await request.json()
  const validation = LoginSchema.safeParse(body)

  if(!validation.success) { return NextResponse.error() }
  
  const {data} = validation

  const getUsers = await db.select({
    id: users.id,
    password: sql<string>`${users.password}`.as('password'),
    role:  sql<string>`${users.role_id}`.as('role'),
    approval: sql<boolean>`${users.approval}`
  }).from(users).where(eq(users.email, data.email))

  const user = getUsers[0]
  
  if(!user) { return NextResponse.json({success: false, message: 'Incorect Credentials'})}
  
  const valid =  await bcrypt.compare(data.password, user.password!)
  
  if(!valid) { return NextResponse.json({success: false, message: 'Incorect Credentials'}) }
  
  const proneUser = {
    id: user.id,
    role: user.role,
    approve: user.approval
  }
  
  const token = await encrypt(proneUser)
  
  createSession(token)

  return NextResponse.json({success: true})
}
