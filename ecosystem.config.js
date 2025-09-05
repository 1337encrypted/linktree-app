module.exports = {
  apps: [{
    name: 'linktree-app',
    script: './server.js',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G', // Increased memory limit for performance
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // High-performance optimizations
    node_args: '--max-old-space-size=1024 --optimize-for-size',
    kill_timeout: 5000,
    listen_timeout: 3000,
    max_restarts: 10,
    min_uptime: '30s',
    // Advanced performance settings
    increment_var: 'PORT',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}