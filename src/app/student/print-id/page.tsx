import { getEnrolledStudentWithPaidId } from "@/server/enrollment"
import PrintID from "./PrintID"
import elemIdTemplate from '@/id-template/ELEM.jpg'
import MarginContainer from "@/components/container/MarginContainer"

export const revalidate = 0

export type TStudentID = {
  id: string
  lrn : string
  full_name : string
  grade_level : string 
  section : string 
  year_enrolled : string 
  is_paid_id : boolean
  parent_number : string
  enrolled_id : string
  img_url?: string
  qr? : string
}


export default async function StudentPrintId() {
  const enrolledStudentPaidId = await getEnrolledStudentWithPaidId()
  console.log(enrolledStudentPaidId)
  return (
    <div>
      <MarginContainer>

      <div className="uppercase font-semibold">Print ID</div>
      {/* {enrolledStudentPaidId && (  */}
      <div className="mt-3"> 
        <PrintID rows={enrolledStudentPaidId!} />
      </div>
      {/* )} */}
      </MarginContainer>
      
    </div>
  )
}

