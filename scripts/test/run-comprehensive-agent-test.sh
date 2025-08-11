#!/bin/bash

# Comprehensive Agent Workflow Test Suite Runner
# Tests all AlexAI agents with proper mock data and executes n8n workflows for validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TEST_DIR="$PROJECT_ROOT/tests"
REPORTS_DIR="$TEST_DIR/reports"
PYTHON_TEST_FILE="$TEST_DIR/integration/comprehensive_agent_workflow_test.py"

# Ensure reports directory exists
mkdir -p "$REPORTS_DIR"

echo -e "${CYAN}🚀 AlexAI Comprehensive Agent Workflow Test Suite${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python3 is not installed${NC}"
        exit 1
    fi
    
    # Check required Python packages
    echo -e "${BLUE}📦 Checking Python dependencies...${NC}"
    python3 -c "
import sys
required_packages = ['requests', 'aiohttp', 'asyncio']
missing_packages = []

for package in required_packages:
    try:
        __import__(package)
    except ImportError:
        missing_packages.append(package)

if missing_packages:
    print(f'Missing packages: {', '.join(missing_packages)}')
    print('Installing missing packages...')
    import subprocess
    subprocess.run([sys.executable, '-m', 'pip', 'install'] + missing_packages, check=True)
    print('Dependencies installed successfully!')
else:
    print('All required packages are available!')
"
    
    # Check if test file exists
    if [[ ! -f "$PYTHON_TEST_FILE" ]]; then
        echo -e "${RED}❌ Test file not found: $PYTHON_TEST_FILE${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    echo ""
}

# Function to check system status
check_system_status() {
    echo -e "${BLUE}🔍 Checking system status...${NC}"
    
    # Check if local development server is running
    if curl -s "http://localhost:3000" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Local development server is running${NC}"
    else
        echo -e "${YELLOW}⚠️ Local development server is not running${NC}"
        echo -e "${BLUE}   Starting development server...${NC}"
        cd "$PROJECT_ROOT"
        npm run dev &
        DEV_PID=$!
        echo -e "${BLUE}   Waiting for server to start...${NC}"
        sleep 10
        
        # Check if server started successfully
        if curl -s "http://localhost:3000" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Development server started successfully${NC}"
        else
            echo -e "${RED}❌ Failed to start development server${NC}"
            exit 1
        fi
    fi
    
    # Check n8n connectivity
    if curl -s "https://n8n.pbradygeorgen.com" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ N8N server is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️ N8N server is not accessible${NC}"
        echo -e "${BLUE}   This may affect workflow testing${NC}"
    fi
    
    echo -e "${GREEN}✅ System status check completed${NC}"
    echo ""
}

# Function to run the test suite
run_test_suite() {
    echo -e "${BLUE}🧪 Running comprehensive test suite...${NC}"
    echo ""
    
    cd "$TEST_DIR/integration"
    
    # Run the Python test suite
    if python3 "$PYTHON_TEST_FILE"; then
        echo ""
        echo -e "${GREEN}🎉 Test suite completed successfully!${NC}"
        return 0
    else
        echo ""
        echo -e "${RED}❌ Test suite failed!${NC}"
        return 1
    fi
}

# Function to display test results
display_results() {
    echo ""
    echo -e "${CYAN}📊 Test Results Summary${NC}"
    echo -e "${CYAN}=====================${NC}"
    
    # Find the most recent test report
    if [[ -d "$REPORTS_DIR" ]]; then
        LATEST_REPORT=$(find "$REPORTS_DIR" -name "comprehensive_agent_workflow_test_report_*.json" -type f | sort | tail -n 1)
        
        if [[ -n "$LATEST_REPORT" ]]; then
            echo -e "${BLUE}📋 Latest Report: $(basename "$LATEST_REPORT")${NC}"
            
            # Extract and display key metrics
            TOTAL_TESTS=$(python3 -c "import json; data=json.load(open('$LATEST_REPORT')); print(data['test_summary']['total_tests'])")
            PASSED=$(python3 -c "import json; data=json.load(open('$LATEST_REPORT')); print(data['test_summary']['passed'])")
            FAILED=$(python3 -c "import json; data=json.load(open('$LATEST_REPORT')); print(data['test_summary']['failed'])")
            SUCCESS_RATE=$(python3 -c "import json; data=json.load(open('$LATEST_REPORT')); print(data['test_summary']['success_rate'])")
            
            echo -e "${GREEN}✅ Total Tests: $TOTAL_TESTS${NC}"
            echo -e "${GREEN}✅ Passed: $PASSED${NC}"
            if [[ $FAILED -gt 0 ]]; then
                echo -e "${RED}❌ Failed: $FAILED${NC}"
            fi
            echo -e "${BLUE}📈 Success Rate: $SUCCESS_RATE%${NC}"
            
            # Display recommendations if any
            RECOMMENDATIONS=$(python3 -c "
import json
try:
    data = json.load(open('$LATEST_REPORT'))
    recs = data.get('recommendations', [])
    if recs:
        print('\\n📋 Recommendations:')
        for rec in recs:
            print(f'  • {rec}')
    else:
        print('\\n🎉 No recommendations - all systems operational!')
except Exception as e:
    print(f'\\n⚠️ Could not parse report: {e}')
")
            echo -e "$RECOMMENDATIONS"
            
        else
            echo -e "${YELLOW}⚠️ No test reports found${NC}"
        fi
    fi
}

# Function to cleanup
cleanup() {
    echo ""
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    
    # Kill development server if we started it
    if [[ -n "$DEV_PID" ]]; then
        echo -e "${BLUE}   Stopping development server...${NC}"
        kill "$DEV_PID" 2>/dev/null || true
    fi
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main execution
main() {
    echo -e "${PURPLE}🎯 Starting Comprehensive Agent Workflow Test Suite${NC}"
    echo ""
    
    # Set trap for cleanup
    trap cleanup EXIT
    
    # Check prerequisites
    check_prerequisites
    
    # Check system status
    check_system_status
    
    # Run test suite
    if run_test_suite; then
        echo ""
        echo -e "${GREEN}🎉 All tests completed successfully!${NC}"
        
        # Display results
        display_results
        
        echo ""
        echo -e "${GREEN}🚀 Your AlexAI system is fully operational and validated!${NC}"
        echo -e "${GREEN}🖖 Live long and prosper!${NC}"
        
        exit 0
    else
        echo ""
        echo -e "${RED}❌ Test suite encountered failures${NC}"
        
        # Display results even on failure
        display_results
        
        echo ""
        echo -e "${YELLOW}⚠️ Please review the failed tests and recommendations above${NC}"
        echo -e "${BLUE}📋 Check the detailed report for more information${NC}"
        
        exit 1
    fi
}

# Execute main function
main "$@"
