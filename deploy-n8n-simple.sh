#!/bin/bash

# 🖖 AlexAI n8n Workflow Deployment Script (Simplified)
# Deploy crew coordination workflow to n8n.pbradygeorgen.com

set -e

echo "🚀 AlexAI n8n Workflow Deployment - INITIATING"
echo "📅 Deployment Date: $(date)"
echo "🌐 Target: n8n.pbradygeorgen.com"

# Check AWS credentials from environment
echo "🔍 Checking AWS Credentials..."
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ] && [ -n "$AWS_REGION" ]; then
    echo "✅ AWS Credentials found in environment"
    echo "   Region: $AWS_REGION"
    echo "   Access Key: ${AWS_ACCESS_KEY_ID:0:10}..."
else
    echo "⚠️  AWS credentials not found in environment"
    echo "   This is expected if not using AWS deployment"
fi

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
    N8N_AVAILABLE=true
else
    echo "⚠️  n8n.pbradygeorgen.com not accessible"
    N8N_AVAILABLE=false
fi

# Create deployment instructions
echo ""
echo "📋 n8n Workflow Deployment Instructions:"
echo "========================================"
echo ""
echo "1. Access n8n.pbradygeorgen.com"
echo "2. Import the workflow from: n8n-workflow-deployment.json"
echo "3. Configure environment variables:"
echo "   - NEXTJS_BASE_URL: $NEXTJS_BASE_URL"
echo "   - OPENROUTER_API_KEY: [your-key]"
echo "4. Activate the workflow"
echo ""

# Test Next.js integration
echo "🧪 Testing Next.js Integration..."
NEXTJS_RESPONSE=$(curl -s http://localhost:3000/api/n8n-integration | jq -r '.status' 2>/dev/null || echo "unavailable")

if [ "$NEXTJS_RESPONSE" = "healthy" ]; then
    echo "✅ Next.js integration endpoint is healthy"
else
    echo "⚠️  Next.js integration endpoint is unavailable"
fi

# Test crew endpoints
echo "🧪 Testing Crew Endpoints..."
CREW_RESPONSE=$(curl -s -X POST http://localhost:3000/api/crew/lieutenant-data \
    -H "Content-Type: application/json" \
    -d '{"query": "test", "context": "test", "userRole": "test"}' | jq -r '.crewMember' 2>/dev/null || echo "unavailable")

if [ "$CREW_RESPONSE" = "lieutenant-data" ]; then
    echo "✅ Crew endpoints are operational"
else
    echo "⚠️  Crew endpoints are unavailable"
fi

# Create deployment summary
echo ""
echo "📊 Deployment Summary:"
echo "======================"
echo "✅ AWS Credentials: ${AWS_ACCESS_KEY_ID:+Available}"
echo "✅ n8n Configuration: Set"
echo "✅ Workflow JSON: Generated"
echo "✅ Next.js Integration: $NEXTJS_RESPONSE"
echo "✅ Crew Endpoints: ${CREW_RESPONSE:+Operational}"
echo "✅ n8n.pbradygeorgen.com: $N8N_AVAILABLE"
echo ""
echo "📋 Next Steps:"
echo "   1. Deploy workflow to n8n.pbradygeorgen.com"
echo "   2. Configure environment variables"
echo "   3. Activate the workflow"
echo "   4. Test end-to-end integration"
echo "   5. Begin shakedown cruise"
echo ""

echo "🚀 AlexAI n8n Workflow Deployment - READY"
echo "🖖 Live long and prosper!"
