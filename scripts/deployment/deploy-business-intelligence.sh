#!/bin/bash

# 🚀 Deploy Business Intelligence Dashboard to n8n Server
# This script deploys the AI Business Intelligence Dashboard workflow
# Revenue Potential: $3,500 - High demand from small businesses and startups

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
N8N_BASE_URL="${N8N_BASE_URL:-https://n8n.pbradygeorgen.com}"
N8N_API_TOKEN="${N8N_API_TOKEN}"
WORKFLOW_FILE="workflows/simple-business-intelligence.json"
WORKFLOW_NAME="Simple Business Intelligence Dashboard"

echo -e "${BLUE}🚀 Deploying Business Intelligence Dashboard to n8n Server${NC}"
echo -e "${BLUE}Revenue Potential: $3,500${NC}"
echo ""

# Check if N8N_API_TOKEN is set
if [ -z "$N8N_API_TOKEN" ]; then
    echo -e "${RED}❌ N8N_API_TOKEN not found in environment${NC}"
    echo "Please set N8N_API_TOKEN in your environment or .env file"
    exit 1
fi

# Check if workflow file exists
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo -e "${RED}❌ Workflow file not found: $WORKFLOW_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Workflow Details:${NC}"
echo "  Name: $WORKFLOW_NAME"
echo "  File: $WORKFLOW_FILE"
echo "  Target: $N8N_BASE_URL"
echo ""

# Function to check if workflow already exists
check_existing_workflow() {
    echo -e "${BLUE}🔍 Checking for existing workflow...${NC}"
    
    local response=$(curl -s -H "X-N8N-API-KEY: $N8N_API_TOKEN" "$N8N_BASE_URL/api/v1/workflows")
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to connect to n8n server${NC}"
        return 1
    fi
    
    # Check if response contains the workflow name
    if echo "$response" | grep -q "$WORKFLOW_NAME"; then
        echo -e "${YELLOW}⚠️  Workflow '$WORKFLOW_NAME' already exists${NC}"
        return 0
    else
        echo -e "${GREEN}✅ No existing workflow found${NC}"
        return 1
    fi
}

# Function to deploy workflow
deploy_workflow() {
    echo -e "${BLUE}🚀 Deploying workflow...${NC}"
    
    # Create a clean payload with only the required fields (excluding read-only fields)
    local clean_payload=$(cat "$WORKFLOW_FILE" | jq -c '{
        name: .name,
        nodes: .nodes,
        connections: .connections,
        settings: .settings,
        staticData: .staticData
    }')
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to process workflow JSON${NC}"
        return 1
    fi
    
    echo -e "${BLUE}📤 Sending deployment request...${NC}"
    
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "X-N8N-API-KEY: $N8N_API_TOKEN" \
        -d "$clean_payload" \
        "$N8N_BASE_URL/api/v1/workflows")
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Deployment request failed${NC}"
        return 1
    fi
    
    # Check for success
    if echo "$response" | grep -q '"id"'; then
        local workflow_id=$(echo "$response" | jq -r '.id')
        echo -e "${GREEN}✅ Workflow deployed successfully!${NC}"
        echo -e "${GREEN}   Workflow ID: $workflow_id${NC}"
        echo -e "${GREEN}   Webhook URL: $N8N_BASE_URL/webhook/business-intelligence${NC}"
        return 0
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Function to activate workflow
activate_workflow() {
    local workflow_id="$1"
    
    if [ -z "$workflow_id" ]; then
        echo -e "${RED}❌ No workflow ID provided for activation${NC}"
        return 1
    fi
    
    echo -e "${BLUE}🔌 Activating workflow...${NC}"
    
    local response=$(curl -s -X POST \
        -H "X-N8N-API-KEY: $N8N_API_TOKEN" \
        "$N8N_BASE_URL/api/v1/workflows/$workflow_id/activate")
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to activate workflow${NC}"
        return 1
    fi
    
    if echo "$response" | grep -q '"active"'; then
        echo -e "${GREEN}✅ Workflow activated successfully!${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to activate workflow${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Function to test webhook
test_webhook() {
    echo -e "${BLUE}🧪 Testing webhook...${NC}"
    
    local test_data='{
        "revenue": 500000,
        "expenses": 350000,
        "customers": 250,
        "growthRate": 18,
        "marketShare": 12,
        "employeeCount": 15,
        "projectCount": 45,
        "completionRate": 42
    }'
    
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$test_data" \
        "$N8N_BASE_URL/webhook/business-intelligence")
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Webhook test failed${NC}"
        return 1
    fi
    
    if echo "$response" | grep -q '"businessMetrics"'; then
        echo -e "${GREEN}✅ Webhook test successful!${NC}"
        echo -e "${GREEN}   Response received with business metrics${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Webhook response unexpected${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Main deployment process
main() {
    echo -e "${BLUE}🚀 Starting Business Intelligence Dashboard deployment...${NC}"
    echo ""
    
    # Check existing workflow
    if check_existing_workflow; then
        echo -e "${YELLOW}⚠️  Workflow already exists. Skipping deployment.${NC}"
        echo -e "${BLUE}🔗 Webhook URL: $N8N_BASE_URL/webhook/business-intelligence${NC}"
        echo -e "${BLUE}💰 Revenue Potential: $3,500${NC}"
        return 0
    fi
    
    # Deploy workflow
    if deploy_workflow; then
        echo ""
        echo -e "${GREEN}🎉 Business Intelligence Dashboard deployed successfully!${NC}"
        echo ""
        echo -e "${BLUE}📊 Integration Details:${NC}"
        echo "  • Next.js API: /api/n8n-business-intelligence"
        echo "  • n8n Webhook: $N8N_BASE_URL/webhook/business-intelligence"
        echo "  • React Component: BusinessIntelligenceDashboard.tsx"
        echo "  • Revenue Potential: $3,500"
        echo ""
        echo -e "${BLUE}🔗 Test URLs:${NC}"
        echo "  • Local API: http://localhost:3000/api/n8n-business-intelligence"
        echo "  • n8n Webhook: $N8N_BASE_URL/webhook/business-intelligence"
        echo ""
        echo -e "${GREEN}🚀 Ready to generate $3,500 in revenue!${NC}"
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
