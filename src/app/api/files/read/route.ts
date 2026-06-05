import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

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
    const { path: reqPath } = await request.json()
    if (!reqPath) {
      return NextResponse.json(
        { success: false, error: 'Path is required' },
        { status: 400 }
      )
    }

    const { resolved, error } = resolveSafePath(reqPath)
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 })
    }

    const stat = await fs.stat(resolved)
    if (stat.isDirectory()) {
      return NextResponse.json(
        { success: false, error: 'Cannot read a directory' },
        { status: 400 }
      )
    }

    const content = await fs.readFile(resolved, 'utf-8')

    return NextResponse.json({ success: true, data: { content } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to read file or file is binary' },
      { status: 500 }
    )
  }
}
