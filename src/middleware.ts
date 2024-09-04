import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const publicRoutes = ['/login', '/signup']

export default async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname

  const cookie = cookies().get('session')?.value

  const user = await decrypt(cookie)
  
  const isPublicRoute = publicRoutes.includes(path)
  // public routes
  if(!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  // if user is not aprroved
  if(user && user.approve == false && !req.nextUrl.pathname.startsWith('/approval')) { // if user is not approve yet
    return NextResponse.redirect(new URL('/approval', req.nextUrl))
  }
  // if user is  aprroved
  if(user && user.approve == true && req.nextUrl.pathname.startsWith('/approval')) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
  // gate pesonnel role  
  if(user && user.role === 'gate_personnel' && !req.nextUrl.pathname.startsWith('/scanner') ) {
    return NextResponse.redirect(new URL('/scanner', req.nextUrl))
  }

  // redirect teacher if in public [/login, /sign-up] route
  if(user && isPublicRoute && user.role === 'teacher') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
  // redirect teacher if in /scanner route
  if(user && user.role === 'teacher' && req.nextUrl.pathname.startsWith('/scanner')) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
  

  return NextResponse.next()
}

export const config = {
  matcher: [ '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}