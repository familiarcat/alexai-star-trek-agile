#!/bin/bash

# 🚀 Local Ship Computer Testing Setup
# Sets up the local environment for testing the Ship Computer with all multimodal agents
# in the n8n bidirectional framework

set -e

echo "🚀 LOCAL SHIP COMPUTER TESTING SETUP"
echo "===================================="
echo "Setting up environment for multimodal agent testing"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
    echo -e "${RED}❌ Error: Not in project root directory${NC}"
    echo "   Please run this script from the project root"
    exit 1
fi

echo -e "${GREEN}✅ Project root confirmed: ${PROJECT_ROOT}${NC}"
echo ""

# Check required tools
check_requirements() {
    echo -e "${CYAN}🔍 Checking system requirements...${NC}"
    echo ""
    
    local missing_tools=()
    
    # Check for curl
    if ! command -v curl &> /dev/null; then
        missing_tools+=("curl")
    else
        echo -e "${GREEN}✅ curl: Available${NC}"
    fi
    
    # Check for jq
    if ! command -v jq &> /dev/null; then
        missing_tools+=("jq")
    else
        echo -e "${GREEN}✅ jq: Available${NC}"
    fi
    
    # Check for bc (for calculations)
    if ! command -v bc &> /dev/null; then
        missing_tools+=("bc")
    else
        echo -e "${GREEN}✅ bc: Available${NC}"
    fi
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        missing_tools+=("node")
    else
        echo -e "${GREEN}✅ Node.js: Available${NC}"
    fi
    
    # Check for npm
    if ! command -v npm &> /dev/null; then
        missing_tools+=("npm")
    else
        echo -e "${GREEN}✅ npm: Available${NC}"
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo ""
        echo -e "${RED}❌ Missing required tools: ${missing_tools[*]}${NC}"
        echo ""
        echo "Please install the missing tools:"
        for tool in "${missing_tools[@]}"; do
            case $tool in
                "curl")
                    echo "   - curl: brew install curl (macOS) or apt-get install curl (Ubuntu)"
                    ;;
                "jq")
                    echo "   - jq: brew install jq (macOS) or apt-get install jq (Ubuntu)"
                    ;;
                "bc")
                    echo "   - bc: brew install bc (macOS) or apt-get install bc (Ubuntu)"
                    ;;
                "node")
                    echo "   - Node.js: Visit https://nodejs.org/ or use nvm"
                    ;;
                "npm")
                    echo "   - npm: Usually comes with Node.js"
                    ;;
            esac
        done
        echo ""
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}✅ All required tools are available${NC}"
    echo ""
}

# Setup environment variables
setup_environment() {
    echo -e "${CYAN}🔧 Setting up environment variables...${NC}"
    echo ""
    
    # Check if .env file exists
    local env_file="${PROJECT_ROOT}/.env.local"
    
    if [[ ! -f "$env_file" ]]; then
        echo "Creating .env.local file..."
        cat > "$env_file" << 'EOF'
# Local Development Environment Variables
# Ship Computer Testing Configuration

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_N8N_BASE_URL=https://n8n.pbradygeorgen.com

# API Keys (set these from your ~/.zshrc)
OPENROUTER_API_KEY=${OPENROUTER_API_KEY}

# Development Settings
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Local Testing URLs
SHIP_COMPUTER_WEBHOOK=https://n8n.pbradygeorgen.com/webhook/ships-computer
CREW_WEBHOOK=https://n8n.pbradygeorgen.com/webhook/crew-request

# Test Configuration
TEST_TIMEOUT=30000
TEST_RETRIES=3
EOF
        echo -e "${GREEN}✅ Created .env.local file${NC}"
    else
        echo -e "${GREEN}✅ .env.local file already exists${NC}"
    fi
    
    # Check for required environment variables
    echo ""
    echo -e "${CYAN}🔑 Checking environment variables...${NC}"
    
    if [[ -n "$OPENROUTER_API_KEY" ]]; then
        echo -e "${GREEN}✅ OPENROUTER_API_KEY: Set${NC}"
    else
        echo -e "${YELLOW}⚠️  OPENROUTER_API_KEY: Not set${NC}"
        echo "   Set it with: export OPENROUTER_API_KEY='your-key'"
        echo "   Or add it to your ~/.zshrc file"
    fi
    
    if [[ -n "$N8N_BASE_URL" ]]; then
        echo -e "${GREEN}✅ N8N_BASE_URL: $N8N_BASE_URL${NC}"
    else
        echo -e "${GREEN}✅ N8N_BASE_URL: Using default (https://n8n.pbradygeorgen.com)${NC}"
    fi
    
    echo ""
}

# Install dependencies
install_dependencies() {
    echo -e "${CYAN}📦 Installing project dependencies...${NC}"
    echo ""
    
    cd "$PROJECT_ROOT"
    
    if [[ ! -d "node_modules" ]]; then
        echo "Installing npm dependencies..."
        npm install
        echo -e "${GREEN}✅ Dependencies installed${NC}"
    else
        echo -e "${GREEN}✅ Dependencies already installed${NC}"
    fi
    
    echo ""
}

# Setup test scripts
setup_test_scripts() {
    echo -e "${CYAN}🧪 Setting up test scripts...${NC}"
    echo ""
    
    # Make test scripts executable
    local test_scripts=(
        "scripts/test/test-ship-computer-multimodal.sh"
        "scripts/test/test-enhanced-ship-agency.sh"
    )
    
    for script in "${test_scripts[@]}"; do
        local script_path="${PROJECT_ROOT}/${script}"
        if [[ -f "$script_path" ]]; then
            chmod +x "$script_path"
            echo -e "${GREEN}✅ Made executable: $script${NC}"
        else
            echo -e "${YELLOW}⚠️  Script not found: $script${NC}"
        fi
    done
    
    echo ""
}

# Create local test configuration
create_test_config() {
    echo -e "${CYAN}⚙️  Creating local test configuration...${NC}"
    echo ""
    
    local test_config="${PROJECT_ROOT}/test-config.json"
    
    cat > "$test_config" << 'EOF'
{
  "shipComputer": {
    "localTesting": true,
    "webhookUrl": "https://n8n.pbradygeorgen.com/webhook/ships-computer",
    "crewWebhookUrl": "https://n8n.pbradygeorgen.com/webhook/crew-request",
    "timeout": 30000,
    "retries": 3
  },
  "testScenarios": {
    "strategic": {
      "name": "Strategic Leadership Mission",
      "expectedCrew": ["captain-picard", "commander-spock"],
      "expectedUI": "strategic-command-layout"
    },
    "technical": {
      "name": "Technical Engineering Mission",
      "expectedCrew": ["lieutenant-data", "chief-engineer-scott"],
      "expectedUI": "engineering-technical-layout"
    },
    "tactical": {
      "name": "Tactical Security Mission",
      "expectedCrew": ["lieutenant-worf"],
      "expectedUI": "tactical-security-layout"
    },
    "emotional": {
      "name": "Emotional Intelligence Mission",
      "expectedCrew": ["counselor-troi"],
      "expectedUI": "counseling-empathetic-layout"
    },
    "scientific": {
      "name": "Scientific Analysis Mission",
      "expectedCrew": ["lieutenant-data", "observation-lounge"],
      "expectedUI": "scientific-research-layout"
    },
    "emergency": {
      "name": "Critical Emergency Mission",
      "expectedCrew": ["all-crew"],
      "expectedUI": "emergency-critical-layout"
    }
  },
  "uiPreferences": [
    "minimal",
    "detailed",
    "emergency",
    "training",
    "research",
    "command-focused",
    "technical-detailed",
    "tactical-focused",
    "empathetic-focused",
    "scientific-detailed",
    "coordination-focused",
    "data-focused",
    "diplomatic-focused",
    "integration-focused"
  ]
}
EOF
    
    echo -e "${GREEN}✅ Created test configuration: test-config.json${NC}"
    echo ""
}

# Create quick start script
create_quick_start() {
    echo -e "${CYAN}🚀 Creating quick start script...${NC}"
    echo ""
    
    local quick_start="${PROJECT_ROOT}/start-ship-computer-testing.sh"
    
    cat > "$quick_start" << 'EOF'
#!/bin/bash

# 🚀 Quick Start Script for Ship Computer Testing
# Run this to start testing the Ship Computer with all multimodal agents

set -e

echo "🚀 STARTING SHIP COMPUTER TESTING"
echo "================================="
echo ""

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: Please run this script from the project root"
    exit 1
fi

# Start the Next.js development server
echo "🌐 Starting Next.js development server..."
echo "   This will start the Ship Computer UI at http://localhost:3000"
echo ""

# Start the server in the background
npm run dev &
DEV_PID=$!

echo "✅ Development server started (PID: $DEV_PID)"
echo ""

# Wait a moment for the server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running at http://localhost:3000"
    echo ""
    echo "🎯 Ship Computer UI is ready for testing!"
    echo ""
    echo "📋 Available test endpoints:"
    echo "   • Main UI: http://localhost:3000"
    echo "   • Workflow Management: http://localhost:3000/workflow-management"
    echo "   • Observation Lounge: http://localhost:3000/observation-lounge"
    echo ""
    echo "🧪 Run tests with:"
    echo "   • ./scripts/test/test-ship-computer-multimodal.sh"
    echo "   • ./scripts/test/test-enhanced-ship-agency.sh"
    echo ""
    echo "🔄 To stop the server, run: kill $DEV_PID"
    echo ""
    echo "🖖 Live long and prosper! The Ship Computer awaits your commands!"
    echo ""
    
    # Keep the script running
    wait $DEV_PID
else
    echo "❌ Server failed to start"
    kill $DEV_PID 2>/dev/null || true
    exit 1
fi
EOF
    
    chmod +x "$quick_start"
    echo -e "${GREEN}✅ Created quick start script: start-ship-computer-testing.sh${NC}"
    echo ""
}

# Create development guide
create_development_guide() {
    echo -e "${CYAN}📚 Creating development guide...${NC}"
    echo ""
    
    local guide_file="${PROJECT_ROOT}/SHIP_COMPUTER_TESTING_GUIDE.md"
    
    cat > "$guide_file" << 'EOF'
# 🚀 Ship Computer Testing Guide

## 🎯 Overview

This guide helps you test the Ship Computer's ability to dynamically generate UI based on user intent, with all multimodal agents active in the n8n bidirectional framework.

## 🚀 Quick Start

### 1. Start Local Testing
```bash
# Start the development server and testing environment
./start-ship-computer-testing.sh
```

### 2. Run Comprehensive Tests
```bash
# Test all multimodal agents and UI generation
./scripts/test/test-ship-computer-multimodal.sh

# Test enhanced ship agency
./scripts/test/test-enhanced-ship-agency.sh
```

## 🧪 Test Scenarios

### Strategic Leadership Mission
- **Query**: "Develop diplomatic strategy for first contact with unknown species"
- **Expected Crew**: Captain Picard + Commander Spock
- **Expected UI**: Strategic command layout

### Technical Engineering Mission
- **Query**: "Analyze warp core efficiency and optimize power distribution"
- **Expected Crew**: Lieutenant Data + Chief Engineer Scott
- **Expected UI**: Engineering technical layout

### Tactical Security Mission
- **Query**: "Assess security protocols for entering hostile territory"
- **Expected Crew**: Lieutenant Worf
- **Expected UI**: Tactical security layout

### Emotional Intelligence Mission
- **Query**: "Help resolve crew conflict in engineering department"
- **Expected Crew**: Counselor Troi
- **Expected UI**: Counseling empathetic layout

### Scientific Analysis Mission
- **Query**: "Comprehensive analysis of unknown spatial anomaly"
- **Expected Crew**: Lieutenant Data + Observation Lounge
- **Expected UI**: Scientific research layout

### Critical Emergency Mission
- **Query**: "Critical system failure - warp core breach imminent"
- **Expected Crew**: All Crew
- **Expected UI**: Emergency critical layout

## 🎨 UI Preferences Testing

Test different interface preferences:
- `minimal` - Quick status check
- `detailed` - Detailed system analysis
- `emergency` - Emergency protocol
- `training` - Training simulation
- `research` - Research mode
- `command-focused` - Strategic leadership
- `technical-detailed` - Engineering tasks
- `tactical-focused` - Security operations
- `empathetic-focused` - Counseling tasks
- `scientific-detailed` - Research analysis
- `coordination-focused` - Multi-crew operations
- `data-focused` - Data analysis
- `diplomatic-focused` - Negotiation tasks
- `integration-focused` - System integration

## 🔧 Configuration

### Environment Variables
Set these in your `~/.zshrc` or `.env.local`:
```bash
export OPENROUTER_API_KEY="your-openrouter-api-key"
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
```

### Test Configuration
The test configuration is stored in `test-config.json` and includes:
- Test scenarios with expected crew and UI layouts
- UI preference options
- Local testing settings

## 🚀 Testing Workflow

### 1. Local Development
```bash
# Start development server
npm run dev

# Access Ship Computer UI
open http://localhost:3000
```

### 2. Run Tests
```bash
# Comprehensive testing
./scripts/test/test-ship-computer-multimodal.sh

# Specific scenario testing
curl -X POST "https://n8n.pbradygeorgen.com/webhook/ships-computer" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Test query",
    "context": "testing",
    "userRole": "developer",
    "urgency": "low",
    "complexity": "low"
  }'
```

### 3. Analyze Results
- Review test output for crew selection accuracy
- Check UI layout generation quality
- Monitor response times and performance
- Identify areas for improvement

## 🔍 Debugging

### Check n8n Workflows
1. Visit https://n8n.pbradygeorgen.com
2. Check workflow execution logs
3. Verify webhook endpoints are active
4. Review environment variable configuration

### Local Debugging
1. Check browser console for errors
2. Review Next.js development logs
3. Verify environment variables are loaded
4. Check network requests in browser dev tools

## 📊 Expected Results

### Successful Test Run
- All tests pass with green checkmarks
- Crew selection matches expected patterns
- UI layout generation produces valid responses
- Response times under 5 seconds
- Error handling works gracefully

### Common Issues
- **Webhook failures**: Check n8n workflow status
- **Authentication errors**: Verify API keys
- **Timeout issues**: Check network connectivity
- **Invalid responses**: Review workflow logic

## 🎯 Next Steps

After successful testing:

1. **Refine Logic**: Use test results to improve crew selection
2. **Optimize UI**: Enhance layout generation based on feedback
3. **Performance**: Optimize response times and reliability
4. **Deploy**: Push improvements to production n8n instance
5. **Monitor**: Set up ongoing testing and monitoring

## 🖖 Live Long and Prosper!

The Ship Computer is ready to serve the Enterprise and its crew. May your testing be thorough and your discoveries be enlightening!
EOF
    
    echo -e "${GREEN}✅ Created development guide: SHIP_COMPUTER_TESTING_GUIDE.md${NC}"
    echo ""
}

# Main execution
main() {
    echo "🎯 Starting local Ship Computer testing setup..."
    echo ""
    
    # Check requirements
    check_requirements
    
    # Setup environment
    setup_environment
    
    # Install dependencies
    install_dependencies
    
    # Setup test scripts
    setup_test_scripts
    
    # Create test configuration
    create_test_config
    
    # Create quick start script
    create_quick_start
    
    # Create development guide
    create_development_guide
    
    echo ""
    echo -e "${GREEN}🎉 LOCAL SHIP COMPUTER TESTING SETUP COMPLETE!${NC}"
    echo "=================================================="
    echo ""
    echo "✅ Environment configured for local testing"
    echo "✅ Test scripts ready and executable"
    echo "✅ Configuration files created"
    echo "✅ Development guide available"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Set OPENROUTER_API_KEY in your ~/.zshrc"
    echo "   2. Run: ./start-ship-computer-testing.sh"
    echo "   3. Test with: ./scripts/test/test-ship-computer-multimodal.sh"
    echo ""
    echo "🌐 Access the Ship Computer UI at: http://localhost:3000"
    echo "📚 Read the guide: SHIP_COMPUTER_TESTING_GUIDE.md"
    echo ""
    echo "🖖 Live long and prosper! The Ship Computer awaits your commands!"
    echo ""
}

# Execute main function
main "$@"
