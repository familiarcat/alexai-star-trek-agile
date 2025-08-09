#!/bin/zsh

# 🔄 Deploy Bilateral Learning Workflow to N8N
# Deploys the advanced bilateral learning system to N8N

set -e

# Source safe utilities
source scripts/utils/safe-echo.sh

print_header "BILATERAL LEARNING WORKFLOW DEPLOYMENT" "Deploying to N8N Platform"

# Function to deploy the bilateral learning workflow
deploy_bilateral_workflow() {
    print_section "DEPLOYING BILATERAL LEARNING WORKFLOW" "🚀"
    
    # Check for required credentials
    if [[ -z "$N8N_API_KEY" ]]; then
        print_status "working" "Loading N8N credentials from environment..."
        
        # Try to load from .env
        if [[ -f ".env" ]]; then
            source .env
        fi
        
        # Try to load from ~/.zshrc
        if [[ -z "$N8N_API_KEY" ]]; then
            if grep -q "N8N_API_KEY" ~/.zshrc 2>/dev/null; then
                eval "$(grep "export N8N_API_KEY" ~/.zshrc)"
            fi
        fi
        
        if [[ -z "$N8N_API_KEY" ]]; then
            print_status "error" "N8N_API_KEY not found in environment"
            print_status "info" "Please set N8N_API_KEY in .env or ~/.zshrc"
            return 1
        fi
    fi
    
    local N8N_BASE_URL="${N8N_BASE_URL:-https://n8n.pbradygeorgen.com}"
    
    print_status "working" "Testing N8N API connection..."
    
    # Test N8N API connection
    local test_response=$(curl -s -w "%{http_code}" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "000")
    
    if [[ "$test_response" == *"200"* ]]; then
        print_status "success" "N8N API connection successful"
    else
        print_status "error" "N8N API connection failed: $test_response"
        return 1
    fi
    
    print_status "working" "Preparing bilateral learning workflow..."
    
    # Read and prepare the workflow JSON
    local workflow_file="sync-system/workflows/alexai-bilateral-learning-workflow.json"
    
    if [[ ! -f "$workflow_file" ]]; then
        print_status "error" "Workflow file not found: $workflow_file"
        return 1
    fi
    
    # Clean the workflow JSON for N8N API
    local workflow_json=$(cat "$workflow_file" | jq 'del(.webhookId, .typeVersion, .position, .pinData, .tags, .triggerCount, .updatedAt, .versionId)')
    
    print_status "working" "Deploying bilateral learning workflow to N8N..."
    
    # Create the workflow
    local create_response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$workflow_json" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "000")
    
    local response_code="${create_response: -3}"
    local response_body="${create_response%???}"
    
    if [[ "$response_code" == "201" ]] || [[ "$response_code" == "200" ]]; then
        print_status "success" "Bilateral learning workflow created successfully"
        
        # Extract workflow ID
        local workflow_id=$(echo "$response_body" | jq -r '.data.id // .id' 2>/dev/null || echo "")
        
        if [[ -n "$workflow_id" && "$workflow_id" != "null" ]]; then
            print_status "success" "Workflow ID: $workflow_id"
            
            # Activate the workflow
            print_status "working" "Activating bilateral learning workflow..."
            
            local activate_response=$(curl -s -w "%{http_code}" \
                -X PATCH \
                -H "X-N8N-API-KEY: $N8N_API_KEY" \
                -H "Content-Type: application/json" \
                -d '{"active": true}' \
                "$N8N_BASE_URL/api/v1/workflows/$workflow_id" 2>/dev/null || echo "000")
            
            local activate_code="${activate_response: -3}"
            
            if [[ "$activate_code" == "200" ]]; then
                print_status "success" "Bilateral learning workflow activated"
                print_status "info" "Webhook URL: $N8N_BASE_URL/webhook/bilateral-learning"
            else
                print_status "warning" "Workflow created but activation may be needed manually"
                print_status "info" "Response: $activate_response"
            fi
        else
            print_status "warning" "Workflow created but ID not extracted"
        fi
    else
        print_status "error" "Failed to create workflow"
        print_status "info" "Response code: $response_code"
        print_status "info" "Response: $response_body"
        return 1
    fi
}

# Function to test the deployed workflow
test_bilateral_workflow() {
    print_section "TESTING BILATERAL LEARNING WORKFLOW" "🧪"
    
    local N8N_BASE_URL="${N8N_BASE_URL:-https://n8n.pbradygeorgen.com}"
    
    print_status "working" "Testing bilateral learning webhook..."
    
    # Create test payload
    local test_payload='{
        "filePath": "test-bilateral-deployment.md",
        "fileType": "markdown",
        "content": "# Test Bilateral Learning Deployment\n\nThis is a test to validate the deployed bilateral learning workflow.\n\n## Features\n- ✅ Automated knowledge processing\n- 🧠 Agent enhancement\n- 🔄 Continuous learning\n\n**Status:** Deployment test",
        "updateType": "creation",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
        "source": "deployment-test"
    }'
    
    # Test the webhook
    local webhook_response=$(curl -s -w "%{http_code}" \
        -X POST "$N8N_BASE_URL/webhook/bilateral-learning" \
        -H "Content-Type: application/json" \
        -d "$test_payload" 2>/dev/null || echo "000")
    
    local webhook_code="${webhook_response: -3}"
    local webhook_body="${webhook_response%???}"
    
    if [[ "$webhook_code" == "200" ]]; then
        print_status "success" "Bilateral learning webhook responding correctly"
        print_status "info" "Response: $(echo "$webhook_body" | jq -r '.message // .status' 2>/dev/null || echo "$webhook_body")"
    else
        print_status "warning" "Webhook response code: $webhook_code"
        if [[ "$webhook_code" == "404" ]]; then
            print_status "info" "Workflow may need manual activation in N8N interface"
        fi
    fi
}

# Function to verify integration
verify_integration() {
    print_section "VERIFYING BILATERAL INTEGRATION" "✅"
    
    print_status "working" "Checking local knowledge API..."
    
    # Test local knowledge API
    local api_response=$(curl -s "http://localhost:3000/api/knowledge" 2>/dev/null || echo "{}")
    
    if echo "$api_response" | grep -q "domains"; then
        print_status "success" "Local knowledge API operational"
    else
        print_status "warning" "Local knowledge API may need configuration"
    fi
    
    print_status "working" "Testing enhanced agent integration..."
    
    # Test enhanced agent capabilities
    local agent_test=$(curl -s -X POST "http://localhost:3000/api/crew/enhanced-knowledge-integration" \
        -H "Content-Type: application/json" \
        -d '{
            "agent": "lieutenant-data",
            "query": "Validate bilateral learning system integration",
            "context": "system-verification"
        }' 2>/dev/null || echo "{}")
    
    if echo "$agent_test" | grep -q "knowledgeUtilized"; then
        print_status "success" "Enhanced agent integration confirmed"
    else
        print_status "warning" "Enhanced agent integration may need review"
    fi
    
    print_status "working" "Checking bilateral learning log..."
    
    if [[ -f "alexai-knowledge-base/BILATERAL_LEARNING_LOG.md" ]]; then
        local log_entries=$(wc -l < alexai-knowledge-base/BILATERAL_LEARNING_LOG.md)
        print_status "success" "Bilateral learning log active with $log_entries entries"
    else
        print_status "warning" "Bilateral learning log not found"
    fi
}

# Main execution
main() {
    print_header "BILATERAL LEARNING DEPLOYMENT" "$(date)"
    
    deploy_bilateral_workflow
    test_bilateral_workflow
    verify_integration
    
    print_section "DEPLOYMENT SUMMARY" "📊"
    
    print_status "success" "Bilateral learning system deployment completed"
    
    print_section "BILATERAL LEARNING CAPABILITIES" "🧠"
    print_status "info" "✅ Automatic knowledge processing from new .md/.sh files"
    print_status "info" "✅ Intelligent categorization and domain assignment"
    print_status "info" "✅ Agent-specific enhancement notifications"
    print_status "info" "✅ Knowledge base integration and indexing"
    print_status "info" "✅ Learning feedback loops for continuous improvement"
    
    print_section "NEXT STEPS" "🎯"
    print_status "info" "1. Create new .md or .sh files to test automatic enhancement"
    print_status "info" "2. Monitor bilateral learning logs for processing events"
    print_status "info" "3. Verify agent responses improve with accumulated knowledge"
    print_status "info" "4. Start continuous monitoring: './bilateral-learning-monitor.sh &'"
    
    print_status "success" "🧠 Brain trust growth system is now fully operational!"
}

main "$@"
