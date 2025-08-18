#!/bin/bash

# 🚀 Simple Resume Compliance Auditor Deployment
# Imports the workflow to n8n.pbradygeorgen.com

set -e

echo "🚀 Simple Deployment: Resume Compliance Auditor to n8n.pbradygeorgen.com..."

# Configuration
N8N_BASE_URL="https://n8n.pbradygeorgen.com"
WORKFLOW_FILE="workflows/resume-compliance-auditor.json"
WORKFLOW_NAME="Resume Compliance Auditor"

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

# Check if workflow file exists
if [ ! -f "$WORKFLOW_FILE" ]; then
    print_error "Workflow file not found: $WORKFLOW_FILE"
    exit 1
fi

print_status "Workflow file found: $WORKFLOW_FILE"

# Check if N8N_API_TOKEN is set
if [ -z "$N8N_API_TOKEN" ]; then
    print_error "N8N_API_TOKEN environment variable not set"
    print_error "Please run: source .env.resume-auditor"
    exit 1
fi

print_success "Authentication token configured"

# Test n8n server connectivity
print_status "Testing connectivity to n8n server..."
if curl -s --connect-timeout 10 "$N8N_BASE_URL" > /dev/null; then
    print_success "n8n server is accessible"
else
    print_error "Cannot connect to n8n server: $N8N_BASE_URL"
    exit 1
fi

# Deploy workflow using import endpoint
print_status "Deploying workflow via import API..."

# Read and prepare workflow data
WORKFLOW_DATA=$(cat "$WORKFLOW_FILE")

# Create import payload
IMPORT_PAYLOAD=$(cat <<EOF
{
    "name": "$WORKFLOW_NAME",
    "active": true,
    "nodes": $(echo "$WORKFLOW_DATA" | jq '.nodes'),
    "connections": $(echo "$WORKFLOW_DATA" | jq '.connections'),
    "settings": $(echo "$WORKFLOW_DATA" | jq '.settings'),
    "staticData": null,
    "pinData": {},
    "meta": $(echo "$WORKFLOW_DATA" | jq '.meta'),
    "tags": ["resume", "auditor", "compliance"]
}
EOF
)

print_status "Sending workflow to n8n import API..."

# Try to import via the import endpoint
RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-N8N-API-KEY: $N8N_API_TOKEN" \
    -d "$IMPORT_PAYLOAD" \
    "$N8N_BASE_URL/api/v1/workflows/import" \
    2>/dev/null)

if [ $? -eq 0 ] && echo "$RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
    WORKFLOW_ID=$(echo "$RESPONSE" | jq -r '.id')
    print_success "Workflow imported successfully!"
    print_success "Workflow ID: $WORKFLOW_ID"
else
    print_warning "Import API failed, trying alternative approach..."
    
    # Try to create a new workflow
    RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "X-N8N-API-KEY: $N8N_API_TOKEN" \
        -d "$IMPORT_PAYLOAD" \
        "$N8N_BASE_URL/api/v1/workflows" \
        2>/dev/null)
    
    if [ $? -eq 0 ] && echo "$RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
        WORKFLOW_ID=$(echo "$RESPONSE" | jq -r '.id')
        print_success "Workflow created successfully!"
        print_success "Workflow ID: $WORKFLOW_ID"
    else
        print_error "Failed to deploy workflow"
        print_error "Response: $RESPONSE"
        print_warning "You may need to import manually via the n8n web interface"
        print_warning "1. Go to $N8N_BASE_URL"
        print_warning "2. Navigate to Workflows → Import from File"
        print_warning "3. Upload: $WORKFLOW_FILE"
        print_warning "4. Activate the workflow"
        exit 1
    fi
fi

# Test the webhook endpoint
print_status "Testing webhook endpoint..."
TEST_RESPONSE=$(curl -s -X GET "$N8N_BASE_URL/webhook/resume-audit" 2>/dev/null)

if [ $? -eq 0 ]; then
    print_success "Webhook endpoint is accessible"
else
    print_warning "Webhook endpoint not yet accessible (workflow may need activation)"
fi

# Generate access instructions
print_success "🎉 Deployment Complete!"
echo
echo "📋 Resume Compliance Auditor is now live at:"
echo "   $N8N_BASE_URL/webhook/resume-audit"
echo
echo "🌐 Public Access UI:"
echo "   http://localhost:3000/resume-auditor.html"
echo
echo "📚 Next Steps:"
echo "1. Open n8n dashboard: $N8N_BASE_URL"
echo "2. Go to Workflows and find '$WORKFLOW_NAME'"
echo "3. Click 'Activate' to enable the webhook"
echo "4. Test with: curl -X POST -F 'resume=@test.txt' \\"
echo "              '$N8N_BASE_URL/webhook/resume-audit'"
echo
echo "🚀 Your Resume Compliance Auditor is ready!"
