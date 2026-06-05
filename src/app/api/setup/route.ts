import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/src/lib/auth/password'
import { createUser, getUserCount } from '@/src/lib/db/users'
import { isSetupComplete, markSetupComplete, setSetting } from '@/src/lib/db/settings'
import { encrypt } from '@/src/lib/encryption'
import { generateEncryptionKey } from '@/src/lib/encryption'
import { generateJwtSecret } from '@/src/lib/utils'

export async function POST(request: NextRequest) {
  try {
    if (isSetupComplete()) {
      return NextResponse.json(
        { success: false, error: 'Setup is already complete' },
        { status: 400 }
      )
    }

    if (getUserCount() > 0) {
      return NextResponse.json(
        { success: false, error: 'Users already exist' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (!process.env.ENCRYPTION_KEY) {
      const key = generateEncryptionKey()
      process.env.ENCRYPTION_KEY = key
    }

    if (!process.env.JWT_SECRET) {
      const secret = generateJwtSecret()
      process.env.JWT_SECRET = secret
    }

    const passwordHash = await hashPassword(password)
    createUser(username, passwordHash)

    if (body.smtp_host) {
      setSetting('smtp_host', body.smtp_host)
      setSetting('smtp_port', body.smtp_port || '587')
      setSetting('smtp_secure', body.smtp_secure ? 'true' : 'false')
      setSetting('smtp_user', body.smtp_user || '')
      if (body.smtp_pass) {
        const encrypted = encrypt(body.smtp_pass)
        setSetting('smtp_pass_encrypted', encrypted)
      }
      setSetting('smtp_from_address', body.smtp_from_address || '')
      setSetting('smtp_from_name', body.smtp_from_name || 'Axius OSS')
      setSetting('notification_email', body.notification_email || '')
    }

    markSetupComplete()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { setupComplete: isSetupComplete() },
  })
}
