'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/src/components/templates/DashboardShell'
import { LoadingSpinner } from '@/src/components/atoms/LoadingSpinner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [checking, setChecking] = useState(true)

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session')
      const json = await res.json()
      if (!json.success || !json.data?.authenticated) {
        router.push('/login')
        return
      }
    } catch {
      router.push('/login')
      return
    }
    setChecking(false)
  }, [router])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    const html = document.documentElement
    if (theme === 'light') {
      html.classList.add('light')
      html.classList.remove('dark')
    } else {
      html.classList.add('dark')
      html.classList.remove('light')
    }
    fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme_mode: theme }),
    }).catch(() => {})
  }, [theme])

  const handleThemeToggle = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <DashboardShell theme={theme} onThemeToggle={handleThemeToggle}>
      {children}
    </DashboardShell>
  )
}
