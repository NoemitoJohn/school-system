'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useDataTable from "@/hooks/useDataTable"
import { Pencil, Search, Trash2, UserPlus } from "lucide-react"
import { TTeacher } from "./page"
import { ColumnDef, getCoreRowModel } from "@tanstack/react-table"
import DataTableCustomHook from "@/components/DataTableCustomHook"
import { TSection } from "@/components/EnrollmentSearch"
import AddTeacherModal from "@/app/faculty/teacher/AddTeacherModal"
import { useReducer, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { getObjectKeys, TTeacherSchema } from "@/validation/schema"
import toast from "react-hot-toast"
import Alert from "@/components/Alert"
import {AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import useSWRMutation from "swr/mutation"


type TReducerAction = {
  type : 'INIT' | 'UPDATE' | 'DELETE' | 'ADD',
  teachers?: TTeacher[]
  teacher?: TTeacher,
  id?: string,
}

function reducer(state : TTeacher[], action : TReducerAction) {
  switch(action.type) {
    case 'INIT':
      if(action.teachers) { return action.teachers }
    case 'ADD': 
      if(action.teacher) {
        return [action.teacher, ...state]
      }
    case 'DELETE':
      if(action.id) {
        return state.filter(t => t.id != action.id)
      }
    default: 
      return state
  }
}

async function getTeacherInfoFetcher(url : string, { arg }: { arg: { id: string }}) {
  const request = await fetch(url + arg.id)
  const response: {status : number , teacher : Partial<TTeacherSchema>} = await request.json()
  return response
}

async function updateTeacherInfoFetcher(url : string, { arg }: { arg: { id: string, body : FormData }}) {
  const request = await fetch(url + arg.id, {
    method : 'PUT',
    body : arg.body
  })

  const response = await request.json()

  return response
}

async function searchTeacherFetcher(url : string, { arg } : {arg : {search : string}}) {
  
  const request = await fetch(url + `?search=${arg.search}`)
  const response : {status : number, data: TTeacher[]} = await request.json()

  return response
}


export default function TeacherComponent({classes, teachers : data} : {classes : TSection[], teachers : TTeacher[]}) {
  
  const { trigger : getTeacherInfo, isMutating : loadingGET } = useSWRMutation('/api/users/', getTeacherInfoFetcher)
  const {trigger : putTeacher} = useSWRMutation('/api/users/', updateTeacherInfoFetcher)
  const {trigger : searchTeacher, isMutating : loadingSearch} = useSWRMutation('/api/users/', searchTeacherFetcher)
  const [teachers, dispatchTeachers] = useReducer(reducer, data)
  const [openAdd, setOpenAdd] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [userDelete, setUserDelete] = useState<{id : string, name : string} | null>()
  const [openEdit, setOpenEdit] = useState(false)
  const [userEdit, setUserEdit] = useState<Partial<TTeacherSchema> | null>()
  

  const handleEditClick = async (id: string) => {
    
    try {
      const data =  await getTeacherInfo({id : id})
      if(data.status != 200) { return toast.error('Something went wrong!') }
      setUserEdit(data.teacher)
      setOpenEdit(true)
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  const handleDeleteTeacher = async (user : {id: string, name: string}) => {

    const request = await fetch('/api/users', {
      method : 'DELETE',
      body: JSON.stringify({id : user.id})
    })
    
    if(!request.ok) { return toast.error('Something went wrong') }

    const response : {status : number, data : string} = await request.json()

    if(response.status != 200) { return toast.error('Something went wrong!')}

    setOpenDelete(false)
    dispatchTeachers({type: 'DELETE', id : response.data})

    setUserDelete(null)
  }
  
  const handleTeacherAddSubmit : SubmitHandler<TTeacherSchema> = async (data) => {
    
    const teacherKeys = getObjectKeys(data)

    const formData = new FormData()
    
    for (const element of teacherKeys) {
      if(element == 'profile' && data[element] && data[element] instanceof FileList) { 
        formData.append(element, data[element][0])
      }
      if(element != 'profile' && data[element]) {
        formData.append(element, data[element])
      }
    }

    const request = await fetch('/api/users', {
      method: 'POST',
      body: formData,
    })
    
    if(!request.ok) return toast.error('Something went Wrong!'); // hadle error

    const response : {status: number, data : TTeacher} = await request.json()
    
    if(response.status != 200) { return toast.error('Something went wrong!') }

    dispatchTeachers({type : 'ADD', teacher : response.data})
    setOpenAdd(false)

  } 
  
  const handleTeacherEditSubmit : SubmitHandler<TTeacherSchema> = async (fordata) => { 
    
    const teacherKeys = getObjectKeys(fordata)
    const formData = new FormData()
    
    for (const element of teacherKeys) {
      if(element == 'profile' && fordata[element] && fordata[element] instanceof FileList) { 
        formData.append(element, fordata[element][0])
      }
      if(element != 'profile' && fordata[element]) {
        formData.append(element, fordata[element])
      }
    }

    try {
      
      const data = await putTeacher({id : fordata.id!, body: formData})

      if(data.status === 200){
        toast.success('Updated Successfully')
      }
      
    } catch (error) {
      return toast.error('Something went wrong!')
    }
  }

  const handleSearchSubmit : SubmitHandler<{search : string}> = async ({search}) => {
    try {
      const result =  await searchTeacher({search})
      
      if(result.status != 200) { return toast.error('Something went wrong!') }
  
      dispatchTeachers({type: 'INIT', teachers: result.data})
      
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }


  const colums : ColumnDef<TTeacher>[] = [
    {
      accessorKey: 'full_name',
      header: 'Full Name'
    },
    {
      accessorKey : 'email',
      header: 'Email',
    },
    {
      accessorKey : 'status',
      header: 'Status',
    },
    {
      accessorKey : 'approval',
      header: 'Approval',
    },
    {
      id : 'actions',
      header : (p) => (
        <div className="flex justify-center">Action</div>
      ),

      cell : ({row}) => {
        const original = row.original
        return(
          <div className="flex justify-center gap-1">
            <Button variant='ghost' size='sm' className="px-2 py-0 bg-transparent rounded-lg" disabled={loadingGET}
              onClick={() => handleEditClick(original.id)}>
              <Pencil size={20} color="hsl(var(--primary))" />
            </Button>
            <Button variant='ghost' size='sm' className="px-2 py-0 bg-transparent rounded-lg " 
              onClick={() => {
                setOpenDelete(true);
                setUserDelete({id : original.id, name : original.full_name})
              }}
              >
              <Trash2 size={20} color="hsl(var(--primary))" />
            </Button>
          </div>
        )
      }
    }
  ]

  const teacherTable = useDataTable({
    columns: colums,
    data : teachers,
    getCoreRowModel : getCoreRowModel(),
    enableRowSelection: false
  })

  const {register, handleSubmit} = useForm<{search : string}>()

  return (
    <div>
      <div className="flex justify-end">
        <Button size='sm' className="flex gap-2" type='submit' onClick={() => setOpenAdd(true)}>
          <UserPlus size={16}/>
          Add Teacher
        </Button>        
      </div>
      <form onSubmit={handleSubmit(handleSearchSubmit)}>
        <div className="flex gap-4 items-center mt-3">
          <Input {...register('search')} placeholder="Search" className="h-9 px-3"/>
          <Button size='sm' className="flex gap-2" type='submit' disabled={loadingSearch}>
            <Search size={16}/>
            Search
          </Button>
        </div>
      </form>
      <div>
      </div>
      <div className="mt-4">
        <DataTableCustomHook table={teacherTable} className="h-[37rem]"/>
      </div>
      {openAdd && // add teacher
        <AddTeacherModal classes={classes} open={openAdd} handleTeacherSubmit={handleTeacherAddSubmit} onOpenChange={setOpenAdd}/>
      }

      {openEdit && // edit teacher
        <AddTeacherModal classes={classes} open={openEdit} values={userEdit} handleTeacherSubmit={handleTeacherEditSubmit} onOpenChange={setOpenEdit}/>
      }
      
      {openDelete && // confirm delete
        <Alert open={openDelete} onOpenChange={(v) => setOpenDelete(v)} >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              <span>This action cannot be undone. This will permanently delete user </span>
              <span className="underline text-primary">
                {userDelete?.name}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="button" onClick={() => userDelete && handleDeleteTeacher(userDelete)}>Continue</Button>
          </AlertDialogFooter>
        </Alert>
      }
    </div>
  )
}
