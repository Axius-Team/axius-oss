'use client'

import { useState } from 'react'
import { ContainerRow } from '@/src/components/molecules/ContainerRow'
import { LoadingSpinner } from '@/src/components/atoms/LoadingSpinner'
import { useContainerMonitor } from '@/src/hooks/useContainerMonitor'
import { Button } from '@/src/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { toast } from '@/src/hooks/use-toast'

export function DockerManagement() {
  const { containers, loading, error, performAction } = useContainerMonitor()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3">
        <p className="text-destructive">{error}</p>
        <p className="text-sm text-muted-foreground">
          Ensure Docker is running and the socket is accessible.
        </p>
      </div>
    )
  }

  const handleAction = async (containerId: string, action: string) => {
    setActionLoading(containerId)
    try {
      const result = await performAction(containerId, action)
      if (result.success) {
        toast({ title: `Container ${action} successful` })
      } else {
        toast({ title: `Action failed: ${result.error}`, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Action failed', variant: 'destructive' })
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Docker Containers</h2>
          <p className="text-muted-foreground">Manage local containers</p>
        </div>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </div>
      ) : containers.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">No containers found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {containers.map((c) => (
            <ContainerRow
              key={c.id}
              container={c}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
    </div>
  )
}
