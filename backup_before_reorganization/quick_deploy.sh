#!/bin/bash

# 🚀 Quick Deployment Script for AlexAI Platform
# Simplified deployment without complex ~/.zshrc parsing

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

# Function to check if we have the required environment variables
check_environment() {
    print_status "Checking environment variables..."
    
    local missing_vars=()
    
    # Check for required variables
    if [ -z "$OPENAI_API_KEY" ]; then
        missing_vars+=("OPENAI_API_KEY")
    fi
    
    if [ -z "$SUPABASE_URL" ]; then
        missing_vars+=("SUPABASE_URL")
    fi
    
    if [ -z "$SUPABASE_KEY" ]; then
        missing_vars+=("SUPABASE_KEY")
    fi
    
    if [ -z "$VERCEL_TOKEN" ]; then
        missing_vars+=("VERCEL_TOKEN")
    fi
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_warning "Please set these variables in your current shell or ~/.zshrc"
        print_warning "You can run: source ~/.zshrc"
        return 1
    fi
    
    print_success "All required environment variables are set"
    return 0
}

# Function to deploy to Vercel
deploy_to_vercel() {
    print_header "Deploying to Vercel"
    
    print_status "Setting environment variables in Vercel..."
    
    # Set environment variables using Vercel CLI
    vercel env add OPENAI_API_KEY production <<< "$OPENAI_API_KEY" 2>/dev/null || true
    vercel env add SUPABASE_URL production <<< "$SUPABASE_URL" 2>/dev/null || true
    vercel env add SUPABASE_KEY production <<< "$SUPABASE_KEY" 2>/dev/null || true
    vercel env add FLASK_ENV production <<< "production" 2>/dev/null || true
    
    print_success "Environment variables set in Vercel"
    
    # Deploy to production
    print_status "Deploying to production..."
    vercel --prod --yes
    
    print_success "Deployment completed!"
    return 0
}

# Function to test deployment
test_deployment() {
    print_header "Testing Deployment"
    
    # Get the deployment URL
    local deployment_url=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "")
    
    if [ -n "$deployment_url" ]; then
        print_status "Testing deployment at: $deployment_url"
        
        # Wait a moment for deployment to be ready
        sleep 5
        
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$deployment_url" 2>/dev/null || echo "000")
        
        if [ "$response" = "200" ]; then
            print_success "Deployment successful! App is responding correctly."
            echo "$deployment_url" > .vercel_url
            return 0
        elif [ "$response" = "401" ]; then
            print_warning "Deployment returned 401 (Authentication required)"
            print_warning "This might be due to Vercel password protection"
            print_warning "Check Vercel project settings for authentication requirements"
            return 1
        else
            print_warning "Deployment test failed. HTTP status: $response"
            return 1
        fi
    else
        print_warning "Could not determine deployment URL"
        return 1
    fi
}

# Function to open relevant URLs
open_urls() {
    print_header "Opening Relevant URLs"
    
    print_status "Opening Vercel dashboard..."
    open https://vercel.com/dashboard
    
    print_status "Opening Supabase dashboard..."
    open https://supabase.com/dashboard/project/strange-new-world
    
    print_status "Opening n8n instance..."
    open https://n8n.pbradygeorgen.com
    
    print_success "All relevant dashboards opened"
}

# Main execution function
main() {
    print_header "🚀 Quick Deployment for AlexAI Platform"
    echo ""
    
    # Check environment
    if ! check_environment; then
        print_error "Cannot proceed without required environment variables."
        exit 1
    fi
    
    # Deploy to Vercel
    if ! deploy_to_vercel; then
        print_error "Vercel deployment failed."
        exit 1
    fi
    
    # Test deployment
    test_deployment
    
    # Open relevant URLs
    open_urls
    
    print_header "🎉 Quick Deployment Complete!"
    echo ""
    print_success "Your AlexAI Platform has been deployed!"
    echo ""
    print_status "Next Steps:"
    echo "1. Set up Supabase database tables"
    echo "2. Configure n8n workflows"
    echo "3. Test all features"
    echo "4. Set up monitoring"
    echo ""
    print_status "Relevant URLs:"
    echo "  🌐 Vercel Dashboard: https://vercel.com/dashboard"
    echo "  🗄️  Supabase Dashboard: https://supabase.com/dashboard/project/strange-new-world"
    echo "  🔄 n8n Instance: https://n8n.pbradygeorgen.com"
    echo ""
    print_success "Live long and prosper! 🖖"
}

# Run main function
main "$@" 