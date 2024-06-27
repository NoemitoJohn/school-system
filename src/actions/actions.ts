'use server'

import { db } from "@/database/db"
import { students } from "@/database/schema"
import { TStudent } from "@/validation/schema"

export const addStudent =  async (data : TStudent) => {
  
  try {
    await db.insert(students).values({
      first_name : data.first_name,
      middle_name : data.middle_name,
      last_name : data.last_name,
      ext_name : data.ext_name,
      gender : data.gender,
      birth_date : data.birthdate,
      religion : data.religion,
      father_name : `${data.parent.father.last_name}, ${data.parent.father.first_name} ${data.parent.father.middle_name} .${data.parent.father.ext_name}`,
      mother_name : `${data.parent.mother.last_name}, ${data.parent.mother.first_name} ${data.parent.mother.middle_name}`,
      guardian_name : `${data.parent.guardian.last_name}, ${data.parent.guardian.first_name} ${data.parent.guardian.middle_name}`,
      province : data.address.province,
      city_municipality : data.address.city,
      barangay : data.address.barangay,
      street_address : data.address.house_num,
      active: true,
      parent_mobile_number : data.contact_num,
    })
  } catch (error) {
    return {
      error : 'Something Went Wrong'
    }
  }
}