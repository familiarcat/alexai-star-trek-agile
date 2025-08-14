#!/bin/bash

# EC2 Deployment Script
set -e

echo "🚀 Deploying Resume Compliance Auditor on EC2..."

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Create web directory
sudo mkdir -p /var/www/resume-auditor
sudo chown $USER:$USER /var/www/resume-auditor

# Copy files
cp resume-auditor.html /var/www/resume-auditor/
cp resume-compliance-auditor.json /var/www/resume-auditor/

# Set permissions
sudo chown -R www-data:www-data /var/www/resume-auditor
sudo chmod -R 755 /var/www/resume-auditor

# Configure nginx
sudo cp nginx-resume-auditor.conf /etc/nginx/sites-available/resume-auditor
sudo ln -sf /etc/nginx/sites-available/resume-auditor /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

echo "✅ Resume Compliance Auditor deployed successfully!"
echo "🌐 Access at: http://$(curl -s ifconfig.me)/resume-auditor.html"
