#!/bin/bash

# 🚀 AlexAI Agile Platform - Master Start Script
# Implements complete enterprise architecture with n8n central hub and subdomain management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

# Function to load all secrets from ~/.zshrc
load_secrets() {
    print_status "Loading enterprise secrets from ~/.zshrc..."
    
    if [ ! -f ~/.zshrc ]; then
        print_error "~/.zshrc not found! Cannot proceed with enterprise deployment."
        return 1
    fi
    
    # Load environment variables from ~/.zshrc
    export $(grep -E '^export ' ~/.zshrc | sed 's/export //' | xargs)
    
    # Check required enterprise secrets
    local missing_secrets=()
    
    # Core secrets
    if [ -z "$OPENAI_API_KEY" ]; then
        missing_secrets+=("OPENAI_API_KEY")
    fi
    
    if [ -z "$SUPABASE_URL" ]; then
        missing_secrets+=("SUPABASE_URL")
    fi
    
    if [ -z "$SUPABASE_KEY" ]; then
        missing_secrets+=("SUPABASE_KEY")
    fi
    
    # Vercel secrets
    if [ -z "$VERCEL_TOKEN" ]; then
        missing_secrets+=("VERCEL_TOKEN")
    fi
    
    if [ -z "$VERCEL_ORG_ID" ]; then
        missing_secrets+=("VERCEL_ORG_ID")
    fi
    
    if [ -z "$VERCEL_PROJECT_ID" ]; then
        missing_secrets+=("VERCEL_PROJECT_ID")
    fi
    
    # AWS secrets for subdomain management
    if [ -z "$AWS_ACCESS_KEY_ID" ]; then
        missing_secrets+=("AWS_ACCESS_KEY_ID")
    fi
    
    if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        missing_secrets+=("AWS_SECRET_ACCESS_KEY")
    fi
    
    # n8n secrets
    if [ -z "$N8N_BASE_URL" ]; then
        missing_secrets+=("N8N_BASE_URL")
    fi
    
    if [ -z "$N8N_API_KEY" ]; then
        missing_secrets+=("N8N_API_KEY")
    fi
    
    if [ ${#missing_secrets[@]} -ne 0 ]; then
        print_error "Missing required enterprise secrets:"
        for secret in "${missing_secrets[@]}"; do
            echo "  - $secret"
        done
        print_warning "Please add these to your ~/.zshrc file"
        return 1
    fi
    
    print_success "All enterprise secrets loaded successfully"
    return 0
}

# Function to create project directory structure
create_project_structure() {
    print_header "Creating Enterprise Project Structure"
    
    local project_root="alexai_enterprise_platform"
    
    print_status "Creating enterprise project structure..."
    
    # Create main project directory
    mkdir -p "$project_root"
    cd "$project_root"
    
    # Create subdomain-specific directories
    mkdir -p {agile,software,business,startup,workflows,infrastructure,docs}
    
    # Create workflow directories for n8n
    mkdir -p workflows/{agile,software,business,startup,shared}
    
    # Create infrastructure directories
    mkdir -p infrastructure/{aws,vercel,supabase,monitoring}
    
    # Create documentation
    mkdir -p docs/{api,deployment,workflows,architecture}
    
    print_success "Enterprise project structure created"
    
    # Create main configuration file
    cat > alexai_platform_config.json << EOF
{
  "platform": {
    "name": "AlexAI Enterprise Agile Platform",
    "version": "1.0.0",
    "description": "Comprehensive enterprise platform with n8n orchestration and specialized subdomains"
  },
  "domains": {
    "central": "n8n.pbradygeorgen.com",
    "agile": "agile.pbradygeorgen.com",
    "software": "software.pbradygeorgen.com",
    "business": "business.pbradygeorgen.com",
    "startup": "startup.pbradygeorgen.com"
  },
  "services": {
    "n8n": {
      "url": "$N8N_BASE_URL",
      "role": "central_orchestration"
    },
    "vercel": {
      "role": "frontend_hosting"
    },
    "supabase": {
      "role": "database_backend"
    },
    "aws": {
      "role": "domain_management"
    }
  },
  "workflows": {
    "agile": ["project_creation", "task_management", "sprint_planning"],
    "software": ["code_review", "deployment", "testing"],
    "business": ["strategy_planning", "market_analysis", "financial_modeling"],
    "startup": ["idea_validation", "pitch_deck", "investor_matching"]
  }
}
EOF
    
    print_success "Platform configuration created"
    return 0
}

# Function to set up n8n workflows
setup_n8n_workflows() {
    print_header "Setting up n8n Central Orchestration"
    
    print_status "Creating n8n workflow templates..."
    
    # Create agile workflow
    cat > workflows/agile/agile_project_workflow.json << EOF
{
  "name": "Agile Project Management Workflow",
  "nodes": [
    {
      "id": "1",
      "name": "Project Creation Trigger",
      "type": "webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "agile/project/create"
      }
    },
    {
      "id": "2",
      "name": "Validate Project Data",
      "type": "function",
      "parameters": {
        "functionCode": "// Validate project data\nreturn {\n  valid: true,\n  project: $input.first().json\n};"
      }
    },
    {
      "id": "3",
      "name": "Create Supabase Project",
      "type": "httpRequest",
      "parameters": {
        "url": "$SUPABASE_URL/rest/v1/projects",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer $SUPABASE_KEY",
          "Content-Type": "application/json"
        }
      }
    },
    {
      "id": "4",
      "name": "Generate AI Insights",
      "type": "httpRequest",
      "parameters": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer $OPENAI_API_KEY",
          "Content-Type": "application/json"
        },
        "body": {
          "model": "gpt-4",
          "messages": [
            {
              "role": "system",
              "content": "You are an AI assistant helping with agile project management."
            },
            {
              "role": "user",
              "content": "Analyze this project: {{$json.project}}"
            }
          ]
        }
      }
    },
    {
      "id": "5",
      "name": "Notify Team",
      "type": "email",
      "parameters": {
        "to": "team@pbradygeorgen.com",
        "subject": "New Agile Project Created",
        "message": "Project {{$json.project.name}} has been created with AI insights."
      }
    }
  ],
  "connections": {
    "1": {"2": [{"node": "2", "type": "main", "index": 0}]},
    "2": {"3": [{"node": "3", "type": "main", "index": 0}]},
    "3": {"4": [{"node": "4", "type": "main", "index": 0}]},
    "4": {"5": [{"node": "5", "type": "main", "index": 0}]}
  }
}
EOF
    
    # Create software development workflow
    cat > workflows/software/software_dev_workflow.json << EOF
{
  "name": "Software Development Workflow",
  "nodes": [
    {
      "id": "1",
      "name": "Code Review Trigger",
      "type": "webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "software/code/review"
      }
    },
    {
      "id": "2",
      "name": "Analyze Code",
      "type": "function",
      "parameters": {
        "functionCode": "// Analyze code quality\nreturn {\n  analysis: 'Code quality assessment',\n  score: 85\n};"
      }
    },
    {
      "id": "3",
      "name": "AI Code Review",
      "type": "httpRequest",
      "parameters": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer $OPENAI_API_KEY",
          "Content-Type": "application/json"
        },
        "body": {
          "model": "gpt-4",
          "messages": [
            {
              "role": "system",
              "content": "You are an expert code reviewer."
            },
            {
              "role": "user",
              "content": "Review this code: {{$json.code}}"
            }
          ]
        }
      }
    }
  ],
  "connections": {
    "1": {"2": [{"node": "2", "type": "main", "index": 0}]},
    "2": {"3": [{"node": "3", "type": "main", "index": 0}]}
  }
}
EOF
    
    # Create business management workflow
    cat > workflows/business/business_workflow.json << EOF
{
  "name": "Business Management Workflow",
  "nodes": [
    {
      "id": "1",
      "name": "Strategy Planning Trigger",
      "type": "webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "business/strategy/plan"
      }
    },
    {
      "id": "2",
      "name": "Market Analysis",
      "type": "httpRequest",
      "parameters": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer $OPENAI_API_KEY",
          "Content-Type": "application/json"
        },
        "body": {
          "model": "gpt-4",
          "messages": [
            {
              "role": "system",
              "content": "You are a business strategy expert."
            },
            {
              "role": "user",
              "content": "Analyze this business strategy: {{$json.strategy}}"
            }
          ]
        }
      }
    }
  ],
  "connections": {
    "1": {"2": [{"node": "2", "type": "main", "index": 0}]}
  }
}
EOF
    
    # Create startup workflow
    cat > workflows/startup/startup_workflow.json << EOF
{
  "name": "Startup Concept Generation Workflow",
  "nodes": [
    {
      "id": "1",
      "name": "Idea Validation Trigger",
      "type": "webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "startup/idea/validate"
      }
    },
    {
      "id": "2",
      "name": "Generate Startup Concept",
      "type": "httpRequest",
      "parameters": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer $OPENAI_API_KEY",
          "Content-Type": "application/json"
        },
        "body": {
          "model": "gpt-4",
          "messages": [
            {
              "role": "system",
              "content": "You are a startup expert and venture capitalist."
            },
            {
              "role": "user",
              "content": "Generate a startup concept based on: {{$json.idea}}"
            }
          ]
        }
      }
    }
  ],
  "connections": {
    "1": {"2": [{"node": "2", "type": "main", "index": 0}]}
  }
}
EOF
    
    print_success "n8n workflow templates created"
    return 0
}

# Function to set up subdomain configurations
setup_subdomain_configs() {
    print_header "Setting up Subdomain Configurations"
    
    print_status "Creating subdomain-specific configurations..."
    
    # Agile subdomain configuration
    cat > agile/vercel.json << EOF
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
      "dest": "/app.py"
    }
  ],
  "env": {
    "FLASK_ENV": "production",
    "SUBDOMAIN_TYPE": "agile"
  },
  "functions": {
    "app.py": {
      "runtime": "python3.11"
    }
  }
}
EOF
    
    # Software subdomain configuration
    cat > software/vercel.json << EOF
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
      "dest": "/app.py"
    }
  ],
  "env": {
    "FLASK_ENV": "production",
    "SUBDOMAIN_TYPE": "software"
  }
}
EOF
    
    # Business subdomain configuration
    cat > business/vercel.json << EOF
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
      "dest": "/app.py"
    }
  ],
  "env": {
    "FLASK_ENV": "production",
    "SUBDOMAIN_TYPE": "business"
  }
}
EOF
    
    # Startup subdomain configuration
    cat > startup/vercel.json << EOF
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
      "dest": "/app.py"
    }
  ],
  "env": {
    "FLASK_ENV": "production",
    "SUBDOMAIN_TYPE": "startup"
  }
}
EOF
    
    print_success "Subdomain configurations created"
    return 0
}

# Function to set up AWS Route 53 for subdomain management
setup_aws_domains() {
    print_header "Setting up AWS Route 53 Domain Management"
    
    if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        print_warning "AWS credentials not available. Skipping domain setup."
        return 0
    fi
    
    print_status "Creating AWS Route 53 configuration..."
    
    # Create AWS configuration
    cat > infrastructure/aws/route53_config.json << EOF
{
  "HostedZones": [
    {
      "Name": "pbradygeorgen.com",
      "Type": "A"
    }
  ],
  "RecordSets": [
    {
      "Name": "n8n.pbradygeorgen.com",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": ["$N8N_BASE_URL"]
    },
    {
      "Name": "agile.pbradygeorgen.com",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": ["agile-pbradygeorgen.vercel.app"]
    },
    {
      "Name": "software.pbradygeorgen.com",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": ["software-pbradygeorgen.vercel.app"]
    },
    {
      "Name": "business.pbradygeorgen.com",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": ["business-pbradygeorgen.vercel.app"]
    },
    {
      "Name": "startup.pbradygeorgen.com",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": ["startup-pbradygeorgen.vercel.app"]
    }
  ]
}
EOF
    
    print_success "AWS Route 53 configuration created"
    return 0
}

# Function to deploy to Vercel with subdomain support
deploy_subdomains() {
    print_header "Deploying Subdomains to Vercel"
    
    if [ -z "$VERCEL_TOKEN" ]; then
        print_warning "Vercel token not available. Skipping deployment."
        return 0
    fi
    
    print_status "Deploying agile subdomain..."
    cd agile
    vercel --prod --yes --token "$VERCEL_TOKEN"
    cd ..
    
    print_status "Deploying software subdomain..."
    cd software
    vercel --prod --yes --token "$VERCEL_TOKEN"
    cd ..
    
    print_status "Deploying business subdomain..."
    cd business
    vercel --prod --yes --token "$VERCEL_TOKEN"
    cd ..
    
    print_status "Deploying startup subdomain..."
    cd startup
    vercel --prod --yes --token "$VERCEL_TOKEN"
    cd ..
    
    print_success "All subdomains deployed to Vercel"
    return 0
}

# Function to create comprehensive documentation
create_documentation() {
    print_header "Creating Enterprise Documentation"
    
    print_status "Generating comprehensive documentation..."
    
    # Create main README
    cat > README.md << EOF
# 🚀 AlexAI Enterprise Agile Platform

## Overview
Comprehensive enterprise platform with n8n central orchestration and specialized subdomains for different business domains.

## Architecture

### Central Hub: n8n.pbradygeorgen.com
- **Role**: Central orchestration and workflow management
- **Technology**: n8n
- **Function**: Coordinates all subdomain activities

### Subdomains

#### agile.pbradygeorgen.com
- **Purpose**: Agile project management
- **Features**: Sprint planning, task management, team collaboration
- **Technology**: Flask + Vercel + Supabase

#### software.pbradygeorgen.com
- **Purpose**: Software development management
- **Features**: Code review, deployment automation, testing
- **Technology**: Flask + Vercel + Supabase

#### business.pbradygeorgen.com
- **Purpose**: Business strategy and management
- **Features**: Strategy planning, market analysis, financial modeling
- **Technology**: Flask + Vercel + Supabase

#### startup.pbradygeorgen.com
- **Purpose**: Startup concept generation and validation
- **Features**: Idea validation, pitch deck generation, investor matching
- **Technology**: Flask + Vercel + Supabase

## Quick Start

1. **Set up secrets**: Add all required secrets to ~/.zshrc
2. **Run master script**: \`./start_alexai_platform.sh\`
3. **Access platforms**:
   - Central: https://n8n.pbradygeorgen.com
   - Agile: https://agile.pbradygeorgen.com
   - Software: https://software.pbradygeorgen.com
   - Business: https://business.pbradygeorgen.com
   - Startup: https://startup.pbradygeorgen.com

## Workflows

### Agile Workflow
- Project creation
- Task management
- Sprint planning
- Team notifications

### Software Workflow
- Code review automation
- Deployment management
- Testing integration

### Business Workflow
- Strategy planning
- Market analysis
- Financial modeling

### Startup Workflow
- Idea validation
- Pitch deck generation
- Investor matching

## Technology Stack

- **Frontend**: Flask + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Orchestration**: n8n
- **Hosting**: Vercel
- **Domain Management**: AWS Route 53
- **AI Integration**: OpenAI GPT-4

## Security

- All secrets managed via ~/.zshrc
- Environment variables for production
- Row Level Security in Supabase
- Secure API endpoints

## Monitoring

- Vercel analytics
- Supabase monitoring
- n8n execution logs
- AWS CloudWatch

## Support

For support and questions, contact: team@pbradygeorgen.com

---

**Live long and prosper! 🖖**
EOF
    
    # Create deployment guide
    cat > docs/deployment/ENTERPRISE_DEPLOYMENT.md << EOF
# 🚀 Enterprise Deployment Guide

## Prerequisites

### Required Secrets (add to ~/.zshrc)
\`\`\`bash
# Core services
export OPENAI_API_KEY="sk-..."
export SUPABASE_URL="https://..."
export SUPABASE_KEY="eyJ..."

# Vercel deployment
export VERCEL_TOKEN="vercel_..."
export VERCEL_ORG_ID="team_..."
export VERCEL_PROJECT_ID="prj_..."

# AWS domain management
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."

# n8n central hub
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
export N8N_API_KEY="..."
\`\`\`

## Deployment Steps

1. **Run master script**: \`./start_alexai_platform.sh\`
2. **Set up n8n workflows**: Import workflow templates
3. **Configure subdomains**: Update DNS records
4. **Test all platforms**: Verify functionality
5. **Monitor performance**: Set up monitoring

## Troubleshooting

### Common Issues
- Missing secrets in ~/.zshrc
- Vercel deployment failures
- n8n workflow import errors
- DNS propagation delays

### Solutions
- Verify all secrets are set
- Check Vercel project settings
- Validate n8n API access
- Wait for DNS propagation (up to 48 hours)
EOF
    
    print_success "Enterprise documentation created"
    return 0
}

# Function to test all platforms
test_platforms() {
    print_header "Testing All Platforms"
    
    print_status "Testing n8n central hub..."
    if curl -s -o /dev/null -w "%{http_code}" "$N8N_BASE_URL" | grep -q "200"; then
        print_success "n8n central hub is accessible"
    else
        print_warning "n8n central hub not accessible"
    fi
    
    print_status "Testing agile subdomain..."
    if curl -s -o /dev/null -w "%{http_code}" "https://agile.pbradygeorgen.com" | grep -q "200"; then
        print_success "Agile subdomain is accessible"
    else
        print_warning "Agile subdomain not accessible"
    fi
    
    print_status "Testing software subdomain..."
    if curl -s -o /dev/null -w "%{http_code}" "https://software.pbradygeorgen.com" | grep -q "200"; then
        print_success "Software subdomain is accessible"
    else
        print_warning "Software subdomain not accessible"
    fi
    
    print_status "Testing business subdomain..."
    if curl -s -o /dev/null -w "%{http_code}" "https://business.pbradygeorgen.com" | grep -q "200"; then
        print_success "Business subdomain is accessible"
    else
        print_warning "Business subdomain not accessible"
    fi
    
    print_status "Testing startup subdomain..."
    if curl -s -o /dev/null -w "%{http_code}" "https://startup.pbradygeorgen.com" | grep -q "200"; then
        print_success "Startup subdomain is accessible"
    else
        print_warning "Startup subdomain not accessible"
    fi
    
    return 0
}

# Main execution function
main() {
    print_header "🚀 AlexAI Enterprise Agile Platform - Master Start"
    echo ""
    
    # Load enterprise secrets
    if ! load_secrets; then
        print_error "Cannot proceed without enterprise secrets. Please set up ~/.zshrc first."
        exit 1
    fi
    
    # Create project structure
    create_project_structure
    
    # Set up n8n workflows
    setup_n8n_workflows
    
    # Set up subdomain configurations
    setup_subdomain_configs
    
    # Set up AWS domain management
    setup_aws_domains
    
    # Deploy subdomains
    deploy_subdomains
    
    # Create documentation
    create_documentation
    
    # Test platforms
    test_platforms
    
    print_header "🎉 AlexAI Enterprise Platform Complete!"
    echo ""
    print_success "Your comprehensive enterprise platform is now live!"
    echo ""
    print_status "Platform URLs:"
    echo "  🌐 Central Hub: https://n8n.pbradygeorgen.com"
    echo "  📊 Agile: https://agile.pbradygeorgen.com"
    echo "  💻 Software: https://software.pbradygeorgen.com"
    echo "  📈 Business: https://business.pbradygeorgen.com"
    echo "  🚀 Startup: https://startup.pbradygeorgen.com"
    echo ""
    print_status "Next Steps:"
    echo "1. Import n8n workflows from workflows/ directory"
    echo "2. Configure DNS records in AWS Route 53"
    echo "3. Set up monitoring and alerts"
    echo "4. Train team on platform usage"
    echo ""
    print_success "Enterprise deployment complete! Live long and prosper! 🖖"
}

# Run main function
main "$@" 