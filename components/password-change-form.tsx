"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { X } from "lucide-react"

interface PasswordChangeFormProps {
  onClose: () => void
}

export default function PasswordChangeForm({ onClose }: PasswordChangeFormProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { changePassword } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters")
      return
    }

    const success = changePassword(currentPassword, newPassword)
    if (success) {
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } else {
      setError("Current password is incorrect")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-xl p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-medium text-white mb-6">Change Password</h2>

        {success ? (
          <div className="text-center">
            <div className="text-green-400 text-sm mb-2">✓ Password changed successfully!</div>
            <div className="text-white/60 text-xs">Closing...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-white/80 text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                placeholder="Enter current password"
                required
              />
            </div>

            <div>
              <label htmlFor="new-password" className="block text-white/80 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-white/80 text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-lg bg-white text-black hover:bg-white/90 font-medium transition-all duration-200"
              >
                Change Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}