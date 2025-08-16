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

# 🔧 ZSH Compatibility Fixer
# Ensures all scripts work properly in zsh without hanging dquote> prompts

set -e

echo "🔧 ZSH COMPATIBILITY FIXER"
echo "=========================="
echo "🎯 Fixing scripts to work properly in zsh"
echo ""

# Function to fix common zsh issues in shell scripts
fix_script_compatibility() {
    local script_file="$1"
    
    if [[ ! -f "$script_file" ]]; then
        echo "❌ Script not found: $script_file"
        return 1
    fi
    
    echo "🔍 Checking: $script_file"
    
    # Create backup
    cp "$script_file" "${script_file}.backup"
    
    # Fix common issues:
    # 1. Ensure proper shebang for zsh
    # 2. Fix multi-line strings
    # 3. Escape special characters properly
    # 4. Fix HERE documents
    
    # Use sed to fix common patterns
    sed -i '' '
        # Fix shebang to explicitly use zsh
        1s|^#!/bin/bash|#!/bin/zsh|
        
        # Fix escaped quotes in multi-line strings
        s/\\"/"/g
        
        # Fix HERE document syntax
        s/<<\s*'"'"'EOF'"'"'/<<'"'"'EOF'"'"'/g
    ' "$script_file"
    
    # Verify the script can be parsed
    if zsh -n "$script_file" 2>/dev/null; then
        echo "✅ Fixed: $script_file"
        rm "${script_file}.backup"
    else
        echo "⚠️ Could not auto-fix: $script_file (restored from backup)"
        mv "${script_file}.backup" "$script_file"
    fi
}

# Find and fix all shell scripts
echo "🔍 Finding shell scripts to fix..."
echo ""

# Fix main scripts
scripts_to_fix=(
    "best-of-both-worlds-strategy.sh"
    "ab-test-best-of-both-worlds.sh"
    "gradual-migration-strategy.sh"
    "deploy-optimized-workflow.sh"
    "test-n8n-ai-agents-evolution.sh"
    "test-ai-self-evolution-validation.sh"
    "setup-bilateral-cursor-n8n-integration.sh"
)

fixed_count=0
for script in "${scripts_to_fix[@]}"; do
    if [[ -f "$script" ]]; then
        fix_script_compatibility "$script"
        ((fixed_count++))
    fi
done

# Fix scripts in subdirectories
echo ""
echo "🔍 Checking bilateral-sync scripts..."
if [[ -d "bilateral-sync/scripts" ]]; then
    for script in bilateral-sync/scripts/*.sh; do
        if [[ -f "$script" ]]; then
            fix_script_compatibility "$script"
            ((fixed_count++))
        fi
    done
fi

echo ""
echo "✅ ZSH COMPATIBILITY CHECK COMPLETE"
echo "=================================="
echo "📊 Scripts processed: $fixed_count"
echo ""
echo "🎯 All scripts should now work properly in zsh!"
echo "🔧 Run any script to test compatibility"
