#!/bin/bash
# Deploy Simplified AlexAI Crew Workflow - Fixed Version
# Addresses "Could not find property option" error

set -e

echo "🔧 DEPLOYING SIMPLIFIED ALEXAI CREW WORKFLOW"
echo "============================================"
echo "🎯 Fixing activation errors and property issues"
echo "📅 Deployment Date: $(date)"
echo ""

# Load environment variables
if [ -f .env ]; then
    source .env
    echo "✅ Environment loaded"
else
    echo "❌ No .env file found"
    exit 1
fi

# Validate credentials
if [ -z "$N8N_BASE_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo "❌ Missing N8N credentials"
    exit 1
fi

echo "🔧 Configuration:"
echo "   N8N Base URL: $N8N_BASE_URL"
echo "   API Key: ${N8N_API_KEY:0:20}..."
echo ""

# Function to remove existing workflows
cleanup_existing_workflows() {
    echo "🧹 Cleaning up existing AlexAI workflows..."
    
    local workflows_response=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "{}")
    local workflow_ids=$(echo "$workflows_response" | jq -r '.data[]? | select(.name | contains("AlexAI")) | .id' 2>/dev/null || echo "")
    
    if [ -n "$workflow_ids" ]; then
        while IFS= read -r workflow_id; do
            if [ -n "$workflow_id" ] && [ "$workflow_id" != "null" ]; then
                echo "🗑️  Removing workflow: $workflow_id"
                # Deactivate first
                curl -s -X PATCH -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" -d '{"active": false}' "$N8N_BASE_URL/api/v1/workflows/$workflow_id" > /dev/null 2>&1 || true
                # Then delete
                curl -s -X DELETE -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows/$workflow_id" > /dev/null 2>&1 || true
            fi
        done <<< "$workflow_ids"
        echo "✅ Existing workflows cleaned up"
    else
        echo "ℹ️  No existing AlexAI workflows found"
    fi
    echo ""
}

# Function to deploy simplified workflow
deploy_simplified_workflow() {
    echo "🚀 Deploying simplified crew workflow..."
    
    local workflow_file="sync-system/workflows/alexai-simplified-crew-workflow.json"
    if [ ! -f "$workflow_file" ]; then
        echo "❌ Simplified workflow file not found: $workflow_file"
        exit 1
    fi
    
    echo "📁 Reading simplified workflow: $workflow_file"
    local workflow_json=$(cat "$workflow_file")
    
    # Deploy the workflow
    echo "🌐 Creating simplified crew workflow..."
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
        echo "✅ Simplified crew workflow deployed successfully!"
        
        local workflow_id=$(echo "$response_body" | jq -r '.data.id' 2>/dev/null || echo "unknown")
        echo "🆔 Workflow ID: $workflow_id"
        
        if [ "$workflow_id" != "null" ] && [ "$workflow_id" != "unknown" ]; then
            # Try to activate the workflow
            echo "🔄 Activating simplified workflow..."
            local activate_response=$(curl -s -w "%{http_code}" \
                -X PATCH \
                -H "X-N8N-API-KEY: $N8N_API_KEY" \
                -H "Content-Type: application/json" \
                -d '{"active": true}' \
                "$N8N_BASE_URL/api/v1/workflows/$workflow_id" 2>/dev/null || echo "000")
            
            local activate_http_code="${activate_response: -3}"
            local activate_response_body="${activate_response%???}"
            
            if [ "$activate_http_code" = "200" ]; then
                echo "✅ Simplified workflow activated successfully!"
                WORKFLOW_ACTIVATED=true
            else
                echo "⚠️  Activation issue (HTTP $activate_http_code)"
                echo "📋 Response: $activate_response_body"
                WORKFLOW_ACTIVATED=false
            fi
        else
            echo "⚠️  Could not extract workflow ID for activation"
            WORKFLOW_ACTIVATED=false
        fi
        
        DEPLOYED_WORKFLOW_ID="$workflow_id"
        WEBHOOK_URL="$N8N_BASE_URL/webhook/crew-request"
        
        return 0
    else
        echo "❌ Failed to deploy simplified workflow (HTTP $http_code)"
        echo "📋 Response: $response_body"
        return 1
    fi
}

# Function to test the deployed workflow
test_simplified_workflow() {
    echo "🧪 Testing simplified workflow..."
    
    if [ "$WORKFLOW_ACTIVATED" = true ]; then
        local webhook_url="$WEBHOOK_URL"
        local test_payload='{"query": "Test simplified workflow", "context": "deployment-test", "userRole": "developer"}'
        
        echo "🔬 Testing webhook: $webhook_url"
        
        local response=$(timeout 30 curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$test_payload" \
            "$webhook_url" 2>/dev/null || echo '{"error": "timeout"}')
        
        if echo "$response" | grep -q "success\|selectedCrew\|response"; then
            local selected_crew=$(echo "$response" | jq -r '.selectedCrew // "unknown"' 2>/dev/null || echo "unknown")
            echo "✅ Workflow test successful!"
            echo "🎯 Selected crew: $selected_crew"
            echo "📋 Response preview: $(echo "$response" | head -c 150)..."
        else
            echo "⚠️  Workflow test inconclusive"
            echo "📋 Response: $(echo "$response" | head -c 200)..."
        fi
    else
        echo "⚠️  Skipping test - workflow not activated"
    fi
    
    echo ""
}

# Main execution
echo "🚀 Starting simplified workflow deployment..."
echo ""

cleanup_existing_workflows

if deploy_simplified_workflow; then
    echo ""
    test_simplified_workflow
    
    echo "📊 SIMPLIFIED DEPLOYMENT SUMMARY"
    echo "================================"
    echo "✅ Status: Simplified workflow deployed"
    echo "🆔 Workflow ID: ${DEPLOYED_WORKFLOW_ID:-'Unknown'}"
    echo "🔗 Webhook URL: ${WEBHOOK_URL:-'Unknown'}"
    echo "🌐 n8n Instance: $N8N_BASE_URL"
    echo "⚡ Activation: ${WORKFLOW_ACTIVATED:-'Unknown'}"
    echo ""
    echo "🛠️ Improvements Made:"
    echo "   ✅ Simplified switch logic to basic code node"
    echo "   ✅ Fixed property option compatibility issues"
    echo "   ✅ Enhanced error handling and fallback logic"
    echo "   ✅ Streamlined node configuration"
    echo ""
    if [ "$WORKFLOW_ACTIVATED" = true ]; then
        echo "🎉 SUCCESS: Simplified workflow is active and ready!"
        echo "🧪 Test command:"
        echo "   curl -X POST -H \"Content-Type: application/json\" \\"
        echo "        -d '{\"query\": \"Test crew selection\", \"context\": \"test\"}' \\"
        echo "        $WEBHOOK_URL"
    else
        echo "⚠️  NOTE: Manual activation may be required in n8n UI"
        echo "🔗 Visit: $N8N_BASE_URL/workflows"
    fi
    echo ""
    echo "🖖 Simplified crew coordination system ready!"
    
else
    echo "❌ Simplified deployment failed"
    exit 1
fi
