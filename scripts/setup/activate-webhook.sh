#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Activating Crew Request Webhook${NC}"
echo -e "======================================"
echo -e ""

# Check if environment variables are loaded
if [ -z "$N8N_BASE_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Environment variables not loaded. Please run:${NC}"
    echo -e "   source ~/.zshrc"
    echo -e ""
    exit 1
fi

echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo -e "   N8N_BASE_URL: $N8N_BASE_URL"
echo -e "   N8N_API_KEY: ${N8N_API_KEY:0:10}..."
echo -e ""

echo -e "${BLUE}📋 Manual Activation Required${NC}"
echo -e "================================"
echo -e ""
echo -e "The webhook workflow has been deployed but needs to be activated."
echo -e ""
echo -e "${YELLOW}🔧 Steps to activate:${NC}"
echo -e "   1. Open your n8n instance: ${GREEN}$N8N_BASE_URL${NC}"
echo -e "   2. Navigate to Workflows"
echo -e "   3. Find 'AlexAI Crew Request Webhook'"
echo -e "   4. Click the toggle switch in the top-right to activate"
echo -e "   5. The workflow should show as 'Active'"
echo -e ""
echo -e "${BLUE}🧪 Testing the webhook:${NC}"
echo -e "   Once activated, test with:"
echo -e "   curl -X POST $N8N_BASE_URL/webhook/crew-request \\"
echo -e "     -H 'Content-Type: application/json' \\"
echo -e "     -d '{\"query\": \"test crew coordination\", \"context\": \"testing\"}'"
echo -e ""
echo -e "${GREEN}🎯 Next steps after activation:${NC}"
echo -e "   1. Test the webhook endpoint"
echo -e "   2. Restart your development server: npm run dev"
echo -e "   3. Test the observation lounge API"
echo -e "   4. Start bilateral sync: npm run sync:start"
echo -e ""
echo -e "${YELLOW}💡 Note:${NC} The webhook must be active for the observation lounge to work properly."
echo -e ""
