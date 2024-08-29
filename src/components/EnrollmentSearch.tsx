'use client';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { FileSpreadsheet, Search } from 'lucide-react';
import { ColumnDef, getCoreRowModel } from "@tanstack/react-table";
import { SubmitHandler, useForm } from 'react-hook-form';
import { searchStudentEnrollment } from '@/server/students';
import { useEffect, useReducer, useState } from 'react';
import { TStudentEnrollmentSchema } from '@/validation/schema';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useDataTable from '@/hooks/useDataTable';
import DataTableCustomHook from './DataTableCustomHook';

import ModalStudentInfo from '@/app/(main)/student/enrollment/ModalStudentInfo';
import ModalUploadXlxs from '@/app/(main)/student/enrollment/ModalUploadXlxs';

export type TEnromentStudent = {
  id: string
  lrn : string
  full_name : string
  grade_level : string 
  section : string 
  year_enrolled : string 
  is_paid_id? : boolean | null
  enrolled_id? : string | null
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
  id? : string
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
  const [studentId, setStudentId] = useState<string>('')
  const [openStudentInfo, setOpenStudentInfo] = useState(false)
  const [openUploadXlsx, setOpenUploadXlsx] = useState(false)

  const router = useRouter()
  
  useEffect(() => {
    dispatchStudentEnrollment({action : 'INIT', students : rows})
  }, [rows])

  const handleEnrollButtonClick = async (id : string) => {
    setStudentId(id)
    setOpenStudentInfo(true)
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
          <Button variant='link' size='sm' className='h-0' onClick={() => handleEnrollButtonClick(original.id)}>
            Enroll
          </Button>
        )
      }
    }
  ]

  const studentTable = useDataTable({
    data : state,
    columns : columns,
    getCoreRowModel : getCoreRowModel()
  })

  const {
    register,
    handleSubmit,
    formState : {errors, isSubmitting}
  } = useForm<TSearch>()

  const handleSearchSubmit : SubmitHandler<TSearch> = async ({search}) => {
    try {
      const studentSearch = await searchStudentEnrollment(search)
      console.log(140, studentSearch)
    
      dispatchStudentEnrollment({action : 'INIT', students : studentSearch})
      // reset()
    } catch (error) {
      // toast  
      // alert(error)
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
      
      const response : {student_id : string} = await request.json()
      
      dispatchStudentEnrollment({action : 'DELETE', id : response.student_id})

      toast.success('Save Successfully')
      // router.refresh()
      setOpenStudentInfo(false)

    } catch (error) {
      
    }
  }

  return (
    <div>
      <div className='flex justify-end'>
        <Button size='sm' className='flex gap-1 items-center' onClick={() => setOpenUploadXlsx(true)}>
          <FileSpreadsheet size={20} />
          Upload Student Excel
        </Button>
      </div>
      <form onSubmit={handleSubmit(handleSearchSubmit)}>
        <div className='flex gap-2 items-center mt-2'>
          <Input  {...register("search", {required : false})} placeholder='Search Student Name'/>
          <Button disabled={isSubmitting} type='submit' size='sm'>
            <div className='flex gap-1'>
              <Search size={16}/>
              Search
            </div>
          </Button>
        </div>
      </form>
      <div className='mt-4'>
        <DataTableCustomHook table={studentTable} className='h-[37rem]' />
      </div>
      {openStudentInfo && 
        <ModalStudentInfo isOpen={openStudentInfo} id={studentId} sections={sections} 
          gradeLevel={gradeLevel} 
          handleOpenChange={setOpenStudentInfo} 
          enrollSubmit={handleEnrollSubmit} 
        />
      }
      {openUploadXlsx && 
        <ModalUploadXlxs open={openUploadXlsx} onOpenChange={setOpenUploadXlsx} onHandleSuccess={() => {setOpenUploadXlsx(false)}}/>
      }
    </div>
  )
}