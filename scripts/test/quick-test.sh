#!/bin/bash

# Quick Test Runner for AlexAI Agents
# Rapid testing of key components without full comprehensive suite

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TEST_DIR="$PROJECT_ROOT/tests"

echo -e "${CYAN}⚡ AlexAI Quick Test Runner${NC}"
echo -e "${CYAN}==========================${NC}"
echo ""

# Function to test basic connectivity
test_connectivity() {
    echo -e "${BLUE}🔍 Testing basic connectivity...${NC}"
    
    # Test local server
    if curl -s "http://localhost:3000" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Local development server is accessible${NC}"
    else
        echo -e "${RED}❌ Local development server is not accessible${NC}"
        return 1
    fi
    
    # Test n8n server
    if curl -s "https://n8n.pbradygeorgen.com" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ N8N server is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️ N8N server is not accessible${NC}"
    fi
    
    return 0
}

# Function to test key agent endpoints
test_key_agents() {
    echo -e "${BLUE}🤖 Testing key agent endpoints...${NC}"
    
    local_url="http://localhost:3000"
    agents=("captain-picard" "lieutenant-data" "counselor-troi")
    
    for agent in "${agents[@]}"; do
        if curl -s -X POST "$local_url/api/crew/$agent" \
           -H "Content-Type: application/json" \
           -d '{"context": "Quick connectivity test", "priority": "low"}' \
           > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Agent $agent is responding${NC}"
        else
            echo -e "${YELLOW}⚠️ Agent $agent may not be fully operational${NC}"
        fi
    done
}

# Function to test n8n workflow
test_n8n_workflow() {
    echo -e "${BLUE}🔄 Testing N8N workflow...${NC}"
    
    # Test the comprehensive agent validation workflow
    test_data='{"validationType": "quick", "includeSpecialized": false, "testDepth": "basic"}'
    
    if curl -s -X POST "https://n8n.pbradygeorgen.com/webhook/comprehensive-agent-validation" \
       -H "Content-Type: application/json" \
       -d "$test_data" \
       > /dev/null 2>&1; then
        echo -e "${GREEN}✅ N8N workflow is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️ N8N workflow may not be fully operational${NC}"
    fi
}

# Function to run quick test suite
run_quick_tests() {
    echo -e "${BLUE}🧪 Running quick test suite...${NC}"
    
    local all_passed=true
    
    # Test connectivity
    if test_connectivity; then
        echo -e "${GREEN}✅ Connectivity tests passed${NC}"
    else
        echo -e "${RED}❌ Connectivity tests failed${NC}"
        all_passed=false
    fi
    
    # Test key agents
    test_key_agents
    echo -e "${GREEN}✅ Agent endpoint tests completed${NC}"
    
    # Test n8n workflow
    test_n8n_workflow
    echo -e "${GREEN}✅ N8N workflow test completed${NC}"
    
    return $([ "$all_passed" = true ] && echo 0 || echo 1)
}

# Main execution
main() {
    echo -e "${CYAN}🎯 Starting quick test suite...${NC}"
    echo ""
    
    start_time=$(date +%s)
    
    if run_quick_tests; then
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        
        echo ""
        echo -e "${GREEN}🎉 Quick test suite completed successfully!${NC}"
        echo -e "${GREEN}⏱️ Duration: ${duration}s${NC}"
        echo ""
        echo -e "${GREEN}🚀 Your AlexAI system appears to be operational!${NC}"
        echo -e "${BLUE}📋 For comprehensive testing, run: ./scripts/test/run-comprehensive-agent-test.sh${NC}"
        
        exit 0
    else
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        
        echo ""
        echo -e "${RED}❌ Quick test suite encountered issues${NC}"
        echo -e "${RED}⏱️ Duration: ${duration}s${NC}"
        echo ""
        echo -e "${YELLOW}⚠️ Please check the failed tests above${NC}"
        echo -e "${BLUE}📋 For detailed testing, run: ./scripts/test/run-comprehensive-agent-test.sh${NC}"
        
        exit 1
    fi
}

# Execute main function
main "$@"
