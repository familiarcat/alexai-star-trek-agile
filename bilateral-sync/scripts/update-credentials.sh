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

# 🔐 Automated Credential Update Script
# Sources credentials from ~/.zshrc and updates bilateral sync

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
SECURITY_MANAGER="${PROJECT_ROOT}/scripts/security/secure-environment-manager.sh"

echo "🔐 Updating credentials for bilateral sync..."

# Source credentials from ~/.zshrc
if [[ -f ~/.zshrc ]]; then
    source ~/.zshrc
    echo "✅ Sourced credentials from ~/.zshrc"
else
    echo "❌ ~/.zshrc not found"
    exit 1
fi

# Update .env via security manager
if [[ -f "$SECURITY_MANAGER" ]]; then
    "$SECURITY_MANAGER" --validate-only
    echo "✅ Updated .env via security manager"
else
    echo "⚠️ Security manager not found, using direct export"
fi

# Export key variables for bilateral sync
export N8N_API_KEY
export N8N_BASE_URL
export GITHUB_TOKEN
export OPENAI_API_KEY

echo "✅ Credentials updated successfully"
