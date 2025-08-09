#!/bin/bash

# 🧠 AI Self-Evolution Validation Test
# Comprehensive testing of n8n AI agents self-learning and evolution

set -e

echo "🧠 AI SELF-EVOLUTION VALIDATION TEST"
echo "===================================="
echo "🎯 Testing n8n AI agents learning and adaptation capabilities"
echo "📅 Test Date: $(date)"
echo ""

# Function: Test learning progression
test_learning_progression() {
    echo "📚 LEARNING PROGRESSION TEST"
    echo "============================"
    echo ""
    
    local webhook_url="https://n8n.pbradygeorgen.com/webhook/crew-request"
    local session_id="evolution_test_$(date +%s)"
    
    # Progressive learning scenarios
    local scenarios=(
        "1:Initial contact:Hello, I'm testing your learning capabilities"
        "2:Information provision:Our project is called AlexAI and focuses on Star Trek themed agile management"
        "3:Context building:We use Next.js, n8n workflows, and OpenRouter for AI coordination" 
        "4:Learning validation:What do you remember about our AlexAI project?"
        "5:Adaptation test:How would you adapt your responses based on what you've learned?"
    )
    
    echo "🔄 Running progressive learning scenarios..."
    echo ""
    
    for scenario_data in "${scenarios[@]}"; do
        local step=$(echo "$scenario_data" | cut -d':' -f1)
        local scenario_type=$(echo "$scenario_data" | cut -d':' -f2)
        local query=$(echo "$scenario_data" | cut -d':' -f3-)
        
        echo "Step $step - $scenario_type:"
        echo "Query: $query"
        
        local payload="{
            \"query\": \"$query\",
            \"sessionId\": \"$session_id\",
            \"context\": \"learning_progression\",
            \"step\": \"$step\",
            \"timestamp\": \"$(date -Iseconds)\"
        }"
        
        local response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$payload" \
            "$webhook_url" 2>/dev/null || echo "ERROR")
        
        if echo "$response" | grep -q "ERROR"; then
            echo "❌ No response from AI agent"
        else
            local response_length=$(echo "$response" | wc -c)
            echo "📏 Response length: $response_length characters"
            
            # Check for learning indicators
            if echo "$response" | grep -q -E "(remember|learned|AlexAI|Next\.js|n8n|project)"; then
                echo "🧠 Learning indicators detected!"
            fi
            
            # Check for adaptation
            if echo "$response" | grep -q -E "(adapt|adjust|modify|based on|context)"; then
                echo "🔄 Adaptation capability detected!"
            fi
            
            # Check for contextual memory
            if [[ "$step" -ge "4" ]] && echo "$response" | grep -q -E "(AlexAI|Star Trek|agile|management)"; then
                echo "💾 Contextual memory confirmed!"
            fi
        fi
        
        echo ""
        sleep 3  # Allow processing time
    done
}

# Function: Test cross-agent coordination
test_cross_agent_coordination() {
    echo "🤝 CROSS-AGENT COORDINATION TEST"
    echo "==============================="
    echo ""
    
    echo "🔄 Testing coordination between different AI agents..."
    
    local agents=(
        "captain-picard:Strategic leadership perspective"
        "lieutenant-data:Technical analysis perspective" 
        "counselor-troi:Emotional intelligence perspective"
    )
    
    local coordination_query="Analyze our AlexAI project's current status and provide your perspective"
    local session_id="coordination_test_$(date +%s)"
    
    for agent_data in "${agents[@]}"; do
        local agent=$(echo "$agent_data" | cut -d':' -f1)
        local perspective=$(echo "$agent_data" | cut -d':' -f2-)
        
        echo "🤖 Testing agent: $agent"
        echo "Expected perspective: $perspective"
        
        local webhook_url="https://n8n.pbradygeorgen.com/webhook/$agent"
        
        local payload="{
            \"query\": \"$coordination_query\",
            \"sessionId\": \"$session_id\",
            \"context\": \"cross_agent_coordination\",
            \"timestamp\": \"$(date -Iseconds)\"
        }"
        
        local response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$payload" \
            "$webhook_url" 2>/dev/null || echo "ERROR")
        
        if echo "$response" | grep -q "ERROR"; then
            echo "❌ Agent $agent not responding"
        else
            # Check for agent-specific responses
            case "$agent" in
                "captain-picard")
                    if echo "$response" | grep -q -E "(strategic|command|make it so|enterprise)"; then
                        echo "🖖 Picard persona detected!"
                    fi
                    ;;
                "lieutenant-data")
                    if echo "$response" | grep -q -E "(analysis|data|technical|logical)"; then
                        echo "🤖 Data persona detected!"
                    fi
                    ;;
                "counselor-troi")
                    if echo "$response" | grep -q -E "(sense|feel|emotional|intuition)"; then
                        echo "💫 Troi persona detected!"
                    fi
                    ;;
            esac
            
            # Check for project awareness
            if echo "$response" | grep -q -E "(AlexAI|project|status|analysis)"; then
                echo "📊 Project context awareness confirmed!"
            fi
        fi
        
        echo ""
        sleep 2
    done
}

# Function: Test evolutionary adaptation
test_evolutionary_adaptation() {
    echo "🧬 EVOLUTIONARY ADAPTATION TEST"
    echo "==============================="
    echo ""
    
    echo "🔬 Testing AI agents' ability to evolve responses based on feedback..."
    
    local webhook_url="https://n8n.pbradygeorgen.com/webhook/crew-request"
    local evolution_session="evolution_$(date +%s)"
    
    # Evolution scenarios
    local evolution_tests=(
        "baseline:What is your current understanding of our project?"
        "feedback:That's good, but focus more on the technical architecture"
        "adaptation:Now tell me about the project with emphasis on technical details"
        "validation:How have you adapted your response based on my feedback?"
    )
    
    for test_data in "${evolution_tests[@]}"; do
        local test_type=$(echo "$test_data" | cut -d':' -f1)
        local query=$(echo "$test_data" | cut -d':' -f2-)
        
        echo "🧪 Evolution test: $test_type"
        echo "Query: $query"
        
        local payload="{
            \"query\": \"$query\",
            \"sessionId\": \"$evolution_session\",
            \"context\": \"evolutionary_adaptation\",
            \"testType\": \"$test_type\",
            \"timestamp\": \"$(date -Iseconds)\"
        }"
        
        local response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$payload" \
            "$webhook_url" 2>/dev/null || echo "ERROR")
        
        if echo "$response" | grep -q "ERROR"; then
            echo "❌ No evolutionary response"
        else
            # Analyze response for evolution
            if [[ "$test_type" == "adaptation" ]] && echo "$response" | grep -q -E "(technical|architecture|Next\.js|n8n|API)"; then
                echo "🧬 Evolutionary adaptation detected!"
            fi
            
            if [[ "$test_type" == "validation" ]] && echo "$response" | grep -q -E "(adapted|feedback|changed|modified)"; then
                echo "🔄 Self-awareness of adaptation confirmed!"
            fi
        fi
        
        echo ""
        sleep 3
    done
}

# Main execution
main() {
    echo "🎯 Starting AI self-evolution validation..."
    echo ""
    
    # Test 1: Learning progression
    test_learning_progression
    
    # Test 2: Cross-agent coordination  
    test_cross_agent_coordination
    
    # Test 3: Evolutionary adaptation
    test_evolutionary_adaptation
    
    echo "🏆 AI SELF-EVOLUTION VALIDATION COMPLETE"
    echo "========================================"
    echo ""
    echo "🎯 Summary:"
    echo "✅ Learning progression tested"
    echo "✅ Cross-agent coordination tested" 
    echo "✅ Evolutionary adaptation tested"
    echo ""
    echo "🧠 If AI agents are responding with contextual awareness,"
    echo "   learning indicators, and adaptive behavior, then"
    echo "   self-evolution is confirmed!"
    echo ""
    echo "🖖 Live long and prosper with evolving AI!"
}

# Execute the validation
main "$@"
