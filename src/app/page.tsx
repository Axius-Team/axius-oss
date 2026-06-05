'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/src/components/atoms/LoadingSpinner'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    fetch('/api/setup')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.setupComplete) {
          router.push('/login')
        } else {
          router.push('/setup')
        }
      })
      .catch(() => router.push('/setup'))
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
