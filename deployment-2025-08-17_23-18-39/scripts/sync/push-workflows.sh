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
# Push workflows to n8n.pbradygeorgen.com
# AlexAI NCC-1701-B Automated Workflow Sync System

set -e

echo "🚀 PUSHING WORKFLOWS TO N8N"
echo "Target: n8n.pbradygeorgen.com"
echo "Date: $(date)"
echo ""

# Auto-setup environment from ~/.zshrc if needed
if [ ! -f .env ] && [ -f scripts/setup/setup-environment.sh ]; then
    echo "🔐 Auto-setting up environment from ~/.zshrc..."
    ./scripts/setup/setup-environment.sh
fi

# Check if .env file exists
if [ -f .env ]; then
    echo "📋 Loading environment variables from .env..."
    source .env
else
    echo "⚠️  No .env file found, using system environment variables"
    echo "💡 Run './scripts/setup/setup-environment.sh' to auto-setup from ~/.zshrc"
fi

# Check required environment variables
if [ -z "$N8N_BASE_URL" ]; then
    echo "❌ N8N_BASE_URL environment variable is required"
    exit 1
fi

if [ -z "$N8N_API_KEY" ]; then
    echo "❌ N8N_API_KEY environment variable is required"
    exit 1
fi

echo "🔧 Configuration:"
echo "   N8N Base URL: $N8N_BASE_URL"
echo "   API Key: ${N8N_API_KEY:0:8}..."
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run workflow push
echo "🔄 Running workflow push script..."
node sync-system/scripts/push-workflows.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🧪 Verifying workflow deployment..."
    
    # Basic verification - check if workflows are accessible
    if command -v curl >/dev/null 2>&1; then
        if curl -s "$N8N_BASE_URL" >/dev/null; then
            echo "✅ n8n instance is accessible"
        else
            echo "⚠️  n8n instance may not be accessible"
        fi
    fi
    
    echo ""
    echo "✅ Workflow push completed successfully"
    echo "🎯 Workflows are now deployed to n8n.pbradygeorgen.com"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Visit $N8N_BASE_URL to verify workflows"
    echo "   2. Test webhook endpoints"
    echo "   3. Monitor workflow executions"
else
    echo ""
    echo "❌ Workflow push failed"
    echo "Check the error messages above for details"
    exit 1
fi
