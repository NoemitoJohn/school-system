import MarginContainer from '@/components/container/MarginContainer'
import TeacherComponent from './TeacherComponent'
import { getClasses } from '@/server/sections'
import { getTeachers } from '@/server/teachers'

export const revalidate = 0

export type TTeacher = {
  id: string
  full_name: string
  email: string
  approval: string
  status: string
}

export default async function TeacherPage() {
  const classes = await getClasses()
  const teachers = await getTeachers()
  if(!classes || !teachers) return

  return (
    <>
      <MarginContainer >
        <p className='uppercase font-semibold'>Teachers</p>
          <TeacherComponent classes={classes} teachers={teachers}/>
        
      </MarginContainer>
    </>
  )
}
