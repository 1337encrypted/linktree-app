import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import type { Link, LinkInsertData, LinkUpdateData } from './types'

let db: Database.Database | null = null

// Initialize database
export function initDatabase() {
  if (db) return db

  // Create data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const dbPath = path.join(dataDir, 'linktree.db')
  db = new Database(dbPath)

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL')

  // Create links table
  db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      isActive INTEGER DEFAULT 1,
      "order" INTEGER DEFAULT 0,
      category TEXT DEFAULT 'link' CHECK (category IN ('link', 'project')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create admin authentication table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_auth (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE DEFAULT 'admin',
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_links_category ON links(category);
    CREATE INDEX IF NOT EXISTS idx_links_active ON links(isActive);
    CREATE INDEX IF NOT EXISTS idx_links_order ON links("order");
    CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_auth(username);
  `)

  return db
}

// Get database instance
export function getDatabase() {
  if (!db) {
    return initDatabase()
  }
  return db
}

// Database operations
export class LinksDatabase {
  private db: Database.Database

  constructor() {
    this.db = getDatabase()
  }

  // Convert database result to proper Link format
  private formatLink(dbLink: Record<string, unknown>): Link {
    return {
      ...dbLink,
      isActive: Boolean(dbLink.isActive)
    } as Link
  }

  // Get all links
  getAllLinks(): Link[] {
    const stmt = this.db.prepare(`
      SELECT * FROM links 
      ORDER BY category, "order", createdAt
    `)
    const results = stmt.all()
    return results.map(link => this.formatLink(link as Record<string, unknown>))
  }

  // Get links by category
  getLinksByCategory(category: 'link' | 'project'): Link[] {
    const stmt = this.db.prepare(`
      SELECT * FROM links 
      WHERE category = ? AND isActive = 1
      ORDER BY "order", createdAt
    `)
    const results = stmt.all(category)
    return results.map(link => this.formatLink(link as Record<string, unknown>))
  }

  // Get active links
  getActiveLinks(): Link[] {
    const stmt = this.db.prepare(`
      SELECT * FROM links 
      WHERE isActive = 1
      ORDER BY category, "order", createdAt
    `)
    const results = stmt.all()
    return results.map(link => this.formatLink(link as Record<string, unknown>))
  }

  // Add new link
  addLink(linkData: LinkInsertData): Link {
    const id = Date.now().toString()
    const now = new Date().toISOString()
    
    // Get the next order for this category
    const maxOrderStmt = this.db.prepare(`
      SELECT MAX("order") as maxOrder FROM links WHERE category = ?
    `)
    const result = maxOrderStmt.get(linkData.category) as { maxOrder: number | null }
    const order = (result.maxOrder || -1) + 1

    const stmt = this.db.prepare(`
      INSERT INTO links (id, title, url, description, icon, isActive, "order", category, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const newLink: Link = {
      id,
      title: linkData.title,
      url: linkData.url,
      description: linkData.description,
      icon: linkData.icon,
      isActive: linkData.isActive,
      order,
      category: linkData.category,
      createdAt: now,
      updatedAt: now
    }

    stmt.run(
      newLink.id,
      newLink.title,
      newLink.url,
      newLink.description,
      newLink.icon,
      newLink.isActive ? 1 : 0,
      newLink.order,
      newLink.category,
      newLink.createdAt,
      newLink.updatedAt
    )

    return newLink
  }

  // Update link
  updateLink(id: string, updates: LinkUpdateData): boolean {
    const now = new Date().toISOString()
    const updateData = { ...updates, updatedAt: now }

    const fields = Object.keys(updateData).filter(key => updateData[key as keyof typeof updateData] !== undefined)
    const setClause = fields.map(field => field === 'isActive' ? `"${field}" = ?` : `"${field}" = ?`).join(', ')
    const values = fields.map(field => {
      const value = updateData[field as keyof typeof updateData]
      return field === 'isActive' ? (value ? 1 : 0) : value
    })

    const stmt = this.db.prepare(`
      UPDATE links 
      SET ${setClause}
      WHERE id = ?
    `)

    const result = stmt.run(...values, id)
    return result.changes > 0
  }

  // Delete link
  deleteLink(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM links WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  // Reorder links
  reorderLinks(linkIds: string[]): boolean {
    const updateStmt = this.db.prepare('UPDATE links SET "order" = ?, updatedAt = ? WHERE id = ?')
    const now = new Date().toISOString()

    const transaction = this.db.transaction(() => {
      linkIds.forEach((id, index) => {
        updateStmt.run(index, now, id)
      })
    })

    try {
      transaction()
      return true
    } catch (error) {
      console.error('Error reordering links:', error)
      return false
    }
  }

  // Seed initial data
  seedInitialData(): void {
    const existingLinks = this.getAllLinks()
    if (existingLinks.length > 0) return

    const initialLinks = [
      {
        title: "GitHub",
        url: "https://github.com",
        description: "My GitHub profile",
        icon: "🐙",
        isActive: true,
        category: "link" as const
      },
      {
        title: "Portfolio",
        url: "https://example.com",
        description: "My personal website",
        icon: "🌐",
        isActive: true,
        category: "link" as const
      },
      {
        title: "E-commerce App",
        url: "https://myapp.com",
        description: "Full-stack shopping application",
        icon: "🛒",
        isActive: true,
        category: "project" as const
      }
    ]

    initialLinks.forEach(link => this.addLink(link))
  }
}

// Hash password with salt
function hashPassword(password: string, salt?: string): { hash: string, salt: string } {
  const saltToUse = salt || crypto.randomBytes(32).toString('hex')
  const hash = crypto.pbkdf2Sync(password, saltToUse, 10000, 64, 'sha512').toString('hex')
  return { hash, salt: saltToUse }
}

// Verify password against hash
function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: newHash } = hashPassword(password, salt)
  return newHash === hash
}

// Admin Authentication Database operations
export class AdminAuthDatabase {
  private db: Database.Database

  constructor() {
    this.db = getDatabase()
  }

  // Initialize admin with default password
  initializeAdmin(): void {
    const existingAdmin = this.getAdmin()
    if (!existingAdmin) {
      const { hash, salt } = hashPassword('admin123') // Default password
      const stmt = this.db.prepare(`
        INSERT INTO admin_auth (username, password_hash, salt)
        VALUES (?, ?, ?)
      `)
      stmt.run('admin', hash, salt)
    }
  }

  // Get admin record
  getAdmin(): { id: number, username: string, password_hash: string, salt: string } | undefined {
    const stmt = this.db.prepare('SELECT * FROM admin_auth WHERE username = ?')
    return stmt.get('admin') as any
  }

  // Verify admin login
  verifyLogin(password: string): boolean {
    const admin = this.getAdmin()
    if (!admin) return false
    return verifyPassword(password, admin.password_hash, admin.salt)
  }

  // Change admin password
  changePassword(currentPassword: string, newPassword: string): boolean {
    const admin = this.getAdmin()
    if (!admin) return false

    // Verify current password
    if (!verifyPassword(currentPassword, admin.password_hash, admin.salt)) {
      return false
    }

    // Set new password
    const { hash, salt } = hashPassword(newPassword)
    const stmt = this.db.prepare(`
      UPDATE admin_auth 
      SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP
      WHERE username = 'admin'
    `)
    const result = stmt.run(hash, salt)
    return result.changes > 0
  }
}

// Export singleton instances
export const linksDB = new LinksDatabase()
export const adminAuthDB = new AdminAuthDatabase()