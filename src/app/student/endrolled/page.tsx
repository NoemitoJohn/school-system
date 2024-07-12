import { getEnrolledStudent } from "@/server/enrollment"
import EnrolledStudent from "./EnrolledStudent";

export const revalidate = 0;
// export const dynamic = 'force-dynamic'

export default async function EnrolledPage() {
  const enrolledStudent = await getEnrolledStudent()
  
  if(!enrolledStudent){
    return (
      <div className="text-red-500">Something Went Wrong!</div>
    )
  }

  return (
    <div>
      <div >Enrolled Student</div>
      <div className="mt-4">
        <EnrolledStudent rows={enrolledStudent} />
      </div>
    </div>
  )
}
