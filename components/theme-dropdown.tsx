"use client"

import { useRef, useEffect } from "react"
import { useBackgroundTheme } from "@/lib/background-themes"
import { Palette } from "lucide-react"

interface ThemeDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function ThemeDropdown({ isOpen, onClose }: ThemeDropdownProps) {
  const { currentTheme, setTheme, availableThemes } = useBackgroundTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-16 left-0 z-50 w-72 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-white/70" />
          <h3 className="text-white font-medium text-sm">Background Themes</h3>
        </div>
        <p className="text-white/60 text-xs mt-1">Choose your preferred background</p>
      </div>

      {/* Theme Options */}
      <div className="max-h-80 overflow-y-auto">
        {availableThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => {
              setTheme(theme.id)
              onClose()
            }}
            className={`w-full p-4 text-left transition-all duration-200 hover:bg-white/10 ${
              currentTheme.id === theme.id ? 'bg-white/10' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{theme.name}</div>
                <div className="text-white/60 text-xs mt-1">{theme.description}</div>
              </div>
              
              {/* Theme Preview Colors */}
              <div className="flex gap-1 ml-3">
                {theme.meshGradients.slice(0, 3).map((gradient, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{
                      background: `linear-gradient(45deg, ${gradient.colors[0]}, ${gradient.colors[1] || gradient.colors[0]})`
                    }}
                  />
                ))}
              </div>
              
              {/* Active Indicator */}
              {currentTheme.id === theme.id && (
                <div className="w-2 h-2 bg-white rounded-full ml-2" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/20 bg-white/5">
        <p className="text-white/50 text-xs text-center">
          Click anywhere outside to close
        </p>
      </div>
    </div>
  )
}