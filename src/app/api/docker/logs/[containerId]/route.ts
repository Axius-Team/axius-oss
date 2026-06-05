import { NextRequest, NextResponse } from 'next/server'
import Docker from 'dockerode'

const docker = new Docker()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ containerId: string }> }
) {
  try {
    const { containerId } = await params
    const { searchParams } = new URL(request.url)
    const tail = parseInt(searchParams.get('tail') || '100', 10)

    const container = docker.getContainer(containerId)
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail,
      timestamps: false,
    })

    const lines = logs
      .toString()
      .split('\n')
      .filter(Boolean)
      .map((line: string) => {
        return line.replace(/^[\x00-\x1F]+/, '')
      })

    return NextResponse.json({ success: true, data: lines })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to get logs' },
      { status: 500 }
    )
  }
}
