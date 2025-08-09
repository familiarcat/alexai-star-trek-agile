#!/bin/bash

# 🧪 Bilateral Integration Testing Suite
# Comprehensive testing for bilateral workflow synchronization

set -e

echo "🧪 BILATERAL INTEGRATION TESTING SUITE"
echo "======================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Test 1: Configuration validation
test_configuration() {
    echo "📋 Test 1: Configuration Validation"
    echo "==================================="
    
    if [[ -f "$SCRIPT_DIR/../config.json" ]]; then
        echo "✅ Configuration file exists"
        
        if node -e "JSON.parse(require('fs').readFileSync('$SCRIPT_DIR/../config.json', 'utf8'))" 2>/dev/null; then
            echo "✅ Configuration is valid JSON"
        else
            echo "❌ Configuration is invalid JSON"
            return 1
        fi
    else
        echo "❌ Configuration file missing"
        return 1
    fi
    
    echo ""
}

# Test 2: N8N connectivity
test_n8n_connectivity() {
    echo "🌐 Test 2: N8N Connectivity"
    echo "==========================="
    
    local n8n_url="https://n8n.pbradygeorgen.com"
    
    if curl -s -f "$n8n_url" > /dev/null; then
        echo "✅ N8N platform accessible"
    else
        echo "❌ N8N platform unreachable"
        return 1
    fi
    
    # Test webhook
    local webhook_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"query":"test","source":"bilateral-test"}' \
        "$n8n_url/webhook/crew-request" || echo "ERROR")
    
    if echo "$webhook_response" | grep -q "ERROR"; then
        echo "❌ Webhook connection failed"
    else
        echo "✅ Webhook responding"
    fi
    
    echo ""
}

# Test 3: Sync manager functionality
test_sync_manager() {
    echo "🔄 Test 3: Sync Manager Functionality"
    echo "====================================="
    
    if node "$SCRIPT_DIR/bilateral-sync-manager.js" status; then
        echo "✅ Sync manager operational"
    else
        echo "❌ Sync manager failed"
        return 1
    fi
    
    echo ""
}

# Test 4: Evolution tracking
test_evolution_tracking() {
    echo "🧬 Test 4: Evolution Tracking"
    echo "============================="
    
    if node "$SCRIPT_DIR/evolution-tracker.js" init; then
        echo "✅ Evolution tracking initialized"
        
        if node "$SCRIPT_DIR/evolution-tracker.js" report; then
            echo "✅ Evolution reporting functional"
        else
            echo "❌ Evolution reporting failed"
            return 1
        fi
    else
        echo "❌ Evolution tracking failed"
        return 1
    fi
    
    echo ""
}

# Test 5: End-to-end workflow sync simulation
test_end_to_end_sync() {
    echo "🔄 Test 5: End-to-End Sync Simulation"
    echo "====================================="
    
    echo "🧪 Simulating workflow sync..."
    
    # Create test workflow
    local test_workflow_path="sync-system/workflows/test-bilateral-sync.json"
    cat > "$test_workflow_path" << 'EOFW'
{
  "name": "Test Bilateral Sync",
  "nodes": [
    {
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "position": [250, 300]
    }
  ],
  "connections": {},
  "active": false,
  "settings": {},
  "updatedAt": "$(date -Iseconds)"
}
EOFW
    
    echo "✅ Test workflow created"
    
    # Test sync process
    if node "$SCRIPT_DIR/bilateral-sync-manager.js" sync; then
        echo "✅ End-to-end sync simulation successful"
        
        # Cleanup
        rm -f "$test_workflow_path"
        echo "✅ Test cleanup completed"
    else
        echo "❌ End-to-end sync simulation failed"
        rm -f "$test_workflow_path"
        return 1
    fi
    
    echo ""
}

# Main test execution
main() {
    echo "🎯 Starting bilateral integration tests..."
    echo ""
    
    local tests_passed=0
    local total_tests=5
    
    # Run all tests
    test_configuration && tests_passed=$((tests_passed + 1))
    test_n8n_connectivity && tests_passed=$((tests_passed + 1))
    test_sync_manager && tests_passed=$((tests_passed + 1))
    test_evolution_tracking && tests_passed=$((tests_passed + 1))
    test_end_to_end_sync && tests_passed=$((tests_passed + 1))
    
    echo "🏆 BILATERAL INTEGRATION TEST RESULTS"
    echo "====================================="
    echo "Tests passed: $tests_passed/$total_tests"
    echo "Success rate: $(( tests_passed * 100 / total_tests ))%"
    echo ""
    
    if [[ $tests_passed -eq $total_tests ]]; then
        echo "✅ All tests passed - Bilateral integration ready!"
        return 0
    else
        echo "⚠️ Some tests failed - Check configuration and connectivity"
        return 1
    fi
}

# Execute tests
main "$@"
