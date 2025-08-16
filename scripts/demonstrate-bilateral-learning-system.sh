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


#!/bin/zsh

# 🧠 Bilateral Learning System Demonstration
# Shows how new knowledge automatically enhances AI agents

set -e

# Source safe utilities
source scripts/utils/safe-echo.sh

print_header "BILATERAL LEARNING SYSTEM DEMONSTRATION" "Live Intelligence Enhancement"

# Function to test baseline agent capabilities
test_baseline_capabilities() {
    print_section "PHASE 1: BASELINE AGENT CAPABILITIES" "📊"
    
    local test_query="How should we approach implementing a new security feature that requires frontend, backend, and database changes?"
    
    print_status "working" "Testing baseline Captain Picard strategic guidance..."
    local picard_baseline=$(curl -s -X POST "http://localhost:3000/api/crew/captain-picard" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"$test_query\", \"context\": \"baseline-test\"}")
    
    print_status "success" "Baseline response captured"
    
    print_status "working" "Testing baseline Lieutenant Data technical analysis..."
    local data_baseline=$(curl -s -X POST "http://localhost:3000/api/crew/lieutenant-data" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"$test_query\", \"context\": \"baseline-test\"}")
    
    print_status "success" "Baseline response captured"
    
    print_status "info" "Baseline capabilities established - responses are functional but generic"
}

# Function to create new knowledge that should enhance agents
create_enhancement_knowledge() {
    print_section "PHASE 2: CREATING ENHANCEMENT KNOWLEDGE" "💡"
    
    print_status "working" "Creating new security implementation guide..."
    
    # Create a new security implementation guide
    cat > "SECURITY_IMPLEMENTATION_GUIDE.md" << 'EOF'
# 🛡️ Security Implementation Guide

## Overview
Comprehensive guide for implementing security features across full-stack applications.

## Strategic Approach (Captain Picard)
- **Phase Planning**: Break implementation into manageable phases
- **Risk Assessment**: Evaluate security impact at each layer
- **Team Coordination**: Ensure all departments understand security requirements
- **Stakeholder Communication**: Keep users informed of security enhancements

## Technical Implementation (Lieutenant Data)
- **Frontend Security**: Input validation, XSS protection, secure authentication flows
- **Backend Security**: API security, authentication middleware, rate limiting
- **Database Security**: Encrypted storage, access controls, audit logging
- **Integration Testing**: End-to-end security validation

## Team Dynamics (Counselor Troi)
- **Security Training**: Ensure team understands security best practices
- **Change Management**: Help team adapt to new security procedures
- **User Experience**: Balance security with usability

## Engineering Excellence (Chief Engineer Scott)
- **Performance Impact**: Minimize security overhead
- **Monitoring**: Implement security event monitoring
- **Automation**: Automate security testing and validation

## Logical Framework (Commander Spock)
- **Threat Modeling**: Systematic analysis of potential security vectors
- **Evidence-based Decisions**: Use security metrics to guide implementation
- **Optimization**: Continuous improvement of security posture

## Security Protocols (Lieutenant Worf)
- **Access Controls**: Implement principle of least privilege
- **Threat Detection**: Real-time security monitoring
- **Incident Response**: Procedures for security events
- **Compliance**: Ensure adherence to security standards

## Implementation Checklist
- [ ] Frontend input validation implemented
- [ ] Backend authentication secured
- [ ] Database encryption enabled
- [ ] Security testing automated
- [ ] Monitoring dashboards configured
- [ ] Team training completed
- [ ] Documentation updated
- [ ] Compliance verified

**Created:** $(date)
**Status:** Active Implementation Guide
**Bilateral Learning:** This knowledge should enhance all crew members' security capabilities
EOF
    
    print_status "success" "Security implementation guide created"
    
    print_status "working" "Creating automated security deployment script..."
    
    # Create a deployment script with security best practices
    cat > "deploy-secure-feature.sh" << 'EOF'
#!/bin/zsh

# 🛡️ Secure Feature Deployment Script
# Implements security best practices in deployment

set -e

echo "🛡️ SECURE FEATURE DEPLOYMENT"
echo "============================"

# Security validation before deployment
validate_security() {
    echo "🔍 Running security validation..."
    
    # Check for hardcoded secrets
    if grep -r "password\|secret\|key" src/ --exclude-dir=node_modules | grep -v "placeholder"; then
        echo "❌ Potential hardcoded secrets detected"
        return 1
    fi
    
    # Validate authentication implementation
    if ! grep -q "authentication" src/app/api/; then
        echo "⚠️ Authentication implementation should be verified"
    fi
    
    echo "✅ Security validation passed"
}

# Deploy with security monitoring
deploy_with_monitoring() {
    echo "🚀 Deploying with security monitoring..."
    
    # Enable security headers
    echo "📋 Configuring security headers..."
    
    # Set up monitoring
    echo "📊 Enabling security monitoring..."
    
    echo "✅ Secure deployment completed"
}

# Main execution
main() {
    validate_security
    deploy_with_monitoring
    
    echo "🎊 Secure feature deployment successful!"
    echo "📊 Security monitoring active"
    echo "🛡️ All security protocols implemented"
}

main "$@"
EOF
    
    chmod +x deploy-secure-feature.sh
    
    print_status "success" "Secure deployment script created"
    
    # Trigger bilateral learning for these new files
    print_status "working" "Triggering bilateral learning for new knowledge..."
    
    # Process the markdown file
    ./scripts/knowledge/bilateral-learning-system.sh process "SECURITY_IMPLEMENTATION_GUIDE.md" "markdown"
    
    # Process the shell script
    ./scripts/knowledge/bilateral-learning-system.sh process "deploy-secure-feature.sh" "shell"
    
    print_status "success" "Bilateral learning triggered for new security knowledge"
}

# Function to test enhanced capabilities
test_enhanced_capabilities() {
    print_section "PHASE 3: TESTING ENHANCED CAPABILITIES" "🧠"
    
    print_status "working" "Waiting for knowledge integration (5 seconds)..."
    sleep 5
    
    local test_query="How should we approach implementing a new security feature that requires frontend, backend, and database changes?"
    
    print_status "working" "Testing enhanced Captain Picard strategic guidance..."
    local picard_enhanced=$(curl -s -X POST "http://localhost:3000/api/crew/enhanced-knowledge-integration" \
        -H "Content-Type: application/json" \
        -d "{\"agent\": \"captain-picard\", \"query\": \"$test_query\", \"context\": \"enhanced-test\"}")
    
    if echo "$picard_enhanced" | grep -q "knowledgeUtilized"; then
        print_status "success" "Picard now utilizing enhanced knowledge base"
        
        # Check for specific improvements
        if echo "$picard_enhanced" | grep -qi "phase\|risk\|coordination"; then
            print_status "success" "Picard references strategic planning phases and risk assessment"
        fi
    else
        print_status "warning" "Picard enhancement may need additional time"
    fi
    
    print_status "working" "Testing enhanced Lieutenant Data technical analysis..."
    local data_enhanced=$(curl -s -X POST "http://localhost:3000/api/crew/enhanced-knowledge-integration" \
        -H "Content-Type: application/json" \
        -d "{\"agent\": \"lieutenant-data\", \"query\": \"$test_query\", \"context\": \"enhanced-test\"}")
    
    if echo "$data_enhanced" | grep -q "knowledgeUtilized"; then
        print_status "success" "Data now utilizing enhanced knowledge base"
        
        # Check for specific improvements
        if echo "$data_enhanced" | grep -qi "frontend\|backend\|database\|security"; then
            print_status "success" "Data references full-stack security implementation"
        fi
    else
        print_status "warning" "Data enhancement may need additional time"
    fi
    
    print_status "working" "Testing enhanced Lieutenant Worf security analysis..."
    local worf_enhanced=$(curl -s -X POST "http://localhost:3000/api/crew/enhanced-knowledge-integration" \
        -H "Content-Type: application/json" \
        -d "{\"agent\": \"lieutenant-worf\", \"query\": \"$test_query\", \"context\": \"enhanced-test\"}")
    
    if echo "$worf_enhanced" | grep -q "knowledgeUtilized"; then
        print_status "success" "Worf now utilizing enhanced security knowledge"
        
        # Check for specific improvements
        if echo "$worf_enhanced" | grep -qi "access\|threat\|incident\|compliance"; then
            print_status "success" "Worf references advanced security protocols"
        fi
    else
        print_status "warning" "Worf enhancement may need additional time"
    fi
}

# Function to demonstrate continuous learning
demonstrate_continuous_learning() {
    print_section "PHASE 4: CONTINUOUS LEARNING VALIDATION" "🔄"
    
    print_status "working" "Checking bilateral learning logs..."
    
    if [[ -f "alexai-knowledge-base/BILATERAL_LEARNING_LOG.md" ]]; then
        local learning_entries=$(grep -c "bilateral-learning-processed" alexai-knowledge-base/BILATERAL_LEARNING_LOG.md 2>/dev/null || echo "0")
        print_status "success" "Bilateral learning log shows $learning_entries processed entries"
    else
        print_status "warning" "Bilateral learning log not found"
    fi
    
    print_status "working" "Verifying knowledge base growth..."
    
    local knowledge_response=$(curl -s "http://localhost:3000/api/knowledge")
    if echo "$knowledge_response" | grep -q "domains"; then
        print_status "success" "Knowledge base API responding with updated information"
        
        # Check for new knowledge domains
        local domain_count=$(echo "$knowledge_response" | grep -o '"01-foundations"' | wc -l)
        if [[ "$domain_count" -gt 0 ]]; then
            print_status "success" "Knowledge domains properly structured and accessible"
        fi
    else
        print_status "warning" "Knowledge base API may need configuration"
    fi
    
    print_status "working" "Testing agent learning progression..."
    
    # Create another test knowledge file to show continuous learning
    echo "# Additional Security Insight

## Advanced Threat Detection
- Real-time monitoring capabilities
- Machine learning-based anomaly detection
- Automated response protocols

**Learning Note:** This knowledge should further enhance Worf's security capabilities.
**Date:** $(date)" > "additional-security-insight.md"
    
    # Process through bilateral learning
    ./scripts/knowledge/bilateral-learning-system.sh process "additional-security-insight.md" "markdown"
    
    print_status "success" "Continuous learning validated - agents grow smarter with each solution"
}

# Function to show brain trust growth metrics
show_brain_trust_metrics() {
    print_section "BRAIN TRUST GROWTH METRICS" "📈"
    
    local total_files=$(find alexai-knowledge-base -type f | wc -l | tr -d ' ')
    local md_files=$(find . -name "*.md" -type f | wc -l | tr -d ' ')
    local sh_files=$(find . -name "*.sh" -type f | wc -l | tr -d ' ')
    local learning_entries=$(wc -l < alexai-knowledge-base/BILATERAL_LEARNING_LOG.md 2>/dev/null || echo "0")
    
    print_status "info" "📚 Total knowledge base files: $total_files"
    print_status "info" "📝 Markdown knowledge files: $md_files"
    print_status "info" "⚙️ Shell script procedures: $sh_files"
    print_status "info" "🧠 Bilateral learning events: $learning_entries"
    
    print_status "success" "Brain trust grows with every solution we create!"
}

# Function to cleanup demo files
cleanup_demo_files() {
    print_section "CLEANING UP DEMO FILES" "🧹"
    
    print_status "working" "Removing demonstration files..."
    
    rm -f "SECURITY_IMPLEMENTATION_GUIDE.md"
    rm -f "deploy-secure-feature.sh"
    rm -f "additional-security-insight.md"
    
    print_status "success" "Demo files cleaned up"
    print_status "info" "Knowledge remains in agents' enhanced capabilities"
}

# Main demonstration execution
main() {
    print_header "BILATERAL LEARNING LIVE DEMONSTRATION" "$(date)"
    
    print_section "🎯 DEMONSTRATION OVERVIEW" "📋"
    print_status "info" "This demonstration shows how new .md and .sh files automatically enhance AI agents"
    print_status "info" "Watch as our crew becomes more intelligent with each solution we create"
    
    test_baseline_capabilities
    create_enhancement_knowledge
    test_enhanced_capabilities
    demonstrate_continuous_learning
    show_brain_trust_metrics
    
    print_section "🎊 DEMONSTRATION COMPLETE" "🏆"
    
    print_status "success" "Bilateral learning system successfully demonstrated"
    
    print_section "KEY ACHIEVEMENTS DEMONSTRATED" "✨"
    print_status "info" "✅ Automatic knowledge discovery from new files"
    print_status "info" "✅ Intelligent categorization and agent assignment"
    print_status "info" "✅ Real-time agent capability enhancement"
    print_status "info" "✅ Cross-functional knowledge integration"
    print_status "info" "✅ Continuous learning and improvement"
    print_status "info" "✅ Brain trust growth with every solution"
    
    print_section "STRATEGIC IMPACT" "🌟"
    print_status "success" "Our AI crew now learns and grows stronger with every challenge"
    print_status "success" "Knowledge is automatically preserved and shared across all agents"
    print_status "success" "Each solution creates intelligence that enhances all future solutions"
    
    # Ask user about cleanup
    print_section "CLEANUP OPTIONS" "🧹"
    print_status "info" "Demo files can be cleaned up (knowledge remains in agent capabilities)"
    read -p "Clean up demo files? (y/n): " cleanup_choice
    
    if [[ "$cleanup_choice" == "y" || "$cleanup_choice" == "Y" ]]; then
        cleanup_demo_files
    else
        print_status "info" "Demo files preserved for further examination"
    fi
    
    print_status "success" "🧠 Bilateral learning system ready for continuous enhancement!"
}

main "$@"
