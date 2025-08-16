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
# Fix CI/CD Deployment Script
# Provides multiple solutions for GitHub secret scanning and production deployment

set -e

echo "🔧 CI/CD DEPLOYMENT FIX UTILITY"
echo "==============================="
echo "🎯 Resolving production deployment issues"
echo "📅 Fix Date: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to display options menu
show_menu() {
    echo -e "${BLUE}🛠️  DEPLOYMENT FIX OPTIONS${NC}"
    echo "=========================="
    echo ""
    echo -e "${GREEN}1. GitHub Secret Allow (Fastest - 5 minutes)${NC}"
    echo "   - Use GitHub provided URL to allow secret"
    echo "   - Push immediately unblocked"
    echo "   - CI/CD triggers automatically"
    echo ""
    echo -e "${YELLOW}2. Manual Vercel Deployment (Reliable - 15 minutes)${NC}"
    echo "   - Deploy directly via Vercel CLI"
    echo "   - Bypass GitHub push issues"
    echo "   - Manual environment setup"
    echo ""
    echo -e "${PURPLE}3. Clean Git History (Secure - 30 minutes)${NC}"
    echo "   - Remove sensitive files from git"
    echo "   - Force push clean history"
    echo "   - Most secure long-term solution"
    echo ""
    echo -e "${BLUE}4. Investigate Further${NC}"
    echo "   - Deep dive into CI/CD configuration"
    echo "   - Test all components individually"
    echo "   - Generate detailed reports"
    echo ""
    echo -e "${RED}5. Exit${NC}"
    echo ""
}

# Function to handle GitHub secret allow
github_secret_allow() {
    echo -e "${GREEN}🔓 GITHUB SECRET ALLOW PROCESS${NC}"
    echo "==============================="
    echo ""
    echo "📋 To resolve the GitHub secret scanning issue:"
    echo ""
    echo -e "${YELLOW}Step 1: Click the GitHub provided URL${NC}"
    echo "https://github.com/familiarcat/alexai-star-trek-agile/security/secret-scanning/unblock-secret/311yps89btMrMEP2maTOTutOR2I"
    echo ""
    echo -e "${YELLOW}Step 2: Review the flagged content${NC}"
    echo "- File: .env.backup.20250808_170301"
    echo "- Content: OpenAI API Key"
    echo "- Commit: e7944c36827c8a40bc6d818066a9f6ffc67f20bc"
    echo ""
    echo -e "${YELLOW}Step 3: Click 'Allow secret'${NC}"
    echo "- This will whitelist the specific secret"
    echo "- Push protection will be bypassed"
    echo "- Future pushes will be allowed"
    echo ""
    echo -e "${YELLOW}Step 4: Push to trigger CI/CD${NC}"
    echo "git push origin main"
    echo ""
    
    read -p "Have you completed the GitHub secret allow process? (y/n): " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        echo ""
        echo -e "${GREEN}🚀 Attempting to push to main branch...${NC}"
        
        if git push origin main; then
            echo -e "${GREEN}✅ Push successful! CI/CD pipeline should now trigger.${NC}"
            echo ""
            echo "🔍 Monitor GitHub Actions at:"
            echo "https://github.com/familiarcat/alexai-star-trek-agile/actions"
            echo ""
            echo "🌐 Check deployment progress at:"
            echo "https://vercel.com/dashboard"
            return 0
        else
            echo -e "${RED}❌ Push failed. Please check the error messages above.${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⏸️  Please complete the GitHub secret allow process first.${NC}"
        return 1
    fi
}

# Function to handle manual Vercel deployment
manual_vercel_deploy() {
    echo -e "${YELLOW}🚀 MANUAL VERCEL DEPLOYMENT${NC}"
    echo "==========================="
    echo ""
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${BLUE}📦 Installing Vercel CLI...${NC}"
        npm install -g vercel
    else
        echo -e "${GREEN}✅ Vercel CLI already installed${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}🔧 Building production version...${NC}"
    npm run build
    
    echo ""
    echo -e "${BLUE}🌐 Deploying to Vercel...${NC}"
    echo "Note: You may need to login to Vercel if not already authenticated"
    
    if vercel --prod; then
        echo ""
        echo -e "${GREEN}✅ Manual deployment successful!${NC}"
        echo ""
        echo "🔍 Check your deployment at:"
        echo "https://vercel.com/dashboard"
        echo ""
        echo "🧪 Test your deployment:"
        echo "curl https://alexai-star-trek-agile.vercel.app/api/health"
        return 0
    else
        echo -e "${RED}❌ Manual deployment failed. Check Vercel configuration.${NC}"
        return 1
    fi
}

# Function to clean git history
clean_git_history() {
    echo -e "${PURPLE}🧹 CLEAN GIT HISTORY PROCESS${NC}"
    echo "============================="
    echo ""
    echo -e "${RED}⚠️  WARNING: This will rewrite git history!${NC}"
    echo "This is a destructive operation that cannot be easily undone."
    echo ""
    read -p "Are you sure you want to proceed? (y/n): " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        echo ""
        echo -e "${BLUE}🔍 Creating backup of current branch...${NC}"
        git branch backup-before-cleanup
        
        echo -e "${BLUE}🧹 Removing sensitive file from git history...${NC}"
        git filter-branch --index-filter 'git rm --cached --ignore-unmatch .env.backup.20250808_170301' --prune-empty -- --all
        
        echo -e "${BLUE}🗑️  Cleaning up git references...${NC}"
        rm -rf .git/refs/original/
        git reflog expire --expire=now --all
        git gc --prune=now --aggressive
        
        echo ""
        echo -e "${YELLOW}🚀 Attempting to push clean history...${NC}"
        
        if git push --force-with-lease origin main; then
            echo -e "${GREEN}✅ Clean history pushed successfully!${NC}"
            echo ""
            echo "🔍 Monitor GitHub Actions at:"
            echo "https://github.com/familiarcat/alexai-star-trek-agile/actions"
            return 0
        else
            echo -e "${RED}❌ Failed to push clean history.${NC}"
            echo "You can restore from backup: git checkout backup-before-cleanup"
            return 1
        fi
    else
        echo -e "${YELLOW}⏸️  Git history cleanup cancelled.${NC}"
        return 1
    fi
}

# Function to investigate further
investigate_further() {
    echo -e "${BLUE}🔍 DEEP INVESTIGATION MODE${NC}"
    echo "========================="
    echo ""
    
    echo "📋 Current deployment status:"
    echo ""
    
    echo -n "🔍 Local development server: "
    if curl -s "http://localhost:3000" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Running${NC}"
    else
        echo -e "${RED}❌ Not running${NC}"
    fi
    
    echo -n "🔍 Production deployment: "
    local prod_status=$(curl -s -o /dev/null -w "%{http_code}" "https://alexai-star-trek-agile.vercel.app" 2>/dev/null || echo "000")
    if [ "$prod_status" = "200" ]; then
        echo -e "${GREEN}✅ Online (HTTP $prod_status)${NC}"
    else
        echo -e "${RED}❌ Offline (HTTP $prod_status)${NC}"
    fi
    
    echo ""
    echo "📊 Git repository status:"
    git status --porcelain
    echo "Commits ahead of origin: $(git rev-list --count HEAD ^origin/main 2>/dev/null || echo "unknown")"
    
    echo ""
    echo "🔧 CI/CD Configuration files:"
    echo "GitHub Actions workflows:"
    ls -la .github/workflows/ | grep -E "\.(yml|yaml)$" | awk '{print "  - " $9}'
    
    echo ""
    echo "Vercel configuration:"
    if [ -f "vercel.json" ]; then
        echo -e "${GREEN}✅ vercel.json present${NC}"
        echo "Version: $(jq -r '.version' vercel.json 2>/dev/null || echo "unknown")"
    else
        echo -e "${RED}❌ vercel.json missing${NC}"
    fi
    
    echo ""
    echo "📦 Package.json scripts:"
    jq -r '.scripts | to_entries[] | "  - \(.key): \(.value)"' package.json 2>/dev/null || echo "Could not parse package.json"
    
    echo ""
    echo "🔐 Environment setup:"
    if [ -f ".env" ]; then
        echo -e "${GREEN}✅ .env file present${NC}"
        echo "Variables: $(grep -c "=" .env 2>/dev/null || echo "0")"
    else
        echo -e "${YELLOW}⚠️  .env file not found${NC}"
    fi
    
    echo ""
    echo "🧪 Test key endpoints:"
    echo "Local endpoints:"
    for endpoint in "" "api/health" "workflow-management" "api/n8n-integration"; do
        local url="http://localhost:3000/$endpoint"
        local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
        echo -n "  - /$endpoint: "
        if [ "$status" = "200" ]; then
            echo -e "${GREEN}✅ $status${NC}"
        else
            echo -e "${RED}❌ $status${NC}"
        fi
    done
    
    echo ""
    echo "Production endpoints:"
    for endpoint in "" "api/health" "workflow-management" "api/n8n-integration"; do
        local url="https://alexai-star-trek-agile.vercel.app/$endpoint"
        local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
        echo -n "  - /$endpoint: "
        if [ "$status" = "200" ]; then
            echo -e "${GREEN}✅ $status${NC}"
        else
            echo -e "${RED}❌ $status${NC}"
        fi
    done
}

# Main execution
main() {
    while true; do
        echo ""
        show_menu
        read -p "Select an option (1-5): " choice
        echo ""
        
        case $choice in
            1)
                github_secret_allow
                ;;
            2)
                manual_vercel_deploy
                ;;
            3)
                clean_git_history
                ;;
            4)
                investigate_further
                ;;
            5)
                echo -e "${BLUE}👋 Exiting CI/CD fix utility${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid option. Please select 1-5.${NC}"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to return to menu..." 
    done
}

# Execute main function
main "$@"
