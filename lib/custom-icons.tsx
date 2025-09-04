"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CustomIcon } from "./types"

interface CustomIconsContextType {
  customIcons: CustomIcon[]
  addIcon: (file: File) => Promise<CustomIcon>
  deleteIcon: (id: string) => void
  isLoading: boolean
}

const CustomIconsContext = createContext<CustomIconsContextType | undefined>(undefined)

const validateSVG = (svgContent: string): boolean => {
  // Basic SVG validation
  const svgRegex = /<svg[^>]*>[\s\S]*<\/svg>/i
  return svgRegex.test(svgContent.trim())
}

const optimizeSVG = (svgContent: string): string => {
  // Basic SVG optimization - remove comments, excess whitespace, and ensure proper sizing
  return svgContent
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/width="[^"]*"/g, 'width="24"') // Normalize width
    .replace(/height="[^"]*"/g, 'height="24"') // Normalize height
    .trim()
}

export function CustomIconsProvider({ children }: { children: ReactNode }) {
  const [customIcons, setCustomIcons] = useState<CustomIcon[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load custom icons from localStorage
    const savedIcons = localStorage.getItem("linktree-custom-icons")
    if (savedIcons) {
      try {
        const parsedIcons = JSON.parse(savedIcons)
        setCustomIcons(parsedIcons)
      } catch (error) {
        console.error("Error parsing saved custom icons:", error)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Save custom icons to localStorage whenever they change
    if (customIcons.length >= 0) {
      localStorage.setItem("linktree-custom-icons", JSON.stringify(customIcons))
    }
  }, [customIcons])

  const addIcon = async (file: File): Promise<CustomIcon> => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
        reject(new Error('Please select a valid SVG file'))
        return
      }

      // Validate file size (100KB limit for SVGs)
      if (file.size > 100 * 1024) {
        reject(new Error('SVG file size must be less than 100KB'))
        return
      }

      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const svgContent = e.target?.result as string
          
          // Validate SVG content
          if (!validateSVG(svgContent)) {
            reject(new Error('Invalid SVG file format'))
            return
          }

          // Optimize SVG
          const optimizedSVG = optimizeSVG(svgContent)
          
          // Create data URL for display
          const dataUrl = `data:image/svg+xml;base64,${btoa(optimizedSVG)}`
          
          const newIcon: CustomIcon = {
            id: Date.now().toString(),
            name: file.name.replace('.svg', ''),
            svgContent: optimizedSVG,
            dataUrl,
            createdAt: new Date().toISOString()
          }

          setCustomIcons(prev => [...prev, newIcon])
          resolve(newIcon)
        } catch {
          reject(new Error('Failed to process SVG file'))
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  const deleteIcon = (id: string) => {
    setCustomIcons(prev => prev.filter(icon => icon.id !== id))
  }

  return (
    <CustomIconsContext.Provider value={{ 
      customIcons, 
      addIcon, 
      deleteIcon, 
      isLoading 
    }}>
      {children}
    </CustomIconsContext.Provider>
  )
}

export function useCustomIcons() {
  const context = useContext(CustomIconsContext)
  if (context === undefined) {
    throw new Error("useCustomIcons must be used within a CustomIconsProvider")
  }
  return context
}