#!/bin/bash

# 🧹 Memory and Disk Cleanup Script
# Removes old logs, snapshots, and temporary files to optimize memory usage

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
BILATERAL_SYNC_DIR="$PROJECT_ROOT/bilateral-sync"
LOGS_DIR="$BILATERAL_SYNC_DIR/logs"
SNAPSHOTS_DIR="$BILATERAL_SYNC_DIR/snapshots"
NEXT_CACHE_DIR="$PROJECT_ROOT/.next"
TEMP_DIRS=("$PROJECT_ROOT/tmp" "$PROJECT_ROOT/temp" "$PROJECT_ROOT/cache")

# Default retention periods (in days)
LOG_RETENTION_DAYS=3
SNAPSHOT_RETENTION_DAYS=3
CACHE_RETENTION_DAYS=1

# Parse command line arguments
DRY_RUN=false
VERBOSE=false
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --force|-f)
            FORCE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --dry-run     Show what would be deleted without actually deleting"
            echo "  --verbose     Show detailed information about files being processed"
            echo "  --force       Skip confirmation prompts"
            echo "  --help        Show this help message"
            echo ""
            echo "This script cleans up old files to optimize memory usage:"
            echo "  - Old log files (older than $LOG_RETENTION_DAYS days)"
            echo "  - Old snapshots (older than $SNAPSHOT_RETENTION_DAYS days)"
            echo "  - Next.js cache (older than $CACHE_RETENTION_DAYS days)"
            echo "  - Temporary directories"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%d-%m %H:%M:%S')] INFO:${NC} $1"
}

# Calculate cutoff time for file retention
get_cutoff_time() {
    local days=$1
    date -d "$days days ago" +%s 2>/dev/null || date -v-${days}d +%s 2>/dev/null || echo "0"
}

# Get file size in human readable format
format_size() {
    local size=$1
    if [ $size -gt 1048576 ]; then
        echo "$(echo "scale=2; $size/1048576" | bc)MB"
    elif [ $size -gt 1024 ]; then
        echo "$(echo "scale=2; $size/1024" | bc)KB"
    else
        echo "${size}B"
    fi
}

# Clean up old log files
cleanup_logs() {
    local total_size=0
    local file_count=0
    local cutoff_time=$(get_cutoff_time $LOG_RETENTION_DAYS)
    
    if [ ! -d "$LOGS_DIR" ]; then
        info "Logs directory not found: $LOGS_DIR"
        return
    fi
    
    info "Cleaning up logs older than $LOG_RETENTION_DAYS days..."
    
    while IFS= read -r -d '' file; do
        local file_time=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file" 2>/dev/null || echo "0")
        local file_size=$(stat -c %s "$file" 2>/dev/null || stat -f %z "$file" 2>/dev/null || echo "0")
        
        if [ "$file_time" -lt "$cutoff_time" ]; then
            if [ "$VERBOSE" = true ]; then
                info "  Will delete: $(basename "$file") ($(format_size $file_size))"
            fi
            
            if [ "$DRY_RUN" = false ]; then
                rm -f "$file"
                if [ $? -eq 0 ]; then
                    total_size=$((total_size + file_size))
                    file_count=$((file_count + 1))
                fi
            else
                total_size=$((total_size + file_size))
                file_count=$((file_count + 1))
            fi
        fi
    done < <(find "$LOGS_DIR" -type f -name "*.log" -print0 2>/dev/null || true)
    
    if [ $file_count -gt 0 ]; then
        if [ "$DRY_RUN" = true ]; then
            info "Would delete $file_count log files (total: $(format_size $total_size))"
        else
            info "Deleted $file_count log files (total: $(format_size $total_size))"
        fi
    else
        info "No old log files found"
    fi
}

# Clean up old snapshots
cleanup_snapshots() {
    local total_size=0
    local file_count=0
    local cutoff_time=$(get_cutoff_time $SNAPSHOT_RETENTION_DAYS)
    
    if [ ! -d "$SNAPSHOTS_DIR" ]; then
        info "Snapshots directory not found: $SNAPSHOTS_DIR"
        return
    fi
    
    info "Cleaning up snapshots older than $SNAPSHOT_RETENTION_DAYS days..."
    
    while IFS= read -r -d '' file; do
        local file_time=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file" 2>/dev/null || echo "0")
        local file_size=$(stat -c %s "$file" 2>/dev/null || stat -f %z "$file" 2>/dev/null || echo "0")
        
        if [ "$file_time" -lt "$cutoff_time" ]; then
            if [ "$VERBOSE" = true ]; then
                info "  Will delete: $(basename "$file") ($(format_size $file_size))"
            fi
            
            if [ "$DRY_RUN" = false ]; then
                rm -f "$file"
                if [ $? -eq 0 ]; then
                    total_size=$((total_size + file_size))
                    file_count=$((file_count + 1))
                fi
            else
                total_size=$((total_size + file_size))
                file_count=$((file_count + 1))
            fi
        fi
    done < <(find "$SNAPSHOTS_DIR" -type f -name "*.json" -print0 2>/dev/null || true)
    
    if [ $file_count -gt 0 ]; then
        if [ "$DRY_RUN" = true ]; then
            info "Would delete $file_count snapshot files (total: $(format_size $total_size))"
        else
            info "Deleted $file_count snapshot files (total: $(format_size $total_size))"
        fi
    else
        info "No old snapshot files found"
    fi
}

# Clean up Next.js cache
cleanup_next_cache() {
    if [ ! -d "$NEXT_CACHE_DIR" ]; then
        info "Next.js cache directory not found: $NEXT_CACHE_DIR"
        return
    fi
    
    info "Cleaning up Next.js cache..."
    
    local cache_size=$(du -sb "$NEXT_CACHE_DIR" 2>/dev/null | cut -f1 || echo "0")
    
    if [ "$DRY_RUN" = false ]; then
        rm -rf "$NEXT_CACHE_DIR"
        if [ $? -eq 0 ]; then
            info "Deleted Next.js cache ($(format_size $cache_size))"
        else
            warn "Failed to delete Next.js cache"
        fi
    else
        info "Would delete Next.js cache ($(format_size $cache_size))"
    fi
}

# Clean up temporary directories
cleanup_temp_dirs() {
    info "Cleaning up temporary directories..."
    
    for temp_dir in "${TEMP_DIRS[@]}"; do
        if [ -d "$temp_dir" ]; then
            local temp_size=$(du -sb "$temp_dir" 2>/dev/null | cut -f1 || echo "0")
            
            if [ "$DRY_RUN" = false ]; then
                rm -rf "$temp_dir"
                if [ $? -eq 0 ]; then
                    info "Deleted temporary directory: $temp_dir ($(format_size $temp_size))"
                else
                    warn "Failed to delete temporary directory: $temp_dir"
                fi
            else
                info "Would delete temporary directory: $temp_dir ($(format_size $temp_size))"
            fi
        fi
    done
}

# Show disk usage summary
show_disk_usage() {
    info "Current disk usage:"
    
    if [ -d "$BILATERAL_SYNC_DIR" ]; then
        local sync_size=$(du -sh "$BILATERAL_SYNC_DIR" 2>/dev/null | cut -f1 || echo "unknown")
        echo "  Bilateral Sync: $sync_size"
    fi
    
    if [ -d "$NEXT_CACHE_DIR" ]; then
        local cache_size=$(du -sh "$NEXT_CACHE_DIR" 2>/dev/null | cut -f1 || echo "unknown")
        echo "  Next.js Cache: $cache_size"
    fi
    
    local total_size=$(du -sh "$PROJECT_ROOT" 2>/dev/null | cut -f1 || echo "unknown")
    echo "  Total Project: $total_size"
}

# Main cleanup function
main_cleanup() {
    log "🧹 Starting memory and disk cleanup..."
    
    if [ "$DRY_RUN" = true ]; then
        warn "DRY RUN MODE - No files will be deleted"
    fi
    
    echo ""
    
    # Show current disk usage
    show_disk_usage
    
    echo ""
    
    # Perform cleanup operations
    cleanup_logs
    echo ""
    
    cleanup_snapshots
    echo ""
    
    cleanup_next_cache
    echo ""
    
    cleanup_temp_dirs
    echo ""
    
    # Show final disk usage
    if [ "$DRY_RUN" = false ]; then
        info "Cleanup completed. Final disk usage:"
        show_disk_usage
    else
        info "Dry run completed. No files were deleted."
    fi
    
    log "✅ Cleanup process completed"
}

# Confirmation prompt
if [ "$DRY_RUN" = false ] && [ "$FORCE" = false ]; then
    echo "This script will delete:"
    echo "  - Log files older than $LOG_RETENTION_DAYS days"
    echo "  - Snapshot files older than $SNAPSHOT_RETENTION_DAYS days"
    echo "  - Next.js cache directory"
    echo "  - Temporary directories"
    echo ""
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cleanup cancelled."
        exit 0
    fi
fi

# Run cleanup
main_cleanup
