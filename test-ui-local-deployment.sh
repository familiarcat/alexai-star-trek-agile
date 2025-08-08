#!/bin/bash
# Comprehensive UI Testing: Local Development & Production Deployment
# Tests integrated n8n GUI, workflow management, and all crew endpoints

set -e

echo "🧪 COMPREHENSIVE UI TESTING: LOCAL & DEPLOYMENT"
echo "==============================================="
echo "🎯 Testing integrated n8n GUI and workflow systems"
echo "📅 Test Date: $(date)"
echo ""

# Test configuration
LOCAL_BASE_URL="http://localhost:3000"
DEPLOYED_BASE_URL="https://alexai-star-trek-agile.vercel.app"
N8N_BASE_URL="https://n8n.pbradygeorgen.com"

# Function to test HTTP endpoint
test_endpoint() {
    local url="$1"
    local description="$2"
    local expected_pattern="$3"
    local timeout="${4:-10}"
    
    echo -n "🔬 Testing $description... "
    
    local response=$(timeout $timeout curl -s "$url" 2>/dev/null || echo "ERROR")
    local status_code=$(timeout $timeout curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$status_code" = "200" ]; then
        if [ -n "$expected_pattern" ]; then
            if echo "$response" | grep -q "$expected_pattern"; then
                echo "✅ SUCCESS"
                return 0
            else
                echo "⚠️  PARTIAL (missing pattern: $expected_pattern)"
                return 1
            fi
        else
            echo "✅ SUCCESS"
            return 0
        fi
    else
        echo "❌ FAILED (HTTP $status_code)"
        return 1
    fi
}

# Function to test API endpoint with JSON
test_api_endpoint() {
    local url="$1"
    local description="$2"
    local payload="$3"
    local expected_field="$4"
    local timeout="${5:-15}"
    
    echo -n "🔬 Testing $description... "
    
    local response=$(timeout $timeout curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "$url" 2>/dev/null || echo "ERROR")
    
    local status_code=$(timeout $timeout curl -s -o /dev/null -w "%{http_code}" \
        -X POST -H "Content-Type: application/json" -d "$payload" "$url" 2>/dev/null || echo "000")
    
    if [ "$status_code" = "200" ]; then
        if [ -n "$expected_field" ]; then
            if echo "$response" | grep -q "$expected_field"; then
                echo "✅ SUCCESS"
                echo "   📋 Response: $(echo "$response" | head -c 100)..."
                return 0
            else
                echo "⚠️  PARTIAL (missing field: $expected_field)"
                echo "   📋 Response: $(echo "$response" | head -c 100)..."
                return 1
            fi
        else
            echo "✅ SUCCESS"
            return 0
        fi
    else
        echo "❌ FAILED (HTTP $status_code)"
        if [ "$response" != "ERROR" ]; then
            echo "   📋 Response: $(echo "$response" | head -c 100)..."
        fi
        return 1
    fi
}

# Function to check if local dev server is running
check_local_server() {
    echo "🏠 Checking local development server..."
    
    if curl -s "$LOCAL_BASE_URL" > /dev/null 2>&1; then
        echo "✅ Local server is running on $LOCAL_BASE_URL"
        return 0
    else
        echo "❌ Local server not running. Starting development server..."
        
        # Kill any existing processes on port 3000
        pkill -f "next dev" 2>/dev/null || true
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        
        # Clean and start
        rm -rf .next 2>/dev/null || true
        
        # Start development server in background
        echo "🚀 Starting npm run dev..."
        npm run dev > /dev/null 2>&1 &
        
        # Wait for server to start
        echo -n "⏳ Waiting for server to start"
        for i in {1..30}; do
            if curl -s "$LOCAL_BASE_URL" > /dev/null 2>&1; then
                echo " ✅ Ready!"
                return 0
            fi
            echo -n "."
            sleep 2
        done
        
        echo " ❌ Failed to start local server"
        return 1
    fi
}

# Function to test local UI pages
test_local_ui() {
    echo ""
    echo "🏠 TESTING LOCAL UI PAGES"
    echo "========================="
    
    local success_count=0
    local total_tests=0
    
    # Main pages
    local pages=(
        "$LOCAL_BASE_URL|Home Page|DOCTYPE html"
        "$LOCAL_BASE_URL/workflow|Workflow Page|LCARS"
        "$LOCAL_BASE_URL/workflow-management|Workflow Management|N8N INTEGRATION"
        "$LOCAL_BASE_URL/projects|Projects Page|projects"
        "$LOCAL_BASE_URL/tasks|Tasks Page|tasks"
        "$LOCAL_BASE_URL/observation-lounge|Observation Lounge|observation"
        "$LOCAL_BASE_URL/analytics|Analytics Page|analytics"
    )
    
    for page_info in "${pages[@]}"; do
        IFS='|' read -r url description pattern <<< "$page_info"
        total_tests=$((total_tests + 1))
        if test_endpoint "$url" "$description" "$pattern" 10; then
            success_count=$((success_count + 1))
        fi
    done
    
    echo ""
    echo "📊 Local UI Test Results: $success_count/$total_tests pages working"
    return $((total_tests - success_count))
}

# Function to test local API endpoints
test_local_api() {
    echo ""
    echo "🔧 TESTING LOCAL API ENDPOINTS"
    echo "==============================="
    
    local success_count=0
    local total_tests=0
    
    # Test crew member endpoints
    local crew_endpoints=(
        "captain-picard|Captain Picard|crewMember"
        "lieutenant-data|Lieutenant Data|crewMember"
        "counselor-troi|Counselor Troi|crewMember"
        "chief-engineer-scott|Chief Engineer Scott|crewMember"
        "commander-spock|Commander Spock|crewMember"
        "lieutenant-worf|Lieutenant Worf|crewMember"
        "observation-lounge|Observation Lounge|response"
    )
    
    local test_payload='{"query": "Test crew member", "context": "ui-testing", "userRole": "developer"}'
    
    for endpoint_info in "${crew_endpoints[@]}"; do
        IFS='|' read -r endpoint description expected <<< "$endpoint_info"
        total_tests=$((total_tests + 1))
        if test_api_endpoint "$LOCAL_BASE_URL/api/crew/$endpoint" "$description API" "$test_payload" "$expected" 15; then
            success_count=$((success_count + 1))
        fi
    done
    
    # Test n8n integration endpoints
    total_tests=$((total_tests + 1))
    if test_endpoint "$LOCAL_BASE_URL/api/n8n-integration" "N8N Integration Status" "connected" 10; then
        success_count=$((success_count + 1))
    fi
    
    total_tests=$((total_tests + 1))
    if test_endpoint "$LOCAL_BASE_URL/api/n8n-integration/workflows" "N8N Workflows API" "workflows" 10; then
        success_count=$((success_count + 1))
    fi
    
    echo ""
    echo "📊 Local API Test Results: $success_count/$total_tests endpoints working"
    return $((total_tests - success_count))
}

# Function to test deployed UI
test_deployed_ui() {
    echo ""
    echo "🌐 TESTING DEPLOYED UI (VERCEL)"
    echo "==============================="
    
    local success_count=0
    local total_tests=0
    
    # Test if deployment is accessible
    echo "🔍 Checking deployment accessibility..."
    if ! curl -s "$DEPLOYED_BASE_URL" > /dev/null 2>&1; then
        echo "❌ Deployed site not accessible at $DEPLOYED_BASE_URL"
        echo "💡 This may indicate the deployment needs to be triggered"
        return 1
    fi
    
    # Main pages
    local pages=(
        "$DEPLOYED_BASE_URL|Deployed Home Page|DOCTYPE html"
        "$DEPLOYED_BASE_URL/workflow|Deployed Workflow Page|LCARS"
        "$DEPLOYED_BASE_URL/workflow-management|Deployed Workflow Management|N8N"
        "$DEPLOYED_BASE_URL/projects|Deployed Projects Page|projects"
        "$DEPLOYED_BASE_URL/observation-lounge|Deployed Observation Lounge|observation"
    )
    
    for page_info in "${pages[@]}"; do
        IFS='|' read -r url description pattern <<< "$page_info"
        total_tests=$((total_tests + 1))
        if test_endpoint "$url" "$description" "$pattern" 15; then
            success_count=$((success_count + 1))
        fi
    done
    
    echo ""
    echo "📊 Deployed UI Test Results: $success_count/$total_tests pages working"
    return $((total_tests - success_count))
}

# Function to test n8n integration
test_n8n_integration() {
    echo ""
    echo "🔗 TESTING N8N INTEGRATION"
    echo "=========================="
    
    local success_count=0
    local total_tests=3
    
    # Test n8n instance accessibility
    echo -n "🔬 Testing n8n instance accessibility... "
    if curl -s "$N8N_BASE_URL" > /dev/null 2>&1; then
        echo "✅ SUCCESS"
        success_count=$((success_count + 1))
    else
        echo "❌ FAILED"
    fi
    
    # Test workflow webhook (if activated)
    echo -n "🔬 Testing n8n webhook endpoint... "
    local webhook_response=$(timeout 30 curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"query": "Test webhook", "context": "ui-testing"}' \
        "$N8N_BASE_URL/webhook/crew-request" 2>/dev/null || echo "ERROR")
    
    if echo "$webhook_response" | grep -q "success\|selectedCrew\|response"; then
        echo "✅ SUCCESS"
        echo "   📋 Response: $(echo "$webhook_response" | head -c 100)..."
        success_count=$((success_count + 1))
    elif echo "$webhook_response" | grep -q "not registered"; then
        echo "⚠️  INACTIVE (workflow needs manual activation)"
    else
        echo "❌ FAILED"
        echo "   📋 Response: $(echo "$webhook_response" | head -c 100)..."
    fi
    
    # Test local n8n integration API
    echo -n "🔬 Testing local n8n integration API... "
    local integration_response=$(timeout 15 curl -s "$LOCAL_BASE_URL/api/n8n-integration" 2>/dev/null || echo "ERROR")
    
    if echo "$integration_response" | grep -q "connected\|status"; then
        echo "✅ SUCCESS"
        success_count=$((success_count + 1))
    else
        echo "❌ FAILED"
    fi
    
    echo ""
    echo "📊 N8N Integration Test Results: $success_count/$total_tests components working"
    return $((total_tests - success_count))
}

# Function to generate comprehensive test report
generate_test_report() {
    local local_ui_result=$1
    local local_api_result=$2
    local deployed_ui_result=$3
    local n8n_integration_result=$4
    
    echo ""
    echo "📊 COMPREHENSIVE TEST REPORT"
    echo "============================"
    echo ""
    
    # Calculate overall scores
    local total_score=0
    local max_score=4
    
    if [ $local_ui_result -eq 0 ]; then
        echo "✅ Local UI: EXCELLENT"
        total_score=$((total_score + 1))
    else
        echo "⚠️  Local UI: NEEDS ATTENTION ($local_ui_result issues)"
    fi
    
    if [ $local_api_result -eq 0 ]; then
        echo "✅ Local API: EXCELLENT"
        total_score=$((total_score + 1))
    else
        echo "⚠️  Local API: NEEDS ATTENTION ($local_api_result issues)"
    fi
    
    if [ $deployed_ui_result -eq 0 ]; then
        echo "✅ Deployed UI: EXCELLENT"
        total_score=$((total_score + 1))
    else
        echo "⚠️  Deployed UI: NEEDS ATTENTION ($deployed_ui_result issues)"
    fi
    
    if [ $n8n_integration_result -eq 0 ]; then
        echo "✅ N8N Integration: EXCELLENT"
        total_score=$((total_score + 1))
    else
        echo "⚠️  N8N Integration: NEEDS ATTENTION ($n8n_integration_result issues)"
    fi
    
    echo ""
    echo "🎯 OVERALL SCORE: $total_score/$max_score"
    
    if [ $total_score -eq $max_score ]; then
        echo "🎉 EXCELLENT: All systems operational!"
    elif [ $total_score -ge 3 ]; then
        echo "👍 GOOD: Most systems working well"
    elif [ $total_score -ge 2 ]; then
        echo "⚠️  FAIR: Some issues need attention"
    else
        echo "❌ POOR: Multiple issues require immediate attention"
    fi
    
    echo ""
    echo "🔗 Quick Access Links:"
    echo "   Local Dev: $LOCAL_BASE_URL"
    echo "   Workflow GUI: $LOCAL_BASE_URL/workflow-management"
    echo "   Deployed: $DEPLOYED_BASE_URL"
    echo "   N8N Instance: $N8N_BASE_URL"
    echo ""
    
    if [ $deployed_ui_result -ne 0 ]; then
        echo "💡 Deployment Issues:"
        echo "   - Consider triggering Vercel deployment"
        echo "   - Check environment variables in Vercel dashboard"
        echo "   - Verify build process completed successfully"
        echo ""
    fi
    
    if [ $n8n_integration_result -ne 0 ]; then
        echo "💡 N8N Integration Issues:"
        echo "   - Check if workflow is manually activated in n8n GUI"
        echo "   - Verify environment variables in n8n instance"
        echo "   - Confirm OpenRouter API key is configured"
        echo ""
    fi
}

# Main execution
main() {
    echo "🚀 Starting comprehensive UI testing..."
    echo ""
    
    # Ensure local server is running
    if ! check_local_server; then
        echo "❌ Cannot proceed without local server"
        exit 1
    fi
    
    # Run all tests
    test_local_ui
    local_ui_result=$?
    
    test_local_api  
    local_api_result=$?
    
    test_deployed_ui
    deployed_ui_result=$?
    
    test_n8n_integration
    n8n_integration_result=$?
    
    # Generate comprehensive report
    generate_test_report $local_ui_result $local_api_result $deployed_ui_result $n8n_integration_result
    
    echo "🎯 Testing complete! Check the report above for detailed results."
    echo "🖖 Live long and prosper!"
}

# Execute main function
main "$@"
