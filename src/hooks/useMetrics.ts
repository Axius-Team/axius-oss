'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { SystemMetrics, MetricsHistoryPoint } from '@/src/types/metrics'

const POLL_INTERVAL = 3000
const MAX_HISTORY = 60

export function useMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [history, setHistory] = useState<MetricsHistoryPoint[]>([])
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const visibleRef = useRef(true)

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/metrics')
      const json = await res.json()
      if (json.success) {
        const data = json.data as SystemMetrics
        setMetrics(data)
        setError(null)

        setHistory(prev => {
          const point: MetricsHistoryPoint = {
            timestamp: Date.now(),
            cpu: data.cpu.usage,
            memory: (data.memory.used / data.memory.total) * 100,
            networkIn: data.network.inbound,
            networkOut: data.network.outbound,
          }
          const next = [...prev, point]
          if (next.length > MAX_HISTORY) {
            return next.slice(next.length - MAX_HISTORY)
          }
          return next
        })
      } else {
        setError(json.error || 'Failed to fetch metrics')
      }
    } catch {
      setError('Failed to fetch metrics')
    }
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      visibleRef.current = !document.hidden
      if (visibleRef.current) {
        fetchMetrics()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    fetchMetrics()

    intervalRef.current = setInterval(() => {
      if (visibleRef.current) {
        fetchMetrics()
      }
    }, POLL_INTERVAL)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchMetrics])

  return { metrics, history, error }
}
