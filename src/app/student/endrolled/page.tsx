import { getEnrolledStudent } from "@/server/enrollment"
import EnrolledStudent from "./EnrolledStudent";
import MarginContainer from "@/components/container/MarginContainer";

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
      <MarginContainer>
        <div className="uppercase font-semibold" >Enrolled Student</div>
        <div className="mt-3">
          <EnrolledStudent rows={enrolledStudent} />
        </div>
      </MarginContainer>
    </div>
  )
}
