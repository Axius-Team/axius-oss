import { Card, CardContent } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import { MetricBadge } from '@/src/components/atoms/MetricBadge'

interface MetricCardProps {
  title: string
  label: string
  value: string | number
  unit?: string
  progress?: number
  icon?: React.ReactNode
}

export function MetricCard({ title, label, value, unit, progress, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon}
        </div>
        <MetricBadge label={label} value={value} unit={unit} />
        {progress !== undefined && (
          <Progress value={progress} className="h-2" />
        )}
      </CardContent>
    </Card>
  )
}
