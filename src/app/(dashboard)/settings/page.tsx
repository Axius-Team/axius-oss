'use client'

import { useState, useEffect } from 'react'
import { SettingsPanel } from '@/src/components/organisms/SettingsPanel'

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const html = document.documentElement
    const isLight = html.classList.contains('light')
    setTheme(isLight ? 'light' : 'dark')
  }, [])

  const handleThemeToggle = () => {
    const html = document.documentElement
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    if (newTheme === 'light') {
      html.classList.add('light')
      html.classList.remove('dark')
    } else {
      html.classList.add('dark')
      html.classList.remove('light')
    }
    fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme_mode: newTheme }),
    }).catch(() => {})
  }

  return <SettingsPanel theme={theme} onThemeToggle={handleThemeToggle} />
}
