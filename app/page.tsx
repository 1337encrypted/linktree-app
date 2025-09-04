"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import { useLinks } from "@/lib/links"
import type { Link } from "@/lib/types"
import { useAuth } from "@/lib/auth"
import LinkCard from "@/components/link-card"
import DraggableLinkCard from "@/components/draggable-link-card" // Fixed import to use default import syntax instead of named import
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconSelector } from "@/components/ui/icon-selector"
import { Plus, Search } from "lucide-react"

export default function LinktreePage() {
  const { isAuthenticated } = useAuth()
  const { getLinksByCategory, addLink, updateLink, deleteLink, reorderLinks } = useLinks()
  const links = getLinksByCategory("link")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [draggedLink, setDraggedLink] = useState<string | null>(null) // Added drag state management for proper drag and drop functionality
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
    icon: "🔗",
  })

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDragStart = (e: React.DragEvent, link: Link) => {
    setDraggedLink(link.id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetLink: Link) => {
    e.preventDefault()
    if (draggedLink && draggedLink !== targetLink.id) {
      const draggedIndex = links.findIndex((l) => l.id === draggedLink)
      const targetIndex = links.findIndex((l) => l.id === targetLink.id)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        reorderLinks(draggedIndex, targetIndex)
      }
    }
    setDraggedLink(null)
  }

  const handleEdit = (link: Link) => {
    setEditingLink(link)
    setNewLink({
      title: link.title,
      url: link.url,
      description: link.description || "",
      icon: link.icon || "🔗",
    })
    setShowAddForm(true)
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newLink.title && newLink.url) {
      if (editingLink) {
        await updateLink(editingLink.id, newLink)
        setEditingLink(null)
      } else {
        await addLink({ ...newLink, category: "link", isActive: true })
      }
      setNewLink({ title: "", url: "", description: "", icon: "🔗" })
      setShowAddForm(false)
    }
  }

  return (
    <ShaderBackground>
      <Header />

      <div className="relative z-10 pt-20 px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Search and Add Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              {isAuthenticated && (
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/20 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              )}
            </div>
          </div>

          {isAuthenticated && showAddForm && (
            <div className="max-w-md mx-auto mb-8 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <form onSubmit={handleAddLink} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Link Title
                  </Label>
                  <Input
                    id="title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Enter link title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="url" className="text-white">
                    Link URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newLink.description}
                    onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Link description"
                  />
                </div>
                <div>
                  <Label className="text-white">
                    Icon
                  </Label>
                  <Button
                    type="button"
                    onClick={() => setShowIconSelector(true)}
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 justify-start overflow-hidden"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="text-2xl mr-3 flex-shrink-0">
                        {newLink.icon.startsWith('data:') || newLink.icon.startsWith('http') ? (
                          <img 
                            src={newLink.icon} 
                            alt="Icon" 
                            className="w-6 h-6 object-contain"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        ) : (
                          newLink.icon
                        )}
                      </div>
                      <span className="truncate text-left">Choose Icon</span>
                    </div>
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm border border-white/20">
                    {editingLink ? "Update Link" : "Add Link"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingLink(null) // Reset editing state when canceling
                    }}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Links Grid */}
          {filteredLinks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
              {filteredLinks.map((link) =>
                isAuthenticated ? (
                  <DraggableLinkCard
                    key={link.id}
                    link={link}
                    onEdit={handleEdit}
                    onDelete={deleteLink}
                    onDragStart={(e) => handleDragStart(e, link)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, link)}
                    isDragging={draggedLink === link.id}
                  />
                ) : (
                  <LinkCard key={link.id} link={link} />
                ),
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔗</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                {searchQuery ? "No matching links found" : "No Links Available"}
              </h2>
              <p className="text-white/70 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "The admin hasn't added any links yet. Check back later!"}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-8 border-t border-white/10">
            <p className="text-white/50 text-sm">Built by Yash Herekar 2025 • Built with Next.js</p>
          </div>
        </div>
      </div>

      {/* Icon Selector Modal */}
      {showIconSelector && (
        <IconSelector
          selectedIcon={newLink.icon}
          onIconSelect={(icon) => {
            setNewLink({ ...newLink, icon })
            setShowIconSelector(false)
          }}
          onClose={() => setShowIconSelector(false)}
        />
      )}
    </ShaderBackground>
  )
}
