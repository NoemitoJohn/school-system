import StudentForm from '@/components/StudentForm'
import React from 'react'
import provinceJSON from '@/address/province.json'
import cityJSON from '@/address/city.json'
import barangayJSON from '@/address/barangay.json'
import MarginContainer from '@/components/container/MarginContainer'

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
  const provinces = JSON.parse(JSON.stringify(provinceJSON)) as Array<TProvince>
  const city = JSON.parse(JSON.stringify(cityJSON)) as Array<TCity>
  const barangay = JSON.parse(JSON.stringify(barangayJSON)) as Array<TBarangay>
  //TODO optimize
  return (
    <div>
      <MarginContainer>
        <StudentForm provinces={provinces} city={city} barangay={barangay}/>
      </MarginContainer>
    </div>
  )
}
