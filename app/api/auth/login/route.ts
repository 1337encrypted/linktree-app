import { NextRequest, NextResponse } from 'next/server'
import { adminAuthDB } from '@/lib/database'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// POST - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    // Verify password against database
    const isValid = adminAuthDB.verifyLogin(password)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = sign(
      { username: 'admin', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Set httpOnly cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful' 
    })
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}