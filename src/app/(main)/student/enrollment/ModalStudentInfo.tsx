import Dropdown from '@/components/Dropdown'
import { TGradeLevel, TSection } from '@/components/EnrollmentSearch'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StudentEnrollmentSchema, TStudentEnrollmentSchema } from '@/validation/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useSWR, { Fetcher } from 'swr'


type TModalStudentInfoProps = {
  isOpen : boolean 
  id : string 
  sections : TSection[]
  gradeLevel : TGradeLevel[] 
  handleOpenChange : (open : boolean) => void
  enrollSubmit : SubmitHandler<TStudentEnrollmentSchema>
}



export default function ModalStudentInfo ({isOpen, id, handleOpenChange, enrollSubmit, sections, gradeLevel } : TModalStudentInfoProps) {

  const fetcher : Fetcher<TStudentEnrollmentSchema, string> = async (args : string) => {
    const request = await fetch(args)

    if(!request.ok){
      const error = new Error('An error occurred while fetching the data.')
      throw error
    }

    const respose : TStudentEnrollmentSchema = await request.json()
    return respose
  }

  const {data : student, error, isLoading} = useSWR<TStudentEnrollmentSchema, Error>(`/api/student/${id}`, fetcher )
  const [sectionsState, setSectionsState] = useState(sections)
  const [gradeLevelState, setGradelevelState] = useState(gradeLevel)
  const [schoolYear, setSchoolYear] = useState(sections)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState : {errors, isSubmitting}
  } = useForm<TStudentEnrollmentSchema>({
    resolver : zodResolver(StudentEnrollmentSchema)
  })

  useEffect(() => {
    if(student){
      setValue('id', student.id)
      setValue('full_name', student.full_name)
    }
  }, [student])


  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if(type == 'change') {
        if(name == 'grade_level'){
          const grade_level_id = value.grade_level
          const filterSection = sections.filter((v) => v.grade_level_id == grade_level_id)
          setSectionsState(filterSection)
        }
        if(name == 'section') {
          const section_id = value.section
          const filterSection = sections.filter((v) => v.id == section_id)
          setSchoolYear(filterSection)
        }
      } else {
          const section_id = value.section
          if(section_id) {
            const filterSection = sections.filter((v) => v.id == section_id)
            setSchoolYear(filterSection)
          }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className='max-w-[60%]'>
          <DialogHeader>
            <DialogTitle>Enrolment Form</DialogTitle>
          </DialogHeader>
          {isLoading ? 
          ( <div className='text-center'>...Loading</div>) :  ( 
          <div>
          {error ? (<div className='text-center text-red-500'>Something went Wrong</div>) : (
            <div className='flex justify-evenly gap-6'>
                <div>
                  <div className="grid gap-4 py-4">
                    <div className='text-center font-sans'>Current Grade Level</div>
                    {!student?.school_year && ( // if no record
                      <div className='text-center italic'>No Records</div>
                    ) }
                    {student?.school_year && ( // if had a record
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label className='text-right'>Grade Level</Label>
                        <div className="col-span-3"> 
                          <Dropdown disabled label='Select Grade Level' items={gradeLevel} value={student?.grade_level}
                            getValue={(p) => p.id}
                            getLabel={(p) => p.level_name}
                          />
                        </div>
                        <Label className='text-right'>Section</Label>
                        <div className="col-span-3"> 
                          <Dropdown disabled label='Select Section' items={sections}  value={student?.section}
                            getValue={(p) => p.id}
                            getLabel={(p) => p.section_name}
                          />
                        </div>
                        <Label className='text-right'>School Year</Label>
                        <div className="col-span-3"> 
                          <Input disabled value={student?.school_year} />
                        </div>
                      </div>

                    )}
                  </div>
                </div>
                <div>
                  <form onSubmit={handleSubmit(enrollSubmit)}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label className='text-right'>Student Name</Label>
                        <Input {...register('full_name')} placeholder='test' className="col-span-3" readOnly/>
                        <Controller
                          name='grade_level'
                          control={control}
                          render={({field, formState}) => (
                            <>
                              <Label className='text-right'>Grade Level</Label>
                              <div className="col-span-3"> 
                                <Dropdown label='Select Grade Level' items={gradeLevelState} onChange={field.onChange} value={field.value}
                                  getValue={(p) => p.id}
                                  getLabel={(p) => p.level_name}
                                />
                              </div>
                            </>
                          )}
                        />
                        <Controller
                          name='section'
                          control={control}
                          render={({field, formState}) => (
                            <>
                              <Label className='text-right'>Section</Label>
                              <div className="col-span-3"> 
                                <Dropdown label='Select Section' items={sectionsState} onChange={field.onChange} value={field.value}
                                  getValue={(p) => p.id}
                                  getLabel={(p) => p.section_name}
                                />
                              </div>
                            </>
                          )}
                        />
                        <Controller
                          name='school_year'
                          control={control}
                          render={({field, formState}) => (
                            <>
                              <Label className='text-right'>School Year</Label>
                              <div className="col-span-3"> 
                                <Dropdown label='Select School Year' items={schoolYear} onChange={field.onChange} value={field.value}
                                  getValue={(p) => p.school_year}
                                  getLabel={(p) => p.school_year}
                                />
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div className='flex justify-end'>
                      <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 
                          ( <span>Loading..</span> )
                        : 
                          ( <span>Submit</span> )
                        }
                        </Button>
                    </div>
                  </form>
                </div>
              
            </div>
          )}
          </div>
          )}
        </DialogContent>
      </Dialog>
  )
}