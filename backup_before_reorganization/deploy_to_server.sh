#!/bin/bash

# 🚀 AlexAI Enterprise Platform - Server Deployment Script
# Run this script on the AWS EC2 instance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_header "🚀 AlexAI Enterprise Platform - Server Deployment"

# Update system
print_status "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install dependencies
print_status "Installing system dependencies..."
sudo apt-get install -y python3 python3-pip python3-venv nginx git curl wget

# Install Node.js
print_status "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application directory
print_status "Setting up application directory..."
sudo mkdir -p /opt/alexai
sudo chown ubuntu:ubuntu /opt/alexai
cd /opt/alexai

# Clone repository
print_status "Cloning repository..."
git clone https://github.com/familiarcat/alexai-star-trek-agile.git .
git checkout main

# Set up Python environment
print_status "Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Set up environment variables
print_status "Setting up environment variables..."
cat > .env << 'ENVEOF'
FLASK_ENV=production
FLASK_SECRET_KEY=$(openssl rand -hex 32)
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
ENVEOF

# Set up systemd service
print_status "Setting up systemd service..."
sudo tee /etc/systemd/system/alexai.service > /dev/null << 'SERVICEEOF'
[Unit]
Description=AlexAI Enterprise Platform
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/alexai
Environment=PATH=/opt/alexai/venv/bin
ExecStart=/opt/alexai/venv/bin/python app.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Configure Nginx
print_status "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/alexai > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name agile.pbradygeorgen.com _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        access_log off;
    }
}
NGINXEOF

# Enable site and restart Nginx
print_status "Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/alexai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start application
print_status "Starting AlexAI application..."
sudo systemctl daemon-reload
sudo systemctl enable alexai
sudo systemctl start alexai

# Wait for application to start
print_status "Waiting for application to start..."
sleep 10

# Check application status
if sudo systemctl is-active --quiet alexai; then
    print_success "Application started successfully!"
else
    print_error "Application failed to start. Checking logs..."
    sudo journalctl -u alexai --no-pager -n 20
    exit 1
fi

# Test application
print_status "Testing application..."
if curl -s http://localhost:8000 > /dev/null; then
    print_success "Application is responding on localhost:8000"
else
    print_warning "Application not responding on localhost:8000"
fi

# Install SSL certificate (optional)
print_status "Installing SSL certificate..."
sudo apt-get install -y certbot python3-certbot-nginx

# Note: You'll need to update the email address and ensure DNS is configured
# sudo certbot --nginx -d agile.pbradygeorgen.com --non-interactive --agree-tos --email your-email@example.com

print_header "🎉 Deployment Complete!"

print_success "AlexAI Enterprise Platform deployed successfully!"
print_success "Application URL: http://agile.pbradygeorgen.com"
print_success "Local URL: http://localhost:8000"

print_status "Useful commands:"
print_status "  Check status: sudo systemctl status alexai"
print_status "  View logs: sudo journalctl -u alexai -f"
print_status "  Restart: sudo systemctl restart alexai"
print_status "  Stop: sudo systemctl stop alexai"

print_status "Next steps:"
print_status "1. Update environment variables in /opt/alexai/.env"
print_status "2. Configure DNS to point agile.pbradygeorgen.com to this server"
print_status "3. Install SSL certificate: sudo certbot --nginx -d agile.pbradygeorgen.com"
print_status "4. Test the application at http://agile.pbradygeorgen.com"

print_header "🖖 Live long and prosper!" 