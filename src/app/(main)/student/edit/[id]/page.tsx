import MarginContainer from '@/components/container/MarginContainer'
import StudentFormComponent from '@/components/StudentFormComponent'
import { db } from '@/database/db'
import { students } from '@/database/schema'
import { eq, sql } from 'drizzle-orm'
import React from 'react'
import provinceJSON from '@/address/province.json'
import cityJSON from '@/address/city.json'
import barangayJSON from '@/address/barangay.json'
import { TBarangay, TCity, TProvince } from '../../add/page'
import { StudentSchemaDefault } from '@/validation/schema'


export default async function EditStudentPage({ params }: { params: { id: string } }) {

  const provinces = JSON.parse(JSON.stringify(provinceJSON)) as Array<TProvince>
  const city = JSON.parse(JSON.stringify(cityJSON)) as Array<TCity>
  const barangay = JSON.parse(JSON.stringify(barangayJSON)) as Array<TBarangay>

  return (
    <MarginContainer>
      <StudentFormComponent studentId={params.id} provinces={provinces} city={city} barangay={barangay}/>
    </MarginContainer>
  )
}
