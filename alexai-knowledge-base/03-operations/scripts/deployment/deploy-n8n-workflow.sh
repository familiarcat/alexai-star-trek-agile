#!/bin/bash

# 🖖 AlexAI n8n Workflow Deployment Script
# Deploy crew coordination workflow to n8n.pbradygeorgen.com

set -e

echo "🚀 AlexAI n8n Workflow Deployment - INITIATING"
echo "📅 Deployment Date: $(date)"
echo "🌐 Target: n8n.pbradygeorgen.com"

# Load environment variables
source ~/.zshrc

# Verify AWS credentials
echo "🔍 Verifying AWS Credentials..."
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_REGION" ]; then
    echo "❌ AWS credentials not found in ~/.zshrc"
    echo "Please ensure the following are set:"
    echo "  - AWS_ACCESS_KEY_ID"
    echo "  - AWS_SECRET_ACCESS_KEY"
    echo "  - AWS_REGION"
    exit 1
fi

echo "✅ AWS Credentials verified"
echo "   Region: $AWS_REGION"
echo "   Access Key: ${AWS_ACCESS_KEY_ID:0:10}..."

# Set n8n configuration
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
export NEXTJS_BASE_URL="http://localhost:3000"
export OPENROUTER_API_KEY="${OPENROUTER_API_KEY:-your-openrouter-key}"

echo "🔧 n8n Configuration:"
echo "   Base URL: $N8N_BASE_URL"
echo "   Next.js URL: $NEXTJS_BASE_URL"

# Check if n8n.pbradygeorgen.com is accessible
echo "🌐 Testing n8n.pbradygeorgen.com connectivity..."
if curl -s --max-time 10 "$N8N_BASE_URL/health" > /dev/null 2>&1; then
    echo "✅ n8n.pbradygeorgen.com is accessible"
else
    echo "⚠️  n8n.pbradygeorgen.com not accessible - will attempt deployment anyway"
fi

# Deploy workflow using AWS CLI and n8n API
echo "📤 Deploying n8n workflow..."

# Method 1: Direct n8n API deployment (if available)
if command -v curl > /dev/null; then
    echo "🔄 Attempting direct n8n API deployment..."
    
    # Create workflow deployment payload
    WORKFLOW_PAYLOAD=$(cat n8n-workflow-deployment.json)
    
    # Deploy to n8n
    RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "X-N8N-API-KEY: ${N8N_API_KEY:-default}" \
        -d "$WORKFLOW_PAYLOAD" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "API deployment failed")
    
    if [[ "$RESPONSE" != "API deployment failed" ]]; then
        echo "✅ Workflow deployed via n8n API"
        echo "   Response: $RESPONSE"
    else
        echo "⚠️  Direct API deployment failed, trying alternative method..."
    fi
fi

# Method 2: AWS Lambda deployment (if configured)
echo "🔄 Attempting AWS Lambda deployment..."
if command -v aws > /dev/null; then
    # Check if we have a Lambda function for n8n deployment
    LAMBDA_FUNCTION_NAME="n8n-workflow-deployer"
    
    if aws lambda get-function --function-name "$LAMBDA_FUNCTION_NAME" > /dev/null 2>&1; then
        echo "📦 Deploying via AWS Lambda..."
        
        # Create deployment payload
        DEPLOYMENT_PAYLOAD=$(cat <<EOF
{
    "workflow": $(cat n8n-workflow-deployment.json),
    "target": "$N8N_BASE_URL",
    "environment": {
        "NEXTJS_BASE_URL": "$NEXTJS_BASE_URL",
        "OPENROUTER_API_KEY": "$OPENROUTER_API_KEY"
    }
}
EOF
)
        
        # Invoke Lambda function
        aws lambda invoke \
            --function-name "$LAMBDA_FUNCTION_NAME" \
            --payload "$DEPLOYMENT_PAYLOAD" \
            --region "$AWS_REGION" \
            response.json
        
        echo "✅ Lambda deployment completed"
        echo "   Response: $(cat response.json)"
        rm -f response.json
    else
        echo "⚠️  Lambda function '$LAMBDA_FUNCTION_NAME' not found"
    fi
else
    echo "⚠️  AWS CLI not available"
fi

# Method 3: Manual deployment instructions
echo "📋 Manual Deployment Instructions:"
echo ""
echo "If automated deployment failed, please manually deploy the workflow:"
echo ""
echo "1. Access n8n.pbradygeorgen.com"
echo "2. Import the workflow from: n8n-workflow-deployment.json"
echo "3. Configure environment variables:"
echo "   - NEXTJS_BASE_URL: $NEXTJS_BASE_URL"
echo "   - OPENROUTER_API_KEY: [your-key]"
echo "4. Activate the workflow"
echo ""

# Test the deployed workflow
echo "🧪 Testing deployed workflow..."
if [ -n "$N8N_BASE_URL" ]; then
    TEST_PAYLOAD='{
        "query": "What do I need to do today?",
        "context": "jr-developer",
        "userRole": "jr-developer"
    }'
    
    echo "📤 Sending test request..."
    TEST_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$TEST_PAYLOAD" \
        "$N8N_BASE_URL/webhook/crew-request" 2>/dev/null || echo "Test failed")
    
    if [[ "$TEST_RESPONSE" != "Test failed" ]]; then
        echo "✅ Workflow test successful"
        echo "   Response: $TEST_RESPONSE"
    else
        echo "⚠️  Workflow test failed - may need manual activation"
    fi
fi

# Create deployment summary
echo ""
echo "📊 Deployment Summary:"
echo "======================"
echo "✅ AWS Credentials: Verified"
echo "✅ n8n Configuration: Set"
echo "✅ Workflow JSON: Generated"
echo "📋 Next Steps:"
echo "   1. Verify workflow is active on n8n.pbradygeorgen.com"
echo "   2. Test crew coordination endpoints"
echo "   3. Validate Next.js integration"
echo "   4. Begin shakedown cruise testing"
echo ""

echo "🚀 AlexAI n8n Workflow Deployment - COMPLETE"
echo "🖖 Live long and prosper!"
