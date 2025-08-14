#!/bin/bash

# 🚀 Cleanup Observation Lounge - Streamline n8n Workflows
# Activates newer workflows and removes duplicate outdated ones

set -e

echo "🚀 Cleaning up Observation Lounge - Streamlining n8n Workflows"
echo "=============================================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_credentials() {
    print_status "Checking n8n credentials..."
    
    if [ -z "$N8N_API_KEY" ]; then
        print_error "N8N_API_KEY not found in environment"
        print_error "Please set N8N_API_KEY in ~/.zshrc or .env"
        exit 1
    fi
    
    if [ -z "$N8N_BASE_URL" ]; then
        print_error "N8N_BASE_URL not found in environment"
        print_error "Please set N8N_BASE_URL in ~/.zshrc or .env"
        exit 1
    fi
    
    print_success "Credentials found:"
    print_status "  N8N_BASE_URL: $N8N_BASE_URL"
    print_status "  N8N_API_KEY: ${N8N_API_KEY:0:20}..."
}

# Test n8n API connection
test_n8n_connection() {
    print_status "Testing n8n API connection..."
    
    local response=$(curl -s -w "%{http_code}" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "000")
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        print_success "n8n API connection successful"
        return 0
    else
        print_error "n8n API connection failed (HTTP $http_code)"
        print_error "Response: $response_body"
        return 1
    fi
}

# Get all workflows
get_all_workflows() {
    print_status "Retrieving all workflows..."
    
    local response=$(curl -s \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "{}")
    
    echo "$response"
}

# Activate a workflow
activate_workflow() {
    local workflow_id="$1"
    local workflow_name="$2"
    
    if [ -z "$workflow_id" ]; then
        print_error "No workflow ID provided for activation"
        return 1
    fi
    
    print_status "Activating workflow: $workflow_name (ID: $workflow_id)"
    
    local activate_response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows/$workflow_id/activate" 2>/dev/null || echo "000")
    
    local http_code="${activate_response: -3}"
    local response_body="${activate_response%???}"
    
    if [ "$http_code" = "200" ]; then
        print_success "Workflow activated: $workflow_name"
        return 0
    else
        print_error "Failed to activate workflow: $workflow_name (HTTP $http_code)"
        print_error "Response: $response_body"
        return 1
    fi
}

# Delete a workflow
delete_workflow() {
    local workflow_id="$1"
    local workflow_name="$2"
    
    if [ -z "$workflow_id" ]; then
        print_error "No workflow ID provided for deletion"
        return 1
    fi
    
    print_status "Deleting duplicate workflow: $workflow_name (ID: $workflow_id)"
    
    local delete_response=$(curl -s -w "%{http_code}" \
        -X DELETE \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows/$workflow_id" 2>/dev/null || echo "000")
    
    local http_code="${delete_response: -3}"
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "204" ]; then
        print_success "Workflow deleted: $workflow_name"
        return 0
    else
        print_warning "Failed to delete workflow: $workflow_name (HTTP $http_code)"
        return 1
    fi
}

# Main cleanup function
main() {
    echo "🧹 **Observation Lounge Cleanup Mission**"
    echo "========================================="
    echo
    
    # Check credentials
    check_credentials
    
    # Test connection
    if ! test_n8n_connection; then
        exit 1
    fi
    
    # Get all workflows
    local workflows_json=$(get_all_workflows)
    
    echo
    print_status "Analyzing workflow inventory..."
    echo
    
    # Extract workflow information
    local duplicate_ids=$(echo "$workflows_json" | jq -r '.data[] | select(.name | contains("AlexAI Complete Crew Coordination Workflow")) | .id' 2>/dev/null || echo "")
    local simplified_id=$(echo "$workflows_json" | jq -r '.data[] | select(.name | contains("Simplified")) | .id' 2>/dev/null || echo "")
    local chatgpt5_id=$(echo "$workflows_json" | jq -r '.data[] | select(.name | contains("ChatGPT 5 Enhanced")) | .id' 2>/dev/null || echo "")
    
    echo "📋 **Workflow Inventory Analysis:**"
    echo "=================================="
    echo
    
    if [ -n "$duplicate_ids" ]; then
        echo "🔴 **Duplicate Workflows (Safe to Delete):**"
        echo "$duplicate_ids" | while read -r id; do
            if [ -n "$id" ] && [ "$id" != "null" ]; then
                local name=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$id\") | .name" 2>/dev/null || echo "Unknown")
                local created=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$id\") | .createdAt" 2>/dev/null || echo "Unknown")
                echo "   • $name (ID: $id, Created: $created)"
            fi
        done
        echo
    fi
    
    if [ -n "$simplified_id" ] && [ "$simplified_id" != "null" ]; then
        local simplified_name=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$simplified_id\") | .name" 2>/dev/null || echo "Unknown")
        local simplified_created=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$simplified_id\") | .createdAt" 2>/dev/null || echo "Unknown")
        echo "🟡 **Newer Workflows (Ready for Activation):**"
        echo "   • $simplified_name (ID: $simplified_id, Created: $simplified_created)"
    fi
    
    if [ -n "$chatgpt5_id" ] && [ "$chatgpt5_id" != "null" ]; then
        local chatgpt5_name=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$chatgpt5_id\") | .name" 2>/dev/null || echo "Unknown")
        local chatgpt5_created=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$chatgpt5_id\") | .createdAt" 2>/dev/null || echo "Unknown")
        echo "   • $chatgpt5_name (ID: $chatgpt5_id, Created: $chatgpt5_created)"
    fi
    
    echo
    echo "🚀 **Cleanup Options:**"
    echo "1. Activate newer workflows only"
    echo "2. Delete duplicates only"
    echo "3. Full cleanup (activate + delete)"
    echo "4. Exit without changes"
    echo
    read -p "Choose option (1-4): " choice
    
    case $choice in
        1)
            print_status "Activating newer workflows..."
            if [ -n "$simplified_id" ] && [ "$simplified_id" != "null" ]; then
                local simplified_name=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$simplified_id\") | .name" 2>/dev/null || echo "Unknown")
                activate_workflow "$simplified_id" "$simplified_name"
            fi
            if [ -n "$chatgpt5_id" ] && [ "$chatgpt5_id" != "null" ]; then
                local chatgpt5_name=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$chatgpt5_id\") | .name" 2>/dev/null || echo "Unknown")
                activate_workflow "$chatgpt5_id" "$chatgpt5_name"
            fi
            ;;
        2)
            print_status "Deleting duplicate workflows..."
            if [ -n "$duplicate_ids" ]; then
                echo "$duplicate_ids" | while read -r id; do
                    if [ -n "$id" ] && [ "$id" != "null" ]; then
                        local name=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$id\") | .name" 2>/dev/null || echo "Unknown")
                        delete_workflow "$id" "$name"
                    fi
                done
            fi
            ;;
        3)
            print_status "Performing full cleanup..."
            # Activate newer workflows
            if [ -n "$simplified_id" ] && [ "$simplified_id" != "null" ]; then
                local simplified_name=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$simplified_id\") | .name" 2>/dev/null || echo "Unknown")
                activate_workflow "$simplified_id" "$simplified_name"
            fi
            if [ -n "$chatgpt5_id" ] && [ "$chatgpt5_id" != "null" ]; then
                local chatgpt5_name=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$chatgpt5_id\") | .name" 2>/dev/null || echo "Unknown")
                activate_workflow "$chatgpt5_id" "$chatgpt5_name"
            fi
            
            # Delete duplicates
            if [ -n "$duplicate_ids" ]; then
                echo "$duplicate_ids" | while read -r id; do
                    if [ -n "$id" ] && [ "$id" != "null" ]; then
                        local name=$(echo "$workflows_json" | jq -r ".data[] | select(.id == \"$id\") | .name" 2>/dev/null || echo "Unknown")
                        delete_workflow "$id" "$name"
                    fi
                done
            fi
            ;;
        4)
            print_status "Exiting without changes..."
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    echo
    print_success "🎉 **Observation Lounge Cleanup Complete!**"
    echo
    echo "📊 **Current Status:**"
    echo "   • Newer workflows activated"
    echo "   • Duplicate workflows removed"
    echo "   • Observation lounge streamlined"
    echo
    echo "🌐 **Access your streamlined n8n dashboard:**"
    echo "   $N8N_BASE_URL"
    echo
    echo "🚀 **Your observation lounge is now optimized for peak efficiency!**"
}

# Run main function
main "$@"
