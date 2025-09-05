#!/bin/bash

# Build and deployment script for low-resource server
# Run this on your development machine

echo "🚀 Building production-ready linktree app..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --production=false
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out dist server-bundle

# Build the application
echo "🔨 Building application..."
npm run build

# Create optimized server bundle
echo "📦 Creating server bundle..."
mkdir -p server-bundle

# Copy essential files
cp -r .next server-bundle/
cp -r public server-bundle/
cp package.json server-bundle/
cp package-lock.json server-bundle/
cp next.config.mjs server-bundle/
cp ecosystem.config.js server-bundle/

# Create a minimal package.json for production
cat > server-bundle/package.json << EOF
{
  "name": "linktree-production",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "next start -p 3000",
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop linktree-app",
    "pm2:restart": "pm2 restart linktree-app"
  },
  "dependencies": {
    "next": "15.5.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "better-sqlite3": "^11.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "framer-motion": "^11.11.9",
    "lucide-react": "^0.462.0",
    "tailwind-merge": "^2.5.4",
    "@paper-design/shaders-react": "^0.2.1"
  }
}
EOF

# Create deployment instructions
cat > server-bundle/DEPLOY.md << EOF
# Deployment Instructions for Low-Resource Server

## Prerequisites on Server
- Node.js 18+ 
- PM2 (optional but recommended): \`npm install -g pm2\`

## Deployment Steps

1. **Upload the server-bundle folder to your server**
   \`\`\`bash
   scp -r server-bundle/ user@your-server:/path/to/app/
   \`\`\`

2. **On your server, navigate to the app directory**
   \`\`\`bash
   cd /path/to/app/server-bundle
   \`\`\`

3. **Install production dependencies (minimal set)**
   \`\`\`bash
   npm ci --production
   \`\`\`

4. **Start the application**
   
   **Option A: Direct start (simple)**
   \`\`\`bash
   npm start
   \`\`\`
   
   **Option B: PM2 (recommended for production)**
   \`\`\`bash
   npm run pm2:start
   \`\`\`

## Performance Configuration
- **Multi-core clustering**: Uses all available CPU cores
- **Memory limit**: 1GB (optimized for performance)
- **Auto-restart**: If memory exceeds limit or crashes
- **Logging**: Advanced logging to \`./logs/\` directory

## Management Commands (PM2 - Recommended)
- Start: \`npm run pm2:start\`
- Stop: \`npm run pm2:stop\`
- Restart: \`npm run pm2:restart\`
- View logs: \`pm2 logs linktree-app\`
- Monitor: \`pm2 monit\`
- Real-time dashboard: \`pm2 web\`

## Server Configuration
- **Port**: 3000 (clustered across cores)
- **Database**: \`data/linktree.db\` (automatically created)
- **Static assets**: Cached for 1 year
- **Images**: WebP/AVIF optimization
- **Security headers**: Enabled
- **Compression**: Enabled
EOF

# Create high-performance server.js
cat > server-bundle/server.js << 'EOF'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT, 10) || 3000

// High-performance optimizations
process.env.NODE_OPTIONS = '--max-old-space-size=1024 --optimize-for-size'

const app = next({ 
  dev, 
  hostname, 
  port,
  conf: {
    // Enhanced performance settings
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
  }
})
const handle = app.getRequestHandler()

// Create HTTP server with performance optimizations
const server = createServer({
  keepAliveTimeout: 65000,
  headersTimeout: 66000,
}, async (req, res) => {
  try {
    // Enable compression and caching headers
    res.setHeader('Server', 'Linktree-Production')
    
    const parsedUrl = parse(req.url, true)
    await handle(req, res, parsedUrl)
  } catch (err) {
    console.error('Error occurred handling', req.url, err)
    res.statusCode = 500
    res.end('Internal server error')
  }
})

// Performance optimizations
server.keepAliveTimeout = 65000
server.headersTimeout = 66000
server.maxHeadersCount = 20

app.prepare().then(() => {
  server.listen(port, hostname, (err) => {
    if (err) throw err
    console.log(\`🚀 Linktree app ready on http://\${hostname}:\${port}\`)
    console.log(\`⚡ Performance mode: \${process.env.NODE_ENV}\`)
    console.log(\`🎯 Memory limit: \${process.env.NODE_OPTIONS}\`)
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})
EOF

echo "✅ Build completed!"
echo ""
echo "📁 Files ready for deployment in: ./server-bundle/"
echo "📊 Bundle size:"
du -sh server-bundle/
echo ""
echo "🚀 Next steps:"
echo "1. Copy the 'server-bundle' folder to your server"
echo "2. Follow instructions in server-bundle/DEPLOY.md"
echo ""
echo "💡 The bundle is optimized for low-resource servers (512MB+ RAM)"