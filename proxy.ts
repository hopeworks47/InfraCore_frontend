// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl

  const isAuthPage = pathname === '/login'
  const isProtected = pathname.startsWith('/dashboard')

  // ❌ Not logged in → block dashboard
  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ✅ Logged in → block login page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}