import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession } from '@/src/lib/auth/session'
import { getUserById, updatePassword } from '@/src/lib/db/users'
import { hashPassword, verifyPassword } from '@/src/lib/auth/password'
import { z } from 'zod'

const passwordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = passwordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const user = getUserById(session.userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const valid = await verifyPassword(parsed.data.current_password, user.password_hash)
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 403 }
      )
    }

    const newHash = await hashPassword(parsed.data.new_password)
    updatePassword(user.id, newHash)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
