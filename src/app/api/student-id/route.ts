import { db } from "@/database/db"
import { enrolled_students } from "@/database/schema"
import { getEnrolledStudentWithPaidId } from "@/server/enrollment"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: Request) { 
  const body : {enrolled_id : number}= await request.json()

  try {
    const updateIdPaid = await db.update(enrolled_students).set({
      is_id_paid : true
    }).where(eq(enrolled_students.enrolled_student_id, body.enrolled_id))
    revalidatePath('/student/print-id')
    return Response.json({student_enrolled_id : body.enrolled_id})
  } catch (error) {
    return Response.error()
  }
}

export async function GET(request: NextRequest) { 
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const s = search ? search : ''
  
  try {
    const studentSearch =  await getEnrolledStudentWithPaidId(s)
    return NextResponse.json(studentSearch)
    
  } catch (error) {
    return NextResponse.error()
  }
  
}


