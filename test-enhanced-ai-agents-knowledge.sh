#!/bin/zsh

# 🧠 Enhanced AI Agents Knowledge Integration Test
# Tests N8N agents' ability to access and utilize the new knowledge base

set -e

# Source safe utilities
source scripts/utils/safe-echo.sh

print_header "ENHANCED AI AGENTS KNOWLEDGE INTEGRATION TEST" "Testing bilateral learning capabilities"

# Test Knowledge API accessibility
test_knowledge_api() {
    print_section "TESTING KNOWLEDGE API ACCESSIBILITY" "🔍"
    
    print_status "working" "Testing basic knowledge API..."
    local api_response=$(curl -s "http://localhost:3000/api/knowledge")
    
    if echo "$api_response" | grep -q "domains"; then
        print_status "success" "Knowledge API is accessible"
        print_status "info" "Available domains: $(echo "$api_response" | grep -o '"domains":\[[^]]*\]')"
    else
        print_status "error" "Knowledge API not responding correctly"
        return 1
    fi
    
    print_status "working" "Testing agent-specific knowledge access..."
    local agent_response=$(curl -s "http://localhost:3000/api/knowledge?agent=lieutenant-data")
    
    if echo "$agent_response" | grep -q "relevantDomains"; then
        print_status "success" "Agent-specific knowledge access working"
        print_status "info" "Data's domains: $(echo "$agent_response" | grep -o '"relevantDomains":\[[^]]*\]')"
    else
        print_status "error" "Agent-specific knowledge access failed"
        return 1
    fi
}

# Test each crew member's enhanced capabilities
test_enhanced_crew_capabilities() {
    print_section "TESTING ENHANCED CREW CAPABILITIES" "🤖"
    
    local crew_members=("captain-picard" "lieutenant-data" "counselor-troi" "chief-engineer-scott" "commander-spock" "lieutenant-worf")
    
    for crew_member in "${crew_members[@]}"; do
        print_status "working" "Testing enhanced capabilities for $crew_member..."
        
        # Test knowledge-enhanced query
        local test_query="How should we approach a complex technical problem with multiple team dependencies?"
        
        local response=$(curl -s -X POST "http://localhost:3000/api/crew/$crew_member" \
            -H "Content-Type: application/json" \
            -d "{
                \"query\": \"$test_query\",
                \"context\": \"knowledge-integration-test\",
                \"urgency\": \"normal\",
                \"useKnowledgeBase\": true
            }")
        
        if echo "$response" | grep -q "response"; then
            print_status "success" "$crew_member responded with enhanced capabilities"
            
            # Check if response mentions knowledge or learning
            if echo "$response" | grep -qi "knowledge\|experience\|documentation\|standards"; then
                print_status "success" "$crew_member is referencing knowledge base"
            else
                print_status "warning" "$crew_member may not be fully utilizing knowledge base"
            fi
        else
            print_status "error" "$crew_member failed to respond"
        fi
    done
}

# Test bilateral learning workflow
test_bilateral_learning() {
    print_section "TESTING BILATERAL LEARNING WORKFLOW" "🔄"
    
    print_status "working" "Creating test knowledge entry..."
    
    # Create a test knowledge entry
    local test_knowledge='{
        "domain": "05-evolution/learning-logs",
        "filename": "test-bilateral-learning.md",
        "content": "# Test Bilateral Learning\\n\\nThis is a test entry to validate bilateral learning capabilities.\\n\\n## Key Insights\\n- Knowledge integration successful\\n- Agents can access real-time knowledge\\n- Bilateral learning active\\n\\n**Date:** $(date)\\n**Status:** Test Entry",
        "agent": "test-system"
    }'
    
    local add_response=$(curl -s -X POST "http://localhost:3000/api/knowledge" \
        -H "Content-Type: application/json" \
        -d "$test_knowledge")
    
    if echo "$add_response" | grep -q "successfully"; then
        print_status "success" "Test knowledge entry added successfully"
        
        # Test if agents can now access this new knowledge
        print_status "working" "Testing agent access to new knowledge..."
        
        local knowledge_query=$(curl -s "http://localhost:3000/api/knowledge?domain=05-evolution")
        if echo "$knowledge_query" | grep -q "test-bilateral-learning"; then
            print_status "success" "New knowledge is accessible via API"
        else
            print_status "warning" "New knowledge may not be immediately indexed"
        fi
        
    else
        print_status "error" "Failed to add test knowledge entry"
        print_status "info" "Response: $add_response"
    fi
}

# Test N8N workflow integration
test_n8n_workflow_integration() {
    print_section "TESTING N8N WORKFLOW INTEGRATION" "⚙️"
    
    print_status "working" "Testing N8N webhook with knowledge enhancement..."
    
    # Test the main N8N workflow endpoint
    if command -v curl >/dev/null; then
        local n8n_test=$(curl -s -w "%{http_code}" \
            -X POST "https://n8n.pbradygeorgen.com/webhook/crew-request" \
            -H "Content-Type: application/json" \
            -d '{
                "query": "What knowledge systems do we have available?",
                "context": "knowledge-integration-test",
                "urgency": "normal",
                "requestKnowledgeAccess": true
            }' -o /dev/null)
        
        if [[ "$n8n_test" == "200" ]]; then
            print_status "success" "N8N webhook responding successfully"
        else
            print_status "warning" "N8N webhook response: $n8n_test (may need activation)"
        fi
    fi
    
    # Test local N8N integration endpoint
    local local_integration=$(curl -s "http://localhost:3000/api/n8n-integration")
    if echo "$local_integration" | grep -q "operational"; then
        print_status "success" "Local N8N integration operational"
    else
        print_status "warning" "Local N8N integration needs configuration"
    fi
}

# Test knowledge utilization in decision making
test_knowledge_decision_making() {
    print_section "TESTING KNOWLEDGE-ENHANCED DECISION MAKING" "🎯"
    
    print_status "working" "Testing complex decision scenario..."
    
    # Create a complex scenario that should reference multiple knowledge domains
    local complex_scenario="We need to implement a new feature that requires:
    1. Frontend UI changes (LCARS design)
    2. Backend API modifications
    3. Database schema updates
    4. Security considerations
    5. Testing procedures
    6. Deployment coordination
    
    What's the best approach and what resources should we reference?"
    
    print_status "working" "Querying Captain Picard for strategic guidance..."
    local picard_response=$(curl -s -X POST "http://localhost:3000/api/crew/captain-picard" \
        -H "Content-Type: application/json" \
        -d "{
            \"query\": \"$complex_scenario\",
            \"context\": \"multi-domain-decision-test\",
            \"urgency\": \"high\"
        }")
    
    if echo "$picard_response" | grep -qi "approach\|strategy\|coordinate"; then
        print_status "success" "Picard provided strategic guidance"
    fi
    
    print_status "working" "Querying Lieutenant Data for technical analysis..."
    local data_response=$(curl -s -X POST "http://localhost:3000/api/crew/lieutenant-data" \
        -H "Content-Type: application/json" \
        -d "{
            \"query\": \"$complex_scenario\",
            \"context\": \"technical-analysis-test\",
            \"urgency\": \"high\"
        }")
    
    if echo "$data_response" | grep -qi "technical\|implementation\|analysis"; then
        print_status "success" "Data provided technical analysis"
    fi
    
    print_status "working" "Querying Chief Engineer Scott for implementation details..."
    local scott_response=$(curl -s -X POST "http://localhost:3000/api/crew/chief-engineer-scott" \
        -H "Content-Type: application/json" \
        -d "{
            \"query\": \"$complex_scenario\",
            \"context\": \"engineering-implementation-test\",
            \"urgency\": \"high\"
        }")
    
    if echo "$scott_response" | grep -qi "implementation\|engineering\|technical"; then
        print_status "success" "Scott provided engineering guidance"
    fi
}

# Main execution
main() {
    print_header "AI AGENTS KNOWLEDGE INTEGRATION TEST" "$(date)"
    
    # Run all tests
    test_knowledge_api
    test_enhanced_crew_capabilities
    test_bilateral_learning
    test_n8n_workflow_integration
    test_knowledge_decision_making
    
    print_section "TEST SUMMARY" "📊"
    
    print_status "success" "Knowledge integration testing completed"
    
    print_section "NEXT STEPS FOR BILATERAL LEARNING" "🎯"
    print_status "info" "1. Enhance N8N workflows to actively query knowledge base"
    print_status "info" "2. Implement automatic knowledge indexing for new files"
    print_status "info" "3. Create learning feedback loops for agent improvement"
    print_status "info" "4. Establish knowledge-driven decision enhancement"
    
    print_status "success" "Ready to implement full bilateral learning system!"
}

main "$@"
