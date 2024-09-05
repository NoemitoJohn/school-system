import { db } from "@/database/db";
import { students } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request,  { params }: { params: { id: string } }) { 
  try {
    const getStudentInfo = await db.select({
      id: students.id,
      lrn: sql<string>`${students.lrn}`,
      first_name: sql<string>`${students.first_name}`,
      last_name: sql<string>`${students.last_name}`,
      middle_name: sql<string>`${students.middle_name}`,
      ext_name: students.ext_name,
      gender: students.gender,
      birthdate: students.birth_date,
      religion: students.religion,
      contact_num: students.parent_mobile_number,
      profile_url: students.img_url,
      address : {
        province: students.province,
        city: students.city_municipality,
        barangay: students.barangay,
        house_num: students.street_address
      },
      parent: {
        father: students.father_name,
        mother: students.mother_name,
        guardian : students.guardian_name,
      }
    }).from(students).where(eq(students.id, params.id))
  
    return NextResponse.json({success: true, data : getStudentInfo[0]})
    
  } catch (error) {
    return NextResponse.error()
  }
}