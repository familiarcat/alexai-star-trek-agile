#!/bin/bash

# 🚀 AWS Infrastructure Setup for AlexAI Enterprise Platform
# Creates the basic infrastructure for deployment

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
KEY_NAME="alexai-key"
INSTANCE_TYPE="t3.medium"
REGION="us-east-1"

print_header "🚀 AWS Infrastructure Setup"

# Check AWS CLI and credentials
print_status "Checking AWS CLI and credentials..."

if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

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

print_header "🎉 Infrastructure Setup Complete!"

print_success "AWS infrastructure created successfully!"
print_success "Instance ID: $INSTANCE_ID"
print_success "Public IP: $PUBLIC_IP"
print_success "Security Group: $SG_ID"
print_success "SSH Access: ssh -i $KEY_NAME.pem ubuntu@$PUBLIC_IP"

print_status "Next steps:"
print_status "1. SSH into the instance: ssh -i $KEY_NAME.pem ubuntu@$PUBLIC_IP"
print_status "2. Clone the repository: git clone https://github.com/familiarcat/alexai-star-trek-agile.git"
print_status "3. Set up the application manually or run the full deployment script"
print_status "4. Configure DNS to point your domain to $PUBLIC_IP"

print_header "🖖 Infrastructure ready for deployment!" 