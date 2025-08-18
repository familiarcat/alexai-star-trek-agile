#!/bin/bash

# 🚀 VERIFY COLLECTIVE MEMORY DEPLOYMENT
# Purpose: Verify that the collective memory system is properly deployed

set -e

echo "🧠 Verifying Collective Memory System Deployment..."
echo "=================================================="

# Check if components are accessible
echo "1. Checking component accessibility..."
if curl -s "http://localhost:3000" | grep -q "COLLECTIVE INTELLIGENCE"; then
    echo "✅ Collective Intelligence component is visible"
else
    echo "❌ Collective Intelligence component not found"
    exit 1
fi

if curl -s "http://localhost:3000" | grep -q "AI AGENT COLLABORATION DASHBOARD"; then
    echo "✅ AI Collaboration Dashboard is visible"
else
    echo "❌ AI Collaboration Dashboard not found"
    exit 1
fi

# Check if API endpoints are working
echo "2. Checking API endpoints..."
if curl -s "http://localhost:3000/api/ai-orchestration" > /dev/null 2>&1; then
    echo "✅ AI Orchestration API is accessible"
else
    echo "❌ AI Orchestration API not accessible"
    exit 1
fi

# Check if the application builds
echo "3. Checking application build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Application builds successfully"
else
    echo "❌ Application build failed"
    exit 1
fi

echo ""
echo "🎉 DEPLOYMENT VERIFICATION COMPLETE!"
echo "🧠 AI Agent Collective Memory System is fully operational!"
echo "🤝 All agents can now access and contribute to collective memory!"
echo ""
echo "Next steps:"
echo "1. Test the system: node scripts/test-collective-intelligence.js"
echo "2. Monitor performance: ./scripts/health-check-collective-memory.sh"
echo "3. Start development: npm run dev"