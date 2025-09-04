import { NextRequest, NextResponse } from 'next/server'
import { linksDB } from '@/lib/database'

// POST - Reorder links
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { linkIds } = body

    if (!Array.isArray(linkIds)) {
      return NextResponse.json(
        { success: false, error: 'linkIds must be an array' },
        { status: 400 }
      )
    }

    const success = linksDB.reorderLinks(linkIds)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to reorder links' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Links reordered successfully' })
  } catch (error) {
    console.error('Error reordering links:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reorder links' },
      { status: 500 }
    )
  }
}