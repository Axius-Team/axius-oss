'use client'

import { useState } from 'react'
import { Sidebar } from '@/src/components/organisms/Sidebar'
import { MobileDock } from '@/src/components/organisms/MobileDock'
import { Toaster } from '@/src/components/ui/toaster'

interface DashboardShellProps {
  children: React.ReactNode
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

export function DashboardShell({ children, theme, onThemeToggle }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        theme={theme}
        onThemeToggle={onThemeToggle}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        {children}
      </main>
      <MobileDock />
      <Toaster />
    </div>
  )
}
