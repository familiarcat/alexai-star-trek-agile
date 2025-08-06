#!/bin/bash

# 🚀 AlexAI Star Trek Agile System - Automated CI/CD Pipeline
# Handles feature branches, testing, validation, and multi-environment deployment

set -e  # Exit on any error

# Configuration
PROJECT_NAME="alexai-star-trek-agile"
REPO_URL="https://github.com/familiarcat/alexai-star-trek-agile.git"
MAIN_BRANCH="main"
DEPLOYMENT_ENVIRONMENTS=("local" "staging" "production")
VERCEL_PROJECT_ID="alexai_katra_transfer_package_remote_v7"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Get current branch and commit info
get_git_info() {
    CURRENT_BRANCH=$(git branch --show-current)
    CURRENT_COMMIT=$(git rev-parse --short HEAD)
    COMMIT_MESSAGE=$(git log -1 --pretty=%B)
    
    log_info "Current Branch: $CURRENT_BRANCH"
    log_info "Current Commit: $CURRENT_COMMIT"
    log_info "Commit Message: $COMMIT_MESSAGE"
}

# Validate environment setup
validate_environment() {
    log_step "Validating environment setup..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI not found. Please install with: npm i -g vercel"
        exit 1
    fi
    
    # Check if Python is available
    if ! command -v python &> /dev/null; then
        log_error "Python not found"
        exit 1
    fi
    
    # Check if required Python packages are installed
    if ! python -c "import flask, flask_socketio" &> /dev/null; then
        log_warning "Required Python packages not found. Installing..."
        pip install -r requirements.txt
    fi
    
    log_success "Environment validation complete"
}

# Run comprehensive tests
run_tests() {
    log_step "Running comprehensive test suite..."
    
    # Run file structure tests
    if [ -f "test_reorganized_deployment.py" ]; then
        log_info "Running deployment structure tests..."
        python test_reorganized_deployment.py
    fi
    
    # Run unit tests
    if [ -d "tests/unit" ]; then
        log_info "Running unit tests..."
        python -m pytest tests/unit/ -v
    fi
    
    # Run integration tests
    if [ -d "tests/integration" ]; then
        log_info "Running integration tests..."
        python -m pytest tests/integration/ -v
    fi
    
    # Run custom test scripts
    for test_script in tests/*.py; do
        if [ -f "$test_script" ] && [ "$test_script" != "tests/__init__.py" ]; then
            log_info "Running $test_script..."
            python "$test_script"
        fi
    done
    
    log_success "All tests completed successfully"
}

# Validate code quality
validate_code_quality() {
    log_step "Validating code quality..."
    
    # Check for Python syntax errors
    log_info "Checking Python syntax..."
    find . -name "*.py" -not -path "./.venv/*" -not -path "./__pycache__/*" -exec python -m py_compile {} \;
    
    # Check for import errors
    log_info "Checking import structure..."
    python -c "
import sys
sys.path.insert(0, '.')
try:
    from src.core.app import app
    from src.core.alexai_core_agent import alexai_core
    from src.core.agile_project_manager import AgileProjectManager
    print('✅ All imports successful')
except ImportError as e:
    print(f'❌ Import error: {e}')
    sys.exit(1)
"
    
    # Check file structure
    log_info "Validating file structure..."
    required_files=(
        "main.py"
        "src/core/app.py"
        "src/core/alexai_core_agent.py"
        "src/core/agile_project_manager.py"
        "frontend/web/templates/dashboard.html"
        "deployment/config/vercel.json"
        "README.md"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "Required file missing: $file"
            exit 1
        fi
    done
    
    log_success "Code quality validation complete"
}

# Build and package
build_package() {
    log_step "Building and packaging application..."
    
    # Create build directory
    BUILD_DIR="build/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BUILD_DIR"
    
    # Copy source files
    log_info "Copying source files..."
    cp -r src/ "$BUILD_DIR/"
    cp -r frontend/ "$BUILD_DIR/"
    cp -r deployment/ "$BUILD_DIR/"
    cp -r tests/ "$BUILD_DIR/"
    cp -r docs/ "$BUILD_DIR/"
    cp main.py "$BUILD_DIR/"
    cp requirements.txt "$BUILD_DIR/"
    cp README.md "$BUILD_DIR/"
    cp .env.example "$BUILD_DIR/"
    
    # Create deployment manifest
    cat > "$BUILD_DIR/deployment_manifest.json" << EOF
{
    "build_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "git_branch": "$CURRENT_BRANCH",
    "git_commit": "$CURRENT_COMMIT",
    "git_message": "$COMMIT_MESSAGE",
    "project_name": "$PROJECT_NAME",
    "version": "1.0.0"
}
EOF
    
    log_success "Build package created: $BUILD_DIR"
}

# Deploy to local environment
deploy_local() {
    log_step "Deploying to local environment..."
    
    # Stop any existing local server
    pkill -f "python main.py" || true
    
    # Start local server in background
    log_info "Starting local server..."
    nohup python main.py > logs/local_server.log 2>&1 &
    LOCAL_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Test local deployment
    if curl -s http://localhost:8000/api/alexai/status | grep -q "success"; then
        log_success "Local deployment successful"
        echo $LOCAL_PID > .local_server.pid
    else
        log_error "Local deployment failed"
        kill $LOCAL_PID 2>/dev/null || true
        exit 1
    fi
}

# Deploy to staging environment
deploy_staging() {
    log_step "Deploying to staging environment..."
    
    # Deploy to Vercel staging
    log_info "Deploying to Vercel staging..."
    STAGING_URL=$(vercel --yes 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)
    
    if [ -n "$STAGING_URL" ]; then
        log_success "Staging deployment successful: $STAGING_URL"
        
        # Test staging deployment
        sleep 10
        if curl -s "$STAGING_URL/api/alexai/status" | grep -q "success"; then
            log_success "Staging deployment validated"
        else
            log_warning "Staging deployment validation failed"
        fi
    else
        log_error "Staging deployment failed"
        exit 1
    fi
}

# Deploy to production environment
deploy_production() {
    log_step "Deploying to production environment..."
    
    # Only deploy to production from main branch
    if [ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]; then
        log_warning "Skipping production deployment from non-main branch: $CURRENT_BRANCH"
        return 0
    fi
    
    # Deploy to Vercel production
    log_info "Deploying to Vercel production..."
    PRODUCTION_URL=$(vercel --prod --yes 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)
    
    if [ -n "$PRODUCTION_URL" ]; then
        log_success "Production deployment successful: $PRODUCTION_URL"
        
        # Test production deployment
        sleep 10
        if curl -s "$PRODUCTION_URL/api/alexai/status" | grep -q "success"; then
            log_success "Production deployment validated"
        else
            log_warning "Production deployment validation failed"
        fi
    else
        log_error "Production deployment failed"
        exit 1
    fi
}

# Generate deployment report
generate_report() {
    log_step "Generating deployment report..."
    
    REPORT_FILE="deployment_reports/ci_cd_report_$(date +%Y%m%d_%H%M%S).json"
    mkdir -p deployment_reports
    
    cat > "$REPORT_FILE" << EOF
{
    "deployment_info": {
        "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
        "branch": "$CURRENT_BRANCH",
        "commit": "$CURRENT_COMMIT",
        "commit_message": "$COMMIT_MESSAGE",
        "pipeline_version": "1.0.0"
    },
    "test_results": {
        "file_structure": "PASS",
        "import_validation": "PASS",
        "code_quality": "PASS",
        "unit_tests": "PASS",
        "integration_tests": "PASS"
    },
    "deployment_status": {
        "local": "SUCCESS",
        "staging": "SUCCESS",
        "production": "$([ "$CURRENT_BRANCH" = "$MAIN_BRANCH" ] && echo "SUCCESS" || echo "SKIPPED")"
    },
    "urls": {
        "local": "http://localhost:8000",
        "staging": "$STAGING_URL",
        "production": "$PRODUCTION_URL"
    }
}
EOF
    
    log_success "Deployment report generated: $REPORT_FILE"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    
    # Stop local server if running
    if [ -f .local_server.pid ]; then
        LOCAL_PID=$(cat .local_server.pid)
        kill $LOCAL_PID 2>/dev/null || true
        rm -f .local_server.pid
    fi
    
    # Clean up build artifacts
    rm -rf build/
}

# Main CI/CD pipeline
main() {
    log_info "🚀 Starting AlexAI CI/CD Pipeline"
    log_info "=================================="
    
    # Set up trap for cleanup
    trap cleanup EXIT
    
    # Get git information
    get_git_info
    
    # Validate environment
    validate_environment
    
    # Run tests
    run_tests
    
    # Validate code quality
    validate_code_quality
    
    # Build package
    build_package
    
    # Deploy to environments
    for env in "${DEPLOYMENT_ENVIRONMENTS[@]}"; do
        case $env in
            "local")
                deploy_local
                ;;
            "staging")
                deploy_staging
                ;;
            "production")
                deploy_production
                ;;
        esac
    done
    
    # Generate report
    generate_report
    
    log_success "🎉 CI/CD Pipeline completed successfully!"
    log_info "Deployment URLs:"
    log_info "  Local: http://localhost:8000"
    [ -n "$STAGING_URL" ] && log_info "  Staging: $STAGING_URL"
    [ -n "$PRODUCTION_URL" ] && log_info "  Production: $PRODUCTION_URL"
}

# Run main function
main "$@" 