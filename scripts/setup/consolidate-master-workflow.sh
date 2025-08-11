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

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎯 AlexAI Master Workflow Consolidation${NC}"
echo -e "============================================"
echo -e ""

# Check if environment variables are loaded
if [ -z "$N8N_BASE_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Environment variables not loaded. Please run:${NC}"
    echo -e "   source ~/.zshrc"
    echo -e ""
    exit 1
fi

echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo -e "   N8N_BASE_URL: $N8N_BASE_URL"
echo -e "   N8N_API_KEY: ${N8N_API_KEY:0:10}..."
echo -e ""

echo -e "${BLUE}🔍 Analyzing current workflow state...${NC}"
echo -e "======================================"
echo -e ""

# Get current n8n workflows
echo -e "📋 Current n8n workflows:"
curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | \
    jq -r '.data[] | "  - \(.name) (\(.id)) [\(if .active then "Active" else "Inactive" end)]"'

echo -e ""

# Get local workflow files
echo -e "📁 Local workflow files:"
ls workflows/ | grep -E "(alexai|crew|coordination)" | sort | sed 's/^/  - /'

echo -e ""

echo -e "${YELLOW}⚠️  Before consolidation, please ensure:${NC}"
echo -e "   1. All local workflows are valid JSON"
echo -e "   2. No duplicate workflows exist on n8n"
echo -e "   3. Critical workflows are activated"
echo -e ""

read -p "Continue with consolidation? (y/N): " confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    echo -e ""
    echo -e "${BLUE}🚀 Starting master workflow consolidation...${NC}"
    echo -e "============================================="
    echo -e ""
    
    # Run the consolidation
    cd bilateral-sync/scripts
    node enhanced-sync-manager.js consolidate
    
    if [ $? -eq 0 ]; then
        echo -e ""
        echo -e "${GREEN}✅ Master workflow consolidation completed!${NC}"
        echo -e ""
        echo -e "${BLUE}📋 Next steps:${NC}"
        echo -e "   1. Check the generated 'alexai-master-workflow-consolidated.json'"
        echo -e "   2. Review the consolidated workflow in n8n"
        echo -e "   3. Activate the master workflow if needed"
        echo -e "   4. Test the consolidated functionality"
        echo -e ""
        echo -e "${GREEN}🎉 Your workflows are now unified and consolidated!${NC}"
    else
        echo -e ""
        echo -e "${RED}❌ Consolidation failed. Check the logs above for details.${NC}"
        exit 1
    fi
else
    echo -e ""
    echo -e "${YELLOW}⏸️  Consolidation cancelled.${NC}"
    echo -e "   Run this script again when ready to proceed."
    exit 0
fi
