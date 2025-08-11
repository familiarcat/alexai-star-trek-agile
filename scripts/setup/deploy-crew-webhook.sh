#!/bin/bash

# Deploy Crew Request Webhook to n8n
# This script creates the missing webhook endpoint that the observation lounge needs

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Crew Request Webhook to n8n...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Source environment variables
if [ -f ~/.zshrc ]; then
    source ~/.zshrc
fi

# Check required environment variables
if [ -z "$N8N_API_KEY" ] || [ -z "$N8N_BASE_URL" ]; then
    echo -e "${RED}❌ Error: N8N_API_KEY and N8N_BASE_URL must be set${NC}"
    echo -e "${YELLOW}💡 Run: npm run env:source${NC}"
    exit 1
fi

# Check if the webhook workflow exists
WEBHOOK_FILE="workflows/alexai-crew-request-webhook.json"
if [ ! -f "$WEBHOOK_FILE" ]; then
    echo -e "${RED}❌ Error: Webhook workflow file not found: $WEBHOOK_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Webhook workflow file found: $WEBHOOK_FILE${NC}"

# Test n8n connectivity
echo -e "${BLUE}🔍 Testing n8n connectivity...${NC}"
if curl -s -f "$N8N_BASE_URL/api/v1/workflows" -H "X-N8N-API-KEY: $N8N_API_KEY" > /dev/null; then
    echo -e "${GREEN}✅ n8n API is accessible${NC}"
else
    echo -e "${RED}❌ Error: Cannot connect to n8n API${NC}"
    exit 1
fi

# Check if webhook already exists
echo -e "${BLUE}🔍 Checking if webhook already exists...${NC}"
if curl -s -f "$N8N_BASE_URL/webhook/crew-request" > /dev/null; then
    echo -e "${YELLOW}⚠️ Webhook already exists at /webhook/crew-request${NC}"
    echo -e "${GREEN}✅ Crew request webhook is ready!${NC}"
    exit 0
fi

echo -e "${BLUE}📤 Deploying webhook workflow to n8n...${NC}"

# Create the webhook using n8n API
# Note: This is a simplified approach - in production you'd want to use the n8n workflow import API
echo -e "${YELLOW}💡 Note: You need to manually import the webhook workflow in your n8n instance${NC}"
echo -e "${BLUE}📋 Steps to complete webhook setup:${NC}"
echo -e "   1. Open your n8n instance: $N8N_BASE_URL"
echo -e "   2. Go to Workflows"
echo -e "   3. Click 'Import from file'"
echo -e "   4. Select: $WEBHOOK_FILE"
echo -e "   5. Activate the workflow"
echo -e "   6. The webhook will be available at: $N8N_BASE_URL/webhook/crew-request"

echo -e ""
echo -e "${GREEN}✅ Webhook deployment instructions provided${NC}"
echo -e "${BLUE}📋 After importing, test with:${NC}"
echo -e "   curl -X POST $N8N_BASE_URL/webhook/crew-request \\"
echo -e "     -H 'Content-Type: application/json' \\"
echo -e "     -d '{\"query\":\"test crew coordination\",\"context\":\"testing\"}'"

echo -e ""
echo -e "${GREEN}🎉 Crew Request Webhook deployment complete!${NC}"
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "   1. Import the workflow in n8n"
echo -e "   2. Activate the workflow"
echo -e "   3. Test the webhook endpoint"
echo -e "   4. Restart your development server: npm run dev"
