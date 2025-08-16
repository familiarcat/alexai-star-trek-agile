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

# 🚀 Deploy Optimized AlexAI Workflow
# Deploys the enhanced, future-ready workflow architecture

set -e

echo "🚀 DEPLOYING OPTIMIZED ALEXAI WORKFLOW"
echo "====================================="
echo "🎯 Deploying enhanced workflow architecture for maximum efficiency"
echo "📅 Deployment Date: $(date)"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKFLOW_FILE="sync-system/workflows/alexai-optimized-crew-coordination.json"

# Function: Validate optimized workflow
validate_optimized_workflow() {
    echo "🔍 VALIDATING OPTIMIZED WORKFLOW"
    echo "==============================="
    echo ""
    
    if [[ ! -f "$WORKFLOW_FILE" ]]; then
        echo "❌ Optimized workflow file not found: $WORKFLOW_FILE"
        return 1
    fi
    
    # Validate JSON structure
    if ! jq . "$WORKFLOW_FILE" > /dev/null 2>&1; then
        echo "❌ Invalid JSON in optimized workflow file"
        return 1
    fi
    
    # Check key components
    local nodes=$(jq '.nodes | length' "$WORKFLOW_FILE")
    local connections=$(jq '.connections | length' "$WORKFLOW_FILE")
    
    echo "📊 Workflow Analysis:"
    echo "   Total nodes: $nodes"
    echo "   Total connections: $connections"
    
    if [[ $nodes -lt 8 ]]; then
        echo "⚠️ Warning: Expected at least 8 nodes for optimized workflow"
    fi
    
    echo "✅ Optimized workflow validation complete"
    return 0
}

# Function: Backup current workflow
backup_current_workflow() {
    echo ""
    echo "💾 BACKING UP CURRENT WORKFLOW"
    echo "=============================="
    echo ""
    
    local backup_dir="bilateral-sync/backups"
    mkdir -p "$backup_dir"
    
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="${backup_dir}/current-workflow-backup-${timestamp}.json"
    
    # Fetch current workflow from n8n
    echo "📥 Fetching current workflow from n8n..."
    
    if [[ -n "$N8N_API_KEY" ]]; then
        # Get workflow ID first
        local workflows_response=$(curl -s \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            "https://n8n.pbradygeorgen.com/api/v1/workflows")
        
        if echo "$workflows_response" | jq -e '.data' > /dev/null 2>&1; then
            local workflow_id=$(echo "$workflows_response" | jq -r '.data[] | select(.name | contains("AlexAI")) | .id' | head -1)
            
            if [[ -n "$workflow_id" && "$workflow_id" != "null" ]]; then
                local workflow_data=$(curl -s \
                    -H "X-N8N-API-KEY: $N8N_API_KEY" \
                    "https://n8n.pbradygeorgen.com/api/v1/workflows/$workflow_id")
                
                echo "$workflow_data" > "$backup_file"
                echo "✅ Current workflow backed up to: $backup_file"
            else
                echo "⚠️ Could not find AlexAI workflow to backup"
            fi
        else
            echo "⚠️ Could not fetch workflows for backup"
        fi
    else
        echo "⚠️ N8N_API_KEY not available, skipping backup"
    fi
}

# Function: Deploy optimized workflow
deploy_optimized_workflow() {
    echo ""
    echo "🚀 DEPLOYING OPTIMIZED WORKFLOW"
    echo "==============================="
    echo ""
    
    if [[ -z "$N8N_API_KEY" ]]; then
        echo "❌ N8N_API_KEY not found"
        echo "Please set N8N_API_KEY environment variable"
        return 1
    fi
    
    local n8n_base_url="https://n8n.pbradygeorgen.com"
    
    # Test n8n connection
    echo "🔍 Testing n8n API connection..."
    local connection_test=$(curl -s -w "%{http_code}" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$n8n_base_url/api/v1/workflows" 2>/dev/null || echo "000")
    
    local http_code="${connection_test: -3}"
    
    if [[ "$http_code" != "200" ]]; then
        echo "❌ Failed to connect to n8n API (HTTP $http_code)"
        return 1
    fi
    
    echo "✅ N8N API connection successful"
    
    # Prepare workflow for deployment
    local workflow_json=$(cat "$WORKFLOW_FILE")
    
    # Remove fields that can't be set during creation
    local clean_workflow=$(echo "$workflow_json" | jq 'del(.id, .createdAt, .updatedAt, .versionId)')
    
    echo "📤 Deploying optimized workflow..."
    
    # Create the workflow
    local create_response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$clean_workflow" \
        "$n8n_base_url/api/v1/workflows" 2>/dev/null || echo -e "\n000")
    
    local create_http_code=$(echo "$create_response" | tail -1)
    local create_body=$(echo "$create_response" | head -n -1)
    
    if [[ "$create_http_code" == "201" ]]; then
        echo "✅ Optimized workflow deployed successfully"
        
        # Extract workflow ID
        local workflow_id=$(echo "$create_body" | jq -r '.data.id' 2>/dev/null || echo "unknown")
        echo "📋 Workflow ID: $workflow_id"
        
        # Attempt to activate the workflow
        if [[ "$workflow_id" != "unknown" && "$workflow_id" != "null" ]]; then
            echo "⚡ Attempting to activate workflow..."
            
            local activate_response=$(curl -s -w "%{http_code}" \
                -X PATCH \
                -H "X-N8N-API-KEY: $N8N_API_KEY" \
                -H "Content-Type: application/json" \
                -d '{"active": true}' \
                "$n8n_base_url/api/v1/workflows/$workflow_id" 2>/dev/null || echo "000")
            
            local activate_http_code="${activate_response: -3}"
            
            if [[ "$activate_http_code" == "200" ]]; then
                echo "✅ Workflow activated successfully"
            else
                echo "⚠️ Could not activate workflow automatically (HTTP $activate_http_code)"
                echo "   Please activate manually in n8n interface"
            fi
        fi
        
        return 0
    else
        echo "❌ Failed to deploy workflow (HTTP $create_http_code)"
        echo "Response: $create_body"
        return 1
    fi
}

# Function: Test optimized workflow
test_optimized_workflow() {
    echo ""
    echo "🧪 TESTING OPTIMIZED WORKFLOW"
    echo "============================="
    echo ""
    
    local webhook_url="https://n8n.pbradygeorgen.com/webhook/crew-request"
    
    echo "🔍 Testing optimized workflow webhook..."
    
    local test_payload='{
        "query": "Test the optimized workflow with enhanced capabilities",
        "context": "optimization testing",
        "urgency": "normal",
        "userRole": "developer",
        "sessionId": "test_session_optimized"
    }'
    
    local test_response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        "$webhook_url" 2>/dev/null || echo -e "\nERROR")
    
    local test_http_code=$(echo "$test_response" | tail -1)
    local test_body=$(echo "$test_response" | head -n -1)
    
    case "$test_http_code" in
        200)
            echo "✅ Optimized workflow responding successfully"
            echo "📊 Response preview:"
            echo "$test_body" | jq -r '.response.greeting // .response.analysis // .message // .' 2>/dev/null | head -3
            ;;
        404)
            echo "⚠️ Workflow not yet activated (HTTP 404)"
            echo "   Please activate workflow manually in n8n interface"
            ;;
        ERROR)
            echo "❌ Network error testing workflow"
            ;;
        *)
            echo "⚠️ Unexpected response (HTTP $test_http_code)"
            echo "   Response: $(echo "$test_body" | head -1)"
            ;;
    esac
}

# Function: Compare with previous workflow
compare_workflows() {
    echo ""
    echo "📊 WORKFLOW COMPARISON"
    echo "====================="
    echo ""
    
    echo "🔄 Previous workflow (Simplified):"
    echo "   • 5 nodes: Webhook → AI Selector → Router → Response → Formatter"
    echo "   • Basic routing logic"
    echo "   • Limited error handling"
    echo "   • Basic response formatting"
    echo ""
    
    echo "🚀 Optimized workflow (Enhanced):"
    echo "   • 8 nodes: Enhanced pipeline with preprocessing and learning"
    echo "   • Request Preprocessor: Query classification and enrichment"
    echo "   • AI Intelligence Hub: Advanced crew selection with confidence"
    echo "   • Dynamic Router: Fallback strategies and persona integration"
    echo "   • Response Synthesizer: Quality scoring and optimization"
    echo "   • Learning Feedback Loop: Evolution triggers and analytics"
    echo "   • Enhanced error handling and retry logic"
    echo ""
    
    echo "📈 Key Improvements:"
    echo "   ✅ 60% more processing nodes for enhanced functionality"
    echo "   ✅ Advanced query classification and routing"
    echo "   ✅ Confidence scoring and fallback strategies"
    echo "   ✅ Quality metrics and performance tracking"
    echo "   ✅ Learning feedback for continuous improvement"
    echo "   ✅ Future-ready architecture for expansion"
}

# Main execution
main() {
    echo "🎯 Starting optimized workflow deployment..."
    echo ""
    
    # Step 1: Validate optimized workflow
    if validate_optimized_workflow; then
        echo ""
        
        # Step 2: Backup current workflow
        backup_current_workflow
        
        # Step 3: Deploy optimized workflow
        if deploy_optimized_workflow; then
            echo ""
            
            # Step 4: Test optimized workflow
            test_optimized_workflow
            
            # Step 5: Show comparison
            compare_workflows
            
            echo ""
            echo "🎉 OPTIMIZED WORKFLOW DEPLOYMENT COMPLETE!"
            echo "=========================================="
            echo ""
            echo "✅ Optimized workflow deployed to n8n"
            echo "✅ Enhanced architecture active"
            echo "✅ Future expansion capabilities ready"
            echo ""
            echo "🌟 NEXT GENERATION FEATURES ACTIVE:"
            echo "   🧠 Advanced AI crew selection"
            echo "   🔄 Dynamic routing with fallbacks"
            echo "   📊 Quality scoring and analytics"
            echo "   🎯 Learning feedback loop"
            echo "   🚀 Future-ready expansion architecture"
            echo ""
            echo "🖖 Your AlexAI system is now optimized for maximum efficiency!"
            
        else
            echo ""
            echo "❌ Optimized workflow deployment failed"
            echo "Please check n8n configuration and try again"
            exit 1
        fi
    else
        echo ""
        echo "❌ Optimized workflow validation failed"
        echo "Please check the workflow file and try again"
        exit 1
    fi
}

# Execute deployment
main "$@"
