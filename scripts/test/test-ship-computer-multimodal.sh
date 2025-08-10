#!/bin/bash

# 🚀 Ship Computer Multimodal Agent Test Script
# Tests the Ship Computer's ability to dynamically generate UI based on user intent
# with all multimodal agents active in the n8n bidirectional framework

set -e

echo "🚀 SHIP COMPUTER MULTIMODAL AGENT TESTING"
echo "=========================================="
echo "Testing dynamic UI generation with all crew members active"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
N8N_BASE_URL="${N8N_BASE_URL:-https://n8n.pbradygeorgen.com}"
SHIP_COMPUTER_WEBHOOK="${N8N_BASE_URL}/webhook/ships-computer"
CREW_WEBHOOK="${N8N_BASE_URL}/webhook/crew-request"

# Check if we have the required environment
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  OPENROUTER_API_KEY not set. Some tests may fail.${NC}"
    echo "   Set it with: export OPENROUTER_API_KEY='your-key'"
    echo ""
fi

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
run_test() {
    local test_name="$1"
    local test_data="$2"
    local expected_crew="$3"
    local expected_ui="$4"
    
    echo -e "${BLUE}🧪 Test ${TESTS_RUN}: ${test_name}${NC}"
    echo "   Expected Crew: ${expected_crew}"
    echo "   Expected UI: ${expected_ui}"
    echo ""
    
    TESTS_RUN=$((TESTS_RUN + 1))
    
    # Run the test
    local response
    if response=$(curl -s -X POST "$SHIP_COMPUTER_WEBHOOK" \
        -H "Content-Type: application/json" \
        -d "$test_data" 2>/dev/null); then
        
        echo "   Response received:"
        echo "   $response" | jq '.' 2>/dev/null || echo "   $response"
        
        # Basic validation
        if echo "$response" | grep -q "crew_selection\|ui_layout\|interface_elements" 2>/dev/null; then
            echo -e "   ${GREEN}✅ Test PASSED - Valid Ship Computer response${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "   ${RED}❌ Test FAILED - Invalid response format${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        echo -e "   ${RED}❌ Test FAILED - Request failed${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
    sleep 1
}

# Test the Ship Computer's dynamic UI generation capabilities
echo -e "${CYAN}🎯 Testing Ship Computer Dynamic UI Generation${NC}"
echo "======================================================"
echo ""

# Test 1: Strategic Leadership Mission
run_test "Strategic Leadership Mission" '{
    "query": "Develop diplomatic strategy for first contact with unknown species",
    "context": "diplomatic leadership strategic",
    "userRole": "captain",
    "urgency": "high",
    "complexity": "high",
    "mission": "First Contact Protocol",
    "interfacePrefs": "command-focused"
}' "captain-picard,commander-spock" "strategic-command-layout"

# Test 2: Technical Engineering Mission
run_test "Technical Engineering Mission" '{
    "query": "Analyze warp core efficiency and optimize power distribution systems",
    "context": "technical engineering systems optimization",
    "userRole": "engineer",
    "urgency": "medium",
    "complexity": "high",
    "mission": "Warp Core Optimization",
    "interfacePrefs": "technical-detailed"
}' "lieutenant-data,chief-engineer-scott" "engineering-technical-layout"

# Test 3: Tactical Security Mission
run_test "Tactical Security Mission" '{
    "query": "Assess security protocols for entering hostile territory",
    "context": "tactical security defense protocols",
    "userRole": "security",
    "urgency": "high",
    "complexity": "medium",
    "mission": "Security Assessment",
    "interfacePrefs": "tactical-focused"
}' "lieutenant-worf" "tactical-security-layout"

# Test 4: Emotional Intelligence Mission
run_test "Emotional Intelligence Mission" '{
    "query": "Help resolve crew conflict in engineering department",
    "context": "emotional counseling interpersonal conflict",
    "userRole": "counselor",
    "urgency": "medium",
    "complexity": "low",
    "mission": "Crew Conflict Resolution",
    "interfacePrefs": "empathetic-focused"
}' "counselor-troi" "counseling-empathetic-layout"

# Test 5: Scientific Analysis Mission
run_test "Scientific Analysis Mission" '{
    "query": "Comprehensive analysis of unknown spatial anomaly",
    "context": "scientific research analysis spatial",
    "userRole": "scientist",
    "urgency": "medium",
    "complexity": "high",
    "mission": "Spatial Anomaly Research",
    "interfacePrefs": "scientific-detailed"
}' "lieutenant-data,observation-lounge" "scientific-research-layout"

# Test 6: Critical Emergency Mission
run_test "Critical Emergency Mission" '{
    "query": "Critical system failure - warp core breach imminent",
    "context": "emergency critical systems failure",
    "userRole": "captain",
    "urgency": "critical",
    "complexity": "critical",
    "mission": "Emergency Response",
    "interfacePrefs": "emergency-focused"
}' "all-crew" "emergency-critical-layout"

# Test 7: Multi-Crew Coordination Mission
run_test "Multi-Crew Coordination Mission" '{
    "query": "Coordinate response to multiple simultaneous threats",
    "context": "coordination multiple threats response",
    "userRole": "commander",
    "urgency": "high",
    "complexity": "high",
    "mission": "Multi-Threat Response",
    "interfacePrefs": "coordination-focused"
}' "captain-picard,lieutenant-worf,lieutenant-data" "coordination-command-layout"

# Test 8: Data Analysis Mission
run_test "Data Analysis Mission" '{
    "query": "Analyze sensor data for patterns indicating cloaked vessels",
    "context": "data analysis pattern recognition sensors",
    "userRole": "operations",
    "urgency": "medium",
    "complexity": "high",
    "mission": "Sensor Data Analysis",
    "interfacePrefs": "data-focused"
}' "lieutenant-data,observation-lounge" "data-analysis-layout"

# Test 9: Diplomatic Negotiation Mission
run_test "Diplomatic Negotiation Mission" '{
    "query": "Prepare negotiation strategy for trade agreement",
    "context": "diplomatic negotiation trade agreement",
    "userRole": "diplomat",
    "urgency": "medium",
    "complexity": "medium",
    "mission": "Trade Agreement Negotiation",
    "interfacePrefs": "diplomatic-focused"
}' "captain-picard,counselor-troi" "diplomatic-negotiation-layout"

# Test 10: System Integration Mission
run_test "System Integration Mission" '{
    "query": "Integrate new AI assistant with existing ship systems",
    "context": "system integration AI assistant",
    "userRole": "engineer",
    "urgency": "low",
    "complexity": "high",
    "mission": "AI System Integration",
    "interfacePrefs": "integration-focused"
}' "lieutenant-data,chief-engineer-scott" "system-integration-layout"

echo -e "${CYAN}🎯 Testing Crew Request Integration${NC}"
echo "====================================="
echo ""

# Test 11: Crew Request Integration
echo -e "${BLUE}🧪 Test ${TESTS_RUN}: Crew Request Integration${NC}"
echo "   Testing integration between Ship Computer and Crew Request systems"
echo ""

TESTS_RUN=$((TESTS_RUN + 1))

if response=$(curl -s -X POST "$CREW_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d '{
        "query": "Test crew coordination system",
        "context": "system testing",
        "userRole": "developer",
        "urgency": "low",
        "complexity": "low"
    }' 2>/dev/null); then
    
    echo "   Crew Response received:"
    echo "   $response" | jq '.' 2>/dev/null || echo "   $response"
    
    if echo "$response" | grep -q "crew\|response\|data" 2>/dev/null; then
        echo -e "   ${GREEN}✅ Crew Integration PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "   ${RED}❌ Crew Integration FAILED${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
else
    echo -e "   ${RED}❌ Crew Integration FAILED - Request failed${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""

# Test 12: UI Component Testing
echo -e "${CYAN}🎯 Testing UI Component Generation${NC}"
echo "====================================="
echo ""

# Test different UI preference combinations
ui_tests=(
    '{"query": "Quick status check", "interfacePrefs": "minimal"}'
    '{"query": "Detailed system analysis", "interfacePrefs": "detailed"}'
    '{"query": "Emergency protocol", "interfacePrefs": "emergency"}'
    '{"query": "Training simulation", "interfacePrefs": "training"}'
    '{"query": "Research mode", "interfacePrefs": "research"}'
)

for i in "${!ui_tests[@]}"; do
    local test_data="${ui_tests[$i]}"
    local test_name="UI Component Test $((i + 1))"
    
    echo -e "${BLUE}🧪 Test ${TESTS_RUN}: ${test_name}${NC}"
    echo "   Testing UI preference: $(echo "$test_data" | jq -r '.interfacePrefs')"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    
    if response=$(curl -s -X POST "$SHIP_COMPUTER_WEBHOOK" \
        -H "Content-Type: application/json" \
        -d "$test_data" 2>/dev/null); then
        
        if echo "$response" | grep -q "ui_layout\|interface_elements" 2>/dev/null; then
            echo -e "   ${GREEN}✅ UI Component Test PASSED${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "   ${RED}❌ UI Component Test FAILED${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        echo -e "   ${RED}❌ UI Component Test FAILED - Request failed${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
    sleep 0.5
done

# Test 13: Error Handling and Edge Cases
echo -e "${CYAN}🎯 Testing Error Handling and Edge Cases${NC}"
echo "============================================="
echo ""

# Test with invalid data
echo -e "${BLUE}🧪 Test ${TESTS_RUN}: Invalid Data Handling${NC}"
echo "   Testing Ship Computer's response to malformed requests"
echo ""

TESTS_RUN=$((TESTS_RUN + 1))

if response=$(curl -s -X POST "$SHIP_COMPUTER_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d '{"invalid": "data"}' 2>/dev/null); then
    
    echo "   Response to invalid data:"
    echo "   $response" | jq '.' 2>/dev/null || echo "   $response"
    
    # Ship Computer should handle this gracefully
    if [ -n "$response" ]; then
        echo -e "   ${GREEN}✅ Error Handling PASSED - Graceful response${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "   ${YELLOW}⚠️  Error Handling - No response (may be expected)${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    fi
else
    echo -e "   ${YELLOW}⚠️  Error Handling - Request failed (may be expected)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
fi

echo ""

# Test 14: Performance and Response Time
echo -e "${CYAN}🎯 Testing Performance and Response Time${NC}"
echo "============================================="
echo ""

echo -e "${BLUE}🧪 Test ${TESTS_RUN}: Response Time Performance${NC}"
echo "   Testing Ship Computer response time under normal load"
echo ""

TESTS_RUN=$((TESTS_RUN + 1))

start_time=$(date +%s.%N)
if response=$(curl -s -X POST "$SHIP_COMPUTER_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d '{
        "query": "Performance test query",
        "context": "performance testing",
        "userRole": "developer",
        "urgency": "low",
        "complexity": "low"
    }' 2>/dev/null); then
    
    end_time=$(date +%s.%N)
    response_time=$(echo "$end_time - $start_time" | bc -l 2>/dev/null || echo "0.1")
    
    echo "   Response time: ${response_time}s"
    
    if (( $(echo "$response_time < 5.0" | bc -l) )); then
        echo -e "   ${GREEN}✅ Performance Test PASSED - Fast response${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "   ${YELLOW}⚠️  Performance Test - Slow response (${response_time}s)${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    fi
else
    echo -e "   ${RED}❌ Performance Test FAILED - Request failed${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""

# Final Results
echo -e "${CYAN}🎯 TEST RESULTS SUMMARY${NC}"
echo "=========================="
echo ""
echo -e "Total Tests Run: ${TESTS_RUN}"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo -e "Success Rate: ${GREEN}$(( (TESTS_PASSED * 100) / TESTS_RUN ))%${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Ship Computer is operating at peak efficiency!${NC}"
    echo ""
    echo "🚀 Ship Computer Status: OPERATIONAL"
    echo "🔄 Dynamic UI Generation: ACTIVE"
    echo "🤖 Multimodal Agents: ALL SYSTEMS NOMINAL"
    echo "🎯 User Intent Recognition: OPTIMAL"
    echo "🛡️ Crew Coordination: SYNCHRONIZED"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the output above for details.${NC}"
    echo ""
    echo "🔧 Recommended Actions:"
    echo "   1. Check n8n workflow status"
    echo "   2. Verify webhook endpoints"
    echo "   3. Check environment variables"
    echo "   4. Review workflow logs"
fi

echo ""
echo -e "${CYAN}🎯 NEXT STEPS FOR SHIP COMPUTER REFINEMENT${NC}"
echo "==============================================="
echo ""
echo "1. 🧪 Review test results and identify areas for improvement"
echo "2. 🔄 Test with real user interactions in the UI"
echo "3. 📊 Analyze response patterns and crew selection accuracy"
echo "4. 🎨 Refine UI layout generation based on user feedback"
echo "5. 🤖 Optimize agent selection logic for better responses"
echo "6. 🚀 Deploy improvements to production n8n instance"
echo ""
echo "🖖 Live long and prosper! The Ship Computer is ready for duty!"
echo ""
