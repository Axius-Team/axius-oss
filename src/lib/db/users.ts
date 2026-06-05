import { getDb } from '@/src/lib/db/client'
import type { User } from '@/src/lib/db/schema'

export function getUserByUsername(username: string): User | undefined {
  const db = getDb()
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined
}

export function getUserById(id: number): User | undefined {
  const db = getDb()
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined
}

export function createUser(username: string, passwordHash: string): User {
  const db = getDb()
  const result = db.prepare(
    'INSERT INTO users (username, password_hash) VALUES (?, ?)'
  ).run(username, passwordHash)
  return getUserById(result.lastInsertRowid as number) as User
}

export function updatePassword(userId: number, passwordHash: string): void {
  const db = getDb()
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, userId)
}

export function updateLastLogin(userId: number): void {
  const db = getDb()
  db.prepare('UPDATE users SET last_login = unixepoch() WHERE id = ?').run(userId)
}

export function getUserCount(): number {
  const db = getDb()
  const row = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
  return row.count
}
