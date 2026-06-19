import { NextResponse } from 'next/server'

const loginRateLimitStore = new Map<string, { count: number; windowStart: number }>()
const LOGIN_MAX = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000

function isLoginRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = loginRateLimitStore.get(ip)
  if (!entry || now - entry.windowStart > LOGIN_WINDOW_MS) {
    loginRateLimitStore.set(ip, { count: 1, windowStart: now })
    return false
  }
  if (entry.count >= LOGIN_MAX) return true
  entry.count++
  return false
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isLoginRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 })
  }

  const { password } = await request.json()
  const adminPassword = process.env.KEYSTATIC_ADMIN_PASSWORD

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('keystatic_auth', adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })
  return response
}
