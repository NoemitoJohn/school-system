'use client'
import { ColumnDef, getCoreRowModel, OnChangeFn, RowSelectionState, Updater } from '@tanstack/react-table'
import { TStudentID } from './page'
import { jsPDF } from "jspdf";
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import DataTableCustomHook from '@/components/DataTableCustomHook'
import useDataTable from '@/hooks/useDataTable'
import useSWRMutation from 'swr/mutation'
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { RotateCcw, Search } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';



type TIdTemple = {
  front : '/ELEM/ELEM-F.png' | '/JHS/JHS-F.png' | '/SHS/SHS-F.png'
  back : '/ELEM/ELEM-B.png' | '/JHS/JHS-B.png' | '/SHS/SHS-B.png'
}

export const IdMapTemplate : Record<string, TIdTemple>  = ({
  "KINDER 2" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 1" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 2" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 3" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 4" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 5" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 6" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  
  "GRADE 7" : {back : '/JHS/JHS-B.png', front : '/JHS/JHS-F.png'},
  "GRADE 8" : {back : '/JHS/JHS-B.png', front : '/JHS/JHS-F.png'},
  "GRADE 9" : {back : '/JHS/JHS-B.png', front : '/JHS/JHS-F.png'},
  "GRADE 10" : {back : '/JHS/JHS-B.png', front : '/JHS/JHS-F.png'},

  "GRADE 11" : {back : '/SHS/SHS-B.png', front : '/SHS/SHS-F.png'},
  "GRADE 12" : {back : '/SHS/SHS-B.png', front : '/SHS/SHS-F.png'},
})

const colums : ColumnDef<TStudentID>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Button className='h-0 px-0' variant='ghost'
        onClick={() => table.setRowSelection({})}
      >
        <RotateCcw size={17} strokeWidth={2.5} />
      </Button>
    ),
    cell : ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      
      />

    )
    
  },
  {
    accessorKey : 'lrn',
    header: 'LRN'
  },
  {
    accessorKey : 'full_name',
    header: 'Full Name'
  },
  {
    accessorKey : 'grade_level',
    header: 'Grade Level'
  },
  {
    accessorKey : 'section',
    header: 'Section'
  },
  {
    accessorKey : 'year_enrolled',
    header: 'School Year'
  },
]

const fetcher = async (url : string, {arg} : {arg : string}) =>{
  return fetch(`${url}?${arg}`)
}

const generateID = (students : TStudentID[]) => {
  const doc = new jsPDF({
    orientation : 'landscape',
    unit: 'px',
  }).setFontSize(8);

  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()
  const w = width / 5
  const h = height / 2
  const grade_levels = Object.keys(IdMapTemplate)

  const elem_levels = grade_levels.slice(0, 7)
  const jhs_levels = grade_levels.slice(7, 7+4)
  const shs_levels = grade_levels.slice(-2)

  for (let x = 0; x < students.length; x++) {
    
    if(x > 5) break;
    
    const student = students[x] // student data

    const frontIMG =  IdMapTemplate[student.grade_level].front // front template
    const backIMG = IdMapTemplate[student.grade_level].back // back template
    
    
    doc.addImage(frontIMG, w * x, 0, w, h,) //front img
    
    if(student.img_url) doc.addImage(student.img_url, 35 + (w * x), 50.2, 56, 81.5) // profile pic
    
    doc.text(student.lrn, 46 + w * x , 142) // lrn
    
    doc.text(student.full_name.toUpperCase(), 16 + w * x, 162).setFontSize(8) // full name
    
    doc.addImage(backIMG, w * x, h, w, h) // back img

    if(student.qr) doc.addImage(student.qr, 41.5 + (w * x), h + 19, 44.5, 49); // qrcode
    
    switch(student.grade_level) {
      case "KINDER 2":
      case 'GRADE 1':
      case 'GRADE 2':
      case 'GRADE 3':
      case 'GRADE 4':
      case 'GRADE 5':
      case 'GRADE 6':
        for (let y = 0; y < elem_levels.length ; y++) { // grade ELEM
          if(student.grade_level == elem_levels[y]){
            doc.text(student.year_enrolled, 46 + w * x, h + 105 + (11 * y - 2))
            break;
          }
        }
        break;
      case 'GRADE 7':
      case 'GRADE 8':
      case 'GRADE 9':
      case 'GRADE 10':
        for (let y = 0; y < jhs_levels.length ; y++) { // grade JHS
          if(student.grade_level == jhs_levels[y]){
            doc.text(student.year_enrolled, 49 + w * x, h + 110 + (16 * y))
            break;
          }
        }
        break;
      case 'GRADE 11':
      case 'GRADE 12':
        for (let y = 0; y < shs_levels.length ; y++) { // grade SHS
          if(student.grade_level == shs_levels[y]){
            doc.text(student.year_enrolled, 48 + w * x, h + 110 + (16 * y))
            break;
          }
        }
        break;
    }
    if(student.parent_number)
      doc.text(student.parent_number, 46 + w * x, height - 25) // parent number
  }
  const blob = doc.output('blob')
  
  return URL.createObjectURL(blob)
}


export default function PrintID({rows}: {rows : TStudentID[]}) {
  const [students, setStudents] = useState(rows)
  const [selectionState, setSelectionState] = useState<Record<string, boolean>>({})
  const { trigger, isMutating } = useSWRMutation('/api/student-id/print', fetcher)

  const {
    register,
    handleSubmit,
    formState : {isSubmitting}
  } = useForm<{search : string}>()
  
  const handlePreview = async () => {
    const keys = Object.keys(selectionState)
  
    const params = new URLSearchParams(
      keys.map(v => ['id' , v])
    ).toString()

    const response = await trigger(params)
    if(!response.ok) {
      // error handle
      return
    }
    
    const studentInfo : TStudentID[] = await response.json()
    
    const url  = generateID(studentInfo)
    
    if(url) window.open(url);
  
  }

  function handleSelectionStateChange (updater : Updater<RowSelectionState>)  {
    if(typeof updater == 'function'){
      const updated = updater(selectionState)
      const keys = Object.keys(updated)

      if(keys.length > 5)  return toast.error('MAXIMUM OF 5 STUDENTS ONLY');

      return setSelectionState(updated)
    }
    return setSelectionState(updater)
  } 
  
  const handleSearchSumbit : SubmitHandler<{search : string}> = async (data) => {
    const searchParams = new URLSearchParams(data).toString()
    
    const request = await fetch(`/api/student-id?${searchParams}`)
    
    if(!request.ok) return toast.error('Something went wrong');

    const response : TStudentID[] = await request.json()

    setStudents(response)

  }


  const studentTable = useDataTable({
    columns : colums,
    data : students,
    getCoreRowModel : getCoreRowModel(),
    onRowSelectionChange : handleSelectionStateChange,
    getRowId : orignal => {
      return String(orignal.enrolled_id)
    },
    state : {
      rowSelection : selectionState
    }
  })

  return(
    <>
    <div>
      <form onSubmit={handleSubmit(handleSearchSumbit)}>
        <div className='flex gap-3'>
          <Input {...register('search')} placeholder='Search Student'/>
          <Button className='flex gap-1' disabled={isSubmitting}><Search size={16}/>Search</Button>
        </div>

      </form>
      <div className='mt-4 flex flex-col h-full gap-3'>
        <div >
          <DataTableCustomHook table={studentTable} className='h-[37rem]'/>
        </div>
        <div className='flex justify-end'>
          <Button onClick={() => handlePreview()} disabled={isMutating}>
            {isMutating ? (
              <span>Generating...</span>
            ) : (
              <span>Generate</span>
            )}
          </Button>

        </div>
      </div>
      
    </div>
    </>
  )
}
