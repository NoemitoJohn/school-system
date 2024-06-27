import StudentForm from '@/components/StudentForm'
import React from 'react'
import provinceJSON from '@/address/province.json'
import cityJSON from '@/address/city.json'
import barangayJSON from '@/address/barangay.json'

export type TProvince = { 
    province_code: string
    province_name: string
    psgc_code: string
    region_code: string
}

export type TCity = {
  city_code: string
  city_name: string,
  province_code: string,
  psgc_code: string,
  region_desc: string
}

export type TBarangay = {
  brgy_code: string
  brgy_name: string
  city_code: string
  province_code: string
  region_code: string
}


export default async function StudentAdd() {
  const provinces = JSON.parse(JSON.stringify(provinceJSON))
  const city = JSON.parse(JSON.stringify(cityJSON))
  const barangay = JSON.parse(JSON.stringify(barangayJSON))
  //TODO optimize
  
  return (
    <div>
        <StudentForm provinces={provinces} city={city} barangay={barangay}/>
    </div>
  )
}
