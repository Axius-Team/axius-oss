import { NextResponse } from 'next/server'
import si from 'systeminformation'

export async function GET() {
  try {
    const [cpu, mem, disk, net, time, processes] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.time(),
      si.processes(),
    ])

    const networkIn = net.reduce((sum: number, n: any) => sum + (n.rx_sec || 0), 0)
    const networkOut = net.reduce((sum: number, n: any) => sum + (n.tx_sec || 0), 0)

    const cpuTemp = cpu.cpus && cpu.cpus.length > 0
      ? (cpu.cpus as any[]).reduce((sum: number, c: any) => sum + (c.temp || 0), 0) / cpu.cpus.length
      : null

    return NextResponse.json({
      success: true,
      data: {
        cpu: {
          usage: cpu.currentLoad,
          cores: cpu.cpus.length,
          temp: cpuTemp,
        },
        memory: {
          used: mem.used,
          total: mem.total,
          swap: mem.swapused || 0,
        },
        storage: {
          used: disk[0]?.used || 0,
          total: disk[0]?.size || 0,
        },
        network: {
          inbound: networkIn,
          outbound: networkOut,
        },
        system: {
          uptime: time.uptime,
          loadAverage: [cpu.avgLoad || 0],
          processes: processes.all,
        },
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to collect metrics. Ensure systeminformation has required permissions.' },
      { status: 500 }
    )
  }
}
