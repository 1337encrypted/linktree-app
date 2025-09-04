"use client"

import type React from "react"

import { useRef } from "react"
import { MeshGradient } from "@paper-design/shaders-react"
import { useBackgroundTheme } from "@/lib/background-themes"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentTheme } = useBackgroundTheme()

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Dynamic Background Shaders */}
      {currentTheme.meshGradients.map((gradient, index) => (
        <MeshGradient
          key={`${currentTheme.id}-${index}`}
          className={gradient.className || "absolute inset-0 w-full h-full"}
          colors={gradient.colors}
          speed={gradient.speed}
          style={{ 
            opacity: gradient.opacity ? gradient.opacity / 100 : 1 
          }}
        />
      ))}

      {children}
    </div>
  )
}

export { ShaderBackground }
