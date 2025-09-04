"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default password for localhost - can be changed via changePassword
const DEFAULT_PASSWORD = "admin123"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in (localStorage for localhost)
    const authStatus = localStorage.getItem("linktree-auth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const getCurrentPassword = (): string => {
    return localStorage.getItem("linktree-password") || DEFAULT_PASSWORD
  }

  const login = (password: string): boolean => {
    const currentPassword = getCurrentPassword()
    if (password === currentPassword) {
      setIsAuthenticated(true)
      localStorage.setItem("linktree-auth", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("linktree-auth")
  }

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    const storedPassword = getCurrentPassword()
    if (currentPassword === storedPassword) {
      localStorage.setItem("linktree-password", newPassword)
      return true
    }
    return false
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
