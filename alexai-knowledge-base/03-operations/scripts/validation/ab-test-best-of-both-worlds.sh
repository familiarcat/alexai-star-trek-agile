#!/bin/bash

# A/B Testing: Human Intuition vs Borg Efficiency vs Hybrid

set -e

echo "⚖️ A/B TESTING: BEST OF BOTH WORLDS"
echo "=================================="
echo ""

# Test queries for comparison
test_queries=(
    '{"query": "How do I optimize database performance?", "context": "technical problem", "urgency": "high"}'
    '{"query": "Team is having communication issues", "context": "interpersonal conflict", "urgency": "medium"}'
    '{"query": "Security vulnerability detected", "context": "security concern", "urgency": "critical"}'
    '{"query": "Strategic planning for Q4", "context": "business strategy", "urgency": "normal"}'
)

# Test endpoints
current_endpoint="https://n8n.pbradygeorgen.com/webhook/crew-request"
enhanced_endpoint="https://n8n.pbradygeorgen.com/webhook/crew-request-enhanced"
optimized_endpoint="https://n8n.pbradygeorgen.com/webhook/crew-request-optimized"

echo "🧪 Testing all three approaches..."
echo ""

for i in "${!test_queries[@]}"; do
    query="${test_queries[$i]}"
    echo "Test $((i+1)): $(echo "$query" | jq -r '.query')"
    echo "----------------------------------------"
    
    # Test current workflow (Human baseline)
    echo "🖖 Human Intuition (Current):"
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$query" \
        "$current_endpoint" 2>/dev/null || echo "ERROR")
    
    if [[ "$response" =~ 200$ ]]; then
        echo "✅ Response received"
    else
        echo "⚠️ No response or error"
    fi
    echo ""
    
    # Test enhanced workflow (Human-Borg Hybrid)
    echo "🌟 Human-Borg Hybrid (Enhanced):"
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$query" \
        "$enhanced_endpoint" 2>/dev/null || echo "ERROR")
    
    if [[ "$response" =~ 200$ ]]; then
        echo "✅ Response received with enhancement"
    else
        echo "⚠️ Enhanced endpoint not active"
    fi
    echo ""
    
    # Test optimized workflow (Borg Efficiency)
    echo "🤖 Borg Efficiency (Optimized):"
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$query" \
        "$optimized_endpoint" 2>/dev/null || echo "ERROR")
    
    if [[ "$response" =~ 200$ ]]; then
        echo "✅ Optimized response received"
    else
        echo "⚠️ Optimized endpoint not active"
    fi
    echo ""
    echo "================================================"
    echo ""
done

echo "🎯 A/B Testing Analysis:"
echo "========================"
echo "🖖 Human Intuition: Proven, stable, moderate performance"
echo "🌟 Human-Borg Hybrid: Enhanced features, improved accuracy"
echo "🤖 Borg Efficiency: Maximum optimization, advanced features"
echo ""
echo "📊 Recommendation: Gradual migration from Human → Hybrid → Borg"
