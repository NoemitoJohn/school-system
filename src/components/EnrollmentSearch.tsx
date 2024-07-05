'use client';
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import {  Search } from 'lucide-react';
import { ColumnDef } from "@tanstack/react-table"
import DataTable from '@/components/DataTable';
import Link from 'next/link';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { insertEnrollment, searchStudentEnrollment } from '@/server/students';
import { ReducerWithoutAction, useEffect, useOptimistic, useReducer, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { StudentEnrollmentSchema, TStudentEnrollmentSchema } from '@/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Dropdown from '@/components/Dropdown';

export type TEnromentStudent = {
  id: number
  full_name : string
  grade_level : string 
  section : string 
  year_enrolled : string 
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
  school_year : string
}


type TStudentEnrollmentAction = {
  action : 'INIT' | 'UPDATE' 
  students? : TEnromentStudent[]
  student? : TEnromentStudent
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
          if(v.id == action.student?.id){
            return action.student
          }
          return v
        })
      }
    default:
      return state;
  }
}

export default function Enrollment( {rows, sections, gradeLevel} : {rows : TEnromentStudent[], sections : TSection[], gradeLevel : TGradeLevel[]}) {

  const [state, dispatchStudentEnrollment] = useReducer(studentReducer, rows)
  const [studentId, setStudentId] = useState<number>(7)
  const [open, setOpen] = useState(false)


  const handleEnrollButtonClick = async (id : number) => {
    setStudentId(id)
    setOpen(true)
  }

  const columns : ColumnDef<TEnromentStudent>[] = [
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
      const studentSearch = await searchStudentEnrollment(search)
    
      dispatchStudentEnrollment({action : 'INIT', students : studentSearch})
      reset()
    } catch (error) {
      // toast  
      alert(error)
    }
  } 
  
  const handleEnrollSubmit : SubmitHandler<TStudentEnrollmentSchema> = async (data) => {
    try {
      const insertedEnrollment = await insertEnrollment(data)
      console.log(data)
      dispatchStudentEnrollment({action : 'UPDATE', student : insertedEnrollment})

    } catch (error) {
      
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleSearchSubmit)}>
        <Label className='text-xs' >Search Name</Label>
        <div className='flex gap-2'>
          <Input  {...register("search", { required: true })} placeholder='Student Name'/>
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

const Modal = ({isOpen, id, handleOpenChange, enrollSubmit, sections, gradeLevel } : {isOpen : boolean, id : number, sections : TSection[], gradeLevel : TGradeLevel[], handleOpenChange : (open : boolean) => void
  enrollSubmit : SubmitHandler<TStudentEnrollmentSchema>
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState : {errors, isSubmitting, isLoading}
  } = useForm<TStudentEnrollmentSchema>({
    resolver : zodResolver(StudentEnrollmentSchema),
    defaultValues : async () => { 
      const req = await fetch(`/api/student/${id}`)
      if(!req.ok){
        setErrorLoad(true)
        return {}
      }
      const defValue = await req.json()
      return defValue
    }
  })
  const [errorLoad, setErrorLoad] = useState(false)
  
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enrolment Form</DialogTitle>
          </DialogHeader>
          {isLoading ? 
          ( <div className='text-center'>...Loading</div>) :  ( 
          <div>
          {errorLoad ? (<div className='text-center text-red-500'>Something went Wrong</div>) : (
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
                          <Dropdown label='Select Grade Level' items={gradeLevel} onChange={field.onChange} value={field.value}
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
                          <Dropdown label='Select Section' items={sections} onChange={field.onChange} value={field.value}
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
                        <Label className='text-right'>Section</Label>
                        <div className="col-span-3"> 
                          <Dropdown label='Select School Year' items={sections} onChange={field.onChange} value={field.value}
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
                <Button type='submit' disabled={isSubmitting}>Enroll</Button>
              </div>
            </form>
          )}
          </div>
          )}
        </DialogContent>
      </Dialog>
  )
}