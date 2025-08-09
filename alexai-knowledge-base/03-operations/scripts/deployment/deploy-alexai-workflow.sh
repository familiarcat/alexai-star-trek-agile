#!/bin/bash
# Deploy AlexAI Crew Coordination Workflow to n8n instance
# Direct API deployment to n8n.pbradygeorgen.com

set -e

echo "🚀 DEPLOYING ALEXAI CREW COORDINATION WORKFLOW"
echo "=============================================="
echo "Target: n8n.pbradygeorgen.com"
echo "Date: $(date)"
echo ""

# Load environment variables
if [ -f .env ]; then
    echo "📋 Loading environment variables from .env..."
    source .env
else
    echo "❌ No .env file found"
    exit 1
fi

# Check required environment variables
if [ -z "$N8N_BASE_URL" ]; then
    echo "❌ N8N_BASE_URL environment variable is required"
    exit 1
fi

if [ -z "$N8N_API_KEY" ]; then
    echo "❌ N8N_API_KEY environment variable is required"
    exit 1
fi

echo "🔧 Configuration:"
echo "   N8N Base URL: $N8N_BASE_URL"
echo "   API Key: ${N8N_API_KEY:0:20}..."
echo ""

# Test n8n connection
echo "🔍 Testing n8n connection..."
response=$(curl -s -w "%{http_code}" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "000")

# Extract HTTP code (last 3 characters)
http_code="${response: -3}"
# Extract response body (everything except last 3 characters)
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    echo "✅ Connected to n8n successfully"
else
    echo "❌ Failed to connect to n8n (HTTP $http_code)"
    echo "Response: $response_body"
    exit 1
fi

# Check if AlexAI workflow already exists
echo ""
echo "🔍 Checking for existing AlexAI workflows..."
existing_workflows=$(echo "$response_body" | jq -r '.data[] | select(.name | contains("AlexAI")) | .name' 2>/dev/null || echo "")

if [ -n "$existing_workflows" ]; then
    echo "📋 Found existing AlexAI workflows:"
    echo "$existing_workflows"
else
    echo "ℹ️  No existing AlexAI workflows found"
fi

# Read workflow JSON
workflow_file="sync-system/workflows/alexai-crew-coordination.json"
if [ ! -f "$workflow_file" ]; then
    echo "❌ Workflow file not found: $workflow_file"
    exit 1
fi

echo ""
echo "📁 Reading workflow from: $workflow_file"
workflow_json=$(cat "$workflow_file")

# Create the workflow
echo ""
echo "🚀 Creating AlexAI Crew Coordination Workflow..."

create_response=$(curl -s -w "%{http_code}" \
    -X POST \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$workflow_json" \
    "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "000")

# Extract HTTP code (last 3 characters)
create_http_code="${create_response: -3}"
# Extract response body (everything except last 3 characters)
create_response_body="${create_response%???}"

echo "HTTP Response Code: $create_http_code"

if [ "$create_http_code" = "200" ] || [ "$create_http_code" = "201" ]; then
    echo "✅ AlexAI Crew Coordination Workflow created successfully!"
    
    # Extract workflow ID
    workflow_id=$(echo "$create_response_body" | jq -r '.data.id' 2>/dev/null || echo "unknown")
    echo "🆔 Workflow ID: $workflow_id"
    
    # Get webhook URL
    webhook_url="$N8N_BASE_URL/webhook/crew-request"
    echo "🔗 Webhook URL: $webhook_url"
    
else
    echo "❌ Failed to create workflow (HTTP $create_http_code)"
    echo "Response: $create_response_body"
    
    # Try to parse error message
    error_message=$(echo "$create_response_body" | jq -r '.message // .error // "Unknown error"' 2>/dev/null || echo "Unknown error")
    echo "Error: $error_message"
    
    # Check if it's a duplicate name error
    if echo "$create_response_body" | grep -q "already exists" || echo "$create_response_body" | grep -q "duplicate"; then
        echo ""
        echo "💡 Workflow may already exist. Trying to find and activate it..."
        
        # List workflows again to find our workflow
        list_response=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "{}")
        existing_id=$(echo "$list_response" | jq -r '.data[] | select(.name == "AlexAI Crew Coordination Workflow") | .id' 2>/dev/null || echo "")
        
        if [ -n "$existing_id" ] && [ "$existing_id" != "null" ]; then
            echo "✅ Found existing workflow with ID: $existing_id"
            workflow_id="$existing_id"
            webhook_url="$N8N_BASE_URL/webhook/crew-request"
            echo "🔗 Webhook URL: $webhook_url"
        else
            exit 1
        fi
    else
        exit 1
    fi
fi

# Activate the workflow
echo ""
echo "🔄 Activating workflow..."
activate_response=$(curl -s -w "%{http_code}" \
    -X PATCH \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"active": true}' \
    "$N8N_BASE_URL/api/v1/workflows/$workflow_id" 2>/dev/null || echo "000")

# Extract HTTP code (last 3 characters)
activate_http_code="${activate_response: -3}"
# Extract response body (everything except last 3 characters)
activate_response_body="${activate_response%???}"

if [ "$activate_http_code" = "200" ]; then
    echo "✅ Workflow activated successfully!"
else
    echo "⚠️  Warning: Could not activate workflow (HTTP $activate_http_code)"
    echo "Response: $activate_response_body"
fi

# Test the webhook
echo ""
echo "🧪 Testing webhook endpoint..."
test_payload='{"query": "Hello from CursorAI", "context": "deployment-test", "userRole": "developer"}'

test_response=$(curl -s -w "%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "$test_payload" \
    "$webhook_url" 2>/dev/null || echo "000")

# Extract HTTP code (last 3 characters)
test_http_code="${test_response: -3}"
# Extract response body (everything except last 3 characters)
test_response_body="${test_response%???}"

if [ "$test_http_code" = "200" ]; then
    echo "✅ Webhook test successful!"
    echo "Response: $test_response_body"
else
    echo "⚠️  Warning: Webhook test failed (HTTP $test_http_code)"
    echo "Response: $test_response_body"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo "✅ Workflow Name: AlexAI Crew Coordination Workflow"
echo "✅ Workflow ID: $workflow_id"
echo "✅ Webhook URL: $webhook_url"
echo "✅ Status: Deployed and Active"
echo ""
echo "🔗 Visit your n8n instance to view the workflow:"
echo "   $N8N_BASE_URL/workflows"
echo ""
echo "🧪 Test the workflow with:"
echo "   curl -X POST \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"query\": \"test message\", \"context\": \"test\"}' \\"
echo "     $webhook_url"
echo ""
echo "🖖 Live long and prosper!"
