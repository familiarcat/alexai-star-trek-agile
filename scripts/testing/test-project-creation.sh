#!/bin/bash

# 🖖 AlexAI Project Creation Test Script
# Tests the new project creation functionality

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Function to check if server is running
check_server() {
    log "Checking if server is running..."
    
    if curl -s "$BASE_URL/api/health" > /dev/null 2>&1; then
        success "Server is running on $BASE_URL"
        return 0
    elif curl -s "http://localhost:3001/api/health" > /dev/null 2>&1; then
        BASE_URL="http://localhost:3001"
        success "Server is running on $BASE_URL"
        return 0
    elif curl -s "http://localhost:3002/api/health" > /dev/null 2>&1; then
        BASE_URL="http://localhost:3002"
        success "Server is running on $BASE_URL"
        return 0
    else
        error "Server is not running on ports 3000, 3001, or 3002"
        return 1
    fi
}

# Function to test project creation
test_project_creation() {
    log "Testing project creation..."
    
    # Test project data
    local test_project='{
        "name": "AlexAI System Integration Test",
        "description": "Comprehensive testing of the AlexAI project management system including UI testing, navigation, and n8n backend integration",
        "status": "active",
        "priority": "high",
        "category": "Testing",
        "team_size": 3,
        "deadline": "2025-12-31",
        "progress": 25
    }'
    
    log "Creating test project..."
    
    local response=$(curl -s -X POST "$BASE_URL/api/projects" \
        -H "Content-Type: application/json" \
        -d "$test_project" 2>/dev/null || echo "FAILED")
    
    if echo "$response" | grep -q "success.*true"; then
        success "Project created successfully!"
        echo "Response: $response" | jq . 2>/dev/null || echo "Response: $response"
        
        # Test retrieving the project
        log "Testing project retrieval..."
        local projects_response=$(curl -s "$BASE_URL/api/projects" 2>/dev/null || echo "FAILED")
        
        if echo "$projects_response" | grep -q "AlexAI System Integration Test"; then
            success "Project found in projects list!"
        else
            error "Project not found in projects list"
        fi
        
    else
        error "Failed to create project: $response"
        return 1
    fi
}

# Function to test projects page
test_projects_page() {
    log "Testing projects page accessibility..."
    
    if curl -s "$BASE_URL/projects" > /dev/null 2>&1; then
        success "Projects page is accessible"
    else
        error "Projects page is not accessible"
        return 1
    fi
}

# Function to test new project page
test_new_project_page() {
    log "Testing new project page accessibility..."
    
    if curl -s "$BASE_URL/projects/new" > /dev/null 2>&1; then
        success "New project page is accessible"
    else
        error "New project page is not accessible"
        return 1
    fi
}

# Function to display current projects
show_current_projects() {
    log "Current projects in the system:"
    
    local response=$(curl -s "$BASE_URL/api/projects" 2>/dev/null || echo "FAILED")
    
    if echo "$response" | grep -q "success.*true"; then
        echo "$response" | jq '.projects[] | "ID: \(.id) | Name: \(.name) | Status: \(.status) | Progress: \(.progress)%"' 2>/dev/null || echo "Response: $response"
    else
        error "Failed to retrieve projects: $response"
    fi
}

# Main execution
main() {
    log "🚀 Starting AlexAI Project Creation Test..."
    
    # Check if we're in the project directory
    if [ ! -f "package.json" ]; then
        error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Check server status
    if ! check_server; then
        error "Cannot proceed with testing - server is not running"
        exit 1
    fi
    
    # Run tests
    test_projects_page
    test_new_project_page
    test_project_creation
    
    # Show results
    echo ""
    echo "=================================="
    echo "🎯 PROJECT CREATION TEST RESULTS"
    echo "=================================="
    show_current_projects
    echo "=================================="
    
    success "🎉 Project creation testing completed!"
    log "You can now visit $BASE_URL/projects to see your new project!"
}

# Run main function
main "$@"
