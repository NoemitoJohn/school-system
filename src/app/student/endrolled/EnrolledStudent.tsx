'use client'
import DataTable from "@/components/DataTable"
import { TEnromentStudent } from "@/components/EnrollmentSearch"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useReducer, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"


type TReducerActions  = {
  action : 'INIT' | 'UPDATE'
  students? : TEnromentStudent[]
  enrolled_student_id? : number
}

const reducer = (state : TEnromentStudent[], action : TReducerActions) => {
  switch (action.action) {
    case 'INIT' : 
      if(action.students) return action.students
    case 'UPDATE' : 
      if(action.enrolled_student_id) 
        return state.filter(s => s.enrolled_id != action.enrolled_student_id)
    default : 
      return state
  }
  

}

export default function EnrolledStudent({rows} : {rows : TEnromentStudent[]}) {
  // const [enrolledStudents, setEnrolledStudents] = useState<TEnromentStudent[]>()
  const [enrolledStudents, dispatchEnrolledStudents] = useReducer(reducer, rows)
  const [student, setStudent] = useState<TEnromentStudent>()
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()
  const colums : ColumnDef<TEnromentStudent>[] = [
    {
      accessorKey : 'lrn',
      header : 'LRN',
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
      header : 'School Year',
    },
    {
      id : 'actions',
      header : 'ID',
      cell : ({row}) => {
        const original = row.original
        const disabled = original.is_paid_id ? true : false
        return(
          <Button variant='link' disabled={disabled} size='sm'  onClick={() => handleOnPayIdClicked(original)}>
            {disabled ? (<span className="text-xs">PAID</span>) : (<span>PAY ID</span>)}
          </Button>
        )
      }
    }
  ]

  const handleOnPayIdClicked = async ( std :TEnromentStudent) => {
    setStudent(std)
    setIsOpen(true)
  }

  const handleSubmit : SubmitHandler<{enrolled_id : number}> = async (data) => {
    const request = await fetch('/api/payment-id', {
      method : 'POST',
      body : JSON.stringify(data)
    })
    
    if(!request.ok){ 
      return toast.error('Something Went Wrong!')
    }
    
    const respose : {student_enrolled_id : number}  = await request.json()
    dispatchEnrolledStudents({action : 'UPDATE', enrolled_student_id : respose.student_enrolled_id })
    toast.success('Save Successfully')
    router.refresh()
  }

  const renderModal = () => {
    if(isOpen && student) {
      return (
        <PaymentIDModal open={isOpen} student={student} handleOpenChange={setIsOpen} handleOnPaymentSubmit={handleSubmit} />
      )
    }
  }

  return (
    <div>
      <DataTable columns={colums} data={enrolledStudents} />
      {renderModal()}
    </div>
  )
}

const PaymentIDModal = ({open, student, handleOpenChange, handleOnPaymentSubmit} : {open : boolean, student : TEnromentStudent,handleOpenChange : (open : boolean) => void, handleOnPaymentSubmit : SubmitHandler<{enrolled_id : number}> } ) => {

  const {
    register,
    handleSubmit,
    formState : {errors}
  } = useForm<{enrolled_id : number }>({
    defaultValues : {
      enrolled_id : student.enrolled_id!
    }
  })
  // console.log(errors)
  return(
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ID Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleOnPaymentSubmit)}>
        <div className="grid gap-4 py-1">
          <div className="grid grid-cols-6 items-center gap-2">
            <div className="col-span-2">
              <Label className="text-right text-xs">LRN</Label>
              <Input disabled value={student.lrn} className="col-span-3"/>
            </div>
            <div className="col-span-4">
              <Label className="text-right text-xs">Student Name</Label>
              <Input disabled value={student.full_name} className="col-span-3"/>
            </div>
            <div className="col-span-2">
              <Label  className="text-right text-xs">Grade Level</Label>
              <Input disabled value={student.grade_level}/>
            </div>
            <div className="col-span-2">
              <Label className="text-right text-xs">Section</Label>
              <Input disabled value={student.section} />
            </div>
            <div className="col-span-2">
              <Label  className="text-right text-xs">School Year</Label>
              <Input disabled value={student.year_enrolled} />
            </div>
          </div>
          <Input {...register('enrolled_id', {required : true})} type='hidden' disabled/>
          <div className=" flex justify-end">
            <Button size='sm' type='submit' className="text-xs" >Mark As Paid</Button>
          </div>
        </div>
        </form>
        
      </DialogContent>
    </Dialog>

  )
}
