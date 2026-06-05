import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/src/lib/utils'

interface SmtpStatusBannerProps {
  configured: boolean
  connected: boolean
  className?: string
}

export function SmtpStatusBanner({ configured, connected, className }: SmtpStatusBannerProps) {
  if (!configured) {
    return (
      <div className={cn('flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3 text-sm', className)}>
        <Info className="h-4 w-4 text-yellow-500" />
        <span>SMTP not configured. Email notifications will not work.</span>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className={cn('flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm', className)}>
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span>SMTP configured but not connected. Check your settings.</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm', className)}>
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <span>SMTP connected successfully.</span>
    </div>
  )
}
