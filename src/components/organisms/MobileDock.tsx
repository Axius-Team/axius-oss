'use client'

import { Activity, Container, FileCode, Terminal, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils'

const dockItems = [
  { href: '/monitoring', label: 'Monitor', icon: Activity },
  { href: '/docker', label: 'Docker', icon: Container },
  { href: '/files', label: 'Files', icon: FileCode },
  { href: '/terminal', label: 'Terminal', icon: Terminal },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function MobileDock() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {dockItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
