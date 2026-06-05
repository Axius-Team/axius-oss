const emailCounts = new Map<string, number[]>()
const MAX_EMAILS = 10
const WINDOW_MS = 60 * 60 * 1000

export function checkEmailRateLimit(): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  const timestamps = emailCounts.get('global') || []
  const recent = timestamps.filter(t => t > windowStart)

  if (recent.length >= MAX_EMAILS) {
    return false
  }

  recent.push(now)
  emailCounts.set('global', recent)

  return true
}

export function resetEmailRateLimit(): void {
  emailCounts.clear()
}
