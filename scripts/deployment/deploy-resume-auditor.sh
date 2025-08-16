#!/bin/bash

# 🚀 Resume Compliance Auditor Deployment Script
# Deploys the workflow to n8n.pbradygeorgen.com

set -e

echo "🚀 Deploying Resume Compliance Auditor to n8n.pbradygeorgen.com..."

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

# Function to print colored output
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install jq
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get update && sudo apt-get install -y jq
        else
            print_error "Please install jq manually for your operating system"
            exit 1
        fi
    fi
    
    print_success "Dependencies check passed"
}

# Test n8n server connectivity
test_connectivity() {
    print_status "Testing connectivity to n8n server..."
    
    if curl -s --connect-timeout 10 "$N8N_BASE_URL" > /dev/null; then
        print_success "n8n server is accessible"
    else
        print_error "Cannot connect to n8n server: $N8N_BASE_URL"
        print_error "Please check:"
        print_error "1. Server is running"
        print_error "2. URL is correct"
        print_error "3. Network connectivity"
        exit 1
    fi
}

# Get authentication token (you'll need to set this)
get_auth_token() {
    if [ -z "$N8N_API_TOKEN" ]; then
        print_warning "N8N_API_TOKEN environment variable not set"
        print_warning "Please set it with: export N8N_API_TOKEN='your_token_here'"
        print_warning "Or create a .env file with your token"
        
        # Try to read from .env file
        if [ -f ".env" ]; then
            source .env
            if [ -z "$N8N_API_TOKEN" ]; then
                print_error "N8N_API_TOKEN not found in .env file"
                exit 1
            fi
        else
            print_error "No authentication method found"
            exit 1
        fi
    fi
    
    print_success "Authentication token configured"
}

# Deploy workflow to n8n
deploy_workflow() {
    print_status "Deploying workflow: $WORKFLOW_NAME"
    
    # Read workflow file
    WORKFLOW_DATA=$(cat "$WORKFLOW_FILE")
    
    # Set workflow as active
    WORKFLOW_DATA=$(echo "$WORKFLOW_DATA" | jq '.active = true')
    
    # Create deployment payload
    DEPLOYMENT_PAYLOAD=$(cat <<EOF
{
    "name": "$WORKFLOW_NAME",
    "active": true,
    "nodes": $(echo "$WORKFLOW_DATA" | jq '.nodes'),
    "connections": $(echo "$WORKFLOW_DATA" | jq '.connections'),
    "settings": $(echo "$WORKFLOW_DATA" | jq '.settings'),
    "staticData": null,
    "pinData": {},
    "meta": $(echo "$WORKFLOW_DATA" | jq '.meta')
}
EOF
)
    
    print_status "Sending workflow to n8n server..."
    
    # Deploy via n8n REST API
    RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "X-N8N-API-KEY: $N8N_API_TOKEN" \
        -d "$DEPLOYMENT_PAYLOAD" \
        "$N8N_BASE_URL/api/v1/workflows" \
        2>/dev/null)
    
    if [ $? -eq 0 ] && echo "$RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
        WORKFLOW_ID=$(echo "$RESPONSE" | jq -r '.id')
        print_success "Workflow deployed successfully!"
        print_success "Workflow ID: $WORKFLOW_ID"
        print_success "Webhook URL: $N8N_BASE_URL/webhook/resume-audit"
    else
        print_error "Failed to deploy workflow"
        print_error "Response: $RESPONSE"
        exit 1
    fi
}

# Test the deployed workflow
test_workflow() {
    print_status "Testing deployed workflow..."
    
    # Create a test resume file
    TEST_RESUME="test-resume.txt"
    cat > "$TEST_RESUME" << 'EOF'
John Doe
Software Engineer

EXPERIENCE
Senior Developer at Tech Corp (2020-2023)
- Led development team of 5 engineers
- Built React application that increased user engagement by 25%
- Implemented CI/CD pipeline reducing deployment time by 40%

Software Engineer at Startup Inc (2018-2020)
- Developed Node.js backend services
- Created RESTful APIs serving 10,000+ users
- Reduced API response time by 30% through optimization
EOF
    
    print_status "Sending test resume to workflow..."
    
    # Test the webhook
    TEST_RESPONSE=$(curl -s -X POST \
        -F "resume=@$TEST_RESUME" \
        "$N8N_BASE_URL/webhook/resume-audit" \
        2>/dev/null)
    
    if [ $? -eq 0 ]; then
        print_success "Workflow test successful!"
        print_status "Test response received"
        
        # Clean up test file
        rm -f "$TEST_RESUME"
    else
        print_warning "Workflow test failed - this might be expected if the workflow needs additional setup"
        print_warning "Response: $TEST_RESPONSE"
    fi
}

# Generate access instructions
generate_instructions() {
    print_success "🎉 Deployment Complete!"
    echo
    echo "📋 Resume Compliance Auditor is now live at:"
    echo "   $N8N_BASE_URL/webhook/resume-audit"
    echo
    echo "🌐 Public Access UI:"
    echo "   http://localhost:3000/resume-auditor.html"
    echo
    echo "📚 Usage Instructions:"
    echo "1. Send a POST request to the webhook URL with a 'resume' file"
    echo "2. Supported formats: PDF, DOCX, TXT, MD"
    echo "3. The workflow will analyze and return a detailed report"
    echo
    echo "🔧 API Example (curl):"
    echo "   curl -X POST -F 'resume=@your-resume.pdf' \\"
    echo "        '$N8N_BASE_URL/webhook/resume-audit'"
    echo
    echo "📱 Frontend Integration:"
    echo "   The HTML interface is ready for deployment to any web server"
    echo "   Update the N8N_WEBHOOK_URL in the HTML file to point to your server"
    echo
    echo "⚙️  Workflow Features:"
    echo "   - Multi-format resume parsing (PDF, DOCX, TXT, MD)"
    echo "   - Framework scoring (ELITE, SOAR, STAR, CAR, LPS, WHO)"
    echo "   - ATS optimization feedback"
    echo "   - Multiple output formats (MD, TXT, DOCX, PDF)"
    echo "   - Professional scoring algorithms"
}

# Main execution
main() {
    echo "🚀 Resume Compliance Auditor Deployment"
    echo "======================================"
    echo
    
    check_dependencies
    get_auth_token
    test_connectivity
    deploy_workflow
    test_workflow
    generate_instructions
    
    print_success "Deployment script completed successfully!"
}

# Run main function
main "$@"
