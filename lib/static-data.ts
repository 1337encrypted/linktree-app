import type { Link } from "./types"

// Static data for deployment - replace API calls
export const staticLinks: Link[] = [
  {
    id: "1",
    title: "GitHub",
    url: "https://github.com",
    description: "My GitHub profile",
    icon: "🐙",
    isActive: true,
    order: 0,
    category: "link",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2", 
    title: "Portfolio",
    url: "https://example.com",
    description: "My personal website",
    icon: "🌐",
    isActive: true,
    order: 1,
    category: "link",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "E-commerce App", 
    url: "https://myapp.com",
    description: "Full-stack shopping application",
    icon: "🛒",
    isActive: true,
    order: 2,
    category: "project",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]