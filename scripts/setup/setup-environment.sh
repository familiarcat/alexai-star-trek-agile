#!/bin/bash
# Automated Environment Setup using ~/.zshrc credentials
# AlexAI NCC-1701-B Secure Environment Configuration

set -e

echo "🔐 ALEXAI AUTOMATED ENVIRONMENT SETUP"
echo "====================================="
echo "🎯 Using ~/.zshrc credentials for secure configuration"
echo "📅 Setup Date: $(date)"
echo ""

# Function to safely source zshrc
source_zshrc_safely() {
    echo "📋 Loading credentials from ~/.zshrc..."
    
    # Check if ~/.zshrc exists
    if [ ! -f ~/.zshrc ]; then
        echo "❌ ~/.zshrc file not found"
        echo "Please ensure your credentials are set in ~/.zshrc"
        return 1
    fi
    
    # Create a temporary script to extract only environment variables
    temp_env_file=$(mktemp)
    
    # Extract export statements from ~/.zshrc (avoiding potential script execution)
    grep -E '^export [A-Z_]+=.*' ~/.zshrc > "$temp_env_file" 2>/dev/null || true
    
    # Source the extracted environment variables
    if [ -s "$temp_env_file" ]; then
        source "$temp_env_file"
        echo "✅ Successfully loaded environment variables from ~/.zshrc"
        rm "$temp_env_file"
        return 0
    else
        echo "⚠️  No export statements found in ~/.zshrc"
        rm "$temp_env_file"
        return 1
    fi
}

# Function to create .env file
create_env_file() {
    echo "📝 Creating .env file with project credentials..."
    
    # Create .env file with all the credentials we use throughout the project
    cat > .env << EOF
# AlexAI NCC-1701-B Environment Configuration
# Generated automatically from ~/.zshrc credentials
# Date: $(date)

# ============================================
# N8N Configuration
# ============================================
N8N_BASE_URL=${N8N_BASE_URL:-https://n8n.pbradygeorgen.com}
N8N_API_KEY=${N8N_API_KEY:-}

# ============================================
# AWS Configuration
# ============================================
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-}
AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-us-east-2}
AWS_REGION=${AWS_REGION:-us-east-2}

# ============================================
# OpenRouter Configuration
# ============================================
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}

# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-}

# ============================================
# Next.js Configuration
# ============================================
NEXTJS_URL=${NEXTJS_URL:-http://localhost:3000}
NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}

# ============================================
# Vercel Configuration
# ============================================
VERCEL_TOKEN=${VERCEL_TOKEN:-}
VERCEL_ORG_ID=${VERCEL_ORG_ID:-}
VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID:-}

# ============================================
# GitHub Configuration
# ============================================
GITHUB_TOKEN=${GITHUB_TOKEN:-}
GITHUB_REPO=${GITHUB_REPO:-}

# ============================================
# Development Configuration
# ============================================
NODE_ENV=${NODE_ENV:-development}
DEBUG=${DEBUG:-false}
VERBOSE=${VERBOSE:-false}

# ============================================
# AlexAI Custom Configuration
# ============================================
ALEXAI_API_KEY=${ALEXAI_API_KEY:-}
ALEXAI_BASE_URL=${ALEXAI_BASE_URL:-http://localhost:3000}

# ============================================
# Security Configuration
# ============================================
NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-}
NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}

EOF

    echo "✅ .env file created successfully"
}

# Function to validate environment variables
validate_environment() {
    echo "🔍 Validating environment configuration..."
    
    # Critical variables that should be set
    critical_vars=(
        "N8N_BASE_URL"
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
    )
    
    # Important variables that should be set
    important_vars=(
        "N8N_API_KEY"
        "OPENROUTER_API_KEY"
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
    
    # Optional variables
    optional_vars=(
        "VERCEL_TOKEN"
        "GITHUB_TOKEN"
        "ALEXAI_API_KEY"
        "NEXTAUTH_SECRET"
    )
    
    missing_critical=0
    missing_important=0
    missing_optional=0
    
    echo ""
    echo "📊 Environment Variable Status:"
    echo "==============================="
    
    # Check critical variables
    echo "🚨 Critical Variables:"
    for var in "${critical_vars[@]}"; do
        if [ -n "${!var}" ]; then
            echo "✅ $var: Configured"
        else
            echo "❌ $var: Missing (CRITICAL)"
            missing_critical=$((missing_critical + 1))
        fi
    done
    
    echo ""
    echo "⚠️  Important Variables:"
    for var in "${important_vars[@]}"; do
        if [ -n "${!var}" ]; then
            echo "✅ $var: Configured"
        else
            echo "⚠️  $var: Missing (IMPORTANT)"
            missing_important=$((missing_important + 1))
        fi
    done
    
    echo ""
    echo "💡 Optional Variables:"
    for var in "${optional_vars[@]}"; do
        if [ -n "${!var}" ]; then
            echo "✅ $var: Configured"
        else
            echo "💡 $var: Not set (OPTIONAL)"
            missing_optional=$((missing_optional + 1))
        fi
    done
    
    echo ""
    echo "📊 Summary:"
    echo "   Critical missing: $missing_critical"
    echo "   Important missing: $missing_important"
    echo "   Optional missing: $missing_optional"
    
    # Return status based on critical variables
    if [ $missing_critical -gt 0 ]; then
        echo ""
        echo "❌ CRITICAL VARIABLES MISSING"
        echo "Please add the missing critical variables to your ~/.zshrc file"
        return 1
    else
        echo ""
        echo "✅ All critical variables are configured"
        return 0
    fi
}

# Function to show ~/.zshrc setup instructions
show_zshrc_instructions() {
    echo ""
    echo "📋 ~/.zshrc SETUP INSTRUCTIONS"
    echo "=============================="
    echo ""
    echo "Add the following lines to your ~/.zshrc file:"
    echo ""
    
    cat << 'EOF'
# AlexAI NCC-1701-B Credentials
# =============================

# N8N Configuration
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
export N8N_API_KEY="your-n8n-api-key"

# AWS Configuration
export AWS_ACCESS_KEY_ID="your-aws-access-key"
export AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
export AWS_DEFAULT_REGION="us-east-2"
export AWS_REGION="us-east-2"

# OpenRouter Configuration
export OPENROUTER_API_KEY="your-openrouter-api-key"

# Supabase Configuration
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
export SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-key"

# Vercel Configuration (optional)
export VERCEL_TOKEN="your-vercel-token"
export VERCEL_ORG_ID="your-vercel-org-id"
export VERCEL_PROJECT_ID="your-vercel-project-id"

# GitHub Configuration (optional)
export GITHUB_TOKEN="your-github-token"
export GITHUB_REPO="your-github-repo"

# AlexAI Custom Configuration (optional)
export ALEXAI_API_KEY="your-alexai-api-key"

# Security Configuration (optional)
export NEXTAUTH_SECRET="your-nextauth-secret"
EOF
    
    echo ""
    echo "After adding these to ~/.zshrc, run:"
    echo "   source ~/.zshrc"
    echo "   ./scripts/setup/setup-environment.sh"
}

# Function to backup existing .env
backup_existing_env() {
    if [ -f .env ]; then
        backup_file=".env.backup.$(date +%Y%m%d_%H%M%S)"
        cp .env "$backup_file"
        echo "📁 Backed up existing .env to $backup_file"
    fi
}

# Function to test environment loading
test_environment() {
    echo "🧪 Testing environment configuration..."
    
    # Test if we can load the .env file
    if [ -f .env ]; then
        source .env
        echo "✅ .env file loads successfully"
        
        # Test a few key variables
        if [ -n "$N8N_BASE_URL" ]; then
            echo "✅ N8N_BASE_URL: $N8N_BASE_URL"
        else
            echo "⚠️  N8N_BASE_URL not set"
        fi
        
        if [ -n "$AWS_ACCESS_KEY_ID" ]; then
            echo "✅ AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID:0:8}..."
        else
            echo "⚠️  AWS_ACCESS_KEY_ID not set"
        fi
        
        return 0
    else
        echo "❌ .env file not found"
        return 1
    fi
}

# Main execution
main() {
    echo "🚀 Starting automated environment setup..."
    echo ""
    
    # Backup existing .env
    backup_existing_env
    
    # Try to source ~/.zshrc safely
    if source_zshrc_safely; then
        echo ""
        
        # Create .env file
        create_env_file
        echo ""
        
        # Validate environment
        if validate_environment; then
            echo ""
            
            # Test environment
            test_environment
            echo ""
            
            echo "🎉 ENVIRONMENT SETUP COMPLETE!"
            echo "✅ .env file created with credentials from ~/.zshrc"
            echo "✅ All critical variables configured"
            echo ""
            echo "🚀 You can now use:"
            echo "   - n8n sync scripts"
            echo "   - AWS integration"
            echo "   - Development environment"
            echo ""
            echo "🖖 Live long and prosper!"
        else
            echo ""
            echo "⚠️  Environment setup completed with warnings"
            show_zshrc_instructions
        fi
    else
        echo ""
        echo "❌ Could not load credentials from ~/.zshrc"
        show_zshrc_instructions
        exit 1
    fi
}

# Run main function
main "$@"
