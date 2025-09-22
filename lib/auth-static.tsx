"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for auth status in static deployment
    const authStatus = localStorage.getItem('isAuthenticated')
    setIsAuthenticated(authStatus === 'true')
    setLoading(false)
  }, [])

  const login = async (password: string): Promise<boolean> => {
    // Simple password check for static deployment (admin123)
    if (password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      return true
    }
    return false
  }

  const logout = async () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Disabled in static deployment
    console.log('Change password is disabled in static deployment')
    return false
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}