import { NextResponse } from 'next/server'
import Docker from 'dockerode'

const docker = new Docker()

export async function GET() {
  try {
    const networks = await docker.listNetworks()
    const data = networks.map((n: any) => ({
      id: n.Id,
      name: n.Name,
      driver: n.Driver,
      scope: n.Scope,
      containers: Object.keys(n.Containers || {}).length,
    }))

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to list networks' },
      { status: 500 }
    )
  }
}
