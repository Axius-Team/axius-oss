import { NextResponse } from 'next/server'
import { getCurrentSession } from '@/src/lib/auth/session'
import { getUserById } from '@/src/lib/db/users'

export async function GET() {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({
        success: true,
        data: { authenticated: false },
      })
    }

    const user = getUserById(session.userId)
    if (!user) {
      return NextResponse.json({
        success: true,
        data: { authenticated: false },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        authenticated: true,
        user: { id: user.id, username: user.username },
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
