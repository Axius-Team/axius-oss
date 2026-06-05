'use client'

import { Switch } from '@/src/components/ui/switch'
import { Label } from '@/src/components/ui/label'

interface NotificationToggleProps {
  containerId: string
  containerName: string
  enabled: boolean
  onToggle: (containerId: string, enabled: boolean) => void
}

export function NotificationToggle({ containerId, containerName, enabled, onToggle }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="space-y-0.5">
        <Label htmlFor={`notify-${containerId}`}>{containerName}</Label>
        <p className="text-xs text-muted-foreground">Send alert when container stops</p>
      </div>
      <Switch
        id={`notify-${containerId}`}
        checked={enabled}
        onCheckedChange={(checked) => onToggle(containerId, checked)}
      />
    </div>
  )
}
