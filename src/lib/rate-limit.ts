const rateLimitMap = new Map<string, number[]>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 10

export function checkRateLimit(key: string, maxAttempts = MAX_ATTEMPTS, windowMs = WINDOW_MS): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  const attempts = rateLimitMap.get(key) || []
  const recent = attempts.filter(t => t > windowStart)

  if (recent.length >= maxAttempts) {
    return false
  }

  recent.push(now)
  rateLimitMap.set(key, recent)

  return true
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key)
}
