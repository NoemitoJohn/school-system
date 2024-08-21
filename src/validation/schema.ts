// import { classes } from "@/app/class/add/page";
import { string, z } from "zod";

const AddressSchema = z.object({
  province : z.string().trim(),
  city : z.string().trim(),
  barangay : z.string().trim(),
  house_num : z.string().trim().optional(),
})

const ParentSchema = z.object({
  father : z.object({
    first_name : z.string().trim().optional(),
    last_name : z.string().trim().optional(),
    middle_name : z.string().trim().optional(),
    ext_name : z.string().trim().optional(),
  }),
  mother : z.object({
    first_name : z.string().trim().optional(),
    last_name : z.string().trim().optional(),
    middle_name : z.string().trim().optional(),
  }),
  guardian : z.object({
    first_name : z.string().trim().optional(),
    last_name : z.string().trim().optional(),
    middle_name : z.string().trim().optional(),
  })
})

export const StudentSchema = z.object({
  lrn : z.string().trim().min(1),
  first_name : z.string().trim().min(1),
  last_name : z.string().trim().min(1),
  middle_name : z.string().trim().min(1),
  ext_name : z.string().trim(),
  gender: z.enum(['MALE', 'FEMALE']),
  birthdate : z.string().date(),
  religion : z.string(),
  parent : ParentSchema,
  address : AddressSchema,
  contact_num : z.string().min(10),
  profile_pic : z.any().optional()
})

export const StudentEnrollmentSchema = z.object({
  id : z.string().trim().min(1),
  full_name : z.string().trim().min(1),
  section : z.string().trim().min(1),
  grade_level : z.string().trim().min(1),
  school_year : z.string().trim().min(1),
})

export const ClassSchema = z.object( {
  grade_level_name : z.string().min(1).trim(),
  section_name : z.string().min(1).trim(),
  school_year : z.string().includes('-').trim(),
  // created_by : z.string().trim().min(3)
})

export const TeacherSchema = z.object({
  id: z.string().optional(),
  profile: z.custom<FileList | File>().transform((t) => { 
    if(typeof t === 'string') return null;
    return t
  }),
  first_name: z.string().min(1).trim(),
  last_name: z.string().min(1).trim(),
  email: z.string().email(),
  password: z.string().min(8),
  phone_number: z.string().min(11),
  section: z.string().uuid()
})

export const TeacherFileSchema = z.object({
  first_name : z.string().min(1, {message : 'required'}),
  last_name: z.string().min(1, {message : 'required'}),
  password: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(11, {message : `Must contain at least 11 character's`})
})


export const OPTeacherSchema = TeacherSchema.merge(z.object({password: z.string(), section: z.string().uuid()}).partial())


export const getObjectKeys  = <T extends Object>(schema : T) => {
  const keys = Object.keys(schema) as Array<keyof T>
  return keys
}

export type TTeacherSchema = z.infer<typeof TeacherSchema>
export type TOPTeacherSchema = z.infer<typeof OPTeacherSchema>

export type TClassSchema = z.infer<typeof ClassSchema>

export type TTeacherFileSchema = z.infer<typeof TeacherFileSchema>

export type TStudentEnrollmentSchema = z.infer<typeof StudentEnrollmentSchema>

export type TStudent = z.infer<typeof StudentSchema>;
