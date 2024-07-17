// import { classes } from "@/app/class/add/page";
import { z } from "zod";

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
  grade_level_name : z.enum([
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
  ]),
  section_name : z.string().min(3).trim(),
  school_year : z.string().includes('-').trim(),
  // created_by : z.string().trim().min(3)
})


export type TClassSchema = z.infer<typeof ClassSchema>

export type TStudentEnrollmentSchema = z.infer<typeof StudentEnrollmentSchema>

export type TStudent = z.infer<typeof StudentSchema>;