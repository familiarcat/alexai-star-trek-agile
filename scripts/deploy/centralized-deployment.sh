#!/bin/bash

# 🚀 Centralized Deployment Script for AlexAI Star Trek Agile System
# Deploys all workflows to the single n8n instance at n8n.pbradygeorgen.com
# This creates a single source of truth for all workflow management

set -e

# Configuration
N8N_BASE_URL="https://n8n.pbradygeorgen.com"
N8N_API_KEY="${N8N_API_KEY:-}"
WORKFLOWS_DIR="workflows"
SYNC_SYSTEM_DIR="sync-system/workflows"
LOG_FILE="deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "🔍 Checking deployment prerequisites..."
    
    if [ ! -d "$WORKFLOWS_DIR" ]; then
        log_error "Workflows directory not found: $WORKFLOWS_DIR"
        exit 1
    fi
    
    if [ ! -d "$SYNC_SYSTEM_DIR" ]; then
        log_error "Sync system workflows directory not found: $SYNC_SYSTEM_DIR"
        exit 1
    fi
    
    if [ -z "$N8N_API_KEY" ]; then
        log_warning "N8N_API_KEY not set. Some operations may require manual authentication."
    fi
    
    log_success "Prerequisites check completed"
}

# Test n8n connectivity
test_n8n_connectivity() {
    log "🌐 Testing n8n connectivity..."
    
    if curl -s --max-time 10 "$N8N_BASE_URL" > /dev/null; then
        log_success "n8n instance is accessible at $N8N_BASE_URL"
    else
        log_error "Cannot connect to n8n instance at $N8N_BASE_URL"
        exit 1
    fi
}

# Deploy workflow to n8n
deploy_workflow() {
    local workflow_file="$1"
    local workflow_name="$2"
    
    log "📤 Deploying workflow: $workflow_name"
    
    if [ ! -f "$workflow_file" ]; then
        log_error "Workflow file not found: $workflow_file"
        return 1
    fi
    
    # Validate JSON
    if ! jq . "$workflow_file" > /dev/null 2>&1; then
        log_error "Invalid JSON in workflow file: $workflow_file"
        return 1
    fi
    
    # Deploy using the bilateral sync system
    if npm run deploy:workflow -- "$workflow_file" > /dev/null 2>&1; then
        log_success "Successfully deployed: $workflow_name"
        return 0
    else
        log_error "Failed to deploy: $workflow_name"
        return 1
    fi
}

# Deploy all workflows
deploy_all_workflows() {
    log "🚀 Starting centralized deployment to $N8N_BASE_URL"
    
    local total_workflows=0
    local successful_deployments=0
    local failed_deployments=0
    
    # Deploy main workflows
    log "📁 Deploying main workflows..."
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            total_workflows=$((total_workflows + 1))
            workflow_name=$(basename "$workflow_file" .json)
            
            if deploy_workflow "$workflow_file" "$workflow_name"; then
                successful_deployments=$((successful_deployments + 1))
            else
                failed_deployments=$((failed_deployments + 1))
            fi
        fi
    done
    
    # Deploy sync system workflows
    log "🔄 Deploying sync system workflows..."
    for workflow_file in "$SYNC_SYSTEM_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            total_workflows=$((total_workflows + 1))
            workflow_name=$(basename "$workflow_file" .json)
            
            if deploy_workflow "$workflow_file" "$workflow_name"; then
                successful_deployments=$((successful_deployments + 1))
            else
                failed_deployments=$((failed_deployments + 1))
            fi
        fi
    done
    
    # Summary
    log "📊 Deployment Summary:"
    log "   Total workflows: $total_workflows"
    log "   Successful: $successful_deployments"
    log "   Failed: $failed_deployments"
    
    if [ $failed_deployments -eq 0 ]; then
        log_success "All workflows deployed successfully!"
    else
        log_warning "Some workflows failed to deploy. Check the log for details."
    fi
}

# Validate deployment
validate_deployment() {
    log "🔍 Validating deployment..."
    
    # Check if bilateral sync is working
    if npm run sync:validate > /dev/null 2>&1; then
        log_success "Bilateral sync validation passed"
    else
        log_warning "Bilateral sync validation failed"
    fi
    
    # Test crew endpoints
    log "🧪 Testing crew endpoints..."
    if curl -s -X POST "http://localhost:3001/api/crew/captain-picard" \
        -H "Content-Type: application/json" \
        -d '{"query": "test", "context": "deployment validation"}' > /dev/null 2>&1; then
        log_success "Captain Picard endpoint is working"
    else
        log_warning "Captain Picard endpoint test failed"
    fi
    
    log_success "Deployment validation completed"
}

# Main deployment process
main() {
    log "🚀 Starting Centralized Deployment Process"
    log "Target: $N8N_BASE_URL"
    log "Timestamp: $(date)"
    
    # Clear previous log
    > "$LOG_FILE"
    
    check_prerequisites
    test_n8n_connectivity
    deploy_all_workflows
    validate_deployment
    
    log "🎉 Centralized deployment process completed!"
    log "📋 Check $LOG_FILE for detailed deployment information"
    log "🌐 Access your workflows at: $N8N_BASE_URL"
}

# Run main function
main "$@"
