import { getEnrolledStudent } from "@/server/enrollment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest) {
  
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const s = search ? search : ''
  try {
    const searchEnrolledStudent = await getEnrolledStudent(s)
    return NextResponse.json(searchEnrolledStudent)
    
  } catch (error) {
    return NextResponse.error()
  }
  
  
}