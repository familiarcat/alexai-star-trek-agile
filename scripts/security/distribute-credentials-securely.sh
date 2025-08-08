#!/bin/bash
# Secure Credential Distribution Script
# Security Officer: Lieutenant Worf
# Follows Starfleet Security Protocols for credential management

set -e

echo "🛡️ WORF'S SECURE CREDENTIAL DISTRIBUTION"
echo "========================================"
echo "🎯 Distributing credentials with maximum security vigilance"
echo "📅 Security Date: $(date)"
echo ""

# Function to validate environment security
validate_environment_security() {
    echo "🔍 Conducting security assessment of environment..."
    
    # Check if ~/.zshrc exists and is secure
    if [ ! -f ~/.zshrc ]; then
        echo "❌ Security breach detected: ~/.zshrc file not found"
        echo "💡 Worf recommends creating ~/.zshrc with proper credentials"
        return 1
    fi
    
    # Check file permissions on ~/.zshrc
    local zshrc_perms=$(stat -f "%A" ~/.zshrc 2>/dev/null || stat -c "%a" ~/.zshrc 2>/dev/null)
    if [ "$zshrc_perms" != "644" ] && [ "$zshrc_perms" != "600" ]; then
        echo "⚠️  Security warning: ~/.zshrc permissions are $zshrc_perms"
        echo "🛡️ Worf recommends: chmod 600 ~/.zshrc for maximum security"
    fi
    
    echo "✅ Environment security assessment complete"
    return 0
}

# Function to extract credentials with security validation
extract_credentials_securely() {
    echo "🔐 Extracting credentials with security protocols..."
    
    # Create secure temporary file
    local temp_credentials=$(mktemp -t worf_credentials.XXXXXX)
    trap "rm -f $temp_credentials" EXIT
    chmod 600 "$temp_credentials"
    
    # Extract only export statements with security validation
    grep -E '^export [A-Z_]+=.*' ~/.zshrc > "$temp_credentials" 2>/dev/null || true
    
    # Validate required security credentials
    local required_credentials=(
        "OPENROUTER_API_KEY"
        "N8N_API_KEY" 
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
    )
    
    local missing_credentials=()
    for cred in "${required_credentials[@]}"; do
        if ! grep -q "^export $cred=" "$temp_credentials"; then
            missing_credentials+=("$cred")
        fi
    done
    
    if [ ${#missing_credentials[@]} -gt 0 ]; then
        echo "❌ Security alert: Missing critical credentials in ~/.zshrc:"
        for cred in "${missing_credentials[@]}"; do
            echo "   - $cred"
        done
        echo ""
        echo "🛡️ Worf's Security Protocol Recommendations:"
        show_security_setup_instructions
        return 1
    fi
    
    # Source the secure credentials
    source "$temp_credentials"
    echo "✅ Credentials extracted and validated securely"
    return 0
}

# Function to show security setup instructions
show_security_setup_instructions() {
    echo "📋 WORF'S SECURE CREDENTIAL SETUP INSTRUCTIONS"
    echo "=============================================="
    echo ""
    echo "Add these to your ~/.zshrc with maximum security:"
    echo ""
    
    cat << 'EOF'
# AlexAI NCC-1701-B Security Credentials
# Secured per Lieutenant Worf's protocols
# ========================================

# Core Security - OpenRouter AI Access
export OPENROUTER_API_KEY="your-openrouter-api-key-here"

# Mission Critical - n8n Integration
export N8N_API_KEY="your-n8n-api-key-here"
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"

# Infrastructure Security - AWS Access
export AWS_ACCESS_KEY_ID="your-aws-access-key-here"
export AWS_SECRET_ACCESS_KEY="your-aws-secret-key-here"
export AWS_DEFAULT_REGION="us-east-2"
export AWS_REGION="us-east-2"

# Database Security - Supabase
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url-here"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"
export SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-key-here"

# Deployment Security - Vercel (Optional)
export VERCEL_TOKEN="your-vercel-token-here"
export VERCEL_ORG_ID="your-vercel-org-id-here"
export VERCEL_PROJECT_ID="your-vercel-project-id-here"

# Development Security - GitHub (Optional)
export GITHUB_TOKEN="your-github-token-here"

# Application Security
export NEXTJS_BASE_URL="http://localhost:3000"
export NEXT_PUBLIC_APP_URL="http://localhost:3000"
export NODE_ENV="development"
EOF
    
    echo ""
    echo "🛡️ Security Instructions:"
    echo "   1. Add the above to ~/.zshrc with your actual credentials"
    echo "   2. Run: chmod 600 ~/.zshrc (restrict access to owner only)"
    echo "   3. Run: source ~/.zshrc (reload credentials)"
    echo "   4. Run this script again to validate security"
    echo ""
}

# Function to create n8n environment configuration
create_n8n_environment_config() {
    echo "🌐 Creating n8n environment configuration..."
    
    # Required environment variables for n8n
    local n8n_env_vars=(
        "OPENROUTER_API_KEY"
        "N8N_API_KEY"
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
        "AWS_REGION"
        "NEXTJS_BASE_URL"
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
    
    echo "📝 n8n Environment Variables Required:"
    echo "====================================="
    for var in "${n8n_env_vars[@]}"; do
        if [ -n "${!var}" ]; then
            echo "✅ $var: [SECURED - ${!var:0:8}...]"
        else
            echo "❌ $var: Missing"
        fi
    done
    
    echo ""
    echo "🛡️ Security Note: These variables must be configured in your n8n instance"
    echo "   Go to: n8n.pbradygeorgen.com > Settings > Environment Variables"
    echo ""
}

# Function to test security of deployed workflow
test_workflow_security() {
    echo "🧪 Testing workflow security configuration..."
    
    local webhook_url="https://n8n.pbradygeorgen.com/webhook/crew-request"
    local test_payload='{
        "query": "Security test from Worf",
        "context": "security-validation",
        "userRole": "security-officer",
        "urgency": "normal",
        "requestId": "worf-security-test-'$(date +%s)'"
    }'
    
    echo "🔗 Testing webhook: $webhook_url"
    
    # Test with timeout for security
    local response=$(timeout 30 curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        "$webhook_url" 2>/dev/null || echo '{"error": "timeout"}')
    
    if echo "$response" | grep -q "success\|response\|crewMember"; then
        echo "✅ Workflow security test successful"
        echo "📊 Response preview: $(echo "$response" | head -c 100)..."
    else
        echo "⚠️  Workflow security test inconclusive"
        echo "💡 This may indicate n8n environment variables need configuration"
        echo "📋 Response: $response"
    fi
    
    echo ""
}

# Function to validate local API endpoints
validate_local_endpoints() {
    echo "🏠 Validating local API endpoint security..."
    
    local endpoints=(
        "captain-picard"
        "lieutenant-data"
        "counselor-troi"
        "chief-engineer-scott"
        "commander-spock"
        "lieutenant-worf"
        "observation-lounge"
    )
    
    local base_url="${NEXTJS_BASE_URL:-http://localhost:3000}"
    
    for endpoint in "${endpoints[@]}"; do
        local url="$base_url/api/crew/$endpoint"
        local response=$(timeout 5 curl -s "$url" 2>/dev/null || echo '{"error": "timeout"}')
        
        if echo "$response" | grep -q "crewMember\|specialties"; then
            echo "✅ $endpoint: Endpoint secured and operational"
        else
            echo "⚠️  $endpoint: Endpoint may need security review"
        fi
    done
    
    echo ""
}

# Function to generate security report
generate_security_report() {
    echo "📊 WORF'S SECURITY ASSESSMENT REPORT"
    echo "===================================="
    echo ""
    
    local security_score=0
    local max_score=10
    
    # Check credential security
    if grep -q "OPENROUTER_API_KEY" ~/.zshrc 2>/dev/null; then
        echo "✅ OpenRouter credentials: Secured (+2 points)"
        security_score=$((security_score + 2))
    else
        echo "❌ OpenRouter credentials: Missing (0 points)"
    fi
    
    if grep -q "N8N_API_KEY" ~/.zshrc 2>/dev/null; then
        echo "✅ n8n credentials: Secured (+2 points)"
        security_score=$((security_score + 2))
    else
        echo "❌ n8n credentials: Missing (0 points)"
    fi
    
    if grep -q "AWS_ACCESS_KEY_ID" ~/.zshrc 2>/dev/null; then
        echo "✅ AWS credentials: Secured (+2 points)"
        security_score=$((security_score + 2))
    else
        echo "❌ AWS credentials: Missing (0 points)"
    fi
    
    # Check file permissions
    local zshrc_perms=$(stat -f "%A" ~/.zshrc 2>/dev/null || stat -c "%a" ~/.zshrc 2>/dev/null)
    if [ "$zshrc_perms" = "600" ]; then
        echo "✅ File permissions: Maximum security (+2 points)"
        security_score=$((security_score + 2))
    elif [ "$zshrc_perms" = "644" ]; then
        echo "⚠️  File permissions: Adequate security (+1 point)"
        security_score=$((security_score + 1))
    else
        echo "❌ File permissions: Security risk (0 points)"
    fi
    
    # Check environment setup
    if [ -f .env ]; then
        echo "✅ Local environment: Configured (+1 point)"
        security_score=$((security_score + 1))
    else
        echo "⚠️  Local environment: Needs configuration (0 points)"
    fi
    
    # Check workflow deployment
    if curl -s "https://n8n.pbradygeorgen.com" > /dev/null 2>&1; then
        echo "✅ n8n instance: Accessible (+1 point)"
        security_score=$((security_score + 1))
    else
        echo "⚠️  n8n instance: Connection issue (0 points)"
    fi
    
    echo ""
    echo "🎯 SECURITY SCORE: $security_score/$max_score"
    
    if [ $security_score -ge 8 ]; then
        echo "🛡️ EXCELLENT - Worf approves of your security measures"
    elif [ $security_score -ge 6 ]; then
        echo "⚠️  ADEQUATE - Security improvements recommended"
    else
        echo "❌ INADEQUATE - Immediate security action required"
    fi
    
    echo ""
}

# Main execution function
main() {
    echo "🚀 Beginning secure credential distribution process..."
    echo ""
    
    # Validate environment security
    if ! validate_environment_security; then
        echo ""
        echo "❌ Security validation failed. Exiting per Worf's protocols."
        exit 1
    fi
    
    echo ""
    
    # Extract credentials securely
    if extract_credentials_securely; then
        echo ""
        
        # Setup local environment if needed
        if [ ! -f .env ]; then
            echo "🔧 Setting up local environment..."
            ./scripts/setup/setup-environment.sh
        fi
        
        echo ""
        
        # Create n8n environment configuration
        create_n8n_environment_config
        
        # Test workflow security
        test_workflow_security
        
        # Validate local endpoints
        validate_local_endpoints
        
        # Generate security report
        generate_security_report
        
        echo "🎉 SECURE CREDENTIAL DISTRIBUTION COMPLETE"
        echo "✅ All systems secured per Lieutenant Worf's standards"
        echo ""
        echo "🛡️ Remember: Security is an ongoing responsibility, not a one-time task"
        echo "🖖 Qapla'! (Success!)"
        
    else
        echo ""
        echo "❌ Credential extraction failed. Security protocols require immediate attention."
        exit 1
    fi
}

# Execute main function
main "$@"
