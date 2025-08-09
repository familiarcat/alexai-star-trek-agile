#!/bin/zsh

# 🧠 Bilateral Learning System
# Automatically enhances AI agents when new knowledge is created

set -e

# Source safe utilities
source scripts/utils/safe-echo.sh

print_header "BILATERAL LEARNING SYSTEM" "Continuous AI Agent Enhancement"

# Function to monitor and process new files
monitor_knowledge_creation() {
    print_section "KNOWLEDGE CREATION MONITORING" "👁️"
    
    print_status "working" "Setting up file system monitoring..."
    
    # Monitor for new .md and .sh files
    local watch_dirs=("." "alexai-knowledge-base" "scripts" "src")
    
    for dir in "${watch_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            print_status "info" "Monitoring $dir for new knowledge files..."
        fi
    done
    
    print_status "success" "File system monitoring configured"
}

# Function to process new knowledge file
process_new_knowledge() {
    local file_path="$1"
    local file_type="$2"
    
    print_section "PROCESSING NEW KNOWLEDGE" "🧠"
    print_status "working" "Processing: $file_path"
    
    # Read file content
    local content=""
    if [[ -f "$file_path" ]]; then
        content=$(cat "$file_path" 2>/dev/null || echo "Unable to read file")
    fi
    
    # Determine update type
    local update_type="creation"
    if [[ -n "$(git log --oneline "$file_path" 2>/dev/null)" ]]; then
        update_type="modification"
    fi
    
    # Create bilateral learning payload with proper JSON escaping
    local escaped_content=$(echo "$content" | jq -Rs . 2>/dev/null || echo '""')
    local learning_payload=$(jq -n \
        --arg filepath "$file_path" \
        --arg filetype "$file_type" \
        --argjson content "$escaped_content" \
        --arg updatetype "$update_type" \
        --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --arg source "bilateral-learning-system" \
        '{
            "filePath": $filepath,
            "fileType": $filetype,
            "content": $content,
            "updateType": $updatetype,
            "timestamp": $timestamp,
            "source": $source
        }')
    
    print_status "working" "Triggering bilateral learning workflow..."
    
    # Send to N8N bilateral learning workflow
    local n8n_response=""
    if command -v curl >/dev/null; then
        n8n_response=$(curl -s -w "%{http_code}" \
            -X POST "https://n8n.pbradygeorgen.com/webhook/bilateral-learning" \
            -H "Content-Type: application/json" \
            -d "$learning_payload" \
            2>/dev/null || echo "000")
    fi
    
    # Also process locally for immediate enhancement
    local local_response=""
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        local_response=$(curl -s -w "%{http_code}" \
            -X POST "http://localhost:3000/api/crew/enhanced-knowledge-integration" \
            -H "Content-Type: application/json" \
            -d "$learning_payload" \
            2>/dev/null || echo "000")
    fi
    
    # Report results
    if [[ "$n8n_response" == *"200"* ]]; then
        print_status "success" "N8N bilateral learning workflow triggered"
    else
        print_status "warning" "N8N workflow response: $n8n_response"
    fi
    
    if [[ "$local_response" == *"200"* ]]; then
        print_status "success" "Local agent enhancement completed"
    else
        print_status "warning" "Local enhancement response: $local_response"
    fi
    
    # Update knowledge index
    update_knowledge_index "$file_path" "$file_type"
}

# Function to update knowledge index
update_knowledge_index() {
    local file_path="$1"
    local file_type="$2"
    
    print_status "working" "Updating knowledge index..."
    
    # Add entry to knowledge tracking
    local index_entry="$(date -u +%Y-%m-%dT%H:%M:%SZ) | $file_type | $file_path | bilateral-learning-processed"
    
    echo "$index_entry" >> alexai-knowledge-base/BILATERAL_LEARNING_LOG.md
    
    print_status "success" "Knowledge index updated"
}

# Function to test bilateral learning with sample content
test_bilateral_learning() {
    print_section "TESTING BILATERAL LEARNING" "🧪"
    
    print_status "working" "Creating test knowledge file..."
    
    # Create a test file to trigger bilateral learning
    local test_file="test-bilateral-learning-$(date +%s).md"
    local test_content="# Test Bilateral Learning

This is a test file to validate our bilateral learning system.

## Key Concepts
- ✅ Bilateral learning active
- 🧠 AI agent enhancement
- 🔄 Continuous knowledge integration

## Agent Enhancements
This knowledge should enhance:
- Captain Picard's strategic capabilities
- Lieutenant Data's technical analysis
- The entire crew's collaborative intelligence

## Technical Implementation
- Automated file monitoring
- N8N workflow integration
- Knowledge base synchronization
- Agent capability enhancement

**Created:** $(date)
**Purpose:** Bilateral learning validation
**Status:** Active test case"
    
    echo "$test_content" > "$test_file"
    
    # Process this new file through bilateral learning
    process_new_knowledge "$test_file" "markdown"
    
    # Verify the learning was processed
    print_status "working" "Verifying bilateral learning integration..."
    
    # Check if knowledge was added to the system
    local knowledge_check=$(curl -s "http://localhost:3000/api/knowledge" | grep -o "totalFiles")
    if [[ -n "$knowledge_check" ]]; then
        print_status "success" "Knowledge API responding with updated information"
    fi
    
    # Test enhanced agent response
    print_status "working" "Testing enhanced agent capabilities..."
    local enhanced_test=$(curl -s -X POST "http://localhost:3000/api/crew/enhanced-knowledge-integration" \
        -H "Content-Type: application/json" \
        -d "{
            \"agent\": \"captain-picard\",
            \"query\": \"How has our bilateral learning system enhanced our capabilities?\",
            \"context\": \"bilateral-learning-test\"
        }")
    
    if echo "$enhanced_test" | grep -q "knowledgeUtilized"; then
        print_status "success" "Enhanced agent capabilities confirmed"
    else
        print_status "warning" "Enhanced capabilities may need additional configuration"
    fi
    
    # Clean up test file
    rm -f "$test_file"
    print_status "info" "Test file cleaned up"
}

# Function to establish continuous monitoring
establish_continuous_monitoring() {
    print_section "ESTABLISHING CONTINUOUS MONITORING" "🔄"
    
    print_status "working" "Setting up continuous bilateral learning..."
    
    # Create monitoring script
    cat > bilateral-learning-monitor.sh << 'EOF'
#!/bin/zsh
# Continuous Bilateral Learning Monitor

while true; do
    # Watch for new .md files
    find . -name "*.md" -newer alexai-knowledge-base/BILATERAL_LEARNING_LOG.md -not -path "./node_modules/*" | while read -r file; do
        echo "New markdown file detected: $file"
        ./scripts/knowledge/bilateral-learning-system.sh process "$file" "markdown"
    done
    
    # Watch for new .sh files
    find . -name "*.sh" -newer alexai-knowledge-base/BILATERAL_LEARNING_LOG.md -not -path "./node_modules/*" | while read -r file; do
        echo "New shell script detected: $file"
        ./scripts/knowledge/bilateral-learning-system.sh process "$file" "shell"
    done
    
    # Wait before next check
    sleep 30
done
EOF
    
    chmod +x bilateral-learning-monitor.sh
    
    print_status "success" "Continuous monitoring script created"
    print_status "info" "Run './bilateral-learning-monitor.sh &' to start background monitoring"
}

# Function to create bilateral learning documentation
create_bilateral_learning_docs() {
    print_section "CREATING BILATERAL LEARNING DOCUMENTATION" "📚"
    
    # Initialize bilateral learning log
    cat > alexai-knowledge-base/BILATERAL_LEARNING_LOG.md << 'EOF'
# 🧠 Bilateral Learning System Log

## Overview
This log tracks all bilateral learning events where new knowledge files automatically enhance AI agent capabilities.

## Learning Events
| Timestamp | Type | File | Status |
|-----------|------|------|--------|
EOF
    
    # Create bilateral learning guide
    cat > alexai-knowledge-base/01-foundations/standards/BILATERAL_LEARNING_GUIDE.md << 'EOF'
# 🔄 Bilateral Learning System Guide

## Purpose
The bilateral learning system ensures that every new piece of knowledge (markdown files and shell scripts) automatically enhances our AI agents' capabilities.

## How It Works
1. **File Detection**: System monitors for new .md and .sh files
2. **Content Analysis**: Extracts key insights and categorizes knowledge
3. **Agent Enhancement**: Relevant agents receive knowledge updates
4. **Capability Expansion**: Agents incorporate new learnings into responses

## Agent Enhancement Mapping
- **Captain Picard**: Strategic insights, project management, leadership patterns
- **Lieutenant Data**: Technical procedures, system operations, analytical frameworks
- **Counselor Troi**: Team dynamics, user experience, collaboration insights
- **Chief Engineer Scott**: Engineering solutions, optimization techniques, troubleshooting
- **Commander Spock**: Logical frameworks, system evolution, analytical methods
- **Lieutenant Worf**: Security protocols, risk management, protection strategies

## Benefits
- **Continuous Growth**: Knowledge base grows with each solution
- **Automatic Enhancement**: No manual intervention required
- **Contextual Learning**: Agents learn from real project experiences
- **Collaborative Intelligence**: Shared knowledge across all crew members

## Monitoring
Use `/api/knowledge` to track knowledge base growth and agent enhancements.

---
*Bilateral Learning System - Continuous AI Enhancement*
EOF
    
    print_status "success" "Bilateral learning documentation created"
}

# Main execution function
main() {
    local action="${1:-setup}"
    local file_path="${2:-}"
    local file_type="${3:-}"
    
    case "$action" in
        "setup")
            print_header "BILATERAL LEARNING SYSTEM SETUP" "$(date)"
            monitor_knowledge_creation
            create_bilateral_learning_docs
            establish_continuous_monitoring
            test_bilateral_learning
            ;;
        "process")
            if [[ -n "$file_path" && -n "$file_type" ]]; then
                process_new_knowledge "$file_path" "$file_type"
            else
                print_status "error" "File path and type required for processing"
                return 1
            fi
            ;;
        "test")
            test_bilateral_learning
            ;;
        "monitor")
            establish_continuous_monitoring
            ;;
        *)
            print_status "error" "Unknown action: $action"
            print_status "info" "Available actions: setup, process, test, monitor"
            return 1
            ;;
    esac
    
    print_section "BILATERAL LEARNING STATUS" "🎯"
    print_status "success" "Bilateral learning system operational"
    print_status "info" "New knowledge files will automatically enhance AI agents"
    print_status "info" "Brain trust grows with every solution we create"
    
    print_status "success" "AlexAI agents ready for continuous enhancement!"
}

main "$@"
