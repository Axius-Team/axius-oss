export interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    temp: number | null
  }
  memory: {
    used: number
    total: number
    swap: number
  }
  storage: {
    used: number
    total: number
  }
  network: {
    inbound: number
    outbound: number
  }
  system: {
    uptime: number
    loadAverage: number[]
    processes: number
  }
}

export interface MetricsHistoryPoint {
  timestamp: number
  cpu: number
  memory: number
  networkIn: number
  networkOut: number
}
