import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getSetting } from '@/src/lib/db/settings'
import { sanitizeCss } from '@/src/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Axius OSS',
  description: 'Self-hosted server monitoring for developers',
  icons: { icon: '/axius.ico', apple: '/apple-icon.png' },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let customCss = ''
  let themeMode = 'dark'
  try {
    customCss = getSetting('custom_css') || ''
    themeMode = getSetting('theme_mode') || 'dark'
  } catch {}
  const sanitized = customCss ? sanitizeCss(customCss) : ''

  return (
    <html lang="en" className={themeMode === 'light' ? 'light' : 'dark'} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {sanitized && (
          <style id="axius-custom-theme">{sanitized}</style>
        )}
        {children}
      </body>
    </html>
  )
}
