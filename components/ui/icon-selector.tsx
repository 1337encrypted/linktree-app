"use client"

import { useState, useRef } from "react"
import { Button } from "./button"
import { Input } from "./input"
import { iconPacks, type IconCategory } from "@/lib/icon-packs"
import { useCustomIcons } from "@/lib/custom-icons"
import { Search, X, Upload, Trash2, Link as LinkIcon } from "lucide-react"

interface IconSelectorProps {
  selectedIcon: string
  onIconSelect: (icon: string) => void
  onClose: () => void
}

export function IconSelector({ selectedIcon, onIconSelect, onClose }: IconSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("general")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [cdnUrl, setCdnUrl] = useState("")
  const [showCdnInput, setShowCdnInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { customIcons, addIcon, deleteIcon } = useCustomIcons()

  const activeIcons = activeCategory === "custom" 
    ? customIcons.map(icon => icon.dataUrl)
    : iconPacks.find(pack => pack.id === activeCategory)?.icons || iconPacks[0].icons

  const filteredIcons = searchQuery 
    ? activeIcons.filter((icon, index) => {
        if (activeCategory === "custom") {
          const customIcon = customIcons[index]
          return customIcon?.name.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return index.toString().includes(searchQuery) || activeCategory.includes(searchQuery.toLowerCase())
      })
    : activeIcons

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await addIcon(file)
      // Switch to custom category to show the uploaded icon
      setActiveCategory("custom")
    } catch (error) {
      console.error('Icon upload failed:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload icon')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteCustomIcon = (iconId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (confirm('Delete this custom icon?')) {
      deleteIcon(iconId)
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleCdnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cdnUrl.trim() && isValidUrl(cdnUrl.trim())) {
      onIconSelect(cdnUrl.trim())
      setCdnUrl("")
      setShowCdnInput(false)
      onClose()
    } else {
      alert('Please enter a valid URL')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-base">Choose an Icon</h3>
          <div className="flex items-center gap-1 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="border-blue-400/50 bg-blue-500/20 text-white hover:bg-blue-500/30 hover:border-blue-400/70 transition-all text-xs px-2 py-1 h-7"
              disabled={isUploading}
            >
              <Upload className="w-3 h-3 mr-1" />
              {isUploading ? 'Upload...' : 'SVG'}
            </Button>
            <Button
              onClick={() => setShowCdnInput(!showCdnInput)}
              variant="outline"
              size="sm"
              className="border-green-400/50 bg-green-500/20 text-white hover:bg-green-500/30 hover:border-green-400/70 transition-all text-xs px-2 py-1 h-7"
            >
              <LinkIcon className="w-3 h-3 mr-1" />
              CDN
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 text-xs px-2 py-1 h-7"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <Input
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* CDN URL Input */}
        {showCdnInput && (
          <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <form onSubmit={handleCdnSubmit} className="space-y-3">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Icon URL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/icon.png"
                  value={cdnUrl}
                  onChange={(e) => setCdnUrl(e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm"
                  style={{ fontSize: '13px' }}
                  required
                />
                <p className="text-white/50 text-xs mt-1 break-words">
                  Enter a direct link to an image file (PNG, JPG, SVG, etc.)
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20"
                >
                  Add Icon
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowCdnInput(false)
                    setCdnUrl("")
                  }}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Custom Icons Category */}
          <Button
            onClick={() => setActiveCategory("custom")}
            size="sm"
            variant={activeCategory === "custom" ? "default" : "outline"}
            className={`text-xs ${
              activeCategory === "custom"
                ? "bg-white text-black"
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            Custom ({customIcons.length})
          </Button>
          
          {/* Emoji Categories */}
          {iconPacks.map((pack) => (
            <Button
              key={pack.id}
              onClick={() => setActiveCategory(pack.id)}
              size="sm"
              variant={activeCategory === pack.id ? "default" : "outline"}
              className={`text-xs ${
                activeCategory === pack.id
                  ? "bg-white text-black"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              {pack.name}
            </Button>
          ))}
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto">
          {activeCategory === "custom" && customIcons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Upload className="w-12 h-12 text-white/40 mb-4" />
              <p className="text-white/60 text-sm text-center">
                No custom icons yet.<br />
                Click &ldquo;Upload SVG&rdquo; to add your own icons!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {filteredIcons.map((icon, index) => {
                const isCustom = activeCategory === "custom"
                const customIcon = isCustom ? customIcons[index] : null
                
                return (
                  <div key={`${icon}-${index}`} className="relative group">
                    <button
                      onClick={() => onIconSelect(icon)}
                      className={`
                        w-full p-3 rounded-lg transition-all duration-200
                        hover:bg-white/20 border-2 flex items-center justify-center
                        ${selectedIcon === icon 
                          ? "border-white bg-white/20" 
                          : "border-transparent hover:border-white/20"
                        }
                      `}
                      title={customIcon?.name || undefined}
                    >
                      {isCustom ? (
                        <img
                          src={icon}
                          alt={customIcon?.name || 'Custom icon'}
                          className="w-6 h-6 object-contain"
                          style={{ filter: 'brightness(0) invert(1)' }} // Make SVGs white
                        />
                      ) : (
                        <span className="text-2xl">{icon}</span>
                      )}
                    </button>
                    
                    {/* Delete button for custom icons */}
                    {isCustom && customIcon && (
                      <button
                        onClick={(e) => handleDeleteCustomIcon(customIcon.id, e)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                        title="Delete custom icon"
                      >
                        <Trash2 className="w-2 h-2" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onIconSelect(selectedIcon)
                onClose()
              }}
              className="flex-1 bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm border border-white/20"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}