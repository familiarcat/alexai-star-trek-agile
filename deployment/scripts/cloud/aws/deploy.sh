#!/bin/bash

# 🚀 AWS Deployment Script for AlexAI Enterprise Platform
# Deploys the complete platform to AWS EC2 with optimized infrastructure

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

# Configuration
PROJECT_NAME="alexai-enterprise-platform"
DOMAIN="pbradygeorgen.com"
SUBDOMAIN="agile"
INSTANCE_TYPE="t3.medium"
REGION="us-east-1"
KEY_NAME="alexai-key"

print_header "🚀 AlexAI Enterprise Platform - AWS Deployment"

# Check prerequisites
print_status "Checking prerequisites..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

# Get AWS account info
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region || echo $REGION)

print_success "AWS CLI configured for account: $AWS_ACCOUNT_ID in region: $AWS_REGION"

# Create or get key pair
print_status "Setting up SSH key pair..."
if ! aws ec2 describe-key-pairs --key-names "$KEY_NAME" &> /dev/null; then
    print_status "Creating new key pair: $KEY_NAME"
    aws ec2 create-key-pair --key-name "$KEY_NAME" --query 'KeyMaterial' --output text > "$KEY_NAME.pem"
    chmod 400 "$KEY_NAME.pem"
    print_success "Key pair created and saved to $KEY_NAME.pem"
else
    print_status "Key pair $KEY_NAME already exists"
    if [ ! -f "$KEY_NAME.pem" ]; then
        print_warning "Key file $KEY_NAME.pem not found. You may need to recreate the key pair."
    fi
fi

# Create security group
print_status "Setting up security group..."
SG_NAME="${PROJECT_NAME}-sg"
SG_ID=$(aws ec2 create-security-group \
    --group-name "$SG_NAME" \
    --description "Security group for AlexAI Enterprise Platform" \
    --query 'GroupId' --output text 2>/dev/null || \
    aws ec2 describe-security-groups --group-names "$SG_NAME" --query 'SecurityGroups[0].GroupId' --output text)

# Configure security group rules
print_status "Configuring security group rules..."
aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0 2>/dev/null || true

print_success "Security group configured: $SG_ID"

# Get latest Ubuntu AMI
print_status "Getting latest Ubuntu AMI..."
AMI_ID=$(aws ec2 describe-images \
    --owners 099720109477 \
    --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
    --query 'sort_by(Images, &CreationDate)[-1].ImageId' \
    --output text)

print_success "Using AMI: $AMI_ID"

# Create EC2 instance
print_status "Creating EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id "$AMI_ID" \
    --count 1 \
    --instance-type "$INSTANCE_TYPE" \
    --key-name "$KEY_NAME" \
    --security-group-ids "$SG_ID" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$PROJECT_NAME},{Key=Project,Value=AlexAI},{Key=Environment,Value=Production}]" \
    --query 'Instances[0].InstanceId' \
    --output text)

print_success "EC2 instance created: $INSTANCE_ID"

# Wait for instance to be running
print_status "Waiting for instance to be running..."
aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids "$INSTANCE_ID" \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

print_success "Instance is running with public IP: $PUBLIC_IP"

# Wait for SSH to be available
print_status "Waiting for SSH to be available..."
until ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -i "$KEY_NAME.pem" ubuntu@"$PUBLIC_IP" "echo 'SSH connection successful'" 2>/dev/null; do
    print_status "Waiting for SSH connection..."
    sleep 10
done

print_success "SSH connection established"

# Deploy application
print_status "Deploying AlexAI Enterprise Platform..."

# Create deployment script
cat > deploy_app.sh << 'EOF'
#!/bin/bash
set -e

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install dependencies
sudo apt-get install -y python3 python3-pip python3-venv nginx git curl

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application directory
sudo mkdir -p /opt/alexai
sudo chown ubuntu:ubuntu /opt/alexai
cd /opt/alexai

# Clone repository (replace with your actual repo URL)
git clone https://github.com/familiarcat/alexai-star-trek-agile.git .
git checkout main

# Set up Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set up environment variables
cat > .env << 'ENVEOF'
FLASK_ENV=production
FLASK_SECRET_KEY=$(openssl rand -hex 32)
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
ENVEOF

# Set up systemd service
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

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Configure Nginx
sudo tee /etc/nginx/sites-available/alexai > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name agile.pbradygeorgen.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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
    }
}
NGINXEOF

# Enable site and restart Nginx
sudo ln -sf /etc/nginx/sites-available/alexai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Start application
sudo systemctl daemon-reload
sudo systemctl enable alexai
sudo systemctl start alexai

# Install SSL certificate (optional)
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d agile.pbradygeorgen.com --non-interactive --agree-tos --email your-email@example.com

echo "Deployment completed successfully!"
EOF

# Copy deployment script to instance
scp -i "$KEY_NAME.pem" deploy_app.sh ubuntu@"$PUBLIC_IP":~/

# Execute deployment script
print_status "Executing deployment script..."
ssh -i "$KEY_NAME.pem" ubuntu@"$PUBLIC_IP" "chmod +x deploy_app.sh && ./deploy_app.sh"

# Clean up local deployment script
rm deploy_app.sh

print_header "🎉 Deployment Complete!"

print_success "AlexAI Enterprise Platform deployed successfully!"
print_success "Instance ID: $INSTANCE_ID"
print_success "Public IP: $PUBLIC_IP"
print_success "Domain: https://agile.pbradygeorgen.com"
print_success "SSH Access: ssh -i $KEY_NAME.pem ubuntu@$PUBLIC_IP"

print_status "Next steps:"
print_status "1. Update DNS records to point agile.pbradygeorgen.com to $PUBLIC_IP"
print_status "2. Update environment variables in /opt/alexai/.env"
print_status "3. Restart the service: sudo systemctl restart alexai"
print_status "4. Monitor logs: sudo journalctl -u alexai -f"

print_header "🖖 Live long and prosper!" 