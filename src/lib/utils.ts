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
  let sanitized = css.replace(/<script[\s\S]*?<\/script>/gi, '')
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/url\((?!['"]?(?:data:|https:))[^)]+\)/gi, '')
  sanitized = sanitized.slice(0, 32768)
  return sanitized
}

export function generateJwtSecret(): string {
  const crypto = require('crypto')
  return crypto.randomBytes(64).toString('base64')
}
