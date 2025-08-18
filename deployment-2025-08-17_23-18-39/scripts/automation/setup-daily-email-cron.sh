#!/bin/bash

# 🚀 AlexAI Star Trek System - Daily Email Cron Setup
# This script sets up a cron job to send daily execution plan emails at 10:00 AM

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
EMAIL_SCRIPT="$PROJECT_ROOT/scripts/automation/daily-execution-plan-email.sh"
CRON_JOB="0 10 * * * $EMAIL_SCRIPT"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Check if email script exists
check_email_script() {
    log "🔧 Checking email script..."
    
    if [[ ! -f "$EMAIL_SCRIPT" ]]; then
        error "❌ Email script not found: $EMAIL_SCRIPT"
        return 1
    fi
    
    if [[ ! -x "$EMAIL_SCRIPT" ]]; then
        error "❌ Email script not executable: $EMAIL_SCRIPT"
        return 1
    fi
    
    log "✅ Email script verified"
    return 0
}

# Check if cron is available
check_cron() {
    log "🔧 Checking cron availability..."
    
    if ! command -v crontab &> /dev/null; then
        error "❌ crontab command not found"
        return 1
    fi
    
    log "✅ Cron is available"
    return 0
}

# Check if cron job already exists
check_existing_cron() {
    log "🔧 Checking for existing cron job..."
    
    if crontab -l 2>/dev/null | grep -q "$EMAIL_SCRIPT"; then
        warn "⚠️  Cron job already exists for daily execution plan emails"
        return 0
    fi
    
    log "✅ No existing cron job found"
    return 1
}

# Add cron job
add_cron_job() {
    log "🔧 Adding cron job for daily execution plan emails at 10:00 AM..."
    
    # Create temporary cron file
    local temp_cron=$(mktemp)
    
    # Export current cron jobs
    crontab -l 2>/dev/null > "$temp_cron" || true
    
    # Add new cron job
    echo "$CRON_JOB" >> "$temp_cron"
    
    # Install new cron jobs
    if crontab "$temp_cron"; then
        log "✅ Cron job added successfully"
        log "📅 Daily execution plan emails will be sent at 10:00 AM every day"
        
        # Clean up
        rm -f "$temp_cron"
        return 0
    else
        error "❌ Failed to add cron job"
        rm -f "$temp_cron"
        return 1
    fi
}

# Remove existing cron job
remove_existing_cron() {
    log "🔧 Removing existing cron job..."
    
    # Create temporary cron file
    local temp_cron=$(mktemp)
    
    # Export current cron jobs and filter out the email script
    crontab -l 2>/dev/null | grep -v "$EMAIL_SCRIPT" > "$temp_cron" || true
    
    # Install filtered cron jobs
    if crontab "$temp_cron"; then
        log "✅ Existing cron job removed"
        
        # Clean up
        rm -f "$temp_cron"
        return 0
    else
        error "❌ Failed to remove existing cron job"
        rm -f "$temp_cron"
        return 1
    fi
}

# Show current cron jobs
show_cron_jobs() {
    log "📋 Current cron jobs:"
    echo "----------------------------------------"
    crontab -l 2>/dev/null || echo "No cron jobs found"
    echo "----------------------------------------"
}

# Test the cron job
test_cron_job() {
    log "🧪 Testing cron job execution..."
    
    if "$EMAIL_SCRIPT"; then
        log "✅ Cron job test successful"
        return 0
    else
        error "❌ Cron job test failed"
        return 1
    fi
}

# Main execution
main() {
    log "🚀 Setting up daily execution plan email automation..."
    
    # Check prerequisites
    if ! check_email_script; then
        exit 1
    fi
    
    if ! check_cron; then
        exit 1
    fi
    
    # Check if cron job already exists
    if check_existing_cron; then
        warn "⚠️  Cron job already exists. Do you want to replace it? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            remove_existing_cron
        else
            log "ℹ️  Keeping existing cron job"
            show_cron_jobs
            exit 0
        fi
    fi
    
    # Add new cron job
    if add_cron_job; then
        log "🎉 Daily email automation setup completed successfully!"
        log ""
        log "📧 You will now receive daily execution plan emails at 10:00 AM"
        log "📅 The cron job will run every day automatically"
        log "📝 Logs will be saved to: $PROJECT_ROOT/logs/"
        log ""
        
        # Show current cron jobs
        show_cron_jobs
        
        # Test the setup
        if test_cron_job; then
            log "🎯 Setup verification successful!"
        else
            warn "⚠️  Setup verification failed - please check the logs"
        fi
        
        exit 0
    else
        error "❌ Failed to set up daily email automation"
        exit 1
    fi
}

# Show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -r, --remove   Remove existing cron job"
    echo "  -s, --show     Show current cron jobs"
    echo "  -t, --test     Test the email script"
    echo ""
    echo "Default: Set up daily email automation at 10:00 AM"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -r|--remove)
        remove_existing_cron
        show_cron_jobs
        exit 0
        ;;
    -s|--show)
        show_cron_jobs
        exit 0
        ;;
    -t|--test)
        test_cron_job
        exit 0
        ;;
    "")
        main "$@"
        ;;
    *)
        error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
