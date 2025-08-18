#!/bin/bash

# 🧠 AI AGENT COLLECTIVE MEMORY SYSTEM HEALTH CHECK
# Purpose: Monitor the health and status of the collective memory system

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧠 AI Agent Collective Memory System Health Check"
echo "================================================"

# Check if the application is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is running${NC}"
else
    echo -e "${RED}❌ Application is not running${NC}"
    echo "Start with: npm run dev"
    exit 1
fi

# Check collective memory endpoint
if curl -s "http://localhost:3000/api/ai-orchestration" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AI Orchestration API is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  AI Orchestration API not accessible${NC}"
fi

# Check if collective intelligence is displayed
if curl -s "http://localhost:3000" | grep -q "COLLECTIVE INTELLIGENCE"; then
    echo -e "${GREEN}✅ Collective Intelligence component is visible${NC}"
else
    echo -e "${YELLOW}⚠️  Collective Intelligence component not visible${NC}"
fi

echo ""
echo "🎯 System Status: READY"
echo "💡 Next steps:"
echo "   1. Configure Supabase credentials in .env.local"
echo "   2. Deploy database schema: supabase db push"
echo "   3. Initialize memory: node scripts/init-collective-memory.js"
echo "   4. Test full functionality"
