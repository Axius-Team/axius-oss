import { NextResponse } from 'next/server'
import Docker from 'dockerode'

const docker = new Docker()

export async function GET() {
  try {
    const containers = await docker.listContainers({ all: true })
    const data = containers.map((c: any) => ({
      id: c.Id,
      name: (c.Names[0] || '').replace(/^\//, ''),
      image: c.Image,
      status: c.Status,
      state: c.State,
      ports: (c.Ports || []).map((p: any) => `${p.PrivatePort}->${p.PublicPort || ''}`).join(', '),
      created: c.Created,
      uptime: c.State === 'running' ? Math.floor((Date.now() / 1000) - c.Created) : null,
    }))

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to list containers. Is Docker running?' },
      { status: 500 }
    )
  }
}
