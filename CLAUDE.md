# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `npm run dev` - Start the development server
- **Build**: `npm run build` - Build the application for production
- **Production**: `npm run start` - Start the production server
- **Lint**: `npm run lint` - Run ESLint to check code quality

## Architecture

This is a Next.js 14 Linktree clone application using the App Router with the following key architectural patterns:

### Core Structure
- **Next.js App Router**: Uses the new app directory structure for routing and layouts
- **TypeScript**: Full TypeScript implementation with strict typing
- **Tailwind CSS**: Utility-first CSS with shadcn/ui components
- **Hybrid Data Management**: Combination of SQLite database backend with React Context frontend state

### Database Layer
- **SQLite with better-sqlite3**: Primary data storage in `data/linktree.db`
- **Database Class** (`lib/database.ts`): Centralized `LinksDatabase` class with full CRUD operations
- **API Routes**: RESTful endpoints in `app/api/links/` for database operations
- **WAL Mode**: Enabled for better concurrency performance
- **Automatic Seeding**: Initial data created on first run

### State Management
- **AuthProvider** (`lib/auth.tsx`): Manages authentication state with localStorage persistence. Uses hardcoded password "admin123" for localhost development
- **LinksProvider** (`lib/links.tsx`): Frontend state management that syncs with database via API calls. Supports drag-and-drop reordering and category-based filtering

### UI Framework
- **shadcn/ui Components**: Configured in `components.json` with New York style and gray base color
- **Radix UI Primitives**: Extensive use of Radix UI components for accessibility
- **Custom Components**: 
  - `ShaderBackground`: Uses @paper-design/shaders-react for animated mesh gradients
  - `DraggableLinkCard`: Implements drag-and-drop functionality for authenticated users
  - `LinkCard`: Static link display for unauthenticated users

### Data Model
Links are stored with the following interface:
```typescript
interface Link {
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
```

### API Structure
- `GET /api/links` - Fetch links (supports ?category=link|project and ?activeOnly=true)
- `POST /api/links` - Create new link
- `PUT /api/links/[id]` - Update existing link
- `DELETE /api/links/[id]` - Delete link
- `POST /api/links/reorder` - Batch reorder links
- `POST /api/init` - Initialize database with seed data

### Authentication Pattern
- Simple password-based authentication for admin access
- localStorage persistence for auth state
- Conditional UI rendering based on authentication status
- Protected features: add/edit/delete/reorder links

### Styling Approach
- CSS-in-JS with Tailwind classes and CSS variables
- Backdrop blur effects and glassmorphism design
- Responsive grid layouts (2-3-4 columns based on screen size)
- Custom CSS variables for theming via Tailwind config

### Font Configuration
- Primary: Figtree (Google Fonts) - main UI font
- Monospace: GeistMono - for code/technical text  
- Serif: Instrument Serif - for decorative text

### Key Dependencies
- **@paper-design/shaders-react**: Animated background effects
- **framer-motion**: Animations and transitions
- **lucide-react**: Icon library
- **better-sqlite3**: SQLite database driver
- **class-variance-authority & clsx**: Utility class management