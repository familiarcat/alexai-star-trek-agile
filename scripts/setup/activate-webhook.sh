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
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Activating Crew Request Webhook${NC}"
echo -e "======================================"
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

echo -e "${BLUE}📋 Manual Activation Required${NC}"
echo -e "================================"
echo -e ""
echo -e "The webhook workflow has been deployed but needs to be activated."
echo -e ""
echo -e "${YELLOW}🔧 Steps to activate:${NC}"
echo -e "   1. Open your n8n instance: ${GREEN}$N8N_BASE_URL${NC}"
echo -e "   2. Navigate to Workflows"
echo -e "   3. Find 'AlexAI Crew Request Webhook'"
echo -e "   4. Click the toggle switch in the top-right to activate"
echo -e "   5. The workflow should show as 'Active'"
echo -e ""
echo -e "${BLUE}🧪 Testing the webhook:${NC}"
echo -e "   Once activated, test with:"
echo -e "   curl -X POST $N8N_BASE_URL/webhook/crew-request \\"
echo -e "     -H 'Content-Type: application/json' \\"
echo -e "     -d '{\"query\": \"test crew coordination\", \"context\": \"testing\"}'"
echo -e ""
echo -e "${GREEN}🎯 Next steps after activation:${NC}"
echo -e "   1. Test the webhook endpoint"
echo -e "   2. Restart your development server: npm run dev"
echo -e "   3. Test the observation lounge API"
echo -e "   4. Start bilateral sync: npm run sync:start"
echo -e ""
echo -e "${YELLOW}💡 Note:${NC} The webhook must be active for the observation lounge to work properly."
echo -e ""
