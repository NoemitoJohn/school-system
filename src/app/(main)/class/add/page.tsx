
import React from 'react'
import AddClassForm from './AddClassForm'
import { ColumnDef } from '@tanstack/react-table'
import { db } from '@/database/db'
import { grade_levels, sections } from '@/database/schema'
import { asc, eq, sql } from 'drizzle-orm'
import DataTable from '@/components/DataTable'
import MarginContainer from '@/components/container/MarginContainer'
import { PgUUID } from 'drizzle-orm/pg-core'

export const revalidate = 0

export type TClassName = 
    'GRADE 1' |
    'GRADE 2' |
    'GRADE 3' |
    'GRADE 4' |
    'GRADE 5' |
    'GRADE 6' |
    'GRADE 7' |
    'GRADE 8' |
    'GRADE 9' |
    'GRADE 10'|
    'GRADE 11'|
    'GRADE 12' 

const classes : TClassName[] = [
  'GRADE 1',
  'GRADE 2',
  'GRADE 3',
  'GRADE 4',
  'GRADE 5',
  'GRADE 6',
  'GRADE 7',
  'GRADE 8',
  'GRADE 9',
  'GRADE 10',
  'GRADE 11',
  'GRADE 12',
]
export type TClasses = {
  id : string
  section_name : string
  grade_level_name : string,
  school_year : string,
  created_by : string
}


export default async function AddClass() {


  const columns : ColumnDef<TClasses>[] = [
    {
      accessorKey : 'grade_level_name',
      header : 'Grade Level'
    },
    {
      accessorKey : 'section_name',
      header : 'Section Name'
    },
    {
      accessorKey : 'school_year',
      header : 'School Year'
    },
  ]
  
  const getGradeLevels = await db.select({id : grade_levels.id, level_name : sql<string>`${grade_levels.level_name}`}).from(grade_levels).orderBy(asc(grade_levels.order_number))
  
  // console.log(getGradeLevels)
  
  const getClasses = await db.select({
    id : sql<string>`${grade_levels.id}`,
    section_name : sql<string>`${sections.section_name}`,
    grade_level_name : sql<string>`${grade_levels.level_name}`,
    school_year : sql<string>`${sections.school_year}`,
    created_by : sql<string>`${sections.created_by}`
  }).from(grade_levels).innerJoin(sections, sql`${grade_levels.id} = cast(${sections.grade_level_id} as TEXT)`).orderBy(asc(grade_levels.level_name))

  return (
   <>
    <MarginContainer>
      <AddClassForm classes={getGradeLevels} />
      <div className='mt-5'>
        <DataTable columns={columns} data={getClasses} />
      </div>
    </MarginContainer>
   </>
  )
}
