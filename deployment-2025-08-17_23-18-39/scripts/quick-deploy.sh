#!/bin/bash

# 🚀 Quick Deploy Script - Resume Compliance Auditor
# Handles the entire secure deployment process

set -e

echo "🚀 Quick Deploy: Resume Compliance Auditor to EC2"
echo "=================================================="
echo

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

# Check if we're in the right directory
check_environment() {
    print_status "Checking deployment environment..."
    
    if [ ! -f "scripts/deploy-to-ec2.sh" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    if [ ! -f "scripts/setup-ec2-credentials.sh" ]; then
        print_error "Credential setup script not found"
        exit 1
    fi
    
    print_success "Environment check passed"
}

# Check if credentials are already set
check_existing_credentials() {
    print_status "Checking for existing EC2 credentials..."
    
    if [ ! -z "$EC2_HOST" ] && [ ! -z "$EC2_KEY_PATH" ]; then
        print_success "EC2 credentials found in environment"
        
        # Test connectivity
        print_status "Testing EC2 connectivity..."
        if ssh -i "$EC2_KEY_PATH" -o ConnectTimeout=10 -o BatchMode=yes "$EC2_USER@$EC2_HOST" "echo 'Connection test successful'" 2>/dev/null; then
            print_success "EC2 connectivity verified"
            return 0
        else
            print_warning "EC2 connectivity failed - credentials may need updating"
            return 1
        fi
    else
        print_status "No EC2 credentials found in environment"
        return 1
    fi
}

# Setup credentials if needed
setup_credentials() {
    print_status "Setting up EC2 credentials..."
    
    if ./scripts/setup-ec2-credentials.sh; then
        print_success "Credentials setup completed"
        
        # Reload environment variables
        print_status "Reloading environment variables..."
        source ~/.zshrc
        
        # Verify setup
        if [ ! -z "$EC2_HOST" ] && [ ! -z "$EC2_KEY_PATH" ]; then
            print_success "Environment variables loaded successfully"
            return 0
        else
            print_error "Failed to load environment variables"
            return 1
        fi
    else
        print_error "Credential setup failed"
        return 1
    fi
}

# Deploy to EC2
deploy_to_ec2() {
    print_status "Deploying Resume Compliance Auditor to EC2..."
    
    if ./scripts/deploy-to-ec2.sh; then
        print_success "Deployment completed successfully!"
        return 0
    else
        print_error "Deployment failed"
        return 1
    fi
}

# Main deployment flow
main() {
    echo "🔐 **Secure Deployment Process**"
    echo "================================"
    echo
    
    # Step 1: Environment check
    check_environment
    
    # Step 2: Check existing credentials
    if check_existing_credentials; then
        print_status "Using existing credentials"
    else
        print_status "Setting up new credentials"
        if ! setup_credentials; then
            print_error "Credential setup failed. Please run manually:"
            print_error "  ./scripts/setup-ec2-credentials.sh"
            exit 1
        fi
    fi
    
    # Step 3: Deploy
    if deploy_to_ec2; then
        echo
        print_success "🎉 **Deployment Complete!**"
        echo
        echo "🌐 **Access Your Resume Compliance Auditor:**"
        echo "   Main Interface: http://$EC2_HOST/resume-auditor.html"
        echo "   n8n Dashboard: https://n8n.pbradygeorgen.com"
        echo "   Webhook API: https://n8n.pbradygeorgen.com/webhook/resume-audit"
        echo
        echo "📋 **Next Steps:**"
        echo "1. Import workflow to n8n: https://n8n.pbradygeorgen.com"
        echo "2. Activate the workflow in n8n dashboard"
        echo "3. Test with sample resumes"
        echo "4. Share the public URL with your team"
        echo
        echo "🚀 **No more CORS issues!** Your Resume Auditor is production-ready!"
        echo
        echo "🔒 **Security Status:** ✅ All credentials stored securely in ~/.zshrc"
    else
        print_error "Deployment failed. Please check the error messages above."
        exit 1
    fi
}

# Check for help flag
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "🚀 Quick Deploy Script - Resume Compliance Auditor"
    echo "=================================================="
    echo
    echo "Usage: ./scripts/quick-deploy.sh [OPTIONS]"
    echo
    echo "Options:"
    echo "  --help, -h     Show this help message"
    echo "  --check        Check deployment readiness"
    echo
    echo "This script will:"
    echo "1. Check your deployment environment"
    echo "2. Set up EC2 credentials securely (if needed)"
    echo "3. Deploy the Resume Compliance Auditor to EC2"
    echo "4. Provide access URLs and next steps"
    echo
    echo "🔐 **Security Features:**"
    echo "- Credentials stored in ~/.zshrc (never hardcoded)"
    echo "- Automatic credential validation"
    echo "- Secure file permissions"
    echo "- No secrets in version control"
    echo
    echo "📚 **Documentation:**"
    echo "- Security Guide: docs/SECURE_DEPLOYMENT_GUIDE.md"
    echo "- EC2 Setup: docs/EC2_DEPLOYMENT_QUICK_START.md"
    echo "- Resume Auditor: docs/RESUME_AUDITOR_DEPLOYMENT.md"
    exit 0
fi

# Check for check flag
if [ "$1" = "--check" ]; then
    echo "🔍 **Deployment Readiness Check**"
    echo "================================"
    echo
    
    check_environment
    
    if check_existing_credentials; then
        print_success "✅ Ready to deploy!"
        echo
        echo "🌐 **Your Resume Auditor will be available at:**"
        echo "   http://$EC2_HOST/resume-auditor.html"
        echo
        echo "🚀 **Run deployment:**"
        echo "   ./scripts/quick-deploy.sh"
    else
        print_warning "⚠️  Not ready to deploy"
        echo
        echo "📋 **Missing Requirements:**"
        echo "1. EC2 credentials not set up"
        echo "2. Run: ./scripts/setup-ec2-credentials.sh"
        echo
        echo "🔐 **Or run the full setup:**"
        echo "   ./scripts/quick-deploy.sh"
    fi
    exit 0
fi

# Run main deployment
main "$@"
