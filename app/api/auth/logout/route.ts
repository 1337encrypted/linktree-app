import { NextResponse } from 'next/server'

// POST - Admin logout
export async function POST() {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logout successful' 
    })
    
    // Clear the httpOnly cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    })

    return response
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}