import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit } from '@/src/lib/rate-limit'

const termSchema = z.object({
  action: z.enum(['connect', 'input', 'poll', 'resize', 'disconnect']),
  sessionId: z.string().min(1),
  data: z.string().optional(),
  rows: z.number().optional(),
  cols: z.number().optional(),
})

interface TerminalSession {
  pty: any
  buffer: string
  lastActive: number
}

const sessions = new Map<string, TerminalSession>()

function cleanupInactive() {
  const now = Date.now()
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActive > 30 * 60 * 1000) {
      try { session.pty.kill() } catch {}
      sessions.delete(id)
    }
  }
}

setInterval(cleanupInactive, 60 * 1000)

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const parsed = termSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { action, sessionId, data, rows, cols } = parsed.data

    switch (action) {
      case 'connect': {
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        if (!checkRateLimit(`terminal:${ip}`, 5, 60 * 1000)) {
          return NextResponse.json(
            { success: false, error: 'Too many terminal connections. Try again later.' },
            { status: 429 }
          )
        }
        const shell = process.env.SHELL || '/bin/bash'
        const term = require('node-pty').spawn(shell, [], {
          name: 'xterm-color',
          cols: cols || 80,
          rows: rows || 24,
          cwd: process.env.HOME,
          env: process.env as any,
        })

        const session: TerminalSession = {
          pty: term,
          buffer: '',
          lastActive: Date.now(),
        }

        term.onData((data: string) => {
          session.buffer += data
          if (session.buffer.length > 100000) {
            session.buffer = session.buffer.slice(-50000)
          }
        })

        sessions.set(sessionId, session)

        return NextResponse.json({ success: true })
      }

      case 'input': {
        const session = sessions.get(sessionId)
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          )
        }
        session.lastActive = Date.now()
        session.pty.write(data || '')
        return NextResponse.json({ success: true })
      }

      case 'poll': {
        const session = sessions.get(sessionId)
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          )
        }
        session.lastActive = Date.now()
        const output = session.buffer
        session.buffer = ''
        return NextResponse.json({ success: true, data: { output } })
      }

      case 'resize': {
        const session = sessions.get(sessionId)
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          )
        }
        session.pty.resize(cols || 80, rows || 24)
        return NextResponse.json({ success: true })
      }

      case 'disconnect': {
        const session = sessions.get(sessionId)
        if (session) {
          try { session.pty.kill() } catch {}
          sessions.delete(sessionId)
        }
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    return error?.message?.includes('node-pty')
      ? NextResponse.json(
          { success: false, error: 'Terminal requires node-pty. Ensure it is installed.' },
          { status: 500 }
        )
      : NextResponse.json(
          { success: false, error: 'Terminal error' },
          { status: 500 }
        )
  }
}
