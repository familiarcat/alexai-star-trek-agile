#!/bin/bash
# Pull workflows from n8n.pbradygeorgen.com
# AlexAI NCC-1701-B Automated Workflow Sync System

set -e

echo "📥 PULLING WORKFLOWS FROM N8N"
echo "Source: n8n.pbradygeorgen.com"
echo "Date: $(date)"
echo ""

# Check if .env file exists
if [ -f .env ]; then
    echo "📋 Loading environment variables from .env..."
    source .env
else
    echo "⚠️  No .env file found, using system environment variables"
fi

# Check required environment variables
if [ -z "$N8N_BASE_URL" ]; then
    echo "❌ N8N_BASE_URL environment variable is required"
    exit 1
fi

if [ -z "$N8N_API_KEY" ]; then
    echo "❌ N8N_API_KEY environment variable is required"
    exit 1
fi

echo "🔧 Configuration:"
echo "   N8N Base URL: $N8N_BASE_URL"
echo "   API Key: ${N8N_API_KEY:0:8}..."
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Store git status before pull
echo "📊 Checking git status before pull..."
git_status_before=$(git status --porcelain)

# Run workflow pull
echo "🔄 Running workflow pull script..."
node sync-system/scripts/pull-workflows.js

if [ $? -eq 0 ]; then
    echo ""
    echo "📊 Checking for changes..."
    
    # Check if there are changes to commit
    git_status_after=$(git status --porcelain)
    
    if [ -n "$git_status_after" ]; then
        echo "📝 Changes detected in workflows:"
        git status --short
        echo ""
        
        # Stage workflow changes
        git add workflows/
        
        # Create commit
        commit_message="Auto-sync: Updated workflows from n8n ($(date '+%Y-%m-%d %H:%M:%S'))"
        git commit -m "$commit_message"
        
        echo "✅ Committed workflow updates:"
        echo "   Message: $commit_message"
        
        # Optional: Push changes (uncomment if desired)
        # echo "🚀 Pushing changes to remote..."
        # git push
        
    else
        echo "ℹ️  No workflow changes detected"
    fi
    
    echo ""
    echo "✅ Workflow pull completed successfully"
    echo "🎯 Local workflows are now synchronized with n8n.pbradygeorgen.com"
    echo ""
    echo "📋 Summary:"
    echo "   - Workflows pulled from n8n"
    echo "   - Local files updated"
    echo "   - Changes committed to git"
    
else
    echo ""
    echo "❌ Workflow pull failed"
    echo "Check the error messages above for details"
    exit 1
fi
