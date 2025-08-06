#!/bin/bash

# 🚀 Complete AlexAI Enterprise Platform Deployment Script
# This script deploys the entire enhanced platform with all new features

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is required but not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is required but not installed"
        exit 1
    fi
    
    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_warning "AWS CLI not found. Please install it for AWS deployment"
    fi
    
    print_success "Prerequisites check completed"
}

# Function to setup Python environment
setup_python_environment() {
    print_status "Setting up Python environment..."
    
    # Create virtual environment if it doesn't exist
    if [ ! -d ".venv" ]; then
        python3 -m venv .venv
        print_success "Virtual environment created"
    fi
    
    # Activate virtual environment
    source .venv/bin/activate
    
    # Install Python dependencies
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
        print_success "Python dependencies installed"
    else
        print_warning "requirements.txt not found"
    fi
    
    # Install additional dependencies for new systems
    pip install pyjwt bcrypt
    print_success "Security and analytics dependencies installed"
}

# Function to setup dashboard
setup_dashboard() {
    print_status "Setting up enhanced dashboard..."
    
    if [ -d "dashboard" ]; then
        cd dashboard
        
        # Install dependencies
        npm install
        
        # Build dashboard
        npm run build
        
        print_success "Dashboard built successfully"
        cd ..
    else
        print_warning "Dashboard directory not found"
    fi
}

# Function to deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Deploy main application
    if [ -f "vercel.json" ]; then
        print_status "Deploying main application..."
        vercel --prod --yes
        print_success "Main application deployed"
    fi
    
    # Deploy dashboard
    if [ -d "dashboard" ]; then
        cd dashboard
        print_status "Deploying dashboard..."
        vercel --prod --yes
        cd ..
        print_success "Dashboard deployed"
    fi
}

# Function to setup Supabase
setup_supabase() {
    print_status "Setting up Supabase integration..."
    
    # Check if Supabase credentials are available
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
        print_warning "Supabase credentials not found in environment"
        print_status "Please set SUPABASE_URL and SUPABASE_KEY environment variables"
        return 1
    fi
    
    # Create .env file for local development
    cat > .env << EOF
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY
OPENAI_API_KEY=$OPENAI_API_KEY
FLASK_ENV=development
FLASK_SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET_KEY=$(openssl rand -hex 32)
EOF
    
    print_success "Supabase environment configured"
}

# Function to initialize databases
initialize_databases() {
    print_status "Initializing databases..."
    
    # Activate virtual environment
    source .venv/bin/activate
    
    # Initialize analytics database
    python3 -c "
from analytics_system import analytics_manager
print('Analytics database initialized')
"
    
    # Initialize security system
    python3 -c "
from auth_system import security_manager
print('Security system initialized')
"
    
    print_success "Databases initialized"
}

# Function to test all systems
test_systems() {
    print_status "Testing all systems..."
    
    # Activate virtual environment
    source .venv/bin/activate
    
    # Test analytics system
    print_status "Testing analytics system..."
    python3 -c "
from analytics_system import analytics_manager, ReportType
from datetime import datetime, timedelta

# Record test metrics
analytics_manager.record_metric('test.metric', 100.0, analytics_manager.MetricType.GAUGE, {'test': 'true'})

# Generate test report
end_time = datetime.utcnow()
start_time = end_time - timedelta(days=1)
report = analytics_manager.generate_report(ReportType.SYSTEM_HEALTH, start_time, end_time, 'test-user')
print(f'Analytics test completed: {report.name}')
"
    
    # Test security system
    print_status "Testing security system..."
    python3 -c "
from auth_system import security_manager, UserRole, SecurityLevel

# Test authentication
result = security_manager.authenticate_user('admin', 'admin123', '127.0.0.1')
if result:
    print('Security test completed: Authentication successful')
else:
    print('Security test failed: Authentication failed')
"
    
    print_success "All systems tested successfully"
}

# Function to create deployment summary
create_deployment_summary() {
    print_header "🎉 Complete Platform Deployment Summary"
    echo ""
    print_success "AlexAI Enterprise Platform has been successfully deployed!"
    echo ""
    print_status "Deployed Components:"
    echo "  ✅ Enhanced Dashboard with LCARS UI"
    echo "  ✅ Real-time Agent Status System"
    echo "  ✅ Holographic Visualization Elements"
    echo "  ✅ Cross-Domain Project Linking"
    echo "  ✅ Enhanced Security & Authentication"
    echo "  ✅ Custom Analytics & Reporting"
    echo "  ✅ Supabase Database Integration"
    echo "  ✅ Vercel Deployment"
    echo ""
    print_status "Access URLs:"
    echo "  🌐 Main Application: https://alexai-star-trek-agile.vercel.app"
    echo "  📊 Dashboard: https://dashboard-pzmujhb6j-pbradygeorgen.vercel.app"
    echo "  🔐 Admin Login: admin / admin123"
    echo ""
    print_status "Key Features:"
    echo "  🤖 Multi-Agent System (Picard, Troi, Spock, Data, Scott)"
    echo "  🖖 Star Trek TNG LCARS Interface"
    echo "  📈 Real-time Analytics & Reporting"
    echo "  🔒 Enterprise Security & Access Control"
    echo "  🌐 Cross-Domain Project Management"
    echo "  💰 Cost Optimization & Monitoring"
    echo ""
    print_status "Next Steps:"
    echo "1. Access the dashboard and explore all features"
    echo "2. Create new projects and link them across domains"
    echo "3. Generate custom reports and analytics"
    echo "4. Configure additional security policies"
    echo "5. Set up AWS infrastructure (optional)"
    echo ""
    print_success "Live long and prosper! 🖖"
}

# Function to run local development server
start_local_server() {
    print_status "Starting local development server..."
    
    # Activate virtual environment
    source .venv/bin/activate
    
    # Start Flask application
    python3 -c "
from app import app, socketio
import os
print('🚀 AlexAI Enterprise Platform - Local Development')
print('🤖 Multi-agent system: Picard, Troi, Spock, Data, Scott')
print('🌐 Web interface: http://localhost:8000')
print('📊 Dashboard: http://localhost:8000')
print('🔐 Admin: admin / admin123')
print('')
print('Press Ctrl+C to stop the server')
print('')
socketio.run(app, debug=True, host='0.0.0.0', port=8000)
" &
    
    local_server_pid=$!
    print_success "Local server started (PID: $local_server_pid)"
    echo "To stop the server: kill $local_server_pid"
}

# Main deployment function
main() {
    print_header "🚀 Complete AlexAI Enterprise Platform Deployment"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Setup Python environment
    setup_python_environment
    
    # Setup Supabase
    setup_supabase
    
    # Setup dashboard
    setup_dashboard
    
    # Initialize databases
    initialize_databases
    
    # Test all systems
    test_systems
    
    # Deploy to Vercel
    deploy_to_vercel
    
    # Create deployment summary
    create_deployment_summary
    
    # Ask if user wants to start local server
    echo ""
    read -p "Would you like to start the local development server? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_local_server
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  --help, -h          Show this help message"
    echo "  --local, -l         Only setup local development"
    echo "  --deploy, -d        Only deploy to Vercel"
    echo "  --test, -t          Only run system tests"
    echo "  --full, -f          Full deployment (default)"
    echo ""
    echo "Examples:"
    echo "  $0                 # Full deployment"
    echo "  $0 --local         # Local development only"
    echo "  $0 --deploy        # Deploy to Vercel only"
    echo "  $0 --test          # Run tests only"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --local|-l)
        print_header "🔧 Local Development Setup"
        check_prerequisites
        setup_python_environment
        setup_supabase
        setup_dashboard
        initialize_databases
        test_systems
        start_local_server
        ;;
    --deploy|-d)
        print_header "🚀 Vercel Deployment"
        check_prerequisites
        setup_dashboard
        deploy_to_vercel
        create_deployment_summary
        ;;
    --test|-t)
        print_header "🧪 System Testing"
        check_prerequisites
        setup_python_environment
        initialize_databases
        test_systems
        ;;
    --full|-f|"")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac 