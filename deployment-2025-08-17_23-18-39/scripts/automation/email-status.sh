#!/bin/bash

# 🚀 AlexAI Star Trek System - Daily Email Status Check
# This script checks the status of your daily execution plan email automation

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
LOG_DIR="$PROJECT_ROOT/logs"

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

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Check AWS SES configuration
check_aws_config() {
    info "🔧 Checking AWS SES configuration..."
    
    local config_ok=true
    
    if [[ -z "$AWS_SES_REGION" ]]; then
        error "❌ AWS_SES_REGION not set"
        config_ok=false
    else
        log "✅ AWS_SES_REGION: $AWS_SES_REGION"
    fi
    
    if [[ -z "$AWS_SES_FROM_EMAIL" ]]; then
        error "❌ AWS_SES_FROM_EMAIL not set"
        config_ok=false
    else
        log "✅ AWS_SES_FROM_EMAIL: $AWS_SES_FROM_EMAIL"
    fi
    
    if [[ -z "$AWS_SES_FROM_NAME" ]]; then
        error "❌ AWS_SES_FROM_NAME not set"
        config_ok=false
    else
        log "✅ AWS_SES_FROM_NAME: $AWS_SES_FROM_NAME"
    fi
    
    if [[ -z "$AWS_SES_CONFIGURATION_SET" ]]; then
        error "❌ AWS_SES_CONFIGURATION_SET not set"
        config_ok=false
    else
        log "✅ AWS_SES_CONFIGURATION_SET: $AWS_SES_CONFIGURATION_SET"
    fi
    
    if [[ "$config_ok" == true ]]; then
        log "✅ AWS SES configuration is complete"
        return 0
    else
        error "❌ AWS SES configuration is incomplete"
        return 1
    fi
}

# Check cron job status
check_cron_status() {
    info "📅 Checking cron job status..."
    
    if crontab -l 2>/dev/null | grep -q "$EMAIL_SCRIPT"; then
        log "✅ Daily email cron job is active"
        
        # Show the cron job details
        local cron_line=$(crontab -l 2>/dev/null | grep "$EMAIL_SCRIPT")
        info "📋 Cron job: $cron_line"
        
        # Parse cron schedule
        local schedule=$(echo "$cron_line" | awk '{print $1, $2, $3, $4, $5}')
        info "⏰ Schedule: $schedule (runs at 10:00 AM daily)"
        
        return 0
    else
        error "❌ Daily email cron job not found"
        return 1
    fi
}

# Check email script status
check_script_status() {
    info "🔧 Checking email script status..."
    
    if [[ -f "$EMAIL_SCRIPT" ]]; then
        log "✅ Email script exists: $EMAIL_SCRIPT"
        
        if [[ -x "$EMAIL_SCRIPT" ]]; then
            log "✅ Email script is executable"
        else
            error "❌ Email script is not executable"
            return 1
        fi
        
        # Check script size and modification time
        local script_size=$(ls -lh "$EMAIL_SCRIPT" | awk '{print $5}')
        local script_mtime=$(ls -l "$EMAIL_SCRIPT" | awk '{print $6, $7, $8}')
        info "📏 Script size: $script_size"
        info "🕒 Last modified: $script_mtime"
        
        return 0
    else
        error "❌ Email script not found: $EMAIL_SCRIPT"
        return 1
    fi
}

# Check recent email logs
check_recent_logs() {
    info "📝 Checking recent email logs..."
    
    if [[ ! -d "$LOG_DIR" ]]; then
        warn "⚠️  Log directory not found: $LOG_DIR"
        return 1
    fi
    
    # Find today's log file
    local today=$(date +%Y%m%d)
    local today_log="$LOG_DIR/daily-email-$today.log"
    
    if [[ -f "$today_log" ]]; then
        log "✅ Today's log file found: $today_log"
        
        # Show last few log entries
        info "📋 Recent log entries:"
        echo "----------------------------------------"
        tail -10 "$today_log" 2>/dev/null || echo "No recent log entries"
        echo "----------------------------------------"
        
        # Check for successful emails
        local success_count=$(grep -c "✅ Daily execution plan email sent successfully" "$today_log" 2>/dev/null || echo "0")
        local total_count=$(grep -c "📧 Sending daily execution plan email" "$today_log" 2>/dev/null || echo "0")
        
        if [[ "$total_count" -gt 0 ]]; then
            local success_rate=$((success_count * 100 / total_count))
            log "📊 Email success rate today: ${success_rate}% (${success_count}/${total_count})"
        fi
        
        return 0
    else
        warn "⚠️  No log file found for today: $today_log"
        
        # Check for any recent log files
        local recent_logs=$(find "$LOG_DIR" -name "daily-email-*.log" -mtime -7 2>/dev/null | head -5)
        if [[ -n "$recent_logs" ]]; then
            info "📋 Recent log files found:"
            echo "$recent_logs" | while read -r log_file; do
                local log_date=$(basename "$log_file" | sed 's/daily-email-\(.*\)\.log/\1/')
                local log_size=$(ls -lh "$log_file" | awk '{print $5}')
                echo "  📅 $log_date: $log_size"
            done
        fi
        
        return 1
    fi
}

# Check AWS SES quota and status
check_ses_status() {
    info "📧 Checking AWS SES status..."
    
    if command -v aws &> /dev/null; then
        # Check sending quota
        local quota_result=$(aws ses get-send-quota --region "$AWS_SES_REGION" 2>/dev/null || echo "{}")
        local max_24h=$(echo "$quota_result" | jq -r '.Max24HourSend // "unknown"' 2>/dev/null || echo "unknown")
        local sent_24h=$(echo "$quota_result" | jq -r '.SentLast24Hours // "unknown"' 2>/dev/null || echo "unknown")
        
        if [[ "$max_24h" != "unknown" ]] && [[ "$sent_24h" != "unknown" ]] && [[ "$max_24h" =~ ^[0-9]+$ ]] && [[ "$sent_24h" =~ ^[0-9]+$ ]]; then
            local remaining=$((max_24h - sent_24h))
            local usage_percent=$((sent_24h * 100 / max_24h))
            
            log "📊 SES Quota: ${sent_24h}/${max_24h} emails sent (${usage_percent}% used)"
            log "📈 Remaining today: $remaining emails"
            
            if [[ $usage_percent -gt 80 ]]; then
                warn "⚠️  SES quota usage is high (${usage_percent}%)"
            fi
        else
            warn "⚠️  Could not retrieve SES quota information"
        fi
        
        # Check account sending status
        local sending_status=$(aws ses get-account-sending-enabled --region "$AWS_SES_REGION" 2>/dev/null || echo "{}")
        local sending_enabled=$(echo "$sending_status" | jq -r '.Enabled // "unknown"' 2>/dev/null || echo "unknown")
        
        if [[ "$sending_enabled" == "true" ]]; then
            log "✅ SES account sending is enabled"
        elif [[ "$sending_enabled" == "false" ]]; then
            error "❌ SES account sending is disabled"
        else
            warn "⚠️  Could not determine SES sending status"
        fi
        
        return 0
    else
        warn "⚠️  AWS CLI not available for SES status check"
        return 1
    fi
}

# Show next email time
show_next_email_time() {
    info "⏰ Next email schedule..."
    
    local current_time=$(date +%H:%M)
    local current_hour=$(date +%H)
    local current_minute=$(date +%M)
    
    if [[ $current_hour -lt 10 ]]; then
        local time_until=$((10 * 60 - current_hour * 60 - current_minute))
        local hours_until=$((time_until / 60))
        local minutes_until=$((time_until % 60))
        
        if [[ $hours_until -gt 0 ]]; then
            log "📧 Next email in: ${hours_until}h ${minutes_until}m (10:00 AM today)"
        else
            log "📧 Next email in: ${minutes_until}m (10:00 AM today)"
        fi
    else
        local hours_until=$((24 - current_hour + 10))
        local minutes_until=$((60 - current_minute))
        
        if [[ $minutes_until -eq 60 ]]; then
            minutes_until=0
        else
            hours_until=$((hours_until - 1))
        fi
        
        log "📧 Next email in: ${hours_until}h ${minutes_until}m (10:00 AM tomorrow)"
    fi
}

# Main execution
main() {
    echo -e "${CYAN}🚀 AlexAI Star Trek System - Daily Email Status Check${NC}"
    echo "=================================================="
    echo ""
    
    local overall_status=0
    
    # Check all components
    if ! check_aws_config; then
        overall_status=1
    fi
    echo ""
    
    if ! check_cron_status; then
        overall_status=1
    fi
    echo ""
    
    if ! check_script_status; then
        overall_status=1
    fi
    echo ""
    
    if ! check_recent_logs; then
        overall_status=1
    fi
    echo ""
    
    if ! check_ses_status; then
        overall_status=1
    fi
    echo ""
    
    show_next_email_time
    echo ""
    
    # Overall status
    if [[ $overall_status -eq 0 ]]; then
        log "🎉 All systems are operational! Your daily emails will be sent automatically."
    else
        warn "⚠️  Some issues were detected. Please review the status above."
    fi
    
    echo ""
    echo "💡 Tips:"
    echo "  • Check your email inbox for test emails"
    echo "  • Monitor logs in: $LOG_DIR"
    echo "  • Use './scripts/automation/setup-daily-email-cron.sh -t' to test manually"
    echo "  • Use './scripts/automation/setup-daily-email-cron.sh -s' to show cron jobs"
}

# Run main function
main "$@"
