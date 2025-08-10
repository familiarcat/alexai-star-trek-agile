#!/bin/bash

# 📊 Bilateral Sync Monitor
# Monitors sync status and sends alerts

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/../config.json"

# Check last sync status
if [[ -f "$CONFIG_FILE" ]]; then
    last_sync=$(jq -r '.lastSync.status' "$CONFIG_FILE" 2>/dev/null)
    last_timestamp=$(jq -r '.lastSync.timestamp' "$CONFIG_FILE" 2>/dev/null)
    
    if [[ "$last_sync" == "failed" ]]; then
        echo "❌ Bilateral sync failed at $last_timestamp"
        # Could add notification logic here
    elif [[ "$last_sync" == "success" ]]; then
        echo "✅ Bilateral sync successful at $last_timestamp"
    else
        echo "⏳ Bilateral sync status: $last_sync"
    fi
else
    echo "⚠️ Config file not found"
fi
