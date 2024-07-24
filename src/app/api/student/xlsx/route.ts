
import { TxlsxStudent } from "@/components/StudentForm";
import { db } from "@/database/db";
import { students } from "@/database/schema";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  const body = await request.json() as Array<TxlsxStudent>

  try {
    const insertStudents  = body.map(async (v) => {
      return QRCode.toDataURL(v.lrn).then(qr => 
          db.insert(students).values({
          first_name : v.first_name,
          last_name : v.last_name,
          middle_name : v.middle_name,
          lrn : v.lrn,
          birth_date : v.birth_date,
          active: 1,
          gender : v.gender,
          religion : v.religion,
          mother_tongue : v.mother_tongue,
          father_name : v.father_name,
          mother_name : v.mother_name,
          qrcode : qr,
        }).returning()
        )
      }
    )

    const _ = await Promise.all(insertStudents)

    revalidatePath('/student/enrollment', 'page')
    return NextResponse.json({})  
  } catch (error) {
    return NextResponse.error()    
  }
}


