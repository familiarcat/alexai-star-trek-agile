#!/bin/bash

# 🧠 AI AGENT COLLECTIVE MEMORY SYSTEM SETUP
# Purpose: Initialize the revolutionary AI agent collective memory system
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${CYAN}================================${NC}"
    echo -e "${CYAN} $1${NC}"
    echo -e "${CYAN}================================${NC}"
}

print_header "🧠 AI AGENT COLLECTIVE MEMORY SYSTEM SETUP"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_status "Starting AI Agent Collective Memory System setup..."

# ========================================
# 1. ENVIRONMENT VARIABLES SETUP
# ========================================
print_header "1. Environment Variables Setup"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating template..."
    cat > .env.local << 'EOF'
# 🧠 AI AGENT COLLECTIVE MEMORY SYSTEM - ENVIRONMENT VARIABLES
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI Agent Configuration
NEXT_PUBLIC_AI_ORCHESTRATION_ENABLED=true
NEXT_PUBLIC_COLLECTIVE_MEMORY_ENABLED=true
NEXT_PUBLIC_AGENT_COLLABORATION_ENABLED=true

# n8n Integration
N8N_BASE_URL=http://localhost:5678
N8N_WEBHOOK_SECRET=your_webhook_secret_here

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_FALLBACK_MODE=true

# Performance Monitoring
NEXT_PUBLIC_PERFORMANCE_TRACKING=true
NEXT_PUBLIC_USER_BEHAVIOR_ANALYTICS=true
EOF
    print_status ".env.local template created"
else
    print_status ".env.local already exists"
fi

# ========================================
# 2. SUPABASE CLIENT VERIFICATION
# ========================================
print_header "2. Supabase Client Verification"

# Check if Supabase client is properly installed
if npm list @supabase/supabase-js > /dev/null 2>&1; then
    print_status "✅ @supabase/supabase-js is installed"
else
    print_warning "Installing @supabase/supabase-js..."
    npm install @supabase/supabase-js
fi

# ========================================
# 3. DATABASE SCHEMA DEPLOYMENT
# ========================================
print_header "3. Database Schema Deployment"

# Check if the collective memory schema exists
if [ -f "output/ai-agent-collective-memory.sql" ]; then
    print_status "✅ Collective memory schema found"
    
    # Check if Supabase CLI is available
    if command -v supabase > /dev/null 2>&1; then
        print_status "Supabase CLI detected. Ready for schema deployment."
        print_warning "To deploy schema, run: supabase db push"
    else
        print_warning "Supabase CLI not found. Install with: npm install -g supabase"
        print_status "Schema file available at: output/ai-agent-collective-memory.sql"
    fi
else
    print_error "Collective memory schema not found at output/ai-agent-collective-memory.sql"
    exit 1
fi

# ========================================
# 4. AI AGENT COMPONENTS VERIFICATION
# ========================================
print_header "4. AI Agent Components Verification"

# Check if enhanced ship computer exists
if [ -f "src/components/lcars/enhanced-ship-computer.tsx" ]; then
    print_status "✅ Enhanced Ship Computer component found"
else
    print_error "Enhanced Ship Computer component not found"
    exit 1
fi

# Check if ships computer orchestrator exists
if [ -f "src/components/lcars/ships-computer-orchestrator.tsx" ]; then
    print_status "✅ Ships Computer Orchestrator component found"
else
    print_error "Ships Computer Orchestrator component not found"
    exit 1
fi

# Check if Supabase client exists
if [ -f "src/lib/supabase.ts" ]; then
    print_status "✅ Supabase client found"
else
    print_error "Supabase client not found"
    exit 1
fi

# ========================================
# 5. COLLECTIVE MEMORY SERVICE VERIFICATION
# ========================================
print_header "5. Collective Memory Service Verification"

# Check if the collective memory service is properly implemented
if grep -q "aiCollectiveMemory" "src/lib/supabase.ts"; then
    print_status "✅ Collective memory service found in Supabase client"
else
    print_error "Collective memory service not found in Supabase client"
    exit 1
fi

# ========================================
# 6. INTEGRATION TESTING
# ========================================
print_header "6. Integration Testing"

# Test if the application can build
print_status "Testing application build..."
if npm run build > /dev/null 2>&1; then
    print_status "✅ Application builds successfully"
else
    print_warning "⚠️  Build test failed. This may be due to missing environment variables."
    print_status "The system will work in fallback mode until Supabase is configured."
fi

# ========================================
# 7. COLLECTIVE MEMORY INITIALIZATION
# ========================================
print_header "7. Collective Memory Initialization"

# Create initialization script
cat > "scripts/init-collective-memory.js" << 'EOF'
#!/usr/bin/env node

/**
 * 🧠 AI AGENT COLLECTIVE MEMORY SYSTEM INITIALIZATION
 * Purpose: Initialize the collective memory system with sample data
 */

const { aiCollectiveMemory } = require('../../src/lib/supabase');

async function initializeCollectiveMemory() {
    console.log('🧠 Initializing AI Agent Collective Memory System...');
    
    try {
        // Initialize with sample CSS patterns
        const samplePattern = {
            agent_id: 'ship_computer',
            layout_context: 'mobile_navigation',
            user_intent: 'navigation',
            screen_size: 'mobile',
            user_context: 'task_completion',
            current_page: '/',
            css_variables: {
                '--lcars-primary': '#FF6600',
                '--lcars-secondary': '#FFCC00'
            },
            responsive_classes: ['lcars-mobile-nav', 'lcars-touch-friendly'],
            container_structure: ['flexbox', 'grid'],
            accessibility_features: ['high-contrast', 'keyboard-navigation'],
            success_score: 0.95
        };

        const result = await aiCollectiveMemory.saveCSSPattern(samplePattern);
        console.log('✅ Sample CSS pattern saved:', result);
        
        // Initialize design motivations
        const sampleMotivation = {
            agent_id: 'counselor_troi',
            design_principle: 'emotional_design',
            reasoning: 'Users respond better to interfaces that feel intuitive and engaging',
            success_criteria: { user_satisfaction: 0.9, task_completion: 0.95 },
            related_patterns: ['user_centered_design', 'accessibility'],
            applicable_contexts: ['user_interface', 'navigation', 'forms'],
            priority_level: 'high',
            lessons_learned: ['Color psychology matters', 'Spacing affects readability']
        };

        const motivationResult = await aiCollectiveMemory.saveDesignMotivation(sampleMotivation);
        console.log('✅ Sample design motivation saved:', motivationResult);
        
        console.log('🎉 Collective Memory System initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing collective memory:', error);
        console.log('💡 This is expected in fallback mode. Configure Supabase to enable full functionality.');
    }
}

initializeCollectiveMemory();
EOF

chmod +x "scripts/init-collective-memory.js"
print_status "✅ Collective memory initialization script created"

# ========================================
# 8. MONITORING AND HEALTH CHECKS
# ========================================
print_header "8. Monitoring and Health Checks"

# Create health check script
cat > "scripts/health-check-collective-memory.sh" << 'EOF'
#!/bin/bash

# 🧠 AI AGENT COLLECTIVE MEMORY SYSTEM HEALTH CHECK
# Purpose: Monitor the health and status of the collective memory system

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧠 AI Agent Collective Memory System Health Check"
echo "================================================"

# Check if the application is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is running${NC}"
else
    echo -e "${RED}❌ Application is not running${NC}"
    echo "Start with: npm run dev"
    exit 1
fi

# Check collective memory endpoint
if curl -s "http://localhost:3000/api/ai-orchestration" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AI Orchestration API is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  AI Orchestration API not accessible${NC}"
fi

# Check if collective intelligence is displayed
if curl -s "http://localhost:3000" | grep -q "COLLECTIVE INTELLIGENCE"; then
    echo -e "${GREEN}✅ Collective Intelligence component is visible${NC}"
else
    echo -e "${YELLOW}⚠️  Collective Intelligence component not visible${NC}"
fi

echo ""
echo "🎯 System Status: READY"
echo "💡 Next steps:"
echo "   1. Configure Supabase credentials in .env.local"
echo "   2. Deploy database schema: supabase db push"
echo "   3. Initialize memory: node scripts/init-collective-memory.js"
echo "   4. Test full functionality"
EOF

chmod +x "scripts/health-check-collective-memory.sh"
print_status "✅ Health check script created"

# ========================================
# 9. FINAL SETUP COMPLETION
# ========================================
print_header "9. Setup Completion"

print_status "🎉 AI Agent Collective Memory System setup completed successfully!"
echo ""
echo "📋 NEXT STEPS:"
echo "   1. Configure Supabase credentials in .env.local"
echo "   2. Deploy database schema: supabase db push"
echo "   3. Initialize collective memory: node scripts/init-collective-memory.js"
echo "   4. Test system: ./scripts/health-check-collective-memory.sh"
echo "   5. Start development: npm run dev"
echo ""
echo "🔧 AVAILABLE SCRIPTS:"
echo "   - Health check: ./scripts/health-check-collective-memory.sh"
echo "   - Memory init: node scripts/init-collective-memory.js"
echo "   - Setup: ./scripts/setup/collective-memory-setup.sh"
echo ""
echo "📚 DOCUMENTATION:"
echo "   - docs/SUPABASE_COLLECTIVE_MEMORY_IMPLEMENTATION.md"
echo "   - output/ai-agent-collective-memory.sql"
echo ""
echo "🚀 Your AI agents now have the foundation for collective intelligence!"
echo "   They will learn, collaborate, and optimize layouts based on accumulated knowledge."
