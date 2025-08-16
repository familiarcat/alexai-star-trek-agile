#!/bin/bash

# 🔧 Resume Compliance Auditor Environment Setup
# Configures environment variables for deployment

set -e

echo "🔧 Setting up Resume Compliance Auditor environment..."

# Configuration file
ENV_FILE=".env.resume-auditor"

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

# Check if .env file already exists
if [ -f "$ENV_FILE" ]; then
    print_warning "Environment file already exists: $ENV_FILE"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Keeping existing environment file"
        exit 0
    fi
fi

print_status "Creating environment configuration file..."

# Create environment file
cat > "$ENV_FILE" << 'EOF'
# 🚀 Resume Compliance Auditor Environment Configuration
# Copy this file to .env and update with your actual values

# n8n Server Configuration
N8N_BASE_URL="https://n8n.pbradygeorgen.com"
N8N_API_TOKEN="your_n8n_api_token_here"

# Workflow Configuration
WORKFLOW_NAME="Resume Compliance Auditor"
WORKFLOW_PATH="resume-audit"

# Server Requirements (for reference)
# - pandoc (for DOCX/PDF conversion)
# - pdftotext (for PDF text extraction)
# - wkhtmltopdf (for PDF generation)

# Security Settings (optional)
N8N_BASIC_AUTH_ACTIVE=false
N8N_BASIC_AUTH_USER="admin"
N8N_BASIC_AUTH_PASSWORD="secure_password"

# Rate Limiting (optional)
N8N_RATE_LIMIT_WINDOW=900000
N8N_RATE_LIMIT_MAX_REQUESTS=100

# File Processing
MAX_FILE_SIZE=10485760  # 10MB in bytes
TEMP_DIR="/tmp"
SUPPORTED_FORMATS="pdf,docx,txt,md"

# Output Configuration
OUTPUT_FORMATS="md,txt,docx,pdf"
REPORT_TEMPLATE="default"
EOF

print_success "Environment file created: $ENV_FILE"

# Instructions for user
echo
echo "📋 Next Steps:"
echo "1. Edit $ENV_FILE with your actual values"
echo "2. Set your n8n API token:"
echo "   export N8N_API_TOKEN='your_actual_token'"
echo "3. Or source the file:"
echo "   source $ENV_FILE"
echo "4. Run the deployment script:"
echo "   ./scripts/deploy-resume-auditor.sh"
echo

# Check if user wants to set up the environment now
read -p "Do you want to set up the environment variables now? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Setting up environment variables..."
    
    # Source the environment file
    if [ -f "$ENV_FILE" ]; then
        source "$ENV_FILE"
        
        # Prompt for actual values
        echo
        read -p "Enter your n8n API token: " N8N_API_TOKEN
        read -p "Enter your n8n base URL [https://n8n.pbradygeorgen.com]: " N8N_BASE_URL_INPUT
        
        if [ ! -z "$N8N_API_TOKEN" ]; then
            export N8N_API_TOKEN="$N8N_API_TOKEN"
            print_success "N8N_API_TOKEN set"
        fi
        
        if [ ! -z "$N8N_BASE_URL_INPUT" ]; then
            export N8N_BASE_URL="$N8N_BASE_URL_INPUT"
            print_success "N8N_BASE_URL set to: $N8N_BASE_URL"
        fi
        
        # Update the .env file with actual values
        sed -i.bak "s|N8N_API_TOKEN=.*|N8N_API_TOKEN=\"$N8N_API_TOKEN\"|" "$ENV_FILE"
        if [ ! -z "$N8N_BASE_URL_INPUT" ]; then
            sed -i.bak "s|N8N_BASE_URL=.*|N8N_BASE_URL=\"$N8N_BASE_URL_INPUT\"|" "$ENV_FILE"
        fi
        
        # Clean up backup files
        rm -f "${ENV_FILE}.bak"
        
        print_success "Environment variables configured!"
        echo
        echo "🔍 Current configuration:"
        echo "   N8N_BASE_URL: $N8N_BASE_URL"
        echo "   N8N_API_TOKEN: ${N8N_API_TOKEN:0:10}..."
        echo
        echo "🚀 Ready to deploy! Run:"
        echo "   ./scripts/deploy-resume-auditor.sh"
        
    else
        print_error "Environment file not found: $ENV_FILE"
        exit 1
    fi
else
    print_status "Environment file created. Please configure it manually before deployment."
fi

print_success "Environment setup complete!"
