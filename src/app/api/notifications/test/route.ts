import { NextRequest, NextResponse } from 'next/server'
import { getSetting } from '@/src/lib/db/settings'
import { decrypt } from '@/src/lib/encryption'
import { z } from 'zod'

const testSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const parsed = testSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const smtpHost = getSetting('smtp_host')
    const smtpPort = getSetting('smtp_port') || '587'
    const smtpSecure = getSetting('smtp_secure') === 'true'
    const smtpUser = getSetting('smtp_user')
    const smtpPassEnc = getSetting('smtp_pass_encrypted')
    const fromAddress = getSetting('smtp_from_address')

    if (!smtpHost || !smtpUser || !smtpPassEnc) {
      return NextResponse.json(
        { success: false, error: 'SMTP not fully configured' },
        { status: 400 }
      )
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

    await transporter.sendMail({
      from: fromAddress || smtpUser,
      to: parsed.data.email,
      subject: 'Axius OSS - Test Email',
      text: 'This is a test email from Axius OSS. Your SMTP configuration is working.',
      html: '<p>This is a test email from <strong>Axius OSS</strong>.</p><p>Your SMTP configuration is working correctly.</p>',
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send test email' },
      { status: 500 }
    )
  }
}
