"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-static"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ children, redirectTo = "/" }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = redirectTo
    }
  }, [isAuthenticated, redirectTo])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Checking authentication...</div>
      </div>
    )
  }

  return <>{children}</>
}
