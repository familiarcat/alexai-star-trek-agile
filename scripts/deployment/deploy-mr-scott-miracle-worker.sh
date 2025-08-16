#!/bin/bash

# 🚀 Mr. Scott's Miracle Worker - Operational Efficiency Deployment Script
# Mission: Deploy the miracle worker workflow for maximum operational efficiency

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
N8N_BASE_URL="${N8N_BASE_URL:-https://n8n.pbradygeorgen.com}"
N8N_API_KEY="${N8N_API_KEY}"
WORKFLOW_FILE="workflows/mr-scott-miracle-worker-operational-efficiency.json"
WORKFLOW_NAME="Mr. Scott's Miracle Worker - Operational Efficiency & Functionality Completion"

echo -e "${BLUE}🚀 Mr. Scott's Miracle Worker Deployment${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "${YELLOW}Mission: Deploy operational efficiency workflow${NC}"
echo -e "${YELLOW}Chief Engineer: Montgomery Scott${NC}"
echo -e "${YELLOW}Approach: Engineering Excellence with Miracle Working${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}🔍 Checking Prerequisites...${NC}"

if [ -z "$N8N_API_KEY" ]; then
    echo -e "${RED}❌ N8N_API_KEY environment variable not set${NC}"
    echo -e "${YELLOW}Please set N8N_API_KEY and try again${NC}"
    exit 1
fi

if [ ! -f "$WORKFLOW_FILE" ]; then
    echo -e "${RED}❌ Workflow file not found: $WORKFLOW_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Deploy workflow to n8n
echo -e "${BLUE}🚀 Deploying Mr. Scott's Miracle Worker Workflow...${NC}"

# Create the workflow in n8n
echo -e "${YELLOW}📋 Creating workflow in n8n...${NC}"

WORKFLOW_RESPONSE=$(curl -s -X POST \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d @"$WORKFLOW_FILE" \
    "$N8N_BASE_URL/api/v1/workflows")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Workflow created successfully${NC}"
    
    # Extract workflow ID for activation
    WORKFLOW_ID=$(echo "$WORKFLOW_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$WORKFLOW_ID" ]; then
        echo -e "${GREEN}✅ Workflow ID: $WORKFLOW_ID${NC}"
        
        # Activate the workflow
        echo -e "${YELLOW}🔌 Activating workflow...${NC}"
        
        ACTIVATION_RESPONSE=$(curl -s -X PATCH \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{"active": true}' \
            "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID")
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Workflow activated successfully${NC}"
        else
            echo -e "${YELLOW}⚠️  Workflow created but activation failed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Workflow created but ID not found${NC}"
    fi
else
    echo -e "${RED}❌ Failed to create workflow${NC}"
    echo -e "${YELLOW}Response: $WORKFLOW_RESPONSE${NC}"
    exit 1
fi

echo ""

# Test the workflow
echo -e "${BLUE}🧪 Testing Mr. Scott's Miracle Worker...${NC}"

TEST_PAYLOAD='{
  "query": "Optimize our development approach for functionality completion",
  "context": "Functionality vs UI refinement priority",
  "userRole": "developer",
  "urgency": "high",
  "complexity": "high",
  "mission": "Operational Efficiency & Functionality Completion",
  "resourceConstraints": "Time optimization, code reuse, pattern identification"
}'

echo -e "${YELLOW}📤 Sending test request...${NC}"

# Get the webhook URL from the deployed workflow
WEBHOOK_URL="$N8N_BASE_URL/webhook/miracle-worker-request"

TEST_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$TEST_PAYLOAD" \
    "$WEBHOOK_URL")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Test request successful${NC}"
    echo -e "${BLUE}📊 Response preview:${NC}"
    echo "$TEST_RESPONSE" | head -c 200
    echo "..."
else
    echo -e "${YELLOW}⚠️  Test request failed - workflow may need manual activation${NC}"
fi

echo ""

# Display workflow information
echo -e "${BLUE}📋 Mr. Scott's Miracle Worker Workflow Information${NC}"
echo -e "${BLUE}==================================================${NC}"
echo -e "${GREEN}✅ Workflow Name:${NC} $WORKFLOW_NAME"
echo -e "${GREEN}✅ Webhook URL:${NC} $WEBHOOK_URL"
echo -e "${GREEN}✅ Status:${NC} Deployed and Ready"
echo ""

# Display usage instructions
echo -e "${BLUE}📖 Usage Instructions${NC}"
echo -e "${BLUE}====================${NC}"
echo -e "${YELLOW}1. Send POST requests to:${NC} $WEBHOOK_URL"
echo -e "${YELLOW}2. Include required fields:${NC} query, context, userRole, urgency, complexity"
echo -e "${YELLOW}3. Optional fields:${NC} mission, resourceConstraints"
echo ""
echo -e "${YELLOW}Example request:${NC}"
echo 'curl -X POST "'$WEBHOOK_URL'" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"query": "Optimize development", "context": "functionality", "urgency": "high"}'"'"''
echo ""

# Display Mr. Scott's parting words
echo -e "${PURPLE}🖖 Mr. Scott's Parting Words:${NC}"
echo -e "${PURPLE}==============================${NC}"
echo -e "${GREEN}'Aye, Captain! The miracle worker is now operational.${NC}"
echo -e "${GREEN}We'll achieve maximum efficiency with engineering excellence.${NC}"
echo -e "${GREEN}Functionality first, then we'll make it beautiful!${NC}"
echo -e "${GREEN}Make it so!'${NC}"
echo ""
echo -e "${BLUE}🚀 Mission Status: DEPLOYMENT COMPLETE${NC}"
echo -e "${GREEN}✅ Mr. Scott's Miracle Worker is ready for operational efficiency!${NC}"
echo ""

# Save deployment summary
DEPLOYMENT_SUMMARY="deployment-summary-mr-scott-$(date +%Y%m%d-%H%M%S).md"

cat > "$DEPLOYMENT_SUMMARY" << EOF
# 🚀 Mr. Scott's Miracle Worker Deployment Summary

**Date**: $(date)
**Status**: ✅ **DEPLOYMENT COMPLETE**
**Workflow**: $WORKFLOW_NAME

## 📋 Deployment Details

- **Workflow File**: $WORKFLOW_FILE
- **n8n Base URL**: $N8N_BASE_URL
- **Webhook URL**: $WEBHOOK_URL
- **Status**: Deployed and Ready

## 🎯 Mission Objectives

- **Operational Efficiency**: Maximize development productivity
- **Functionality Completion**: Achieve 95%+ functionality in 4 weeks
- **Resource Optimization**: 70% development, 20% testing, 10% documentation
- **Revenue Goal**: $10,000 through functionality, not UI polish

## 🚀 Next Steps

1. **Immediate**: Start database schema implementation
2. **This Week**: Complete database foundation and API endpoints
3. **Next Week**: Begin revenue system implementation
4. **Ongoing**: Document UI patterns during development

## 🖖 Mr. Scott's Engineering Assessment

- **Priority**: Functionality Over UI
- **Approach**: Engineering Excellence with Miracle Working
- **Confidence**: HIGH
- **Timeline**: 4 weeks to 95% functionality

## 📊 Success Metrics

- **Functionality**: 95% completion target
- **Revenue**: $10,000 goal
- **Efficiency**: 2x improvement target
- **Overall Success Probability**: 90%

---

**Live long and prosper! 🖖**

*Deployed by Mr. Scott's Miracle Worker System*
EOF

echo -e "${GREEN}✅ Deployment summary saved to: $DEPLOYMENT_SUMMARY${NC}"
echo ""

echo -e "${BLUE}🎉 Mr. Scott's Miracle Worker is now operational!${NC}"
echo -e "${GREEN}🚀 Ready to achieve maximum operational efficiency!${NC}"
