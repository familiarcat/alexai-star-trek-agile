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

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AlexAI Unified Workflow Management System${NC}"
echo -e "================================================"
echo -e ""

# Check if environment variables are loaded
if [ -z "$N8N_BASE_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Environment variables not loaded. Please run:${NC}"
    echo -e "   source ~/.zshrc"
    echo -e ""
    exit 1
fi

echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo -e "   N8N_BASE_URL: $N8N_BASE_URL"
echo -e "   N8N_API_KEY: ${N8N_API_KEY:0:10}..."
echo -e ""

# Function to get all workflows from n8n
get_n8n_workflows() {
    echo -e "${BLUE}📋 Fetching current n8n workflows...${NC}"
    curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | jq '.data[] | {id, name, active, updatedAt}'
}

# Function to get local workflow files
get_local_workflows() {
    echo -e "${BLUE}📁 Local workflow files:${NC}"
    ls workflows/ | grep -E "(alexai|crew|coordination)" | sort
}

# Function to clean up duplicate workflows
cleanup_duplicates() {
    echo -e "${YELLOW}🧹 Cleaning up duplicate workflows...${NC}"
    
    # Get all workflows and find duplicates
    local duplicates=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
        jq -r '.data[] | select(.name | contains("AlexAI")) | "\(.id)|\(.name)"' | \
        sort | uniq -d -f1)
    
    if [ -n "$duplicates" ]; then
        echo -e "${RED}Found duplicate workflows:${NC}"
        echo "$duplicates"
        echo -e ""
        echo -e "${YELLOW}⚠️  Manual cleanup required. Please:${NC}"
        echo -e "   1. Open $N8N_BASE_URL"
        echo -e "   2. Go to Workflows"
        echo -e "   3. Delete duplicate entries (keep the most recent)"
        echo -e "   4. Run this script again"
        echo -e ""
    else
        echo -e "${GREEN}✅ No duplicate workflows found${NC}"
    fi
}

# Function to deploy local workflows
deploy_local_workflows() {
    echo -e "${BLUE}🚀 Deploying local workflows to n8n...${NC}"
    
    local workflow_dir="workflows"
    local deployed_count=0
    local failed_count=0
    
    for file in "$workflow_dir"/*.json; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            
            # Check if it's an AlexAI workflow
            if [[ "$filename" =~ ^alexai.* ]]; then
                echo -e "📤 Deploying: $filename"
                
                # Deploy workflow
                local response=$(curl -s -w "%{http_code}" -X POST \
                    -H "X-N8N-API-Key: $N8N_API_KEY" \
                    -H "Content-Type: application/json" \
                    -d @"$file" \
                    "$N8N_BASE_URL/api/v1/workflows")
                
                local http_code="${response: -3}"
                local response_body="${response%???}"
                
                if [ "$http_code" -eq 201 ]; then
                    echo -e "   ${GREEN}✅ Successfully deployed${NC}"
                    ((deployed_count++))
                else
                    echo -e "   ${RED}❌ Failed (HTTP $http_code)${NC}"
                    echo -e "   Response: $response_body"
                    ((failed_count++))
                fi
            fi
        fi
    done
    
    echo -e ""
    echo -e "${GREEN}📊 Deployment Summary:${NC}"
    echo -e "   Successfully deployed: $deployed_count"
    echo -e "   Failed: $failed_count"
    echo -e ""
}

# Function to activate critical workflows
activate_critical_workflows() {
    echo -e "${BLUE}🔧 Activating critical workflows...${NC}"
    
    # List of critical workflow names to activate
    local critical_workflows=(
        "AlexAI Crew Request Webhook"
        "AlexAI Complete Crew Coordination Workflow"
        "AlexAI Enhanced Current Workflow"
    )
    
    for workflow_name in "${critical_workflows[@]}"; do
        echo -e "🔍 Looking for: $workflow_name"
        
        # Find workflow ID by name
        local workflow_id=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
            jq -r --arg name "$workflow_name" '.data[] | select(.name == $name) | .id' | head -1)
        
        if [ -n "$workflow_id" ] && [ "$workflow_id" != "null" ]; then
            echo -e "   Found ID: $workflow_id"
            
            # Check if already active
            local is_active=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
                jq -r --arg id "$workflow_id" '.data[] | select(.id == $id) | .active')
            
            if [ "$is_active" = "true" ]; then
                echo -e "   ${GREEN}✅ Already active${NC}"
            else
                echo -e "   ${YELLOW}⚠️  Manual activation required${NC}"
                echo -e "      Open $N8N_BASE_URL/workflow/$workflow_id and activate"
            fi
        else
            echo -e "   ${RED}❌ Not found on server${NC}"
        fi
        echo -e ""
    done
}

# Function to start enhanced sync
start_enhanced_sync() {
    echo -e "${BLUE}🔄 Starting enhanced bilateral sync...${NC}"
    
    # Check if sync manager is running
    if pgrep -f "enhanced-sync-manager.js" > /dev/null; then
        echo -e "${YELLOW}⚠️  Sync manager already running${NC}"
        echo -e "   To restart: pkill -f 'enhanced-sync-manager.js' && npm run sync:start"
    else
        echo -e "${GREEN}🚀 Starting sync manager...${NC}"
        npm run sync:start &
        sleep 2
        
        if pgrep -f "enhanced-sync-manager.js" > /dev/null; then
            echo -e "${GREEN}✅ Sync manager started successfully${NC}"
        else
            echo -e "${RED}❌ Failed to start sync manager${NC}"
        fi
    fi
}

# Function to show sync status
show_sync_status() {
    echo -e "${BLUE}📊 Current Sync Status:${NC}"
    echo -e "=========================="
    echo -e ""
    
    # Check if sync manager is running
    if pgrep -f "enhanced-sync-manager.js" > /dev/null; then
        echo -e "${GREEN}🔄 Sync Manager: Running${NC}"
        local pid=$(pgrep -f "enhanced-sync-manager.js")
        echo -e "   Process ID: $pid"
    else
        echo -e "${RED}🔄 Sync Manager: Not Running${NC}"
    fi
    
    echo -e ""
    
    # Show recent sync logs
    if [ -f "bilateral-sync/logs/sync.log" ]; then
        echo -e "${BLUE}📝 Recent Sync Logs:${NC}"
        tail -10 bilateral-sync/logs/sync.log
    else
        echo -e "${YELLOW}📝 No sync logs found${NC}"
    fi
}

# Main menu
show_menu() {
    echo -e "${BLUE}🎯 Available Actions:${NC}"
    echo -e "====================="
    echo -e ""
    echo -e "1. 📋 View current n8n workflows"
    echo -e "2. 📁 View local workflow files"
    echo -e "3. 🧹 Clean up duplicate workflows"
    echo -e "4. 🚀 Deploy all local workflows"
    echo -e "5. 🔧 Activate critical workflows"
    echo -e "6. 🔄 Start enhanced sync"
    echo -e "7. 📊 Show sync status"
    echo -e "8. 🎯 Full unification (all steps)"
    echo -e "9. ❌ Exit"
    echo -e ""
}

# Main execution
main() {
    while true; do
        show_menu
        read -p "Choose an option (1-9): " choice
        
        case $choice in
            1)
                get_n8n_workflows
                ;;
            2)
                get_local_workflows
                ;;
            3)
                cleanup_duplicates
                ;;
            4)
                deploy_local_workflows
                ;;
            5)
                activate_critical_workflows
                ;;
            6)
                start_enhanced_sync
                ;;
            7)
                show_sync_status
                ;;
            8)
                echo -e "${BLUE}🎯 Starting full unification process...${NC}"
                echo -e "======================================"
                echo -e ""
                cleanup_duplicates
                echo -e ""
                deploy_local_workflows
                echo -e ""
                activate_critical_workflows
                echo -e ""
                start_enhanced_sync
                echo -e ""
                show_sync_status
                echo -e ""
                echo -e "${GREEN}🎉 Full unification process completed!${NC}"
                ;;
            9)
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid option. Please choose 1-9.${NC}"
                ;;
        esac
        
        echo -e ""
        read -p "Press Enter to continue..."
        echo -e ""
    done
}

# Check if running interactively
if [ -t 0 ]; then
    main
else
    echo -e "${YELLOW}⚠️  This script requires interactive input.${NC}"
    echo -e "   Please run it directly: ./scripts/setup/unified-workflow-manager.sh"
    exit 1
fi
