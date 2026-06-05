export interface NotificationSettings {
  smtpConfigured: boolean
  smtpConnected: boolean
  rules: NotificationRuleResponse[]
  history: NotificationHistoryResponse[]
}

export interface NotificationRuleResponse {
  id: number
  container_id: string
  container_name: string
  server_host: string
  enabled: boolean
  last_known_status: string | null
  last_notified_at: number | null
  notification_count: number
}

export interface NotificationHistoryResponse {
  id: number
  container_id: string
  container_name: string
  server_host: string
  event_type: string
  status: string
  sent_at: number
  error_message: string | null
}

export interface NotificationSettingsUpdate {
  smtp_host?: string
  smtp_port?: string
  smtp_secure?: boolean
  smtp_user?: string
  smtp_pass?: string
  smtp_from_address?: string
  smtp_from_name?: string
  notification_email?: string
}

export interface NotificationRuleUpdate {
  containerId: string
  containerName: string
  serverHost: string
  enabled: boolean
}
