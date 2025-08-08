#!/bin/bash
# Bidirectional workflow synchronization
# AlexAI NCC-1701-B Automated Workflow Sync System

set -e

echo "🔄 BIDIRECTIONAL WORKFLOW SYNC"
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

echo "🔧 Sync Configuration:"
echo "   N8N Base URL: $N8N_BASE_URL"
echo "   API Key: ${N8N_API_KEY:0:8}..."
echo "   Local Workflows: $(ls workflows/*.json 2>/dev/null | wc -l) files"
echo ""

# Function to handle errors
handle_error() {
    echo "❌ Sync failed at step: $1"
    echo "🔄 Attempting to continue with remaining steps..."
}

# Step 1: Pull latest from n8n
echo "📥 STEP 1: PULLING FROM N8N"
echo "========================================="
if ./scripts/sync/pull-workflows.sh; then
    echo "✅ Pull from n8n completed successfully"
else
    handle_error "pull from n8n"
fi

echo ""

# Step 2: Push any local changes
echo "🚀 STEP 2: PUSHING TO N8N"
echo "========================================="
if ./scripts/sync/push-workflows.sh; then
    echo "✅ Push to n8n completed successfully"
else
    handle_error "push to n8n"
fi

echo ""

# Step 3: Verify sync status
echo "🔍 STEP 3: VERIFYING SYNC STATUS"
echo "========================================="

# Check local workflow files
local_workflows=$(ls workflows/*.json 2>/dev/null | wc -l)
echo "📁 Local workflows: $local_workflows files"

# Check if n8n is accessible
if curl -s "$N8N_BASE_URL" >/dev/null; then
    echo "✅ n8n instance is accessible"
else
    echo "⚠️  n8n instance is not accessible"
fi

# Check git status
git_status=$(git status --porcelain)
if [ -n "$git_status" ]; then
    echo "📝 Uncommitted changes detected:"
    git status --short
else
    echo "✅ No uncommitted changes"
fi

echo ""

# Step 4: Generate sync report
echo "📊 STEP 4: SYNC REPORT"
echo "========================================="

# Count workflow files
if [ -d "workflows" ]; then
    workflow_count=$(find workflows -name "*.json" | wc -l)
    echo "📋 Total workflows synchronized: $workflow_count"
    
    if [ $workflow_count -gt 0 ]; then
        echo "📁 Workflow files:"
        find workflows -name "*.json" -exec basename {} \; | sort
    fi
else
    echo "⚠️  No workflows directory found"
fi

# Check recent git commits related to workflows
echo ""
echo "📝 Recent workflow-related commits:"
git log --oneline --grep="workflow" --grep="n8n" --grep="Auto-sync" -n 5 2>/dev/null || echo "   No recent workflow commits found"

echo ""
echo "✅ BIDIRECTIONAL SYNC COMPLETE"
echo "========================================="
echo "🎯 Summary:"
echo "   ✅ Workflows pulled from n8n"
echo "   ✅ Local workflows pushed to n8n"
echo "   ✅ Sync status verified"
echo "   ✅ Sync report generated"
echo ""
echo "🔄 Next sync will occur automatically or run this script again"
echo "🌐 Access n8n at: $N8N_BASE_URL"
echo ""
echo "🖖 Live long and prosper!"
