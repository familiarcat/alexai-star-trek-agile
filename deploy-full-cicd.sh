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

# 🖖 AlexAI Star Trek Agile System - Full CI/CD Pipeline Trigger
# Simple wrapper to trigger the comprehensive CI/CD pipeline

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 AlexAI Star Trek Agile System - Full CI/CD Pipeline${NC}"
echo -e "${BLUE}======================================================${NC}"
echo ""

# Check if deployment target is provided
DEPLOYMENT_TARGET="${1:-all}"

echo "Deployment target: $DEPLOYMENT_TARGET"
echo ""

# Validate deployment target
case "$DEPLOYMENT_TARGET" in
    "all"|"legacy"|"modern"|"docker"|"vercel")
        echo "✅ Valid deployment target"
        ;;
    *)
        echo "❌ Invalid deployment target: $DEPLOYMENT_TARGET"
        echo "Valid options: all, legacy, modern, docker, vercel"
        exit 1
        ;;
esac

echo ""
echo "Starting full CI/CD pipeline..."

# Run the full CI/CD deployment script
./scripts/deploy/full-cicd-deploy.sh ci-cd "$DEPLOYMENT_TARGET"

echo ""
echo -e "${GREEN}✅ CI/CD pipeline triggered successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Monitor the pipeline at: https://github.com/your-username/alexai_katra_transfer_package_remote_v7/actions"
echo "2. Check deployment status with: ./scripts/deploy/full-cicd-deploy.sh status"
echo "3. View logs in the GitHub Actions tab"
echo ""
echo "Live long and prosper! 🖖" 