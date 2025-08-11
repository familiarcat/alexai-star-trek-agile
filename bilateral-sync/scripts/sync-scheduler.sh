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

# 🕐 Bilateral Sync Scheduler
# Automated scheduling for bilateral sync operations

SYNC_INTERVAL=${SYNC_INTERVAL:-300}  # 5 minutes default
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "⏰ Bilateral Sync Scheduler Starting"
echo "Sync interval: $SYNC_INTERVAL seconds"
echo ""

# Function to run sync
run_sync() {
    echo "🔄 $(date): Running bilateral sync..."
    
    if node "$SCRIPT_DIR/bilateral-sync-manager.js" sync; then
        echo "✅ $(date): Sync completed successfully"
        
        # Track evolution if significant changes detected
        node "$SCRIPT_DIR/evolution-tracker.js" report > /dev/null 2>&1
        
    else
        echo "❌ $(date): Sync failed"
    fi
    
    echo ""
}

# Initial sync
run_sync

# Schedule regular syncs
while true; do
    sleep $SYNC_INTERVAL
    run_sync
done
