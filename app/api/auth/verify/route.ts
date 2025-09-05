import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// GET - Verify authentication status
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 200 }
      )
    }

    try {
      const decoded = verify(token, JWT_SECRET) as { username: string }
      return NextResponse.json({ 
        success: true, 
        authenticated: true,
        username: decoded.username
      })
    } catch {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 200 }
    )
  }
}