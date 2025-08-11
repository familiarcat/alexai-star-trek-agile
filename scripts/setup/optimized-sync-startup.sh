#!/bin/bash

# 🚀 Optimized Bilateral Sync Startup Script
# Memory-efficient startup with automatic resource management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SYNC_SCRIPT="$PROJECT_ROOT/bilateral-sync/scripts/enhanced-sync-manager.js"
LOG_FILE="$PROJECT_ROOT/bilateral-sync/logs/sync-startup.log"
PID_FILE="$PROJECT_ROOT/bilateral-sync/logs/sync-manager.pid"
MAX_MEMORY_MB=512
CHECK_INTERVAL=30

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$(dirname "$PID_FILE")"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# Check if sync manager is already running
check_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            # PID file exists but process is dead, clean it up
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Get memory usage of a process
get_memory_usage() {
    local pid=$1
    if [ -n "$pid" ] && ps -p "$pid" > /dev/null 2>&1; then
        ps -o rss= -p "$pid" | awk '{print int($1/1024)}'
    else
        echo "0"
    fi
}

# Monitor memory usage and restart if necessary
monitor_memory() {
    local pid=$1
    local max_memory=$2
    
    while true; do
        sleep "$CHECK_INTERVAL"
        
        if ! check_running; then
            warn "Sync manager process not found, stopping monitor"
            break
        fi
        
        local memory_usage=$(get_memory_usage "$pid")
        
        if [ "$memory_usage" -gt "$max_memory" ]; then
            warn "Memory usage ($memory_usage MB) exceeded limit ($max_memory MB), restarting sync manager"
            restart_sync_manager
            break
        fi
        
        info "Memory usage: ${memory_usage}MB (limit: ${max_memory}MB)"
    done
}

# Start the sync manager
start_sync_manager() {
    log "Starting Enhanced Bilateral Sync Manager..."
    
    # Set Node.js memory limits
    export NODE_OPTIONS="--max-old-space-size=$MAX_MEMORY_MB"
    
    # Start the sync manager in background
    nohup node "$SYNC_SCRIPT" start > "$LOG_FILE" 2>&1 &
    local pid=$!
    
    # Save PID
    echo "$pid" > "$PID_FILE"
    
    # Wait a moment to ensure it started
    sleep 2
    
    if check_running; then
        log "✅ Sync manager started successfully (PID: $pid)"
        
        # Start memory monitoring in background
        monitor_memory "$pid" "$MAX_MEMORY_MB" &
        local monitor_pid=$!
        echo "$monitor_pid" > "$PROJECT_ROOT/bilateral-sync/logs/monitor.pid"
        
        log "🔍 Memory monitoring started (PID: $monitor_pid)"
        log "📊 Memory limit: ${MAX_MEMORY_MB}MB"
        log "⏱️  Check interval: ${CHECK_INTERVAL}s"
        
        return 0
    else
        error "❌ Failed to start sync manager"
        return 1
    fi
}

# Stop the sync manager
stop_sync_manager() {
    if check_running; then
        local pid=$(cat "$PID_FILE")
        log "Stopping sync manager (PID: $pid)..."
        
        # Send SIGTERM first
        kill "$pid" 2>/dev/null
        
        # Wait for graceful shutdown
        local count=0
        while [ $count -lt 10 ] && check_running; do
            sleep 1
            count=$((count + 1))
        done
        
        # Force kill if still running
        if check_running; then
            warn "Force killing sync manager..."
            kill -9 "$pid" 2>/dev/null
        fi
        
        # Clean up PID files
        rm -f "$PID_FILE"
        
        # Stop memory monitor if running
        local monitor_pid_file="$PROJECT_ROOT/bilateral-sync/logs/monitor.pid"
        if [ -f "$monitor_pid_file" ]; then
            local monitor_pid=$(cat "$monitor_pid_file")
            if ps -p "$monitor_pid" > /dev/null 2>&1; then
                kill "$monitor_pid" 2>/dev/null
            fi
            rm -f "$monitor_pid_file"
        fi
        
        log "✅ Sync manager stopped"
    else
        log "Sync manager is not running"
    fi
}

# Restart the sync manager
restart_sync_manager() {
    log "🔄 Restarting sync manager..."
    stop_sync_manager
    sleep 2
    start_sync_manager
}

# Show status
show_status() {
    echo "📊 Enhanced Bilateral Sync Manager Status"
    echo "========================================"
    
    if check_running; then
        local pid=$(cat "$PID_FILE")
        local memory_usage=$(get_memory_usage "$pid")
        local uptime=$(ps -o etime= -p "$pid" 2>/dev/null || echo "unknown")
        
        echo -e "Status: ${GREEN}Running${NC}"
        echo "PID: $pid"
        echo "Uptime: $uptime"
        echo "Memory Usage: ${memory_usage}MB"
        echo "Memory Limit: ${MAX_MEMORY_MB}MB"
        
        # Check monitor status
        local monitor_pid_file="$PROJECT_ROOT/bilateral-sync/logs/monitor.pid"
        if [ -f "$monitor_pid_file" ]; then
            local monitor_pid=$(cat "$monitor_pid_file")
            if ps -p "$monitor_pid" > /dev/null 2>&1; then
                echo -e "Memory Monitor: ${GREEN}Active${NC} (PID: $monitor_pid)"
            else
                echo -e "Memory Monitor: ${RED}Inactive${NC}"
            fi
        else
            echo -e "Memory Monitor: ${RED}Not Found${NC}"
        fi
        
    else
        echo -e "Status: ${RED}Stopped${NC}"
    fi
    
    echo ""
    echo "Log File: $LOG_FILE"
    echo "PID File: $PID_FILE"
}

# Show configuration
show_config() {
    echo "⚙️  Sync Manager Configuration"
    echo "=============================="
    echo "Script: $SYNC_SCRIPT"
    echo "Max Memory: ${MAX_MEMORY_MB}MB"
    echo "Check Interval: ${CHECK_INTERVAL}s"
    echo "Log File: $LOG_FILE"
    echo "PID File: $PID_FILE"
}

# Main function
main() {
    case "${1:-start}" in
        start)
            if check_running; then
                warn "Sync manager is already running"
                show_status
            else
                start_sync_manager
            fi
            ;;
        stop)
            stop_sync_manager
            ;;
        restart)
            restart_sync_manager
            ;;
        status)
            show_status
            ;;
        config)
            show_config
            ;;
        logs)
            if [ -f "$LOG_FILE" ]; then
                tail -f "$LOG_FILE"
            else
                error "Log file not found: $LOG_FILE"
            fi
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|status|config|logs}"
            echo ""
            echo "Commands:"
            echo "  start   - Start the sync manager"
            echo "  stop    - Stop the sync manager"
            echo "  restart - Restart the sync manager"
            echo "  status  - Show current status"
            echo "  config  - Show configuration"
            echo "  logs    - Follow log file"
            echo ""
            echo "Memory Management:"
            echo "  - Automatic memory monitoring"
            echo "  - Restart on memory limit exceeded"
            echo "  - Configurable memory limits"
            exit 1
            ;;
    esac
}

# Handle script interruption
trap 'log "Received interrupt signal, cleaning up..."; stop_sync_manager; exit 0' INT TERM

# Run main function
main "$@"
