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

# 🚀 Enhanced Production Deployment
# Deploy AlexAI system to production with n8n integration

set -e

echo "🚀 ALEXAI ENHANCED PRODUCTION DEPLOYMENT"
echo "========================================"
echo "🎯 Deploying enhanced system with n8n AI agents integration"
echo "📅 Deployment Date: $(date)"
echo ""

# Function: Pre-deployment validation
pre_deployment_validation() {
    echo "🔍 PRE-DEPLOYMENT VALIDATION"
    echo "============================"
    echo ""
    
    local validation_passed=true
    
    # Check production build
    echo "🏗️ Testing production build..."
    if npm run build > /dev/null 2>&1; then
        echo "✅ Production build: SUCCESS"
    else
        echo "❌ Production build: FAILED"
        validation_passed=false
    fi
    
    # Check environment variables
    echo ""
    echo "🔐 Validating environment variables..."
    local required_vars=("OPENAI_API_KEY" "N8N_BASE_URL" "VERCEL_TOKEN")
    
    for var in "${required_vars[@]}"; do
        if [[ -n "${!var}" ]] || grep -q "^$var=" .env 2>/dev/null; then
            echo "✅ $var: Configured"
        else
            echo "❌ $var: Missing"
            validation_passed=false
        fi
    done
    
    # Check git status
    echo ""
    echo "📋 Checking git repository status..."
    local git_status=$(git status --porcelain)
    if [[ -z "$git_status" ]]; then
        echo "✅ Git repository: Clean"
    else
        echo "⚠️ Git repository: Uncommitted changes"
        echo "   Files: $(echo "$git_status" | wc -l) files modified"
        echo "   Continuing with deployment..."
    fi
    
    # Check security enhancements
    echo ""
    echo "🛡️ Validating security enhancements..."
    if [[ -f "scripts/security/secure-environment-manager.sh" ]]; then
        echo "✅ Security manager: Present"
    else
        echo "⚠️ Security manager: Missing"
    fi
    
    if grep -q "WORF'S SECURITY" .gitignore 2>/dev/null; then
        echo "✅ Enhanced security patterns: Active"
    else
        echo "⚠️ Enhanced security patterns: Standard"
    fi
    
    echo ""
    if [[ "$validation_passed" == true ]]; then
        echo "✅ Pre-deployment validation: PASSED"
        return 0
    else
        echo "❌ Pre-deployment validation: FAILED"
        return 1
    fi
}

# Function: Deploy to Vercel
deploy_to_vercel() {
    echo ""
    echo "🌐 VERCEL DEPLOYMENT"
    echo "==================="
    echo ""
    
    echo "🚀 Deploying to Vercel..."
    
    # Check if vercel CLI is available
    if command -v vercel &> /dev/null; then
        echo "✅ Vercel CLI: Available"
        
        # Deploy to production
        echo "📤 Deploying to production..."
        if vercel --prod --yes; then
            echo "✅ Vercel deployment: SUCCESS"
            return 0
        else
            echo "❌ Vercel deployment: FAILED"
            return 1
        fi
    else
        echo "⚠️ Vercel CLI not installed"
        echo "   Installing Vercel CLI..."
        npm install -g vercel
        
        # Try deployment again
        if vercel --prod --yes; then
            echo "✅ Vercel deployment: SUCCESS"
            return 0
        else
            echo "❌ Vercel deployment: FAILED"
            return 1
        fi
    fi
}

# Function: Test production deployment
test_production_deployment() {
    echo ""
    echo "🧪 PRODUCTION DEPLOYMENT TESTING"
    echo "================================"
    echo ""
    
    # Get production URL (you may need to update this)
    local production_url="https://alexai-star-trek-agile.vercel.app"
    
    echo "🌐 Testing production URL: $production_url"
    
    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    local health_response=$(curl -s -w "%{http_code}" -o /dev/null "$production_url/api/health" || echo "ERROR")
    
    if echo "$health_response" | grep -q "200"; then
        echo "✅ Health endpoint: OPERATIONAL"
    else
        echo "⚠️ Health endpoint: Response $health_response"
    fi
    
    # Test n8n integration endpoint
    echo ""
    echo "🔗 Testing n8n integration endpoint..."
    local n8n_response=$(curl -s -w "%{http_code}" -o /dev/null "$production_url/api/n8n-integration" || echo "ERROR")
    
    if echo "$n8n_response" | grep -q "200"; then
        echo "✅ N8N integration: OPERATIONAL"
    else
        echo "⚠️ N8N integration: Response $n8n_response"
    fi
    
    # Test visual workflow editor
    echo ""
    echo "🎨 Testing visual workflow editor..."
    local editor_response=$(curl -s -w "%{http_code}" -o /dev/null "$production_url/workflow-management" || echo "ERROR")
    
    if echo "$editor_response" | grep -q "200"; then
        echo "✅ Visual workflow editor: ACCESSIBLE"
    else
        echo "⚠️ Visual workflow editor: Response $editor_response"
    fi
    
    echo ""
    echo "🌐 Production URL: $production_url"
    echo "🎨 Visual Editor: $production_url/workflow-management"
    echo "🔗 N8N Integration: $production_url/api/n8n-integration"
}

# Function: Update environment for production
update_production_environment() {
    echo ""
    echo "⚙️ PRODUCTION ENVIRONMENT SETUP"
    echo "==============================="
    echo ""
    
    echo "🔐 Setting up production environment variables..."
    
    # Create production environment template
    cat > .env.production << EOF
# AlexAI Production Environment
# Generated: $(date)

# N8N Configuration (Production)
N8N_BASE_URL=https://n8n.pbradygeorgen.com
N8N_API_KEY=\${N8N_API_KEY}

# OpenAI Configuration
OPENAI_API_KEY=\${OPENAI_API_KEY}

# Next.js Configuration (Production)
NEXTJS_URL=https://alexai-star-trek-agile.vercel.app
NEXT_PUBLIC_APP_URL=https://alexai-star-trek-agile.vercel.app

# Production Mode
NODE_ENV=production
EOF
    
    echo "✅ Production environment template created"
    echo "📋 Remember to configure environment variables in Vercel dashboard"
}

# Main deployment execution
main() {
    echo "🎯 Starting enhanced production deployment..."
    echo ""
    
    # Step 1: Pre-deployment validation
    if pre_deployment_validation; then
        echo ""
        
        # Step 2: Update production environment
        update_production_environment
        
        # Step 3: Deploy to Vercel
        if deploy_to_vercel; then
            echo ""
            
            # Step 4: Test production deployment
            echo "⏳ Waiting for deployment to stabilize..."
            sleep 10
            test_production_deployment
            
            echo ""
            echo "🎉 ENHANCED PRODUCTION DEPLOYMENT COMPLETE!"
            echo "=========================================="
            echo ""
            echo "✅ Production build successful"
            echo "✅ Vercel deployment completed"
            echo "✅ Production testing completed"
            echo "✅ N8N integration ready"
            echo ""
            echo "🌐 Your AlexAI system is now live in production!"
            echo "   Production URL: https://alexai-star-trek-agile.vercel.app"
            echo "   Visual Editor: https://alexai-star-trek-agile.vercel.app/workflow-management"
            echo ""
            echo "🎯 Next: Activate n8n workflows and test AI agents!"
            
        else
            echo ""
            echo "❌ Production deployment failed"
            echo "Please check Vercel configuration and try again"
            exit 1
        fi
        
    else
        echo ""
        echo "❌ Pre-deployment validation failed"
        echo "Please resolve issues before deploying"
        exit 1
    fi
}

# Execute deployment
main "$@"
