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

  // Must match app/dashboard/layout.tsx: session is only "valid" with an API access token.
  // Otherwise /login redirects here → /dashboard while layout sends you back → redirect loop.
  const accessToken = token?.accessToken as string | undefined
  const isLoggedIn = Boolean(accessToken)

  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}