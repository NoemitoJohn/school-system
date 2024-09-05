'use server'
import { db } from "@/database/db"
import { classes, grade_levels, sections, students } from "@/database/schema"
import { supabase } from "@/database/supabase"
import { ClassSchema, StudentSchema, TClassSchema, TStudent } from "@/validation/schema"
import { eq, param } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { nanoid } from 'nanoid'
import QRCode from 'qrcode';
import { error } from "console"

const upload = async (file : File) : Promise<string> =>{
  const fileName = nanoid()
  
  if(typeof file == 'object') {

    const {data : res , error} = await supabase.storage.from('profile').upload(`student/${fileName}.png`, file)

    if(error) throw error;

    return res?.path
  }

  return ''
}

export const addStudent =  async (data : TStudent) => {
  
  const formData = data.profile_pic as FormData
  
  const {success, data : parse} = StudentSchema.safeParse(data)
  
  if(!success) return console.log('Invalid Form');
  
  const file = formData.get('fileImage') as File

  try {
    const fileName =  await upload(file)
    
    const qr = await QRCode.toDataURL(data.lrn)
    
    await db.insert(students).values({
      lrn : data.lrn,
      first_name : data.first_name,
      middle_name : data.middle_name,
      last_name : data.last_name,
      ext_name : data.ext_name,
      gender : data.gender,
      birth_date : data.birthdate,
      religion : data.religion,
      father_name : data.parent.father?.toUpperCase(),
      mother_name : data.parent.mother?.toUpperCase(),
      guardian_name : data.parent.guardian?.toUpperCase(),
      province : data.address.province,
      city_municipality : data.address.city,
      barangay : data.address.barangay,
      street_address : data.address.house_num,
      active: 1,
      parent_mobile_number : data.contact_num,
      img_url : fileName,
      qrcode : qr
    })
  } catch (error) {
    return {
      error : 'Something Went Wrong'
    }
  }
  revalidatePath('/student/enrollment')
}

export const updateStudent = async (data : TStudent) => {
  const {success, data : parse} = StudentSchema.safeParse(data)
  
  if(!success) return {error : 'Invalid Inputs'};
  
  try {
    const formData = data.profile_pic as FormData
    const file = formData.get('fileImage') as File

    const fileName =  await upload(file)

    const updateInfo = await db.update(students).set({
      lrn : data.lrn,
      first_name : data.first_name,
      middle_name : data.middle_name, 
      last_name : data.last_name,
      ext_name : data.ext_name,
      gender : data.gender,
      birth_date : data.birthdate,
      religion : data.religion,
      father_name : data.parent.father?.toUpperCase(),
      mother_name : data.parent.mother?.toUpperCase(),
      guardian_name : data.parent.guardian?.toUpperCase(),
      province : data.address.province,
      city_municipality : data.address.city,
      barangay : data.address.barangay,
      street_address : data.address.house_num,
      img_url : fileName,
      parent_mobile_number : data.contact_num,
    }).where(eq(students.id, parse.id!)).returning({id : students.id})
  
    if(updateInfo[0].id) {
      return { error : null}
    }

    revalidatePath('/student')
  } catch (error) {
    return {
      error : 'Something Went Wrong'
    }
  }
}

export const addClass  = async (data : TClassSchema) => {
  try {
    // return console.log(data)
    const parse =  ClassSchema.safeParse(data)

    if(!parse.success) throw Error(parse.error.message);
    // console.log(parse.data)
    const { data : value } = parse
    await db.transaction( async (tx) => {
      
      try {
        const [insertedSection] = await tx.insert(sections).values({
          grade_level_id : value.grade_level_name,
          section_name : value.section_name,
          school_year: value.school_year,
        }).returning()

        const [insertedClass] = await tx.insert(classes).values({
          imported : false,
          school_year : value.school_year,
          section_id : insertedSection.id,
        })
        

      } catch (error) {
        console.log(error)
        await tx.rollback()
      }
    })
  } catch (error) {
    // throw new Error(error)
  }
  revalidatePath('/class/add')
}