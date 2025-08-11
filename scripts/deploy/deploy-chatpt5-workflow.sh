#!/bin/bash

# 🚀 AlexAI ChatGPT 5 Workflow Deployment Script
# Deploys the new multi-LLM workflow to n8n

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
N8N_BASE_URL="${N8N_BASE_URL:-https://n8n.pbradygeorgen.com}"
N8N_API_KEY="${N8N_API_KEY}"
WORKFLOW_FILE="bilateral-sync/sync-system/workflows/alexai-chatgpt5-ready-workflow.json"
WORKFLOW_NAME="AlexAI ChatGPT 5 Ready - Multi-LLM Crew Coordination"

echo -e "${BLUE}🚀 AlexAI ChatGPT 5 Workflow Deployment${NC}"
echo "=================================================="
echo ""

# Check if required environment variables are set
if [ -z "$N8N_API_KEY" ]; then
    echo -e "${RED}❌ Error: N8N_API_KEY environment variable is not set${NC}"
    echo "Please set it with: export N8N_API_KEY='your-api-key-here'"
    exit 1
fi

# Check if workflow file exists
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo -e "${RED}❌ Error: Workflow file not found: $WORKFLOW_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "  N8N Base URL: $N8N_BASE_URL"
echo "  Workflow File: $WORKFLOW_FILE"
echo "  Workflow Name: $WORKFLOW_NAME"
echo ""

# Function to check n8n connectivity
check_n8n_connectivity() {
    echo -e "${BLUE}🔍 Checking n8n connectivity...${NC}"
    
    if curl -s -f "$N8N_BASE_URL/healthz" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ n8n is accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ Cannot connect to n8n at $N8N_BASE_URL${NC}"
        return 1
    fi
}

# Function to get existing workflows
get_existing_workflows() {
    echo -e "${BLUE}📋 Fetching existing workflows...${NC}"
    
    local response
    response=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "$response" | jq -r '.data[] | "\(.id): \(.name)"' 2>/dev/null || echo "No existing workflows found"
    else
        echo -e "${YELLOW}⚠️  Could not fetch existing workflows${NC}"
    fi
}

# Function to check if workflow already exists
check_workflow_exists() {
    local workflow_name="$1"
    
    local response
    response=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        local workflow_id
        workflow_id=$(echo "$response" | jq -r --arg name "$workflow_name" '.data[] | select(.name == $name) | .id' 2>/dev/null)
        
        if [ "$workflow_id" != "null" ] && [ -n "$workflow_id" ]; then
            echo "$workflow_id"
            return 0
        fi
    fi
    
    return 1
}

# Function to create new workflow
create_workflow() {
    local workflow_file="$1"
    
    echo -e "${BLUE}🆕 Creating new workflow...${NC}"
    
    local response
    response=$(curl -s -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d @"$workflow_file" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        local workflow_id
        workflow_id=$(echo "$response" | jq -r '.id' 2>/dev/null)
        
        if [ "$workflow_id" != "null" ] && [ -n "$workflow_id" ]; then
            echo -e "${GREEN}✅ Workflow created successfully with ID: $workflow_id${NC}"
            return 0
        else
            echo -e "${RED}❌ Failed to create workflow${NC}"
            echo "Response: $response"
            return 1
        fi
    else
        echo -e "${RED}❌ Failed to create workflow${NC}"
        return 1
    fi
}

# Function to update existing workflow
update_workflow() {
    local workflow_id="$1"
    local workflow_file="$2"
    
    echo -e "${BLUE}🔄 Updating existing workflow...${NC}"
    
    local response
    response=$(curl -s -X PUT \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d @"$workflow_file" \
        "$N8N_BASE_URL/api/v1/workflows/$workflow_id" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Workflow updated successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to update workflow${NC}"
        return 1
    fi
}

# Function to activate workflow
activate_workflow() {
    local workflow_id="$1"
    
    echo -e "${BLUE}🚀 Activating workflow...${NC}"
    
    local response
    response=$(curl -s -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows/$workflow_id/activate" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Workflow activated successfully${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Could not activate workflow (may already be active)${NC}"
        return 1
    fi
}

# Function to test workflow webhook
test_webhook() {
    local workflow_id="$1"
    
    echo -e "${BLUE}🧪 Testing workflow webhook...${NC}"
    
    # Get webhook URL from workflow
    local webhook_url
    webhook_url="$N8N_BASE_URL/webhook/crew-request-chatgpt5"
    
    echo "  Webhook URL: $webhook_url"
    
    # Test with a simple request
    local test_payload
    test_payload='{
        "query": "Test query for ChatGPT 5 workflow",
        "context": "technical",
        "userRole": "developer",
        "preferredLLM": "claude",
        "useChatGPT5": false
    }'
    
    local response
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        "$webhook_url" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Webhook test successful${NC}"
        echo "  Response: $response"
    else
        echo -e "${YELLOW}⚠️  Webhook test failed (workflow may need activation)${NC}"
    fi
}

# Main deployment process
main() {
    echo -e "${BLUE}🚀 Starting deployment process...${NC}"
    echo ""
    
    # Check connectivity
    if ! check_n8n_connectivity; then
        exit 1
    fi
    
    # Get existing workflows
    get_existing_workflows
    echo ""
    
    # Check if workflow already exists
    local existing_workflow_id
    existing_workflow_id=$(check_workflow_exists "$WORKFLOW_NAME")
    
    if [ -n "$existing_workflow_id" ]; then
        echo -e "${YELLOW}📋 Workflow '$WORKFLOW_NAME' already exists with ID: $existing_workflow_id${NC}"
        echo ""
        
        read -p "Do you want to update the existing workflow? (y/N): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if update_workflow "$existing_workflow_id" "$WORKFLOW_FILE"; then
                echo -e "${GREEN}✅ Workflow updated successfully${NC}"
            else
                echo -e "${RED}❌ Failed to update workflow${NC}"
                exit 1
            fi
        else
            echo -e "${YELLOW}⚠️  Skipping workflow update${NC}"
        fi
        
        # Activate existing workflow
        activate_workflow "$existing_workflow_id"
        
    else
        echo -e "${BLUE}🆕 Creating new workflow...${NC}"
        
        if create_workflow "$WORKFLOW_FILE"; then
            echo -e "${GREEN}✅ New workflow created successfully${NC}"
            
            # Get the new workflow ID
            local new_workflow_id
            new_workflow_id=$(check_workflow_exists "$WORKFLOW_NAME")
            
            if [ -n "$new_workflow_id" ]; then
                # Activate new workflow
                activate_workflow "$new_workflow_id"
                
                # Test webhook
                test_webhook "$new_workflow_id"
            fi
        else
            echo -e "${RED}❌ Failed to create workflow${NC}"
            exit 1
        fi
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Deployment process completed!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "  1. Verify the workflow is active in n8n dashboard"
    echo "  2. Test the webhook endpoint: $N8N_BASE_URL/webhook/crew-request-chatgpt5"
    echo "  3. Update your environment variables if needed:"
    echo "     - OPENAI_API_KEY (for ChatGPT 5)"
    echo "     - OPENROUTER_API_KEY (for Claude models)"
    echo "  4. Use the EnhancedShipComputerInterface component in your React app"
    echo ""
    echo -e "${BLUE}🔗 Useful Links:${NC}"
    echo "  - n8n Dashboard: $N8N_BASE_URL"
    echo "  - Workflow API: $N8N_BASE_URL/api/v1/workflows"
    echo ""
}

# Run main function
main "$@"

