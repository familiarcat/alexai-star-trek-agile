#!/bin/bash

# 📝 ROBUST SCRIPT TEMPLATE
# Chief Engineer Scott's Template for Error-Free Scripts
# Use this template for all new scripts to prevent command and dquote errors

set -euo pipefail  # Strict error handling

# Script metadata
SCRIPT_NAME="$(basename "$0")"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Error handling function
handle_error() {
    local exit_code=$?
    local line_number=$1
    echo "❌ Error occurred in $SCRIPT_NAME at line $line_number (exit code: $exit_code)" >&2
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

# Main function
main() {
    log_info "Starting $SCRIPT_NAME..."
    
    # Validate required commands
    validate_command "curl"
    validate_command "jq"
    
    # Validate required environment variables
    # validate_vars "REQUIRED_VAR1" "REQUIRED_VAR2"
    
    # Your script logic here
    log_info "Performing main operations..."
    
    # Example: Safe command execution
    # safe_exec curl -s "http://localhost:3000/api/health"
    
    # Example: Safe variable usage
    # local result="$(safe_exec some_command)"
    
    log_success "$SCRIPT_NAME completed successfully"
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
