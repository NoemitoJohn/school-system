'use client'
import DataTable from '@/components/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { TStudentID } from './page'
import Image, { StaticImageData } from 'next/image'
import { jsPDF } from "jspdf";
import { Button } from '@/components/ui/button'

// Default export is a4 paper, portrait, using millimeters for units
type TIdTemple = {
  front : '/ELEM/ELEM-F.png'
  back : '/ELEM/ELEM-B.png'
}

export const IdMapTemplate : Record<string, TIdTemple>  = ({
  "KINDER 2" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 1" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 2" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 3" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 4" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 5" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 6" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 7" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 8" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 9" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 10" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 11" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
  "GRADE 12" : {back : '/ELEM/ELEM-B.png', front : '/ELEM/ELEM-F.png'},
})

const doc = new jsPDF({
  orientation : 'landscape',
  unit: 'px',
}).setFontSize(8);

export default function PrintID({rows}: {rows : TStudentID[]}) {

  const handlePreview = () => {
    const width = doc.internal.pageSize.getWidth()
    const height = doc.internal.pageSize.getHeight()
    const w = width / 5
    const h = height / 2
    
    for (let x = 0; x < rows.length; x++) {
      if(x > 5) break;
      const student = rows[x]
      const frontIMG =  IdMapTemplate[student.grade_level].front
      const backIMG = IdMapTemplate[student.grade_level].back
      // front
      doc.addImage(frontIMG, w * x, 0, w, h,)
      doc.text(student.lrn, 46 + w * x , 142)
      doc.text(student.full_name.toUpperCase(), 16 + w * x, 162).setFontSize(8)
      // back
      doc.addImage(backIMG, w * x, h, w, h)
      const grade_levels = Object.keys(IdMapTemplate)
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



  const colums : ColumnDef<TStudentID>[] = [
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
  return(
    <>
    <DataTable columns={colums} data={rows} />

      <Button onClick={() => handlePreview()}>Preview</Button>
    </>
  )
}
