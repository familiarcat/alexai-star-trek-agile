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

# 🖖 AlexAI Star Trek Agile System - Team Onboarding Script
# Helps new developers get started quickly with the project

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
    echo "║                    🖖 Welcome to the Crew! 🖖                ║"
    echo "║              AlexAI Star Trek Agile System                  ║"
    echo "║                    Team Onboarding                          ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Check if running from project root
check_project_root() {
    if [ ! -f "main.py" ]; then
        error "Please run this script from the project root directory"
    fi
}

# Welcome new team member
welcome_team_member() {
    echo ""
    echo -e "${CYAN}Welcome to the AlexAI Star Trek Agile System team! 🖖${NC}"
    echo ""
    echo "This script will help you get set up quickly with the project."
    echo "You'll be able to start contributing in no time!"
    echo ""
    
    read -p "What's your name? " TEAM_MEMBER_NAME
    read -p "What's your role? (e.g., Frontend Developer, Backend Developer, DevOps) " TEAM_MEMBER_ROLE
    read -p "What's your preferred development environment? (local/docker) " DEV_ENVIRONMENT
    
    echo ""
    info "Welcome aboard, $TEAM_MEMBER_NAME! Your role: $TEAM_MEMBER_ROLE"
    echo ""
}

# Install system dependencies
install_system_dependencies() {
    log "Installing system dependencies..."
    
    # Detect OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y python3 python3-pip python3-venv git curl
        elif command -v yum &> /dev/null; then
            sudo yum install -y python3 python3-pip git curl
        elif command -v dnf &> /dev/null; then
            sudo dnf install -y python3 python3-pip git curl
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew &> /dev/null; then
            warn "Homebrew not found. Installing..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install python3 git curl
    else
        warn "Unsupported OS. Please install Python 3.8+, Git, and curl manually."
    fi
    
    success "System dependencies installed"
}

# Setup development environment
setup_development_environment() {
    log "Setting up development environment..."
    
    if [ "$DEV_ENVIRONMENT" = "docker" ]; then
        # Docker setup
        if ! command -v docker &> /dev/null; then
            error "Docker not found. Please install Docker first."
        fi
        
        if ! command -v docker-compose &> /dev/null; then
            error "Docker Compose not found. Please install Docker Compose first."
        fi
        
        info "Starting Docker environment..."
        docker-compose up -d
        
        success "Docker environment started"
        info "Access the application at: http://localhost:8000"
        
    else
        # Local setup
        info "Setting up local development environment..."
        
        # Create virtual environment
        python3 -m venv .venv
        source .venv/bin/activate
        
        # Install Python dependencies
        pip install --upgrade pip
        pip install -r requirements.txt
        
        # Setup environment variables
        if [ ! -f ".env" ]; then
            cp .env.example .env 2>/dev/null || {
                cat > .env << EOF
# AlexAI Star Trek Agile System Environment Variables
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_APP=main.py

# OpenAI Configuration (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=sqlite:///agile_manager.db

# Security
SECRET_KEY=alexai-agile-secret-key-change-in-production
EOF
            }
            warn "Created .env file - please update with your actual API keys"
        fi
        
        success "Local development environment setup completed"
    fi
}

# Initialize database and sample data
initialize_database() {
    log "Initializing database and sample data..."
    
    if [ "$DEV_ENVIRONMENT" = "docker" ]; then
        # Wait for container to be ready
        sleep 10
        docker-compose exec alexai-app python3 -c "
from app.core.agile_project_manager import AgileProjectManager
from app.database.mock import create_mock_data

manager = AgileProjectManager()
create_mock_data()
print('Database initialized successfully')
"
    else
        source .venv/bin/activate
        python3 -c "
from app.core.agile_project_manager import AgileProjectManager
from app.database.mock import create_mock_data

manager = AgileProjectManager()
create_mock_data()
print('Database initialized successfully')
"
    fi
    
    success "Database initialized with sample data"
}

# Run tests
run_tests() {
    log "Running tests to verify setup..."
    
    if [ "$DEV_ENVIRONMENT" = "docker" ]; then
        docker-compose exec alexai-app python3 -c "
from app.core.agile_project_manager import AgileProjectManager
manager = AgileProjectManager()
projects = manager.get_projects()
print(f'Test passed: {len(projects)} projects found')
"
    else
        source .venv/bin/activate
        python3 -c "
from app.core.agile_project_manager import AgileProjectManager
manager = AgileProjectManager()
projects = manager.get_projects()
print(f'Test passed: {len(projects)} projects found')
"
    fi
    
    success "Tests passed successfully"
}

# Setup Git hooks
setup_git_hooks() {
    log "Setting up Git hooks for code quality..."
    
    # Create .git/hooks directory if it doesn't exist
    mkdir -p .git/hooks
    
    # Pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."
python3 -m flake8 app/ --max-line-length=120 --ignore=E501,W503
python3 -m pytest tests/unit/ -v
EOF
    
    chmod +x .git/hooks/pre-commit
    
    success "Git hooks configured"
}

# Create developer workspace
create_developer_workspace() {
    log "Creating developer workspace..."
    
    # Create developer-specific directories
    mkdir -p workspace/$TEAM_MEMBER_NAME/{features,bugs,experiments}
    
    # Create developer README
    cat > workspace/$TEAM_MEMBER_NAME/README.md << EOF
# $TEAM_MEMBER_NAME's Workspace

## Role: $TEAM_MEMBER_ROLE

### Quick Start
1. Start the application: \`python main.py\`
2. Access: http://localhost:8000
3. Read: [Developer Guide](../DEVELOPER_GUIDE.md)

### Current Tasks
- [ ] Review the three-tier architecture
- [ ] Familiarize yourself with the Star Trek theme
- [ ] Test the drag & drop Kanban board
- [ ] Explore the AI agent system

### Notes
Add your development notes here...

### Resources
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/docs)
EOF
    
    success "Developer workspace created"
}

# Show next steps
show_next_steps() {
    echo ""
    echo -e "${CYAN}🎉 Welcome aboard, $TEAM_MEMBER_NAME! 🎉${NC}"
    echo ""
    echo -e "${GREEN}Your development environment is ready!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. 📖 Read the [Developer Guide](DEVELOPER_GUIDE.md)"
    echo "2. 🌐 Access the application: http://localhost:8000"
    echo "3. 🎯 Explore the three-tier architecture:"
    echo "   - Projects List (Mission Log)"
    echo "   - Project Kanban Dashboard"
    echo "   - Task Management with Drag & Drop"
    echo "4. 🤖 Test the AI agent system in the Observation Lounge"
    echo "5. 🔧 Start developing in your workspace: workspace/$TEAM_MEMBER_NAME/"
    echo ""
    echo "Useful Commands:"
    echo "  Start server: python main.py"
    echo "  Run tests: python -m pytest tests/"
    echo "  Docker: docker-compose up -d"
    echo "  Stop Docker: docker-compose down"
    echo ""
    echo -e "${YELLOW}Remember: Live long and prosper! 🖖${NC}"
    echo ""
}

# Main execution
main() {
    show_banner
    check_project_root
    welcome_team_member
    install_system_dependencies
    setup_development_environment
    initialize_database
    run_tests
    setup_git_hooks
    create_developer_workspace
    show_next_steps
}

# Run main function
main "$@" 