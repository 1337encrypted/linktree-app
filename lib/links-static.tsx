"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Link, LinkFormData } from "./types"
import { staticLinks } from "./static-data"

interface LinksContextType {
  links: Link[]
  addLink: (link: LinkFormData) => Promise<void>
  updateLink: (id: string, updates: Partial<Link>) => Promise<void>
  deleteLink: (id: string) => Promise<void>
  reorderLinks: (startIndex: number, endIndex: number) => Promise<void>
  getActiveLinks: () => Link[]
  getLinksByCategory: (category: "link" | "project") => Link[]
  isLoading: boolean
}

const LinksContext = createContext<LinksContextType | undefined>(undefined)

export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load static data on mount
  useEffect(() => {
    // Simulate loading delay for smooth UX
    const timer = setTimeout(() => {
      setLinks(staticLinks)
      setIsLoading(false)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Placeholder functions for static deployment (no-ops)
  const addLink = async (linkData: LinkFormData) => {
    console.log('Add link is disabled in static deployment:', linkData)
  }

  const updateLink = async (id: string, updates: Partial<Link>) => {
    console.log('Update link is disabled in static deployment:', id, updates)
  }

  const deleteLink = async (id: string) => {
    console.log('Delete link is disabled in static deployment:', id)
  }

  const reorderLinks = async (startIndex: number, endIndex: number) => {
    console.log('Reorder links is disabled in static deployment:', startIndex, endIndex)
  }

  const getActiveLinks = () => {
    return links.filter((link) => link.isActive).sort((a, b) => a.order - b.order)
  }

  const getLinksByCategory = (category: "link" | "project") => {
    return links.filter((link) => link.category === category && link.isActive).sort((a, b) => a.order - b.order)
  }

  return (
    <LinksContext.Provider
      value={{
        links,
        addLink,
        updateLink,
        deleteLink,
        reorderLinks,
        getActiveLinks,
        getLinksByCategory,
        isLoading,
      }}
    >
      {children}
    </LinksContext.Provider>
  )
}

export function useLinks() {
  const context = useContext(LinksContext)
  if (context === undefined) {
    throw new Error("useLinks must be used within a LinksProvider")
  }
  return context
}