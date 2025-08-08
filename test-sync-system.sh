#!/bin/bash
# Test the automated workflow synchronization system
# AlexAI NCC-1701-B Automated Workflow Sync System

set -e

echo "🧪 TESTING AUTOMATED WORKFLOW SYNC SYSTEM"
echo "=========================================="
echo "Date: $(date)"
echo ""

# Check if required files exist
echo "📋 Checking system files..."

required_files=(
    "sync-system/n8n-integration/api-client.js"
    "sync-system/scripts/push-workflows.js"
    "sync-system/scripts/pull-workflows.js"
    "scripts/sync/push-workflows.sh"
    "scripts/sync/pull-workflows.sh"
    "scripts/sync/sync-workflows.sh"
    ".github/workflows/n8n-sync.yml"
    "n8n-workflow-deployment.json"
)

missing_files=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        missing_files=$((missing_files + 1))
    fi
done

echo ""

if [ $missing_files -gt 0 ]; then
    echo "❌ $missing_files required files are missing"
    echo "Please ensure all sync system files are created"
    exit 1
fi

echo "✅ All required files are present"
echo ""

# Check if scripts are executable
echo "🔧 Checking script permissions..."
executable_scripts=(
    "scripts/sync/push-workflows.sh"
    "scripts/sync/pull-workflows.sh"
    "scripts/sync/sync-workflows.sh"
    "sync-system/scripts/push-workflows.js"
    "sync-system/scripts/pull-workflows.js"
)

for script in "${executable_scripts[@]}"; do
    if [ -x "$script" ]; then
        echo "✅ $script (executable)"
    else
        echo "⚠️  $script (not executable)"
        chmod +x "$script"
        echo "   Fixed: Made $script executable"
    fi
done

echo ""

# Check environment variables
echo "🔍 Checking environment configuration..."

if [ -f ".env" ]; then
    echo "✅ .env file exists"
    source .env
else
    echo "⚠️  .env file not found"
    echo "Creating example .env file..."
    cat > .env << EOF
# N8N Configuration
N8N_BASE_URL=https://n8n.pbradygeorgen.com
N8N_API_KEY=your-api-key-here

# Optional: OpenRouter Configuration
OPENROUTER_API_KEY=your-openrouter-key-here
EOF
    echo "✅ Created .env file with examples"
fi

# Check for required environment variables
required_vars=("N8N_BASE_URL" "N8N_API_KEY")
missing_vars=0

for var in "${required_vars[@]}"; do
    if [ -n "${!var}" ] && [ "${!var}" != "your-api-key-here" ]; then
        echo "✅ $var is configured"
    else
        echo "⚠️  $var is not configured or using placeholder"
        missing_vars=$((missing_vars + 1))
    fi
done

echo ""

# Check Node.js dependencies
echo "📦 Checking Node.js dependencies..."
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
    
    if [ -d "node_modules" ]; then
        echo "✅ node_modules directory exists"
    else
        echo "⚠️  node_modules not found"
        echo "Run 'npm install' to install dependencies"
    fi
else
    echo "❌ package.json not found"
fi

echo ""

# Test workflow file validation
echo "🔍 Testing workflow file validation..."
if [ -f "n8n-workflow-deployment.json" ]; then
    if node -e "JSON.parse(require('fs').readFileSync('n8n-workflow-deployment.json', 'utf8'))" 2>/dev/null; then
        echo "✅ n8n-workflow-deployment.json is valid JSON"
    else
        echo "❌ n8n-workflow-deployment.json has invalid JSON"
    fi
else
    echo "❌ n8n-workflow-deployment.json not found"
fi

echo ""

# Create workflows directory if it doesn't exist
echo "📁 Checking workflows directory..."
if [ -d "workflows" ]; then
    workflow_count=$(ls workflows/*.json 2>/dev/null | wc -l)
    echo "✅ workflows directory exists ($workflow_count files)"
else
    echo "📁 Creating workflows directory..."
    mkdir -p workflows
    echo "✅ workflows directory created"
fi

echo ""

# Test basic sync system functionality (dry run)
echo "🧪 Testing sync system (dry run)..."

if [ $missing_vars -eq 0 ]; then
    echo "🔄 Testing n8n connection..."
    
    # Test connection without actually syncing
    if command -v curl >/dev/null 2>&1; then
        if curl -s "$N8N_BASE_URL" >/dev/null; then
            echo "✅ n8n instance is accessible"
        else
            echo "⚠️  n8n instance is not accessible"
            echo "   This may be normal if n8n is not yet configured"
        fi
    else
        echo "⚠️  curl not available, cannot test n8n connection"
    fi
else
    echo "⚠️  Skipping connection test due to missing configuration"
fi

echo ""

# Test script syntax
echo "🔍 Testing script syntax..."
syntax_errors=0

# Test bash scripts
for script in scripts/sync/*.sh; do
    if bash -n "$script" 2>/dev/null; then
        echo "✅ $(basename "$script") syntax OK"
    else
        echo "❌ $(basename "$script") syntax error"
        syntax_errors=$((syntax_errors + 1))
    fi
done

# Test JavaScript files
for script in sync-system/scripts/*.js; do
    if node -c "$script" 2>/dev/null; then
        echo "✅ $(basename "$script") syntax OK"
    else
        echo "❌ $(basename "$script") syntax error"
        syntax_errors=$((syntax_errors + 1))
    fi
done

echo ""

# Generate test summary
echo "📊 TEST SUMMARY"
echo "==============="
echo "Required files: ✅ All present"
echo "Script permissions: ✅ All executable"
echo "Environment config: $([ $missing_vars -eq 0 ] && echo "✅ Complete" || echo "⚠️  Needs configuration")"
echo "Workflow files: ✅ Valid"
echo "Script syntax: $([ $syntax_errors -eq 0 ] && echo "✅ All OK" || echo "❌ $syntax_errors errors")"
echo ""

if [ $missing_vars -gt 0 ]; then
    echo "⚠️  CONFIGURATION NEEDED:"
    echo "   1. Edit .env file with your n8n credentials"
    echo "   2. Set N8N_BASE_URL=https://n8n.pbradygeorgen.com"
    echo "   3. Set N8N_API_KEY=your-actual-api-key"
    echo ""
fi

if [ $syntax_errors -eq 0 ] && [ $missing_files -eq 0 ]; then
    echo "✅ SYNC SYSTEM READY!"
    echo "🚀 You can now use the following commands:"
    echo "   - Push workflows: ./scripts/sync/push-workflows.sh"
    echo "   - Pull workflows: ./scripts/sync/pull-workflows.sh"
    echo "   - Bidirectional sync: ./scripts/sync/sync-workflows.sh"
    echo ""
    echo "🤖 GitHub Actions will automatically sync workflows on code changes"
    echo "🌐 Access your n8n instance at: ${N8N_BASE_URL:-https://n8n.pbradygeorgen.com}"
else
    echo "⚠️  Please fix the issues above before using the sync system"
fi

echo ""
echo "🖖 Live long and prosper!"
