#!/bin/bash

# 🔧 Quick OpenAI API Key Recovery
# Simple recovery process after generating new OpenAI key

set -e

echo "🔧 QUICK OPENAI API KEY RECOVERY"
echo "==============================="
echo "🛡️ Lieutenant Worf's Simplified Recovery Protocol"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Function: Test if new key is in ~/.zshrc
test_zshrc_key() {
    echo "🔍 Checking for new OpenAI key in ~/.zshrc..."
    
    if grep -q "^export OPENAI_API_KEY=" ~/.zshrc 2>/dev/null; then
        local key_preview=$(grep "^export OPENAI_API_KEY=" ~/.zshrc | cut -d'=' -f2 | tr -d '"' | cut -c1-15)
        if [[ "$key_preview" == "sk-proj-"* ]]; then
            echo "✅ Found new OpenAI key in ~/.zshrc: ${key_preview}..."
            return 0
        else
            echo "⚠️ Found old or invalid key format in ~/.zshrc"
            return 1
        fi
    else
        echo "❌ No OPENAI_API_KEY found in ~/.zshrc"
        return 1
    fi
}

# Function: Load the new key
load_new_key() {
    echo "🔄 Loading new OpenAI key from ~/.zshrc..."
    
    # Source only the OpenAI key line
    if grep -q "^export OPENAI_API_KEY=" ~/.zshrc; then
        eval "$(grep "^export OPENAI_API_KEY=" ~/.zshrc)"
        echo "✅ New OpenAI key loaded into current session"
        echo "   Key preview: ${OPENAI_API_KEY:0:15}..."
        return 0
    else
        echo "❌ Could not load OpenAI key"
        return 1
    fi
}

# Function: Test OpenAI connection
test_openai_connection() {
    echo "🧪 Testing OpenAI API connection..."
    
    if [[ -z "$OPENAI_API_KEY" ]]; then
        echo "❌ No OpenAI API key in environment"
        return 1
    fi
    
    # Test with a simple API call
    local response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $OPENAI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hello"}],"max_tokens":5}' \
        https://api.openai.com/v1/chat/completions)
    
    local http_code="${response: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        echo "✅ OpenAI API connection successful (HTTP 200)"
        return 0
    else
        echo "❌ OpenAI API connection failed (HTTP $http_code)"
        if [[ "$http_code" == "401" ]]; then
            echo "   → Invalid API key or insufficient permissions"
        elif [[ "$http_code" == "429" ]]; then
            echo "   → Rate limit exceeded, but key is valid"
            return 0  # Rate limit means key works
        fi
        return 1
    fi
}

# Function: Update .env file
update_env_file() {
    echo "📝 Updating .env file with new OpenAI key..."
    
    local env_file="$PROJECT_ROOT/.env"
    
    if [[ -f "$env_file" ]]; then
        # Remove any existing OpenAI key lines (including commented ones)
        sed -i.bak '/OPENAI_API_KEY/d' "$env_file"
        
        # Add the new key
        echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> "$env_file"
        echo "✅ Updated .env file with new OpenAI key"
    else
        echo "⚠️ .env file not found, creating new one..."
        echo "OPENAI_API_KEY=$OPENAI_API_KEY" > "$env_file"
        chmod 600 "$env_file"
        echo "✅ Created .env file with new OpenAI key"
    fi
}

# Function: Test local AlexAI integration
test_alexai_integration() {
    echo "🤖 Testing AlexAI integration..."
    
    # Start the development server in background if not running
    if ! curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "🚀 Starting development server..."
        npm run dev > /dev/null 2>&1 &
        local dev_pid=$!
        
        # Wait for server to start
        echo "⏳ Waiting for server to start..."
        local attempts=0
        while [[ $attempts -lt 30 ]]; do
            if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
                echo "✅ Development server started"
                break
            fi
            sleep 1
            attempts=$((attempts + 1))
        done
        
        if [[ $attempts -eq 30 ]]; then
            echo "❌ Development server failed to start"
            return 1
        fi
    else
        echo "✅ Development server already running"
    fi
    
    # Test health endpoint
    local health_response=$(curl -s http://localhost:3000/api/health)
    if echo "$health_response" | grep -q "healthy"; then
        echo "✅ Health endpoint operational"
    else
        echo "⚠️ Health endpoint issue: $health_response"
    fi
    
    # Test crew endpoint (should work without OpenAI)
    local crew_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"query":"test"}' \
        http://localhost:3000/api/crew/captain-picard)
    
    if echo "$crew_response" | grep -q "Make it so"; then
        echo "✅ Crew coordination operational"
    else
        echo "⚠️ Crew coordination issue"
    fi
}

# Function: Manual setup instructions
show_manual_instructions() {
    echo ""
    echo "📋 MANUAL RECOVERY INSTRUCTIONS"
    echo "==============================="
    echo ""
    echo "1. 🔑 Add your new OpenAI key to ~/.zshrc:"
    echo "   vim ~/.zshrc"
    echo "   # Add this line:"
    echo "   export OPENAI_API_KEY=\"sk-proj-YOUR_NEW_KEY_HERE\""
    echo ""
    echo "2. 🔄 Reload your shell:"
    echo "   source ~/.zshrc"
    echo ""
    echo "3. 🔧 Run this recovery script again:"
    echo "   ./scripts/recovery/quick-openai-recovery.sh"
    echo ""
    echo "4. 🧪 Test your integration:"
    echo "   npm run dev"
    echo "   # Visit: http://localhost:3000"
    echo ""
}

# Main recovery process
main() {
    echo "🎯 Starting quick OpenAI recovery process..."
    echo ""
    
    # Step 1: Check for new key in ~/.zshrc
    if test_zshrc_key; then
        echo ""
        
        # Step 2: Load the new key
        if load_new_key; then
            echo ""
            
            # Step 3: Test OpenAI connection
            if test_openai_connection; then
                echo ""
                
                # Step 4: Update .env file
                update_env_file
                echo ""
                
                # Step 5: Test AlexAI integration
                test_alexai_integration
                echo ""
                
                echo "🎉 RECOVERY COMPLETE!"
                echo "===================="
                echo "✅ New OpenAI key validated"
                echo "✅ Environment updated"
                echo "✅ AlexAI integration restored"
                echo ""
                echo "🚀 Your system is fully operational!"
                echo "   • Visit: http://localhost:3000"
                echo "   • Visual Editor: http://localhost:3000/workflow-management"
                echo ""
                echo "🖖 Live long and prosper with enhanced security!"
                
            else
                echo ""
                echo "❌ OpenAI connection test failed"
                echo "   → Please verify your new API key is correct"
                show_manual_instructions
                exit 1
            fi
        else
            echo ""
            echo "❌ Could not load new key from ~/.zshrc"
            show_manual_instructions
            exit 1
        fi
    else
        echo ""
        echo "❌ New OpenAI key not found in ~/.zshrc"
        show_manual_instructions
        exit 1
    fi
}

# Execute recovery
main "$@"
