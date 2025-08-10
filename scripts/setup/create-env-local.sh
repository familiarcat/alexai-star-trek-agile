#!/bin/bash

# 🚀 Create .env.local from Current Environment
# This script creates a .env.local file from the current shell environment
# for Next.js development while maintaining security

set -e

echo "🔧 CREATING .ENV.LOCAL FROM CURRENT ENVIRONMENT"
echo "==============================================="

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Check if we're in the right directory
if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
    echo "❌ Not in project root directory"
    exit 1
fi

echo "✅ Project root: $PROJECT_ROOT"

# Create .env.local with current environment variables
create_env_local() {
    local env_file="${PROJECT_ROOT}/.env.local"
    
    echo "📝 Creating .env.local..."
    
    cat > "$env_file" << EOF
# AlexAI Environment Configuration
# Generated from current shell environment on $(date)
# DO NOT COMMIT THIS FILE - it contains sensitive information

# n8n Integration
N8N_BASE_URL=${N8N_URL:-https://n8n.pbradygeorgen.com}
N8N_API_KEY=${N8N_API_KEY}

# AI Integration
OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
OPENAI_API_KEY=${OPENAI_API_KEY}
GEMINI_API_KEY=${GEMINI_API_KEY}
BITO_API_KEY=${BITO_API_KEY}
CONTINUE_API_KEY=${CONTINUE_API_KEY}

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true

# Database Configuration (if needed)
DATABASE_URL=sqlite:./agile_manager.db
EOF

    echo "✅ Created .env.local with environment variables"
    echo "📁 File location: $env_file"
    
    # Add to .gitignore if not already there
    if ! grep -q ".env.local" "${PROJECT_ROOT}/.gitignore" 2>/dev/null; then
        echo ".env.local" >> "${PROJECT_ROOT}/.gitignore"
        echo "✅ Added .env.local to .gitignore"
    fi
}

# Function to validate environment variables
validate_env() {
    echo ""
    echo "🔍 VALIDATING ENVIRONMENT VARIABLES"
    echo "=================================="
    
    local missing_vars=()
    
    # Check required variables
    if [[ -z "$N8N_URL" && -z "$N8N_BASE_URL" ]]; then
        missing_vars+=("N8N_URL/N8N_BASE_URL")
    else
        echo "✅ N8N URL: ${N8N_URL:-$N8N_BASE_URL}"
    fi
    
    if [[ -z "$N8N_API_KEY" ]]; then
        missing_vars+=("N8N_API_KEY")
    else
        echo "✅ N8N_API_KEY: [SET]"
    fi
    
    if [[ -z "$OPENROUTER_API_KEY" ]]; then
        missing_vars+=("OPENROUTER_API_KEY")
    else
        echo "✅ OPENROUTER_API_KEY: [SET]"
    fi
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo "⚠️  Missing variables: ${missing_vars[*]}"
        echo "   These will be set to empty values in .env.local"
    fi
    
    echo ""
    echo "📋 Environment Summary:"
    echo "   - N8N Base URL: ${N8N_URL:-$N8N_BASE_URL:-https://n8n.pbradygeorgen.com}"
    echo "   - Next.js will run on: http://localhost:3000"
    echo "   - API endpoints: http://localhost:3000/api/*"
}

# Function to start Next.js
start_nextjs() {
    echo ""
    echo "🚀 STARTING NEXT.JS DEVELOPMENT SERVER"
    echo "====================================="
    
    cd "$PROJECT_ROOT"
    
    echo "✅ Environment configured successfully"
    echo "🎯 Starting Next.js development server..."
    echo ""
    
    # Start Next.js
    npm run dev
}

# Main execution
main() {
    echo "🎯 Starting environment configuration..."
    
    # Create .env.local
    create_env_local
    
    # Validate environment
    validate_env
    
    # Provide options
    echo ""
    echo "🎉 ENVIRONMENT CONFIGURATION COMPLETE!"
    echo "====================================="
    echo ""
    echo "📋 Available actions:"
    echo "  1. Start Next.js now (recommended)"
    echo "  2. Just create .env.local and exit"
    echo ""
    
    read -p "Choose an option (1-2): " choice
    
    case $choice in
        1)
            start_nextjs
            ;;
        2)
            echo "✅ .env.local created successfully"
            echo "   You can now run: npm run dev"
            ;;
        *)
            echo "✅ .env.local created successfully"
            echo "   You can now run: npm run dev"
            ;;
    esac
}

# Execute main function
main "$@"

