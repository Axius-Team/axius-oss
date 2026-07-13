'use client'

import dynamic from 'next/dynamic'
import { LoadingSpinner } from '@/src/components/atoms/LoadingSpinner'
import { useMetrics } from '@/src/hooks/useMetrics'
import { formatBytes } from '@/src/lib/utils'
import { Card, CardContent } from '@/src/components/ui/card'
import { Cpu, MemoryStick, HardDrive, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

const Charts = dynamic(
  () => import('@/src/components/organisms/MonitoringDashboard').then(m => m.ChartsComponent),
  { loading: () => <LoadingSpinner size="sm" />, ssr: false }
)

export function ChartsComponent({ data }: { data: { timestamp: number; cpu: number; memory: number; networkIn: number; networkOut: number }[] }) {
  const {
    LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Area, ComposedChart
  } = require('recharts')

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Resource Usage Over Time</h3>
        <p className="text-xs text-muted-foreground mb-4">CPU and Memory usage trends</p>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="timestamp" tickFormatter={(v: number) => new Date(v).toLocaleTimeString()} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
              labelFormatter={(v: number) => new Date(v).toLocaleTimeString()}
              formatter={(v: number, name: string) => [`${v.toFixed(1)}%`, name === 'cpu' ? 'CPU' : 'Memory']}
            />
            <Area type="monotone" dataKey="cpu" stroke="var(--foreground)" fill="var(--foreground)" fillOpacity={0.1} strokeWidth={1.5} dot={false} name="cpu" />
            <Line type="monotone" dataKey="memory" stroke="#ef4444" strokeWidth={1.5} dot={false} name="memory" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Network Activity</h3>
        <p className="text-xs text-muted-foreground mb-4">Data transfer rates</p>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="timestamp" tickFormatter={(v: number) => new Date(v).toLocaleTimeString()} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
              labelFormatter={(v: number) => new Date(v).toLocaleTimeString()}
              formatter={(v: number, name: string) => {
                const label = name === 'networkIn' ? 'Download' : 'Upload'
                return [`${formatBytes(v)}/s`, label]
              }}
            />
            <Area type="monotone" dataKey="networkIn" stroke="var(--foreground)" fill="var(--foreground)" fillOpacity={0.1} strokeWidth={1.5} dot={false} name="networkIn" />
            <Line type="monotone" dataKey="networkOut" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="networkOut" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function MonitoringDashboard() {
  const { metrics, history, error } = useMetrics()
  const [hostname, setHostname] = useState('localhost')

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-48">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Monitoring</h2>
        <p className="text-muted-foreground">Real-time metrics for {hostname}</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{metrics.cpu.usage.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              {metrics.cpu.cores} cores {metrics.cpu.temp !== null ? `\u2022 ${metrics.cpu.temp.toFixed(2)}\u00b0C` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Memory</p>
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{formatBytes(metrics.memory.used)}</p>
            <p className="text-xs text-muted-foreground">
              of {formatBytes(metrics.memory.total)} {metrics.memory.swap > 0 ? `\u2022 Swap: ${formatBytes(metrics.memory.swap)}` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Storage</p>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{formatBytes(metrics.storage.used)}</p>
            <p className="text-xs text-muted-foreground">
              of {formatBytes(metrics.storage.total)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Network</p>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">
              {metrics.network.inbound > 0 ? formatBytes(metrics.network.inbound) + '/s' : '0 B/s'}
            </p>
            <p className="text-xs text-muted-foreground">
              <span>&#8595; {formatBytes(metrics.network.inbound)}/s</span>
              <span className="ml-3">&#8593; {formatBytes(metrics.network.outbound)}/s</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {history.length > 1 ? (
        <Charts data={history} />
      ) : (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  )
}
