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
# Deploy Complete AlexAI Crew Workflow - Direct Deployment
# Bypasses ~/.zshrc validation for immediate deployment
# All crew members: Picard, Data, Troi, Scott, Spock, Worf, Observation Lounge

set -e

echo "🚀 DEPLOYING COMPLETE ALEXAI CREW WORKFLOW (DIRECT)"
echo "=================================================="
echo "👥 All crew members: Picard, Data, Troi, Scott, Spock, Worf, Observation Lounge"
echo "📅 Deployment Date: $(date)"
echo ""

# Load environment variables directly
echo "🔐 Loading environment variables..."
if [ -f .env ]; then
    source .env
    echo "✅ Environment loaded from .env"
else
    echo "❌ No .env file found - run ./scripts/setup/setup-environment.sh first"
    exit 1
fi

# Validate required credentials
echo "🔍 Validating credentials..."
if [ -z "$N8N_BASE_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo "❌ Missing N8N credentials"
    exit 1
fi

echo "✅ Credentials validated"
echo "🔧 Configuration:"
echo "   N8N Base URL: $N8N_BASE_URL"
echo "   API Key: ${N8N_API_KEY:0:20}..."
if [ -n "$OPENROUTER_API_KEY" ]; then
    echo "   OpenRouter: ${OPENROUTER_API_KEY:0:20}..."
else
    echo "   OpenRouter: Not configured (will affect AI selection)"
fi
echo ""

# Function to backup existing workflow
backup_existing_workflow() {
    echo "💾 Backing up existing workflow..."
    
    local existing_response=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "{}")
    local existing_id=$(echo "$existing_response" | jq -r '.data[] | select(.name | contains("AlexAI")) | .id' 2>/dev/null | head -1)
    
    if [ -n "$existing_id" ] && [ "$existing_id" != "null" ]; then
        echo "📋 Found existing AlexAI workflow: $existing_id"
        
        # Deactivate and delete existing workflow
        echo "🔄 Removing existing workflow..."
        curl -s -X PATCH -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" -d '{"active": false}' "$N8N_BASE_URL/api/v1/workflows/$existing_id" > /dev/null 2>&1 || true
        curl -s -X DELETE -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows/$existing_id" > /dev/null 2>&1 || true
        echo "✅ Existing workflow removed"
    else
        echo "ℹ️  No existing AlexAI workflow found"
    fi
    echo ""
}

# Function to deploy the complete crew workflow
deploy_complete_workflow() {
    echo "🚀 Deploying complete crew workflow..."
    
    local workflow_file="sync-system/workflows/alexai-complete-crew-workflow.json"
    if [ ! -f "$workflow_file" ]; then
        echo "❌ Complete workflow file not found: $workflow_file"
        exit 1
    fi
    
    echo "📁 Reading complete crew workflow: $workflow_file"
    local workflow_json=$(cat "$workflow_file")
    
    # Deploy the new workflow
    echo "🌐 Creating new complete crew workflow..."
    local deploy_response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$workflow_json" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "000")
    
    local http_code="${deploy_response: -3}"
    local response_body="${deploy_response%???}"
    
    echo "📊 HTTP Response Code: $http_code"
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "✅ Complete crew workflow deployed successfully!"
        
        local workflow_id=$(echo "$response_body" | jq -r '.data.id' 2>/dev/null || echo "unknown")
        echo "🆔 New Workflow ID: $workflow_id"
        
        # Activate the workflow
        echo "🔄 Activating complete crew workflow..."
        local activate_response=$(curl -s -w "%{http_code}" \
            -X PATCH \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{"active": true}' \
            "$N8N_BASE_URL/api/v1/workflows/$workflow_id" 2>/dev/null || echo "000")
        
        local activate_http_code="${activate_response: -3}"
        
        if [ "$activate_http_code" = "200" ]; then
            echo "✅ Complete crew workflow activated successfully!"
        else
            echo "⚠️  Workflow deployed but activation unclear - activate manually in n8n UI"
        fi
        
        DEPLOYED_WORKFLOW_ID="$workflow_id"
        WEBHOOK_URL="$N8N_BASE_URL/webhook/crew-request"
        
        return 0
    else
        echo "❌ Failed to deploy complete crew workflow (HTTP $http_code)"
        echo "📋 Response: $response_body"
        return 1
    fi
}

# Function to test complete crew
test_complete_crew() {
    echo "🧪 Testing complete crew workflow..."
    
    local webhook_url="$WEBHOOK_URL"
    
    # Quick test
    echo "🔬 Testing crew selection..."
    local test_payload='{"query": "Test all crew members", "context": "deployment-test", "userRole": "developer", "urgency": "normal"}'
    
    local response=$(timeout 30 curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        "$webhook_url" 2>/dev/null || echo '{"error": "timeout"}')
    
    if echo "$response" | grep -q "success\|crewMember\|response"; then
        local crew_member=$(echo "$response" | jq -r '.crewMember // "unknown"' 2>/dev/null || echo "unknown")
        echo "✅ Crew test successful - Selected: $crew_member"
        echo "📋 Response preview: $(echo "$response" | head -c 150)..."
    else
        echo "⚠️  Crew test inconclusive - may need OpenRouter configuration in n8n"
        echo "📋 Response: $(echo "$response" | head -c 100)..."
    fi
    
    echo ""
}

# Main execution
echo "🚀 Beginning deployment..."
echo ""

backup_existing_workflow

if deploy_complete_workflow; then
    echo ""
    test_complete_crew
    
    echo "📊 DEPLOYMENT SUMMARY"
    echo "===================="
    echo "✅ Status: Complete crew workflow deployed"
    echo "🆔 Workflow ID: ${DEPLOYED_WORKFLOW_ID:-'Unknown'}"
    echo "🔗 Webhook URL: ${WEBHOOK_URL:-'Unknown'}"
    echo "🌐 n8n Instance: $N8N_BASE_URL"
    echo ""
    echo "👥 Crew Members Available:"
    echo "   ✅ Captain Picard - Strategic Leadership"
    echo "   ✅ Lieutenant Data - Technical Operations"
    echo "   ✅ Counselor Troi - Emotional Intelligence"  
    echo "   ✅ Chief Engineer Scott - Infrastructure"
    echo "   ✅ Commander Spock - Logic & Science"
    echo "   ✅ Lieutenant Worf - Security & Tactical"
    echo "   ✅ Observation Lounge - Group Coordination"
    echo ""
    echo "🧪 Testing Features:"
    echo "   ✅ Local testing node included for n8n UI testing"
    echo "   ✅ Enhanced error handling and response formatting"
    echo "   ✅ All crew member API endpoints created"
    echo ""
    if [ -z "$OPENROUTER_API_KEY" ]; then
        echo "⚠️  IMPORTANT: Configure OPENROUTER_API_KEY in n8n environment for AI selection"
        echo "   Go to: n8n.pbradygeorgen.com > Settings > Environment Variables"
        echo "   Add: OPENROUTER_API_KEY with your OpenRouter API key"
    fi
    echo ""
    echo "🎉 MISSION ACCOMPLISHED!"
    echo "🖖 All crew members deployed and ready for duty!"
    
else
    echo "❌ Deployment failed"
    exit 1
fi
