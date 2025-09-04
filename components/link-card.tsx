"use client"

import type { Link } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { IconDisplay } from "./icon-display"
import { Edit2, Trash2 } from "lucide-react"

interface LinkCardProps {
  link: Link
  isEditable?: boolean
  onEdit?: (link: Link) => void
  onDelete?: (id: string) => void
}

const LinkCard = ({ link, isEditable = false, onEdit, onDelete }: LinkCardProps) => {
  const handleClick = () => {
    if (!isEditable) {
      window.open(link.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card
      className={`
        relative group p-4 bg-white/10 backdrop-blur-md border-white/20 
        hover:bg-white/20 transition-all duration-300 cursor-pointer
        aspect-square flex flex-col items-center justify-center text-center
        ${isEditable ? "hover:border-white/40" : "hover:scale-105"}
      `}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="mb-2">
        <IconDisplay icon={link.icon} className="text-2xl" />
      </div>

      {/* Title */}
      <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{link.title}</h3>

      {/* Description */}
      {link.description && <p className="text-white/70 text-xs line-clamp-2">{link.description}</p>}

      {/* Edit controls for admin */}
      {isEditable && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(link)
              }}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md text-white transition-colors"
              title="Edit link"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(link.id)
              }}
              className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-md text-white transition-colors"
              title="Delete link"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

    </Card>
  )
}

export { LinkCard }
export default LinkCard
