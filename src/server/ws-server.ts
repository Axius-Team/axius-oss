import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { verifyToken } from '../lib/auth/session'
import { checkRateLimit } from '../lib/rate-limit'
import { handleTerminalWS } from '../lib/terminal/ws-handler'

const WS_PORT = parseInt(process.env.WS_PORT || '8766', 10)

const server = createServer()

server.setTimeout(10000)

const wss = new WebSocketServer({ server, path: '/api/terminal/ws' })

wss.on('connection', (ws, req) => {
  const ip =
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'unknown'

  if (!checkRateLimit(`ws-terminal:${ip}`, 5, 60 * 1000)) {
    ws.close(4003, 'Too many connections')
    return
  }

  const cookie = req.headers.cookie || ''
  const cookieMatch = cookie.match(/(?:^|;\s*)axius_session=([^;]+)/)
  let token = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null

  if (!token && req.url) {
    const url = new URL(req.url, 'http://localhost')
    token = url.searchParams.get('token')
  }

  if (!token) {
    ws.close(4001, 'Unauthorized')
    return
  }

  const session = verifyToken(token)
  if (!session) {
    ws.close(4001, 'Unauthorized')
    return
  }

  handleTerminalWS(ws, session.userId)
})

server.listen(WS_PORT, () => {
  console.log(`[ws-server] listening on port ${WS_PORT}`)
})
