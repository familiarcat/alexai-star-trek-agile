#!/bin/bash

# 🔧 Enhanced with Chief Engineer Scott's Robustness Features
# Prevents command and dquote errors through strict error handling
set -euo pipefail  # Strict error handling: exit on error, undefined vars, pipe failures

# Error handling function
handle_error() {
    local exit_code=$?
    local line_number=$1
    echo "❌ Error occurred in script at line $line_number (exit code: $exit_code)" >&2
    exit $exit_code
}

# Set error trap
trap 'handle_error $LINENO' ERR

# Logging functions
log_info() {
    echo "ℹ️  $1"
}

log_success() {
    echo "✅ $1"
}

log_warning() {
    echo "⚠️  $1"
}

log_error() {
    echo "❌ $1"
}

# Variable validation function
validate_vars() {
    local required_vars=("$@")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log_error "Required variable '$var' is not set"
            exit 1
        fi
    done
}

# Command validation function
validate_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        log_error "Required command '$1' is not available"
        exit 1
    fi
}

# Safe command execution with error checking
safe_exec() {
    "$@"
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log_error "Command failed with exit code $exit_code: $*"
        return $exit_code
    fi
    return 0
}


#!/bin/bash

# Enhanced Ship Agency Test Script
set -e

echo "🧪 Testing Enhanced Ship Agency Workflow..."
echo "=============================================="

# Test different mission scenarios
echo ""
echo "🚀 Test 1: Strategic Mission (Captain Picard + Commander Spock)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Develop strategic approach for enterprise mission",
    "context": "strategy leadership diplomatic",
    "userRole": "captain",
    "urgency": "high",
    "complexity": "high",
    "mission": "Diplomatic Mission to Neutral Zone"
  }' | jq '.'

echo ""
echo "🔧 Test 2: Technical Mission (Lieutenant Data + Chief Engineer Scott)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Analyze warp core efficiency and optimize power distribution",
    "context": "technical engineering systems",
    "userRole": "engineer",
    "urgency": "medium",
    "complexity": "high",
    "mission": "Warp Core Optimization"
  }' | jq '.'

echo ""
echo "🛡️ Test 3: Tactical Mission (Lieutenant Worf)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Assess security protocols for hostile territory",
    "context": "tactical security defense",
    "userRole": "security",
    "urgency": "high",
    "complexity": "medium",
    "mission": "Security Assessment"
  }' | jq '.'

echo ""
echo "💙 Test 4: Emotional Intelligence Mission (Counselor Troi)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Help resolve crew conflict in engineering",
    "context": "emotional counseling interpersonal",
    "userRole": "counselor",
    "urgency": "medium",
    "complexity": "low",
    "mission": "Crew Conflict Resolution"
  }' | jq '.'

echo ""
echo "🚨 Test 5: Critical Emergency Mission (All Crew + ChatGPT 5)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Critical system failure - warp core breach imminent",
    "context": "emergency critical systems failure",
    "userRole": "captain",
    "urgency": "critical",
    "complexity": "critical",
    "mission": "Emergency Response"
  }' | jq '.'

echo ""
echo "🔬 Test 6: Analytical Mission (Observation Lounge + Lieutenant Data)"
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ship-agency-request" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Comprehensive analysis of unknown spatial anomaly",
    "context": "analysis research scientific",
    "userRole": "scientist",
    "urgency": "medium",
    "complexity": "high",
    "mission": "Spatial Anomaly Research"
  }' | jq '.'

echo ""
echo "✅ Enhanced Ship Agency testing complete!"
echo ""
echo "🎯 Key Features Demonstrated:"
echo "   • Dynamic crew selection based on mission context"
echo "   • Role-optimized LLM configurations"
echo "   • Emergency mode with ChatGPT 5 (32k tokens)"
echo "   • Mission priority-based UI layouts"
echo "   • Multi-crew coordination"
echo "   • Ship's Computer orchestration"
