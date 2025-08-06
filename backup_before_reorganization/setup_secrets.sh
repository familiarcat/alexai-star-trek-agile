#!/bin/bash

# 🔐 Setup Secrets for Automated Deployment
# Helps configure ~/.zshrc with required environment variables

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

# Function to check if secret already exists in ~/.zshrc
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

# Function to get Vercel token
get_vercel_token() {
    print_status "Setting up Vercel Token..."
    echo ""
    echo "To get your Vercel token:"
    echo "1. Go to https://vercel.com/account/tokens"
    echo "2. Click 'Create Token'"
    echo "3. Give it a name (e.g., 'alexai-deployment')"
    echo "4. Copy the token"
    echo ""
    read -p "Enter your Vercel token: " vercel_token
    
    if [[ ${#vercel_token} -gt 20 ]]; then
        add_secret_to_zshrc "VERCEL_TOKEN" "$vercel_token" "Vercel deployment token"
    else
        print_error "Invalid Vercel token format. Should be longer than 20 characters"
        return 1
    fi
}

# Function to create ~/.zshrc if it doesn't exist
ensure_zshrc_exists() {
    if [ ! -f ~/.zshrc ]; then
        print_status "Creating ~/.zshrc file..."
        touch ~/.zshrc
        echo "# Zsh configuration file" >> ~/.zshrc
        echo "# Created by AlexAI deployment setup" >> ~/.zshrc
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

# Function to reload shell configuration
reload_shell() {
    print_status "Reloading shell configuration..."
    source ~/.zshrc
    print_success "Shell configuration reloaded"
}

# Function to test secrets
test_secrets() {
    print_status "Testing secrets..."
    
    # Source ~/.zshrc to load the new secrets
    source ~/.zshrc
    
    local all_good=true
    
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
    
    if [ -z "$VERCEL_TOKEN" ]; then
        print_error "VERCEL_TOKEN not found"
        all_good=false
    else
        print_success "✓ VERCEL_TOKEN is set"
    fi
    
    if [ "$all_good" = true ]; then
        print_success "All secrets are properly configured!"
        return 0
    else
        print_error "Some secrets are missing. Please check your ~/.zshrc file."
        return 1
    fi
}

# Main execution function
main() {
    print_header "🔐 Setting up Secrets for Automated Deployment"
    echo ""
    
    # Ensure ~/.zshrc exists
    ensure_zshrc_exists
    
    # Backup existing ~/.zshrc
    backup_zshrc
    
    # Get secrets from user
    get_openai_key
    get_supabase_credentials
    get_vercel_token
    
    echo ""
    print_header "Testing Configuration"
    
    # Test the secrets
    if test_secrets; then
        echo ""
        print_success "🎉 Secrets setup complete!"
        echo ""
        print_status "Your ~/.zshrc has been updated with the required secrets."
        print_status "You can now run the automated deployment script:"
        echo ""
        echo "  ./automated_deploy.sh"
        echo ""
        print_warning "Note: You may need to restart your terminal or run 'source ~/.zshrc'"
        print_warning "for the new environment variables to take effect."
        echo ""
        print_success "Live long and prosper! 🖖"
    else
        print_error "Secret setup failed. Please check the errors above and try again."
        exit 1
    fi
}

# Run main function
main "$@" 