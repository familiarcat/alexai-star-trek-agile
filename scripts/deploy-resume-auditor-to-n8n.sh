#!/bin/bash

# 🚀 Deploy Resume Compliance Auditor to n8n.pbradygeorgen.com
# Uses existing credentials and deployment patterns from your system

set -e

echo "🚀 Deploying Resume Compliance Auditor to n8n.pbradygeorgen.com"
echo "================================================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_credentials() {
    print_status "Checking n8n credentials..."
    
    if [ -z "$N8N_API_KEY" ]; then
        print_error "N8N_API_KEY not found in environment"
        print_error "Please set N8N_API_KEY in ~/.zshrc or .env"
        exit 1
    fi
    
    if [ -z "$N8N_BASE_URL" ]; then
        print_error "N8N_BASE_URL not found in environment"
        print_error "Please set N8N_BASE_URL in ~/.zshrc or .env"
        exit 1
    fi
    
    print_success "Credentials found:"
    print_status "  N8N_BASE_URL: $N8N_BASE_URL"
    print_status "  N8N_API_KEY: ${N8N_API_KEY:0:20}..."
}

# Test n8n API connection
test_n8n_connection() {
    print_status "Testing n8n API connection..."
    
    local response=$(curl -s -w "%{http_code}" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "000")
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        print_success "n8n API connection successful"
        return 0
    else
        print_error "n8n API connection failed (HTTP $http_code)"
        print_error "Response: $response_body"
        return 1
    fi
}

# Check if workflow already exists
check_existing_workflow() {
    print_status "Checking for existing Resume Compliance Auditor workflow..."
    
    local response=$(curl -s \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "{}")
    
    local existing_id=$(echo "$response" | jq -r '.data[] | select(.name | contains("Resume")) | .id' 2>/dev/null || echo "")
    
    if [ -n "$existing_id" ] && [ "$existing_id" != "null" ]; then
        print_warning "Workflow already exists with ID: $existing_id"
        echo "$existing_id"
        return 0
    else
        print_status "No existing workflow found"
        echo ""
        return 0
    fi
}

# Deploy the workflow
deploy_workflow() {
    print_status "Deploying Resume Compliance Auditor workflow..."
    
    local workflow_file="workflows/resume-compliance-auditor.json"
    
    if [ ! -f "$workflow_file" ]; then
        print_error "Workflow file not found: $workflow_file"
        exit 1
    fi
    
    # Clean the workflow JSON for n8n API (remove n8n-specific fields)
    local workflow_json=$(cat "$workflow_file" | jq 'del(.id, .webhookId, .typeVersion, .position, .pinData, .tags, .triggerCount, .updatedAt, .versionId, .meta)' 2>/dev/null)
    
    if [ $? -ne 0 ]; then
        print_error "Failed to process workflow JSON"
        exit 1
    fi
    
    print_status "Creating workflow in n8n..."
    
    local create_response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$workflow_json" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "000")
    
    local http_code="${create_response: -3}"
    local response_body="${create_response%???}"
    
    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
        print_success "Workflow created successfully!"
        
        # Extract workflow ID
        local workflow_id=$(echo "$response_body" | jq -r '.id' 2>/dev/null || echo "")
        
        if [ -n "$workflow_id" ] && [ "$workflow_id" != "null" ]; then
            print_success "Workflow ID: $workflow_id"
            echo "$workflow_id"
            return 0
        else
            print_error "Failed to extract workflow ID from response"
            echo ""
            return 1
        fi
    else
        print_error "Failed to create workflow (HTTP $http_code)"
        print_error "Response: $response_body"
        echo ""
        return 1
    fi
}

# Activate the workflow
activate_workflow() {
    local workflow_id="$1"
    
    if [ -z "$workflow_id" ]; then
        print_error "No workflow ID provided for activation"
        return 1
    fi
    
    print_status "Activating workflow..."
    
    local activate_response=$(curl -s -w "%{http_code}" \
        -X PATCH \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"active": true}' \
        "$N8N_BASE_URL/api/v1/workflows/$workflow_id" 2>/dev/null || echo "000")
    
    local http_code="${activate_response: -3}"
    local response_body="${activate_response%???}"
    
    if [ "$http_code" = "200" ]; then
        print_success "Workflow activated successfully!"
        return 0
    else
        print_error "Failed to activate workflow (HTTP $http_code)"
        print_error "Response: $response_body"
        return 1
    fi
}

# Test the webhook endpoint
test_webhook() {
    local workflow_id="$1"
    
    if [ -z "$workflow_id" ]; then
        print_error "No workflow ID provided for webhook testing"
        return 1
    fi
    
    print_status "Testing webhook endpoint..."
    
    local webhook_url="$N8N_BASE_URL/webhook/resume-audit"
    
    # Test with a simple GET request
    local response=$(curl -s -w "%{http_code}" "$webhook_url" 2>/dev/null || echo "000")
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "405" ]; then
        print_success "Webhook endpoint is accessible"
        print_status "  Webhook URL: $webhook_url"
        return 0
    else
        print_warning "Webhook endpoint may not be ready yet (HTTP $http_code)"
        print_status "  Webhook URL: $webhook_url"
        return 1
    fi
}

# Main deployment function
main() {
    echo "🔐 **Using Existing n8n Credentials**"
    echo "====================================="
    echo
    
    # Check credentials
    check_credentials
    
    # Test connection
    if ! test_n8n_connection; then
        exit 1
    fi
    
    # Check for existing workflow
    local existing_id=$(check_existing_workflow)
    
    if [ -n "$existing_id" ]; then
        print_warning "Workflow already exists. Do you want to:"
        echo "1. Activate existing workflow"
        echo "2. Delete and recreate workflow"
        echo "3. Exit"
        echo
        read -p "Choose option (1-3): " choice
        
        case $choice in
            1)
                print_status "Activating existing workflow..."
                if activate_workflow "$existing_id"; then
                    test_webhook "$existing_id"
                fi
                ;;
            2)
                print_status "Deleting existing workflow..."
                curl -s -X DELETE \
                    -H "X-N8N-API-KEY: $N8N_API_KEY" \
                    "$N8N_BASE_URL/api/v1/workflows/$existing_id" > /dev/null 2>&1 || true
                print_status "Creating new workflow..."
                local new_id=$(deploy_workflow)
                if [ -n "$new_id" ]; then
                    activate_workflow "$new_id"
                    test_webhook "$new_id"
                fi
                ;;
            3)
                print_status "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid choice"
                exit 1
                ;;
        esac
    else
        # Deploy new workflow
        local workflow_id=$(deploy_workflow)
        if [ -n "$workflow_id" ]; then
            activate_workflow "$workflow_id"
            test_webhook "$workflow_id"
        fi
    fi
    
    echo
    print_success "🎉 **Resume Compliance Auditor Deployment Complete!**"
    echo
    echo "🌐 **Access URLs:**"
    echo "   n8n Dashboard: $N8N_BASE_URL"
    echo "   Webhook API: $N8N_BASE_URL/webhook/resume-audit"
    echo
    echo "📋 **Next Steps:**"
    echo "1. Open n8n dashboard: $N8N_BASE_URL"
    echo "2. Verify workflow is active and running"
    echo "3. Test with sample resume upload"
    echo "4. Share the webhook URL with your team"
    echo
    echo "🚀 **Your Resume Compliance Auditor is now live on n8n!**"
}

# Run main function
main "$@"
