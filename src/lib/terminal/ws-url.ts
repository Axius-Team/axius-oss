export async function getWsUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const hostname = window.location.hostname
  const port = process.env.NEXT_PUBLIC_WS_PORT || '8766'
  const base = `${protocol}//${hostname}:${port}/api/terminal/ws`

  try {
    const res = await fetch('/api/auth/ws-token')
    const json = await res.json()
    if (json.success && json.data?.token) {
      return `${base}?token=${encodeURIComponent(json.data.token)}`
    }
  } catch {}

  return base
}
