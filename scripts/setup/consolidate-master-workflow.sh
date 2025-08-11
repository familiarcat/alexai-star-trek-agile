#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎯 AlexAI Master Workflow Consolidation${NC}"
echo -e "============================================"
echo -e ""

# Check if environment variables are loaded
if [ -z "$N8N_BASE_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Environment variables not loaded. Please run:${NC}"
    echo -e "   source ~/.zshrc"
    echo -e ""
    exit 1
fi

echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo -e "   N8N_BASE_URL: $N8N_BASE_URL"
echo -e "   N8N_API_KEY: ${N8N_API_KEY:0:10}..."
echo -e ""

echo -e "${BLUE}🔍 Analyzing current workflow state...${NC}"
echo -e "======================================"
echo -e ""

# Get current n8n workflows
echo -e "📋 Current n8n workflows:"
curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
    jq -r '.data[] | "  - \(.name) (\(.id)) [\(if .active then "Active" else "Inactive" end)]"'

echo -e ""

# Get local workflow files
echo -e "📁 Local workflow files:"
ls workflows/ | grep -E "(alexai|crew|coordination)" | sort | sed 's/^/  - /'

echo -e ""

echo -e "${YELLOW}⚠️  Before consolidation, please ensure:${NC}"
echo -e "   1. All local workflows are valid JSON"
echo -e "   2. No duplicate workflows exist on n8n"
echo -e "   3. Critical workflows are activated"
echo -e ""

read -p "Continue with consolidation? (y/N): " confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    echo -e ""
    echo -e "${BLUE}🚀 Starting master workflow consolidation...${NC}"
    echo -e "============================================="
    echo -e ""
    
    # Run the consolidation
    cd bilateral-sync/scripts
    node enhanced-sync-manager.js consolidate
    
    if [ $? -eq 0 ]; then
        echo -e ""
        echo -e "${GREEN}✅ Master workflow consolidation completed!${NC}"
        echo -e ""
        echo -e "${BLUE}📋 Next steps:${NC}"
        echo -e "   1. Check the generated 'alexai-master-workflow-consolidated.json'"
        echo -e "   2. Review the consolidated workflow in n8n"
        echo -e "   3. Activate the master workflow if needed"
        echo -e "   4. Test the consolidated functionality"
        echo -e ""
        echo -e "${GREEN}🎉 Your workflows are now unified and consolidated!${NC}"
    else
        echo -e ""
        echo -e "${RED}❌ Consolidation failed. Check the logs above for details.${NC}"
        exit 1
    fi
else
    echo -e ""
    echo -e "${YELLOW}⏸️  Consolidation cancelled.${NC}"
    echo -e "   Run this script again when ready to proceed."
    exit 0
fi
