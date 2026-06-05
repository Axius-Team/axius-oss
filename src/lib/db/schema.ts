export interface Setting {
  key: string
  value: string
  updated_at: number
}

export interface User {
  id: number
  username: string
  password_hash: string
  created_at: number
  last_login: number | null
}

export interface Session {
  token_id: string
  user_id: number
  created_at: number
  expires_at: number
}

export interface NotificationRule {
  id: number
  container_id: string
  container_name: string
  server_host: string
  enabled: number
  last_known_status: string | null
  last_notified_at: number | null
  notification_count: number
  created_at: number
}

export interface NotificationHistory {
  id: number
  container_id: string
  container_name: string
  server_host: string
  event_type: string
  status: string
  sent_at: number
  error_message: string | null
}
