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
  contact_num : z.string().min(10)
})

export const StudentEnrollmentSchema = z.object({
  id : z.string().trim().min(1),
  full_name : z.string().trim().min(1),
  section : z.string().trim().min(1),
  grade_level : z.string().trim().min(1),
  school_year : z.string().trim().min(1),
})

export type TStudentEnrollmentSchema = z.infer<typeof StudentEnrollmentSchema>

export type TStudent = z.infer<typeof StudentSchema>;