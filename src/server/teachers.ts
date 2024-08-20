'use server'
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";

export async function getTeachers(search = '') {
  const teachers = await db.select(
    {
      id: users.id,
      full_name: sql<string>`UPPER( CONCAT(${users.last_name}, ', ', ${users.first_name}) )`.as('full_name'),
      email: sql<string>`${users.email}`,
      approval: sql<string>`CASE ${users.approval} WHEN TRUE THEN 'APPROVED' ELSE 'PENDING' END`.as('approval'),
      status: sql<string>`CASE ${users.active} WHEN TRUE THEN 'ACTIVE' ELSE 'NOT ACTIVE' END`.as('approval'),
    }
  ).from(users).where(and(eq(users.role_id, 'teacher'), or(ilike(users.first_name, `%${search}%`), ilike(users.last_name, `%${search}%`))))

  return teachers
}