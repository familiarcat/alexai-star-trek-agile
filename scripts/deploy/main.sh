#!/bin/bash

# 🚀 AlexAI Star Trek Agile System - Main Deployment Script
# Unified deployment for local and production environments

set -e

# Configuration
PROJECT_NAME="alexai-star-trek-agile"
ENVIRONMENT=${1:-"local"}
PLATFORM=${2:-"auto"}

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[WARNING] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; exit 1; }
info() { echo -e "${BLUE}[INFO] $1${NC}"; }
success() { echo -e "${GREEN}[SUCCESS] $1${NC}"; }

# Show banner
echo "🚀 AlexAI Star Trek Agile System - Deployment"
echo "Environment: $ENVIRONMENT | Platform: $PLATFORM"
echo ""

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v python3 &> /dev/null; then
        error "Python 3 is required"
    fi
    
    if ! command -v git &> /dev/null; then
        error "Git is required"
    fi
    
    success "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    log "Setting up environment..."
    
    # Create virtual environment
    python3 -m venv .venv
    source .venv/bin/activate
    
    # Install dependencies
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Setup environment variables
    if [ ! -f ".env" ]; then
        cat > .env << 'ENVEOF'
# AlexAI Star Trek Agile System Environment Variables
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_APP=main.py

# OpenAI Configuration (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=sqlite:///storage/database/agile_manager.db

# Security
SECRET_KEY=alexai-agile-secret-key-change-in-production
ENVEOF
        warn "Created .env file - please update with your actual API keys"
    fi
    
    success "Environment setup completed"
}

# Initialize database
initialize_database() {
    log "Initializing database..."
    
    source .venv/bin/activate
    python3 -c "
from app.core.agile_project_manager import AgileProjectManager
from app.database.mock import create_mock_data

manager = AgileProjectManager()
create_mock_data()
print('Database initialized successfully')
"
    
    success "Database initialized"
}

# Start local server
start_local_server() {
    log "Starting local server..."
    
    source .venv/bin/activate
    
    # Check if port 8000 is available
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
        warn "Port 8000 is in use. Stopping existing process..."
        pkill -f "python.*main.py" || true
        sleep 2
    fi
    
    # Start the server
    nohup python3 main.py > storage/logs/app/server.log 2>&1 &
    SERVER_PID=$!
    
    sleep 3
    
    if curl -s http://localhost:8000 > /dev/null; then
        success "Local server started on http://localhost:8000"
        info "Server PID: $SERVER_PID"
        info "Log file: storage/logs/app/server.log"
    else
        error "Failed to start local server"
    fi
}

# Deploy to Vercel
deploy_vercel() {
    log "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    vercel --prod --yes
    
    success "Vercel deployment completed"
}

# Main deployment logic
main() {
    case $ENVIRONMENT in
        "local")
            check_prerequisites
            setup_environment
            initialize_database
            start_local_server
            ;;
        "vercel")
            deploy_vercel
            ;;
        "production")
            case $PLATFORM in
                "vercel") deploy_vercel ;;
                *) error "Unsupported platform: $PLATFORM" ;;
            esac
            ;;
        *)
            error "Unknown environment: $ENVIRONMENT"
            ;;
    esac
}

main "$@"
