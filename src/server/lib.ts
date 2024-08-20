'use server'

import { supabase } from "@/database/supabase"
import { nanoid } from "nanoid"
import path from "path"

export const uploadProfile = async (file : File, folder : 'student' | 'users/teachers' | 'users/parents') => {
  const ext = path.extname(file.name)

  const fileName = nanoid()

  const {data : res , error} = await supabase.storage.from('profile').upload(`${folder}/${fileName + ext}`, file)
  
  if(error){
    console.log(21, error)
    throw error
  };

  return res?.fullPath
}