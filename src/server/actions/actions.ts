'use server'
import { db } from "@/database/db"
import { grade_levels, sections, students } from "@/database/schema"
import { supabase } from "@/database/supabase"
import { StudentSchema, TClassSchema, TStudent } from "@/validation/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { nanoid } from 'nanoid'
import QRCode from 'qrcode';

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
      father_name : `${data.parent.father.last_name}, ${data.parent.father.first_name} ${data.parent.father.middle_name} .${data.parent.father.ext_name}`,
      mother_name : `${data.parent.mother.last_name}, ${data.parent.mother.first_name} ${data.parent.mother.middle_name}`,
      guardian_name : `${data.parent.guardian.last_name}, ${data.parent.guardian.first_name} ${data.parent.guardian.middle_name}`,
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


export const addClass  = async (data : TClassSchema) => {
  try {
    await db.transaction( async (tx) => {
      let gradeLevelId = 0;
      try {
        const [getGradeLevel] = await tx.select({
          id : grade_levels.grade_level_id
        }).from(grade_levels).where(eq(grade_levels.level_name, data.grade_level_name))
        
        gradeLevelId =  getGradeLevel?.id
        
        if(!getGradeLevel) {
          // insert grade level 
          const [insertGradeLevel] = await tx.insert(grade_levels).values({
            level_name : data.grade_level_name
          }).returning()

          gradeLevelId = insertGradeLevel.grade_level_id
        }
        console.log(gradeLevelId)

        const section = await tx.insert(sections).values({
          grade_level_id : gradeLevelId,
          school_year : data.school_year,
          section_name : data.section_name,
          // created_by : data.created_by,
        })
      } catch (error) {
        console.log(error)
        await tx.rollback()
      }
    })
  } catch (error) {
    
  }
  revalidatePath('/class/add')
}