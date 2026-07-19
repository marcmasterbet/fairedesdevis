import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('sb-eb3e496a-ff58-480b-a136-0e79368e43ce-auth-token')
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}