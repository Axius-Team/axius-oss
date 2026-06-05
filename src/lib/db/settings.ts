import { getDb } from '@/src/lib/db/client'

export function getSetting(key: string): string | undefined {
  const db = getDb()
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined
  return row?.value
}

export function setSetting(key: string, value: string): void {
  const db = getDb()
  db.prepare(
    'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, unixepoch()) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = unixepoch()'
  ).run(key, value)
}

export function getSettings(): Record<string, string> {
  const db = getDb()
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[]
  const settings: Record<string, string> = {}
  for (const row of rows) {
    settings[row.key] = row.value
  }
  return settings
}

export function isSetupComplete(): boolean {
  return getSetting('setup_complete') === 'true'
}

export function markSetupComplete(): void {
  setSetting('setup_complete', 'true')
}
