'use client'

import { useEffect, useRef, useCallback } from 'react'

interface XTermTerminalProps {
  sessionId: string
}

const POLL_INTERVAL = 100

export function XTermTerminal({ sessionId }: XTermTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<any>(null)
  const fitAddonRef = useRef<any>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resizeRef = useRef<(() => void) | null>(null)

  const sendResize = useCallback(async (cols: number, rows: number) => {
    await fetch('/api/terminal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resize', sessionId, cols, rows }),
    })
  }, [sessionId])

  const connect = useCallback(async () => {
    const res = await fetch('/api/terminal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'connect', sessionId, rows: 40, cols: 120 }),
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
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [sessionId])

  useEffect(() => {
    let mounted = true
    let resizeHandler: (() => void) | null = null

    const init = async () => {
      const result = await connect()
      if (!result.success || !mounted) return

      const termEl = terminalRef.current
      if (!termEl) return

      const { Terminal } = await import('@xterm/xterm')
      const { FitAddon } = await import('@xterm/addon-fit')

      const fitAddon = new FitAddon()
      fitAddonRef.current = fitAddon

      const term = new Terminal({
        cursorBlink: true,
        allowTransparency: true,
        theme: {
          background: 'transparent',
          foreground: '#e5e5e5',
          cursor: '#e5e5e5',
          selectionBackground: '#e5e5e540',
        },
      })

      term.loadAddon(fitAddon)
      term.open(termEl)

      requestAnimationFrame(() => {
        if (fitAddon && termEl) {
          fitAddon.fit()
          const dims = fitAddon.proposeDimensions()
          if (dims) sendResize(dims.cols, dims.rows)
        }
      })

      const handleResize = () => {
        if (fitAddon && term) {
          fitAddon.fit()
          const dims = fitAddon.proposeDimensions()
          if (dims) sendResize(dims.cols, dims.rows)
        }
      }

      resizeHandler = handleResize
      window.addEventListener('resize', handleResize)

      term.onData((data: string) => sendInput(data))

      termRef.current = term
      pollRef.current = setInterval(pollOutput, POLL_INTERVAL)

      setTimeout(() => {
        if (fitAddon) {
          fitAddon.fit()
          const dims = fitAddon.proposeDimensions()
          if (dims) sendResize(dims.cols, dims.rows)
        }
      }, 100)

      term.focus()
    }

    init()

    return () => {
      mounted = false
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      if (pollRef.current) clearInterval(pollRef.current)
      if (termRef.current) {
        termRef.current.dispose()
        termRef.current = null
      }
    }
  }, [connect, sendInput, pollOutput, sendResize])

  return <div ref={terminalRef} className="h-full w-full" />
}
