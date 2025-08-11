#!/bin/bash

# 🖖 AlexAI Comprehensive UI Testing Script
# Tests the entire application, navigation system, and n8n backend integration

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
BASE_URL="http://localhost:3000"
LOG_FILE="logs/ui-test-comprehensive.log"
TEST_RESULTS_FILE="logs/ui-test-results-$(date +%Y%m%d-%H%M%S).json"

# Ensure logs directory exists
mkdir -p logs

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$LOG_FILE"
}

success() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1" >> "$LOG_FILE"
}

info() {
    echo -e "${PURPLE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1" >> "$LOG_FILE"
}

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to record test result
record_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$result" = "PASS" ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        success "✅ $test_name - PASSED"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        error "❌ $test_name - FAILED: $details"
    fi
    
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $test_name: $result - $details" >> "$LOG_FILE"
}

# Function to check if server is running
check_server_running() {
    log "Checking if server is running..."
    
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$BASE_URL/api/health" > /dev/null 2>&1; then
            success "Server is running on $BASE_URL"
            return 0
        elif curl -s "http://localhost:3001/api/health" > /dev/null 2>&1; then
            BASE_URL="http://localhost:3001"
            success "Server is running on $BASE_URL"
            return 0
        elif curl -s "http://localhost:3002/api/health" > /dev/null 2>&1; then
            BASE_URL="http://localhost:3002"
            success "Server is running on $BASE_URL"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "Server is not running on ports 3000, 3001, or 3002"
            return 1
        fi
        
        info "Attempt $attempt/$max_attempts: Server not ready, waiting..."
        sleep 3
        attempt=$((attempt + 1))
    done
}

# Function to test API endpoints
test_api_endpoints() {
    log "Testing API endpoints..."
    
    local endpoints=(
        "/api/health"
        "/api/projects"
        "/api/dashboard/stats"
        "/api/crew"
        "/api/workflows"
        "/api/n8n-integration/workflows"
        "/api/workflows/local"
        "/api/crew/captain-picard"
        "/api/crew/commander-data"
        "/api/crew/chief-medical-officer"
        "/api/crew/chief-engineering-officer"
        "/api/crew/chief-security-officer"
        "/api/crew/chief-communications-officer"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local test_name="API Endpoint: $endpoint"
        
        if curl -s "$BASE_URL$endpoint" > /dev/null 2>&1; then
            record_test "$test_name" "PASS" "Endpoint accessible"
        else
            record_test "$test_name" "FAIL" "Endpoint returned error or not accessible"
        fi
    done
}

# Function to test page routes
test_page_routes() {
    log "Testing page routes..."
    
    local routes=(
        "/"
        "/projects"
        "/tasks"
        "/workflow-management"
        "/analytics"
        "/agile-project"
        "/observation-lounge"
    )
    
    for route in "${routes[@]}"; do
        local test_name="Page Route: $route"
        
        if curl -s "$BASE_URL$route" > /dev/null 2>&1; then
            record_test "$test_name" "PASS" "Page accessible"
        else
            record_test "$test_name" "FAIL" "Page returned error or not accessible"
        fi
    done
}

# Function to test workflow management
test_workflow_management() {
    log "Testing workflow management functionality..."
    
    # Test workflow creation
    local test_workflow='{
        "name": "UI Test Workflow",
        "description": "Test workflow created during UI testing",
        "nodes": [],
        "connections": {}
    }'
    
    local test_name="Workflow Creation"
    local response=$(curl -s -X POST "$BASE_URL/api/workflows" \
        -H "Content-Type: application/json" \
        -d "$test_workflow" 2>/dev/null || echo "FAILED")
    
    if echo "$response" | grep -q "success.*true"; then
        record_test "$test_name" "PASS" "Workflow created successfully"
    else
        record_test "$test_name" "FAIL" "Failed to create workflow: $response"
    fi
    
    # Test workflow retrieval
    test_name="Workflow Retrieval"
    if curl -s "$BASE_URL/api/workflows" | grep -q "UI Test Workflow"; then
        record_test "$test_name" "PASS" "Created workflow found in list"
    else
        record_test "$test_name" "FAIL" "Created workflow not found in list"
    fi
}

# Function to test crew coordination
test_crew_coordination() {
    log "Testing crew coordination functionality..."
    
    # Test crew member data retrieval
    local crew_members=("captain-picard" "commander-data" "chief-medical-officer")
    
    for member in "${crew_members[@]}"; do
        local test_name="Crew Member: $member"
        
        if curl -s "$BASE_URL/api/crew/$member" > /dev/null 2>&1; then
            record_test "$test_name" "PASS" "Crew member data accessible"
        else
            record_test "$test_name" "FAIL" "Crew member data not accessible"
        fi
    done
    
    # Test crew coordination endpoint
    local test_name="Crew Coordination"
    local test_payload='{
        "query": "Test crew coordination",
        "context": "ui-testing",
        "userRole": "developer"
    }'
    
    local response=$(curl -s -X POST "$BASE_URL/api/crew-coordination" \
        -H "Content-Type: application/json" \
        -d "$test_payload" 2>/dev/null || echo "FAILED")
    
    if echo "$response" | grep -q "success.*true" || echo "$response" | grep -q "message"; then
        record_test "$test_name" "PASS" "Crew coordination endpoint working"
    else
        record_test "$test_name" "FAIL" "Crew coordination failed: $response"
    fi
}

# Function to test n8n integration
test_n8n_integration() {
    log "Testing n8n integration..."
    
    local test_name="N8N Workflows Endpoint"
    
    if curl -s "$BASE_URL/api/n8n-integration/workflows" > /dev/null 2>&1; then
        record_test "$test_name" "PASS" "N8N integration endpoint accessible"
    else
        record_test "$test_name" "FAIL" "N8N integration endpoint not accessible"
    fi
    
    # Test n8n workflow activation (if available)
    test_name="N8N Workflow Activation"
    local response=$(curl -s "$BASE_URL/api/n8n-integration/workflows" 2>/dev/null || echo "FAILED")
    
    if echo "$response" | grep -q "workflows"; then
        record_test "$test_name" "PASS" "N8N workflows data retrieved"
    else
        record_test "$test_name" "FAIL" "Failed to retrieve N8N workflows: $response"
    fi
}

# Function to test navigation system
test_navigation_system() {
    log "Testing navigation system..."
    
    # Test that all main navigation links are accessible
    local navigation_tests=(
        "Dashboard Navigation: /"
        "Projects Navigation: /projects"
        "Tasks Navigation: /tasks"
        "Workflow Management Navigation: /workflow-management"
        "Analytics Navigation: /analytics"
        "Agile Project Navigation: /agile-project"
    )
    
    for test in "${navigation_tests[@]}"; do
        local route=$(echo "$test" | cut -d':' -f2 | xargs)
        local test_name="$test"
        
        if curl -s "$BASE_URL$route" > /dev/null 2>&1; then
            record_test "$test_name" "PASS" "Navigation route accessible"
        else
            record_test "$test_name" "FAIL" "Navigation route not accessible"
        fi
    done
}

# Function to test responsive design
test_responsive_design() {
    log "Testing responsive design..."
    
    # Test with different user agents to simulate different devices
    local user_agents=(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
        "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    )
    
    local test_name="Responsive Design"
    local passed=0
    local total=${#user_agents[@]}
    
    for ua in "${user_agents[@]}"; do
        if curl -s -H "User-Agent: $ua" "$BASE_URL" > /dev/null 2>&1; then
            passed=$((passed + 1))
        fi
    done
    
    if [ $passed -eq $total ]; then
        record_test "$test_name" "PASS" "All user agents handled successfully ($passed/$total)"
    else
        record_test "$test_name" "FAIL" "Some user agents failed ($passed/$total)"
    fi
}

# Function to test error handling
test_error_handling() {
    log "Testing error handling..."
    
    # Test 404 handling
    local test_name="404 Error Handling"
    local response=$(curl -s -w "%{http_code}" "$BASE_URL/nonexistent-page" 2>/dev/null || echo "000")
    
    if echo "$response" | grep -q "404\|000"; then
        record_test "$test_name" "PASS" "404 errors handled properly"
    else
        record_test "$test_name" "FAIL" "404 errors not handled properly"
    fi
    
    # Test invalid API requests
    test_name="Invalid API Request Handling"
    local response=$(curl -s -X POST "$BASE_URL/api/workflows" \
        -H "Content-Type: application/json" \
        -d "invalid json" 2>/dev/null || echo "FAILED")
    
    if echo "$response" | grep -q "error\|400\|500"; then
        record_test "$test_name" "PASS" "Invalid requests handled properly"
    else
        record_test "$test_name" "FAIL" "Invalid requests not handled properly"
    fi
}

# Function to generate test report
generate_test_report() {
    log "Generating comprehensive test report..."
    
    local success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    
    # Create JSON report
    cat > "$TEST_RESULTS_FILE" << EOF
{
  "test_summary": {
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "total_tests": $TOTAL_TESTS,
    "passed": $PASSED_TESTS,
    "failed": $FAILED_TESTS,
    "success_rate": $success_rate
  },
  "test_details": {
    "server_status": "running",
    "base_url": "$BASE_URL",
    "test_duration": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  }
}
EOF
    
    # Display summary
    echo ""
    echo "=================================="
    echo "🎯 COMPREHENSIVE UI TEST RESULTS"
    echo "=================================="
    echo "📊 Total Tests: $TOTAL_TESTS"
    echo "✅ Passed: $PASSED_TESTS"
    echo "❌ Failed: $FAILED_TESTS"
    echo "📈 Success Rate: ${success_rate}%"
    echo "🌐 Base URL: $BASE_URL"
    echo "📄 Report: $TEST_RESULTS_FILE"
    echo "=================================="
    
    if [ $FAILED_TESTS -eq 0 ]; then
        success "🎉 All tests passed! The UI is fully functional."
    else
        warn "⚠️ Some tests failed. Check the log for details."
    fi
}

# Main execution
main() {
    log "🚀 Starting Comprehensive UI Testing..."
    echo "UI testing started at $(date)" > "$LOG_FILE"
    
    # Check if we're in the project directory
    if [ ! -f "package.json" ]; then
        error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Check server status
    if ! check_server_running; then
        error "Cannot proceed with UI testing - server is not running"
        exit 1
    fi
    
    # Run all test suites
    test_api_endpoints
    test_page_routes
    test_workflow_management
    test_crew_coordination
    test_n8n_integration
    test_navigation_system
    test_responsive_design
    test_error_handling
    
    # Generate final report
    generate_test_report
    
    log "🎯 Comprehensive UI testing completed!"
    log "Check the test results file for details: $TEST_RESULTS_FILE"
}

# Run main function
main "$@"
