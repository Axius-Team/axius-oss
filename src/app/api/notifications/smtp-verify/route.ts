import { NextResponse } from 'next/server'
import { getSetting } from '@/src/lib/db/settings'
import { decrypt } from '@/src/lib/encryption'

export async function GET() {
  try {
    const smtpHost = getSetting('smtp_host')
    const smtpPort = getSetting('smtp_port') || '587'
    const smtpSecure = getSetting('smtp_secure') === 'true'
    const smtpUser = getSetting('smtp_user')
    const smtpPassEnc = getSetting('smtp_pass_encrypted')

    if (!smtpHost || !smtpUser || !smtpPassEnc) {
      return NextResponse.json({
        success: true,
        data: { connected: false, error: 'SMTP not configured' },
      })
    }

    const smtpPass = decrypt(smtpPassEnc)

    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
    })

    await transporter.verify()

    return NextResponse.json({
      success: true,
      data: { connected: true },
    })
  } catch {
    return NextResponse.json({
      success: true,
      data: { connected: false, error: 'Connection failed' },
    })
  }
}
