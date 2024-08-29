'use client'
import DataTable from "@/components/DataTable"
import DataTableCustomHook from "@/components/DataTableCustomHook"
import { TEnromentStudent } from "@/components/EnrollmentSearch"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useDataTable from "@/hooks/useDataTable"
import { ColumnDef, getCoreRowModel } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useReducer, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useSWRMutation from "swr/mutation"


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

const updateId  = async (url : string, { arg }: { arg: string }) =>  {
  return fetch('/api/student-id', {
    method : 'POST',
    body : arg
  })
}


export default function EnrolledStudent({rows} : {rows : TEnromentStudent[]}) {
  const [enrolledStudents, dispatchEnrolledStudents] = useReducer(reducer, rows)
  const { trigger, isMutating } = useSWRMutation('/api/student-id', updateId)
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
          <Button variant='link' disabled={disabled} size='sm' className="h-0" onClick={() => handleOnPayIdClicked(original)}>
            {disabled ? (<span className="text-xs">PAID</span>) : (<span>PAY ID</span>)}
          </Button>
        )
      }
    }
  ]
  
  const studentTable = useDataTable({
    data : enrolledStudents,
    columns : colums,
    getCoreRowModel : getCoreRowModel(),
    enableMultiRowSelection: false,
  })

  const {
    register,  
    handleSubmit,
    formState : {isSubmitting}
  } = useForm<{search : string}>()

  const handleOnPayIdClicked = async ( std :TEnromentStudent) => {
    setStudent(std)
    setIsOpen(true)
  }

  const handlePaymentSubmit : SubmitHandler<{enrolled_id : string}> = async (data) => {
    const request =  await trigger(JSON.stringify(data))
    
    if(!request.ok){ 
      return toast.error('Something Went Wrong!')
    }

    const respose : {student_enrolled_id : number}  = await request.json()
    
    dispatchEnrolledStudents({action : 'UPDATE', enrolled_student_id : respose.student_enrolled_id })
    
    toast.success('Save Successfully')
    router.refresh()
    setIsOpen(false)
  }

  const handleSearchSubmit : SubmitHandler<{search : string}> = async (data) => {
    const param = new URLSearchParams(data).toString()
    const request = await fetch(`/api/enrolled?${param}`)  

    if(!request.ok)   return toast.error('Something went wrong')
    const response : TEnromentStudent[] = await request.json()

    dispatchEnrolledStudents({action : 'INIT', students : response})
    

  }
  
  const renderModal = () => {
    if(isOpen && student) {
      return (
        <PaymentIDModal open={isOpen} student={student} handleOpenChange={setIsOpen} handleOnPaymentSubmit={handlePaymentSubmit} isLoading={isMutating} />
      )
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit(handleSearchSubmit)}>
          <div className="flex gap-4 items-center">
            <Input {...register('search')} placeholder="Search Student"/>
            <Button size='sm' className="flex gap-2" type='submit' disabled={isSubmitting}>
              <Search size={16}/>
              Search
            </Button>
          </div>
        </form>
        <DataTableCustomHook table={studentTable} className="h-[37rem]" />
      </div>

      {renderModal()}
    </div>
  )
}

const PaymentIDModal = ({open, student, handleOpenChange, handleOnPaymentSubmit, isLoading} : {open : boolean, student : TEnromentStudent,handleOpenChange : (open : boolean) => void, handleOnPaymentSubmit : SubmitHandler<{enrolled_id : string}> , isLoading : boolean} ) => {

  const {
    register,
    handleSubmit,
    formState : {errors}
  } = useForm<{enrolled_id : string }>({
    defaultValues : {
      enrolled_id : student.enrolled_id!
    }
  })
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
              <Input readOnly value={student.lrn} className="col-span-3"/>
            </div>
            <div className="col-span-4">
              <Label className="text-right text-xs">Student Name</Label>
              <Input readOnly value={student.full_name} className="col-span-3"/>
            </div>
            <div className="col-span-2">
              <Label  className="text-right text-xs">Grade Level</Label>
              <Input readOnly value={student.grade_level}/>
            </div>
            <div className="col-span-2">
              <Label className="text-right text-xs">Section</Label>
              <Input readOnly value={student.section} />
            </div>
            <div className="col-span-2">
              <Label  className="text-right text-xs">School Year</Label>
              <Input readOnly value={student.year_enrolled} />
            </div>
          </div>
          <Input {...register('enrolled_id', {required : true})} type='hidden' disabled/>
          <div className=" flex justify-end">
            <Button size='sm' type='submit' className="text-xs" disabled={isLoading}>
              {isLoading ? (
                <span>Loading...</span>  
              ) : (
                <span>Mark As Paid</span>  
              )}
            </Button>
          </div>
        </div>
        </form>
        
      </DialogContent>
    </Dialog>

  )
}
