'use client'

import dynamic from 'next/dynamic'

const TerminalTabManager = dynamic(
  () => import('@/src/components/organisms/TerminalTabManager').then(m => m.TerminalTabManager),
  { ssr: false }
)

export default function TerminalPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Terminal</h2>
        <p className="text-muted-foreground">Local shell access</p>
      </div>
      <div className="flex-1">
        <TerminalTabManager />
      </div>
    </div>
  )
}
