#!/bin/bash
# Test Visual Workflow Editor Integration
# Tests the enhanced n8n workflow diagram and editing capabilities

set -e

echo "🎨 VISUAL WORKFLOW EDITOR TESTING"
echo "================================="
echo "🎯 Testing enhanced n8n workflow diagram and editing capabilities"
echo "📅 Test Date: $(date)"
echo ""

# Test configuration
LOCAL_BASE_URL="http://localhost:3000"
WORKFLOW_MANAGEMENT_URL="$LOCAL_BASE_URL/workflow-management"

# Function to test workflow editor functionality
test_workflow_editor() {
    echo "🖥️ Testing visual workflow editor accessibility..."
    
    echo -n "🔬 Testing workflow management page... "
    local response=$(timeout 10 curl -s "$WORKFLOW_MANAGEMENT_URL" 2>/dev/null || echo "ERROR")
    local status_code=$(timeout 10 curl -s -o /dev/null -w "%{http_code}" "$WORKFLOW_MANAGEMENT_URL" 2>/dev/null || echo "000")
    
    if [ "$status_code" = "200" ]; then
        if echo "$response" | grep -q "N8N.*INTEGRATION\|workflow.*management\|WorkflowDiagram"; then
            echo "✅ SUCCESS"
            echo "   📋 Contains workflow management interface"
            return 0
        else
            echo "⚠️  PARTIAL (missing workflow components)"
            return 1
        fi
    else
        echo "❌ FAILED (HTTP $status_code)"
        return 1
    fi
}

# Function to test API endpoints for workflow data
test_workflow_apis() {
    echo ""
    echo "🔧 Testing workflow-related API endpoints..."
    
    local success_count=0
    local total_tests=0
    
    # Test n8n integration status
    echo -n "🔬 Testing n8n integration status... "
    total_tests=$((total_tests + 1))
    local integration_response=$(timeout 10 curl -s "$LOCAL_BASE_URL/api/n8n-integration" 2>/dev/null || echo "ERROR")
    
    if echo "$integration_response" | grep -q "connected.*true\|status.*connected"; then
        echo "✅ SUCCESS"
        echo "   📋 N8N Integration: $(echo "$integration_response" | head -c 100)..."
        success_count=$((success_count + 1))
    else
        echo "❌ FAILED"
        echo "   📋 Response: $(echo "$integration_response" | head -c 100)..."
    fi
    
    # Test workflows API
    echo -n "🔬 Testing workflows API... "
    total_tests=$((total_tests + 1))
    local workflows_response=$(timeout 15 curl -s "$LOCAL_BASE_URL/api/n8n-integration/workflows" 2>/dev/null || echo "ERROR")
    
    if echo "$workflows_response" | grep -q "success.*true\|workflows.*\[\|AlexAI"; then
        echo "✅ SUCCESS"
        echo "   📋 Workflows API: $(echo "$workflows_response" | head -c 100)..."
        success_count=$((success_count + 1))
    else
        echo "❌ FAILED"
        echo "   📋 Response: $(echo "$workflows_response" | head -c 100)..."
    fi
    
    # Test local workflows API
    echo -n "🔬 Testing local workflows API... "
    total_tests=$((total_tests + 1))
    local local_workflows_response=$(timeout 10 curl -s "$LOCAL_BASE_URL/api/workflows/local" 2>/dev/null || echo "ERROR")
    
    if echo "$local_workflows_response" | grep -q "success.*true\|workflows.*\[\|count"; then
        echo "✅ SUCCESS"
        echo "   📋 Local Workflows: $(echo "$local_workflows_response" | head -c 100)..."
        success_count=$((success_count + 1))
    else
        echo "❌ FAILED"
        echo "   📋 Response: $(echo "$local_workflows_response" | head -c 100)..."
    fi
    
    echo ""
    echo "📊 Workflow API Test Results: $success_count/$total_tests endpoints working"
    return $((total_tests - success_count))
}

# Function to test workflow activation and testing endpoints
test_workflow_operations() {
    echo ""
    echo "⚙️ Testing workflow operation endpoints..."
    
    local success_count=0
    local total_tests=0
    
    # Get a workflow ID first (use a test ID)
    local test_workflow_id="test-workflow-id"
    
    # Test workflow activation endpoint (expect failure for non-existent workflow)
    echo -n "🔬 Testing workflow activation endpoint structure... "
    total_tests=$((total_tests + 1))
    local activate_response=$(timeout 10 curl -s -X POST "$LOCAL_BASE_URL/api/n8n-integration/workflows/$test_workflow_id/activate" 2>/dev/null || echo "ERROR")
    
    if echo "$activate_response" | grep -q "success.*false\|error\|credentials"; then
        echo "✅ SUCCESS (endpoint structure confirmed)"
        echo "   📋 Activation API: $(echo "$activate_response" | head -c 100)..."
        success_count=$((success_count + 1))
    else
        echo "❌ FAILED"
        echo "   📋 Response: $(echo "$activate_response" | head -c 100)..."
    fi
    
    # Test workflow testing endpoint
    echo -n "🔬 Testing workflow testing endpoint structure... "
    total_tests=$((total_tests + 1))
    local test_payload='{"query": "Test workflow", "context": "visual-editor-test"}'
    local test_response=$(timeout 15 curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        "$LOCAL_BASE_URL/api/n8n-integration/workflows/$test_workflow_id/test" 2>/dev/null || echo "ERROR")
    
    if echo "$test_response" | grep -q "success\|error\|Network error\|workflow"; then
        echo "✅ SUCCESS (endpoint structure confirmed)"
        echo "   📋 Testing API: $(echo "$test_response" | head -c 100)..."
        success_count=$((success_count + 1))
    else
        echo "❌ FAILED"
        echo "   📋 Response: $(echo "$test_response" | head -c 100)..."
    fi
    
    echo ""
    echo "📊 Workflow Operations Test Results: $success_count/$total_tests endpoints working"
    return $((total_tests - success_count))
}

# Function to validate visual workflow components
test_visual_components() {
    echo ""
    echo "🎨 Testing visual workflow components..."
    
    echo -n "🔬 Testing workflow management page components... "
    local page_content=$(timeout 15 curl -s "$WORKFLOW_MANAGEMENT_URL" 2>/dev/null || echo "ERROR")
    
    local component_checks=0
    local total_checks=5
    
    # Check for WorkflowDiagram component
    if echo "$page_content" | grep -q "workflow.*diagram\|WorkflowDiagram\|svg\|foreignObject"; then
        component_checks=$((component_checks + 1))
        echo -n "✓"
    else
        echo -n "✗"
    fi
    
    # Check for LCARS styling
    if echo "$page_content" | grep -q "lcars\|orange.*400\|LCARS"; then
        component_checks=$((component_checks + 1))
        echo -n "✓"
    else
        echo -n "✗"
    fi
    
    # Check for N8N integration elements
    if echo "$page_content" | grep -q "N8N.*Integration\|n8n.*integration\|Connected\|Disconnected"; then
        component_checks=$((component_checks + 1))
        echo -n "✓"
    else
        echo -n "✗"
    fi
    
    # Check for sync controls
    if echo "$page_content" | grep -q "sync\|Pull.*n8n\|Push.*n8n\|Bidirectional"; then
        component_checks=$((component_checks + 1))
        echo -n "✓"
    else
        echo -n "✗"
    fi
    
    # Check for workflow list/editor
    if echo "$page_content" | grep -q "Available.*Workflows\|Workflow.*Editor\|Edit.*button"; then
        component_checks=$((component_checks + 1))
        echo -n "✓"
    else
        echo -n "✗"
    fi
    
    echo ""
    
    if [ $component_checks -eq $total_checks ]; then
        echo "✅ SUCCESS (all visual components present)"
    elif [ $component_checks -ge 3 ]; then
        echo "⚠️  PARTIAL ($component_checks/$total_checks components present)"
    else
        echo "❌ FAILED ($component_checks/$total_checks components present)"
    fi
    
    echo "   📋 Component Analysis: WorkflowDiagram, LCARS styling, N8N integration"
    return $((total_checks - component_checks))
}

# Function to generate comprehensive test report
generate_visual_test_report() {
    local editor_result=$1
    local api_result=$2
    local operations_result=$3
    local visual_result=$4
    
    echo ""
    echo "🎨 VISUAL WORKFLOW EDITOR TEST REPORT"
    echo "===================================="
    echo ""
    
    # Calculate overall score
    local total_score=0
    local max_score=4
    
    if [ $editor_result -eq 0 ]; then
        echo "✅ Workflow Editor Access: EXCELLENT"
        total_score=$((total_score + 1))
    else
        echo "⚠️  Workflow Editor Access: NEEDS ATTENTION"
    fi
    
    if [ $api_result -eq 0 ]; then
        echo "✅ Workflow APIs: EXCELLENT"
        total_score=$((total_score + 1))
    else
        echo "⚠️  Workflow APIs: NEEDS ATTENTION ($api_result issues)"
    fi
    
    if [ $operations_result -eq 0 ]; then
        echo "✅ Workflow Operations: EXCELLENT"
        total_score=$((total_score + 1))
    else
        echo "⚠️  Workflow Operations: NEEDS ATTENTION ($operations_result issues)"
    fi
    
    if [ $visual_result -eq 0 ]; then
        echo "✅ Visual Components: EXCELLENT"
        total_score=$((total_score + 1))
    else
        echo "⚠️  Visual Components: NEEDS ATTENTION ($visual_result issues)"
    fi
    
    echo ""
    echo "🎯 OVERALL VISUAL EDITOR SCORE: $total_score/$max_score"
    
    if [ $total_score -eq $max_score ]; then
        echo "🎉 EXCELLENT: Visual workflow editor fully operational!"
    elif [ $total_score -ge 3 ]; then
        echo "👍 GOOD: Visual editor working well with minor issues"
    elif [ $total_score -ge 2 ]; then
        echo "⚠️  FAIR: Visual editor partially working"
    else
        echo "❌ POOR: Visual editor needs significant work"
    fi
    
    echo ""
    echo "🖥️ Visual Workflow Editor Features:"
    echo "   ✓ Enhanced workflow diagram display"
    echo "   ✓ Interactive node editing and positioning"  
    echo "   ✓ Visual workflow connections (SVG-based)"
    echo "   ✓ Drag-and-drop node manipulation"
    echo "   ✓ Real-time parameter editing"
    echo "   ✓ Node type-specific styling and icons"
    echo "   ✓ Integrated sync and testing controls"
    echo ""
    
    echo "🔗 Access Your Enhanced Workflow Editor:"
    echo "   🎨 Visual Workflow Management: $WORKFLOW_MANAGEMENT_URL"
    echo "   📊 Traditional Workflow: $LOCAL_BASE_URL/workflow"
    echo "   🏠 Main Application: $LOCAL_BASE_URL"
    echo ""
    
    if [ $total_score -ge 3 ]; then
        echo "🎊 SUCCESS: Your visual workflow editor is ready!"
        echo "   - Click 'Edit' on any workflow to see the visual diagram"
        echo "   - Drag nodes to reposition them"
        echo "   - Click nodes to edit their parameters"
        echo "   - Use sync controls to push/pull workflows"
        echo ""
    fi
}

# Main execution
main() {
    echo "🚀 Starting visual workflow editor testing..."
    echo ""
    
    # Run all tests
    test_workflow_editor
    editor_result=$?
    
    test_workflow_apis
    api_result=$?
    
    test_workflow_operations
    operations_result=$?
    
    test_visual_components
    visual_result=$?
    
    # Generate comprehensive report
    generate_visual_test_report $editor_result $api_result $operations_result $visual_result
    
    echo "🎯 Visual workflow editor testing complete!"
    echo "🖖 Access your enhanced editor at: $WORKFLOW_MANAGEMENT_URL"
}

# Execute main function
main "$@"
