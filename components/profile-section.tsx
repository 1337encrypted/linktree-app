"use client"

interface ProfileSectionProps {
  name?: string
  bio?: string
  avatar?: string
}

export default function ProfileSection({
  name = "Welcome to My Links",
  bio = "Discover all my important links and projects in one place. Click on any card to visit the link.",
  avatar = "👋",
}: ProfileSectionProps) {
  return (
    <div className="text-center mb-12">
      {/* Avatar */}
      <div className="w-24 h-24 bg-white/10 backdrop-blur-md border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-white/20 transition-all duration-300">
        <span className="text-4xl">{avatar}</span>
      </div>

      {/* Name */}
      <h1 className="text-4xl font-bold text-white mb-4 text-balance">{name}</h1>

      {/* Bio */}
      <p className="text-white/70 text-lg max-w-2xl mx-auto text-pretty">{bio}</p>
    </div>
  )
}
