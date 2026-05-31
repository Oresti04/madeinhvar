import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isKeystatic = pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')
  if (!isKeystatic) return NextResponse.next()

  const adminPassword = process.env.KEYSTATIC_ADMIN_PASSWORD
  if (!adminPassword) return NextResponse.next() // no password set — allow (dev fallback)

  const cookie = request.cookies.get('keystatic_auth')
  if (cookie?.value === adminPassword) return NextResponse.next()

  const loginUrl = new URL('/admin/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/keystatic/:path*', '/api/keystatic/:path*'],
}
