# Apache2 Production Deployment Guide

This guide will help you deploy your Next.js Linktree app on Apache2 with high performance and security.

## Prerequisites

- Ubuntu/Debian server with root access
- Node.js 18+ installed
- Your domain pointing to the server
- Your Next.js app already built with `npm run build`

## Step-by-Step Deployment

### 1. Setup Apache2

Run the setup script as root:

```bash
# Make script executable
chmod +x deployment-scripts/setup-apache.sh

# Run setup (requires root/sudo)
sudo ./deployment-scripts/setup-apache.sh
```

This will:
- Install Apache2 and required modules
- Create optimized virtual host configuration
- Enable necessary Apache modules
- Configure security headers and caching
- Set up HTTPS redirect

### 2. Start Your Next.js Application

```bash
# Navigate to your app directory
cd /path/to/your/linktree/app

# Install PM2 globally (if not already installed)
sudo npm install -g pm2

# Start the application
npm start
# OR for better production management:
pm2 start npm --name "linktree-app" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 3. Configure SSL Certificates

For production, replace the self-signed certificates:

**Option A: Let's Encrypt (Free SSL)**
```bash
# Install Certbot
sudo apt install snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
sudo certbot --apache -d your-domain.com -d www.your-domain.com
```

**Option B: Custom SSL Certificate**
```bash
# Edit the Apache configuration
sudo nano /etc/apache2/sites-available/linktree.conf

# Update these lines with your certificate paths:
SSLCertificateFile /path/to/your/certificate.crt
SSLCertificateKeyFile /path/to/your/private.key
SSLCertificateChainFile /path/to/your/chain.crt

# Remove or comment out the snakeoil certificates
# SSLCertificateFile /etc/ssl/certs/ssl-cert-snakeoil.pem
# SSLCertificateKeyFile /etc/ssl/private/ssl-cert-snakeoil.key

# Test and reload Apache
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### 4. Verify Deployment

Check that everything is working:

```bash
# Check Apache2 status
sudo systemctl status apache2

# Check your app status
pm2 status

# View logs
pm2 logs linktree-app
sudo tail -f /var/log/apache2/linktree_access.log
sudo tail -f /var/log/apache2/linktree_error.log

# Test the site
curl -I https://your-domain.com
```

## Performance Optimizations Applied

### Apache2 Optimizations:
- **Compression**: Gzip enabled for all text content
- **Caching**: Static files cached for 1 year
- **Security Headers**: Full security header suite
- **SSL/TLS**: Modern SSL configuration
- **Proxy Optimization**: Keep-alive connections

### Application Optimizations:
- **PM2 Clustering**: Multi-core support
- **Memory Management**: 1GB limit with monitoring  
- **Process Management**: Auto-restart on crashes
- **Logging**: Structured logging with rotation

## Monitoring & Management

### PM2 Commands:
```bash
pm2 status              # Show all processes
pm2 logs linktree-app   # View app logs
pm2 restart linktree-app # Restart app
pm2 stop linktree-app   # Stop app
pm2 monit              # Real-time monitoring
pm2 web                # Web-based dashboard (port 9615)
```

### Apache2 Commands:
```bash
sudo systemctl status apache2     # Check Apache status
sudo systemctl restart apache2    # Restart Apache
sudo apache2ctl configtest       # Test configuration
sudo tail -f /var/log/apache2/linktree_error.log  # View errors
```

## Security Best Practices

### Firewall Configuration:
```bash
# UFW firewall setup
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw --force enable
```

### Regular Maintenance:
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js dependencies
npm audit fix

# Monitor logs for suspicious activity
sudo grep "error" /var/log/apache2/linktree_error.log
```

## Troubleshooting

### Common Issues:

1. **502 Bad Gateway**
   - Check if Next.js app is running: `pm2 status`
   - Check port 3000: `netstat -tlnp | grep :3000`

2. **SSL Certificate Issues**
   - Test SSL: `openssl s_client -connect your-domain.com:443`
   - Check certificate expiry: `openssl x509 -in /path/to/cert.crt -noout -dates`

3. **Performance Issues**
   - Monitor PM2: `pm2 monit`
   - Check Apache performance: `apache2ctl status`
   - Monitor system resources: `htop`

4. **Database Issues**
   - Check database file permissions
   - Ensure SQLite file is writable by the app user

## File Locations

- **Apache Config**: `/etc/apache2/sites-available/linktree.conf`
- **SSL Certificates**: `/etc/ssl/certs/` and `/etc/ssl/private/`
- **Logs**: `/var/log/apache2/linktree_*.log`
- **App Database**: `./data/linktree.db` (in your app directory)

## Updates & Maintenance

To update your application:

```bash
# Stop the app
pm2 stop linktree-app

# Pull updates (if using Git)
git pull origin main

# Install any new dependencies
npm ci --production

# Rebuild the application
npm run build

# Restart the app
pm2 start linktree-app
```

Your Linktree application is now running in production with high performance and security! 🚀