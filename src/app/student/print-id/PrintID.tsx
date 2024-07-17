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
import { supabase } from '@/database/supabase';

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
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
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
  // console.log(students)

  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()
  const w = width / 5
  const h = height / 2
  for (let x = 0; x < students.length; x++) {
    
    if(x > 5) break;

    const student = students[x]


    const frontIMG =  IdMapTemplate[student.grade_level].front
    const backIMG = IdMapTemplate[student.grade_level].back
    // front
    doc.addImage(frontIMG, w * x, 0, w, h,) //front template
    
    if(student.img_url) doc.addImage(student.img_url, 35 + (w * x), 50.2, 56, 81.5) // profile pic
    else  


    doc.text(student.lrn, 46 + w * x , 142)
    doc.text(student.full_name.toUpperCase(), 16 + w * x, 162).setFontSize(8)
    // back
    doc.addImage(backIMG, w * x, h, w, h)
    const grade_levels = Object.keys(IdMapTemplate)
    // case statement grade level 
    
    for (let y = 0; y < grade_levels.length ; y++) {
      if(student.grade_level == grade_levels[y]){
        doc.text(student.year_enrolled, 46 + w * x, h + 105 + (11 * y - 1))
        break;
      }
    }
    doc.text(student.parent_number, 46 + w * x, height - 25)
  }
  
  doc.output('dataurlnewwindow')
}


export default function PrintID({rows}: {rows : TStudentID[]}) {
  const [selectionState, setSelectionState] = useState<Record<string, boolean>>({})
  const { trigger, isMutating } = useSWRMutation('/api/student-id', fetcher)
  
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


    generateID(studentInfo)
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

  const studentTable = useDataTable({
    columns : colums,
    data : rows,
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
    <DataTableCustomHook table={studentTable}  />
    <Button onClick={() => handlePreview()} disabled={isMutating}>
      {isMutating ? (
        <span>Generating...</span>
      ) : (
        <span>Generate</span>
      )}
    </Button>
    </>
  )
}
