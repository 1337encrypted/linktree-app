import { NextResponse } from 'next/server'
import { linksDB, adminAuthDB } from '@/lib/database'

// POST - Initialize database with seed data
export async function POST() {
  try {
    // Initialize admin authentication
    adminAuthDB.initializeAdmin()
    
    // Seed initial data
    linksDB.seedInitialData()

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully with admin authentication' 
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}

// GET - Check database status
export async function GET() {
  try {
    const links = linksDB.getAllLinks()
    return NextResponse.json({ 
      success: true, 
      initialized: links.length > 0,
      count: links.length
    })
  } catch (error) {
    console.error('Error checking database status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check database status' },
      { status: 500 }
    )
  }
}