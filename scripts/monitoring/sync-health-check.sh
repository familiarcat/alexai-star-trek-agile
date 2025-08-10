#!/bin/bash

# 🔍 Enhanced Bilateral Sync Health Check
# Quick status check without running full sync operations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
SYNC_SCRIPT="$PROJECT_ROOT/bilateral-sync/scripts/enhanced-sync-manager.js"

echo "🔍 Enhanced Bilateral Sync Health Check"
echo "======================================"

# Check if sync script exists
if [[ ! -f "$SYNC_SCRIPT" ]]; then
    echo "❌ Sync script not found: $SYNC_SCRIPT"
    exit 1
fi

# Check Node.js availability
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

# Check sync status
echo ""
echo "📊 Sync Status:"
node "$SYNC_SCRIPT" status

# Check configuration
echo ""
echo "⚙️  Configuration:"
node "$SYNC_SCRIPT" config

# Check recent activity
echo ""
echo "📋 Recent Activity:"
node "$SYNC_SCRIPT" logs

# Check system resources
echo ""
echo "💻 System Resources:"
echo "Memory Usage:"
free -h | grep -E "Mem|Swap" || echo "Memory info not available"

echo ""
echo "Disk Usage:"
df -h . | head -2

echo ""
echo "✅ Health check completed"
