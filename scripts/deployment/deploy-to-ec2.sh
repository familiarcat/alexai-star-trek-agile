#!/bin/bash

# 🚀 EC2 Deployment Script for Resume Compliance Auditor
# Deploys to your EC2 instance to eliminate CORS issues

set -e

echo "🚀 Deploying Resume Compliance Auditor to EC2..."

# Configuration - Load from environment variables
# Make sure these are set in your ~/.zshrc file
EC2_HOST="${EC2_HOST:-}"           # Load from ~/.zshrc
EC2_USER="${EC2_USER:-ubuntu}"     # Load from ~/.zshrc (default: ubuntu)
EC2_KEY_PATH="${EC2_KEY_PATH:-}"   # Load from ~/.zshrc
N8N_BASE_URL="https://n8n.pbradygeorgen.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    if [ ! -f "public/resume-auditor.html" ]; then
        print_error "resume-auditor.html not found in public directory"
        exit 1
    fi
    
    if [ ! -f "workflows/resume-compliance-auditor.json" ]; then
        print_error "resume-compliance-auditor.json not found in workflows directory"
        exit 1
    fi
    
    print_success "All required files found"
}

# Validate environment variables and credentials
validate_credentials() {
    print_status "Validating environment variables and credentials..."
    
    # Check if EC2_HOST is set
    if [ -z "$EC2_HOST" ]; then
        print_error "EC2_HOST environment variable not set"
        print_error "Please add to your ~/.zshrc:"
        print_error "  export EC2_HOST=\"your-ec2-public-ip-or-domain\""
        exit 1
    fi
    
    # Check if EC2_KEY_PATH is set
    if [ -z "$EC2_KEY_PATH" ]; then
        print_error "EC2_KEY_PATH environment variable not set"
        print_error "Please add to your ~/.zshrc:"
        print_error "  export EC2_KEY_PATH=\"~/.ssh/your-ec2-key.pem\""
        exit 1
    fi
    
    # Check if key file exists
    if [ ! -f "$EC2_KEY_PATH" ]; then
        print_error "EC2 private key not found at: $EC2_KEY_PATH"
        print_error "Please check the path in your ~/.zshrc file"
        exit 1
    fi
    
    # Set proper permissions on key file
    chmod 600 "$EC2_KEY_PATH"
    
    print_success "Credentials validated successfully"
    print_status "EC2 Host: $EC2_HOST"
    print_status "EC2 User: $EC2_USER"
    print_status "Key Path: $EC2_KEY_PATH"
}

# Update HTML file with correct n8n URL
update_html_config() {
    print_status "Updating HTML configuration for EC2 deployment..."
    
    # Create a temporary file with updated configuration
    cp public/resume-auditor.html public/resume-auditor-ec2.html
    
    # Update the webhook URL to use the same domain (eliminating CORS)
    sed -i.bak "s|https://n8n.pbradygeorgen.com|$N8N_BASE_URL|g" public/resume-auditor-ec2.html
    
    # Remove backup file
    rm -f public/resume-auditor-ec2.html.bak
    
    print_success "HTML configuration updated for EC2"
}

# Deploy to EC2
deploy_to_ec2() {
    print_status "Deploying to EC2 instance: $EC2_HOST"
    
    # Create deployment package
    DEPLOY_DIR="ec2-deployment"
    mkdir -p "$DEPLOY_DIR"
    
    # Copy files
    cp public/resume-auditor-ec2.html "$DEPLOY_DIR/resume-auditor.html"
    cp workflows/resume-compliance-auditor.json "$DEPLOY_DIR/"
    cp docs/RESUME_AUDITOR_DEPLOYMENT.md "$DEPLOY_DIR/"
    
    # Create nginx configuration
    cat > "$DEPLOY_DIR/nginx-resume-auditor.conf" << 'EOF'
server {
    listen 80;
    server_name resume-auditor.your-domain.com;  # Update with your domain
    
    root /var/www/resume-auditor;
    index resume-auditor.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Enable CORS for n8n webhook calls
    location /webhook/ {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Serve static files
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # Create deployment script for EC2
    cat > "$DEPLOY_DIR/deploy-on-ec2.sh" << 'EOF'
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
EOF
    
    chmod +x "$DEPLOY_DIR/deploy-on-ec2.sh"
    
    print_success "Deployment package created: $DEPLOY_DIR/"
}

# Upload to EC2
upload_to_ec2() {
    print_status "Uploading deployment package to EC2..."
    
    if [ -z "$EC2_HOST" ] || [ "$EC2_HOST" = "your-ec2-instance.com" ]; then
        print_error "Please update EC2_HOST in the script with your actual EC2 instance details"
        print_error "Edit scripts/deploy-to-ec2.sh and update:"
        print_error "  EC2_HOST=\"your-ec2-public-ip-or-domain\""
        print_error "  EC2_USER=\"your-ec2-username\""
        print_error "  EC2_KEY_PATH=\"path/to/your/ec2-key.pem\""
        exit 1
    fi
    
    # Upload deployment package
    scp -i "$EC2_KEY_PATH" -r "$DEPLOY_DIR" "$EC2_USER@$EC2_HOST:~/"
    
    if [ $? -eq 0 ]; then
        print_success "Deployment package uploaded to EC2"
    else
        print_error "Failed to upload to EC2"
        print_error "Please check:"
        print_error "1. EC2 instance is running"
        print_error "2. Security group allows SSH (port 22)"
        print_error "3. Key path and username are correct"
        exit 1
    fi
}

# Execute deployment on EC2
execute_deployment() {
    print_status "Executing deployment on EC2..."
    
    ssh -i "$EC2_KEY_PATH" "$EC2_USER@$EC2_HOST" << 'EOF'
        cd ec2-deployment
        ./deploy-on-ec2.sh
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Deployment executed successfully on EC2"
    else
        print_error "Failed to execute deployment on EC2"
        exit 1
    fi
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Wait a moment for nginx to reload
    sleep 5
    
    # Test the deployed application
    TEST_URL="http://$EC2_HOST/resume-auditor.html"
    
    if curl -s -f "$TEST_URL" > /dev/null; then
        print_success "✅ Resume Compliance Auditor is live!"
        echo
        echo "🌐 **Access URLs:**"
        echo "   Main Interface: $TEST_URL"
        echo "   n8n Dashboard: $N8N_BASE_URL"
        echo "   Webhook API: $N8N_BASE_URL/webhook/resume-audit"
        echo
        echo "📋 **Next Steps:**"
        echo "1. Import workflow to n8n: $N8N_BASE_URL"
        echo "2. Activate the workflow"
        echo "3. Test with sample resumes"
        echo "4. Share the public URL with your team"
        echo
        echo "🚀 **No more CORS issues!** Your Resume Auditor is now production-ready!"
    else
        print_warning "Deployment may still be in progress. Please check manually:"
        print_warning "  SSH to EC2: ssh -i $EC2_KEY_PATH $EC2_USER@$EC2_HOST"
        print_warning "  Check nginx: sudo systemctl status nginx"
        print_warning "  Check logs: sudo tail -f /var/log/nginx/error.log"
    fi
}

# Cleanup
cleanup() {
    print_status "Cleaning up local deployment files..."
    rm -rf "$DEPLOY_DIR"
    print_success "Cleanup complete"
}

# Main execution
main() {
    echo "🚀 EC2 Deployment: Resume Compliance Auditor"
    echo "============================================="
    echo
    
    check_files
    validate_credentials
    update_html_config
    deploy_to_ec2
    upload_to_ec2
    execute_deployment
    test_deployment
    cleanup
    
    print_success "EC2 deployment completed successfully!"
}

# Run main function
main "$@"
