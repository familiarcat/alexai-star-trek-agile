#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 AlexAI Workflow Status Summary${NC}"
echo -e "====================================="
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

# Get current n8n workflows
echo -e "${BLUE}📋 Current n8n Workflows:${NC}"
echo -e "============================="
n8n_workflows=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
    jq -r '.data[] | "\(.name) (\(.id)) [\(if .active then "Active" else "Inactive" end)]"')

if [ -n "$n8n_workflows" ]; then
    echo "$n8n_workflows" | sort
else
    echo -e "${RED}❌ No workflows found on n8n server${NC}"
fi

echo -e ""

# Count workflows by status
active_count=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
    jq '.data[] | select(.active == true) | .name' | wc -l)
inactive_count=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
    jq '.data[] | select(.active == false) | .name' | wc -l)
total_count=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
    jq '.data | length')

echo -e "${BLUE}📊 Workflow Statistics:${NC}"
echo -e "==========================="
echo -e "   Total workflows: $total_count"
echo -e "   Active workflows: $active_count"
echo -e "   Inactive workflows: $inactive_count"
echo -e ""

# Check for duplicates
duplicates=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
    jq -r '.data[] | .name' | sort | uniq -d)

if [ -n "$duplicates" ]; then
    echo -e "${RED}🚨 Duplicate Workflows Detected:${NC}"
    echo -e "================================"
    echo "$duplicates" | sed 's/^/   - /'
    echo -e ""
    echo -e "${YELLOW}⚠️  Action Required: Clean up duplicates using:${NC}"
    echo -e "   npm run unify:workflows (option 3)"
    echo -e ""
else
    echo -e "${GREEN}✅ No duplicate workflows detected${NC}"
    echo -e ""
fi

# Get local workflow files
echo -e "${BLUE}📁 Local Workflow Files:${NC}"
echo -e "============================"
local_workflows=$(ls workflows/ | grep -E "(alexai|crew|coordination)" | sort)

if [ -n "$local_workflows" ]; then
    echo "$local_workflows" | sed 's/^/   - /'
    local_count=$(echo "$local_workflows" | wc -l)
    echo -e ""
    echo -e "   Total local workflows: $local_count"
else
    echo -e "${YELLOW}⚠️  No local workflow files found${NC}"
fi

echo -e ""

# Check sync manager status
echo -e "${BLUE}🔄 Sync Manager Status:${NC}"
echo -e "=========================="
if pgrep -f "enhanced-sync-manager.js" > /dev/null; then
    echo -e "${GREEN}✅ Sync Manager: Running${NC}"
    pid=$(pgrep -f "enhanced-sync-manager.js")
    echo -e "   Process ID: $pid"
else
    echo -e "${RED}❌ Sync Manager: Not Running${NC}"
fi

echo -e ""

# Check for master workflow
echo -e "${BLUE}🎯 Master Workflow Status:${NC}"
echo -e "============================="
if [ -f "workflows/alexai-master-workflow-consolidated.json" ]; then
    echo -e "${GREEN}✅ Master workflow exists locally${NC}"
    master_size=$(ls -lh workflows/alexai-master-workflow-consolidated.json | awk '{print $5}')
    echo -e "   File size: $master_size"
else
    echo -e "${YELLOW}⚠️  Master workflow not yet created${NC}"
fi

# Check if master workflow is on n8n
master_on_n8n=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
    jq -r '.data[] | select(.name | contains("Master")) | .name')

if [ -n "$master_on_n8n" ] && [ "$master_on_n8n" != "null" ]; then
    echo -e "${GREEN}✅ Master workflow deployed to n8n${NC}"
    echo -e "   Name: $master_on_n8n"
else
    echo -e "${YELLOW}⚠️  Master workflow not yet deployed to n8n${NC}"
fi

echo -e ""

# Show next steps
echo -e "${BLUE}🎯 Next Steps & Recommendations:${NC}"
echo -e "====================================="
echo -e ""

if [ -n "$duplicates" ]; then
    echo -e "${RED}1. 🧹 Clean up duplicate workflows${NC}"
    echo -e "   npm run unify:workflows (option 3)"
    echo -e ""
fi

if [ $inactive_count -gt 0 ]; then
    echo -e "${YELLOW}2. 🔧 Activate critical workflows${NC}"
    echo -e "   npm run unify:workflows (option 5)"
    echo -e ""
fi

if [ ! -f "workflows/alexai-master-workflow-consolidated.json" ]; then
    echo -e "${BLUE}3. 🎯 Create master workflow${NC}"
    echo -e "   npm run consolidate:master"
    echo -e ""
fi

if ! pgrep -f "enhanced-sync-manager.js" > /dev/null; then
    echo -e "${YELLOW}4. 🔄 Start sync manager${NC}"
    echo -e "   npm run sync:start"
    echo -e ""
fi

echo -e "${GREEN}5. 🚀 Full unification process${NC}"
echo -e "   npm run unify:workflows (option 8)"
echo -e ""

# Show available commands
echo -e "${BLUE}📋 Available Commands:${NC}"
echo -e "========================="
echo -e "   npm run unify:workflows      # Interactive workflow management"
echo -e "   npm run consolidate:master   # Create master workflow"
echo -e "   npm run sync:start           # Start bilateral sync"
echo -e "   npm run webhook:activate     # Activate webhooks"
echo -e "   npm run webhook:test         # Test webhook connectivity"
echo -e ""

# Show current issues
echo -e "${BLUE}🔍 Current Issues Identified:${NC}"
echo -e "=================================="

issues_found=false

if [ -n "$duplicates" ]; then
    echo -e "${RED}   ❌ Duplicate workflows on n8n server${NC}"
    issues_found=true
fi

if [ $inactive_count -gt 0 ]; then
    echo -e "${YELLOW}   ⚠️  $inactive_count inactive workflows${NC}"
    issues_found=true
fi

if ! pgrep -f "enhanced-sync-manager.js" > /dev/null; then
    echo -e "${RED}   ❌ Sync manager not running${NC}"
    issues_found=true
fi

if [ ! -f "workflows/alexai-master-workflow-consolidated.json" ]; then
    echo -e "${YELLOW}   ⚠️  Master workflow not created${NC}"
    issues_found=true
fi

if [ "$master_on_n8n" = "" ] || [ "$master_on_n8n" = "null" ]; then
    echo -e "${YELLOW}   ⚠️  Master workflow not deployed to n8n${NC}"
    issues_found=true
fi

if [ "$issues_found" = false ]; then
    echo -e "${GREEN}   ✅ No critical issues detected${NC}"
fi

echo -e ""

# Show success metrics
echo -e "${BLUE}📊 Success Metrics:${NC}"
echo -e "======================="
echo -e ""

# Calculate completion percentages
if [ $total_count -gt 0 ]; then
    active_percentage=$((active_count * 100 / total_count))
    echo -e "   Workflow Activation: ${active_percentage}% ($active_count/$total_count)"
else
    echo -e "   Workflow Activation: N/A (no workflows)"
fi

if [ -n "$duplicates" ]; then
    echo -e "   Duplicate Cleanup: ❌ Required"
else
    echo -e "   Duplicate Cleanup: ✅ Complete"
fi

if pgrep -f "enhanced-sync-manager.js" > /dev/null; then
    echo -e "   Sync Manager: ✅ Running"
else
    echo -e "   Sync Manager: ❌ Stopped"
fi

if [ -f "workflows/alexai-master-workflow-consolidated.json" ]; then
    echo -e "   Master Workflow: ✅ Created"
else
    echo -e "   Master Workflow: ❌ Not created"
fi

if [ "$master_on_n8n" != "" ] && [ "$master_on_n8n" != "null" ]; then
    echo -e "   Master Deployment: ✅ Deployed"
else
    echo -e "   Master Deployment: ❌ Not deployed"
fi

echo -e ""

echo -e "${GREEN}🎉 Summary Complete! Use the recommendations above to achieve full workflow unification.${NC}"
