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


#!/bin/zsh
# Continuous Bilateral Learning Monitor

while true; do
    # Watch for new .md files
    find . -name "*.md" -newer alexai-knowledge-base/BILATERAL_LEARNING_LOG.md -not -path "./node_modules/*" | while read -r file; do
        echo "New markdown file detected: $file"
        ./scripts/knowledge/bilateral-learning-system.sh process "$file" "markdown"
    done
    
    # Watch for new .sh files
    find . -name "*.sh" -newer alexai-knowledge-base/BILATERAL_LEARNING_LOG.md -not -path "./node_modules/*" | while read -r file; do
        echo "New shell script detected: $file"
        ./scripts/knowledge/bilateral-learning-system.sh process "$file" "shell"
    done
    
    # Wait before next check
    sleep 30
done
