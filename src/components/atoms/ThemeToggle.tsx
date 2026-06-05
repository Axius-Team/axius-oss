'use client'

import { Sun, Moon } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
