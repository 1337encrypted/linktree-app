import { NextRequest, NextResponse } from 'next/server'
import { linksDB } from '@/lib/database'

// GET - Fetch all links or by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as 'link' | 'project' | null
    const activeOnly = searchParams.get('activeOnly') === 'true'

    let links
    if (category) {
      links = linksDB.getLinksByCategory(category)
    } else if (activeOnly) {
      links = linksDB.getActiveLinks()
    } else {
      links = linksDB.getAllLinks()
    }

    return NextResponse.json({ success: true, data: links })
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch links' },
      { status: 500 }
    )
  }
}

// POST - Create new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, url, description, icon, isActive = true, category = 'link' } = body

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: 'Title and URL are required' },
        { status: 400 }
      )
    }

    const newLink = linksDB.addLink({
      title,
      url,
      description,
      icon,
      isActive,
      category
    })

    return NextResponse.json({ success: true, data: newLink }, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create link' },
      { status: 500 }
    )
  }
}