#!/bin/bash

# Enhanced Ship Agency Workflow Deployment
set -e

echo "🚀 Deploying Enhanced Ship Agency Workflow..."

# Check if workflow exists
WORKFLOW_NAME="AlexAI Enhanced Ship Agency - Multi-LLM Crew Orchestration"
WORKFLOW_FILE="bilateral-sync/sync-system/workflows/alexai-enhanced-ship-agency.json"

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

echo "✅ Enhanced Ship Agency workflow deployment complete!"
echo ""
echo "🔧 Next Steps:"
echo "1. Go to n8n interface: https://n8n.pbradygeorgen.com"
echo "2. Find workflow: '$WORKFLOW_NAME'"
echo "3. Activate it using the toggle switch"
echo "4. Test with: curl -X POST 'https://n8n.pbradygeorgen.com/webhook/ship-agency-request'"
echo ""
echo "🎯 This workflow provides:"
echo "   • Ship's Computer Agent for mission orchestration"
echo "   • Role-optimized LLM selection for each crew member"
echo "   • Dynamic UI configuration based on mission priority"
echo "   • Emergency mode with ChatGPT 5 (32k tokens)"
echo "   • Multi-crew coordination with specialized prompts"
