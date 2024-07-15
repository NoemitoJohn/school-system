import { getEnrolledStudentWithPaidId } from "@/server/enrollment"
import PrintID from "./PrintID"
import elemIdTemplate from '@/id-template/ELEM.jpg'


export type TStudentID = {
  id: number
  lrn : string
  full_name : string
  grade_level : string 
  section : string 
  year_enrolled : string 
  is_paid_id : boolean
  parent_number : string
}


export default async function StudentPrintId() {
  const enrolledStudentPaidId = await getEnrolledStudentWithPaidId()
  
  return (
    <div>
      {enrolledStudentPaidId && ( 
        <PrintID rows={enrolledStudentPaidId} />
      )}
    </div>
  )
}

