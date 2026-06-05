import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = process.env.DATA_DIR || './data'

let db: Database.Database | null = null
let migrationsRun = false

const MIGRATIONS: Record<string, string> = {
  '001_init.sql': `CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT OR IGNORE INTO settings (key, value) VALUES
  ('setup_complete', 'false'),
  ('app_title', 'Axius OSS'),
  ('smtp_host', ''),
  ('smtp_port', '587'),
  ('smtp_secure', 'false'),
  ('smtp_user', ''),
  ('smtp_pass_encrypted', ''),
  ('smtp_from_address', ''),
  ('smtp_from_name', 'Axius OSS'),
  ('notification_email', ''),
  ('custom_css', ''),
  ('theme_mode', 'dark');

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login INTEGER
);

CREATE TABLE IF NOT EXISTS sessions (
  token_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  expires_at INTEGER NOT NULL
);`,

  '002_notifications.sql': `CREATE TABLE IF NOT EXISTS notification_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  container_id TEXT NOT NULL,
  container_name TEXT NOT NULL,
  server_host TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  last_known_status TEXT,
  last_notified_at INTEGER,
  notification_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(container_id, server_host)
);

CREATE TABLE IF NOT EXISTS notification_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  container_id TEXT NOT NULL,
  container_name TEXT NOT NULL,
  server_host TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  sent_at INTEGER NOT NULL DEFAULT (unixepoch()),
  error_message TEXT
);`,
}

export function getDb(): Database.Database {
  if (db) return db

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  const dbPath = path.join(DATA_DIR, 'axius.db')
  db = new Database(dbPath)

  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  runMigrations()

  return db
}

export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}

export function runMigrations(): void {
  if (migrationsRun) return
  migrationsRun = true

  const database = getDb()

  database.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `)

  const applied = new Set(
    database.prepare('SELECT name FROM _migrations').all()
      .map((r: any) => r.name)
  )

  for (const [name, sql] of Object.entries(MIGRATIONS)) {
    if (applied.has(name)) continue
    database.exec(sql)
    database.prepare('INSERT INTO _migrations (name) VALUES (?)').run(name)
  }
}
