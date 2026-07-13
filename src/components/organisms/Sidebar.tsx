'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Activity, Container, FileCode, Terminal, Settings, X, PanelLeftClose, ChevronRight, FolderOpen } from 'lucide-react'
import { NavItem } from '@/src/components/molecules/NavItem'
import { ThemeToggle } from '@/src/components/atoms/ThemeToggle'
import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'

interface SidebarProps {
  theme: 'light' | 'dark'
  onThemeToggle: () => void
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

function NavIcon({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
  const pathname = usePathname()
  const active = pathname.startsWith(href)
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
      title={label}
    >
      {icon}
    </Link>
  )
}

export function Sidebar({ theme, onThemeToggle, isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 bg-sidebar transform transition-all duration-200 md:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          <div className={cn('flex items-center', collapsed ? 'justify-center p-3' : 'gap-3 p-4')}>
            <Image
              src={theme === 'dark' ? '/images/axius-icon-white.png' : '/images/axius-icon-black.png'}
              alt="Axius"
              width={20}
              height={20}
              className="shrink-0"
            />
            {!collapsed && (
              <>
                <h1 className="text-lg font-semibold">Axius</h1>
                <div className="ml-auto">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </div>

          <nav className={cn('flex-1 p-3', collapsed ? 'flex flex-col items-center gap-1' : 'space-y-1')}>
            {collapsed ? (
              <>
                <NavIcon href="/monitoring" icon={<Activity className="h-5 w-5" />} label="Monitoring" onClick={onClose} />
                <NavIcon href="/docker" icon={<Container className="h-5 w-5" />} label="Docker" onClick={onClose} />
                <NavIcon href="/files" icon={<FolderOpen className="h-5 w-5" />} label="File Explorer" onClick={onClose} />
                <NavIcon href="/terminal" icon={<Terminal className="h-5 w-5" />} label="Terminal" onClick={onClose} />
                <NavIcon href="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" onClick={onClose} />
              </>
            ) : (
              <>
                <NavItem href="/monitoring" label="Monitoring" icon={<Activity className="h-5 w-5" />} onClick={onClose} />
                <NavItem href="/docker" label="Docker" icon={<Container className="h-5 w-5" />} onClick={onClose} />
                <NavItem href="/files" label="File Explorer" icon={<FolderOpen className="h-5 w-5" />} onClick={onClose} />
                <NavItem href="/terminal" label="Terminal" icon={<Terminal className="h-5 w-5" />} onClick={onClose} />
                <NavItem href="/settings" label="Settings" icon={<Settings className="h-5 w-5" />} onClick={onClose} />
              </>
            )}
          </nav>

          <div className={cn(collapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3 flex items-center justify-between')}>
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <Button variant="ghost" size="icon" onClick={onToggleCollapse} title={collapsed ? 'Expand' : 'Collapse'}>
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
