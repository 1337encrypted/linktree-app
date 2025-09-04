"use client"

export interface IconCategory {
  id: string
  name: string
  icons: string[]
}

export const iconPacks: IconCategory[] = [
  {
    id: "general",
    name: "General",
    icons: ["🔗", "🌐", "📱", "💻", "📧", "📞", "📍", "🏠", "🔍", "⭐", "❤️", "👤", "👥", "💡", "🔔", "⚙️"]
  },
  {
    id: "social",
    name: "Social Media",
    icons: ["📱", "💬", "📷", "🎬", "🎵", "🎥", "📺", "🎯", "🎨", "🎭", "🎪", "🎊", "🎉", "🎁", "💌", "💫"]
  },
  {
    id: "tech",
    name: "Technology",
    icons: ["💻", "⌨️", "🖱️", "🖥️", "📱", "⌚", "🎮", "🕹️", "💿", "💾", "🔌", "🔋", "📡", "🛰️", "🔧", "⚡"]
  },
  {
    id: "business",
    name: "Business",
    icons: ["💼", "📊", "📈", "📉", "💰", "💳", "🏢", "🏪", "🏭", "🏦", "📑", "📋", "📝", "📄", "📇", "🗂️"]
  },
  {
    id: "creative",
    name: "Creative",
    icons: ["🎨", "🖌️", "✏️", "🖍️", "📝", "📚", "📖", "📰", "🖼️", "🎭", "🎪", "🎨", "🎬", "🎵", "🎤", "🎸"]
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icons: ["☕", "🍕", "🍔", "🍰", "🎂", "🍻", "🥂", "🌮", "🍜", "🍣", "🏋️", "🧘", "🎾", "⚽", "🏀", "🏐"]
  },
  {
    id: "travel",
    name: "Travel & Places",
    icons: ["✈️", "🚗", "🚙", "🚌", "🚎", "🏨", "🗺️", "🧳", "🎒", "🌍", "🌎", "🌏", "🏔️", "🏖️", "🏝️", "🗼"]
  },
  {
    id: "education",
    name: "Education",
    icons: ["📚", "📖", "📝", "✏️", "🖊️", "📏", "📐", "🧮", "🎓", "👨‍🎓", "👩‍🎓", "🏫", "🎒", "📋", "📊", "🔬"]
  },
  {
    id: "health",
    name: "Health & Fitness",
    icons: ["🏥", "⚕️", "💊", "🩺", "🏋️", "🤸", "🧘", "🏃", "🚴", "🏊", "❤️", "💚", "🍎", "🥗", "💪", "🦷"]
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icons: ["🎬", "🎭", "🎪", "🎨", "🎵", "🎶", "🎤", "🎸", "🥁", "🎹", "🎮", "🕹️", "🎯", "🎳", "🎲", "🃏"]
  }
]

export const getIconsByCategory = (categoryId: string): string[] => {
  const category = iconPacks.find(pack => pack.id === categoryId)
  return category ? category.icons : iconPacks[0].icons
}

export const getAllIcons = (): string[] => {
  return iconPacks.flatMap(pack => pack.icons)
}

export const searchIcons = (query: string): string[] => {
  if (!query) return []
  
  const allIcons = getAllIcons()
  const matchingCategories = iconPacks.filter(pack => 
    pack.name.toLowerCase().includes(query.toLowerCase())
  )
  
  if (matchingCategories.length > 0) {
    return matchingCategories.flatMap(pack => pack.icons)
  }
  
  // For now, return a simple subset since we can't search emoji descriptions easily
  return allIcons.slice(0, 20)
}