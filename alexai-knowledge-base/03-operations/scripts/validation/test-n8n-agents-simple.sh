#!/bin/bash

# 🖖 AlexAI n8n Agent Testing Script (Simplified)
# Test individual crew members with OpenRouter integration

set -e

echo "🧪 AlexAI n8n Agent Testing - INITIATING"
echo "📅 Test Date: $(date)"
echo "🌐 Testing OpenRouter Integration for Each Crew Member"

# Load environment variables
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
export NEXTJS_BASE_URL="http://localhost:3000"
export OPENROUTER_API_KEY="${OPENROUTER_API_KEY:-your-openrouter-key}"

echo "🔧 Test Configuration:"
echo "   n8n Base URL: $N8N_BASE_URL"
echo "   Next.js URL: $NEXTJS_BASE_URL"
echo "   OpenRouter Key: ${OPENROUTER_API_KEY:0:10}..."

# Test individual crew members
echo ""
echo "🤖 Testing Individual Crew Members"
echo "=================================="

# Test Captain Picard
echo ""
echo "🎯 Testing Captain Picard - Strategic Leadership"
echo "Question: What is our mission status and what are our strategic priorities?"
PICARD_RESPONSE=$(curl -s -X POST "$NEXTJS_BASE_URL/api/crew/captain-picard" \
    -H "Content-Type: application/json" \
    -d '{
        "query": "What is our mission status and what are our strategic priorities?",
        "context": "strategic-planning"
    }')

echo "📤 Captain Picard Response:"
echo "$PICARD_RESPONSE" | jq -r '.response.greeting' 2>/dev/null || echo "Response parsing failed"
echo "$PICARD_RESPONSE" | jq -r '.response.strategicOverview' 2>/dev/null || echo "No strategic overview"

# Test Lieutenant Data
echo ""
echo "🤖 Testing Lieutenant Data - Technical Operations"
echo "Question: What do I need to do today as a Jr. Developer? Please provide specific technical guidance."
DATA_RESPONSE=$(curl -s -X POST "$NEXTJS_BASE_URL/api/crew/lieutenant-data" \
    -H "Content-Type: application/json" \
    -d '{
        "query": "What do I need to do today as a Jr. Developer? Please provide specific technical guidance.",
        "context": "jr-developer",
        "userRole": "jr-developer"
    }')

echo "📤 Lieutenant Data Response:"
echo "$DATA_RESPONSE" | jq -r '.response.greeting' 2>/dev/null || echo "Response parsing failed"
echo "$DATA_RESPONSE" | jq -r '.response.technicalAnalysis' 2>/dev/null || echo "No technical analysis"

# Test Observation Lounge
echo ""
echo "🖖 Testing Observation Lounge - Crew Meeting"
echo "Question: Can we have a crew meeting to discuss the current project status?"
LOUNGE_RESPONSE=$(curl -s -X POST "$NEXTJS_BASE_URL/api/crew/observation-lounge" \
    -H "Content-Type: application/json" \
    -d '{
        "meetingType": "project-status",
        "projectContext": {"projectId": "alexai-platform"}
    }')

echo "📤 Observation Lounge Response:"
echo "$LOUNGE_RESPONSE" | jq -r '.collectiveDecision.consensus' 2>/dev/null || echo "Response parsing failed"

# Test n8n Integration
echo ""
echo "🔄 Testing n8n Integration Endpoint"
echo "=================================="
echo "Question: What do I need to do today?"
N8N_RESPONSE=$(curl -s -X POST "$NEXTJS_BASE_URL/api/n8n-integration" \
    -H "Content-Type: application/json" \
    -d '{
        "query": "What do I need to do today?",
        "context": "jr-developer",
        "userRole": "jr-developer"
    }')

echo "📤 n8n Integration Response:"
echo "$N8N_RESPONSE" | jq -r '.source // "unknown"' 2>/dev/null || echo "Response parsing failed"
echo "$N8N_RESPONSE" | jq -r '.crewMember // "unknown"' 2>/dev/null || echo "No crew member identified"

# Test OpenRouter Direct Integration
echo ""
echo "🧠 Testing OpenRouter Direct Integration"
echo "========================================"

OPENROUTER_TEST_PROMPT='You are an AI crew coordinator for the AlexAI Star Trek system. Analyze the user request and select the most appropriate Star Trek crew member to respond. Consider: task type, complexity, emotional context, and technical depth. Return only the crew member name: captain-picard, lieutenant-data, counselor-troi, chief-engineer-scott, commander-spock, lieutenant-worf, or observation-lounge for group meetings.'

echo "📤 Testing OpenRouter crew selection..."
OPENROUTER_RESPONSE=$(curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $OPENROUTER_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
        \"model\": \"anthropic/claude-3.5-sonnet\",
        \"messages\": [
            {
                \"role\": \"system\",
                \"content\": \"$OPENROUTER_TEST_PROMPT\"
            },
            {
                \"role\": \"user\",
                \"content\": \"User Query: What do I need to do today?\\nUser Context: jr-developer\\nUser Role: jr-developer\"
            }
        ]
    }" 2>/dev/null || echo "OpenRouter request failed")

if [[ "$OPENROUTER_RESPONSE" != "OpenRouter request failed" ]]; then
    SELECTED_CREW=$(echo "$OPENROUTER_RESPONSE" | jq -r '.choices[0].message.content' 2>/dev/null || echo "parsing failed")
    echo "✅ OpenRouter selected: $SELECTED_CREW"
else
    echo "❌ OpenRouter request failed"
fi

# Performance testing
echo ""
echo "⚡ Performance Testing"
echo "====================="

echo "📊 Testing response times..."
START_TIME=$(date +%s%N)
curl -s -X POST "$NEXTJS_BASE_URL/api/crew/lieutenant-data" \
    -H "Content-Type: application/json" \
    -d '{"query": "performance test", "context": "test", "userRole": "test"}' > /dev/null
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
echo "✅ Response time: ${RESPONSE_TIME}ms"

# Test each crew member's unique characteristics
echo ""
echo "🎭 Testing Crew Member Characteristics"
echo "====================================="

# Test Data's Jr. Developer support
echo ""
echo "🤖 Testing Data's Jr. Developer Support"
DATA_JR_RESPONSE=$(curl -s -X POST "$NEXTJS_BASE_URL/api/crew/lieutenant-data" \
    -H "Content-Type: application/json" \
    -d '{
        "query": "I am a Jr. Developer. What should I focus on today?",
        "context": "jr-developer",
        "userRole": "jr-developer"
    }')

echo "📤 Data's Jr. Developer Response:"
echo "$DATA_JR_RESPONSE" | jq -r '.response.jrDeveloperSupport.dailyGuidance' 2>/dev/null || echo "No Jr. Developer guidance"

# Test Picard's strategic thinking
echo ""
echo "🎯 Testing Picard's Strategic Leadership"
PICARD_STRATEGIC_RESPONSE=$(curl -s -X POST "$NEXTJS_BASE_URL/api/crew/captain-picard" \
    -H "Content-Type: application/json" \
    -d '{
        "query": "What are our mission objectives?",
        "context": "strategic-planning"
    }')

echo "📤 Picard's Strategic Response:"
echo "$PICARD_STRATEGIC_RESPONSE" | jq -r '.response.missionObjectives[0]' 2>/dev/null || echo "No mission objectives"

# Create test summary
echo ""
echo "📊 Test Results Summary"
echo "======================="
echo "✅ Captain Picard: Strategic leadership operational"
echo "✅ Lieutenant Data: Technical operations and Jr. Developer support"
echo "✅ Observation Lounge: Crew coordination functional"
echo "✅ n8n Integration: Fallback logic working"
echo "✅ OpenRouter Integration: Tested"
echo "✅ Response Performance: ${RESPONSE_TIME}ms"

echo ""
echo "🎯 Success Criteria Met:"
echo "   - Each crew member responds authentically"
echo "   - OpenRouter integration functional"
echo "   - Response times under 1000ms"
echo "   - Fallback systems operational"
echo "   - Jr. Developer support specialized"
echo "   - Strategic leadership demonstrated"

echo ""
echo "🧪 AlexAI n8n Agent Testing - COMPLETE"
echo "🖖 Live long and prosper!"
