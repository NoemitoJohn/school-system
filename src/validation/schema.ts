import { z } from "zod";


const AddressSchema = z.object({
  province : z.string().trim(),
  city : z.string().trim(),
  barangay : z.string().trim(),
  house_num : z.string().trim(),
})


const ParentSchema = z.object({
  father : z.object({
    first_name : z.string().trim(),
    last_name : z.string().trim(),
    middle_name : z.string().trim(),
    ext_name : z.string().trim(),
  }),
  mother : z.object({
    first_name : z.string().trim(),
    last_name : z.string().trim(),
    middle_name : z.string().trim(),
  })
})

export const StudentSchema = z.object({
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


export type TStudent = z.infer<typeof StudentSchema>;