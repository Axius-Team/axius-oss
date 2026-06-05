import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { getDb } from '@/src/lib/db/client'

const JWT_SECRET = process.env.JWT_SECRET || ''
const COOKIE_NAME = 'axius_session'
const SESSION_DURATION = 7 * 24 * 60 * 60

export function getJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }
  return JWT_SECRET
}

export function signToken(userId: number): { token: string; tokenId: string; expiresAt: number } {
  const tokenId = crypto.randomUUID()
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION

  const token = jwt.sign(
    { userId, tokenId },
    getJwtSecret(),
    { expiresIn: SESSION_DURATION }
  )

  return { token, tokenId, expiresAt }
}

export function verifyToken(token: string): { userId: number; tokenId: string } | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { userId: number; tokenId: string }
    return decoded
  } catch {
    return null
  }
}

export async function createSession(userId: number): Promise<string> {
  const { token, tokenId, expiresAt } = signToken(userId)
  const db = getDb()

  db.prepare(
    'INSERT INTO sessions (token_id, user_id, expires_at) VALUES (?, ?, ?)'
  ).run(tokenId, userId, expiresAt)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION,
  })

  return token
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      const db = getDb()
      db.prepare('DELETE FROM sessions WHERE token_id = ?').run(payload.tokenId)
    }
  }
  cookieStore.delete(COOKIE_NAME)
}

export async function getCurrentSession(): Promise<{ userId: number; tokenId: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const db = getDb()
  const session = db.prepare(
    'SELECT token_id FROM sessions WHERE token_id = ? AND expires_at > ?'
  ).get(payload.tokenId, Math.floor(Date.now() / 1000))

  if (!session) return null

  return payload
}

export async function revokeAllSessions(userId: number): Promise<void> {
  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId)
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
