#!/bin/bash

# 🕐 Bilateral Sync Scheduler
# Automated scheduling for bilateral sync operations

SYNC_INTERVAL=${SYNC_INTERVAL:-300}  # 5 minutes default
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "⏰ Bilateral Sync Scheduler Starting"
echo "Sync interval: $SYNC_INTERVAL seconds"
echo ""

# Function to run sync
run_sync() {
    echo "🔄 $(date): Running bilateral sync..."
    
    if node "$SCRIPT_DIR/bilateral-sync-manager.js" sync; then
        echo "✅ $(date): Sync completed successfully"
        
        # Track evolution if significant changes detected
        node "$SCRIPT_DIR/evolution-tracker.js" report > /dev/null 2>&1
        
    else
        echo "❌ $(date): Sync failed"
    fi
    
    echo ""
}

# Initial sync
run_sync

# Schedule regular syncs
while true; do
    sleep $SYNC_INTERVAL
    run_sync
done
