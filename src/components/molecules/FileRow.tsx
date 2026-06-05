'use client'

import { File, Folder, ChevronRight } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { formatBytes } from '@/src/lib/utils'

interface FileItem {
  name: string
  path: string
  type: 'file' | 'directory'
  size: number
  modified: string
}

interface FileRowProps {
  item: FileItem
  onNavigate: (path: string) => void
  onSelect: (path: string) => void
  isSelected?: boolean
}

export function FileRow({ item, onNavigate, onSelect, isSelected }: FileRowProps) {
  const handleClick = () => {
    if (item.type === 'directory') {
      onNavigate(item.path)
    } else {
      onSelect(item.path)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-accent',
        isSelected && 'bg-accent'
      )}
    >
      {item.type === 'directory' ? (
        <Folder className="h-5 w-5 text-blue-400 shrink-0" />
      ) : (
        <File className="h-5 w-5 text-muted-foreground shrink-0" />
      )}
      <span className="flex-1 truncate text-sm">{item.name}</span>
      {item.type === 'file' && (
        <span className="text-xs text-muted-foreground shrink-0">
          {formatBytes(item.size)}
        </span>
      )}
      {item.type === 'directory' && (
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
    </div>
  )
}
