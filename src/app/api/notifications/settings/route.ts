import { NextRequest, NextResponse } from 'next/server'
import { getSetting, setSetting } from '@/src/lib/db/settings'
import { getDb } from '@/src/lib/db/client'
import { encrypt } from '@/src/lib/encryption'

export async function GET() {
  try {
    const smtpHost = getSetting('smtp_host') || ''
    const smtpPort = getSetting('smtp_port') || '587'
    const smtpSecure = getSetting('smtp_secure') === 'true'
    const smtpUser = getSetting('smtp_user') || ''
    const smtpFromAddress = getSetting('smtp_from_address') || ''
    const smtpFromName = getSetting('smtp_from_name') || 'Axius OSS'
    const notificationEmail = getSetting('notification_email') || ''
    const smtpConfigured = !!(smtpHost && smtpUser)

    let smtpConnected = false
    if (smtpConfigured) {
      try {
        const nodemailer = require('nodemailer')
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: smtpSecure,
          tls: { rejectUnauthorized: false },
        })
        await transporter.verify()
        smtpConnected = true
      } catch {
        smtpConnected = false
      }
    }

    const db = getDb()
    const rules = db.prepare('SELECT * FROM notification_rules ORDER BY container_name').all()
    const history = db.prepare('SELECT * FROM notification_history ORDER BY sent_at DESC LIMIT 50').all()

    return NextResponse.json({
      success: true,
      data: {
        smtpConfigured,
        smtpConnected,
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_secure: smtpSecure,
        smtp_user: smtpUser,
        smtp_from_address: smtpFromAddress,
        smtp_from_name: smtpFromName,
        notification_email: notificationEmail,
        rules,
        history,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()

    if (body.smtp_host !== undefined) setSetting('smtp_host', body.smtp_host)
    if (body.smtp_port !== undefined) setSetting('smtp_port', body.smtp_port)
    if (body.smtp_secure !== undefined) setSetting('smtp_secure', body.smtp_secure ? 'true' : 'false')
    if (body.smtp_user !== undefined) setSetting('smtp_user', body.smtp_user)
    if (body.smtp_pass) {
      const encrypted = encrypt(body.smtp_pass)
      setSetting('smtp_pass_encrypted', encrypted)
    }
    if (body.smtp_from_address !== undefined) setSetting('smtp_from_address', body.smtp_from_address)
    if (body.smtp_from_name !== undefined) setSetting('smtp_from_name', body.smtp_from_name)
    if (body.notification_email !== undefined) setSetting('notification_email', body.notification_email)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
