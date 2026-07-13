import type { WebSocket } from 'ws'

const activeSessions = new Map<string, { pty: any }>()

export function handleTerminalWS(ws: WebSocket, userId: number): void {
  const sessionId = `ws-${userId}-${Date.now()}`
  let pty: any = null

  try {
    const nodePty = require('node-pty')
    const shell = process.env.SHELL || '/bin/bash'
    pty = nodePty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env as any,
    })
  } catch (error: any) {
    ws.send(
      JSON.stringify({
        type: 'error',
        message: error?.message?.includes('node-pty')
          ? 'Terminal requires node-pty. Ensure it is installed.'
          : 'Failed to spawn terminal session',
      })
    )
    ws.close(1011)
    return
  }

  activeSessions.set(sessionId, { pty })

  ws.send(JSON.stringify({ type: 'connected', sessionId }))

  pty.onData((data: string) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'output', data }))
    }
  })

  pty.onExit(() => {
    ws.close(1000, 'Session ended')
  })

  let lastMessageTime = 0
  let rateLimitWarningSent = false

  ws.on('message', (raw: Buffer) => {
    try {
      const msg = JSON.parse(raw.toString())

      const now = Date.now()
      if (now - lastMessageTime < 20) {
        if (!rateLimitWarningSent) {
          ws.send(JSON.stringify({ type: 'error', message: 'Rate limited' }))
          rateLimitWarningSent = true
        }
        return
      }
      lastMessageTime = now
      rateLimitWarningSent = false

      switch (msg.action) {
        case 'input':
          if (msg.data && pty) pty.write(msg.data)
          break
        case 'resize':
          if (pty && msg.cols && msg.rows) {
            pty.resize(msg.cols, msg.rows)
          }
          break
      }
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message' }))
    }
  })

  ws.on('close', () => {
    if (pty) {
      try {
        pty.kill()
      } catch {}
    }
    activeSessions.delete(sessionId)
  })

  ws.on('error', () => {
    if (pty) {
      try {
        pty.kill()
      } catch {}
    }
    activeSessions.delete(sessionId)
  })
}
