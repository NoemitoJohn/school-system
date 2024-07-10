import { TSection } from "@/components/EnrollmentSearch";
import { db } from "@/database/db";
import { sections } from "@/database/schema";
import { sql } from "drizzle-orm";

export async function getSections() {
  try {
    const getSections = await db.select({
      id : sql<string>`CAST(${sections.section_id} as TEXT)`.as('id'),
      section_name : sql<string>`${sections.section_name}`.as('section_name'),
      school_year : sql<string>`${sections.school_year}`,
      grade_level_id : sql<string>`CAST(${sections.grade_level_id} as TEXT)`.as('grade_level_id')
    }).from(sections)
    
    const tranformSections : TSection[] = getSections
    return tranformSections
    
  } catch (error) {
    
  }
}