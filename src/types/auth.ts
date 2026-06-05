export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  error?: string
}

export interface SessionResponse {
  success: boolean
  data?: {
    authenticated: boolean
    user?: { id: number; username: string }
  }
}

export interface SetupRequest {
  username: string
  password: string
  smtp_host?: string
  smtp_port?: string
  smtp_secure?: boolean
  smtp_user?: string
  smtp_pass?: string
  smtp_from_address?: string
  smtp_from_name?: string
  notification_email?: string
}
