'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { DockerContainer } from '@/src/types/docker'

const POLL_INTERVAL = 5000

export function useContainerMonitor() {
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const visibleRef = useRef(true)

  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch('/api/docker/containers')
      const json = await res.json()
      if (json.success) {
        setContainers(json.data)
        setError(null)
      } else {
        setError(json.error || 'Failed to fetch containers')
      }
    } catch {
      setError('Failed to fetch containers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      visibleRef.current = !document.hidden
      if (visibleRef.current) {
        fetchContainers()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    fetchContainers()

    intervalRef.current = setInterval(() => {
      if (visibleRef.current) {
        fetchContainers()
      }
    }, POLL_INTERVAL)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchContainers])

  const performAction = useCallback(async (containerId: string, action: string) => {
    const res = await fetch('/api/docker/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ containerId, action }),
    })
    const json = await res.json()
    if (json.success) {
      await fetchContainers()
    }
    return json
  }, [fetchContainers])

  return { containers, loading, error, performAction }
}
