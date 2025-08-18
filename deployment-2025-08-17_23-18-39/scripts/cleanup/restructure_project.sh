#!/bin/bash

# 🔧 Enhanced with Chief Engineer Scott's Robustness Features
# Prevents command and dquote errors through strict error handling
set -euo pipefail  # Strict error handling: exit on error, undefined vars, pipe failures

# Error handling function
handle_error() {
    local exit_code=$?
    local line_number=$1
    echo "❌ Error occurred in script at line $line_number (exit code: $exit_code)" >&2
    exit $exit_code
}

# Set error trap
trap 'handle_error $LINENO' ERR

# Logging functions
log_info() {
    echo "ℹ️  $1"
}

log_success() {
    echo "✅ $1"
}

log_warning() {
    echo "⚠️  $1"
}

log_error() {
    echo "❌ $1"
}

# Variable validation function
validate_vars() {
    local required_vars=("$@")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log_error "Required variable '$var' is not set"
            exit 1
        fi
    done
}

# Command validation function
validate_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        log_error "Required command '$1' is not available"
        exit 1
    fi
}

# Safe command execution with error checking
safe_exec() {
    "$@"
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log_error "Command failed with exit code $exit_code: $*"
        return $exit_code
    fi
    return 0
}


#!/bin/bash

# 🚀 AlexAI Star Trek Agile System - Project Restructuring Script
# Modernizes file structure to 2025 best practices and consolidates deployment

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

# Banner
show_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🖖 Project Restructuring 🖖                ║"
    echo "║              AlexAI Star Trek Agile System                  ║"
    echo "║                    2025 Best Practices                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Create modern 2025 file structure
create_modern_structure() {
    log "Creating modern 2025 file structure..."
    
    # Create new directory structure
    mkdir -p \
        app/{core,api,models,services,utils} \
        app/frontend/{components,pages,styles,assets} \
        app/frontend/components/{ui,layout,forms} \
        app/frontend/pages/{dashboard,projects,tasks} \
        config/{environments,scripts} \
        scripts/{deploy,setup,maintenance} \
        scripts/deploy/{local,vercel,production} \
        scripts/setup/{onboarding,environment} \
        scripts/maintenance/{cleanup,backup} \
        docs/{api,guides,architecture} \
        docs/api/{endpoints,examples} \
        docs/guides/{deployment,development,user} \
        docs/architecture/{diagrams,decisions} \
        tests/{unit,integration,e2e,fixtures} \
        tests/fixtures/{data,mocks} \
        tools/{linting,formatting,testing} \
        .github/{workflows,scripts} \
        .github/workflows/{ci,cd} \
        storage/{database,uploads,logs} \
        storage/database/{migrations,seeds} \
        storage/logs/{app,access,error}
    
    success "Modern directory structure created"
}

# Clean up old files and directories
cleanup_old_structure() {
    log "Cleaning up old file structure..."
    
    # Remove old directories
    rm -rf \
        backup_before_reorganization \
        frontend \
        deployment \
        data \
        logs \
        __pycache__ \
        .vercel
    
    # Remove old files
    rm -f \
        test_openai_connection.py \
        test_reorganized_deployment.py \
        reorganize_project.py \
        agile_system.db \
        analytics.db \
        current_instances.json \
        *.md \
        *.json \
        *.pyc \
        .DS_Store
    
    # Keep essential files
    touch README.md
    touch .gitignore
    touch requirements.txt
    touch main.py
    
    success "Old structure cleaned up"
}

# Move and reorganize source code
reorganize_source_code() {
    log "Reorganizing source code..."
    
    # Move core application files
    if [ -d "src" ]; then
        cp -r src/core/* app/core/ 2>/dev/null || true
        cp -r src/api/* app/api/ 2>/dev/null || true
        cp -r src/utils/* app/utils/ 2>/dev/null || true
        rm -rf src
    fi
    
    # Move frontend files
    if [ -d "frontend" ]; then
        cp -r frontend/web/templates/* app/frontend/pages/ 2>/dev/null || true
        cp -r frontend/web/static/* app/frontend/assets/ 2>/dev/null || true
    fi
    
    # Move database files
    if [ -f "agile_manager.db" ]; then
        mv agile_manager.db storage/database/
    fi
    
    success "Source code reorganized"
}

# Consolidate deployment scripts
consolidate_deployment_scripts() {
    log "Consolidating deployment scripts..."
    
    # Create main deployment script
    cat > scripts/deploy/main.sh << 'EOF'
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
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[WARNING] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; exit 1; }

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
EOF
    
    chmod +x scripts/deploy/main.sh
    
    # Create quick start scripts
    cat > start.sh << 'EOF'
#!/bin/bash
# Quick start for local development
./scripts/deploy/main.sh local
EOF
    
    cat > deploy.sh << 'EOF'
#!/bin/bash
# Quick deploy to Vercel
./scripts/deploy/main.sh production vercel
EOF
    
    chmod +x start.sh deploy.sh
    
    success "Deployment scripts consolidated"
}

# Create modern configuration files
create_modern_config() {
    log "Creating modern configuration files..."
    
    # Create modern requirements.txt
    cat > requirements.txt << 'EOF'
# AlexAI Star Trek Agile System - Dependencies
# Core Framework
Flask==3.0.0
Flask-SocketIO==5.3.6
Flask-CORS==4.0.0

# Database
SQLAlchemy==2.0.23
alembic==1.13.1

# AI and Machine Learning
openai==1.99.1
numpy==1.24.3
pandas==2.0.3

# Utilities
python-dotenv==1.0.0
requests==2.31.0
click==8.1.7
rich==13.7.0

# Development
pytest==7.4.3
pytest-cov==4.1.0
black==23.12.1
flake8==6.1.0
mypy==1.8.0

# Production
gunicorn==21.2.0
eventlet==0.35.2
EOF
    
    # Create modern .gitignore
    cat > .gitignore << 'EOF'
# AlexAI Star Trek Agile System - Git Ignore

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
storage/logs/*
!storage/logs/.gitkeep

# Database
storage/database/*.db
storage/database/*.sqlite

# Uploads
storage/uploads/*
!storage/uploads/.gitkeep

# Testing
.coverage
.pytest_cache/
htmlcov/

# Deployment
.vercel/
.railway/
.heroku/

# Temporary files
*.tmp
*.temp
*.log
EOF
    
    # Create modern main.py
    cat > main.py << 'EOF'
#!/usr/bin/env python3
"""
AlexAI Star Trek Agile System - Main Entry Point
Modern 2025 structure with consolidated deployment
"""

import os
import sys
from pathlib import Path

# Add app directory to Python path
app_path = Path(__file__).parent / "app"
sys.path.insert(0, str(app_path))

# Import the main application
from core.app import app

if __name__ == "__main__":
    # Set environment variables for development
    os.environ.setdefault('FLASK_ENV', 'development')
    os.environ.setdefault('FLASK_DEBUG', 'True')
    
    # Run the Flask application
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )
EOF
    
    # Create modern README.md
    cat > README.md << 'EOF'
# 🖖 AlexAI Star Trek Agile System

A modern AI-powered agile project management system with Star Trek theming and universal deployment.

## 🚀 Quick Start

### Local Development
```bash
./start.sh
```

### Deploy to Vercel
```bash
./deploy.sh
```

## 📁 Modern 2025 Structure

```
alexai-star-trek-agile/
├── app/                    # Application code
│   ├── core/              # Core business logic
│   ├── api/               # API endpoints
│   ├── models/            # Data models
│   ├── services/          # Business services
│   ├── utils/             # Utilities
│   └── frontend/          # Frontend assets
├── config/                # Configuration files
├── scripts/               # Deployment and maintenance scripts
├── docs/                  # Documentation
├── tests/                 # Test suite
├── tools/                 # Development tools
├── storage/               # Data storage
├── .github/               # GitHub workflows
├── start.sh              # Quick local start
├── deploy.sh             # Quick Vercel deploy
└── main.py               # Application entry point
```

## 🎯 Features

- 🤖 Multi-agent AI system with Star Trek crew
- 📊 Three-tier project management architecture
- 🎨 Authentic Star Trek TNG LCARS interface
- 🚀 Universal deployment (local, Vercel, Docker)
- 👥 Team onboarding automation
- 📱 Responsive design for all devices

## 🛠️ Development

```bash
# Setup environment
./scripts/setup/environment/setup.sh

# Run tests
./scripts/maintenance/testing/run_tests.sh

# Deploy
./scripts/deploy/main.sh production vercel
```

## 📚 Documentation

- [API Documentation](docs/api/)
- [Development Guide](docs/guides/development/)
- [Deployment Guide](docs/guides/deployment/)
- [Architecture Guide](docs/architecture/)

---

**Live long and prosper! 🖖**
EOF
    
    success "Modern configuration files created"
}

# Create essential directories and files
create_essential_files() {
    log "Creating essential files and directories..."
    
    # Create .gitkeep files for empty directories
    find . -type d -empty -exec touch {}/.gitkeep \;
    
    # Create storage structure
    mkdir -p storage/{database,migrations,seeds,uploads,logs}
    touch storage/database/.gitkeep
    touch storage/migrations/.gitkeep
    touch storage/seeds/.gitkeep
    touch storage/uploads/.gitkeep
    touch storage/logs/.gitkeep
    
    # Create app structure
    mkdir -p app/{core,api,models,services,utils}
    touch app/__init__.py
    touch app/core/__init__.py
    touch app/api/__init__.py
    touch app/models/__init__.py
    touch app/services/__init__.py
    touch app/utils/__init__.py
    
    # Create frontend structure
    mkdir -p app/frontend/{components,pages,styles,assets}
    touch app/frontend/__init__.py
    
    success "Essential files created"
}

# Main execution
main() {
    show_banner
    
    log "Starting project restructuring to 2025 best practices..."
    
    # Create backup
    info "Creating backup of current structure..."
    cp -r . ../alexai_backup_$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    
    # Execute restructuring steps
    create_modern_structure
    cleanup_old_structure
    reorganize_source_code
    consolidate_deployment_scripts
    create_modern_config
    create_essential_files
    
    success "🎉 Project restructuring completed!"
    
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo "1. Review the new structure"
    echo "2. Update your .env file with API keys"
    echo "3. Test local deployment: ./start.sh"
    echo "4. Deploy to Vercel: ./deploy.sh"
    echo ""
    echo -e "${YELLOW}Modern 2025 structure ready! 🚀${NC}"
}

# Run main function
main "$@" 