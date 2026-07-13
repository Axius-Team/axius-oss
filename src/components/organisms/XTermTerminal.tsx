'use client'

import { useEffect, useRef } from 'react'
import { getWsUrl } from '@/src/lib/terminal/ws-url'
import '@xterm/xterm/css/xterm.css'

interface XTermTerminalProps {
  sessionId: string
}

export function XTermTerminal({ sessionId }: XTermTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<any>(null)
  const fitAddonRef = useRef<any>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    let mounted = true
    let resizeHandler: (() => void) | null = null
    let ws: WebSocket | null = null
    const termEl = terminalRef.current
    if (!termEl) return

    const init = async () => {
      const url = await getWsUrl()
      if (!mounted) return

      ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = async () => {
        if (!mounted) return

        const { Terminal } = await import('@xterm/xterm')
        const { FitAddon } = await import('@xterm/addon-fit')

        const fitAddon = new FitAddon()
        fitAddonRef.current = fitAddon

        const style = getComputedStyle(document.documentElement)
        const fg = style.getPropertyValue('--foreground').trim() || '#e5e5e5'
        const cursorColor = style.getPropertyValue('--foreground').trim() || '#e5e5e5'

        const term = new Terminal({
          cursorBlink: true,
          allowTransparency: true,
          theme: {
            background: 'transparent',
            foreground: fg,
            cursor: cursorColor,
            selectionBackground: fg ? `${fg}40` : '#e5e5e540',
          },
        })

        term.loadAddon(fitAddon)
        term.open(termEl)
        termRef.current = term

        const sendResize = () => {
          if (fitAddon && termEl) {
            fitAddon.fit()
            const dims = fitAddon.proposeDimensions()
            if (dims && ws && ws.readyState === ws.OPEN) {
              ws.send(
                JSON.stringify({
                  action: 'resize',
                  cols: dims.cols,
                  rows: dims.rows,
                })
              )
            }
          }
        }

        requestAnimationFrame(sendResize)

        const handleResize = () => sendResize()
        resizeHandler = handleResize
        window.addEventListener('resize', handleResize)

        term.onData((data: string) => {
          if (ws && ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ action: 'input', data }))
          }
        })

        term.focus()
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'output' && termRef.current) {
            termRef.current.write(msg.data)
          }
        } catch {}
      }

      ws.onclose = () => {
        if (termRef.current) {
          termRef.current.dispose()
          termRef.current = null
        }
      }
    }

    init()

    return () => {
      mounted = false
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler)
      }
      if (termRef.current) {
        termRef.current.dispose()
        termRef.current = null
      }
      if (ws && (ws.readyState === ws.OPEN || ws.readyState === ws.CONNECTING)) {
        ws.close()
      }
    }
  }, [sessionId])

  return <div ref={terminalRef} className="h-full w-full" />
}
