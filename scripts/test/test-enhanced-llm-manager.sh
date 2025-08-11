#!/bin/bash

# Enhanced LLM Manager Test Script
# Tests the intelligent LLM selection and optimization capabilities

set -e

echo "🎯 Testing Enhanced LLM Manager for AlexAI"
echo "=========================================="

# Source environment variables
if [ -f ~/.zshrc ]; then
    echo "📁 Sourcing environment from ~/.zshrc..."
    source ~/.zshrc
fi

# Check if we're in the right directory
if [ ! -f "bilateral-sync/config/llm-config.json" ]; then
    echo "❌ Error: Must run from project root directory"
    exit 1
fi

# Make the LLM manager executable
chmod +x bilateral-sync/scripts/enhanced-llm-manager.cjs

echo ""
echo "🔌 Testing Available Providers..."
node bilateral-sync/scripts/enhanced-llm-manager.cjs providers

echo ""
echo "🎯 Testing LLM Selection for Different Task Types..."

echo ""
echo "1️⃣ Code Generation Task (High Complexity, Urgent):"
node bilateral-sync/scripts/enhanced-llm-manager.cjs select code_generation high urgent performance_focused

echo ""
echo "2️⃣ Strategic Planning Task (High Complexity, Normal Urgency):"
node bilateral-sync/scripts/enhanced-llm-manager.cjs select strategic_planning high normal balanced

echo ""
echo "3️⃣ Creative Writing Task (Medium Complexity, Low Cost):"
node bilateral-sync/scripts/enhanced-llm-manager.cjs select creative_writing medium normal cost_conscious

echo ""
echo "4️⃣ Technical Analysis Task (Medium Complexity, Balanced):"
node bilateral-sync/scripts/enhanced-llm-manager.cjs select technical_analysis medium normal balanced

echo ""
echo "🚀 Testing Task Execution..."

echo ""
echo "Executing Code Generation Task:"
node bilateral-sync/scripts/enhanced-llm-manager.cjs execute "Generate React component" "Create a responsive button component with TypeScript" code_generation

echo ""
echo "Executing Strategic Planning Task:"
node bilateral-sync/scripts/enhanced-llm-manager.cjs execute "System architecture review" "Review current AlexAI system architecture and suggest improvements" strategic_planning

echo ""
echo "📊 Performance Report:"
node bilateral-sync/scripts/enhanced-llm-manager.cjs performance

echo ""
echo "✅ Enhanced LLM Manager Test Complete!"
echo ""
echo "🎉 Key Features Demonstrated:"
echo "   • Intelligent model selection based on task type"
echo "   • Cost optimization and fallback strategies"
echo "   • Performance tracking and adaptive selection"
echo "   • Multi-provider support with automatic fallbacks"
echo ""
echo "🚀 Ready to use optimal LLMs for all your tasks!"
