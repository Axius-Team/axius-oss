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
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

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

    const entries = await fs.readdir(resolved, { withFileTypes: true })
    const items = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(resolved, entry.name)
        try {
          const stat = await fs.stat(fullPath)
          return {
            name: entry.name,
            path: fullPath,
            type: entry.isDirectory() ? 'directory' : 'file',
            size: stat.size,
            modified: stat.mtime.toISOString(),
          }
        } catch {
          return {
            name: entry.name,
            path: fullPath,
            type: entry.isDirectory() ? 'directory' : 'file',
            size: 0,
            modified: '',
          }
        }
      })
    )

    items.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({ success: true, data: items })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to list directory' },
      { status: 500 }
    )
  }
}
