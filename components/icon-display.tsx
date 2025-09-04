"use client"

import { useCustomIcons } from "@/lib/custom-icons"

interface IconDisplayProps {
  icon?: string
  className?: string
  fallback?: string
}

function isValidUrl(string: string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function IconDisplay({ icon, className = "text-2xl", fallback = "🔗" }: IconDisplayProps) {
  const { customIcons } = useCustomIcons()

  if (!icon) {
    return <span className={className}>{fallback}</span>
  }

  // Check if it's a custom SVG icon (data URL)
  if (icon.startsWith('data:image/svg+xml')) {
    return (
      <img
        src={icon}
        alt="Custom icon"
        className={`${className.replace('text-', 'w-').replace('text-', 'h-')} object-contain`}
        style={{ 
          filter: 'brightness(0) invert(1)',
          width: className.includes('text-2xl') ? '24px' : 
                 className.includes('text-xl') ? '20px' : 
                 className.includes('text-lg') ? '18px' : '16px',
          height: className.includes('text-2xl') ? '24px' : 
                  className.includes('text-xl') ? '20px' : 
                  className.includes('text-lg') ? '18px' : '16px'
        }}
      />
    )
  }

  // Check if it's a CDN/URL link
  if (isValidUrl(icon)) {
    return (
      <img
        src={icon}
        alt="CDN icon"
        className={`object-contain rounded`}
        style={{ 
          filter: 'brightness(0) invert(1)',
          width: className.includes('text-2xl') ? '24px' : 
                 className.includes('text-xl') ? '20px' : 
                 className.includes('text-lg') ? '18px' : '16px',
          height: className.includes('text-2xl') ? '24px' : 
                  className.includes('text-xl') ? '20px' : 
                  className.includes('text-lg') ? '18px' : '16px'
        }}
        onError={(e) => {
          // Fallback to emoji if CDN image fails to load
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          target.nextElementSibling?.remove() // Remove any existing fallback
          const fallbackSpan = document.createElement('span')
          fallbackSpan.className = className
          fallbackSpan.textContent = fallback
          target.parentNode?.appendChild(fallbackSpan)
        }}
      />
    )
  }

  // Regular emoji icon
  return <span className={className}>{icon}</span>
}