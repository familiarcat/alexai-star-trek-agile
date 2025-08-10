#!/bin/bash

# Enhanced Ship Agency Test Script
set -e

echo "🧪 Testing Enhanced Ship Agency Workflow..."
echo "=============================================="

# Test different mission scenarios
echo ""
echo "🚀 Test 1: Strategic Mission (Captain Picard + Commander Spock)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Develop strategic approach for enterprise mission",
    "context": "strategy leadership diplomatic",
    "userRole": "captain",
    "urgency": "high",
    "complexity": "high",
    "mission": "Diplomatic Mission to Neutral Zone"
  }' | jq '.'

echo ""
echo "🔧 Test 2: Technical Mission (Lieutenant Data + Chief Engineer Scott)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Analyze warp core efficiency and optimize power distribution",
    "context": "technical engineering systems",
    "userRole": "engineer",
    "urgency": "medium",
    "complexity": "high",
    "mission": "Warp Core Optimization"
  }' | jq '.'

echo ""
echo "🛡️ Test 3: Tactical Mission (Lieutenant Worf)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Assess security protocols for hostile territory",
    "context": "tactical security defense",
    "userRole": "security",
    "urgency": "high",
    "complexity": "medium",
    "mission": "Security Assessment"
  }' | jq '.'

echo ""
echo "💙 Test 4: Emotional Intelligence Mission (Counselor Troi)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Help resolve crew conflict in engineering",
    "context": "emotional counseling interpersonal",
    "userRole": "counselor",
    "urgency": "medium",
    "complexity": "low",
    "mission": "Crew Conflict Resolution"
  }' | jq '.'

echo ""
echo "🚨 Test 5: Critical Emergency Mission (All Crew + ChatGPT 5)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Critical system failure - warp core breach imminent",
    "context": "emergency critical systems failure",
    "userRole": "captain",
    "urgency": "critical",
    "complexity": "critical",
    "mission": "Emergency Response"
  }' | jq '.'

echo ""
echo "🔬 Test 6: Analytical Mission (Observation Lounge + Lieutenant Data)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Comprehensive analysis of unknown spatial anomaly",
    "context": "analysis research scientific",
    "userRole": "scientist",
    "urgency": "medium",
    "complexity": "high",
    "mission": "Spatial Anomaly Research"
  }' | jq '.'

echo ""
echo "✅ Enhanced Ship Agency testing complete!"
echo ""
echo "🎯 Key Features Demonstrated:"
echo "   • Dynamic crew selection based on mission context"
echo "   • Role-optimized LLM configurations"
echo "   • Emergency mode with ChatGPT 5 (32k tokens)"
echo "   • Mission priority-based UI layouts"
echo "   • Multi-crew coordination"
echo "   • Ship's Computer orchestration"
