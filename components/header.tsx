"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-static"
import { useLogo } from "@/lib/logo"
import LoginForm from "./login-form"
import PasswordChangeForm from "./password-change-form"
import { ThemeDropdown } from "./theme-dropdown"
import { Upload, Settings } from "lucide-react"

export default function Header() {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showThemeDropdown, setShowThemeDropdown] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isAuthenticated, logout } = useAuth()
  const { logoUrl, uploadLogo, setLogo } = useLogo()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await uploadLogo(file)
    } catch (error) {
      console.error('Logo upload failed:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload logo')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAuthenticated) {
      fileInputRef.current?.click()
    } else {
      setShowThemeDropdown(!showThemeDropdown)
    }
  }

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLogo("/assets/images/gridflow.png")
  }

  return (
    <>
      <header className="relative z-20 flex items-center justify-between p-6">
        {/* Logo */}
        <div className="flex items-center relative">
          <div 
            onClick={handleLogoClick}
            className={`relative flex items-center group ${!isAuthenticated ? 'cursor-pointer' : 'cursor-pointer'}`}
            title={isAuthenticated ? "Upload logo" : "Change theme"}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={!isAuthenticated}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
            <div className="flex items-center">
              <div className="relative">
                <Image
                  src={logoUrl || "/assets/images/gridflow.png"}
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto max-w-[120px] object-contain"
                />
                {isAuthenticated && logoUrl && logoUrl !== "/assets/images/gridflow.png" && (
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                    title="Remove logo"
                  >
                    ×
                  </button>
                )}
                {isAuthenticated && (!logoUrl || logoUrl === "/assets/images/gridflow.png") && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Upload className="w-2 h-2" />
                  </div>
                )}
              </div>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Theme Dropdown */}
          <ThemeDropdown 
            isOpen={showThemeDropdown} 
            onClose={() => setShowThemeDropdown(false)} 
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          <Link
            href="/"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Links
          </Link>
          <Link
            href="/projects"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Projects
          </Link>
        </nav>

        {/* Login/Logout Button */}
        <div className="relative">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPasswordForm(true)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all duration-200 flex items-center justify-center"
                title="Change Password"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => logout()}
                className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-sm transition-all duration-300 hover:bg-white/90 cursor-pointer flex items-center"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginForm(true)}
              className="group relative w-24 h-10 rounded-full bg-white text-black font-medium text-sm transition-all duration-300 hover:bg-white/90 cursor-pointer flex items-center justify-center overflow-hidden"
            >
              {/* Arrow Icon - slides in from left */}
              <div className="absolute left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center transform -translate-x-8 group-hover:translate-x-0 transition-transform duration-300 z-10">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
              
              {/* Login Text - slides to right */}
              <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300 z-10">
                Login
              </span>
            </button>
          )}
        </div>
      </header>

      {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
      {showPasswordForm && <PasswordChangeForm onClose={() => setShowPasswordForm(false)} />}
    </>
  )
}
