'use server'
import { TSection } from "@/components/EnrollmentSearch";
import { db } from "@/database/db";
import { sections } from "@/database/schema";

export async function getSections() {
  try {
    const getSections = await db.select().from(sections)
    const tranformSections : TSection[] = getSections && getSections.map(v => {
      return {
        id : String(v.id),
        section_name : v.section_name,
        school_year : v.school_year
      }
    })
    return tranformSections
    
  } catch (error) {
    
  }
}