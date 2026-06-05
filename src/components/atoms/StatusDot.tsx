import { cn } from '@/src/lib/utils'

interface StatusDotProps {
  status: 'running' | 'stopped' | 'connecting' | 'error'
  className?: string
}

const statusColors: Record<string, string> = {
  running: 'bg-green-500',
  stopped: 'bg-red-500',
  connecting: 'bg-yellow-500',
  error: 'bg-destructive',
}

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        'inline-block h-2.5 w-2.5 rounded-full',
        statusColors[status],
        className
      )}
      aria-label={status}
    />
  )
}
