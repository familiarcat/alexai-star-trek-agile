#!/bin/bash

# 🔧 Enhanced with Chief Engineer Scott's Robustness Features
# Prevents command and dquote errors through strict error handling
set -euo pipefail  # Strict error handling: exit on error, undefined vars, pipe failures

# Error handling function
handle_error() {
    local exit_code=$?
    local line_number=$1
    echo "❌ Error occurred in script at line $line_number (exit code: $exit_code)" >&2
    exit $exit_code
}

# Set error trap
trap 'handle_error $LINENO' ERR

# Logging functions
log_info() {
    echo "ℹ️  $1"
}

log_success() {
    echo "✅ $1"
}

log_warning() {
    echo "⚠️  $1"
}

log_error() {
    echo "❌ $1"
}

# Variable validation function
validate_vars() {
    local required_vars=("$@")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log_error "Required variable '$var' is not set"
            exit 1
        fi
    done
}

# Command validation function
validate_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        log_error "Required command '$1' is not available"
        exit 1
    fi
}

# Safe command execution with error checking
safe_exec() {
    "$@"
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log_error "Command failed with exit code $exit_code: $*"
        return $exit_code
    fi
    return 0
}


#!/bin/bash

# 🚀 Source Environment Variables from ~/.zshrc
# This script sources environment variables from ~/.zshrc and makes them available
# for the Next.js application while maintaining security best practices

set -e

echo "🔧 SOURCING ENVIRONMENT FROM ~/.ZSHRC"
echo "====================================="

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Check if ~/.zshrc exists
if [[ ! -f "$HOME/.zshrc" ]]; then
    echo "❌ ~/.zshrc not found"
    echo "Please ensure your environment variables are configured in ~/.zshrc"
    exit 1
fi

echo "✅ ~/.zshrc found at: $HOME/.zshrc"

# Source the .zshrc file to get environment variables
echo "📖 Sourcing environment variables from ~/.zshrc..."
# Use bash-compatible sourcing to avoid zsh-specific commands
set -a
source "$HOME/.zshrc" 2>/dev/null || true
set +a

# Verify key environment variables
echo ""
echo "🔍 VERIFYING ENVIRONMENT VARIABLES"
echo "================================="

# Check n8n configuration
if [[ -n "$N8N_BASE_URL" ]]; then
    echo "✅ N8N_BASE_URL: $N8N_BASE_URL"
else
    echo "⚠️  N8N_BASE_URL not set, using default: https://n8n.pbradygeorgen.com"
    export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
fi

if [[ -n "$N8N_API_KEY" ]]; then
    echo "✅ N8N_API_KEY: [SET]"
else
    echo "⚠️  N8N_API_KEY not set"
fi

# Check other important variables
if [[ -n "$OPENROUTER_API_KEY" ]]; then
    echo "✅ OPENROUTER_API_KEY: [SET]"
else
    echo "⚠️  OPENROUTER_API_KEY not set"
fi

# Create a temporary environment file for Next.js
create_nextjs_env() {
    echo ""
    echo "📝 CREATING NEXT.JS ENVIRONMENT CONFIGURATION"
    echo "============================================"
    
    local env_file="${PROJECT_ROOT}/.env.local"
    
    # Create .env.local with sourced variables
    cat > "$env_file" << EOF
# AlexAI Environment Configuration
# Generated from ~/.zshrc on $(date)
# DO NOT COMMIT THIS FILE - it contains sensitive information

# n8n Integration
N8N_BASE_URL=${N8N_BASE_URL}
N8N_API_KEY=${N8N_API_KEY}

# AI Integration
OPENROUTER_API_KEY=${OPENROUTER_API_KEY}

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true

# Database Configuration (if needed)
DATABASE_URL=sqlite:./agile_manager.db
EOF

    echo "✅ Created .env.local with environment variables from ~/.zshrc"
    echo "📁 File location: $env_file"
    
    # Add to .gitignore if not already there
    if ! grep -q ".env.local" "${PROJECT_ROOT}/.gitignore" 2>/dev/null; then
        echo ".env.local" >> "${PROJECT_ROOT}/.gitignore"
        echo "✅ Added .env.local to .gitignore"
    fi
}

# Function to validate n8n connectivity
test_n8n_connectivity() {
    echo ""
    echo "🌐 TESTING N8N CONNECTIVITY"
    echo "============================"
    
    if [[ -n "$N8N_BASE_URL" ]]; then
        echo "🔗 Testing connection to: $N8N_BASE_URL"
        
        if curl -s --max-time 10 "$N8N_BASE_URL/health" > /dev/null 2>&1; then
            echo "✅ n8n instance is accessible"
        else
            echo "⚠️  n8n instance may not be accessible"
            echo "   This could be normal if n8n is not running or behind authentication"
        fi
    else
        echo "❌ N8N_BASE_URL not configured"
    fi
}

# Function to start Next.js with proper environment
start_nextjs() {
    echo ""
    echo "🚀 STARTING NEXT.JS WITH SOURCED ENVIRONMENT"
    echo "==========================================="
    
    cd "$PROJECT_ROOT"
    
    # Export environment variables for the current session
    export N8N_BASE_URL
    export N8N_API_KEY
    export OPENROUTER_API_KEY
    
    echo "✅ Environment variables exported for current session"
    echo "🎯 Starting Next.js development server..."
    echo ""
    echo "📋 Environment Summary:"
    echo "   - N8N_BASE_URL: $N8N_BASE_URL"
    echo "   - Next.js will run on: http://localhost:3000"
    echo "   - API endpoints: http://localhost:3000/api/*"
    echo "   - n8n integration: $N8N_BASE_URL"
    echo ""
    
    # Start Next.js
    npm run dev
}

# Main execution
main() {
    echo "🎯 Starting environment sourcing process..."
    
    # Create Next.js environment configuration
    create_nextjs_env
    
    # Test n8n connectivity
    test_n8n_connectivity
    
    # Provide options
    echo ""
    echo "🎉 ENVIRONMENT SOURCING COMPLETE!"
    echo "================================"
    echo ""
    echo "📋 Available actions:"
    echo "  1. Start Next.js now (recommended)"
    echo "  2. Just source environment and exit"
    echo "  3. Test n8n connectivity only"
    echo ""
    
    read -p "Choose an option (1-3): " choice
    
    case $choice in
        1)
            start_nextjs
            ;;
        2)
            echo "✅ Environment sourced successfully"
            echo "   You can now run: npm run dev"
            ;;
        3)
            test_n8n_connectivity
            ;;
        *)
            echo "✅ Environment sourced successfully"
            echo "   You can now run: npm run dev"
            ;;
    esac
}

# Execute main function
main "$@"
