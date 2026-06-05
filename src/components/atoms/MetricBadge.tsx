import { cn } from '@/src/lib/utils'

interface MetricBadgeProps {
  label: string
  value: string | number
  unit?: string
  className?: string
}

export function MetricBadge({ label, value, unit, className }: MetricBadgeProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">
        {value}
        {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
      </span>
    </div>
  )
}
