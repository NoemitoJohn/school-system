import { deleteSession } from "@/app/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  deleteSession()
  return NextResponse.json({success : true})
}