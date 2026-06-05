import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const parts: string[] = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  return parts.join(' ') || '<1m'
}

export function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleString()
}

export function sanitizeCss(css: string): string {
  let s = css
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
  s = s.replace(/javascript:/gi, '')
  s = s.replace(/url\((?!['"]?(?:data:|https:))[^)]+\)/gi, '')
  s = s.replace(/@import\s+[^;]+;/gi, '')
  s = s.replace(/@tailwind\s+[^;]+;/gi, '')
  s = s.replace(/@custom-variant\s+[^{]+/gi, '')
  s = s.replace(/@theme\s+inline\s*\{[\s\S]*?\}/gi, '')
  s = s.replace(/@apply\s+[^;]+;/gi, '')
  s = s.replace(/@layer\s+\w+\s*\{/gi, '')
  const opens = (s.match(/\{/g) || []).length
  const closes = (s.match(/\}/g) || []).length
  const extra = closes - opens
  for (let i = 0; i < extra; i++) {
    s = s.replace(/\}\s*$/, '')
  }
  s = s.replace(/--font-sans[^;]+;/gi, '')
  s = s.replace(/--font-serif[^;]+;/gi, '')
  s = s.replace(/--font-mono[^;]+;/gi, '')
  s = s.replace(/--shadow-[^;]+;/gi, '')
  s = s.replace(/--tracking-[^;]+;/gi, '')
  s = s.replace(/--spacing[^;]+;/gi, '')
  s = s.trim()
  s = s.slice(0, 32768)
  return s
}

export function generateJwtSecret(): string {
  const crypto = require('crypto')
  return crypto.randomBytes(64).toString('base64')
}
