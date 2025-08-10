#!/bin/bash

# N8N Workflow Cleanup Manager
# Cleans up workflows to only keep project-relevant ones with proper formatting

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BILATERAL_DIR="${PROJECT_ROOT}/bilateral-sync"
CONFIG_FILE="${BILATERAL_DIR}/config.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load configuration
if [[ -f "$CONFIG_FILE" ]]; then
    N8N_BASE_URL=$(jq -r '.n8n.baseUrl' "$CONFIG_FILE")
    N8N_API_KEY=$(jq -r '.n8n.apiKey' "$CONFIG_FILE")
    
    # Handle ENV_ prefixed values
    if [[ "$N8N_API_KEY" == ENV_* ]]; then
        N8N_API_KEY="${!N8N_API_KEY#ENV_}"
    fi
else
    echo -e "${RED}Config file not found: $CONFIG_FILE${NC}"
    exit 1
fi

# Source environment variables (suppress zstyle errors)
if [[ -f ~/.zshrc ]]; then
    source ~/.zshrc 2>/dev/null || true
fi

# Override with environment variables if available
N8N_BASE_URL="${N8N_BASE_URL:-$N8N_BASE_URL}"
N8N_API_KEY="${N8N_API_KEY:-$N8N_API_KEY}"

# Validate required variables
if [[ -z "$N8N_BASE_URL" || -z "$N8N_API_KEY" ]]; then
    echo -e "${RED}Missing required environment variables${NC}"
    echo "N8N_BASE_URL: $N8N_BASE_URL"
    echo "N8N_API_KEY: ${N8N_API_KEY:0:10}..."
    exit 1
fi

# Project-relevant workflow patterns
PROJECT_PATTERNS=(
    "AlexAI*"
    "alexai*"
    "Crew*"
    "crew*"
    "Coordination*"
    "coordination*"
    "Bilateral*"
    "bilateral*"
)

# Workflows to keep (exact names)
KEEP_WORKFLOWS=(
    "AlexAI Complete Crew Workflow"
    "AlexAI Crew Coordination Workflow"
    "AlexAI Enhanced AI Insights Workflow"
    "AlexAI Enhanced Ship Agency - Multi-LLM Crew Orchestration"
    "AlexAI ChatGPT 5 Ready - Multi-LLM Crew Coordination"
    "AlexAI Simplified Crew Coordination"
    "AlexAI Bilateral Learning Workflow"
)

# Workflows to remove (exact names)
REMOVE_WORKFLOWS=(
    "Build Your First AI Agent"
    "Demo: My first AI Agent in n8n"
    "My workflow"
    "My workflow 2"
    "Screenplay"
    "Simple Test Workflow"
    "Simple Crew Workflow"
    "AlexAI Enhanced Current Workflow"
    "AlexAI Complete Crew Coordination Workflow"
    "AlexAI Optimized Crew Coordination"
)

# Function to make API request to n8n
n8n_api_request() {
    local endpoint="$1"
    local method="${2:-GET}"
    local data="${3:-}"
    
    local url="${N8N_BASE_URL}${endpoint}"
    local headers=(
        "-H" "X-N8N-API-KEY: $N8N_API_KEY"
        "-H" "Content-Type: application/json"
    )
    
    if [[ "$method" == "DELETE" ]]; then
        curl -s -X DELETE "$url" "${headers[@]}"
    elif [[ "$method" == "POST" ]]; then
        curl -s -X POST "$url" "${headers[@]}" -d "$data"
    else
        curl -s -X GET "$url" "${headers[@]}"
    fi
}

# Function to get all workflows from n8n
get_n8n_workflows() {
    echo -e "${BLUE}Fetching workflows from n8n...${NC}"
    
    local response=$(n8n_api_request "/api/v1/workflows")
    
    if [[ $? -eq 0 ]]; then
        echo "$response" | jq -r '.data[] | "\(.id)|\(.name)|\(.active)|\(.updatedAt)"' 2>/dev/null || {
            echo -e "${RED}Failed to parse n8n response${NC}"
            echo "Response: $response"
            return 1
        }
    else
        echo -e "${RED}Failed to fetch workflows from n8n${NC}"
        return 1
    fi
}

# Function to validate workflow JSON format
validate_workflow_json() {
    local workflow_file="$1"
    
    if [[ ! -f "$workflow_file" ]]; then
        echo -e "${RED}Workflow file not found: $workflow_file${NC}"
        return 1
    fi
    
    if ! jq empty "$workflow_file" 2>/dev/null; then
        echo -e "${RED}Invalid JSON in: $workflow_file${NC}"
        return 1
    fi
    
    echo -e "${GREEN}Valid JSON: $workflow_file${NC}"
    return 0
}

# Function to delete workflow from n8n
delete_n8n_workflow() {
    local workflow_id="$1"
    local workflow_name="$2"
    
    echo -e "${YELLOW}Deleting workflow: $workflow_name (ID: $workflow_id)${NC}"
    
    local response=$(n8n_api_request "/api/v1/workflows/$workflow_id" "DELETE")
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}Successfully deleted: $workflow_name${NC}"
        return 0
    else
        echo -e "${RED}Failed to delete: $workflow_name${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Function to upload workflow to n8n
upload_workflow_to_n8n() {
    local workflow_file="$1"
    local workflow_name="$2"
    
    echo -e "${BLUE}Uploading workflow: $workflow_name${NC}"
    
    # Read and prepare workflow data
    local workflow_data=$(jq -c '.' "$workflow_file")
    
    # Create upload payload
    local payload=$(jq -n \
        --arg name "$workflow_name" \
        --argjson nodes "$(jq '.nodes' "$workflow_file")" \
        --argjson connections "$(jq '.connections' "$workflow_file")" \
        --argjson settings "$(jq '.settings // {}' "$workflow_file")" \
        --argjson staticData "$(jq '.staticData // null' "$workflow_file")" \
        --argjson meta "$(jq '.meta // {}' "$workflow_file")" \
        '{
            name: $name,
            nodes: $nodes,
            connections: $connections,
            settings: $settings,
            staticData: $staticData,
            meta: $meta,
            active: false
        }')
    
    local response=$(n8n_api_request "/api/v1/workflows" "POST" "$payload")
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}Successfully uploaded: $workflow_name${NC}"
        return 0
    else
        echo -e "${RED}Failed to upload: $workflow_name${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Function to clean up local workflow files
cleanup_local_workflows() {
    echo -e "${BLUE}Cleaning up local workflow files...${NC}"
    
    local sync_workflows_dir="${PROJECT_ROOT}/sync-system/workflows"
    local bilateral_workflows_dir="${PROJECT_ROOT}/bilateral-sync/workflows"
    
    # Create backup directory
    local backup_dir="${PROJECT_ROOT}/workflow-backup-$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    echo -e "${YELLOW}Creating backup in: $backup_dir${NC}"
    
    # Backup all current workflows
    if [[ -d "$sync_workflows_dir" ]]; then
        cp -r "$sync_workflows_dir" "$backup_dir/"
    fi
    if [[ -d "$bilateral_workflows_dir" ]]; then
        cp -r "$bilateral_workflows_dir" "$backup_dir/"
    fi
    
    echo -e "${GREEN}Backup created successfully${NC}"
    
    # Remove non-project workflows
    for workflow_file in "$sync_workflows_dir"/*.json; do
        if [[ -f "$workflow_file" ]]; then
            local filename=$(basename "$workflow_file")
            local should_keep=false
            
            for pattern in "${PROJECT_PATTERNS[@]}"; do
                if [[ "$filename" == $pattern ]]; then
                    should_keep=true
                    break
                fi
            done
            
            if [[ "$should_keep" == false ]]; then
                echo -e "${YELLOW}Removing non-project workflow: $filename${NC}"
                rm "$workflow_file"
            fi
        fi
    done
    
    echo -e "${GREEN}Local workflow cleanup completed${NC}"
}

# Function to validate all project workflows
validate_project_workflows() {
    echo -e "${BLUE}Validating project workflow formats...${NC}"
    
    local sync_workflows_dir="${PROJECT_ROOT}/sync-system/workflows"
    local valid_count=0
    local invalid_count=0
    
    for workflow_file in "$sync_workflows_dir"/*.json; do
        if [[ -f "$workflow_file" ]]; then
            if validate_workflow_json "$workflow_file"; then
                ((valid_count++))
            else
                ((invalid_count++))
            fi
        fi
    done
    
    echo -e "${BLUE}Validation Results:${NC}"
    echo -e "  Valid workflows: $valid_count"
    echo -e "  Invalid workflows: $invalid_count"
    
    if [[ $invalid_count -gt 0 ]]; then
        echo -e "${YELLOW}Some workflows have formatting issues${NC}"
        return 1
    fi
    
    return 0
}

# Function to sync clean workflows to n8n
sync_clean_workflows() {
    echo -e "${BLUE}Syncing clean workflows to n8n...${NC}"
    
    local sync_workflows_dir="${PROJECT_ROOT}/sync-system/workflows"
    local success_count=0
    local total_count=0
    
    for workflow_file in "$sync_workflows_dir"/*.json; do
        if [[ -f "$workflow_file" ]]; then
            local filename=$(basename "$workflow_file" .json)
            local workflow_name=$(echo "$filename" | sed 's/-/ /g' | sed 's/_/ /g' | sed 's/\b\w/\U&/g')
            
            ((total_count++))
            
            if upload_workflow_to_n8n "$workflow_file" "$workflow_name"; then
                ((success_count++))
            fi
        fi
    done
    
    echo -e "${BLUE}Sync Results:${NC}"
    echo -e "  Successfully synced: $success_count"
    echo -e "  Failed to sync: $((total_count - success_count))"
    echo -e "  Total workflows: $total_count"
}

# Function to show current n8n workflow status
show_n8n_status() {
    echo -e "${BLUE}Current N8N Workflow Status${NC}"
    echo "=================================="
    
    local workflows=$(get_n8n_workflows)
    
    if [[ $? -eq 0 ]]; then
        echo "$workflows" | while IFS='|' read -r id name active updated_at; do
            local status_icon="Active"
            local status_text="Active"
            
            if [[ "$active" == "false" ]]; then
                status_icon="Inactive"
                status_text="Inactive"
            fi
            
            echo -e "  $status_icon $name ($status_text)"
            echo -e "     ID: $id | Updated: $updated_at"
        done
    else
        echo -e "${RED}Failed to fetch workflow status${NC}"
    fi
}

# Function to show cleanup plan
show_cleanup_plan() {
    echo -e "${BLUE}Workflow Cleanup Plan${NC}"
    echo "=============================="
    echo ""
    echo -e "${GREEN}Workflows to KEEP:${NC}"
    for workflow in "${KEEP_WORKFLOWS[@]}"; do
        echo -e "  • $workflow"
    done
    echo ""
    echo -e "${RED}Workflows to REMOVE:${NC}"
    for workflow in "${REMOVE_WORKFLOWS[@]}"; do
        echo -e "  • $workflow"
    done
    echo ""
    echo -e "${YELLOW}This will:${NC}"
    echo -e "  1. Create a backup of current workflows"
    echo -e "  2. Remove non-project workflows from n8n"
    echo -e "  3. Clean up local workflow files"
    echo -e "  4. Validate remaining workflow formats"
    echo -e "  5. Sync clean workflows back to n8n"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}N8N Workflow Cleanup Manager${NC}"
    echo "====================================="
    echo ""
    
    case "${1:-}" in
        --plan)
            show_cleanup_plan
            ;;
        --status)
            show_n8n_status
            ;;
        --validate)
            validate_project_workflows
            ;;
        --cleanup-local)
            cleanup_local_workflows
            ;;
        --sync)
            sync_clean_workflows
            ;;
        --full-cleanup)
            echo -e "${YELLOW}Starting full workflow cleanup...${NC}"
            echo ""
            
            # Show plan first
            show_cleanup_plan
            
            read -p "Continue with cleanup? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo -e "${YELLOW}Cleanup cancelled${NC}"
                exit 0
            fi
            
            # Execute cleanup steps
            cleanup_local_workflows
            validate_project_workflows
            sync_clean_workflows
            
            echo -e "${GREEN}Full workflow cleanup completed!${NC}"
            ;;
        --help)
            echo "Usage: $0 [OPTION]"
            echo "Options:"
            echo "  --plan           Show cleanup plan"
            echo "  --status         Show current n8n workflow status"
            echo "  --validate       Validate local workflow formats"
            echo "  --cleanup-local  Clean up local workflow files only"
            echo "  --sync           Sync clean workflows to n8n"
            echo "  --full-cleanup   Execute complete cleanup process"
            echo "  --help           Show this help"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}No option specified. Use --help for usage information.${NC}"
            exit 1
            ;;
    esac
}

# Handle command line arguments
main "$@"
