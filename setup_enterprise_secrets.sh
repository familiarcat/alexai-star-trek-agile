#!/bin/bash

# 🔐 Enterprise Secrets Setup for AlexAI Platform
# Sets up all required secrets for the complete enterprise architecture

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

# Function to check if secret already exists
check_secret_exists() {
    local secret_name=$1
    if grep -q "export $secret_name=" ~/.zshrc; then
        return 0  # Secret exists
    else
        return 1  # Secret doesn't exist
    fi
}

# Function to add secret to ~/.zshrc
add_secret_to_zshrc() {
    local secret_name=$1
    local secret_value=$2
    local description=$3
    
    if check_secret_exists "$secret_name"; then
        print_warning "$secret_name already exists in ~/.zshrc"
        return 0
    fi
    
    echo "" >> ~/.zshrc
    echo "# $description" >> ~/.zshrc
    echo "export $secret_name='$secret_value'" >> ~/.zshrc
    
    print_success "Added $secret_name to ~/.zshrc"
}

# Function to get OpenAI API key
get_openai_key() {
    print_status "Setting up OpenAI API Key..."
    echo ""
    echo "To get your OpenAI API key:"
    echo "1. Go to https://platform.openai.com/api-keys"
    echo "2. Click 'Create new secret key'"
    echo "3. Copy the key (starts with 'sk-')"
    echo ""
    read -p "Enter your OpenAI API key: " openai_key
    
    if [[ $openai_key == sk-* ]]; then
        add_secret_to_zshrc "OPENAI_API_KEY" "$openai_key" "OpenAI API Key for AI features"
    else
        print_error "Invalid OpenAI API key format. Should start with 'sk-'"
        return 1
    fi
}

# Function to get Supabase credentials
get_supabase_credentials() {
    print_status "Setting up Supabase Credentials..."
    echo ""
    echo "To get your Supabase credentials:"
    echo "1. Go to https://supabase.com"
    echo "2. Create a new project or select existing"
    echo "3. Go to Settings → API"
    echo "4. Copy Project URL and anon public key"
    echo ""
    
    read -p "Enter your Supabase Project URL: " supabase_url
    read -p "Enter your Supabase anon public key: " supabase_key
    
    if [[ $supabase_url == https://*.supabase.co ]]; then
        add_secret_to_zshrc "SUPABASE_URL" "$supabase_url" "Supabase Project URL"
    else
        print_error "Invalid Supabase URL format. Should be https://*.supabase.co"
        return 1
    fi
    
    if [[ $supabase_key == eyJ* ]]; then
        add_secret_to_zshrc "SUPABASE_KEY" "$supabase_key" "Supabase anon public key"
    else
        print_error "Invalid Supabase key format. Should start with 'eyJ'"
        return 1
    fi
}

# Function to get Vercel credentials
get_vercel_credentials() {
    print_status "Setting up Vercel Credentials..."
    echo ""
    echo "To get your Vercel credentials:"
    echo "1. Go to https://vercel.com/account/tokens"
    echo "2. Click 'Create Token'"
    echo "3. Name: alexai-enterprise-token"
    echo "4. Copy the token (starts with 'vercel_')"
    echo ""
    read -p "Enter your Vercel token: " vercel_token
    
    if [[ ${#vercel_token} -gt 20 ]]; then
        add_secret_to_zshrc "VERCEL_TOKEN" "$vercel_token" "Vercel deployment token"
    else
        print_error "Invalid Vercel token format. Should be longer than 20 characters"
        return 1
    fi
    
    # Get Vercel organization and project IDs
    echo ""
    echo "Getting Vercel organization and project IDs..."
    
    # Check if vercel CLI is available
    if command -v vercel &> /dev/null; then
        # Get current project info
        if [ -f ".vercel/project.json" ]; then
            local org_id=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4)
            local project_id=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
            
            if [ -n "$org_id" ]; then
                add_secret_to_zshrc "VERCEL_ORG_ID" "$org_id" "Vercel organization ID"
            fi
            
            if [ -n "$project_id" ]; then
                add_secret_to_zshrc "VERCEL_PROJECT_ID" "$project_id" "Vercel project ID"
            fi
        else
            print_warning "Vercel project config not found. Please set VERCEL_ORG_ID and VERCEL_PROJECT_ID manually."
        fi
    else
        print_warning "Vercel CLI not found. Please set VERCEL_ORG_ID and VERCEL_PROJECT_ID manually."
    fi
}

# Function to get AWS credentials
get_aws_credentials() {
    print_status "Setting up AWS Credentials for Domain Management..."
    echo ""
    echo "To get your AWS credentials:"
    echo "1. Go to https://console.aws.amazon.com/iam/"
    echo "2. Create a new user or use existing"
    echo "3. Attach Route53FullAccess policy"
    echo "4. Create access keys"
    echo ""
    
    read -p "Enter your AWS Access Key ID: " aws_access_key
    read -p "Enter your AWS Secret Access Key: " aws_secret_key
    
    if [[ $aws_access_key == AKIA* ]]; then
        add_secret_to_zshrc "AWS_ACCESS_KEY_ID" "$aws_access_key" "AWS Access Key ID for Route 53"
    else
        print_error "Invalid AWS Access Key format. Should start with 'AKIA'"
        return 1
    fi
    
    if [[ ${#aws_secret_key} -gt 20 ]]; then
        add_secret_to_zshrc "AWS_SECRET_ACCESS_KEY" "$aws_secret_key" "AWS Secret Access Key for Route 53"
    else
        print_error "Invalid AWS Secret Key format. Should be longer than 20 characters"
        return 1
    fi
}

# Function to get n8n credentials
get_n8n_credentials() {
    print_status "Setting up n8n Central Hub Credentials..."
    echo ""
    echo "To get your n8n credentials:"
    echo "1. Go to your n8n instance at n8n.pbradygeorgen.com"
    echo "2. Go to Settings → API"
    echo "3. Create a new API key"
    echo ""
    
    read -p "Enter your n8n base URL (e.g., https://n8n.pbradygeorgen.com): " n8n_url
    read -p "Enter your n8n API key: " n8n_api_key
    
    if [[ $n8n_url == https://* ]]; then
        add_secret_to_zshrc "N8N_BASE_URL" "$n8n_url" "n8n central hub URL"
    else
        print_error "Invalid n8n URL format. Should start with 'https://'"
        return 1
    fi
    
    if [[ ${#n8n_api_key} -gt 10 ]]; then
        add_secret_to_zshrc "N8N_API_KEY" "$n8n_api_key" "n8n API key for workflow management"
    else
        print_error "Invalid n8n API key format. Should be longer than 10 characters"
        return 1
    fi
}

# Function to create ~/.zshrc if it doesn't exist
ensure_zshrc_exists() {
    if [ ! -f ~/.zshrc ]; then
        print_status "Creating ~/.zshrc file..."
        touch ~/.zshrc
        echo "# Zsh configuration file" >> ~/.zshrc
        echo "# Created by AlexAI Enterprise Platform setup" >> ~/.zshrc
        echo "" >> ~/.zshrc
        print_success "Created ~/.zshrc file"
    fi
}

# Function to backup ~/.zshrc
backup_zshrc() {
    if [ -f ~/.zshrc ]; then
        local backup_file="$HOME/.zshrc.backup.$(date +%Y%m%d_%H%M%S)"
        cp ~/.zshrc "$backup_file"
        print_success "Backed up ~/.zshrc to $backup_file"
    fi
}

# Function to test all secrets
test_secrets() {
    print_status "Testing all enterprise secrets..."
    
    # Source ~/.zshrc to load the new secrets
    source ~/.zshrc
    
    local all_good=true
    
    # Test core secrets
    if [ -z "$OPENAI_API_KEY" ]; then
        print_error "OPENAI_API_KEY not found"
        all_good=false
    else
        print_success "✓ OPENAI_API_KEY is set"
    fi
    
    if [ -z "$SUPABASE_URL" ]; then
        print_error "SUPABASE_URL not found"
        all_good=false
    else
        print_success "✓ SUPABASE_URL is set"
    fi
    
    if [ -z "$SUPABASE_KEY" ]; then
        print_error "SUPABASE_KEY not found"
        all_good=false
    else
        print_success "✓ SUPABASE_KEY is set"
    fi
    
    # Test Vercel secrets
    if [ -z "$VERCEL_TOKEN" ]; then
        print_error "VERCEL_TOKEN not found"
        all_good=false
    else
        print_success "✓ VERCEL_TOKEN is set"
    fi
    
    if [ -z "$VERCEL_ORG_ID" ]; then
        print_warning "VERCEL_ORG_ID not found (will be set automatically)"
    else
        print_success "✓ VERCEL_ORG_ID is set"
    fi
    
    if [ -z "$VERCEL_PROJECT_ID" ]; then
        print_warning "VERCEL_PROJECT_ID not found (will be set automatically)"
    else
        print_success "✓ VERCEL_PROJECT_ID is set"
    fi
    
    # Test AWS secrets
    if [ -z "$AWS_ACCESS_KEY_ID" ]; then
        print_warning "AWS_ACCESS_KEY_ID not found (optional for domain management)"
    else
        print_success "✓ AWS_ACCESS_KEY_ID is set"
    fi
    
    if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        print_warning "AWS_SECRET_ACCESS_KEY not found (optional for domain management)"
    else
        print_success "✓ AWS_SECRET_ACCESS_KEY is set"
    fi
    
    # Test n8n secrets
    if [ -z "$N8N_BASE_URL" ]; then
        print_warning "N8N_BASE_URL not found (optional for workflow management)"
    else
        print_success "✓ N8N_BASE_URL is set"
    fi
    
    if [ -z "$N8N_API_KEY" ]; then
        print_warning "N8N_API_KEY not found (optional for workflow management)"
    else
        print_success "✓ N8N_API_KEY is set"
    fi
    
    if [ "$all_good" = true ]; then
        print_success "All required secrets are properly configured!"
        return 0
    else
        print_error "Some required secrets are missing. Please check your ~/.zshrc file."
        return 1
    fi
}

# Main execution function
main() {
    print_header "🔐 Setting up Enterprise Secrets for AlexAI Platform"
    echo ""
    
    # Ensure ~/.zshrc exists
    ensure_zshrc_exists
    
    # Backup existing ~/.zshrc
    backup_zshrc
    
    # Get all secrets from user
    get_openai_key
    get_supabase_credentials
    get_vercel_credentials
    get_aws_credentials
    get_n8n_credentials
    
    echo ""
    print_header "Testing Enterprise Configuration"
    
    # Test the secrets
    if test_secrets; then
        echo ""
        print_success "🎉 Enterprise secrets setup complete!"
        echo ""
        print_status "Your ~/.zshrc has been updated with all required secrets."
        print_status "You can now run the enterprise platform script:"
        echo ""
        echo "  ./start_alexai_platform.sh"
        echo ""
        print_status "Enterprise Platform URLs:"
        echo "  🌐 Central Hub: https://n8n.pbradygeorgen.com"
        echo "  📊 Agile: https://agile.pbradygeorgen.com"
        echo "  💻 Software: https://software.pbradygeorgen.com"
        echo "  📈 Business: https://business.pbradygeorgen.com"
        echo "  🚀 Startup: https://startup.pbradygeorgen.com"
        echo ""
        print_warning "Note: You may need to restart your terminal or run 'source ~/.zshrc'"
        print_warning "for the new environment variables to take effect."
        echo ""
        print_success "Live long and prosper! 🖖"
    else
        print_error "Enterprise secrets setup failed. Please check the errors above and try again."
        exit 1
    fi
}

# Run main function
main "$@" 