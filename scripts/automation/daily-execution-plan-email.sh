#!/bin/bash

# 🚀 AlexAI Star Trek System - Daily Execution Plan Email Automation
# This script sends automated daily execution plan emails at 10:00 AM

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
LOG_FILE="$PROJECT_ROOT/logs/daily-email-$(date +%Y%m%d).log"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if AWS SES environment variables are set
check_aws_config() {
    log "🔧 Checking AWS SES configuration..."
    
    if [[ -z "$AWS_SES_REGION" ]]; then
        error "❌ AWS_SES_REGION not set"
        return 1
    fi
    
    if [[ -z "$AWS_SES_FROM_EMAIL" ]]; then
        error "❌ AWS_SES_FROM_EMAIL not set"
        return 1
    fi
    
    if [[ -z "$AWS_SES_FROM_NAME" ]]; then
        error "❌ AWS_SES_FROM_NAME not set"
        return 1
    fi
    
    if [[ -z "$AWS_SES_CONFIGURATION_SET" ]]; then
        error "❌ AWS_SES_CONFIGURATION_SET not set"
        return 1
    fi
    
    log "✅ AWS SES configuration verified"
    return 0
}

# Generate daily execution plan content
generate_execution_plan() {
    log "📝 Generating daily execution plan..."
    
    local today=$(date +%Y-%m-%d)
    local day_name=$(date +%A)
    
    # Get project status from your system
    local project_status=""
    if [[ -f "$PROJECT_ROOT/output/project-management/dashboard-data.json" ]]; then
        project_status=$(cat "$PROJECT_ROOT/output/project-management/dashboard-data.json" | jq -r '.status // "Active"' 2>/dev/null || echo "Active")
    else
        project_status="Active"
    fi
    
    # Generate priority tasks based on current projects
    local priority_tasks=""
    if [[ -f "$PROJECT_ROOT/output/project-management/daily-tasks.json" ]]; then
        priority_tasks=$(cat "$PROJECT_ROOT/output/project-management/daily-tasks.json" | jq -r '.tasks[0:3] | map("- " + .title) | join("\n")' 2>/dev/null || echo "- Review project status\n- Update workflow automation\n- Plan next sprint")
    else
        priority_tasks="- Review project status\n- Update workflow automation\n- Plan next sprint"
    fi
    
    # Generate progress update
    local progress_update=""
    if [[ -f "$PROJECT_ROOT/output/project-management/complete-project-management.json" ]]; then
        local total_projects=$(cat "$PROJECT_ROOT/output/project-management/complete-project-management.json" | jq '.projects | length' 2>/dev/null || echo "0")
        local completed_projects=$(cat "$PROJECT_ROOT/output/project-management/complete-project-management.json" | jq '.projects | map(select(.status == "completed")) | length' 2>/dev/null || echo "0")
        
        if [[ "$total_projects" -gt 0 ]]; then
            local completion_rate=$((completed_projects * 100 / total_projects))
            progress_update="Project completion rate: ${completion_rate}% (${completed_projects}/${total_projects} projects completed)"
        else
            progress_update="No active projects found"
        fi
    else
        progress_update="Current sprint is 75% complete"
    fi
    
    # Generate next actions
    local next_actions=""
    if [[ -f "$PROJECT_ROOT/output/project-management/daily-tasks.json" ]]; then
        next_actions=$(cat "$PROJECT_ROOT/output/project-management/daily-tasks.json" | jq -r '.tasks[3:6] | map("- " + .title) | join("\n")' 2>/dev/null || echo "- Schedule team meeting\n- Review budget allocation\n- Update documentation")
    else
        next_actions="- Schedule team meeting\n- Review budget allocation\n- Update documentation"
    fi
    
    # Create template data JSON
    cat > /tmp/daily-plan-data.json << EOF
{
    "date": "$today",
    "day_name": "$day_name",
    "name": "Brady",
    "priority_tasks": "$priority_tasks",
    "progress_update": "$progress_update",
    "next_actions": "$next_actions",
    "project_status": "$project_status"
}
EOF
    
    log "✅ Daily execution plan generated"
}

# Send email using AWS SES
send_daily_email() {
    log "📧 Sending daily execution plan email..."
    
    local template_data_file="/tmp/daily-plan-data.json"
    
    if [[ ! -f "$template_data_file" ]]; then
        error "❌ Template data file not found"
        return 1
    fi
    
    # Send email using AWS SES
    local result=$(aws ses send-templated-email \
        --source "$AWS_SES_FROM_EMAIL" \
        --destination "ToAddresses=$AWS_SES_FROM_EMAIL" \
        --template "DailyExecutionPlan" \
        --template-data "file://$template_data_file" \
        --configuration-set-name "$AWS_SES_CONFIGURATION_SET" \
        --region "$AWS_SES_REGION" \
        2>&1)
    
    if [[ $? -eq 0 ]]; then
        local message_id=$(echo "$result" | jq -r '.MessageId' 2>/dev/null || echo "unknown")
        log "✅ Daily execution plan email sent successfully"
        log "📨 Message ID: $message_id"
        
        # Clean up temporary file
        rm -f "$template_data_file"
        
        return 0
    else
        error "❌ Failed to send email: $result"
        return 1
    fi
}

# Main execution
main() {
    log "🚀 Starting daily execution plan email automation..."
    
    # Check AWS configuration
    if ! check_aws_config; then
        error "❌ AWS configuration check failed"
        exit 1
    fi
    
    # Generate execution plan
    generate_execution_plan
    
    # Send email
    if send_daily_email; then
        log "🎉 Daily execution plan email automation completed successfully"
        exit 0
    else
        error "❌ Daily execution plan email automation failed"
        exit 1
    fi
}

# Run main function
main "$@"
