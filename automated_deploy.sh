#!/bin/bash

# 🚀 Automated Vercel + Supabase Deployment Script
# Reads secrets from ~/.zshrc and automates complete CI/CD deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to source ~/.zshrc and extract environment variables
load_secrets_from_zshrc() {
    print_status "Loading secrets from ~/.zshrc..."
    
    if [ ! -f ~/.zshrc ]; then
        print_error "~/.zshrc not found! Cannot automate deployment."
        print_warning "Please set up your secrets manually in ~/.zshrc:"
        echo "export OPENAI_API_KEY='your-openai-key'"
        echo "export SUPABASE_URL='your-supabase-url'"
        echo "export SUPABASE_KEY='your-supabase-key'"
        echo "export VERCEL_TOKEN='your-vercel-token'"
        return 1
    fi
    
    # Source ~/.zshrc to load environment variables
    source ~/.zshrc
    
    # Check if required secrets are available
    local missing_secrets=()
    
    if [ -z "$OPENAI_API_KEY" ]; then
        missing_secrets+=("OPENAI_API_KEY")
    fi
    
    if [ -z "$SUPABASE_URL" ]; then
        missing_secrets+=("SUPABASE_URL")
    fi
    
    if [ -z "$SUPABASE_KEY" ]; then
        missing_secrets+=("SUPABASE_KEY")
    fi
    
    if [ -z "$VERCEL_TOKEN" ]; then
        missing_secrets+=("VERCEL_TOKEN")
    fi
    
    if [ ${#missing_secrets[@]} -ne 0 ]; then
        print_error "Missing required secrets in ~/.zshrc:"
        for secret in "${missing_secrets[@]}"; do
            echo "  - $secret"
        done
        print_warning "Please add these to your ~/.zshrc file and restart the script."
        return 1
    fi
    
    print_success "All required secrets loaded from ~/.zshrc"
    return 0
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if required tools are installed
    local missing_tools=()
    
    if ! command -v curl &> /dev/null; then
        missing_tools+=("curl")
    fi
    
    if ! command -v jq &> /dev/null; then
        missing_tools+=("jq")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools:"
        for tool in "${missing_tools[@]}"; do
            echo "  - $tool"
        done
        print_warning "Please install missing tools and restart the script."
        return 1
    fi
    
    print_success "All prerequisites met"
    return 0
}

# Function to create Supabase project
create_supabase_project() {
    print_header "Setting up Supabase Project"
    
    print_status "Creating Supabase project..."
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        print_warning "Supabase CLI not found. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install supabase/tap/supabase
        else
            # Linux
            curl -fsSL https://supabase.com/install.sh | sh
        fi
    fi
    
    # Login to Supabase
    print_status "Logging into Supabase..."
    if ! supabase login; then
        print_error "Failed to login to Supabase. Please login manually:"
        echo "supabase login"
        return 1
    fi
    
    # Create project
    local project_name="alexai-star-trek-agile"
    print_status "Creating Supabase project: $project_name"
    
    # Use Supabase API to create project
    local response=$(curl -s -X POST \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"$project_name\",\"organization_id\":\"your-org-id\"}" \
        "https://api.supabase.com/v1/projects")
    
    if [ $? -eq 0 ]; then
        print_success "Supabase project created successfully"
        # Extract project URL from response
        SUPABASE_PROJECT_URL=$(echo "$response" | jq -r '.project_url // empty')
        if [ -n "$SUPABASE_PROJECT_URL" ]; then
            print_success "Project URL: $SUPABASE_PROJECT_URL"
        fi
    else
        print_warning "Could not create Supabase project via API. Please create manually:"
        echo "1. Go to https://supabase.com"
        echo "2. Create new project: $project_name"
        echo "3. Copy Project URL and anon key"
    fi
    
    return 0
}

# Function to set up database tables
setup_database_tables() {
    print_header "Setting up Database Tables"
    
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
        print_error "Supabase credentials not available. Cannot set up database tables."
        return 1
    fi
    
    print_status "Creating database tables..."
    
    # SQL for creating tables
    local sql_script="
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

    -- Enable Row Level Security
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
    ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;

    -- Create policies for public read/write access
    DROP POLICY IF EXISTS \"Allow public read access\" ON projects;
    CREATE POLICY \"Allow public read access\" ON projects FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS \"Allow public insert access\" ON projects;
    CREATE POLICY \"Allow public insert access\" ON projects FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS \"Allow public update access\" ON projects;
    CREATE POLICY \"Allow public update access\" ON projects FOR UPDATE USING (true);

    DROP POLICY IF EXISTS \"Allow public read access\" ON tasks;
    CREATE POLICY \"Allow public read access\" ON tasks FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS \"Allow public insert access\" ON tasks;
    CREATE POLICY \"Allow public insert access\" ON tasks FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS \"Allow public update access\" ON tasks;
    CREATE POLICY \"Allow public update access\" ON tasks FOR UPDATE USING (true);

    DROP POLICY IF EXISTS \"Allow public read access\" ON sprints;
    CREATE POLICY \"Allow public read access\" ON sprints FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS \"Allow public insert access\" ON sprints;
    CREATE POLICY \"Allow public insert access\" ON sprints FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS \"Allow public update access\" ON sprints;
    CREATE POLICY \"Allow public update access\" ON sprints FOR UPDATE USING (true);
    "
    
    # Execute SQL via Supabase API
    local response=$(curl -s -X POST \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"query\":\"$sql_script\"}" \
        "$SUPABASE_URL/rest/v1/rpc/exec_sql")
    
    if [ $? -eq 0 ]; then
        print_success "Database tables created successfully"
    else
        print_warning "Could not create tables via API. Please run SQL manually in Supabase dashboard:"
        echo "$sql_script"
    fi
    
    return 0
}

# Function to deploy to Vercel
deploy_to_vercel() {
    print_header "Deploying to Vercel"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Check if already logged in
    if ! vercel whoami &> /dev/null; then
        print_status "Logging into Vercel..."
        if [ -n "$VERCEL_TOKEN" ]; then
            echo "$VERCEL_TOKEN" | vercel login --token
        else
            print_error "VERCEL_TOKEN not available. Please login manually:"
            echo "vercel login"
            return 1
        fi
    fi
    
    # Create vercel.json if it doesn't exist
    if [ ! -f "vercel.json" ]; then
        print_status "Creating vercel.json configuration..."
        cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.py"
    }
  ],
  "env": {
    "FLASK_ENV": "production"
  }
}
EOF
    fi
    
    # Set environment variables
    print_status "Setting Vercel environment variables..."
    vercel env add OPENAI_API_KEY production <<< "$OPENAI_API_KEY"
    vercel env add SUPABASE_URL production <<< "$SUPABASE_URL"
    vercel env add SUPABASE_KEY production <<< "$SUPABASE_KEY"
    vercel env add FLASK_ENV production <<< "production"
    
    # Deploy
    print_status "Deploying to Vercel..."
    local deployment_url=$(vercel --prod --yes)
    
    if [ $? -eq 0 ]; then
        print_success "Deployment successful!"
        print_success "Your app is live at: $deployment_url"
        echo "$deployment_url" > .vercel_url
    else
        print_error "Deployment failed. Please check the error messages above."
        return 1
    fi
    
    return 0
}

# Function to test deployment
test_deployment() {
    print_header "Testing Deployment"
    
    local vercel_url=$(cat .vercel_url 2>/dev/null || echo "")
    
    if [ -z "$vercel_url" ]; then
        print_warning "No deployment URL found. Skipping tests."
        return 0
    fi
    
    print_status "Testing deployment at: $vercel_url"
    
    # Test if the app is responding
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$vercel_url")
    
    if [ "$response" = "200" ]; then
        print_success "Deployment test passed! App is responding correctly."
    else
        print_warning "Deployment test failed. HTTP status: $response"
        print_warning "Please check the deployment logs in Vercel dashboard."
    fi
    
    return 0
}

# Function to create local environment file
create_local_env() {
    print_header "Setting up Local Environment"
    
    if [ ! -f ".env" ]; then
        print_status "Creating .env file for local development..."
        cat > .env << EOF
OPENAI_API_KEY=$OPENAI_API_KEY
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY
FLASK_ENV=development
FLASK_SECRET_KEY=$(openssl rand -hex 32)
EOF
        print_success ".env file created for local development"
    else
        print_status ".env file already exists"
    fi
    
    return 0
}

# Function to populate mock data
populate_mock_data() {
    print_header "Populating Mock Data"
    
    print_status "Running database mock script..."
    
    if [ -f "database_mock.py" ]; then
        python database_mock.py
        if [ $? -eq 0 ]; then
            print_success "Mock data populated successfully"
        else
            print_warning "Failed to populate mock data. You can do this manually via the web interface."
        fi
    else
        print_warning "database_mock.py not found. Skipping mock data population."
    fi
    
    return 0
}

# Main execution function
main() {
    print_header "🚀 Automated Vercel + Supabase Deployment"
    echo ""
    
    # Check prerequisites
    if ! check_prerequisites; then
        exit 1
    fi
    
    # Load secrets from ~/.zshrc
    if ! load_secrets_from_zshrc; then
        print_error "Cannot proceed without secrets. Please set up ~/.zshrc first."
        exit 1
    fi
    
    # Create local environment
    create_local_env
    
    # Create Supabase project
    if ! create_supabase_project; then
        print_warning "Supabase project creation failed. Please create manually."
    fi
    
    # Set up database tables
    if ! setup_database_tables; then
        print_warning "Database setup failed. Please set up manually."
    fi
    
    # Deploy to Vercel
    if ! deploy_to_vercel; then
        print_error "Vercel deployment failed. Please deploy manually."
        exit 1
    fi
    
    # Test deployment
    test_deployment
    
    # Populate mock data
    populate_mock_data
    
    print_header "🎉 Deployment Complete!"
    echo ""
    print_success "Your Star Trek TNG Agile Project Manager is now live!"
    echo ""
    print_status "Local Development: http://localhost:8000"
    print_status "Production URL: $(cat .vercel_url 2>/dev/null || echo 'Check Vercel dashboard')"
    print_status "Supabase Dashboard: https://supabase.com/dashboard"
    echo ""
    print_status "To start local development:"
    echo "  ./start_local.sh"
    echo ""
    print_status "To view deployment logs:"
    echo "  vercel logs"
    echo ""
    print_success "Live long and prosper! 🖖"
}

# Run main function
main "$@" 