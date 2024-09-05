import React from 'react'
import { TBarangay, TCity, TProvince } from './page'
import StudentFormComponent from '@/components/StudentFormComponent'

export default function StudentAddForm({provinces, city, barangay} : {provinces : TProvince[], city : TCity[], barangay : TBarangay[]}) {
  
  return (
    <StudentFormComponent provinces={provinces} city={city} barangay={barangay} />
  )
}
