import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSchoolYear = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const school_year = `${currentYear}-${currentYear + 1}`
  return school_year
}


export const getObjectFormData = (form : FormData) => {
  const obj : Record<string, unknown> = {}
  
  for (const element of form.keys()) {
    obj[element] = form.get(element)
  }
  return obj
}