'use server'
import { TSection } from "@/components/EnrollmentSearch";
import { db } from "@/database/db";
import { grade_levels, sections } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

export async function getSections() {
  try {
    const getSections = await db.select({
      id : sql<string>`CAST(${sections.id} as TEXT)`.as('id'),
      section_name : sql<string>`${sections.section_name}`.as('section_name'),
      school_year : sql<string>`${sections.school_year}`,
      grade_level_id : sql<string>`CAST(${sections.grade_level_id} as TEXT)`.as('grade_level_id')
    }).from(sections)
    
    const tranformSections : TSection[] = getSections
    return tranformSections
    
  } catch (error) {
    
  }
}

export async function getClasses() {
  
  try {
    const getSections = await db.select({
      id : sql<string>`CAST(${sections.id} as TEXT)`.as('id'),
      section_name : sql<string>`${sections.section_name}`.as('section_name'),
      school_year : sql<string>`${sections.school_year}`,
      grade_level_id : sql<string>`CAST(${sections.grade_level_id} as TEXT)`.as('grade_level_id'),
      grade_level_name: grade_levels.level_name
    }).from(sections).innerJoin(grade_levels, sql`${grade_levels.id} = CAST(${sections.grade_level_id} as TEXT)`)
    
    const tranformSections : TSection[] = getSections
  
    return tranformSections
    
  } catch (error) {
    console.log(error)
  }

  
}