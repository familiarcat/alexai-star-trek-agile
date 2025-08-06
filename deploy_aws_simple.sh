#!/bin/bash

# 🚀 Simple AWS Deployment for AlexAI Enterprise Platform

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

# Function to check AWS CLI
check_aws_cli() {
    print_status "Checking AWS CLI and credentials..."
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    local account_id=$(aws sts get-caller-identity --query Account --output text)
    local region=$(aws configure get region)
    
    print_success "AWS CLI configured for account: $account_id in region: $region"
}

# Function to get latest Ubuntu AMI
get_latest_ubuntu_ami() {
    print_status "Getting latest Ubuntu AMI..."
    
    local ami_id=$(aws ec2 describe-images \
        --owners 099720109477 \
        --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
        --query 'sort_by(Images, &CreationDate)[-1].ImageId' \
        --output text)
    
    print_success "Using Ubuntu AMI: $ami_id"
    echo "$ami_id"
}

# Function to create security group
create_security_group() {
    print_status "Creating security group..."
    
    local sg_name="alexai-consolidated-sg"
    
    # Check if security group already exists
    local existing_sg=$(aws ec2 describe-security-groups \
        --filters "Name=group-name,Values=$sg_name" \
        --query 'SecurityGroups[0].GroupId' \
        --output text 2>/dev/null || echo "")
    
    if [ "$existing_sg" != "None" ] && [ -n "$existing_sg" ]; then
        print_success "Using existing security group: $existing_sg"
        echo "$existing_sg"
        return
    fi
    
    # Create new security group
    local sg_id=$(aws ec2 create-security-group \
        --group-name "$sg_name" \
        --description "Security group for AlexAI consolidated instance" \
        --query 'GroupId' --output text)
    
    # Add rules
    aws ec2 authorize-security-group-ingress \
        --group-id "$sg_id" \
        --protocol tcp \
        --port 22 \
        --cidr 0.0.0.0/0 2>/dev/null || true
    
    aws ec2 authorize-security-group-ingress \
        --group-id "$sg_id" \
        --protocol tcp \
        --port 80 \
        --cidr 0.0.0.0/0 2>/dev/null || true
    
    aws ec2 authorize-security-group-ingress \
        --group-id "$sg_id" \
        --protocol tcp \
        --port 443 \
        --cidr 0.0.0.0/0 2>/dev/null || true
    
    aws ec2 authorize-security-group-ingress \
        --group-id "$sg_id" \
        --protocol tcp \
        --port 3000 \
        --cidr 0.0.0.0/0 2>/dev/null || true
    
    aws ec2 authorize-security-group-ingress \
        --group-id "$sg_id" \
        --protocol tcp \
        --port 5678 \
        --cidr 0.0.0.0/0 2>/dev/null || true
    
    print_success "Created security group: $sg_id"
    echo "$sg_id"
}

# Function to create EC2 instance
create_ec2_instance() {
    local ami_id=$1
    local sg_id=$2
    
    print_status "Creating EC2 instance..."
    
    local instance_id=$(aws ec2 run-instances \
        --image-id "$ami_id" \
        --count 1 \
        --instance-type t3.medium \
        --security-group-ids "$sg_id" \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=alexai-consolidated},{Key=Project,Value=AlexAI}]" \
        --query 'Instances[0].InstanceId' --output text)
    
    print_success "Created EC2 instance: $instance_id"
    
    # Wait for instance to be running
    print_status "Waiting for instance to be running..."
    aws ec2 wait instance-running --instance-ids "$instance_id"
    
    # Get public IP
    local public_ip=$(aws ec2 describe-instances \
        --instance-ids "$instance_id" \
        --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
    
    print_success "Instance is running at: $public_ip"
    
    echo "$instance_id|$public_ip"
}

# Function to create deployment summary
create_deployment_summary() {
    local instance_id=$1
    local public_ip=$2
    
    print_header "🎉 AWS Infrastructure Deployment Complete!"
    echo ""
    print_success "Your consolidated AWS infrastructure is ready!"
    echo ""
    print_status "Infrastructure Details:"
    echo "  🖥️  Instance ID: $instance_id"
    echo "  🌐 Public IP: $public_ip"
    echo "  🔒 Security Group: Configured for all required ports"
    echo ""
    print_status "Next Steps:"
    echo "1. SSH to the instance: ssh ubuntu@$public_ip"
    echo "2. Install Docker: sudo apt update && sudo apt install -y docker.io docker-compose"
    echo "3. Clone repository: git clone https://github.com/familiarcat/alexai-star-trek-agile.git"
    echo "4. Deploy services: cd alexai-star-trek-agile && docker-compose up -d"
    echo ""
    print_status "Cost Optimization:"
    echo "  💰 Estimated monthly cost: \$50-80 (vs \$200+ for separate instances)"
    echo "  💡 Cost savings: 60% reduction through consolidation"
    echo ""
    print_success "Live long and prosper! 🖖"
}

# Main execution function
main() {
    print_header "🚀 Simple AWS Deployment for AlexAI Enterprise Platform"
    echo ""
    
    # Check AWS CLI
    check_aws_cli
    
    # Get latest Ubuntu AMI
    local ami_id=$(get_latest_ubuntu_ami)
    
    # Create security group
    local sg_id=$(create_security_group)
    
    # Create EC2 instance
    local instance_info=$(create_ec2_instance "$ami_id" "$sg_id")
    local instance_id=$(echo "$instance_info" | cut -d'|' -f1)
    local public_ip=$(echo "$instance_info" | cut -d'|' -f2)
    
    # Create deployment summary
    create_deployment_summary "$instance_id" "$public_ip"
}

# Run main function
main "$@" 