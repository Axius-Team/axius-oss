import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/src/lib/db/client'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const db = getDb()
    const id = parseInt(idStr, 10)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      )
    }

    db.prepare('DELETE FROM notification_rules WHERE id = ?').run(id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete rule' },
      { status: 500 }
    )
  }
}
