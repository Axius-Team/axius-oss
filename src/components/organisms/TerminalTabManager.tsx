'use client'

import { useState } from 'react'
import { XTermTerminal } from '@/src/components/organisms/XTermTerminal'
import { Button } from '@/src/components/ui/button'
import { Plus, X } from 'lucide-react'

interface TerminalTab {
  id: string
  label: string
}

export function TerminalTabManager() {
  const [tabs, setTabs] = useState<TerminalTab[]>([{ id: 'main', label: 'Terminal 1' }])
  const [activeTab, setActiveTab] = useState('main')

  const addTab = () => {
    const id = `term-${Date.now()}`
    setTabs([...tabs, { id, label: `Terminal ${tabs.length + 1}` }])
    setActiveTab(id)
  }

  const closeTab = (id: string) => {
    const remaining = tabs.filter(t => t.id !== id)
    if (remaining.length === 0) return
    setTabs(remaining)
    if (activeTab === id) {
      setActiveTab(remaining[remaining.length - 1].id)
    }
  }

  return (
    <div className="flex flex-col h-full rounded-lg border overflow-hidden">
      <div className="flex items-center bg-muted/50 border-b">
        <div className="flex-1 flex overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer border-r border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary bg-background'
                  : 'border-transparent hover:bg-muted'
              }`}
            >
              <span>{tab.label}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={addTab} className="shrink-0 mr-1">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`h-full ${activeTab === tab.id ? 'block' : 'hidden'}`}
          >
            <XTermTerminal sessionId={tab.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
