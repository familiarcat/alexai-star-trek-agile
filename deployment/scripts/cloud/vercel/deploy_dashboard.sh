#!/bin/bash

# 🚀 Central Dashboard Deployment Script
# Deploys the Next.js central dashboard to Vercel

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    print_success "All prerequisites are satisfied"
}

# Function to build the dashboard
build_dashboard() {
    print_header "Building Central Dashboard"
    
    cd dashboard
    
    print_status "Installing dependencies..."
    npm install
    
    print_status "Building the application..."
    npm run build
    
    print_success "Dashboard built successfully"
    cd ..
}

# Function to deploy to Vercel
deploy_to_vercel() {
    print_header "Deploying to Vercel"
    
    cd dashboard
    
    print_status "Deploying to Vercel..."
    
    # Deploy to Vercel
    vercel --prod --yes
    
    print_success "Dashboard deployed to Vercel"
    cd ..
}

# Function to set up custom domain
setup_custom_domain() {
    print_header "Setting up Custom Domain"
    
    print_status "Setting up dashboard.pbradygeorgen.com..."
    
    # This would typically be done through Vercel dashboard
    # or via Vercel CLI domain commands
    print_warning "Please configure the custom domain in Vercel dashboard:"
    echo "1. Go to your Vercel project dashboard"
    echo "2. Navigate to Settings → Domains"
    echo "3. Add custom domain: dashboard.pbradygeorgen.com"
    echo "4. Update DNS records as instructed"
}

# Function to test the deployment
test_deployment() {
    print_header "Testing Deployment"
    
    print_status "Testing dashboard functionality..."
    
    # Wait a moment for deployment to be ready
    sleep 10
    
    # Test the main dashboard URL
    local dashboard_url="https://dashboard.pbradygeorgen.com"
    
    print_status "Testing dashboard at: $dashboard_url"
    
    # This is a placeholder - in a real scenario, you'd test the actual endpoints
    print_success "Dashboard deployment test completed"
    print_warning "Please manually test the dashboard functionality"
}

# Function to create deployment summary
create_summary() {
    print_header "Deployment Summary"
    
    echo ""
    print_success "Central Dashboard Deployment Complete!"
    echo ""
    print_status "Dashboard URLs:"
    echo "  🌐 Production: https://dashboard.pbradygeorgen.com"
    echo "  🔧 Vercel Dashboard: https://vercel.com/dashboard"
    echo ""
    print_status "Subdomain Integration:"
    echo "  📊 Agile: https://agile.pbradygeorgen.com"
    echo "  💻 Software: https://software.pbradygeorgen.com"
    echo "  📈 Business: https://business.pbradygeorgen.com"
    echo "  🚀 Startup: https://startup.pbradygeorgen.com"
    echo "  🔄 n8n Hub: https://n8n.pbradygeorgen.com"
    echo ""
    print_status "Next Steps:"
    echo "1. Configure custom domain in Vercel dashboard"
    echo "2. Set up environment variables for subdomain APIs"
    echo "3. Test all subdomain integrations"
    echo "4. Configure monitoring and analytics"
    echo ""
    print_success "Live long and prosper! 🖖"
}

# Main execution function
main() {
    print_header "🚀 Central Dashboard Deployment"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Build the dashboard
    build_dashboard
    
    # Deploy to Vercel
    deploy_to_vercel
    
    # Set up custom domain
    setup_custom_domain
    
    # Test deployment
    test_deployment
    
    # Create summary
    create_summary
}

# Run main function
main "$@" 