"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface BackgroundTheme {
  id: string
  name: string
  description: string
  meshGradients: Array<{
    colors: string[]
    speed: number
    opacity?: number
    className?: string
  }>
}

const backgroundThemes: BackgroundTheme[] = [
  {
    id: "default",
    name: "Purple Dreams",
    description: "Deep purples and violets with white accents",
    meshGradients: [
      {
        colors: ["#000000", "#8b5cf6", "#ffffff", "#1e1b4b", "#4c1d95"],
        speed: 0.3,
        className: "absolute inset-0 w-full h-full"
      },
      {
        colors: ["#000000", "#ffffff", "#8b5cf6", "#000000"],
        speed: 0.2,
        opacity: 60,
        className: "absolute inset-0 w-full h-full opacity-60"
      }
    ]
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    description: "Blue gradients with teal and cyan",
    meshGradients: [
      {
        colors: ["#000000", "#0891b2", "#06b6d4", "#164e63", "#0c4a6e"],
        speed: 0.25,
        className: "absolute inset-0 w-full h-full"
      },
      {
        colors: ["#000000", "#67e8f9", "#0891b2", "#000000"],
        speed: 0.15,
        opacity: 50,
        className: "absolute inset-0 w-full h-full opacity-50"
      }
    ]
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    description: "Warm oranges, pinks, and reds",
    meshGradients: [
      {
        colors: ["#000000", "#f97316", "#ec4899", "#7c2d12", "#be185d"],
        speed: 0.35,
        className: "absolute inset-0 w-full h-full"
      },
      {
        colors: ["#000000", "#fbbf24", "#f97316", "#000000"],
        speed: 0.2,
        opacity: 45,
        className: "absolute inset-0 w-full h-full opacity-45"
      }
    ]
  },
  {
    id: "forest",
    name: "Forest Mist",
    description: "Deep greens with emerald highlights",
    meshGradients: [
      {
        colors: ["#000000", "#059669", "#10b981", "#064e3b", "#065f46"],
        speed: 0.2,
        className: "absolute inset-0 w-full h-full"
      },
      {
        colors: ["#000000", "#6ee7b7", "#059669", "#000000"],
        speed: 0.15,
        opacity: 40,
        className: "absolute inset-0 w-full h-full opacity-40"
      }
    ]
  },
  {
    id: "cosmic",
    name: "Cosmic Void",
    description: "Deep space with purple and pink nebula",
    meshGradients: [
      {
        colors: ["#000000", "#7c3aed", "#db2777", "#312e81", "#581c87"],
        speed: 0.15,
        className: "absolute inset-0 w-full h-full"
      },
      {
        colors: ["#000000", "#a855f7", "#ec4899", "#000000"],
        speed: 0.1,
        opacity: 35,
        className: "absolute inset-0 w-full h-full opacity-35"
      }
    ]
  },
  {
    id: "minimal",
    name: "Minimal Dark",
    description: "Simple dark background with subtle movement",
    meshGradients: [
      {
        colors: ["#000000", "#1f2937", "#374151", "#111827", "#1f2937"],
        speed: 0.1,
        className: "absolute inset-0 w-full h-full"
      },
      {
        colors: ["#000000", "#4b5563", "#1f2937", "#000000"],
        speed: 0.05,
        opacity: 30,
        className: "absolute inset-0 w-full h-full opacity-30"
      }
    ]
  }
]

interface BackgroundThemeContextType {
  currentTheme: BackgroundTheme
  setTheme: (themeId: string) => void
  availableThemes: BackgroundTheme[]
}

const BackgroundThemeContext = createContext<BackgroundThemeContextType | undefined>(undefined)

export function BackgroundThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<BackgroundTheme>(backgroundThemes[0])

  useEffect(() => {
    // Load theme from localStorage
    const savedThemeId = localStorage.getItem("linktree-background-theme")
    if (savedThemeId) {
      const theme = backgroundThemes.find(t => t.id === savedThemeId)
      if (theme) {
        setCurrentTheme(theme)
      }
    }
  }, [])

  const setTheme = (themeId: string) => {
    const theme = backgroundThemes.find(t => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      localStorage.setItem("linktree-background-theme", themeId)
    }
  }

  return (
    <BackgroundThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      availableThemes: backgroundThemes 
    }}>
      {children}
    </BackgroundThemeContext.Provider>
  )
}

export function useBackgroundTheme() {
  const context = useContext(BackgroundThemeContext)
  if (context === undefined) {
    throw new Error("useBackgroundTheme must be used within a BackgroundThemeProvider")
  }
  return context
}