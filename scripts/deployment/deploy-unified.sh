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

# 🖖 AlexAI Star Trek Agile System - Unified Next.js Deployment Script
# Deploy the unified Next.js architecture to Vercel

echo "🚀 AlexAI Star Trek Agile System - Unified Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Next.js is running
if pgrep -f "next dev" > /dev/null; then
    echo "⚠️  Warning: Next.js development server is running."
    echo "   This might interfere with deployment. Consider stopping it first."
fi

# Verify our unified architecture files
echo "🔍 Verifying unified architecture..."
if [ ! -f "src/app/page.tsx" ]; then
    echo "❌ Error: Unified page.tsx not found"
    exit 1
fi

if [ ! -f "src/app/api/health/route.ts" ]; then
    echo "❌ Error: Health API route not found"
    exit 1
fi

echo "✅ Unified architecture verified"

# Test local functionality
echo "🧪 Testing local functionality..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Local API is responding"
else
    echo "⚠️  Local API not responding (this is okay if dev server is stopped)"
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "   This will create a production build and deploy to Vercel"
echo "   You may be prompted to login to Vercel if not already logged in"
echo ""

# Deploy with production flag
npx vercel --prod

echo ""
echo "🎉 Deployment completed!"
echo "📊 Check your Vercel dashboard for the deployment URL"
echo "🖖 Live long and prosper!" 