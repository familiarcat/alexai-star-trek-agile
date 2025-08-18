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

# 🧹 AlexAI Star Trek Agile System - Project Consolidation Script
# Consolidates the project structure by removing deprecated folders and files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

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

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

success() {
    echo -e "${PURPLE}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

echo -e "${PURPLE}"
echo "🧹 ALEXAI STAR TREK AGILE SYSTEM - PROJECT CONSOLIDATION"
echo "========================================================="
echo -e "${NC}"

# Function to check if we're in the right directory
check_environment() {
    log "Checking project environment..."
    
    if [ ! -f "package.json" ]; then
        error "package.json not found. Please run this script from the project root directory."
    fi
    
    if [ ! -d "alexai-nextjs-modern" ]; then
        error "alexai-nextjs-modern directory not found. Modern Next.js version is required for consolidation."
    fi
    
    success "Project environment verified"
}

# Function to create backup
create_backup() {
    log "Creating project backup..."
    
    BACKUP_DIR="../alexai_backup_$(date +%Y%m%d_%H%M%S)"
    
    if [ -d "$BACKUP_DIR" ]; then
        warn "Backup directory already exists, removing..."
        rm -rf "$BACKUP_DIR"
    fi
    
    cp -r . "$BACKUP_DIR"
    success "Backup created: $BACKUP_DIR"
}

# Function to remove deprecated directories
remove_deprecated_dirs() {
    log "Removing deprecated directories..."
    
    # List of deprecated directories to remove
    DEPRECATED_DIRS=(
        "alexai-nextjs"
        "js-version"
        "app"
        "components"
        "lib"
        ".venv"
        "__pycache__"
    )
    
    for dir in "${DEPRECATED_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            log "Removing deprecated directory: $dir"
            rm -rf "$dir"
            success "Removed: $dir"
        else
            info "Directory not found (already removed): $dir"
        fi
    done
}

# Function to archive old documentation
archive_documentation() {
    log "Archiving old documentation..."
    
    # Create archive directory
    mkdir -p docs/archive
    
    # Archive old documentation files
    DOC_PATTERNS=(
        "*MIGRATION*.md"
        "*STATUS*.md"
        "*ANALYSIS*.md"
        "*REPORT*.md"
        "*BRIEFING*.md"
        "*FINAL*.md"
        "*COMPLETE*.md"
    )
    
    for pattern in "${DOC_PATTERNS[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                log "Archiving: $file"
                mv "$file" docs/archive/
                success "Archived: $file"
            fi
        done
    done
}

# Function to consolidate modern Next.js
consolidate_nextjs() {
    log "Consolidating modern Next.js structure..."
    
    # Create src directory if it doesn't exist
    if [ ! -d "src" ]; then
        mkdir -p src
        success "Created src directory"
    fi
    
    # Move modern Next.js source to root src
    if [ -d "alexai-nextjs-modern/src" ]; then
        log "Moving modern Next.js source files..."
        cp -r alexai-nextjs-modern/src/* src/
        success "Moved source files to src/"
    fi
    
    # Move public files
    if [ -d "alexai-nextjs-modern/public" ]; then
        log "Moving public files..."
        cp -r alexai-nextjs-modern/public/* public/
        success "Moved public files"
    fi
    
    # Remove the modern directory after consolidation
    if [ -d "alexai-nextjs-modern" ]; then
        log "Removing alexai-nextjs-modern directory..."
        rm -rf alexai-nextjs-modern
        success "Removed alexai-nextjs-modern directory"
    fi
}

# Function to update configuration files
update_config_files() {
    log "Updating configuration files..."
    
    # Update package.json with modern dependencies
    if [ -f "package.json" ]; then
        log "Updating package.json with modern dependencies..."
        
        # Create a temporary package.json with modern dependencies
        cat > package.json << 'EOF'
{
  "name": "alexai-star-trek-agile-system",
  "version": "2.0.0",
  "description": "AlexAI Star Trek Agile Project Management System - Consolidated Modern Version",
  "main": "server.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "server": "node server.js",
    "test": "jest",
    "lint": "eslint .",
    "deploy": "vercel --prod"
  },
  "keywords": [
    "agile",
    "project-management",
    "star-trek",
    "alexai",
    "nextjs",
    "typescript"
  ],
  "author": "AlexAI Team",
  "license": "MIT",
  "dependencies": {
    "@heroicons/react": "^2.1.1",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "next": "15.4.5",
    "openai": "^4.20.1",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "socket.io": "^4.7.2",
    "sqlite3": "^5.1.6",
    "tailwind-merge": "^3.3.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^8.52.0",
    "jest": "^29.7.0",
    "nodemon": "^3.0.1",
    "supertest": "^7.1.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF
        success "Updated package.json"
    fi
    
    # Update tsconfig.json
    if [ -f "tsconfig.json" ]; then
        log "Updating tsconfig.json..."
        cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
        success "Updated tsconfig.json"
    fi
    
    # Update next.config.ts
    log "Updating next.config.ts..."
    cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
EOF
    success "Updated next.config.ts"
}

# Function to clean up root level files
cleanup_root_files() {
    log "Cleaning up root level files..."
    
    # Remove system files
    rm -f .DS_Store
    rm -f server.log
    
    # Remove duplicate configuration files
    rm -f alexai-nextjs-modern/package.json 2>/dev/null || true
    rm -f alexai-nextjs-modern/tsconfig.json 2>/dev/null || true
    rm -f alexai-nextjs-modern/next.config.ts 2>/dev/null || true
    
    success "Cleaned up root level files"
}

# Function to verify consolidation
verify_consolidation() {
    log "Verifying consolidation..."
    
    # Check if essential directories exist
    ESSENTIAL_DIRS=("src" "public" "docs" "scripts" "tests" "storage" "logs")
    
    for dir in "${ESSENTIAL_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            success "✓ Directory exists: $dir"
        else
            warn "⚠ Directory missing: $dir"
        fi
    done
    
    # Check if essential files exist
    ESSENTIAL_FILES=("package.json" "tsconfig.json" "next.config.ts" "server.js" "agile_manager.db")
    
    for file in "${ESSENTIAL_FILES[@]}"; do
        if [ -f "$file" ]; then
            success "✓ File exists: $file"
        else
            warn "⚠ File missing: $file"
        fi
    done
    
    # Check if Next.js pages exist
    if [ -f "src/app/page.tsx" ]; then
        success "✓ Next.js dashboard page exists"
    else
        error "❌ Next.js dashboard page missing"
    fi
    
    if [ -d "src/app/projects" ]; then
        success "✓ Next.js projects page exists"
    else
        warn "⚠ Next.js projects page missing"
    fi
}

# Function to show final structure
show_final_structure() {
    log "Final project structure:"
    echo ""
    echo -e "${BLUE}alexai_katra_transfer_package_remote_v7/${NC}"
    echo -e "${BLUE}├── README.md${NC}                    # Main documentation"
    echo -e "${BLUE}├── package.json${NC}                 # Dependencies"
    echo -e "${BLUE}├── tsconfig.json${NC}               # TypeScript config"
    echo -e "${BLUE}├── next.config.ts${NC}              # Next.js config"
    echo -e "${BLUE}├── vercel.json${NC}                 # Vercel deployment"
    echo -e "${BLUE}├── docker-compose.yml${NC}          # Docker services"
    echo -e "${BLUE}├── Dockerfile${NC}                  # Docker build"
    echo -e "${BLUE}├── server.js${NC}                   # Legacy API server"
    echo -e "${BLUE}├── agile_manager.db${NC}            # SQLite database"
    echo -e "${BLUE}├── .github/${NC}                    # CI/CD workflows"
    echo -e "${BLUE}├── docs/${NC}                       # Documentation"
    echo -e "${BLUE}│   └── archive/${NC}               # Old documentation"
    echo -e "${BLUE}├── scripts/${NC}                    # Build scripts"
    echo -e "${BLUE}├── tests/${NC}                      # Test files"
    echo -e "${BLUE}├── storage/${NC}                    # Data storage"
    echo -e "${BLUE}├── logs/${NC}                       # Application logs"
    echo -e "${BLUE}├── src/${NC}                        # Modern Next.js app"
    echo -e "${BLUE}│   ├── app/${NC}                   # App Router pages"
    echo -e "${BLUE}│   │   ├── page.tsx${NC}          # Dashboard"
    echo -e "${BLUE}│   │   ├── projects/${NC}         # Projects page"
    echo -e "${BLUE}│   │   ├── observation-lounge/${NC} # AI consultation"
    echo -e "${BLUE}│   │   ├── project-detail/${NC}   # Project details"
    echo -e "${BLUE}│   │   └── alexai/${NC}           # AI core system"
    echo -e "${BLUE}│   ├── components/${NC}            # React components"
    echo -e "${BLUE}│   ├── lib/${NC}                   # Utilities"
    echo -e "${BLUE}│   ├── types/${NC}                 # TypeScript types"
    echo -e "${BLUE}│   └── hooks/${NC}                 # React hooks"
    echo -e "${BLUE}└── public/${NC}                     # Static assets"
    echo -e "${BLUE}    ├── assets/${NC}                # CSS, JS, images"
    echo -e "${BLUE}    └── favicon.ico${NC}            # Favicon"
    echo ""
}

# Function to show next steps
show_next_steps() {
    echo -e "${PURPLE}🎯 NEXT STEPS:${NC}"
    echo ""
    echo -e "${BLUE}1. INSTALL DEPENDENCIES${NC}"
    echo "   npm install"
    echo ""
    echo -e "${BLUE}2. TEST FUNCTIONALITY${NC}"
    echo "   npm run dev"
    echo "   # Visit http://localhost:3000"
    echo ""
    echo -e "${BLUE}3. TEST API SERVER${NC}"
    echo "   npm run server"
    echo "   # Visit http://localhost:8000"
    echo ""
    echo -e "${BLUE}4. VERIFY ALL PAGES${NC}"
    echo "   - Dashboard: http://localhost:3000"
    echo "   - Projects: http://localhost:3000/projects"
    echo "   - Observation Lounge: http://localhost:3000/observation-lounge"
    echo "   - Project Detail: http://localhost:3000/project-detail?id=1"
    echo "   - AlexAI Core: http://localhost:3000/alexai"
    echo ""
    echo -e "${BLUE}5. DEPLOY CONSOLIDATED VERSION${NC}"
    echo "   ./deploy-full-cicd.sh all"
    echo ""
}

# Main execution
main() {
    log "Starting project consolidation..."
    
    check_environment
    create_backup
    remove_deprecated_dirs
    archive_documentation
    consolidate_nextjs
    update_config_files
    cleanup_root_files
    verify_consolidation
    show_final_structure
    show_next_steps
    
    success "Project consolidation completed successfully!"
    echo ""
    echo -e "${PURPLE}🖖 Live Long and Prosper${NC}"
}

# Run main function
main "$@" 