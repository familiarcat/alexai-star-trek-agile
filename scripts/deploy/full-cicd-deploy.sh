#!/bin/bash

# 🖖 AlexAI Star Trek Agile System - Full CI/CD Deployment Script
# Comprehensive deployment orchestration for all deployment targets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="alexai_katra_transfer_package_remote_v7"
GITHUB_REPO="familiarcat/alexai-star-trek-agile"
LOCAL_PORT=8000

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

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

success() {
    echo -e "${PURPLE}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if we're in a git repository
check_git_repo() {
    if [ ! -d ".git" ]; then
        error "Not in a git repository. Please run this script from the project root."
    fi
}

# Function to check git status
check_git_status() {
    if [ -n "$(git status --porcelain)" ]; then
        warn "You have uncommitted changes. Consider committing them before deployment."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Deployment cancelled."
        fi
    fi
}

# Function to auto-commit changes
auto_commit_changes() {
    local commit_message=${1:-"Auto-commit: $(date +'%Y-%m-%d %H:%M:%S')"}
    
    if [ -n "$(git status --porcelain)" ]; then
        log "Auto-committing changes..."
        
        # Add all changes
        git add .
        
        # Commit with provided message or default
        git commit -m "$commit_message"
        
        success "Changes auto-committed: $commit_message"
    else
        info "No changes to commit"
    fi
}

# Function to auto-commit and push
auto_commit_and_push() {
    local commit_message=${1:-"Auto-commit: $(date +'%Y-%m-%d %H:%M:%S')"}
    
    auto_commit_changes "$commit_message"
    
    # Push to remote
    log "Pushing to remote repository..."
    git push origin $(git branch --show-current)
    
    success "Changes pushed to remote repository"
}

# Function to trigger GitHub Actions workflow
trigger_github_workflow() {
    local deployment_target=$1
    
    if ! command_exists gh; then
        error "GitHub CLI (gh) not found. Please install it first: https://cli.github.com/"
    fi
    
    # Auto-commit and push changes before triggering workflow
    auto_commit_and_push "Auto-commit before CI/CD deployment: $deployment_target"
    
    log "Triggering GitHub Actions workflow for deployment target: $deployment_target"
    
    gh workflow run full-cicd-pipeline.yml \
        --field deployment_target="$deployment_target" \
        --repo "$GITHUB_REPO"
    
    success "GitHub Actions workflow triggered successfully!"
    info "You can monitor the progress at: https://github.com/$GITHUB_REPO/actions"
}

# Function to start local development server
local_deployment() {
    log "Starting local deployment..."
    
    # Check if port is already in use
    if lsof -Pi :$LOCAL_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        warn "Port $LOCAL_PORT is already in use. Stopping existing process..."
        lsof -ti:$LOCAL_PORT | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    # Start the server
    log "Starting local development server..."
    nohup npm run dev > logs/server.log 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start (Next.js takes longer)
    log "Waiting for server to start..."
    sleep 10
    
    # Test the server (Next.js runs on port 3000 by default)
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1 || curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        success "Local server started successfully!"
        info "🌐 Dashboard: http://localhost:3000 (or 3001 if 3000 is busy)"
        info "🔮 Observation Lounge: http://localhost:3000/observation-lounge"
        info "📋 Projects: http://localhost:3000/projects"
        info "📊 API Health: http://localhost:3000/api/health"
        
        # Open browser
        if command_exists open; then
            open http://localhost:3000
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
    
    success "Vercel deployment completed!"
}

# Function to deploy Docker
deploy_docker() {
    log "Building and deploying Docker image..."
    
    # Check if Docker is installed
    if ! command_exists docker; then
        error "Docker not found. Please install Docker first."
    fi
    
    # Build Docker image
    log "Building Docker image..."
    docker build -t alexai-star-trek:latest .
    
    # Run Docker container
    log "Starting Docker container..."
    docker run -d \
        --name alexai-star-trek \
        -p 8000:8000 \
        -e NODE_ENV=production \
        alexai-star-trek:latest
    
    success "Docker deployment completed!"
    info "Container is running on port 8000"
}

# Function to run tests
run_tests() {
    log "Running tests..."
    
    if [ -f "package.json" ] && grep -q "test" package.json; then
        npm test
        success "Tests passed!"
    else
        warn "No test script found in package.json"
    fi
}

# Function to run linting
run_lint() {
    log "Running linting..."
    
    if [ -f "package.json" ] && grep -q "lint" package.json; then
        npm run lint
        success "Linting passed!"
    else
        warn "No lint script found in package.json"
    fi
}

# Function to show deployment status
show_status() {
    log "=== Deployment Status ==="
    
    # Local server status
    if lsof -Pi :$LOCAL_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Local server running on port $LOCAL_PORT${NC}"
    else
        echo -e "${RED}❌ Local server not running${NC}"
    fi
    
    # Docker container status
    if command_exists docker; then
        if docker ps | grep -q alexai-star-trek; then
            echo -e "${GREEN}✅ Docker container running${NC}"
        else
            echo -e "${RED}❌ Docker container not running${NC}"
        fi
    fi
    
    # Vercel deployment status
    if command_exists vercel; then
        echo -e "${BLUE}📊 Vercel deployments:${NC}"
        vercel ls | grep alexai || echo "No deployments found"
    fi
    
    # GitHub Actions status
    if command_exists gh; then
        echo -e "${BLUE}📊 Recent GitHub Actions runs:${NC}"
        gh run list --limit 5 --repo "$GITHUB_REPO" || echo "No recent runs found"
    fi
}

# Function to show help
show_help() {
    echo "🚀 AlexAI Star Trek Agile System - Full CI/CD Deployment"
    echo "========================================================"
    echo ""
    echo "Usage: $0 {command} [options]"
    echo ""
    echo "Commands:"
    echo "  local                    - Start local development server"
    echo "  vercel                   - Deploy to Vercel"
    echo "  docker                   - Deploy using Docker"
    echo "  ci-cd {target}           - Trigger GitHub Actions CI/CD pipeline"
    echo "  test                     - Run tests"
    echo "  lint                     - Run linting"
    echo "  status                   - Show deployment status"
    echo "  stop                     - Stop local server and Docker containers"
    echo "  help                     - Show this help message"
    echo ""
    echo "CI/CD Targets:"
    echo "  all                      - Deploy all versions (legacy + modern + docker)"
    echo "  legacy                   - Deploy legacy JavaScript version only"
    echo "  modern                   - Deploy modern Next.js version only"
    echo "  docker                   - Build and push Docker image only"
    echo "  vercel                   - Deploy to Vercel only"
    echo ""
    echo "Examples:"
    echo "  $0 local                 # Start local server"
    echo "  $0 ci-cd all            # Trigger full CI/CD pipeline"
    echo "  $0 ci-cd modern         # Deploy only modern version"
    echo "  $0 status               # Check deployment status"
    echo ""
    echo "Environment Variables:"
    echo "  GITHUB_REPO             - GitHub repository (default: your-username/alexai_katra_transfer_package_remote_v7)"
    echo "  LOCAL_PORT              - Local server port (default: 8000)"
}

# Function to stop services
stop_services() {
    log "Stopping all services..."
    
    # Stop local server
    if lsof -Pi :$LOCAL_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log "Stopping local server on port $LOCAL_PORT"
        lsof -ti:$LOCAL_PORT | xargs kill -9
    fi
    
    # Stop Docker containers
    if command_exists docker; then
        if docker ps | grep -q alexai-star-trek; then
            log "Stopping Docker container"
            docker stop alexai-star-trek
            docker rm alexai-star-trek
        fi
    fi
    
    success "All services stopped!"
}

# Main function
main() {
    log "🚀 AlexAI Star Trek Agile System - Full CI/CD Deployment"
    log "========================================================"
    
    # Check if we're in a git repository
    check_git_repo
    
    case "${1:-help}" in
        "local")
            local_deployment
            ;;
        "vercel")
            deploy_vercel
            ;;
        "docker")
            deploy_docker
            ;;
        "ci-cd")
            check_git_status
            local target="${2:-all}"
            trigger_github_workflow "$target"
            ;;
        "test")
            run_tests
            ;;
        "lint")
            run_lint
            ;;
        "status")
            show_status
            ;;
        "stop")
            stop_services
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@" 
