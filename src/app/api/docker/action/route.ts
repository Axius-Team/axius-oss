import { NextRequest, NextResponse } from 'next/server'
import Docker from 'dockerode'
import { z } from 'zod'

const docker = new Docker()
const origin = process.env.APP_URL || ''

const actionSchema = z.object({
  containerId: z.string().min(1),
  action: z.enum(['start', 'stop', 'restart', 'remove']),
})

export async function POST(request: NextRequest) {
  try {
    const originHeader = request.headers.get('origin') || request.headers.get('referer') || ''
    if (origin && !originHeader.includes(origin.replace(/https?:\/\//, '').split(':')[0])) {
      return NextResponse.json(
        { success: false, error: 'Invalid origin' },
        { status: 403 }
      )
    }

    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const parsed = actionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { containerId, action } = parsed.data
    const container = docker.getContainer(containerId)

    switch (action) {
      case 'start':
        await container.start()
        break
      case 'stop':
        await container.stop()
        break
      case 'restart':
        await container.restart()
        break
      case 'remove':
        await container.remove()
        break
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Action failed' },
      { status: 500 }
    )
  }
}
