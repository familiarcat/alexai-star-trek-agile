#!/bin/bash

# 🔧 Fix Resume Compliance Auditor Webhook Registration
# This script resolves webhook registration issues in n8n

set -e

echo "🔧 Fixing Resume Compliance Auditor Webhook Registration"
echo "========================================================"
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

# Check credentials
if [ -z "$N8N_API_KEY" ]; then
    print_error "N8N_API_KEY not found in environment"
    exit 1
fi

if [ -z "$N8N_BASE_URL" ]; then
    print_error "N8N_BASE_URL not found in environment"
    exit 1
fi

WORKFLOW_ID="RRowJtIqlNLGnyjM"
WEBHOOK_PATH="resume-audit"

print_status "Current workflow status:"
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
    "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID" | \
    jq '{id: .id, name: .name, active: .active, webhookId: .nodes[] | select(.type == "n8n-nodes-base.webhook") | .webhookId}' 2>/dev/null || echo "Failed to parse response"

echo
print_status "Attempting to fix webhook registration..."

# Method 1: Deactivate and reactivate the workflow
print_status "Method 1: Deactivating workflow..."
curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
    "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID/deactivate" > /dev/null 2>&1

sleep 2

print_status "Method 1: Reactivating workflow..."
curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
    "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID/activate" > /dev/null 2>&1

sleep 5

print_status "Testing webhook after reactivation..."
WEBHOOK_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"resume": "Test resume content for webhook verification"}' \
    "$N8N_BASE_URL/webhook/$WEBHOOK_PATH" 2>/dev/null || echo "curl failed")

if echo "$WEBHOOK_RESPONSE" | grep -q "overallScore\|error"; then
    print_success "Webhook is now working!"
    echo "Response: $WEBHOOK_RESPONSE"
else
    print_warning "Webhook still not working. Trying alternative approach..."
    
    # Method 2: Check if webhook needs to be created manually
    print_status "Method 2: Checking webhook configuration..."
    curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID" | \
        jq '.nodes[] | select(.type == "n8n-nodes-base.webhook") | {path: .parameters.path, httpMethod: .parameters.httpMethod, responseMode: .parameters.responseMode}' 2>/dev/null || echo "Failed to parse webhook config"
    
    echo
    print_status "If webhook still doesn't work, you may need to:"
    echo "1. Open n8n dashboard: $N8N_BASE_URL"
    echo "2. Navigate to the Resume Compliance Auditor workflow"
    echo "3. Check the webhook node configuration"
    echo "4. Ensure the workflow is properly saved and activated"
fi

echo
print_success "Webhook fix attempt completed!"
echo "Test the webhook manually at: $N8N_BASE_URL/webhook/$WEBHOOK_PATH"
