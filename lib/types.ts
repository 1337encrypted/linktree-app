// Centralized type definitions for the application

export interface Link {
  id: string
  title: string
  url: string
  description?: string
  icon?: string
  isActive: boolean
  order: number
  category: "link" | "project"
  createdAt: string
  updatedAt: string
}

export interface CustomIcon {
  id: string
  name: string
  svgContent: string
  dataUrl: string
  createdAt: string
}

export interface BackgroundTheme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

// Form data types
export type LinkFormData = Omit<Link, "id" | "createdAt" | "updatedAt" | "order">

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Database operation types
export type LinkInsertData = Omit<Link, "id" | "createdAt" | "updatedAt" | "order">
export type LinkUpdateData = Partial<Omit<Link, "id" | "createdAt">>