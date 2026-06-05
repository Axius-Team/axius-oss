'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils'

interface NavItemProps {
  href: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
}

export function NavItem({ href, label, icon, onClick }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
