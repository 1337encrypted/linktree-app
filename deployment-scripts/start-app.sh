#!/bin/bash

# Production App Startup Script
# Run this script to start your Linktree app in production

APP_DIR="/var/www/html"
APP_NAME="linktree-app"

echo "🚀 Starting Linktree app in production mode..."

# Navigate to app directory
cd "$APP_DIR" || exit

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Stop any existing instances
echo "🛑 Stopping existing instances..."
pm2 stop "$APP_NAME" 2>/dev/null || true
pm2 delete "$APP_NAME" 2>/dev/null || true

# Start the application with PM2
echo "▶️ Starting application with PM2..."
pm2 start npm --name "$APP_NAME" -- start

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on boot
echo "🔄 Setting up PM2 startup script..."
pm2 startup

echo "✅ Linktree app started successfully!"
echo ""
echo "📊 Management commands:"
echo "  pm2 status           - Check app status"
echo "  pm2 logs $APP_NAME   - View logs"
echo "  pm2 restart $APP_NAME - Restart app"
echo "  pm2 stop $APP_NAME    - Stop app"
echo "  pm2 monit            - Monitor dashboard"
echo ""
echo "🌐 App should be running on http://localhost:3000"
echo "🌐 Apache2 will proxy it to your domain"