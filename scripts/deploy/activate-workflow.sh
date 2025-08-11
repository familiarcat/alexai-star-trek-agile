#!/bin/bash

# Activate ChatGPT 5 Workflow
set -e

echo "🔌 Activating ChatGPT 5 workflow..."

# Export credentials
export N8N_API_KEY="$(grep '^export N8N_API_KEY=' ~/.zshrc | sed "s/export N8N_API_KEY='//" | sed "s/'$//")"

# Get the workflow ID
WORKFLOW_NAME="AlexAI ChatGPT 5 Ready - Multi-LLM Crew Coordination"
WORKFLOW_ID=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "https://n8n.pbradygeorgen.com/api/v1/workflows" | \
  jq -r '.data[] | select(.name == "'"$WORKFLOW_NAME"'") | .id')

if [ -n "$WORKFLOW_ID" ]; then
    echo "✅ Found workflow ID: $WORKFLOW_ID"
    
    # Get current workflow data
    WORKFLOW_DATA=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
      "https://n8n.pbradygeorgen.com/api/v1/workflows/$WORKFLOW_ID")
    
    # Update with active: true
    echo "$WORKFLOW_DATA" | jq '.active = true' > /tmp/workflow_active.json
    
    # Update the workflow
    curl -X PUT \
      -H "X-N8N-API-KEY: $N8N_API_KEY" \
      -H "Content-Type: application/json" \
      -d @/tmp/workflow_active.json \
      "https://n8n.pbradygeorgen.com/api/v1/workflows/$WORKFLOW_ID"
    
    echo "✅ Workflow activated successfully!"
else
    echo "❌ Workflow not found"
    exit 1
fi
