'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/src/components/ui/textarea'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'
import { toast } from '@/src/hooks/use-toast'
import { sanitizeCss } from '@/src/lib/utils'

const MAX_CSS_SIZE = 32768

function analyzeBlockCoverage(css: string): { hasRoot: boolean; hasDark: boolean; hasLight: boolean } {
  return {
    hasRoot: /(?:^|\s):root\s*\{/.test(css),
    hasDark: /(?:^|\s)\.dark\s*\{/.test(css),
    hasLight: /(?:^|\s)\.light\s*\{/.test(css),
  }
}

export function ThemeEditor() {
  const [css, setCss] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/theme')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.css) {
          setCss(json.data.css)
        }
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setError(null)
    setWarning(null)

    if (css.length > MAX_CSS_SIZE) {
      setError(`CSS exceeds maximum size of ${MAX_CSS_SIZE / 1024} KB`)
      return
    }

    if (css.trim() && !css.includes(':')) {
      setError('CSS must contain at least one variable declaration')
      return
    }

    const sanitized = sanitizeCss(css)

    const coverage = analyzeBlockCoverage(sanitized)
    if (!coverage.hasRoot && !coverage.hasLight && coverage.hasDark) {
      setWarning(
        'This theme only defines dark mode colors (.dark block). ' +
        'Light mode will use the default color palette. ' +
        'To fully customize both modes, export a complete theme from tweakcn.com ' +
        'that includes both :root (light) and .dark (dark) blocks.'
      )
    } else if (!coverage.hasDark && !coverage.hasLight && coverage.hasRoot) {
      setWarning(
        'This theme only defines light mode colors (:root block). ' +
        'Dark mode will use the default color palette. ' +
        'To fully customize both modes, export a complete theme from tweakcn.com ' +
        'that includes both :root (light) and .dark (dark) blocks.'
      )
    }

    let styleTag = document.getElementById('axius-custom-theme') as HTMLStyleElement | null
    if (styleTag) {
      styleTag.innerHTML = sanitized
    } else {
      styleTag = document.createElement('style')
      styleTag.id = 'axius-custom-theme'
      styleTag.innerHTML = sanitized
      document.head.appendChild(styleTag)
    }

    const res = await fetch('/api/theme', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ css: sanitized }),
    })
    const json = await res.json()
    if (json.success) {
      toast({ title: 'Theme saved' })
    } else {
      setError(json.error || 'Failed to save theme')
      toast({ title: json.error || 'Failed to save theme', variant: 'destructive' })
    }
  }

  const handleReset = async () => {
    setCss('')
    setError(null)
    setWarning(null)
    const res = await fetch('/api/theme', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ css: '' }),
    })
    const json = await res.json()
    if (json.success) {
      const styleTag = document.getElementById('axius-custom-theme')
      if (styleTag) styleTag.innerHTML = ''
      toast({ title: 'Theme reset to defaults' })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Custom Theme CSS</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Paste a CSS snippet from tweakcn.com to customize the theme.
          The snippet should include both <code>:root</code> (light mode) and
          {' '}<code>.dark</code> (dark mode) blocks for full coverage.
        </p>
      </div>

      <Textarea
        value={css}
        onChange={(e) => { setCss(e.target.value); setError(null); setWarning(null) }}
        placeholder=":root { --background: 0 0% 100%; ... } .dark { --background: 0 0% 7%; ... }"
        className="font-mono text-sm min-h-[200px]"
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {warning && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">{warning}</p>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSave}>Save Theme</Button>
        <Button variant="outline" onClick={handleReset}>Reset to Defaults</Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Max {MAX_CSS_SIZE / 1024} KB. Supports :root and @layer base blocks.
      </p>
    </div>
  )
}
