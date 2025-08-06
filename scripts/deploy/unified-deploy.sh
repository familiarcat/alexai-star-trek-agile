#!/bin/bash

# AlexAI Star Trek Agile System - Unified Deployment Script
# Handles both local and remote deployments for JavaScript version

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="alexai_katra_transfer_package_remote_v7"
LOCAL_PORT=8000
VERCEL_PROJECT="alexaikatratransferpackageremotev7"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to kill processes on port
kill_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        log "Killing process on port $port"
        lsof -ti:$port | xargs kill -9
        sleep 2
    fi
}

# Function to setup environment
setup_environment() {
    log "Setting up deployment environment..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        error "package.json not found. Please run this script from the project root."
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log "Installing Node.js dependencies..."
        npm install
    fi
    
    # Create public directory if it doesn't exist
    if [ ! -d "public" ]; then
        log "Creating public directory..."
        mkdir -p public
    fi
    
    # Copy files from js-version/public to public if needed
    if [ -d "js-version/public" ] && [ ! -f "public/index.html" ]; then
        log "Copying frontend files from js-version/public to public..."
        cp -r js-version/public/* public/
    fi
    
    # Copy source files if needed
    if [ -d "js-version/src" ] && [ ! -d "src" ]; then
        log "Copying source files from js-version/src to src..."
        cp -r js-version/src src/
    fi
}

# Function to start local server
start_local_server() {
    log "Starting local development server..."
    
    # Kill any existing processes on the port
    kill_port $LOCAL_PORT
    
    # Start the server
    log "Starting Node.js server on port $LOCAL_PORT..."
    nohup node server.js > logs/server.log 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 3
    
    # Test the server
    if curl -s http://localhost:$LOCAL_PORT/api/health > /dev/null; then
        log "✅ Local server started successfully!"
        log "🌐 Dashboard: http://localhost:$LOCAL_PORT"
        log "🔮 Observation Lounge: http://localhost:$LOCAL_PORT/observation-lounge"
        log "📋 Projects: http://localhost:$LOCAL_PORT/projects"
        log "📊 API Health: http://localhost:$LOCAL_PORT/api/health"
        
        # Open browser
        if command_exists open; then
            open http://localhost:$LOCAL_PORT
        fi
    else
        error "Failed to start local server"
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    log "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        error "Vercel CLI not found. Please install it with: npm i -g vercel"
    fi
    
    # Deploy to Vercel
    log "Running Vercel deployment..."
    vercel --prod
    
    # Get the deployment URL
    DEPLOY_URL=$(vercel ls | grep $VERCEL_PROJECT | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOY_URL" ]; then
        log "✅ Vercel deployment successful!"
        log "🌐 Deployed URL: $DEPLOY_URL"
        
        # Test the deployment
        sleep 5
        if curl -s "$DEPLOY_URL/api/health" > /dev/null; then
            log "✅ Deployment health check passed!"
            
            # Open browser
            if command_exists open; then
                open "$DEPLOY_URL"
            fi
        else
            warn "Deployment health check failed"
        fi
    else
        error "Failed to get deployment URL"
    fi
}

# Function to run tests
run_tests() {
    log "Running tests..."
    
    if [ -f "package.json" ] && grep -q "test" package.json; then
        npm test
    else
        warn "No test script found in package.json"
    fi
}

# Function to run linting
run_lint() {
    log "Running linting..."
    
    if [ -f "package.json" ] && grep -q "lint" package.json; then
        npm run lint
    else
        warn "No lint script found in package.json"
    fi
}

# Function to show status
show_status() {
    log "=== Deployment Status ==="
    
    # Local server status
    if lsof -Pi :$LOCAL_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Local server running on port $LOCAL_PORT${NC}"
    else
        echo -e "${RED}❌ Local server not running${NC}"
    fi
    
    # Vercel deployment status
    if command_exists vercel; then
        echo -e "${BLUE}📊 Vercel deployments:${NC}"
        vercel ls | grep $VERCEL_PROJECT || echo "No deployments found"
    fi
    
    # File structure check
    echo -e "${BLUE}📁 File structure:${NC}"
    if [ -d "public" ]; then
        echo -e "${GREEN}✅ public/ directory exists${NC}"
        ls -la public/ | head -5
    else
        echo -e "${RED}❌ public/ directory missing${NC}"
    fi
    
    if [ -d "src" ]; then
        echo -e "${GREEN}✅ src/ directory exists${NC}"
        ls -la src/
    else
        echo -e "${RED}❌ src/ directory missing${NC}"
    fi
}

# Main function
main() {
    log "🚀 AlexAI Star Trek Agile System - Unified Deployment"
    log "=================================================="
    
    case "${1:-help}" in
        "local")
            setup_environment
            start_local_server
            ;;
        "deploy")
            setup_environment
            run_lint
            run_tests
            deploy_vercel
            ;;
        "both")
            setup_environment
            run_lint
            run_tests
            start_local_server
            deploy_vercel
            ;;
        "stop")
            kill_port $LOCAL_PORT
            log "Local server stopped"
            ;;
        "status")
            show_status
            ;;
        "setup")
            setup_environment
            log "Environment setup complete"
            ;;
        "test")
            run_tests
            ;;
        "lint")
            run_lint
            ;;
        "help"|*)
            echo "Usage: $0 {local|deploy|both|stop|status|setup|test|lint}"
            echo ""
            echo "Commands:"
            echo "  local   - Start local development server"
            echo "  deploy  - Deploy to Vercel"
            echo "  both    - Start local server and deploy to Vercel"
            echo "  stop    - Stop local server"
            echo "  status  - Show deployment status"
            echo "  setup   - Setup environment (copy files, install deps)"
            echo "  test    - Run tests"
            echo "  lint    - Run linting"
            echo "  help    - Show this help message"
            ;;
    esac
}

# Run main function with all arguments
main "$@" 