import { revalidate } from "@/app/class/add/page"
import { db } from "@/database/db"
import { enrolled_students } from "@/database/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

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