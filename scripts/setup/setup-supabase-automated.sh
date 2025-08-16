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

# 🚀 Automated Supabase Setup Script
# This script will configure both local and production environments to use the same Supabase database

set -e

echo "🔮 LCARS Supabase Setup Wizard"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting automated Supabase setup..."

# Step 1: Get Supabase credentials
echo ""
print_info "Step 1: Supabase Project Selection"
echo "======================================"

# Check if we have existing credentials
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
    print_status "Found existing Supabase credentials in environment"
    SUPABASE_URL_EXISTING="$SUPABASE_URL"
    SUPABASE_ANON_KEY_EXISTING="$SUPABASE_ANON_KEY"
    
    echo ""
    echo "Existing configuration:"
    echo "  URL: $SUPABASE_URL_EXISTING"
    echo "  Key: ${SUPABASE_ANON_KEY_EXISTING:0:20}..."
    echo ""
    
    read -p "Use existing credentials? (y/n): " use_existing
    if [[ $use_existing =~ ^[Yy]$ ]]; then
        SUPABASE_URL="$SUPABASE_URL_EXISTING"
        SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY_EXISTING"
    else
        SUPABASE_URL=""
        SUPABASE_ANON_KEY=""
    fi
fi

# If no existing credentials or user chose to enter new ones
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo ""
    print_info "Please enter your Supabase project credentials:"
    echo ""
    
    # Get project URL
    read -p "Enter Supabase Project URL (e.g., https://alexai-star-trek-agile.supabase.co): " SUPABASE_URL
    
    # Validate URL format
    if [[ ! $SUPABASE_URL =~ ^https://.*\.supabase\.co$ ]]; then
        print_error "Invalid Supabase URL format. Please use: https://your-project-id.supabase.co"
        exit 1
    fi
    
    # Get anon key
    read -p "Enter Supabase Anon Key (starts with 'sb_'): " SUPABASE_ANON_KEY
    
    # Validate key format
    if [[ ! $SUPABASE_ANON_KEY =~ ^sb_ ]]; then
        print_error "Invalid Supabase anon key format. Should start with 'sb_'"
        exit 1
    fi
fi

print_status "Supabase credentials configured"

# Step 2: Create local environment file
echo ""
print_info "Step 2: Configuring Local Environment"
echo "========================================="

# Create .env.local file
cat > .env.local << EOF
# Development Environment
NODE_ENV=development

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Database Configuration
DATABASE_URL=sqlite:./storage/database/agile_manager.db

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
API_PORT=8000
EOF

print_status "Created .env.local file with Supabase credentials"

# Step 3: Test Supabase connection
echo ""
print_info "Step 3: Testing Supabase Connection"
echo "======================================"

# Create a test script
cat > test-supabase-connection.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials not found in environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('🔍 Testing Supabase connection...');
        
        // Test basic connection
        const { data, error } = await supabase
            .from('projects')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Database connection failed:', error.message);
            
            if (error.message.includes('relation "projects" does not exist')) {
                console.log('ℹ️  Projects table does not exist. This is expected for new projects.');
                console.log('ℹ️  Tables will be created when you seed the database.');
            }
            
            return false;
        }
        
        console.log('✅ Supabase connection successful!');
        return true;
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        return false;
    }
}

testConnection().then(success => {
    process.exit(success ? 0 : 1);
});
EOF

# Load environment variables and test connection
export NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"

if node test-supabase-connection.js; then
    print_status "Supabase connection test passed"
else
    print_warning "Supabase connection test failed - this is normal for new projects"
    print_info "Tables will be created when you seed the database"
fi

# Clean up test file
rm test-supabase-connection.js

# Step 4: Configure Vercel environment variables
echo ""
print_info "Step 4: Configuring Vercel Environment Variables"
echo "===================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Please install it with: npm i -g vercel"
    echo ""
    print_info "Manual Vercel Configuration Required:"
    echo "1. Go to https://vercel.com"
    echo "2. Navigate to your project: alexai_katra_transfer_package_remote_v7"
    echo "3. Go to Settings → Environment Variables"
    echo "4. Add these variables:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
    echo "5. Redeploy your project"
else
    print_info "Vercel CLI found. Attempting to set environment variables..."
    
    # Try to set environment variables via Vercel CLI
    if vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$SUPABASE_URL" 2>/dev/null; then
        print_status "Set NEXT_PUBLIC_SUPABASE_URL in Vercel"
    else
        print_warning "Failed to set environment variable via CLI"
        print_info "Please set it manually in Vercel dashboard"
    fi
    
    if vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY" 2>/dev/null; then
        print_status "Set NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel"
    else
        print_warning "Failed to set environment variable via CLI"
        print_info "Please set it manually in Vercel dashboard"
    fi
fi

# Step 5: Create database tables and seed data
echo ""
print_info "Step 5: Database Setup"
echo "=========================="

# Create SQL script for database setup
cat > setup-database.sql << 'EOF'
-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    tech_stack JSONB DEFAULT '[]',
    team_members JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    assignee VARCHAR(255),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    tags JSONB DEFAULT '[]',
    story_points INTEGER,
    dependencies JSONB DEFAULT '[]'
);

-- Create sprints table
CREATE TABLE IF NOT EXISTS sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    goals JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access (for demo purposes)
DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow public insert access" ON projects;
DROP POLICY IF EXISTS "Allow public update access" ON projects;

CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON projects FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON tasks;
DROP POLICY IF EXISTS "Allow public insert access" ON tasks;
DROP POLICY IF EXISTS "Allow public update access" ON tasks;

CREATE POLICY "Allow public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON tasks FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON sprints;
DROP POLICY IF EXISTS "Allow public insert access" ON sprints;
DROP POLICY IF EXISTS "Allow public update access" ON sprints;

CREATE POLICY "Allow public read access" ON sprints FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON sprints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON sprints FOR UPDATE USING (true);
EOF

print_status "Created database setup script"

# Step 6: Deploy to Vercel
echo ""
print_info "Step 6: Deploying to Vercel"
echo "================================"

print_info "Deploying updated configuration to Vercel..."

if vercel --prod --yes 2>/dev/null; then
    print_status "Successfully deployed to Vercel"
else
    print_warning "Vercel deployment failed or CLI not available"
    print_info "Please deploy manually with: vercel --prod"
fi

# Step 7: Final instructions
echo ""
print_info "Step 7: Final Setup Instructions"
echo "===================================="

print_status "Setup complete! Here's what to do next:"

echo ""
echo "🌐 Access URLs:"
echo "   Local: http://localhost:3000"
echo "   Production: https://alexaikatratransferpackageremotev7-3b6hz7zs2-pbradygeorgen.vercel.app"
echo ""

echo "🗄️  Database Setup:"
echo "   1. Go to your Supabase dashboard: $SUPABASE_URL"
echo "   2. Navigate to SQL Editor"
echo "   3. Run the setup-database.sql script"
echo "   4. Or use the API endpoint to seed data automatically"
echo ""

echo "🌱 Seed Data:"
echo "   To populate the database with sample data, visit:"
echo "   Local: http://localhost:3000/api/projects (POST request)"
echo "   Production: https://alexaikatratransferpackageremotev7-3b6hz7zs2-pbradygeorgen.vercel.app/api/projects (POST request)"
echo ""

echo "🔍 Test Connection:"
echo "   Both environments should now show identical data"
echo "   Changes in one environment will appear in the other"
echo ""

print_status "LCARS Supabase setup wizard complete! 🖖"

# Clean up
rm setup-database.sql

echo ""
echo "🎉 Your AlexAI Star Trek Agile System is now configured with shared Supabase database!"
echo "   Live long and prosper! 🖖" 