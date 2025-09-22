"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-static"
import { useLinks } from "@/lib/links-static"
import type { Link } from "@/lib/types"
import Header from "@/components/header"
import { LinkCard, LinkCardSkeleton } from "@/components/link-card"
import DraggableLinkCard from "@/components/draggable-link-card"
import { EmptyState } from "@/components/empty-state"
import { ShaderBackground } from "@/components/shader-background"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconSelector } from "@/components/ui/icon-selector"

export default function ProjectsPage() {
  const { isAuthenticated, loading } = useAuth()
  const { links, addLink, updateLink, deleteLink, reorderLinks, isLoading: linksLoading } = useLinks()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Link | null>(null)
  const [draggedProject, setDraggedProject] = useState<string | null>(null)
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
    icon: "🚀",
  })

  // Filter for projects only
  const projects = links.filter((link) => link.category === "project" && link.isActive)
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (project: Link) => {
    setEditingProject(project)
    setNewLink({
      title: project.title,
      url: project.url,
      description: project.description || "",
      icon: project.icon || "🚀",
    })
    setShowAddForm(true)
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newLink.title && newLink.url) {
      if (editingProject) {
        await updateLink(editingProject.id, newLink)
        setEditingProject(null)
      } else {
        await addLink({ ...newLink, category: "project", isActive: true })
      }
      setNewLink({ title: "", url: "", description: "", icon: "🚀" })
      setShowAddForm(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, project: Link) => {
    setDraggedProject(project.id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetProject: Link) => {
    e.preventDefault()
    if (draggedProject && draggedProject !== targetProject.id) {
      const draggedIndex = links.findIndex((l) => l.id === draggedProject)
      const targetIndex = links.findIndex((l) => l.id === targetProject.id)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        reorderLinks(draggedIndex, targetIndex)
      }
    }
    setDraggedProject(null)
  }

  // Show loading state while authentication is being verified
  if (loading) {
    return (
      <ShaderBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </ShaderBackground>
    )
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            {isAuthenticated && (
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/20 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
        </div>

        {/* Add Project Form */}
        {isAuthenticated && showAddForm && (
          <div className="max-w-md mx-auto mb-8 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">
                  Project Title
                </Label>
                <Input
                  id="title"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="url" className="text-white">
                  Project URL
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
                  placeholder="Project description"
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
                        <Image 
                          src={newLink.icon} 
                          alt="Icon" 
                          width={24}
                          height={24}
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
                  {editingProject ? "Update Project" : "Add Project"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingProject(null)
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

        {/* Projects Grid */}
        {linksLoading ? (
          /* Skeleton Loading State */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
            {Array.from({ length: 6 }).map((_, index) => (
              <LinkCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
            {filteredProjects.map((project) =>
              isAuthenticated ? (
                <DraggableLinkCard
                  key={project.id}
                  link={project}
                  onEdit={handleEdit}
                  onDelete={deleteLink}
                  onDragStart={(e) => handleDragStart(e, project)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, project)}
                  isDragging={draggedProject === project.id}
                />
              ) : (
                <LinkCard key={project.id} link={project} />
              ),
            )}
          </div>
        ) : (
          <EmptyState
            title="No projects found"
            description={searchTerm ? "Try adjusting your search terms" : "No projects have been added yet"}
          />
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
