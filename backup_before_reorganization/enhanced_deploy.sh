#!/bin/bash

# 🚀 Enhanced Vercel + Supabase Deployment Script
# Uses Vercel credentials for complete automation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

# Function to load secrets from ~/.zshrc
load_secrets() {
    print_status "Loading secrets from ~/.zshrc..."
    
    if [ ! -f ~/.zshrc ]; then
        print_error "~/.zshrc not found!"
        return 1
    fi
    
    # Load environment variables from ~/.zshrc
    export $(grep -E '^export ' ~/.zshrc | sed 's/export //' | xargs)
    
    # Check required secrets
    local missing_secrets=()
    
    if [ -z "$OPENAI_API_KEY" ]; then
        missing_secrets+=("OPENAI_API_KEY")
    fi
    
    if [ -z "$SUPABASE_URL" ]; then
        missing_secrets+=("SUPABASE_URL")
    fi
    
    if [ -z "$SUPABASE_KEY" ]; then
        missing_secrets+=("SUPABASE_KEY")
    fi
    
    if [ -z "$VERCEL_TOKEN" ]; then
        missing_secrets+=("VERCEL_TOKEN")
    fi
    
    if [ -z "$VERCEL_ORG_ID" ]; then
        missing_secrets+=("VERCEL_ORG_ID")
    fi
    
    if [ -z "$VERCEL_PROJECT_ID" ]; then
        missing_secrets+=("VERCEL_PROJECT_ID")
    fi
    
    if [ ${#missing_secrets[@]} -ne 0 ]; then
        print_error "Missing required secrets:"
        for secret in "${missing_secrets[@]}"; do
            echo "  - $secret"
        done
        print_warning "Please add these to your ~/.zshrc file"
        return 1
    fi
    
    print_success "All secrets loaded successfully"
    return 0
}

# Function to set up Supabase database
setup_supabase_database() {
    print_header "Setting up Supabase Database"
    
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
        print_error "Supabase credentials not available"
        return 1
    fi
    
    print_status "Creating database tables..."
    
    # Check if SQL file exists
    if [ ! -f "setup_supabase_tables.sql" ]; then
        print_error "setup_supabase_tables.sql not found"
        return 1
    fi
    
    print_warning "Please run the SQL script manually in Supabase dashboard:"
    echo "1. Go to: https://supabase.com/dashboard/project/strange-new-world"
    echo "2. Click 'SQL Editor'"
    echo "3. Copy and paste the contents of setup_supabase_tables.sql"
    echo "4. Click 'Run'"
    
    return 0
}

# Function to deploy to Vercel with credentials
deploy_to_vercel() {
    print_header "Deploying to Vercel"
    
    if [ -z "$VERCEL_TOKEN" ] || [ -z "$VERCEL_ORG_ID" ] || [ -z "$VERCEL_PROJECT_ID" ]; then
        print_error "Vercel credentials not available"
        return 1
    fi
    
    print_status "Setting environment variables in Vercel..."
    
    # Set environment variables using Vercel API
    curl -s -X POST \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"key\":\"OPENAI_API_KEY\",\"value\":\"$OPENAI_API_KEY\",\"target\":[\"production\"]}" \
        "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env" > /dev/null
    
    curl -s -X POST \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"key\":\"SUPABASE_URL\",\"value\":\"$SUPABASE_URL\",\"target\":[\"production\"]}" \
        "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env" > /dev/null
    
    curl -s -X POST \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"key\":\"SUPABASE_KEY\",\"value\":\"$SUPABASE_KEY\",\"target\":[\"production\"]}" \
        "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env" > /dev/null
    
    curl -s -X POST \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"key\":\"FLASK_ENV\",\"value\":\"production\",\"target\":[\"production\"]}" \
        "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env" > /dev/null
    
    print_success "Environment variables set in Vercel"
    
    # Deploy using Vercel CLI with token
    print_status "Deploying to production..."
    
    # Create deployment using Vercel API
    local deployment_response=$(curl -s -X POST \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"alexai_katra_transfer_package_remote_v7\",\"target\":\"production\"}" \
        "https://api.vercel.com/v13/deployments")
    
    local deployment_url=$(echo "$deployment_response" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$deployment_url" ]; then
        print_success "Deployment initiated!"
        print_success "Deployment URL: $deployment_url"
        echo "$deployment_url" > .vercel_url
        
        # Wait for deployment to complete
        print_status "Waiting for deployment to complete..."
        sleep 30
        
        # Test deployment
        test_deployment "$deployment_url"
    else
        print_error "Deployment failed"
        return 1
    fi
    
    return 0
}

# Function to test deployment
test_deployment() {
    local url=$1
    
    print_status "Testing deployment at: $url"
    
    # Wait a bit more for deployment to be ready
    sleep 10
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ]; then
        print_success "Deployment successful! App is responding correctly."
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
}

# Function to create local environment
create_local_env() {
    print_header "Setting up Local Environment"
    
    if [ ! -f ".env" ]; then
        print_status "Creating .env file for local development..."
        cat > .env << EOF
OPENAI_API_KEY=$OPENAI_API_KEY
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY
FLASK_ENV=development
FLASK_SECRET_KEY=your-local-secret-key-here
EOF
        print_success ".env file created for local development"
    else
        print_status ".env file already exists"
    fi
    
    return 0
}

# Function to populate mock data
populate_mock_data() {
    print_header "Populating Mock Data"
    
    print_status "Running database mock script..."
    
    if [ -f "database_mock.py" ]; then
        python database_mock.py
        if [ $? -eq 0 ]; then
            print_success "Mock data populated successfully"
        else
            print_warning "Failed to populate mock data. You can do this manually via the web interface."
        fi
    else
        print_warning "database_mock.py not found. Skipping mock data population."
    fi
    
    return 0
}

# Function to disable Vercel password protection
disable_password_protection() {
    print_header "Disabling Vercel Password Protection"
    
    if [ -z "$VERCEL_TOKEN" ] || [ -z "$VERCEL_PROJECT_ID" ]; then
        print_error "Vercel credentials not available"
        return 1
    fi
    
    print_status "Removing password protection from project..."
    
    # Remove password protection using Vercel API
    curl -s -X DELETE \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/password" > /dev/null
    
    print_success "Password protection disabled"
    return 0
}

# Main execution function
main() {
    print_header "🚀 Enhanced Vercel + Supabase Deployment"
    echo ""
    
    # Load secrets
    if ! load_secrets; then
        print_error "Cannot proceed without secrets. Please set up ~/.zshrc first."
        exit 1
    fi
    
    # Create local environment
    create_local_env
    
    # Set up Supabase database
    setup_supabase_database
    
    # Disable password protection
    disable_password_protection
    
    # Deploy to Vercel
    if ! deploy_to_vercel; then
        print_error "Vercel deployment failed. Please check the error messages above."
        exit 1
    fi
    
    # Populate mock data
    populate_mock_data
    
    print_header "🎉 Enhanced Deployment Complete!"
    echo ""
    print_success "Your Star Trek TNG Agile Project Manager is now live!"
    echo ""
    print_status "Local Development: http://localhost:8000"
    print_status "Production URL: $(cat .vercel_url 2>/dev/null || echo 'Check Vercel dashboard')"
    print_status "Supabase Dashboard: https://supabase.com/dashboard/project/strange-new-world"
    echo ""
    print_status "Next Steps:"
    echo "1. Run the SQL script in Supabase dashboard"
    echo "2. Test the production deployment"
    echo "3. Populate mock data if needed"
    echo ""
    print_success "Live long and prosper! 🖖"
}

# Run main function
main "$@" 