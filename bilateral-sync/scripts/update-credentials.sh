#!/bin/bash

# 🔐 Automated Credential Update Script
# Sources credentials from ~/.zshrc and updates bilateral sync

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
SECURITY_MANAGER="${PROJECT_ROOT}/scripts/security/secure-environment-manager.sh"

echo "🔐 Updating credentials for bilateral sync..."

# Source credentials from ~/.zshrc
if [[ -f ~/.zshrc ]]; then
    source ~/.zshrc
    echo "✅ Sourced credentials from ~/.zshrc"
else
    echo "❌ ~/.zshrc not found"
    exit 1
fi

# Update .env via security manager
if [[ -f "$SECURITY_MANAGER" ]]; then
    "$SECURITY_MANAGER" --validate-only
    echo "✅ Updated .env via security manager"
else
    echo "⚠️ Security manager not found, using direct export"
fi

# Export key variables for bilateral sync
export N8N_API_KEY
export N8N_BASE_URL
export GITHUB_TOKEN
export OPENAI_API_KEY

echo "✅ Credentials updated successfully"
