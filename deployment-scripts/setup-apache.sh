#!/bin/bash

# Apache2 Setup Script for Linktree Production Deployment
# Run this script as root or with sudo

echo "🚀 Setting up Apache2 for Linktree production deployment..."

# Update system packages
echo "📦 Updating system packages..."
apt update

# Install Apache2 and required modules
echo "🔧 Installing Apache2 and modules..."
apt install -y apache2
a2enmod rewrite
a2enmod ssl
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_wstunnel
a2enmod headers
a2enmod expires
a2enmod deflate

# Create site configuration
echo "⚙️ Creating Apache2 site configuration..."

# Replace YOUR_DOMAIN with your actual domain
read -p "Enter your domain name (e.g., example.com): " DOMAIN

# Create the virtual host configuration
cat > /etc/apache2/sites-available/linktree.conf << EOF
<VirtualHost *:80>
    ServerName ${DOMAIN}
    ServerAlias www.${DOMAIN}
    
    # Redirect HTTP to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName ${DOMAIN}
    ServerAlias www.${DOMAIN}
    
    # Document root (not used but required)
    DocumentRoot /var/www/html
    
    # SSL Configuration (you'll need to add your SSL certificates)
    SSLEngine on
    # Uncomment and update these paths with your SSL certificates:
    # SSLCertificateFile /etc/ssl/certs/${DOMAIN}.crt
    # SSLCertificateKeyFile /etc/ssl/private/${DOMAIN}.key
    # SSLCertificateChainFile /etc/ssl/certs/${DOMAIN}-chain.crt
    
    # For testing, you can use a self-signed certificate:
    SSLCertificateFile /etc/ssl/certs/ssl-cert-snakeoil.pem
    SSLCertificateKeyFile /etc/ssl/private/ssl-cert-snakeoil.key
    
    # Security Headers
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
    
    # Enable compression
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \\.(?:gif|jpe?g|png|webp|avif)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \\.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \\.pdf$ no-gzip dont-vary
    </Location>
    
    # Static file caching
    <LocationMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, immutable"
    </LocationMatch>
    
    # Proxy to Next.js application
    ProxyPreserveHost On
    ProxyPass /_next/ http://localhost:3000/_next/
    ProxyPassReverse /_next/ http://localhost:3000/_next/
    
    ProxyPass /api/ http://localhost:3000/api/
    ProxyPassReverse /api/ http://localhost:3000/api/
    
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # WebSocket support (if needed in future)
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*) ws://localhost:3000/$1 [P,L]
    
    # Logging
    ErrorLog \${APACHE_LOG_DIR}/linktree_error.log
    CustomLog \${APACHE_LOG_DIR}/linktree_access.log combined
</VirtualHost>
EOF

# Disable default site and enable linktree site
echo "🔄 Configuring Apache2 sites..."
a2dissite 000-default
a2ensite linktree

# Test Apache configuration
echo "🧪 Testing Apache2 configuration..."
apache2ctl configtest

if [ $? -eq 0 ]; then
    echo "✅ Apache2 configuration is valid"
    
    # Restart Apache2
    echo "🔄 Restarting Apache2..."
    systemctl restart apache2
    systemctl enable apache2
    
    echo "✅ Apache2 setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Make sure your Next.js app is running on port 3000:"
    echo "   cd /path/to/your/app && npm start"
    echo ""
    echo "2. Or use PM2 for production:"
    echo "   npm install -g pm2"
    echo "   pm2 start ecosystem.config.js"
    echo "   pm2 save"
    echo "   pm2 startup"
    echo ""
    echo "3. Configure your SSL certificates:"
    echo "   - Edit /etc/apache2/sites-available/linktree.conf"
    echo "   - Update SSL certificate paths"
    echo "   - Remove the snakeoil certificates"
    echo ""
    echo "4. Update your domain's DNS to point to this server"
    echo ""
    echo "🌐 Your site should be accessible at: https://${DOMAIN}"
    
else
    echo "❌ Apache2 configuration test failed. Please check the configuration."
    exit 1
fi