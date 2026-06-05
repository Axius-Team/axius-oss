import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/src/lib/auth/password'
import { createSession } from '@/src/lib/auth/session'
import { getUserByUsername } from '@/src/lib/db/users'
import { updateLastLogin } from '@/src/lib/db/users'
import { checkRateLimit } from '@/src/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(`login:${ip}`)) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const user = getUserByUsername(username)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    await createSession(user.id)
    updateLastLogin(user.id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
