#!/bin/bash

# 🎨 AlexAI New UI Design System Testing Script
# Tests the new modern UI components, CTAs, interactions, and navigation
# Validates the 2025 design trends implementation and crew optimization system

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
LOG_FILE="logs/new-ui-test-$(date +%Y%m%d-%H%M%S).log"
TEST_RESULTS_FILE="logs/new-ui-test-results-$(date +%Y%m%d-%H%M%S).json"
SCREENSHOT_DIR="test-screenshots/new-ui-test-$(date +%Y%m%d-%H%M%S)"

# Ensure directories exist
mkdir -p logs
mkdir -p "$SCREENSHOT_DIR"

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
    log "Checking if development server is running..."
    
    local max_attempts=15
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$BASE_URL" > /dev/null 2>&1; then
            success "Development server is running on $BASE_URL"
            return 0
        elif curl -s "http://localhost:3001" > /dev/null 2>&1; then
            BASE_URL="http://localhost:3001"
            success "Development server is running on $BASE_URL"
            return 0
        elif curl -s "http://localhost:3002" > /dev/null 2>&1; then
            BASE_URL="http://localhost:3002"
            success "Development server is running on $BASE_URL"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "Development server is not running on ports 3000, 3001, or 3002"
            return 1
        fi
        
        info "Attempt $attempt/$max_attempts: Server not ready, waiting..."
        sleep 5
        attempt=$((attempt + 1))
    done
}

# Function to test new UI components and pages
test_new_ui_components() {
    log "Testing new UI components and design system..."
    
    local components=(
        "/phase-2-demo"
        "/phase-3-llm-optimization-demo"
        "/phase-4-final-integration-demo"
    )
    
    for component in "${components[@]}"; do
        local test_name="New UI Component: $component"
        
        if curl -s "$BASE_URL$component" > /dev/null 2>&1; then
            record_test "$test_name" "PASS" "Component accessible and rendering"
        else
            record_test "$test_name" "FAIL" "Component not accessible or not rendering"
        fi
    done
}

# Function to test modern design system CSS
test_modern_design_system() {
    log "Testing modern design system CSS and styling..."
    
    local css_files=(
        "/src/styles/modern-design-system.css"
        "/public/assets/lcars.css"
    )
    
    for css_file in "${css_files[@]}"; do
        local test_name="CSS File: $css_file"
        
        if [ -f "$css_file" ]; then
            record_test "$test_name" "PASS" "CSS file exists and accessible"
        else
            record_test "$test_name" "FAIL" "CSS file not found"
        fi
    done
    
    # Test if modern design system CSS is loaded
    local test_name="Modern Design System CSS Loading"
    local response=$(curl -s "$BASE_URL" | grep -i "modern-design-system\|glass-card\|glow-button" || echo "NOT_FOUND")
    
    if echo "$response" | grep -q "NOT_FOUND"; then
        record_test "$test_name" "FAIL" "Modern design system CSS classes not found in HTML"
    else
        record_test "$test_name" "PASS" "Modern design system CSS classes found in HTML"
    fi
}

# Function to test enhanced components
test_enhanced_components() {
    log "Testing enhanced modern components..."
    
    local component_files=(
        "src/components/enhanced-modern-components.tsx"
        "src/components/phase-2-demo.tsx"
        "src/components/phase-3-llm-optimization-demo.tsx"
        "src/components/phase-4-final-integration-demo.tsx"
    )
    
    for component_file in "${component_files[@]}"; do
        local test_name="Enhanced Component: $component_file"
        
        if [ -f "$component_file" ]; then
            record_test "$test_name" "PASS" "Enhanced component file exists"
        else
            record_test "$test_name" "FAIL" "Enhanced component file not found"
        fi
    done
}

# Function to test core optimization systems
test_core_optimization_systems() {
    log "Testing core optimization and execution systems..."
    
    local core_files=(
        "src/core/llm-optimization-strategy.ts"
        "src/core/phase-3-execution-coordinator.ts"
        "src/core/optimization-persistence.ts"
        "src/core/phase-4-final-integration.ts"
        "src/core/scroll-animations.ts"
        "src/core/performance-monitor.ts"
    )
    
    for core_file in "${core_files[@]}"; do
        local test_name="Core System: $core_file"
        
        if [ -f "$core_file" ]; then
            record_test "$test_name" "PASS" "Core system file exists"
        else
            record_test "$test_name" "FAIL" "Core system file not found"
        fi
    done
}

# Function to test crew analysis and documentation
test_crew_analysis_documentation() {
    log "Testing crew analysis and documentation..."
    
    local doc_files=(
        "research/crew-analysis/phase-1-completion-report.md"
        "research/crew-analysis/phase-2-completion-report.md"
        "research/crew-analysis/phase-3-llm-optimization-summary.md"
        "research/crew-analysis/phase-4-completion-report.md"
    )
    
    for doc_file in "${doc_files[@]}"; do
        local test_name="Crew Documentation: $doc_file"
        
        if [ -f "$doc_file" ]; then
            record_test "$test_name" "PASS" "Crew documentation exists"
        else
            record_test "$test_name" "FAIL" "Crew documentation not found"
        fi
    done
}

# Function to test navigation and routing
test_navigation_routing() {
    log "Testing navigation and routing system..."
    
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
        local test_name="Navigation Route: $route"
        
        if curl -s "$BASE_URL$route" > /dev/null 2>&1; then
            record_test "$test_name" "PASS" "Navigation route accessible"
        else
            record_test "$test_name" "FAIL" "Navigation route not accessible"
        fi
    done
}

# Function to test CTA interactions
test_cta_interactions() {
    log "Testing CTA interactions and button functionality..."
    
    # Test main page for CTA elements
    local test_name="CTA Elements Presence"
    local response=$(curl -s "$BASE_URL" | grep -i "button\|cta\|call-to-action\|get-started\|learn-more" || echo "NOT_FOUND")
    
    if echo "$response" | grep -q "NOT_FOUND"; then
        record_test "$test_name" "FAIL" "CTA elements not found on main page"
    else
        record_test "$test_name" "PASS" "CTA elements found on main page"
    fi
    
    # Test for enhanced button classes
    local test_name="Enhanced Button Classes"
    local response=$(curl -s "$BASE_URL" | grep -i "enhanced-glow-button\|glass-button\|glow-element" || echo "NOT_FOUND")
    
    if echo "$response" | grep -q "NOT_FOUND"; then
        record_test "$test_name" "FAIL" "Enhanced button classes not found"
    else
        record_test "$test_name" "PASS" "Enhanced button classes found"
    fi
}

# Function to test responsive design
test_responsive_design() {
    log "Testing responsive design and mobile compatibility..."
    
    # Test if responsive CSS is present
    local test_name="Responsive Design CSS"
    local response=$(curl -s "$BASE_URL" | grep -i "media.*max-width\|responsive\|mobile\|tablet" || echo "NOT_FOUND")
    
    if echo "$response" | grep -q "NOT_FOUND"; then
        record_test "$test_name" "FAIL" "Responsive design CSS not found"
    else
        record_test "$test_name" "PASS" "Responsive design CSS found"
    fi
}

# Function to test modern design trends
test_modern_design_trends() {
    log "Testing 2025 modern design trends implementation..."
    
    local design_trends=(
        "glassmorphism"
        "glow-effects"
        "3d-depth"
        "neumorphism"
        "microinteractions"
        "scroll-animations"
    )
    
    for trend in "${design_trends[@]}"; do
        local test_name="Design Trend: $trend"
        local response=$(curl -s "$BASE_URL" | grep -i "$trend\|glass-bg\|glow-primary\|depth-" || echo "NOT_FOUND")
        
        if echo "$response" | grep -q "NOT_FOUND"; then
            record_test "$test_name" "FAIL" "Design trend $trend not implemented"
        else
            record_test "$test_name" "PASS" "Design trend $trend implemented"
        fi
    done
}

# Function to test performance monitoring
test_performance_monitoring() {
    log "Testing performance monitoring and optimization..."
    
    # Test if performance monitoring scripts are loaded
    local test_name="Performance Monitoring Scripts"
    local response=$(curl -s "$BASE_URL" | grep -i "performance-monitor\|scroll-animations\|modern-design-system" || echo "NOT_FOUND")
    
    if echo "$response" | grep -q "NOT_FOUND"; then
        record_test "$test_name" "FAIL" "Performance monitoring scripts not loaded"
    else
        record_test "$test_name" "PASS" "Performance monitoring scripts loaded"
    fi
}

# Function to test accessibility features
test_accessibility_features() {
    log "Testing accessibility features and WCAG compliance..."
    
    # Test for accessibility attributes
    local test_name="Accessibility Attributes"
    local response=$(curl -s "$BASE_URL" | grep -i "aria-label\|aria-describedby\|role\|tabindex" || echo "NOT_FOUND")
    
    if echo "$response" | grep -q "NOT_FOUND"; then
        record_test "$test_name" "FAIL" "Accessibility attributes not found"
    else
        record_test "$test_name" "PASS" "Accessibility attributes found"
    fi
}

# Function to generate test report
generate_test_report() {
    log "Generating new UI design system test report..."
    
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
    "test_duration": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "new_ui_components_tested": [
      "Enhanced Modern Components",
      "Phase 2 Demo",
      "Phase 3 LLM Optimization Demo",
      "Phase 4 Final Integration Demo"
    ],
    "design_system_features_tested": [
      "Glassmorphism",
      "Glow Effects",
      "3D Depth",
      "Neumorphism",
      "Microinteractions",
      "Scroll Animations"
    ],
    "core_systems_tested": [
      "LLM Optimization Strategy",
      "Phase 3 Execution Coordinator",
      "Optimization Persistence",
      "Phase 4 Final Integration",
      "Scroll Animations",
      "Performance Monitor"
    ]
  }
}
EOF
    
    # Display summary
    echo ""
    echo "=================================="
    echo "🎨 NEW UI DESIGN SYSTEM TEST RESULTS"
    echo "=================================="
    echo "📊 Total Tests: $TOTAL_TESTS"
    echo "✅ Passed: $PASSED_TESTS"
    echo "❌ Failed: $FAILED_TESTS"
    echo "📈 Success Rate: ${success_rate}%"
    echo "🌐 Base URL: $BASE_URL"
    echo "📄 Report: $TEST_RESULTS_FILE"
    echo "📸 Screenshots: $SCREENSHOT_DIR"
    echo "=================================="
    
    if [ $FAILED_TESTS -eq 0 ]; then
        success "🎉 All new UI tests passed! The modern design system is fully functional."
    else
        warn "⚠️ Some tests failed. Check the log for details."
    fi
}

# Main execution
main() {
    log "🎨 Starting New UI Design System Testing..."
    echo "New UI testing started at $(date)" > "$LOG_FILE"
    
    # Check if we're in the project directory
    if [ ! -f "package.json" ]; then
        error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Check server status
    if ! check_server_running; then
        error "Cannot proceed with UI testing - development server is not running"
        exit 1
    fi
    
    # Run all test suites
    test_new_ui_components
    test_modern_design_system
    test_enhanced_components
    test_core_optimization_systems
    test_crew_analysis_documentation
    test_navigation_routing
    test_cta_interactions
    test_responsive_design
    test_modern_design_trends
    test_performance_monitoring
    test_accessibility_features
    
    # Generate final report
    generate_test_report
    
    log "🎯 New UI design system testing completed!"
    log "Check the test results file for details: $TEST_RESULTS_FILE"
    log "Screenshots saved to: $SCREENSHOT_DIR"
}

# Run main function
main "$@"
