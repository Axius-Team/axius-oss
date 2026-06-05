'use client'

import { Play, Square, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { StatusDot } from '@/src/components/atoms/StatusDot'
import type { DockerContainer } from '@/src/types/docker'

interface ContainerRowProps {
  container: DockerContainer
  onAction: (containerId: string, action: string) => void
}

const statusMap: Record<string, 'running' | 'stopped' | 'error'> = {
  running: 'running',
  exited: 'stopped',
  dead: 'stopped',
  paused: 'stopped',
}

export function ContainerRow({ container, onAction }: ContainerRowProps) {
  const dotStatus = statusMap[container.state] || 'stopped'

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <StatusDot status={dotStatus} />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{container.name}</p>
        <p className="text-sm text-muted-foreground truncate">{container.image}</p>
      </div>
      <Badge variant={container.state === 'running' ? 'default' : 'secondary'}>
        {container.status}
      </Badge>
      <div className="flex gap-1">
        {container.state !== 'running' && (
          <Button variant="ghost" size="icon" onClick={() => onAction(container.id, 'start')}>
            <Play className="h-4 w-4" />
          </Button>
        )}
        {container.state === 'running' && (
          <Button variant="ghost" size="icon" onClick={() => onAction(container.id, 'stop')}>
            <Square className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => onAction(container.id, 'restart')}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onAction(container.id, 'remove')}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
