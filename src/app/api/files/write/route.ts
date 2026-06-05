import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'

const writeSchema = z.object({
  path: z.string().min(1),
  content: z.string(),
})

function resolveSafePath(inputPath: string): { resolved: string; error?: string } {
  try {
    const resolved = path.resolve(inputPath)
    if (resolved.includes('\0')) {
      return { resolved: '', error: 'Invalid path: null bytes detected' }
    }
    if (resolved.startsWith('/proc') || resolved.startsWith('/sys') || resolved.startsWith('/dev')) {
      return { resolved: '', error: 'Access to system directories is forbidden' }
    }
    return { resolved }
  } catch {
    return { resolved: '', error: 'Invalid path' }
  }
}

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const parsed = writeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { resolved, error } = resolveSafePath(parsed.data.path)
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 })
    }

    await fs.writeFile(resolved, parsed.data.content, 'utf-8')

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to write file' },
      { status: 500 }
    )
  }
}
