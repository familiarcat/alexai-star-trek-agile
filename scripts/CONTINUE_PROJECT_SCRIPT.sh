#!/bin/bash
# 🖖 AlexAI Star Trek Agile System - Project Continuation Script
# Use this script in a new Cursor prompt to continue the project
# Date: August 6, 2025

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}"
echo "🖖 ALEXAI STAR TREK AGILE SYSTEM - PROJECT CONTINUATION"
echo "========================================================"
echo -e "${NC}"

# Project Information
PROJECT_NAME="alexai_katra_transfer_package_remote_v7"
LOCAL_PORT=8000
VERCEL_URL="https://alexaikatratransferpackageremotev7-dhxsp88vi-pbradygeorgen.vercel.app"
GITHUB_REPO="https://github.com/pbradygeorgen/alexai_katra_transfer_package_remote_v7"

echo -e "${BLUE}📋 PROJECT STATUS SUMMARY:${NC}"
echo "✅ Complete JavaScript migration (Python → Node.js)"
echo "✅ Authentic LCARS design system implemented"
echo "✅ Unified data translation layer created"
echo "✅ Local environment fully operational"
echo "⚠️  Remote deployment needs updating (showing old template variables)"
echo ""

echo -e "${YELLOW}🎯 IMMEDIATE TASK: Fix Vercel Deployment${NC}"
echo "The remote environment is still showing server-side template variables"
echo "instead of the new JavaScript-rendered data. We need to force a redeployment."
echo ""

# Function to check if we're in the right directory
check_environment() {
    echo -e "${BLUE}🔍 Checking project environment...${NC}"
    
    if [ ! -f "server.js" ]; then
        echo -e "${RED}❌ Error: server.js not found. Please run this script from the project root directory.${NC}"
        echo "Expected directory: /path/to/alexai_katra_transfer_package_remote_v7"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Error: package.json not found. This doesn't appear to be the JavaScript version.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Project structure verified${NC}"
    echo ""
}

# Function to check current git status
check_git_status() {
    echo -e "${BLUE}🔍 Checking Git status...${NC}"
    
    if [ ! -d ".git" ]; then
        echo -e "${RED}❌ Error: Not a Git repository${NC}"
        exit 1
    fi
    
    CURRENT_BRANCH=$(git branch --show-current)
    echo -e "${GREEN}✅ Current branch: ${CURRENT_BRANCH}${NC}"
    
    LATEST_COMMIT=$(git log -1 --oneline)
    echo -e "${GREEN}✅ Latest commit: ${LATEST_COMMIT}${NC}"
    
    echo ""
}

# Function to check if local server is running
check_local_server() {
    echo -e "${BLUE}🔍 Checking local server status...${NC}"
    
    if curl -s http://localhost:${LOCAL_PORT}/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Local server is running on port ${LOCAL_PORT}${NC}"
        echo -e "${GREEN}✅ Dashboard: http://localhost:${LOCAL_PORT}${NC}"
        echo -e "${GREEN}✅ Projects: http://localhost:${LOCAL_PORT}/projects${NC}"
    else
        echo -e "${YELLOW}⚠️  Local server not running. Starting it now...${NC}"
        start_local_server
    fi
    
    echo ""
}

# Function to start local server
start_local_server() {
    echo -e "${BLUE}🚀 Starting local server...${NC}"
    
    # Kill any existing Node.js processes on port 8000
    pkill -f "node server.js" || true
    
    # Start server in background
    nohup node server.js > server.log 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 3
    
    if curl -s http://localhost:${LOCAL_PORT}/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server started successfully (PID: ${SERVER_PID})${NC}"
    else
        echo -e "${RED}❌ Failed to start server. Check server.log for details.${NC}"
        exit 1
    fi
}

# Function to test API endpoints
test_api_endpoints() {
    echo -e "${BLUE}🧪 Testing API endpoints...${NC}"
    
    # Test health endpoint
    if curl -s http://localhost:${LOCAL_PORT}/api/health | grep -q "success"; then
        echo -e "${GREEN}✅ Health endpoint working${NC}"
    else
        echo -e "${RED}❌ Health endpoint failed${NC}"
    fi
    
    # Test dashboard stats
    if curl -s http://localhost:${LOCAL_PORT}/api/dashboard/stats | grep -q "success"; then
        echo -e "${GREEN}✅ Dashboard stats endpoint working${NC}"
    else
        echo -e "${RED}❌ Dashboard stats endpoint failed${NC}"
    fi
    
    # Test projects endpoint
    if curl -s http://localhost:${LOCAL_PORT}/api/projects | grep -q "success"; then
        echo -e "${GREEN}✅ Projects endpoint working${NC}"
    else
        echo -e "${RED}❌ Projects endpoint failed${NC}"
    fi
    
    echo ""
}

# Function to check remote deployment
check_remote_deployment() {
    echo -e "${BLUE}🌐 Checking remote deployment...${NC}"
    
    if curl -s ${VERCEL_URL}/api/health | grep -q "success"; then
        echo -e "${GREEN}✅ Remote API endpoints working${NC}"
    else
        echo -e "${RED}❌ Remote API endpoints not responding${NC}"
    fi
    
    # Check if remote is showing template variables
    if curl -s ${VERCEL_URL}/projects | grep -q "{{ metrics.total_projects }}"; then
        echo -e "${RED}❌ Remote still showing old template variables${NC}"
        echo -e "${YELLOW}⚠️  This confirms the deployment needs updating${NC}"
    else
        echo -e "${GREEN}✅ Remote appears to be updated${NC}"
    fi
    
    echo ""
}

# Function to force Vercel redeployment
force_vercel_redeployment() {
    echo -e "${BLUE}🚀 Forcing Vercel redeployment...${NC}"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
        npm install -g vercel
    fi
    
    # Force redeployment
    echo -e "${YELLOW}📤 Deploying to Vercel (this may take a few minutes)...${NC}"
    vercel --prod --force
    
    echo -e "${GREEN}✅ Deployment initiated${NC}"
    echo -e "${YELLOW}⏳ Waiting for deployment to complete...${NC}"
    sleep 30
    
    echo ""
}

# Function to verify deployment
verify_deployment() {
    echo -e "${BLUE}🔍 Verifying deployment...${NC}"
    
    # Wait a bit more for deployment to complete
    sleep 10
    
    # Test remote endpoints
    if curl -s ${VERCEL_URL}/api/health | grep -q "success"; then
        echo -e "${GREEN}✅ Remote health endpoint working${NC}"
    else
        echo -e "${RED}❌ Remote health endpoint failed${NC}"
    fi
    
    # Check for template variables
    if curl -s ${VERCEL_URL}/projects | grep -q "{{ metrics.total_projects }}"; then
        echo -e "${RED}❌ Remote still showing template variables${NC}"
        echo -e "${YELLOW}⚠️  Deployment may still be in progress or failed${NC}"
    else
        echo -e "${GREEN}✅ Remote no longer showing template variables${NC}"
        echo -e "${GREEN}🎉 Deployment successful!${NC}"
    fi
    
    echo ""
}

# Function to open browsers for comparison
open_browsers() {
    echo -e "${BLUE}🌐 Opening browsers for comparison...${NC}"
    
    # Open local environment
    open http://localhost:${LOCAL_PORT}
    echo -e "${GREEN}✅ Opened local environment${NC}"
    
    # Open remote environment
    open ${VERCEL_URL}
    echo -e "${GREEN}✅ Opened remote environment${NC}"
    
    echo -e "${YELLOW}📋 Compare the two environments:${NC}"
    echo "   - Local should show real data"
    echo "   - Remote should match local (no template variables)"
    echo ""
}

# Function to show next steps
show_next_steps() {
    echo -e "${PURPLE}🎯 NEXT STEPS:${NC}"
    echo ""
    echo -e "${BLUE}1. VERIFY DEPLOYMENT${NC}"
    echo "   - Check both browser windows"
    echo "   - Ensure remote matches local"
    echo "   - No template variables should be visible"
    echo ""
    echo -e "${BLUE}2. TEST ALL FEATURES${NC}"
    echo "   - Dashboard metrics"
    echo "   - Projects list"
    echo "   - Kanban board functionality"
    echo "   - AI consultation features"
    echo ""
    echo -e "${BLUE}3. DOCUMENTATION${NC}"
    echo "   - Update README.md"
    echo "   - Create API documentation"
    echo "   - Document deployment process"
    echo ""
    echo -e "${BLUE}4. TEAM ONBOARDING${NC}"
    echo "   - Create developer setup guide"
    echo "   - Document contribution workflow"
    echo "   - Set up development environment"
    echo ""
}

# Function to show project structure
show_project_structure() {
    echo -e "${PURPLE}📁 PROJECT STRUCTURE:${NC}"
    echo ""
    echo -e "${BLUE}Backend (Node.js):${NC}"
    echo "  ├── server.js (Express server)"
    echo "  ├── src/core/AgileProjectManager.js (Database operations)"
    echo "  └── src/core/AlexAICore.js (AI integration)"
    echo ""
    echo -e "${BLUE}Frontend (Vanilla JS + LCARS CSS):${NC}"
    echo "  ├── public/index.html (Dashboard)"
    echo "  ├── public/projects.html (Projects list)"
    echo "  ├── public/assets/lcars.css (LCARS design system)"
    echo "  └── public/assets/data-translator.js (Unified data layer)"
    echo ""
    echo -e "${BLUE}Deployment:${NC}"
    echo "  ├── vercel.json (Vercel configuration)"
    echo "  ├── package.json (Node.js dependencies)"
    echo "  └── scripts/deploy/unified-deploy.sh (Deployment script)"
    echo ""
}

# Main execution
main() {
    echo -e "${GREEN}🚀 Starting project continuation...${NC}"
    echo ""
    
    check_environment
    check_git_status
    check_local_server
    test_api_endpoints
    check_remote_deployment
    
    echo -e "${YELLOW}🤔 Do you want to force a Vercel redeployment? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        force_vercel_redeployment
        verify_deployment
    fi
    
    open_browsers
    show_project_structure
    show_next_steps
    
    echo -e "${GREEN}✅ Project continuation script completed!${NC}"
    echo -e "${PURPLE}🖖 Live Long and Prosper${NC}"
}

# Run main function
main "$@" 