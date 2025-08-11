#!/bin/bash

# Simple ChatGPT 5 Workflow Deployment
set -e

echo "🚀 Deploying ChatGPT 5 Ready Workflow..."

# Check if workflow exists
WORKFLOW_NAME="AlexAI ChatGPT 5 Ready - Multi-LLM Crew Coordination"
WORKFLOW_FILE="bilateral-sync/sync-system/workflows/alexai-chatgpt5-simple.json"

# Export credentials directly (handle single quotes)
export N8N_API_KEY="$(grep '^export N8N_API_KEY=' ~/.zshrc | sed "s/export N8N_API_KEY='//" | sed "s/'$//")"
export OPENAI_API_KEY="$(grep '^export OPENAI_API_KEY=' ~/.zshrc | sed "s/export OPENAI_API_KEY='//" | sed "s/'$//")"
export OPENROUTER_API_KEY="$(grep '^export OPENROUTER_API_KEY=' ~/.zshrc | sed "s/export OPENROUTER_API_KEY='//" | sed "s/'$//")"

# Check if workflow already exists
EXISTING_WORKFLOWS=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "https://n8n.pbradygeorgen.com/api/v1/workflows" | \
  jq -r '.data[] | select(.name == "'"$WORKFLOW_NAME"'") | .id')

if [ -n "$EXISTING_WORKFLOWS" ]; then
    echo "✅ Workflow exists, updating..."
    WORKFLOW_ID=$(echo "$EXISTING_WORKFLOWS" | head -1)
    curl -X PUT \
      -H "X-N8N-API-KEY: $N8N_API_KEY" \
      -H "Content-Type: application/json" \
      -d @"$WORKFLOW_FILE" \
      "https://n8n.pbradygeorgen.com/api/v1/workflows/$WORKFLOW_ID"
else
    echo "🆕 Creating new workflow..."
    curl -X POST \
      -H "X-N8N-API-KEY: $N8N_API_KEY" \
      -H "Content-Type: application/json" \
      -d @"$WORKFLOW_FILE" \
      "https://n8n.pbradygeorgen.com/api/v1/workflows"
fi

echo "✅ ChatGPT 5 workflow deployment complete!"
