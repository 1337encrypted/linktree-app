"use client"

import type React from "react"

import type { Link } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { IconDisplay } from "./icon-display"
import { Edit2, Trash2 } from "lucide-react"
import { useState } from "react"

interface DraggableLinkCardProps {
  link: Link
  onEdit: (link: Link) => void
  onDelete: (id: string) => void
  onDragStart: (e: React.DragEvent, link: Link) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, targetLink: Link) => void
  isDragging: boolean
}

const DraggableLinkCard = ({
  link,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: DraggableLinkCardProps) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, link)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
    onDragOver(e)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(e, link)
  }

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group p-4 bg-white/10 backdrop-blur-md border-white/20 
        hover:bg-white/20 transition-all duration-300 cursor-move
        aspect-square flex flex-col items-center justify-center text-center
        ${isDragging ? "opacity-50 scale-95" : ""}
        ${isDragOver ? "border-white/60 bg-white/30 scale-105" : ""}
        ${!link.isActive ? "opacity-60" : ""}
      `}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 opacity-60 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </div>

      {/* Icon */}
      <div className="mb-2">
        <IconDisplay icon={link.icon} className="text-2xl" />
      </div>

      {/* Title */}
      <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{link.title}</h3>

      {/* Description */}
      {link.description && <p className="text-white/70 text-xs line-clamp-2">{link.description}</p>}

      {/* Edit controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(link)
            }}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md text-white transition-colors"
            title="Edit link"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(link.id)
            }}
            className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-md text-white transition-colors"
            title="Delete link"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>


      {/* Drop indicator */}
      {isDragOver && (
        <div className="absolute inset-0 border-2 border-dashed border-white/60 rounded-lg pointer-events-none" />
      )}
    </Card>
  )
}

export default DraggableLinkCard
