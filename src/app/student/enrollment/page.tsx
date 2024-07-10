import Enrollment, { TEnromentStudent, TSection } from '@/components/EnrollmentSearch'
import { getGradeLevels } from '@/server/gradeLevel'
import { getSections } from '@/server/sections'
import { getStudentEnrollment} from '@/server/students'
// export const dynamic = 'force-dynamic'

export const revalidate = 0

export default async function StudentEnrollment() {

  const students = await getStudentEnrollment()
  const sections = await getSections()
  const gradeLevels = await getGradeLevels()

  if(!sections || !students || !gradeLevels){
    return (
      <div className='text-center text-red-400'>Something Went Wrong Please Try Again</div>
    )
  }
  return (
    <div>
      <Enrollment rows={students} sections={sections} gradeLevel={gradeLevels}/>
    </div>
  )
}
