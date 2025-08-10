#!/bin/bash

# Simple script to deploy and activate the AlexAI Complete Crew Workflow
set -e

echo "🚀 DEPLOYING ALEXAI COMPLETE CREW WORKFLOW"
echo "=========================================="

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

# Test connection
echo ""
echo "🔍 Testing n8n connection..."
RESPONSE=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "{}")

if echo "$RESPONSE" | jq -e '.data' > /dev/null 2>&1; then
    echo "✅ Connected to n8n successfully"
else
    echo "❌ Failed to connect to n8n"
    echo "Response: $RESPONSE"
    exit 1
fi

# Deploy the workflow
echo ""
echo "📤 Deploying workflow..."
WORKFLOW_FILE="sync-system/workflows/alexai-complete-crew-workflow.json"

if [ ! -f "$WORKFLOW_FILE" ]; then
    echo "❌ Workflow file not found: $WORKFLOW_FILE"
    exit 1
fi

echo "📁 Workflow file: $WORKFLOW_FILE"

# Read workflow data
WORKFLOW_DATA=$(cat "$WORKFLOW_FILE")
WORKFLOW_NAME=$(echo "$WORKFLOW_DATA" | jq -r '.name')

echo "📋 Workflow name: $WORKFLOW_NAME"

# Check if workflow already exists
echo "🔍 Checking for existing workflow..."
EXISTING_ID=$(echo "$RESPONSE" | jq -r ".data[] | select(.name == \"$WORKFLOW_NAME\") | .id" 2>/dev/null | head -1)

if [ -n "$EXISTING_ID" ] && [ "$EXISTING_ID" != "null" ]; then
    echo "📝 Updating existing workflow: $EXISTING_ID"
    
    # Update existing workflow
    UPDATE_RESPONSE=$(curl -s -X PUT \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$WORKFLOW_DATA" \
        "$N8N_BASE_URL/api/v1/workflows/$EXISTING_ID")
    
    if echo "$UPDATE_RESPONSE" | jq -e '.data' > /dev/null 2>&1; then
        echo "✅ Workflow updated successfully"
        WORKFLOW_ID="$EXISTING_ID"
    else
        echo "❌ Failed to update workflow"
        echo "Response: $UPDATE_RESPONSE"
        exit 1
    fi
else
    echo "🆕 Creating new workflow..."
    
    # Create new workflow
    CREATE_RESPONSE=$(curl -s -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$WORKFLOW_DATA" \
        "$N8N_BASE_URL/api/v1/workflows")
    
    if echo "$CREATE_RESPONSE" | jq -e '.data.id' > /dev/null 2>&1; then
        WORKFLOW_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')
        echo "✅ Workflow created successfully with ID: $WORKFLOW_ID"
    else
        echo "❌ Failed to create workflow"
        echo "Response: $CREATE_RESPONSE"
        exit 1
    fi
fi

# Activate the workflow
echo ""
echo "🔌 Activating workflow..."
ACTIVATE_RESPONSE=$(curl -s -X PATCH \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"active": true}' \
    "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID")

if echo "$ACTIVATE_RESPONSE" | jq -e '.data.active == true' > /dev/null 2>&1; then
    echo "✅ Workflow activated successfully!"
else
    echo "❌ Failed to activate workflow"
    echo "Response: $ACTIVATE_RESPONSE"
    exit 1
fi

# Get webhook URL
echo ""
echo "🔗 Getting webhook URL..."
WEBHOOK_RESPONSE=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID")

if echo "$WEBHOOK_RESPONSE" | jq -e '.data' > /dev/null 2>&1; then
    WEBHOOK_URL=$(echo "$WEBHOOK_RESPONSE" | jq -r '.data.webhookUrl // empty')
    if [ -n "$WEBHOOK_URL" ]; then
        echo "🌐 Webhook URL: $WEBHOOK_URL"
    else
        echo "⚠️  No webhook URL found in workflow"
    fi
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo "✅ Workflow deployed and activated"
echo "🆔 Workflow ID: $WORKFLOW_ID"
echo "📋 Workflow name: $WORKFLOW_NAME"
echo "🔗 N8N URL: $N8N_BASE_URL"
echo ""
echo "🚀 Next steps:"
echo "   1. Test the workflow in n8n"
echo "   2. Update your Next.js app to use the correct API endpoint"
echo "   3. The webhook should be available at: $N8N_BASE_URL/webhook/crew-request"
