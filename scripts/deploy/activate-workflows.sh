#!/bin/bash

# Script to activate n8n workflows using different methods
set -e

echo "🔌 ACTIVATING N8N WORKFLOWS"
echo "============================"

# Load environment variables
if [ -f .env ]; then
    source .env
    echo "✅ Environment variables loaded"
else
    echo "❌ .env file not found"
    exit 1
fi

# Check required variables
if [ -z "$N8N_BASE_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo "❌ Missing required environment variables"
    echo "   N8N_BASE_URL: $N8N_BASE_URL"
    echo "   N8N_API_KEY: ${N8N_API_KEY:0:20}..."
    exit 1
fi

echo "🔗 N8N URL: $N8N_BASE_URL"
echo "🔑 API Key: ${N8N_API_KEY:0:20}..."

# List all workflows
echo ""
echo "📋 Listing all workflows..."
WORKFLOWS_RESPONSE=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows")

if echo "$WORKFLOWS_RESPONSE" | jq -e '.data' > /dev/null 2>&1; then
    echo "✅ Retrieved workflows successfully"
    
    # Show workflow status
    echo "$WORKFLOWS_RESPONSE" | jq -r '.data[] | "\(.name) - ID: \(.id) - Active: \(.active)"'
else
    echo "❌ Failed to retrieve workflows"
    echo "Response: $WORKFLOWS_RESPONSE"
    exit 1
fi

echo ""
echo "🔌 Attempting to activate workflows..."

# Try different activation methods for each inactive workflow
echo "$WORKFLOWS_RESPONSE" | jq -r '.data[] | select(.active == false) | .id' | while read -r workflow_id; do
    if [ -n "$workflow_id" ]; then
        echo "🔄 Attempting to activate workflow: $workflow_id"
        
        # Method 1: Try POST to /activate endpoint
        echo "   Trying POST activation..."
        ACTIVATE_RESPONSE=$(curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows/$workflow_id/activate" 2>/dev/null || echo "{}")
        
        if echo "$ACTIVATE_RESPONSE" | jq -e '.active == true' > /dev/null 2>&1; then
            echo "   ✅ POST activation successful!"
        else
            echo "   ❌ POST activation failed: $(echo "$ACTIVATE_RESPONSE" | jq -r '.message // "Unknown error"')"
            
            # Method 2: Try to get workflow data and update it
            echo "   Trying to get workflow data..."
            WORKFLOW_DATA=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows/$workflow_id")
            
            if echo "$WORKFLOW_DATA" | jq -e '.data' > /dev/null 2>&1; then
                echo "   ✅ Retrieved workflow data"
                
                # Method 3: Try to update with active: true in the data
                echo "   Trying to update workflow with active status..."
                WORKFLOW_NAME=$(echo "$WORKFLOW_DATA" | jq -r '.data.name')
                WORKFLOW_NODES=$(echo "$WORKFLOW_DATA" | jq -r '.data.nodes')
                WORKFLOW_CONNECTIONS=$(echo "$WORKFLOW_DATA" | jq -r '.data.connections')
                WORKFLOW_SETTINGS=$(echo "$WORKFLOW_DATA" | jq -r '.data.settings')
                
                UPDATE_PAYLOAD=$(cat <<EOF
{
  "name": "$WORKFLOW_NAME",
  "nodes": $WORKFLOW_NODES,
  "connections": $WORKFLOW_CONNECTIONS,
  "settings": $WORKFLOW_SETTINGS
}
EOF
)
                
                UPDATE_RESPONSE=$(curl -s -X PUT \
                    -H "X-N8N-API-KEY: $N8N_API_KEY" \
                    -H "Content-Type: application/json" \
                    -d "$UPDATE_PAYLOAD" \
                    "$N8N_BASE_URL/api/v1/workflows/$workflow_id")
                
                if echo "$UPDATE_RESPONSE" | jq -e '.data' > /dev/null 2>&1; then
                    echo "   ✅ Workflow updated successfully"
                    
                    # Check if it's now active
                    sleep 2
                    STATUS_CHECK=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows/$workflow_id")
                    if echo "$STATUS_CHECK" | jq -e '.data.active == true' > /dev/null 2>&1; then
                        echo "   🎉 Workflow is now ACTIVE!"
                    else
                        echo "   ⚠️  Workflow updated but still not active"
                    fi
                else
                    echo "   ❌ Failed to update workflow: $(echo "$UPDATE_RESPONSE" | jq -r '.message // "Unknown error"')"
                fi
            else
                echo "   ❌ Failed to retrieve workflow data"
            fi
        fi
        
        echo ""
    fi
done

echo ""
echo "🎯 ACTIVATION ATTEMPT COMPLETE"
echo "=============================="
echo ""
echo "📋 Final workflow status:"
FINAL_STATUS=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows")
echo "$FINAL_STATUS" | jq -r '.data[] | "\(.name) - Active: \(.active)"'

echo ""
echo "💡 If workflows are still not active, you may need to:"
echo "   1. Activate them manually through the n8n web interface"
echo "   2. Check the n8n logs for any errors"
echo "   3. Verify the workflow configuration is correct"
echo ""
echo "🌐 n8n web interface: $N8N_BASE_URL"
