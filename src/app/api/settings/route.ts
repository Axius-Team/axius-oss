import { NextRequest, NextResponse } from 'next/server'
import { getSetting, setSetting } from '@/src/lib/db/settings'
import { hashPassword, verifyPassword } from '@/src/lib/auth/password'
import { getCurrentSession } from '@/src/lib/auth/session'
import { getUserById, updatePassword } from '@/src/lib/db/users'
import { z } from 'zod'

export async function GET() {
  try {
    const appTitle = getSetting('app_title') || 'Axius OSS'
    const themeMode = getSetting('theme_mode') || 'dark'

    return NextResponse.json({
      success: true,
      data: { app_title: appTitle, theme_mode: themeMode },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    if (body.app_title !== undefined) {
      setSetting('app_title', body.app_title)
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
