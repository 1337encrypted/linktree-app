"use client"

interface EmptyStateProps {
  icon?: string
  title?: string
  description?: string
}

export default function EmptyState({
  icon = "🔗",
  title = "No Links Available",
  description = "The admin hasn't added any links yet. Check back later!",
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {/* Icon */}
      <div className="w-16 h-16 bg-white/10 backdrop-blur-md border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-white/20 transition-all duration-300">
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>

      {/* Description */}
      <p className="text-white/70 mb-6 text-pretty max-w-md mx-auto">{description}</p>
    </div>
  )
}

export { EmptyState }
