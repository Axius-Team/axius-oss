import { NextRequest, NextResponse } from 'next/server'
import { getSetting, setSetting } from '@/src/lib/db/settings'
import { sanitizeCss } from '@/src/lib/utils'
import { z } from 'zod'

const themeSchema = z.object({
  css: z.string().max(32768),
})

export async function GET() {
  try {
    const css = getSetting('custom_css') || ''
    return NextResponse.json({ success: true, data: { css } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load theme' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const parsed = themeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const sanitized = sanitizeCss(parsed.data.css)

    if (sanitized && !sanitized.includes(':')) {
      return NextResponse.json(
        { success: false, error: 'CSS must contain at least one variable declaration' },
        { status: 400 }
      )
    }

    setSetting('custom_css', sanitized)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to save theme' },
      { status: 500 }
    )
  }
}
