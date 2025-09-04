import { NextRequest, NextResponse } from 'next/server'
import { linksDB } from '@/lib/database'

// PUT - Update link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = await params

    const success = linksDB.updateLink(id, body)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Link updated successfully' })
  } catch (error) {
    console.error('Error updating link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update link' },
      { status: 500 }
    )
  }
}

// DELETE - Delete link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const success = linksDB.deleteLink(id)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Link deleted successfully' })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete link' },
      { status: 500 }
    )
  }
}