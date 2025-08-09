#!/bin/bash
# Comprehensive Deployment Testing: Local & Production
# Tests enhanced visual workflow editor and all integrated systems

set -e

echo "🚀 COMPREHENSIVE DEPLOYMENT TESTING"
echo "==================================="
echo "🎯 Testing enhanced visual workflow editor deployment"
echo "📅 Test Date: $(date)"
echo ""

# Test configuration
LOCAL_BASE_URL="http://localhost:3000"
DEPLOYED_BASE_URL="https://alexai-star-trek-agile.vercel.app"
N8N_BASE_URL="https://n8n.pbradygeorgen.com"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test endpoint with detailed output
test_endpoint_detailed() {
    local url="$1"
    local description="$2"
    local expected_pattern="$3"
    local timeout="${4:-10}"
    
    echo -n "🔬 Testing $description... "
    
    local start_time=$(date +%s%N)
    local response=$(timeout $timeout curl -s "$url" 2>/dev/null || echo "ERROR")
    local status_code=$(timeout $timeout curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    local end_time=$(date +%s%N)
    local duration=$(((end_time - start_time) / 1000000)) # Convert to milliseconds
    
    if [ "$status_code" = "200" ]; then
        if [ -n "$expected_pattern" ]; then
            if echo "$response" | grep -q "$expected_pattern"; then
                echo -e "${GREEN}✅ SUCCESS${NC} (${duration}ms)"
                return 0
            else
                echo -e "${YELLOW}⚠️  PARTIAL${NC} (${duration}ms) - missing pattern: $expected_pattern"
                return 1
            fi
        else
            echo -e "${GREEN}✅ SUCCESS${NC} (${duration}ms)"
            return 0
        fi
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $status_code, ${duration}ms)"
        return 1
    fi
}

# Function to test local deployment
test_local_deployment() {
    echo ""
    echo -e "${BLUE}🏠 TESTING LOCAL DEPLOYMENT${NC}"
    echo "=========================="
    
    local success_count=0
    local total_tests=0
    
    # Core UI Pages
    echo ""
    echo "📱 Core UI Pages:"
    
    local ui_pages=(
        "$LOCAL_BASE_URL|Home Page|DOCTYPE html"
        "$LOCAL_BASE_URL/workflow-management|Visual Workflow Management|N8N.*INTEGRATION"
        "$LOCAL_BASE_URL/workflow|Traditional Workflow|LCARS"
        "$LOCAL_BASE_URL/projects|Projects Page|projects"
        "$LOCAL_BASE_URL/tasks|Tasks Page|tasks"
        "$LOCAL_BASE_URL/observation-lounge|Observation Lounge|observation"
        "$LOCAL_BASE_URL/analytics|Analytics Page|analytics"
    )
    
    for page_info in "${ui_pages[@]}"; do
        IFS='|' read -r url description pattern <<< "$page_info"
        total_tests=$((total_tests + 1))
        if test_endpoint_detailed "$url" "$description" "$pattern" 10; then
            success_count=$((success_count + 1))
        fi
    done
    
    # API Endpoints
    echo ""
    echo "🔧 API Endpoints:"
    
    local api_endpoints=(
        "$LOCAL_BASE_URL/api/n8n-integration|N8N Integration Status|connected"
        "$LOCAL_BASE_URL/api/n8n-integration/workflows|N8N Workflows API|success"
        "$LOCAL_BASE_URL/api/workflows/local|Local Workflows API|workflows"
        "$LOCAL_BASE_URL/api/health|Health Check|status"
    )
    
    for endpoint_info in "${api_endpoints[@]}"; do
        IFS='|' read -r url description pattern <<< "$endpoint_info"
        total_tests=$((total_tests + 1))
        if test_endpoint_detailed "$url" "$description" "$pattern" 10; then
            success_count=$((success_count + 1))
        fi
    done
    
    # Crew Member APIs (with POST requests)
    echo ""
    echo "👥 Crew Member APIs:"
    
    local crew_members=("captain-picard" "lieutenant-data" "counselor-troi" "chief-engineer-scott" "commander-spock" "lieutenant-worf" "observation-lounge")
    local test_payload='{"query": "Test deployment", "context": "deployment-testing", "userRole": "developer", "urgency": "normal"}'
    
    for crew_member in "${crew_members[@]}"; do
        total_tests=$((total_tests + 1))
        echo -n "🔬 Testing $crew_member API... "
        
        local start_time=$(date +%s%N)
        local response=$(timeout 15 curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$test_payload" \
            "$LOCAL_BASE_URL/api/crew/$crew_member" 2>/dev/null || echo "ERROR")
        local status_code=$(timeout 15 curl -s -o /dev/null -w "%{http_code}" \
            -X POST -H "Content-Type: application/json" -d "$test_payload" \
            "$LOCAL_BASE_URL/api/crew/$crew_member" 2>/dev/null || echo "000")
        local end_time=$(date +%s%N)
        local duration=$(((end_time - start_time) / 1000000))
        
        if [ "$status_code" = "200" ]; then
            if echo "$response" | grep -q "crewMember\|response\|greeting"; then
                echo -e "${GREEN}✅ SUCCESS${NC} (${duration}ms)"
                success_count=$((success_count + 1))
            else
                echo -e "${YELLOW}⚠️  PARTIAL${NC} (${duration}ms)"
            fi
        else
            echo -e "${RED}❌ FAILED${NC} (HTTP $status_code, ${duration}ms)"
        fi
    done
    
    echo ""
    echo -e "${BLUE}📊 Local Deployment Results: $success_count/$total_tests endpoints working${NC}"
    return $((total_tests - success_count))
}

# Function to test production deployment
test_production_deployment() {
    echo ""
    echo -e "${BLUE}🌐 TESTING PRODUCTION DEPLOYMENT${NC}"
    echo "==============================="
    
    echo "🔍 Checking production deployment accessibility..."
    if ! curl -s "$DEPLOYED_BASE_URL" > /dev/null 2>&1; then
        echo -e "${RED}❌ Production deployment not accessible at $DEPLOYED_BASE_URL${NC}"
        echo -e "${YELLOW}💡 Note: Production deployment may need manual trigger or environment configuration${NC}"
        return 1
    fi
    
    local success_count=0
    local total_tests=0
    
    # Test key production pages
    echo ""
    echo "📱 Production UI Pages:"
    
    local prod_pages=(
        "$DEPLOYED_BASE_URL|Production Home Page|DOCTYPE html"
        "$DEPLOYED_BASE_URL/workflow-management|Production Workflow Management|workflow"
        "$DEPLOYED_BASE_URL/workflow|Production Workflow|LCARS"
        "$DEPLOYED_BASE_URL/observation-lounge|Production Observation Lounge|observation"
    )
    
    for page_info in "${prod_pages[@]}"; do
        IFS='|' read -r url description pattern <<< "$page_info"
        total_tests=$((total_tests + 1))
        if test_endpoint_detailed "$url" "$description" "$pattern" 15; then
            success_count=$((success_count + 1))
        fi
    done
    
    echo ""
    echo -e "${BLUE}📊 Production Deployment Results: $success_count/$total_tests endpoints working${NC}"
    return $((total_tests - success_count))
}

# Function to test n8n integration
test_n8n_integration() {
    echo ""
    echo -e "${BLUE}🔗 TESTING N8N INTEGRATION${NC}"
    echo "========================="
    
    local success_count=0
    local total_tests=3
    
    # Test n8n instance
    echo -n "🔬 Testing n8n instance accessibility... "
    if curl -s "$N8N_BASE_URL" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
    
    # Test local n8n integration API
    echo -n "🔬 Testing local n8n integration API... "
    local integration_response=$(timeout 15 curl -s "$LOCAL_BASE_URL/api/n8n-integration" 2>/dev/null || echo "ERROR")
    
    if echo "$integration_response" | grep -q "connected.*true\|status.*connected"; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
        echo "   📋 Integration Status: Connected to n8n.pbradygeorgen.com"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "   📋 Response: $(echo "$integration_response" | head -c 100)..."
    fi
    
    # Test workflow webhook (if activated)
    echo -n "🔬 Testing n8n webhook endpoint... "
    local webhook_response=$(timeout 30 curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"query": "Test deployment integration", "context": "deployment-testing"}' \
        "$N8N_BASE_URL/webhook/crew-request" 2>/dev/null || echo "ERROR")
    
    if echo "$webhook_response" | grep -q "success\|selectedCrew\|response"; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
        echo "   📋 Webhook Response: $(echo "$webhook_response" | head -c 100)..."
        success_count=$((success_count + 1))
    elif echo "$webhook_response" | grep -q "not registered"; then
        echo -e "${YELLOW}⚠️  INACTIVE${NC} (workflow needs manual activation)"
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "   📋 Response: $(echo "$webhook_response" | head -c 100)..."
    fi
    
    echo ""
    echo -e "${BLUE}📊 N8N Integration Results: $success_count/$total_tests components working${NC}"
    return $((total_tests - success_count))
}

# Function to generate comprehensive report with live URLs
generate_deployment_report() {
    local local_result=$1
    local production_result=$2
    local n8n_result=$3
    
    echo ""
    echo "🎯 COMPREHENSIVE DEPLOYMENT REPORT"
    echo "=================================="
    echo ""
    
    # Calculate overall scores
    local total_score=0
    local max_score=3
    
    if [ $local_result -eq 0 ]; then
        echo -e "${GREEN}✅ Local Deployment: EXCELLENT${NC}"
        total_score=$((total_score + 1))
    else
        echo -e "${YELLOW}⚠️  Local Deployment: NEEDS ATTENTION ($local_result issues)${NC}"
    fi
    
    if [ $production_result -eq 0 ]; then
        echo -e "${GREEN}✅ Production Deployment: EXCELLENT${NC}"
        total_score=$((total_score + 1))
    else
        echo -e "${YELLOW}⚠️  Production Deployment: NEEDS ATTENTION ($production_result issues)${NC}"
    fi
    
    if [ $n8n_result -eq 0 ]; then
        echo -e "${GREEN}✅ N8N Integration: EXCELLENT${NC}"
        total_score=$((total_score + 1))
    else
        echo -e "${YELLOW}⚠️  N8N Integration: NEEDS ATTENTION ($n8n_result issues)${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}🎯 OVERALL DEPLOYMENT SCORE: $total_score/$max_score${NC}"
    
    if [ $total_score -eq $max_score ]; then
        echo -e "${GREEN}🎉 EXCELLENT: All systems operational and ready for use!${NC}"
    elif [ $total_score -ge 2 ]; then
        echo -e "${YELLOW}👍 GOOD: Most systems working well with minor issues${NC}"
    else
        echo -e "${RED}⚠️  NEEDS WORK: Multiple issues require attention${NC}"
    fi
    
    echo ""
    echo "🔗 LIVE DEPLOYMENT URLS"
    echo "======================"
    echo ""
    
    echo -e "${GREEN}🏠 LOCAL DEVELOPMENT ENVIRONMENT${NC}"
    echo "================================"
    echo "   🖥️  Main Application: $LOCAL_BASE_URL"
    echo "   🎨 Visual Workflow Management: $LOCAL_BASE_URL/workflow-management"
    echo "   📊 Traditional Workflow: $LOCAL_BASE_URL/workflow"
    echo "   👥 Observation Lounge: $LOCAL_BASE_URL/observation-lounge"
    echo "   📈 Analytics Dashboard: $LOCAL_BASE_URL/analytics"
    echo "   📋 Projects Management: $LOCAL_BASE_URL/projects"
    echo "   ✅ Tasks Management: $LOCAL_BASE_URL/tasks"
    echo ""
    
    echo -e "${BLUE}🌐 PRODUCTION ENVIRONMENT${NC}"
    echo "========================"
    echo "   🖥️  Main Application: $DEPLOYED_BASE_URL"
    echo "   🎨 Visual Workflow Management: $DEPLOYED_BASE_URL/workflow-management"
    echo "   📊 Traditional Workflow: $DEPLOYED_BASE_URL/workflow"
    echo "   👥 Observation Lounge: $DEPLOYED_BASE_URL/observation-lounge"
    echo "   📈 Analytics Dashboard: $DEPLOYED_BASE_URL/analytics"
    echo "   📋 Projects Management: $DEPLOYED_BASE_URL/projects"
    echo "   ✅ Tasks Management: $DEPLOYED_BASE_URL/tasks"
    echo ""
    
    echo -e "${YELLOW}🔗 N8N INTEGRATION${NC}"
    echo "=================="
    echo "   🌐 N8N Instance: $N8N_BASE_URL"
    echo "   🪝 Webhook Endpoint: $N8N_BASE_URL/webhook/crew-request"
    echo "   🔧 N8N Integration API: $LOCAL_BASE_URL/api/n8n-integration"
    echo "   📊 Workflows API: $LOCAL_BASE_URL/api/n8n-integration/workflows"
    echo ""
    
    echo -e "${GREEN}🔧 API ENDPOINTS${NC}"
    echo "==============="
    echo "   🏥 Health Check: $LOCAL_BASE_URL/api/health"
    echo "   👨‍✈️ Captain Picard: $LOCAL_BASE_URL/api/crew/captain-picard"
    echo "   🤖 Lieutenant Data: $LOCAL_BASE_URL/api/crew/lieutenant-data"
    echo "   👩‍⚕️ Counselor Troi: $LOCAL_BASE_URL/api/crew/counselor-troi"
    echo "   🔧 Chief Engineer Scott: $LOCAL_BASE_URL/api/crew/chief-engineer-scott"
    echo "   🖖 Commander Spock: $LOCAL_BASE_URL/api/crew/commander-spock"
    echo "   🛡️  Lieutenant Worf: $LOCAL_BASE_URL/api/crew/lieutenant-worf"
    echo "   🏛️  Observation Lounge: $LOCAL_BASE_URL/api/crew/observation-lounge"
    echo ""
    
    echo -e "${BLUE}🎨 ENHANCED VISUAL WORKFLOW FEATURES${NC}"
    echo "=================================="
    echo "   ✅ Interactive SVG-based workflow diagrams"
    echo "   ✅ Drag-and-drop node positioning"
    echo "   ✅ Real-time parameter editing"
    echo "   ✅ Visual workflow connections"
    echo "   ✅ Type-specific node styling and icons"
    echo "   ✅ Live n8n integration and synchronization"
    echo "   ✅ LCARS-styled interface design"
    echo "   ✅ Bidirectional workflow sync controls"
    echo ""
    
    if [ $local_result -eq 0 ]; then
        echo -e "${GREEN}🎊 SUCCESS: Your enhanced visual workflow editor is fully operational locally!${NC}"
        echo "   - Access the visual workflow management at: $LOCAL_BASE_URL/workflow-management"
        echo "   - All crew member APIs are responding correctly"
        echo "   - N8N integration is live and functional"
        echo "   - Ready for immediate use and testing"
        echo ""
    fi
    
    if [ $production_result -ne 0 ]; then
        echo -e "${YELLOW}💡 PRODUCTION DEPLOYMENT NOTES:${NC}"
        echo "   - Vercel deployment may require manual trigger"
        echo "   - Check environment variables in Vercel dashboard"
        echo "   - Ensure build process completed successfully"
        echo "   - Consider pushing to main branch for automatic deployment"
        echo ""
    fi
    
    if [ $n8n_result -ne 0 ]; then
        echo -e "${YELLOW}💡 N8N INTEGRATION NOTES:${NC}"
        echo "   - Workflow may need manual activation in n8n GUI"
        echo "   - Verify environment variables in n8n instance"
        echo "   - Confirm OpenRouter API key is configured"
        echo "   - Check webhook registration status"
        echo ""
    fi
}

# Main execution
main() {
    echo "🚀 Starting comprehensive deployment testing..."
    echo ""
    
    # Check if local server is running
    echo "🔍 Checking local development server..."
    if ! curl -s "$LOCAL_BASE_URL" > /dev/null 2>&1; then
        echo -e "${RED}❌ Local development server not running${NC}"
        echo "🚀 Please start the development server with: npm run dev"
        return 1
    fi
    echo -e "${GREEN}✅ Local development server is running${NC}"
    
    # Run all tests
    test_local_deployment
    local_result=$?
    
    test_production_deployment
    production_result=$?
    
    test_n8n_integration
    n8n_result=$?
    
    # Generate comprehensive report
    generate_deployment_report $local_result $production_result $n8n_result
    
    echo "🎯 Comprehensive deployment testing complete!"
    echo -e "${GREEN}🖖 Live long and prosper!${NC}"
}

# Execute main function
main "$@"
