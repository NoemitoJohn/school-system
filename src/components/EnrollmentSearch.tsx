'use client';
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import {  Search } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table"
import DataTable from '@/components/DataTable';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { searchStudentEnrollment } from '@/server/students';
import { useEffect, useReducer, useState } from 'react';
import useSWR, { Fetcher } from 'swr'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { StudentEnrollmentSchema, TStudentEnrollmentSchema } from '@/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Dropdown from '@/components/Dropdown';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export type TEnromentStudent = {
  id: number
  lrn : string
  full_name : string
  grade_level : string 
  section : string 
  year_enrolled : string 
  is_paid_id? : boolean | null
  enrolled_id? : number | null
}

type TSearch = { 
  search : string
}

export type TGradeLevel = { 
  id : string
  level_name : string
}

export type TSection = {
  id : string 
  section_name : string
  grade_level_id : string
  school_year : string
}


type TStudentEnrollmentAction = {
  action : 'INIT' | 'UPDATE' | 'ADD' | 'DELETE'
  students? : TEnromentStudent[]
  student? : TEnromentStudent
  id? : number
}

function studentReducer(state : TEnromentStudent[], action : TStudentEnrollmentAction) {
  switch(action.action) {
    case 'INIT':
      if(action.students){
        return action.students
      }
    case 'UPDATE': 
      if(action.student){
        return state.map(v => {
          if(v.id == action.student?.id && action.student.year_enrolled == v.year_enrolled){
            return action.student
          }
          return v
        })
      }
    case 'ADD' :
      if(action.student) {
        const filter = state.filter((v) => !(v.id == action.student?.id && v.year_enrolled.length <= 0))
        return [
          action.student,
          ...filter
        ]
      }
    case 'DELETE':
      if(action.id){
        return state.filter(s => !(s.id == action.id))
      }
    default:
      return state;
  }
}

export default function Enrollment({rows, sections, gradeLevel} : {rows : TEnromentStudent[], sections : TSection[], gradeLevel : TGradeLevel[]}) {

  const [state, dispatchStudentEnrollment] = useReducer(studentReducer, rows)
  const [studentId, setStudentId] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const handleEnrollButtonClick = async (id : number) => {
    setStudentId(id)
    setOpen(true)
  }

  const columns : ColumnDef<TEnromentStudent>[] = [
    {
      accessorKey : 'lrn',
      header : 'LRN'
    },
    {
      accessorKey : 'full_name',
      header : 'Full Name'
    },
    {
      accessorKey : 'grade_level',
      header : 'Grade Level'
    },
    {
      accessorKey : 'section',
      header : 'Section'
    },
    {
      accessorKey : 'year_enrolled',
      header : 'Year'
    },
    {
      id : 'actions',
      header : 'Actions',
      cell : ({row}) => {
        const original = row.original
        return(
          // <EnrollButton id={original.id} />
          <Button variant='link' onClick={() => handleEnrollButtonClick(original.id)}>
            Enroll
          </Button>
        )
      }
    }
  ]

  const {
    register,
    handleSubmit,
    reset,
    formState : {errors, isSubmitting}
  } = useForm<TSearch>()

  const handleSearchSubmit : SubmitHandler<TSearch> = async ({search}) => {
    try {
      console.log(140, search)
      const studentSearch = await searchStudentEnrollment(search)
    
      dispatchStudentEnrollment({action : 'INIT', students : studentSearch})
      // reset()
    } catch (error) {
      // toast  
      alert(error)
    }
  } 
  
  const handleEnrollSubmit : SubmitHandler<TStudentEnrollmentSchema> = async (formData) => {
    try {
      const request = await fetch('/api/enrollment', {
        method : 'POST',
        body : JSON.stringify(formData)
      })

      if(!request.ok){
        return toast.error('Something went wrong!')
      }
      
      const response : {student_id : number} = await request.json()
      
      dispatchStudentEnrollment({action : 'DELETE', id : response.student_id})

      toast.success('Save Successfully')
      
      router.refresh()

    } catch (error) {
      
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleSearchSubmit)}>
        <Label className='text-xs' >Search Name</Label>
        <div className='flex gap-2'>
          <Input  {...register("search", {required : false})} placeholder='Student Name'/>
          <Button disabled={isSubmitting} type='submit'>
            <div className='flex gap-1'>
              <Search size={16}/>
              Search
            </div>
          </Button>
        </div>
      </form>
      <div className='mt-4'>
        <DataTable columns={columns} data={state}/>

      </div>
      {open && 
      (<Modal isOpen={open} id={studentId} sections={sections} gradeLevel={gradeLevel} handleOpenChange={setOpen} enrollSubmit={handleEnrollSubmit}/>)}
    </div>
  )
}


// MODAL COMPONENT
const Modal = ({isOpen, id, handleOpenChange, enrollSubmit, sections, gradeLevel } : {isOpen : boolean, id : number, sections : TSection[], gradeLevel : TGradeLevel[], handleOpenChange : (open : boolean) => void
  enrollSubmit : SubmitHandler<TStudentEnrollmentSchema>
}) => {

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
                    {!student?.school_year && (
                      <div className='text-center italic'>No Records</div>
                    ) }
                    {student?.school_year && (
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
                        <Input {...register('full_name')} placeholder='test' className="col-span-3" disabled/>
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
                      <Button type='submit' disabled={isSubmitting}>Submit</Button>
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