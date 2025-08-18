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

# 🔍 Enhanced Bilateral Sync Health Check
# Quick status check without running full sync operations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
SYNC_SCRIPT="$PROJECT_ROOT/bilateral-sync/scripts/enhanced-sync-manager.js"

echo "🔍 Enhanced Bilateral Sync Health Check"
echo "======================================"

# Check if sync script exists
if [[ ! -f "$SYNC_SCRIPT" ]]; then
    echo "❌ Sync script not found: $SYNC_SCRIPT"
    exit 1
fi

# Check Node.js availability
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

# Check sync status
echo ""
echo "📊 Sync Status:"
node "$SYNC_SCRIPT" status

# Check configuration
echo ""
echo "⚙️  Configuration:"
node "$SYNC_SCRIPT" config

# Check recent activity
echo ""
echo "📋 Recent Activity:"
node "$SYNC_SCRIPT" logs

# Check system resources
echo ""
echo "💻 System Resources:"
echo "Memory Usage:"
free -h | grep -E "Mem|Swap" || echo "Memory info not available"

echo ""
echo "Disk Usage:"
df -h . | head -2

echo ""
echo "✅ Health check completed"
