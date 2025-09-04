"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Link, LinkFormData, ApiResponse } from "./types"

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

  // Fetch links from API
  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links')
      const result = await response.json()
      
      if (result.success) {
        setLinks(result.data)
      } else {
        console.error('Failed to fetch links:', result.error)
      }
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize database and fetch links
  useEffect(() => {
    const initDatabase = async () => {
      try {
        // Check if database is initialized
        const statusResponse = await fetch('/api/init')
        const statusResult = await statusResponse.json()
        
        if (!statusResult.initialized) {
          // Initialize database with seed data
          await fetch('/api/init', { method: 'POST' })
        }
        
        // Fetch links
        await fetchLinks()
      } catch (error) {
        console.error('Error initializing database:', error)
        setIsLoading(false)
      }
    }

    initDatabase()
  }, [])

  const addLink = async (linkData: LinkFormData) => {
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Refetch links to get updated data
        await fetchLinks()
      } else {
        console.error('Failed to add link:', result.error)
      }
    } catch (error) {
      console.error('Error adding link:', error)
    }
  }

  const updateLink = async (id: string, updates: Partial<Link>) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Refetch links to get updated data
        await fetchLinks()
      } else {
        console.error('Failed to update link:', result.error)
      }
    } catch (error) {
      console.error('Error updating link:', error)
    }
  }

  const deleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Refetch links to get updated data
        await fetchLinks()
      } else {
        console.error('Failed to delete link:', result.error)
      }
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const reorderLinks = async (startIndex: number, endIndex: number) => {
    try {
      // Create new array with reordered items
      const result = Array.from(links)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      
      // Extract just the IDs in the new order
      const linkIds = result.map(link => link.id)
      
      const response = await fetch('/api/links/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkIds }),
      })
      
      const apiResult = await response.json()
      
      if (apiResult.success) {
        // Refetch links to get updated data
        await fetchLinks()
      } else {
        console.error('Failed to reorder links:', apiResult.error)
      }
    } catch (error) {
      console.error('Error reordering links:', error)
    }
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
