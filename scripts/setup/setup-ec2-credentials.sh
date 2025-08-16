#!/bin/bash

# 🔐 Secure EC2 Credentials Setup
# Safely adds EC2 environment variables to your ~/.zshrc file

set -e

echo "🔐 Setting up secure EC2 credentials for Resume Compliance Auditor deployment..."

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

# Check if ~/.zshrc exists
ZSHRC_FILE="$HOME/.zshrc"
BACKUP_FILE="$HOME/.zshrc.backup.$(date +%Y%m%d_%H%M%S)"

check_zshrc() {
    if [ ! -f "$ZSHRC_FILE" ]; then
        print_warning "~/.zshrc file not found. Creating it..."
        touch "$ZSHRC_FILE"
        echo "# Zsh configuration file" >> "$ZSHRC_FILE"
        echo "" >> "$ZSHRC_FILE"
    fi
    
    print_success "~/.zshrc file ready"
}

# Backup existing ~/.zshrc
backup_zshrc() {
    print_status "Creating backup of ~/.zshrc..."
    cp "$ZSHRC_FILE" "$BACKUP_FILE"
    print_success "Backup created: $BACKUP_FILE"
}

# Check if credentials are already set
check_existing_credentials() {
    print_status "Checking for existing EC2 credentials..."
    
    if grep -q "EC2_HOST" "$ZSHRC_FILE"; then
        print_warning "EC2_HOST already found in ~/.zshrc"
        read -p "Do you want to update it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Will update existing EC2_HOST"
        else
            print_status "Keeping existing EC2_HOST"
            return 1
        fi
    fi
    
    if grep -q "EC2_KEY_PATH" "$ZSHRC_FILE"; then
        print_warning "EC2_KEY_PATH already found in ~/.zshrc"
        read -p "Do you want to update it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Will update existing EC2_KEY_PATH"
        else
            print_status "Keeping existing EC2_KEY_PATH"
            return 1
        fi
    fi
    
    return 0
}

# Remove existing EC2 credentials
remove_existing_credentials() {
    print_status "Removing existing EC2 credentials..."
    
    # Create temporary file without EC2 credentials
    grep -v "EC2_HOST\|EC2_KEY_PATH" "$ZSHRC_FILE" > "${ZSHRC_FILE}.tmp"
    mv "${ZSHRC_FILE}.tmp" "$ZSHRC_FILE"
    
    print_success "Existing EC2 credentials removed"
}

# Add new credentials
add_credentials() {
    print_status "Adding EC2 credentials to ~/.zshrc..."
    
    # Add separator and comment
    echo "" >> "$ZSHRC_FILE"
    echo "# ========================================" >> "$ZSHRC_FILE"
    echo "# EC2 Credentials for Resume Compliance Auditor" >> "$ZSHRC_FILE"
    echo "# ========================================" >> "$ZSHRC_FILE"
    echo "" >> "$ZSHRC_FILE"
    
    # Add EC2_HOST
    echo "export EC2_HOST=\"$EC2_HOST\"" >> "$ZSHRC_FILE"
    
    # Add EC2_USER (optional, defaults to ubuntu)
    if [ ! -z "$EC2_USER" ]; then
        echo "export EC2_USER=\"$EC2_USER\"" >> "$ZSHRC_FILE"
    else
        echo "export EC2_USER=\"ubuntu\"" >> "$ZSHRC_FILE"
    fi
    
    # Add EC2_KEY_PATH
    echo "export EC2_KEY_PATH=\"$EC2_KEY_PATH\"" >> "$ZSHRC_FILE"
    
    echo "" >> "$ZSHRC_FILE"
    
    print_success "EC2 credentials added to ~/.zshrc"
}

# Validate the setup
validate_setup() {
    print_status "Validating credential setup..."
    
    # Source the updated ~/.zshrc
    source "$ZSHRC_FILE"
    
    # Check if variables are set
    if [ -z "$EC2_HOST" ]; then
        print_error "EC2_HOST not properly set"
        return 1
    fi
    
    if [ -z "$EC2_KEY_PATH" ]; then
        print_error "EC2_KEY_PATH not properly set"
        return 1
    fi
    
    # Check if key file exists
    if [ ! -f "$EC2_KEY_PATH" ]; then
        print_warning "EC2 private key not found at: $EC2_KEY_PATH"
        print_warning "Please ensure the key file exists and update the path if needed"
    else
        print_success "EC2 private key found"
        # Set proper permissions
        chmod 600 "$EC2_KEY_PATH"
        print_success "Key file permissions set correctly"
    fi
    
    print_success "Credential setup validated successfully!"
    return 0
}

# Main setup function
setup_credentials() {
    echo "🔐 EC2 Credentials Setup"
    echo "========================="
    echo
    
    print_status "This script will securely add EC2 credentials to your ~/.zshrc file"
    print_status "Your credentials will be stored locally and never shared"
    echo
    
    # Prompt for EC2 details
    read -p "Enter your EC2 public IP or domain: " EC2_HOST
    read -p "Enter your EC2 username [ubuntu]: " EC2_USER_INPUT
    read -p "Enter path to your EC2 private key (e.g., ~/.ssh/my-key.pem): " EC2_KEY_PATH
    
    # Set defaults
    EC2_USER="${EC2_USER_INPUT:-ubuntu}"
    
    # Validate inputs
    if [ -z "$EC2_HOST" ]; then
        print_error "EC2_HOST cannot be empty"
        exit 1
    fi
    
    if [ -z "$EC2_KEY_PATH" ]; then
        print_error "EC2_KEY_PATH cannot be empty"
        exit 1
    fi
    
    # Expand ~ to home directory
    EC2_KEY_PATH="${EC2_KEY_PATH/#\~/$HOME}"
    
    echo
    print_status "Credential Summary:"
    echo "  EC2 Host: $EC2_HOST"
    echo "  EC2 User: $EC2_USER"
    echo "  Key Path: $EC2_KEY_PATH"
    echo
    
    read -p "Proceed with adding these credentials to ~/.zshrc? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled"
        exit 0
    fi
    
    # Execute setup
    check_zshrc
    backup_zshrc
    
    if check_existing_credentials; then
        remove_existing_credentials
    fi
    
    add_credentials
    
    if validate_setup; then
        print_success "🎉 EC2 credentials setup completed successfully!"
        echo
        echo "📋 Next Steps:"
        echo "1. Restart your terminal or run: source ~/.zshrc"
        echo "2. Deploy to EC2: ./scripts/deploy-to-ec2.sh"
        echo "3. Your credentials are now securely stored in ~/.zshrc"
        echo
        echo "🔒 Security Notes:"
        echo "- Credentials are stored locally in ~/.zshrc"
        echo "- Backup created at: $BACKUP_FILE"
        echo "- Key file permissions set to 600 (owner read/write only)"
        echo "- Never commit ~/.zshrc to version control"
    else
        print_error "Credential setup validation failed"
        print_status "You can restore from backup: cp $BACKUP_FILE ~/.zshrc"
        exit 1
    fi
}

# Run setup
setup_credentials
