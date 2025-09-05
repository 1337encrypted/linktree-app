"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LogoContextType {
  logoUrl: string | null
  setLogo: (url: string | null) => void
  uploadLogo: (file: File) => Promise<string>
  isLoading: boolean
}

const LogoContext = createContext<LogoContextType | undefined>(undefined)

export function LogoProvider({ children }: { children: ReactNode }) {
  const [logoUrl, setLogoUrl] = useState<string | null>("/assets/images/gridflow.png")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load logo from localStorage, fallback to default GridFlow logo
    const savedLogo = localStorage.getItem("linktree-logo")
    if (savedLogo) {
      setLogoUrl(savedLogo)
    } else {
      setLogoUrl("/assets/images/gridflow.png")
    }
    setIsLoading(false)
  }, [])

  const setLogo = (url: string | null) => {
    setLogoUrl(url)
    if (url) {
      localStorage.setItem("linktree-logo", url)
    } else {
      localStorage.removeItem("linktree-logo")
    }
  }

  const uploadLogo = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file'))
        return
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Image file size must be less than 5MB'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setLogo(dataUrl)
        resolve(dataUrl)
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  return (
    <LogoContext.Provider value={{ logoUrl, setLogo, uploadLogo, isLoading }}>
      {children}
    </LogoContext.Provider>
  )
}

export function useLogo() {
  const context = useContext(LogoContext)
  if (context === undefined) {
    throw new Error("useLogo must be used within a LogoProvider")
  }
  return context
}