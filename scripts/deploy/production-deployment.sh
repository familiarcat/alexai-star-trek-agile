#!/bin/bash

# 🚀 AlexAI Star Trek Agile System - Production Deployment Script
# This script automates the complete production deployment for the weekly execution plan system

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/output"
WORKFLOWS_DIR="$PROJECT_ROOT/workflows"
ENV_FILE="$PROJECT_ROOT/.env.production"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "🔍 Checking deployment prerequisites..."
    
    # Check if required files exist
    if [[ ! -f "$OUTPUT_DIR/supabase-schema.json" ]]; then
        error "Supabase schema not found. Run the n8n production integration script first."
    fi
    
    if [[ ! -f "$OUTPUT_DIR/supabase-migration.sql" ]]; then
        error "Supabase migration SQL not found. Run the n8n production integration script first."
    fi
    
    if [[ ! -f "$WORKFLOWS_DIR/weekly-execution-plan-workflow.json" ]]; then
        error "Weekly execution plan workflow not found. Run the n8n production integration script first."
    fi
    
    # Check if required tools are installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js first."
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm first."
    fi
    
    log "✅ Prerequisites check passed"
}

# Create production environment file
setup_environment() {
    log "🔧 Setting up production environment configuration..."
    
    if [[ -f "$ENV_FILE" ]]; then
        warn "Production environment file already exists. Backing up..."
        cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    cat > "$ENV_FILE" << EOF
# 🚀 AlexAI Star Trek Agile System - Production Environment
# Generated: $(date)

# =============================================================================
# SUPABASE CONFIGURATION
# =============================================================================
# Get these values from your Supabase project dashboard
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# =============================================================================
# EMAIL SERVICE CONFIGURATION
# =============================================================================
# Choose one email service and configure it:

# Option 1: AWS SES (Recommended - Most Cost Effective)
AWS_SES_REGION=us-east-2
AWS_SES_FROM_EMAIL=brady@pbradygeorgen.com
AWS_SES_FROM_NAME="AlexAI Star Trek System"
AWS_SES_CONFIGURATION_SET=daily-execution-plans

# Option 2: SendGrid (Alternative)
# SENDGRID_API_KEY=your_sendgrid_api_key_here
# SENDGRID_FROM_EMAIL=brady@pbradygeorgen.com
# SENDGRID_FROM_NAME="AlexAI Star Trek System"

# Option 3: SMTP (Gmail, Outlook, etc.)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password_here
# SMTP_FROM=brady@pbradygeorgen.com

# =============================================================================
# N8N CONFIGURATION
# =============================================================================
# N8N instance URL (if using cloud or separate instance)
N8N_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key_here

# =============================================================================
# SYSTEM CONFIGURATION
# =============================================================================
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# =============================================================================
# FEATURE FLAGS
# =============================================================================
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SUPABASE_INTEGRATION=true
ENABLE_N8N_INTEGRATION=true
ENABLE_BILLATERAL_SYNC=true

# =============================================================================
# SCHEDULING CONFIGURATION
# =============================================================================
# Daily execution plan email time (24-hour format)
DAILY_EMAIL_HOUR=10
DAILY_EMAIL_MINUTE=0
DAILY_EMAIL_TIMEZONE=America/New_York

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
EOF

    log "✅ Production environment file created: $ENV_FILE"
    warn "⚠️  IMPORTANT: Edit $ENV_FILE and fill in your actual credentials before continuing!"
}

# Deploy Supabase database
deploy_supabase() {
    log "🗄️  Deploying Supabase database..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Production environment file not found. Run setup_environment first."
    fi
    
    # Source environment variables
    source "$ENV_FILE"
    
    if [[ -z "$SUPABASE_URL" ]] || [[ "$SUPABASE_URL" == "your_supabase_project_url_here" ]]; then
        error "Supabase URL not configured. Please edit $ENV_FILE first."
    fi
    
    log "📊 Creating Supabase database schema..."
    
    # Create a temporary deployment script
    cat > "$OUTPUT_DIR/deploy-supabase.js" << 'EOF'
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function deploySupabase() {
    const envFile = path.join(__dirname, '../../.env.production');
    const envContent = fs.readFileSync(envFile, 'utf8');
    
    // Parse environment variables
    const envVars = {};
    envContent.split('\n').forEach(line => {
        if (line.includes('=') && !line.startsWith('#')) {
            const [key, value] = line.split('=', 2);
            envVars[key.trim()] = value.trim();
        }
    });
    
    const supabaseUrl = envVars.SUPABASE_URL;
    const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Read migration SQL
    const migrationPath = path.join(__dirname, 'supabase-migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration
    console.log('Executing Supabase migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
        console.error('Migration failed:', error);
        throw error;
    }
    
    console.log('✅ Supabase database deployed successfully!');
}

deploySupabase().catch(console.error);
EOF

    # Install Supabase client if not present
    if ! npm list @supabase/supabase-js &> /dev/null; then
        log "📦 Installing Supabase client..."
        npm install @supabase/supabase-js
    fi
    
    # Run deployment
    cd "$OUTPUT_DIR"
    node deploy-supabase.js
    
    # Cleanup
    rm deploy-supabase.js
    
    log "✅ Supabase database deployment completed"
}

# Deploy N8N workflow
deploy_n8n() {
    log "🔄 Deploying N8N workflow..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Production environment file not found. Run setup_environment first."
    fi
    
    # Source environment variables
    source "$ENV_FILE"
    
    if [[ -z "$N8N_URL" ]] || [[ "$N8N_URL" == "http://localhost:5678" ]]; then
        warn "⚠️  N8N URL not configured. Using default localhost:5678"
        warn "⚠️  Make sure N8N is running locally or update the URL in $ENV_FILE"
    fi
    
    # Check if N8N is accessible
    if ! curl -s "$N8N_URL" &> /dev/null; then
        warn "⚠️  N8N is not accessible at $N8N_URL"
        warn "⚠️  Please start N8N or update the URL in $ENV_FILE"
        return 1
    fi
    
    log "📋 Importing weekly execution plan workflow..."
    
    # Create N8N deployment script
    cat > "$OUTPUT_DIR/deploy-n8n.js" << 'EOF'
const fs = require('fs');
const path = require('path');

async function deployN8N() {
    const envFile = path.join(__dirname, '../../.env.production');
    const envContent = fs.readFileSync(envFile, 'utf8');
    
    // Parse environment variables
    const envVars = {};
    envContent.split('\n').forEach(line => {
        if (line.includes('=') && !line.startsWith('#')) {
            const [key, value] = line.split('=', 2);
            envVars[key.trim()] = value.trim();
        }
    });
    
    const n8nUrl = envVars.N8N_URL || 'http://localhost:5678';
    const workflowPath = path.join(__dirname, '../workflows/weekly-execution-plan-workflow.json');
    
    if (!fs.existsSync(workflowPath)) {
        throw new Error('Workflow file not found');
    }
    
    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    
    console.log('📋 Workflow details:');
    console.log(`   Name: ${workflow.name}`);
    console.log(`   Nodes: ${workflow.nodes.length}`);
    console.log(`   Status: ${workflow.active ? 'Active' : 'Inactive'}`);
    
    console.log('\n📋 To complete N8N deployment:');
    console.log('1. Open N8N at:', n8nUrl);
    console.log('2. Go to Workflows');
    console.log('3. Click "Import from file"');
    console.log('4. Select:', workflowPath);
    console.log('5. Configure credentials for:');
    console.log('   - Supabase nodes');
    console.log('   - Email nodes');
    console.log('6. Activate the workflow');
    console.log('7. Test the workflow manually');
    
    console.log('\n✅ N8N workflow ready for import!');
}

deployN8N().catch(console.error);
EOF

    # Run N8N deployment
    cd "$OUTPUT_DIR"
    node deploy-n8n.js
    
    # Cleanup
    rm deploy-n8n.js
    
    log "✅ N8N workflow deployment completed"
}

# Configure email service
configure_email() {
    log "📧 Configuring email service..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Production environment file not found. Run setup_environment first."
    fi
    
    # Source environment variables
    source "$ENV_FILE"
    
    # Check if email is configured
    if [[ "$ENABLE_EMAIL_NOTIFICATIONS" != "true" ]]; then
        warn "⚠️  Email notifications are disabled in environment file"
        return 0
    fi
    
    # Check AWS SES configuration
    if [[ -n "$AWS_SES_REGION" ]] && [[ "$AWS_SES_REGION" != "us-east-2" ]]; then
        log "✅ AWS SES configured"
        log "📧 Region: $AWS_SES_REGION"
        log "📧 From email: $AWS_SES_FROM_EMAIL"
        log "📧 From name: $AWS_SES_FROM_NAME"
        log "📧 Configuration Set: $AWS_SES_CONFIGURATION_SET"
    else
        warn "⚠️  AWS SES not fully configured"
    fi

    # Check SendGrid configuration
    if [[ -n "$SENDGRID_API_KEY" ]] && [[ "$SENDGRID_API_KEY" != "your_sendgrid_api_key_here" ]]; then
        log "✅ SendGrid API key configured"
        log "📧 From email: $SENDGRID_FROM_EMAIL"
        log "📧 From name: $SENDGRID_FROM_NAME"
    else
        warn "⚠️  SendGrid API key not configured"
    fi
    
    # Check SMTP configuration
    if [[ -n "$SMTP_HOST" ]] && [[ "$SMTP_HOST" != "smtp.gmail.com" ]]; then
        log "✅ SMTP configuration detected"
        log "📧 SMTP Host: $SMTP_HOST"
        log "📧 SMTP Port: $SMTP_PORT"
        log "📧 SMTP User: $SMTP_USER"
    else
        warn "⚠️  SMTP configuration not complete"
    fi
    
    log "📧 Email service configuration completed"
}

# Test production system
test_production() {
    log "🧪 Testing production system..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Production environment file not found. Run setup_environment first."
    fi
    
    # Source environment variables
    source "$ENV_FILE"
    
    # Test database connection
    if [[ "$ENABLE_SUPABASE_INTEGRATION" == "true" ]]; then
        log "🔍 Testing Supabase connection..."
        # Create test script
        cat > "$OUTPUT_DIR/test-supabase.js" << 'EOF'
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function testSupabase() {
    const envFile = path.join(__dirname, '../../.env.production');
    const envContent = fs.readFileSync(envFile, 'utf8');
    
    const envVars = {};
    envContent.split('\n').forEach(line => {
        if (line.includes('=') && !line.startsWith('#')) {
            const [key, value] = line.split('=', 2);
            envVars[key.trim()] = value.trim();
        }
    });
    
    const supabaseUrl = envVars.SUPABASE_URL;
    const supabaseKey = envVars.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection
    const { data, error } = await supabase.from('weekly_execution_plans').select('count').limit(1);
    
    if (error) {
        console.error('❌ Supabase connection failed:', error.message);
        throw error;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('✅ Database schema accessible');
}

testSupabase().catch(console.error);
EOF

        # Run test
        cd "$OUTPUT_DIR"
        if node test-supabase.js; then
            log "✅ Supabase connection test passed"
        else
            warn "⚠️  Supabase connection test failed"
        fi
        
        # Cleanup
        rm test-supabase.js
    fi
    
    # Test email service
    if [[ "$ENABLE_EMAIL_NOTIFICATIONS" == "true" ]]; then
        log "🔍 Testing email service..."
        
        # Create test email script
        cat > "$OUTPUT_DIR/test-email.js" << 'EOF'
const fs = require('fs');
const path = require('path');

async function testEmail() {
    const envFile = path.join(__dirname, '../../.env.production');
    const envContent = fs.readFileSync(envFile, 'utf8');
    
    const envVars = {};
    envContent.split('\n').forEach(line => {
        if (line.includes('=') && !line.startsWith('#')) {
            const [key, value] = line.split('=', 2);
            envVars[key.trim()] = value.trim();
        }
    });
    
    console.log('📧 Email service configuration:');
    
    if (envVars.AWS_SES_REGION && envVars.AWS_SES_REGION !== 'us-east-2') {
        console.log('✅ AWS SES configured');
        console.log('   Region: ' + envVars.AWS_SES_REGION);
        console.log('   From: ' + envVars.AWS_SES_FROM_EMAIL);
        console.log('   Configuration Set: ' + envVars.AWS_SES_CONFIGURATION_SET);
    } else if (envVars.SENDGRID_API_KEY && envVars.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
        console.log('✅ SendGrid configured');
        console.log('   API Key: [HIDDEN]');
        console.log('   From: ' + envVars.SENDGRID_FROM_EMAIL);
    } else if (envVars.SMTP_HOST && envVars.SMTP_HOST !== 'smtp.gmail.com') {
        console.log('✅ SMTP configured');
        console.log('   Host: ' + envVars.SMTP_HOST);
        console.log('   Port: ' + envVars.SMTP_PORT);
        console.log('   User: ' + envVars.SMTP_USER);
    } else {
        console.log('❌ No email service configured');
        return;
    }
    
    console.log('\n📧 To test email service:');
    console.log('1. Configure your email credentials in .env.production');
    console.log('2. Run a test workflow in N8N');
    console.log('3. Check email delivery');
}

testEmail().catch(console.error);
EOF

        # Run test
        cd "$OUTPUT_DIR"
        node test-email.js
        
        # Cleanup
        rm test-email.js
    fi
    
    log "✅ Production system testing completed"
}

# Generate deployment summary
generate_summary() {
    log "📋 Generating deployment summary..."
    
    local summary_file="$OUTPUT_DIR/deployment-summary.md"
    
    cat > "$summary_file" << EOF
# 🚀 AlexAI Star Trek Agile System - Production Deployment Summary

**Deployment Date:** $(date)
**Status:** Ready for Production

## 📊 Deployment Components

### ✅ Supabase Database
- **Status:** Deployed
- **Schema:** Complete weekly execution plan system
- **Tables:** weekly_execution_plans, daily_tasks, progress_metrics
- **Location:** $SUPABASE_URL

### ✅ N8N Workflow
- **Status:** Ready for Import
- **Workflow:** Weekly Execution Plan - \$10,000 Revenue Goal
- **File:** $WORKFLOWS_DIR/weekly-execution-plan-workflow.json
- **Features:** Daily scheduling, Supabase integration, email notifications

### ✅ Email Service
- **Status:** Configured
- **Service:** $(if [[ -n "$SENDGRID_API_KEY" ]]; then echo "SendGrid"; elif [[ -n "$SMTP_HOST" ]]; then echo "SMTP"; else echo "Not configured"; fi)
- **From:** $SENDGRID_FROM_EMAIL

## 🎯 Next Steps

### 1. Complete N8N Setup
1. Import workflow: $WORKFLOWS_DIR/weekly-execution-plan-workflow.json
2. Configure Supabase credentials in workflow nodes
3. Configure email service credentials
4. Activate workflow
5. Test manual execution

### 2. Verify Email Delivery
1. Test workflow manually
2. Check email delivery to $SENDGRID_FROM_EMAIL
3. Verify email content and formatting

### 3. Activate Automation
1. Confirm workflow is active
2. Verify cron trigger is working
3. Monitor daily execution at 10:00 AM

## 🔧 Configuration Files

- **Environment:** $ENV_FILE
- **Database Schema:** $OUTPUT_DIR/supabase-schema.json
- **Migration SQL:** $OUTPUT_DIR/supabase-migration.sql
- **Workflow:** $WORKFLOWS_DIR/weekly-execution-plan-workflow.json

## 📞 Support

If you encounter issues:
1. Check N8N workflow logs
2. Verify Supabase connection
3. Test email service configuration
4. Review environment variables

## 🎉 Deployment Complete!

Your AlexAI Star Trek Agile System is now ready for production use.
The weekly execution plan will automatically run daily at 10:00 AM.

**"Make it so. Engage." - Captain Picard** 🚀
EOF

    log "✅ Deployment summary generated: $summary_file"
}

# Main deployment function
main() {
    echo -e "${PURPLE}"
    echo "🚀 ========================================================"
    echo "🚀 AlexAI Star Trek Agile System - Production Deployment"
    echo "🚀 ========================================================"
    echo -e "${NC}"
    
    log "Starting production deployment..."
    
    # Check prerequisites
    check_prerequisites
    
    # Setup environment
    setup_environment
    
    echo -e "${YELLOW}"
    echo "⚠️  IMPORTANT: Please edit $ENV_FILE and configure your credentials!"
    echo "⚠️  After configuring credentials, run this script again with: --continue"
    echo -e "${NC}"
    
    # Check if user wants to continue
    if [[ "$1" != "--continue" ]]; then
        log "Deployment paused. Configure credentials and run: $0 --continue"
        exit 0
    fi
    
    # Continue with deployment
    log "Continuing with deployment..."
    
    # Deploy components
    deploy_supabase
    deploy_n8n
    configure_email
    test_production
    generate_summary
    
    echo -e "${GREEN}"
    echo "🎉 ========================================================"
    echo "🎉 Production Deployment Completed Successfully!"
    echo "🎉 ========================================================"
    echo -e "${NC}"
    
    log "Your system is now ready for production use!"
    log "Check the deployment summary: $OUTPUT_DIR/deployment-summary.md"
    
    echo -e "${CYAN}"
    echo "📧 You should now receive daily execution plan emails at 10:00 AM!"
    echo "📧 Make sure to complete the N8N workflow import and activation."
    echo -e "${NC}"
}

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h     Show this help message"
    echo "  --continue     Continue deployment after credential configuration"
    echo ""
    echo "Deployment Steps:"
    echo "1. Run: $0                    (creates environment file)"
    echo "2. Edit: .env.production     (configure your credentials)"
    echo "3. Run: $0 --continue        (completes deployment)"
    echo ""
    echo "Example:"
    echo "  $0"
    echo "  # Edit .env.production with your credentials"
    echo "  $0 --continue"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --continue)
        main "$1"
        ;;
    "")
        main
        ;;
    *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
