import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/src/lib/db/client'
import { z } from 'zod'

const ruleSchema = z.object({
  containerId: z.string().min(1),
  containerName: z.string().min(1),
  serverHost: z.string().min(1),
  enabled: z.boolean(),
})

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const parsed = ruleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { containerId, containerName, serverHost, enabled } = parsed.data
    const db = getDb()

    db.prepare(`
      INSERT INTO notification_rules (container_id, container_name, server_host, enabled)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(container_id, server_host)
      DO UPDATE SET enabled = ?, container_name = ?
    `).run(containerId, containerName, serverHost, enabled ? 1 : 0, enabled ? 1 : 0, containerName)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to save rule' },
      { status: 500 }
    )
  }
}
