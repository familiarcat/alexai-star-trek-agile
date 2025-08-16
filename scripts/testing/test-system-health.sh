#!/bin/bash

# 🖖 AlexAI System Health Check Script
# Tests all major system components and identifies issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
LOG_FILE="logs/system-health.log"

# Ensure logs directory exists
mkdir -p logs

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$LOG_FILE"
}

success() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1" >> "$LOG_FILE"
}

# Function to check if server is running
check_server_running() {
    log "Checking if server is running..."
    
    if curl -s "$BASE_URL/api/health" > /dev/null 2>&1; then
        success "Server is running on $BASE_URL"
        return 0
    elif curl -s "http://localhost:3001/api/health" > /dev/null 2>&1; then
        BASE_URL="http://localhost:3001"
        success "Server is running on $BASE_URL"
        return 0
    else
        error "Server is not running on ports 3000 or 3001"
        return 1
    fi
}

# Function to test API endpoints
test_api_endpoints() {
    log "Testing API endpoints..."
    
    local endpoints=(
        "/api/health"
        "/api/projects"
        "/api/dashboard/stats"
        "/api/crew"
        "/api/workflows"
        "/api/n8n-integration/workflows"
    )
    
    local failed_endpoints=()
    
    for endpoint in "${endpoints[@]}"; do
        if curl -s "$BASE_URL$endpoint" > /dev/null 2>&1; then
            success "✅ $endpoint - OK"
        else
            error "❌ $endpoint - FAILED"
            failed_endpoints+=("$endpoint")
        fi
    done
    
    if [ ${#failed_endpoints[@]} -eq 0 ]; then
        success "All API endpoints are working!"
    else
        warn "Failed endpoints: ${failed_endpoints[*]}"
    fi
}

# Function to test workflow files
test_workflow_files() {
    log "Testing workflow JSON files..."
    
    local workflows_dir="workflows"
    local failed_files=()
    
    if [ ! -d "$workflows_dir" ]; then
        error "Workflows directory not found"
        return 1
    fi
    
    for file in "$workflows_dir"/*.json; do
        if [ -f "$file" ]; then
            if jq . "$file" > /dev/null 2>&1; then
                success "✅ $(basename "$file") - Valid JSON"
            else
                error "❌ $(basename "$file") - Invalid JSON"
                failed_files+=("$(basename "$file")")
            fi
        fi
    done
    
    if [ ${#failed_files[@]} -eq 0 ]; then
        success "All workflow files have valid JSON!"
    else
        warn "Files with JSON errors: ${failed_files[*]}"
    fi
}

# Function to test page routes
test_page_routes() {
    log "Testing page routes..."
    
    local routes=(
        "/"
        "/projects"
        "/tasks"
        "/workflow-management"
        "/analytics"
        "/agile-project"
    )
    
    local failed_routes=()
    
    for route in "${routes[@]}"; do
        if curl -s "$BASE_URL$route" > /dev/null 2>&1; then
            success "✅ $route - OK"
        else
            error "❌ $route - FAILED"
            failed_routes+=("$route")
        fi
    done
    
    if [ ${#failed_routes[@]} -eq 0 ]; then
        success "All page routes are working!"
    else
        warn "Failed routes: ${failed_routes[*]}"
    fi
}

# Function to check system resources
check_system_resources() {
    log "Checking system resources..."
    
    # Check disk space
    local disk_usage=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 90 ]; then
        success "✅ Disk usage: ${disk_usage}%"
    else
        warn "⚠️ Disk usage: ${disk_usage}% (high)"
    fi
    
    # Check memory (macOS compatible)
    if command -v vm_stat >/dev/null 2>&1; then
        # macOS memory check
        local mem_info=$(vm_stat | grep "Pages free:" | awk '{print $3}' | sed 's/\.//')
        local mem_total=$(vm_stat | grep "Pages wired down:" | awk '{print $4}' | sed 's/\.//')
        if [ -n "$mem_info" ] && [ -n "$mem_total" ]; then
            local mem_usage=$((100 - (mem_info * 100 / mem_total)))
            if [ "$mem_usage" -lt 90 ]; then
                success "✅ Memory usage: ${mem_usage}%"
            else
                warn "⚠️ Memory usage: ${mem_usage}% (high)"
            fi
        else
            info "ℹ️ Memory usage: Unable to determine"
        fi
    else
        # Linux memory check
        local mem_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
        if [ "$mem_usage" -lt 90 ]; then
            success "✅ Memory usage: ${mem_usage}%"
        else
            warn "⚠️ Memory usage: ${mem_usage}% (high)"
        fi
    fi
    
    # Check Node.js processes (macOS compatible)
    if command -v pgrep >/dev/null 2>&1; then
        local node_processes=$(pgrep -c node 2>/dev/null || echo "0")
        if [ "$node_processes" -gt 0 ]; then
            success "✅ Node.js processes: $node_processes"
        else
            warn "⚠️ No Node.js processes running"
        fi
    else
        # Alternative process check for macOS
        local node_processes=$(ps aux | grep -c "[n]ode" || echo "0")
        if [ "$node_processes" -gt 0 ]; then
            success "✅ Node.js processes: $node_processes"
        else
            warn "⚠️ No Node.js processes running"
        fi
    fi
}

# Function to generate health report
generate_health_report() {
    log "Generating system health report..."
    
    local report_file="logs/system-health-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "AlexAI System Health Report"
        echo "Generated: $(date)"
        echo "=================================="
        echo ""
        echo "Server Status:"
        if check_server_running; then
            echo "✅ Server is running"
        else
            echo "❌ Server is not running"
        fi
        echo ""
        echo "API Endpoints:"
        test_api_endpoints
        echo ""
        echo "Workflow Files:"
        test_workflow_files
        echo ""
        echo "Page Routes:"
        test_page_routes
        echo ""
        echo "System Resources:"
        check_system_resources
        echo ""
        echo "=================================="
        echo "Report saved to: $report_file"
    } | tee "$report_file"
    
    success "Health report generated: $report_file"
}

# Main execution
main() {
    log "🚀 Starting AlexAI System Health Check..."
    echo "Health check started at $(date)" > "$LOG_FILE"
    
    # Check if we're in the project directory
    if [ ! -f "package.json" ]; then
        error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Run all health checks
    check_server_running || true
    test_api_endpoints
    test_workflow_files
    test_page_routes
    check_system_resources
    generate_health_report
    
    log "🎯 System health check completed!"
    log "Check the log file for details: $LOG_FILE"
}

# Run main function
main "$@"
