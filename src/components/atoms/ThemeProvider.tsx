'use client'

import { useEffect, useRef } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const injected = useRef(false)

  useEffect(() => {
    if (injected.current) return
    injected.current = true

    fetch('/api/theme')
      .then(r => r.json())
      .then(json => {
        if (!json.success) return
        const css = json.data?.css || ''
        if (!css.trim()) return

        let styleTag = document.getElementById('axius-custom-theme') as HTMLStyleElement | null
        if (styleTag) {
          if (styleTag.innerHTML !== css) {
            styleTag.innerHTML = css
          }
        } else {
          const style = document.createElement('style')
          style.id = 'axius-custom-theme'
          style.innerHTML = css
          document.head.appendChild(style)
        }
      })
      .catch(() => {})
  }, [])

  return <>{children}</>
}
