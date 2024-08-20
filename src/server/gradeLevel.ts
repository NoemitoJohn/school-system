'use server';

import { TGradeLevel } from "@/components/EnrollmentSearch";
import { db } from "@/database/db";
import { grade_levels } from "@/database/schema";
import { sql } from "drizzle-orm";

export async function getGradeLevels () {
  try {
    const getGradeLevels = await db.select({
      id : sql<string>`${grade_levels.id}`.as('id'),
      level_name : sql<string>`${grade_levels.level_name}`.as('level_name')
    }).from(grade_levels)
  
    const transformGradeLevel : TGradeLevel[] = getGradeLevels.map(v => {
      return {
        id : String(v.id),
        level_name : v.level_name
      }
    })
  
    return transformGradeLevel
  } catch (error) {
    //
  }
}