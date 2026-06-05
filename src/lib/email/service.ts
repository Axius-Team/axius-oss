import nodemailer from 'nodemailer'
import { getSetting } from '@/src/lib/db/settings'
import { decrypt } from '@/src/lib/encryption'

export function createTransporter() {
  const host = getSetting('smtp_host')
  const port = getSetting('smtp_port') || '587'
  const secure = getSetting('smtp_secure') === 'true'
  const user = getSetting('smtp_user')
  const passEnc = getSetting('smtp_pass_encrypted')

  if (!host || !user || !passEnc) {
    throw new Error('SMTP not fully configured')
  }

  const pass = decrypt(passEnc)

  return nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })
}

export function getFromAddress(): string {
  return getSetting('smtp_from_address') || getSetting('smtp_user') || ''
}

export function getFromName(): string {
  return getSetting('smtp_from_name') || 'Axius OSS'
}

export function getNotificationEmail(): string {
  return getSetting('notification_email') || ''
}
