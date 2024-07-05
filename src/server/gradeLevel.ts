'use server';

import { TGradeLevel } from "@/components/EnrollmentSearch";
import { db } from "@/database/db";
import { grade_levels } from "@/database/schema";

export async function getGradeLevels () {
  try {
    const getGradeLevels = await db.select({
      id : grade_levels.id,
      level_name : grade_levels.level_name
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