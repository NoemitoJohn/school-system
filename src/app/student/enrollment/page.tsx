import MarginContainer from '@/components/container/MarginContainer'
import Enrollment, { TEnromentStudent, TSection } from '@/components/EnrollmentSearch'
import { getGradeLevels } from '@/server/gradeLevel'
import { getSections } from '@/server/sections'
import { getStudentEnrollment} from '@/server/students'

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
      <MarginContainer>
        <div className='uppercase font-semibold'>Enrollment</div>
        <div className='mt-3'>
         <Enrollment rows={students} sections={sections} gradeLevel={gradeLevels}/>
        </div>
      </MarginContainer>
    </div>
  )
}


