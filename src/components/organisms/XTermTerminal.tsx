'use client'

import { useEffect, useRef, useCallback } from 'react'

interface XTermTerminalProps {
  sessionId: string
}

const POLL_INTERVAL = 100
const ROWS = 24
const COLS = 80

export function XTermTerminal({ sessionId }: XTermTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<any>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const connect = useCallback(async () => {
    const res = await fetch('/api/terminal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'connect', sessionId, rows: ROWS, cols: COLS }),
    })
    return res.json()
  }, [sessionId])

  const sendInput = useCallback(async (data: string) => {
    await fetch('/api/terminal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'input', sessionId, data }),
    })
  }, [sessionId])

  const pollOutput = useCallback(async () => {
    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'poll', sessionId }),
      })
      const json = await res.json()
      if (json.success && json.data?.output && termRef.current) {
        termRef.current.write(json.data.output)
      }
    } catch {
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
    }
  }, [sessionId])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const result = await connect()
      if (!result.success || !mounted) return

      const termEl = terminalRef.current
      if (!termEl) return

      const { Terminal } = await import('@xterm/xterm')
      const { FitAddon } = await import('@xterm/addon-fit')

      const term = new Terminal({
        rows: ROWS,
        cols: COLS,
        cursorBlink: true,
        theme: {
          background: '#0a0a0a',
          foreground: '#e5e5e5',
          cursor: '#22c55e',
          selectionBackground: '#22c55e40',
        },
      })

      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)

      term.open(termEl)
      fitAddon.fit()

      term.onData((data: string) => {
        sendInput(data)
      })

      termRef.current = term
      pollRef.current = setInterval(pollOutput, POLL_INTERVAL)

      term.focus()
    }

    init()

    return () => {
      mounted = false
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
      if (termRef.current) {
        termRef.current.dispose()
        termRef.current = null
      }
    }
  }, [connect, sendInput, pollOutput])

  return <div ref={terminalRef} className="h-full w-full" />
}
