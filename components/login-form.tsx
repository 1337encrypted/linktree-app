"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"

interface LoginFormProps {
  onClose: () => void
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const success = await login(password)
      if (success) {
        onClose()
        setError("")
      } else {
        setError("Invalid password")
      }
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setPassword("")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Admin Login</CardTitle>
          <CardDescription className="text-white/70">Enter password to access admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-white text-black hover:bg-white/90" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
