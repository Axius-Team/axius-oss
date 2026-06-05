CREATE TABLE IF NOT EXISTS settings (
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
);
