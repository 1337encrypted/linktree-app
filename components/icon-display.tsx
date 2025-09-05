"use client"

import Image from "next/image"

interface IconDisplayProps {
  icon?: string
  className?: string
  fallback?: string
}

function isValidUrl(string: string) {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

export function IconDisplay({ icon, className = "text-2xl", fallback = "🔗" }: IconDisplayProps) {

  if (!icon) {
    return <span className={className}>{fallback}</span>
  }

  // Check if it's a custom SVG icon (data URL)
  if (icon.startsWith('data:image/svg+xml')) {
    return (
      <Image
        src={icon}
        alt="Custom icon"
        width={className.includes('text-2xl') ? 24 : 
               className.includes('text-xl') ? 20 : 
               className.includes('text-lg') ? 18 : 16}
        height={className.includes('text-2xl') ? 24 : 
                className.includes('text-xl') ? 20 : 
                className.includes('text-lg') ? 18 : 16}
        className="object-contain"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    )
  }

  // Check if it's a CDN/URL link
  if (isValidUrl(icon)) {
    return (
      <Image
        src={icon}
        alt="CDN icon"
        width={className.includes('text-2xl') ? 24 : 
               className.includes('text-xl') ? 20 : 
               className.includes('text-lg') ? 18 : 16}
        height={className.includes('text-2xl') ? 24 : 
                className.includes('text-xl') ? 20 : 
                className.includes('text-lg') ? 18 : 16}
        className="object-contain rounded"
        style={{ filter: 'brightness(0) invert(1)' }}
        onError={() => {
          // Fallback handled by Next.js Image component
          console.log('CDN image failed to load, using fallback')
        }}
      />
    )
  }

  // Regular emoji icon
  return <span className={className}>{icon}</span>
}