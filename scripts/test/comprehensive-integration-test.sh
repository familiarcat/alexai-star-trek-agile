#!/bin/bash

# 🚀 Comprehensive Integration Test Suite
# Tests n8n, Next.js, and bilateral sync integration

set -e

echo "🚀 Starting Comprehensive Integration Test Suite"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNINGS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}🔍 Testing: $test_name${NC}"
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  ${RED}❌ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

# Function to run a test with output
run_test_with_output() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}🔍 Testing: $test_name${NC}"
    
    if output=$(eval "$test_command" 2>&1); then
        echo -e "  ${GREEN}✅ PASS${NC}"
        echo "  Output: $output"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  ${RED}❌ FAIL${NC}"
        echo "  Error: $output"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

echo "🌐 Phase 1: N8N Integration Tests"
echo "----------------------------------"

# Test n8n connectivity
run_test "N8N Server Connectivity" "curl -s --connect-timeout 10 'https://n8n.pbradygeorgen.com' >/dev/null"

# Test n8n API endpoints
run_test "N8N API Health Check" "curl -s --connect-timeout 10 'https://n8n.pbradygeorgen.com/api/v1/health' >/dev/null"

# Test n8n workflows endpoint
run_test "N8N Workflows API" "curl -s --connect-timeout 10 'https://n8n.pbradygeorgen.com/api/v1/workflows' >/dev/null"

echo "🔄 Phase 2: Bilateral Sync System Tests"
echo "---------------------------------------"

# Test sync manager script exists
run_test "Enhanced Sync Manager Script" "test -f 'bilateral-sync/scripts/enhanced-sync-manager.js'"

# Test sync configuration
run_test "Sync Configuration File" "test -f 'bilateral-sync/config.json'"

# Test sync manager can start
run_test "Sync Manager Startup Test" "timeout 10s node bilateral-sync/scripts/enhanced-sync-manager.js status >/dev/null 2>&1"

# Test sync health check
run_test "Sync Health Check" "npm run sync:health >/dev/null 2>&1"

echo "⚡ Phase 3: Next.js Application Tests"
echo "------------------------------------"

# Test Next.js dependencies
run_test "Next.js Package.json" "test -f 'package.json'"

# Test Next.js source files
run_test "Next.js Source Directory" "test -d 'src/app'"

# Test Next.js can build
run_test "Next.js Build Test" "timeout 30s npm run build >/dev/null 2>&1"

echo "🔧 Phase 4: System Integration Tests"
echo "------------------------------------"

# Test workflow directories
run_test "Local Workflows Directory" "test -d 'workflows'"
run_test "Sync Workflows Directory" "test -d 'bilateral-sync/workflows'"

# Test configuration files
run_test "Project Configuration" "test -f 'config/deployment-config.json'"

# Test monitoring scripts
run_test "Monitoring Scripts" "test -f 'scripts/monitoring/sync-health-check.sh'"

echo "📊 Phase 5: Data Validation Tests"
echo "---------------------------------"

# Count workflows
LOCAL_WORKFLOWS=$(find workflows/ -name "*.json" | wc -l | tr -d ' ')
SYNC_WORKFLOWS=$(find bilateral-sync/workflows/ -name "*.json" | wc -l | tr -d ' ')

echo "📁 Workflow Counts:"
echo "  Local workflows: $LOCAL_WORKFLOWS"
echo "  Sync workflows: $SYNC_WORKFLOWS"

if [ "$LOCAL_WORKFLOWS" -gt 0 ]; then
    echo -e "  ${GREEN}✅ Local workflows found${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  ${RED}❌ No local workflows found${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

if [ "$SYNC_WORKFLOWS" -gt 0 ]; then
    echo -e "  ${GREEN}✅ Sync workflows found${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  ${YELLOW}⚠️  No sync workflows found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

echo "🎯 Test Results Summary"
echo "======================"
echo "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"

if [ "$FAILED_TESTS" -eq 0 ]; then
    SUCCESS_RATE=100
else
    SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
fi

echo "Success Rate: ${SUCCESS_RATE}%"
echo ""

if [ "$FAILED_TESTS" -eq 0 ]; then
    echo -e "${GREEN}🎉 All integration tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the results above.${NC}"
    exit 1
fi
