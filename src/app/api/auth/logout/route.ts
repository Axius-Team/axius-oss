import { NextResponse } from 'next/server'
import { destroySession } from '@/src/lib/auth/session'

export async function POST() {
  try {
    await destroySession()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
