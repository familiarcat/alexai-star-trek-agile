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

# 🚀 Enhanced Bilateral Sync with Auto-Credential Management
# Automatically sources ~/.zshrc credentials and maintains continuous sync

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
SECURITY_MANAGER="${PROJECT_ROOT}/scripts/security/secure-environment-manager.sh"
SYNC_INTERVAL=${SYNC_INTERVAL:-300}  # 5 minutes default

echo "🚀 ENHANCED BILATERAL SYNC STARTING"
echo "===================================="
echo "🛡️ Integrated with Security Manager"
echo "🔄 Auto-sync interval: $SYNC_INTERVAL seconds"
echo ""

# Function to update credentials from ~/.zshrc
update_credentials() {
    echo "🔐 Updating credentials from ~/.zshrc..."
    
    if [[ -f "$SECURITY_MANAGER" ]]; then
        "$SECURITY_MANAGER" --validate-only
        echo "✅ Credentials updated via security manager"
    else
        echo "⚠️ Security manager not found, using direct source"
        source ~/.zshrc
    fi
    
    # Export key variables for bilateral sync
    export N8N_API_KEY
    export N8N_BASE_URL
    export GITHUB_TOKEN
    export OPENAI_API_KEY
}

# Function to run bilateral sync
run_bilateral_sync() {
    echo "🔄 $(date): Running enhanced bilateral sync..."
    
    # Update credentials first
    update_credentials
    
    # Run the bilateral sync manager
    cd "$PROJECT_ROOT/bilateral-sync"
    
    if node scripts/bilateral-sync-manager.js sync; then
        echo "✅ $(date): Bilateral sync completed successfully"
        
        # Track evolution if significant changes detected
        if [[ -f "scripts/evolution-tracker.js" ]]; then
            node scripts/evolution-tracker.js report > /dev/null 2>&1
            echo "📊 Evolution tracking updated"
        fi
        
    else
        echo "❌ $(date): Bilateral sync failed"
    fi
    
    echo ""
}

# Function to validate environment
validate_environment() {
    echo "🔍 Validating environment..."
    
    local required_vars=("N8N_API_KEY" "N8N_BASE_URL" "GITHUB_TOKEN")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo "❌ Missing required environment variables: ${missing_vars[*]}"
        echo "🔄 Updating credentials from ~/.zshrc..."
        update_credentials
        
        # Check again
        for var in "${required_vars[@]}"; do
            if [[ -z "${!var}" ]]; then
                echo "❌ Still missing: $var"
                return 1
            fi
        done
    fi
    
    echo "✅ Environment validation passed"
    return 0
}

# Function to setup systemd service (if running as root)
setup_systemd_service() {
    if [[ $EUID -eq 0 ]]; then
        echo "🔧 Setting up systemd service..."
        
        local service_file="/etc/systemd/system/alexai-bilateral-sync.service"
        local current_service="${PROJECT_ROOT}/bilateral-sync/alexai-bilateral-sync.service"
        
        if [[ -f "$current_service" ]]; then
            cp "$current_service" "$service_file"
            systemctl daemon-reload
            systemctl enable alexai-bilateral-sync.service
            systemctl start alexai-bilateral-sync.service
            echo "✅ Systemd service configured and started"
        else
            echo "⚠️ Service file not found: $current_service"
        fi
    fi
}

# Function to show status
show_status() {
    echo "📊 BILATERAL SYNC STATUS"
    echo "========================"
    echo "🕐 Sync interval: $SYNC_INTERVAL seconds"
    echo "🛡️ Security manager: $([ -f "$SECURITY_MANAGER" ] && echo "✅ Available" || echo "❌ Not found")"
    echo "📁 Project root: $PROJECT_ROOT"
    echo "🔄 Bilateral sync dir: ${PROJECT_ROOT}/bilateral-sync"
    
    # Check if running as service
    if systemctl is-active --quiet alexai-bilateral-sync.service 2>/dev/null; then
        echo "🚀 Service status: ✅ Active"
    else
        echo "🚀 Service status: ❌ Inactive"
    fi
    
    echo ""
}

# Main execution
main() {
    echo "🎯 Starting enhanced bilateral sync system..."
    
    # Show initial status
    show_status
    
    # Validate environment
    if ! validate_environment; then
        echo "❌ Environment validation failed. Exiting."
        exit 1
    fi
    
    # Setup systemd service if running as root
    setup_systemd_service
    
    # Initial sync
    run_bilateral_sync
    
    echo "⏰ Starting continuous sync loop..."
    echo "Press Ctrl+C to stop"
    echo ""
    
    # Schedule regular syncs
    while true; do
        sleep $SYNC_INTERVAL
        run_bilateral_sync
    done
}

# Handle command line arguments
case "${1:-}" in
    --validate)
        validate_environment
        ;;
    --status)
        show_status
        ;;
    --setup-service)
        setup_systemd_service
        ;;
    --help)
        echo "Usage: $0 [OPTION]"
        echo "Options:"
        echo "  --validate      Validate environment only"
        echo "  --status        Show status only"
        echo "  --setup-service Setup systemd service (requires root)"
        echo "  --help          Show this help"
        echo ""
        echo "Default: Start continuous bilateral sync"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
