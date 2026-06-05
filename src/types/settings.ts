export interface AppSettings {
  app_title: string
  theme_mode: 'light' | 'dark'
  custom_css: string
  smtp_host: string
  smtp_port: string
  smtp_secure: boolean
  smtp_user: string
  smtp_from_address: string
  smtp_from_name: string
  notification_email: string
}

export interface ThemeUpdate {
  css: string
}

export interface PasswordChangeRequest {
  current_password: string
  new_password: string
}
