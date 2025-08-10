#!/bin/bash

# 🔄 Test Bilateral CursorAI-N8N Integration
# Comprehensive testing of the enhanced bilateral sync system

set -e

echo "🧪 TESTING BILATERAL CURSORAI-N8N INTEGRATION"
echo "=============================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BILATERAL_DIR="${PROJECT_ROOT}/bilateral-sync"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Test result function
test_result() {
    local test_name="$1"
    local success="$2"
    local message="$3"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    if [[ "$success" == "true" ]]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name - $message"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name - $message"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Test 1: Check bilateral sync directory structure
test_directory_structure() {
    echo "📁 Testing directory structure..."
    
    local required_dirs=(
        "bilateral-sync"
        "bilateral-sync/scripts"
        "bilateral-sync/snapshots"
        "bilateral-sync/logs"
        "sync-system/workflows"
    )
    
    local all_exist=true
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "${PROJECT_ROOT}/${dir}" ]]; then
            echo -e "${YELLOW}⚠️ Directory missing: $dir${NC}"
            all_exist=false
        fi
    done
    
    test_result "Directory Structure" "$all_exist" "All required directories exist"
}

# Test 2: Check configuration file
test_configuration() {
    echo "⚙️ Testing configuration file..."
    
    local config_file="${BILATERAL_DIR}/config.json"
    
    if [[ ! -f "$config_file" ]]; then
        test_result "Configuration File" "false" "Config file not found"
        return
    fi
    
    # Validate JSON syntax
    if node -e "JSON.parse(require('fs').readFileSync('$config_file', 'utf8'))" 2>/dev/null; then
        test_result "Configuration File" "true" "Valid JSON configuration"
    else
        test_result "Configuration File" "false" "Invalid JSON syntax"
    fi
}

# Test 3: Check script executability
test_script_executability() {
    echo "🔧 Testing script executability..."
    
    local required_scripts=(
        "bilateral-sync/scripts/enhanced-sync-manager.js"
        "bilateral-sync/scripts/validate-sync.js"
        "bilateral-sync/scripts/sync-monitor.js"
    )
    
    local all_executable=true
    for script in "${required_scripts[@]}"; do
        local script_path="${PROJECT_ROOT}/${script}"
        if [[ -f "$script_path" ]]; then
            if [[ -x "$script_path" ]]; then
                echo -e "${GREEN}✅ Executable: $script${NC}"
            else
                echo -e "${YELLOW}⚠️ Not executable: $script${NC}"
                all_executable=false
            fi
        else
            echo -e "${RED}❌ Missing: $script${NC}"
            all_executable=false
        fi
    done
    
    test_result "Script Executability" "$all_executable" "All required scripts are executable"
}

# Test 4: Test Node.js script execution
test_node_scripts() {
    echo "🟢 Testing Node.js script execution..."
    
    local scripts_to_test=(
        "bilateral-sync/scripts/validate-sync.js"
        "bilateral-sync/scripts/enhanced-sync-manager.js"
    )
    
    local all_work=true
    for script in "${scripts_to_test[@]}"; do
        local script_path="${PROJECT_ROOT}/${script}"
        if [[ -f "$script_path" ]]; then
            echo -e "${BLUE}🧪 Testing: $script${NC}"
            
            # Test script can be loaded without syntax errors
            if node -e "require('$script_path')" 2>/dev/null; then
                echo -e "${GREEN}✅ Script loads successfully${NC}"
            else
                echo -e "${RED}❌ Script failed to load${NC}"
                all_work=false
            fi
        fi
    done
    
    test_result "Node.js Scripts" "$all_work" "All Node.js scripts can be loaded"
}

# Test 5: Test N8N connectivity
test_n8n_connectivity() {
    echo "🌐 Testing N8N connectivity..."
    
    local n8n_url="https://n8n.pbradygeorgen.com"
    
    # Test basic connectivity
    if curl -s --connect-timeout 10 "$n8n_url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ N8N server is reachable${NC}"
        
        # Test health endpoint if available
        if curl -s --connect-timeout 10 "$n8n_url/healthz" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ N8N health endpoint accessible${NC}"
            test_result "N8N Connectivity" "true" "Server reachable and healthy"
        else
            echo -e "${YELLOW}⚠️ N8N health endpoint not accessible${NC}"
            test_result "N8N Connectivity" "true" "Server reachable (health endpoint not available)"
        fi
    else
        echo -e "${RED}❌ N8N server not reachable${NC}"
        test_result "N8N Connectivity" "false" "Server not reachable"
    fi
}

# Test 6: Test local workflow files
test_local_workflows() {
    echo "📁 Testing local workflow files..."
    
    local workflow_dir="${PROJECT_ROOT}/sync-system/workflows"
    
    if [[ ! -d "$workflow_dir" ]]; then
        test_result "Local Workflows" "false" "Workflow directory not found"
        return
    fi
    
    # Count workflow files
    local workflow_count=$(find "$workflow_dir" -name "*.json" | wc -l)
    
    if [[ $workflow_count -gt 0 ]]; then
        echo -e "${GREEN}✅ Found $workflow_count workflow files${NC}"
        
        # Test JSON validity
        local valid_json=true
        for file in "$workflow_dir"/*.json; do
            if [[ -f "$file" ]]; then
                if ! node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" 2>/dev/null; then
                    echo -e "${RED}❌ Invalid JSON: $(basename "$file")${NC}"
                    valid_json=false
                fi
            fi
        done
        
        test_result "Local Workflows" "$valid_json" "Found $workflow_count valid workflow files"
    else
        echo -e "${YELLOW}⚠️ No workflow files found${NC}"
        test_result "Local Workflows" "false" "No workflow files found"
    fi
}

# Test 7: Test environment variables
test_environment_variables() {
    echo "🔑 Testing environment variables..."
    
    local required_vars=("N8N_API_KEY")
    local all_present=true
    
    for var in "${required_vars[@]}"; do
        if [[ -n "${!var}" ]]; then
            echo -e "${GREEN}✅ $var is set${NC}"
        else
            echo -e "${RED}❌ $var is not set${NC}"
            all_present=false
        fi
    done
    
    test_result "Environment Variables" "$all_present" "All required environment variables are set"
}

# Test 8: Test npm scripts
test_npm_scripts() {
    echo "📦 Testing npm scripts..."
    
    local package_json="${PROJECT_ROOT}/package.json"
    
    if [[ ! -f "$package_json" ]]; then
        test_result "NPM Scripts" "false" "package.json not found"
        return
    fi
    
    # Check for bilateral sync scripts
    local required_scripts=(
        "sync:start"
        "sync:validate"
        "sync:monitor"
        "sync:full"
        "sync:status"
    )
    
    local all_scripts_present=true
    for script in "${required_scripts[@]}"; do
        if grep -q "\"$script\":" "$package_json"; then
            echo -e "${GREEN}✅ NPM script: $script${NC}"
        else
            echo -e "${RED}❌ Missing NPM script: $script${NC}"
            all_scripts_present=false
        fi
    done
    
    test_result "NPM Scripts" "$all_scripts_present" "All required NPM scripts are present"
}

# Test 9: Test bilateral sync validation
test_bilateral_sync_validation() {
    echo "🔄 Testing bilateral sync validation..."
    
    local validate_script="${BILATERAL_DIR}/scripts/validate-sync.js"
    
    if [[ ! -f "$validate_script" ]]; then
        test_result "Bilateral Sync Validation" "false" "Validation script not found"
        return
    fi
    
    # Run validation script
    echo -e "${BLUE}🧪 Running sync validation...${NC}"
    
    if node "$validate_script" 2>/dev/null; then
        echo -e "${GREEN}✅ Sync validation completed${NC}"
        test_result "Bilateral Sync Validation" "true" "Validation script executed successfully"
    else
        echo -e "${RED}❌ Sync validation failed${NC}"
        test_result "Bilateral Sync Validation" "false" "Validation script execution failed"
    fi
}

# Test 10: Test file watching capability
test_file_watching() {
    echo "👀 Testing file watching capability..."
    
    # Check if chokidar is installed
    if node -e "require('chokidar')" 2>/dev/null; then
        echo -e "${GREEN}✅ Chokidar file watcher available${NC}"
        test_result "File Watching" "true" "Chokidar dependency is available"
    else
        echo -e "${RED}❌ Chokidar file watcher not available${NC}"
        test_result "File Watching" "false" "Chokidar dependency missing"
    fi
}

# Test 11: Test conflict resolution configuration
test_conflict_resolution() {
    echo "⚖️ Testing conflict resolution configuration..."
    
    local config_file="${BILATERAL_DIR}/config.json"
    
    if [[ ! -f "$config_file" ]]; then
        test_result "Conflict Resolution" "false" "Config file not found"
        return
    fi
    
    # Check conflict resolution settings
    local strategy=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$config_file', 'utf8')).conflictResolution?.strategy || 'none')")
    local auto_resolve=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$config_file', 'utf8')).conflictResolution?.autoResolve || false)")
    
    echo -e "${BLUE}📊 Conflict resolution strategy: $strategy${NC}"
    echo -e "${BLUE}📊 Auto-resolve conflicts: $auto_resolve${NC}"
    
    if [[ "$strategy" != "none" ]]; then
        test_result "Conflict Resolution" "true" "Conflict resolution configured with strategy: $strategy"
    else
        test_result "Conflict Resolution" "false" "No conflict resolution strategy configured"
    fi
}

# Test 12: Test monitoring capabilities
test_monitoring_capabilities() {
    echo "📊 Testing monitoring capabilities..."
    
    local monitor_script="${BILATERAL_DIR}/scripts/sync-monitor.js"
    
    if [[ ! -f "$monitor_script" ]]; then
        test_result "Monitoring Capabilities" "false" "Monitor script not found"
        return
    fi
    
    # Check if monitoring script can be loaded
    if node -e "require('$monitor_script')" 2>/dev/null; then
        echo -e "${GREEN}✅ Monitor script loads successfully${NC}"
        test_result "Monitoring Capabilities" "true" "Monitoring system is available"
    else
        echo -e "${RED}❌ Monitor script failed to load${NC}"
        test_result "Monitoring Capabilities" "false" "Monitoring system not available"
    fi
}

# Run all tests
run_all_tests() {
    echo "🚀 Starting comprehensive bilateral sync testing..."
    echo ""
    
    test_directory_structure
    echo ""
    
    test_configuration
    echo ""
    
    test_script_executability
    echo ""
    
    test_node_scripts
    echo ""
    
    test_n8n_connectivity
    echo ""
    
    test_local_workflows
    echo ""
    
    test_environment_variables
    echo ""
    
    test_npm_scripts
    echo ""
    
    test_bilateral_sync_validation
    echo ""
    
    test_file_watching
    echo ""
    
    test_conflict_resolution
    echo ""
    
    test_monitoring_capabilities
    echo ""
}

# Display test summary
display_summary() {
    echo "📊 TEST SUMMARY"
    echo "==============="
    echo ""
    echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"
    echo -e "${BLUE}📊 Total Tests: $TESTS_TOTAL${NC}"
    echo ""
    
    local success_rate=$(( (TESTS_PASSED * 100) / TESTS_TOTAL ))
    echo -e "${BLUE}📈 Success Rate: ${success_rate}%${NC}"
    echo ""
    
    if [[ $TESTS_FAILED -eq 0 ]]; then
        echo -e "${GREEN}🎉 ALL TESTS PASSED! Your bilateral sync system is ready!${NC}"
        echo ""
        echo "🚀 Next steps:"
        echo "  1. npm run sync:start     # Start bilateral sync"
        echo "  2. npm run sync:monitor   # Monitor operations"
        echo "  3. npm run dev            # Start development"
        echo ""
    else
        echo -e "${YELLOW}⚠️ Some tests failed. Please review the issues above.${NC}"
        echo ""
        echo "🔧 Troubleshooting tips:"
        echo "  1. Check environment variables"
        echo "  2. Verify N8N server connectivity"
        echo "  3. Ensure all dependencies are installed"
        echo "  4. Run: npm run sync:validate"
        echo ""
    fi
}

# Main execution
main() {
    echo "🧪 BILATERAL SYNC INTEGRATION TEST SUITE"
    echo "========================================="
    echo "This test suite validates the complete bilateral sync system"
    echo "between CursorAI and n8n.pbradygeorgen.com"
    echo ""
    
    # Run all tests
    run_all_tests
    
    # Display summary
    display_summary
    
    # Exit with appropriate code
    if [[ $TESTS_FAILED -eq 0 ]]; then
        exit 0
    else
        exit 1
    fi
}

# Execute main function
main "$@"
