CREATE TABLE IF NOT EXISTS notification_rules (
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
);
