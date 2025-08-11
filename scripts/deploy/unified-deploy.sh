#!/bin/bash

# 🖖 AlexAI Star Trek Agile System - Unified Deployment Script
# Handles both local development and production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="alexai-star-trek-agile"
NEXTJS_PORT=3000
API_PORT=8000

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

success() {
    echo -e "${PURPLE}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if ports are available
check_ports() {
    local nextjs_port=$1
    local api_port=$2
    
    if lsof -Pi :$nextjs_port -sTCP:LISTEN -t >/dev/null 2>&1; then
        warn "Port $nextjs_port is already in use"
        read -p "Kill process on port $nextjs_port? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            lsof -ti:$nextjs_port | xargs kill -9
            sleep 2
        else
            error "Port $nextjs_port is required for Next.js"
        fi
    fi
    
    if lsof -Pi :$api_port -sTCP:LISTEN -t >/dev/null 2>&1; then
        warn "Port $api_port is already in use"
        read -p "Kill process on port $api_port? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            lsof -ti:$api_port | xargs kill -9
            sleep 2
        else
            error "Port $api_port is required for API server"
        fi
    fi
}

# Function to start local development
start_local() {
    log "Starting local development environment..."
    
    # Check ports
    check_ports $NEXTJS_PORT $API_PORT
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    # Start API server in background
    log "Starting Express.js API server on port $API_PORT..."
    nohup npm run server > logs/api-server.log 2>&1 &
    API_PID=$!
    
    # Wait for API server to start
    sleep 3
    
    # Test API server
    if curl -s http://localhost:$API_PORT/api/health > /dev/null; then
        success "API server started successfully on port $API_PORT"
    else
        error "Failed to start API server"
    fi
    
    # Start Next.js development server
    log "Starting Next.js development server on port $NEXTJS_PORT..."
    nohup npm run dev > logs/nextjs-server.log 2>&1 &
    NEXTJS_PID=$!
    
    # Wait for Next.js server to start
    sleep 5
    
    # Test Next.js server
    if curl -s http://localhost:$NEXTJS_PORT > /dev/null; then
        success "Next.js server started successfully on port $NEXTJS_PORT"
    else
        error "Failed to start Next.js server"
    fi
    
    # Save PIDs for cleanup
    echo $API_PID > logs/api-server.pid
    echo $NEXTJS_PID > logs/nextjs-server.pid
    
    # Display URLs
    echo ""
    echo -e "${PURPLE}🚀 AlexAI Star Trek Agile System - Local Development${NC}"
    echo "=================================================="
    echo -e "${GREEN}🌐 Next.js Frontend:${NC} http://localhost:$NEXTJS_PORT"
    echo -e "${BLUE}🔌 Express.js API:${NC} http://localhost:$API_PORT"
    echo -e "${YELLOW}📊 API Health:${NC} http://localhost:$API_PORT/api/health"
    echo -e "${CYAN}📋 Projects:${NC} http://localhost:$NEXTJS_PORT/projects"
    echo -e "${MAGENTA}🤖 AI Consultation:${NC} http://localhost:$NEXTJS_PORT/observation-lounge"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
    echo ""
    
    # Open browser
    if command_exists open; then
        open http://localhost:$NEXTJS_PORT
    fi
    
    # Wait for user to stop
    wait
}

# Function to stop local development
stop_local() {
    log "Stopping local development environment..."
    
    # Stop API server
    if [ -f logs/api-server.pid ]; then
        API_PID=$(cat logs/api-server.pid)
        if kill -0 $API_PID 2>/dev/null; then
            kill $API_PID
            success "Stopped API server (PID: $API_PID)"
        fi
        rm -f logs/api-server.pid
    fi
    
    # Stop Next.js server
    if [ -f logs/nextjs-server.pid ]; then
        NEXTJS_PID=$(cat logs/nextjs-server.pid)
        if kill -0 $NEXTJS_PID 2>/dev/null; then
            kill $NEXTJS_PID
            success "Stopped Next.js server (PID: $NEXTJS_PID)"
        fi
        rm -f logs/nextjs-server.pid
    fi
    
    # Kill any remaining processes on our ports
    lsof -ti:$NEXTJS_PORT | xargs kill -9 2>/dev/null || true
    lsof -ti:$API_PORT | xargs kill -9 2>/dev/null || true
    
    success "Local development environment stopped"
}

# Function to deploy to Vercel
deploy_vercel() {
    log "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        error "Vercel CLI not found. Please install it with: npm i -g vercel"
    fi
    
    # Build the project
    log "Building project..."
    npm run build
    
    # Deploy to Vercel
    log "Deploying to Vercel..."
    vercel --prod
    
    success "Vercel deployment completed!"
}

# Function to deploy to EC2
deploy_ec2() {
    log "Deploying to EC2..."
    
    # This would contain EC2-specific deployment logic
    # For now, we'll just build and prepare for deployment
    log "Building project for EC2 deployment..."
    npm run build
    
    # Create deployment package
    log "Creating deployment package..."
    tar -czf deployment.tar.gz \
        --exclude=node_modules \
        --exclude=.next \
        --exclude=.git \
        --exclude=logs \
        .
    
    success "EC2 deployment package created: deployment.tar.gz"
    warn "Manual deployment to EC2 required. Upload deployment.tar.gz and run:"
    echo "  npm install --production"
    echo "  npm start"
}

# Function to show status
show_status() {
    log "Checking system status..."
    
    echo ""
    echo -e "${PURPLE}📊 System Status${NC}"
    echo "=================="
    
    # Check Next.js server
    if curl -s http://localhost:$NEXTJS_PORT > /dev/null; then
        echo -e "${GREEN}✅ Next.js Server:${NC} Running on port $NEXTJS_PORT"
    else
        echo -e "${RED}❌ Next.js Server:${NC} Not running"
    fi
    
    # Check API server
    if curl -s http://localhost:$API_PORT/api/health > /dev/null; then
        echo -e "${GREEN}✅ API Server:${NC} Running on port $API_PORT"
    else
        echo -e "${RED}❌ API Server:${NC} Not running"
    fi
    
    # Check database
    if [ -f "storage/database/agile_manager.db" ]; then
        echo -e "${GREEN}✅ Database:${NC} Found"
    else
        echo -e "${YELLOW}⚠️  Database:${NC} Not found"
    fi
    
    echo ""
}

# Function to show help
show_help() {
    echo -e "${PURPLE}🖖 AlexAI Star Trek Agile System - Unified Deployment${NC}"
    echo "========================================================"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start local development environment"
    echo "  stop      Stop local development environment"
    echo "  status    Show system status"
    echo "  vercel    Deploy to Vercel"
    echo "  ec2       Deploy to EC2"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start local development"
    echo "  $0 vercel         # Deploy to Vercel"
    echo "  $0 status         # Check system status"
    echo ""
}

# Main execution
case "${1:-help}" in
    start)
        start_local
        ;;
    stop)
        stop_local
        ;;
    status)
        show_status
        ;;
    vercel)
        deploy_vercel
        ;;
    ec2)
        deploy_ec2
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 