#!/bin/bash

# 🛡️ AlexAI Secure Environment Manager
# Enhanced ~/.zshrc extraction with comprehensive security
# Prevents secret exposure and manages environment safely

set -e

echo "🛡️ ALEXAI SECURE ENVIRONMENT MANAGER"
echo "===================================="
echo ""

# Security validation by Lieutenant Worf
SECURITY_OFFICER="🛡️ [WORF]"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Define secure paths
ENV_FILE="${PROJECT_ROOT}/.env"
ENV_TEMPLATE="${PROJECT_ROOT}/.env.example"
GITIGNORE_FILE="${PROJECT_ROOT}/.gitignore"
BACKUP_DIR="${PROJECT_ROOT}/.secure-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "$SECURITY_OFFICER Security protocols initiated"
echo ""

# Function: Enhanced .zshrc credential extraction
extract_credentials_from_zshrc() {
    local zshrc_file="$HOME/.zshrc"
    
    if [[ ! -f "$zshrc_file" ]]; then
        echo "⚠️ $SECURITY_OFFICER WARNING: ~/.zshrc not found"
        return 1
    fi
    
    echo "🔍 $SECURITY_OFFICER Extracting credentials from ~/.zshrc"
    
    # Extract all export statements with sensitive patterns
    local credentials=$(grep -E "^export [A-Z_]+(API_KEY|TOKEN|SECRET|PASSWORD|KEY)" "$zshrc_file" 2>/dev/null || true)
    
    if [[ -z "$credentials" ]]; then
        echo "⚠️ $SECURITY_OFFICER No credentials found in ~/.zshrc"
        return 1
    fi
    
    echo "✅ $SECURITY_OFFICER Found $(echo "$credentials" | wc -l) credential entries"
    return 0
}

# Function: Secure .env generation
generate_secure_env() {
    local temp_env=$(mktemp)
    local zshrc_file="$HOME/.zshrc"
    
    echo "🔐 $SECURITY_OFFICER Generating secure .env file"
    
    # Start with template if exists
    if [[ -f "$ENV_TEMPLATE" ]]; then
        echo "📋 Using .env.example as template"
        cp "$ENV_TEMPLATE" "$temp_env"
    fi
    
    # Extract and append credentials
    echo "" >> "$temp_env"
    echo "# === AUTOMATICALLY EXTRACTED FROM ~/.zshrc ===" >> "$temp_env"
    echo "# Generated: $(date)" >> "$temp_env"
    echo "# Security Officer: Lieutenant Worf" >> "$temp_env"
    echo "" >> "$temp_env"
    
    # Extract specific credentials we need
    local credentials=(
        "OPENAI_API_KEY"
        "N8N_API_KEY"
        "N8N_BASE_URL"
        "OPENROUTER_API_KEY"
        "VERCEL_TOKEN"
        "GITHUB_TOKEN"
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
        "AWS_REGION"
        "SUPABASE_URL"
        "SUPABASE_ANON_KEY"
    )
    
    for cred in "${credentials[@]}"; do
        local value=$(grep -E "^export ${cred}=" "$zshrc_file" 2>/dev/null | cut -d'=' -f2- | tr -d '"' || true)
        if [[ -n "$value" ]]; then
            echo "${cred}=${value}" >> "$temp_env"
            echo "✅ Extracted: ${cred}"
        else
            echo "⚠️ Missing: ${cred}"
        fi
    done
    
    # Move to final location
    mv "$temp_env" "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    
    echo "🔐 $SECURITY_OFFICER Secure .env file generated"
}

# Function: Enhanced .gitignore security
enhance_gitignore_security() {
    echo "🛡️ $SECURITY_OFFICER Enhancing .gitignore security patterns"
    
    # Security patterns to add
    local security_patterns=(
        ""
        "# === WORF'S SECURITY PROTOCOLS ==="
        "# Environment files"
        ".env*"
        "!.env.example"
        ""
        "# Backup files (prevent accidental commits)"
        "*.backup"
        "*.backup.*"
        "*.bak"
        "*.bak.*"
        "*backup*"
        ".secure-backups/"
        ""
        "# Temporary files"
        "*.tmp"
        "*.temp"
        "temp_*"
        "tmp_*"
        ""
        "# Secret files"
        "*secret*"
        "*Secret*"
        "*SECRET*"
        "*key*"
        "*Key*"
        "*KEY*"
        "*token*"
        "*Token*"
        "*TOKEN*"
        ""
        "# AWS credentials"
        ".aws/"
        "aws-*"
        ""
        "# Development artifacts"
        ".vscode/settings.json"
        "*.log"
        "logs/"
        ""
        "# macOS specific"
        ".DS_Store"
        ".DS_Store?"
        ""
    )
    
    # Check if patterns already exist
    for pattern in "${security_patterns[@]}"; do
        if [[ -n "$pattern" ]] && ! grep -Fq "$pattern" "$GITIGNORE_FILE" 2>/dev/null; then
            echo "$pattern" >> "$GITIGNORE_FILE"
        fi
    done
    
    echo "✅ $SECURITY_OFFICER Enhanced .gitignore security patterns"
}

# Function: Secure backup management
manage_secure_backups() {
    echo "💾 $SECURITY_OFFICER Managing secure backups"
    
    # Create secure backup directory
    mkdir -p "$BACKUP_DIR"
    chmod 700 "$BACKUP_DIR"
    
    # Backup current .env if exists
    if [[ -f "$ENV_FILE" ]]; then
        cp "$ENV_FILE" "${BACKUP_DIR}/.env.${TIMESTAMP}"
        echo "💾 Backed up current .env to secure location"
    fi
    
    # Add backup directory to .gitignore if not present
    if ! grep -q ".secure-backups/" "$GITIGNORE_FILE" 2>/dev/null; then
        echo ".secure-backups/" >> "$GITIGNORE_FILE"
    fi
}

# Function: Clean git history (advanced)
clean_git_history() {
    echo "🧹 $SECURITY_OFFICER Advanced git history cleaning"
    echo "⚠️  WARNING: This will rewrite git history"
    echo "⚠️  All team members will need to re-clone the repository"
    
    read -p "Do you want to proceed with git history cleaning? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🧹 Cleaning sensitive files from git history..."
        
        # Remove sensitive files from history
        git filter-branch --force --index-filter \
            'git rm --cached --ignore-unmatch .env.backup.* || true' \
            --prune-empty --tag-name-filter cat -- --all
        
        # Clean up
        git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
        git reflog expire --expire=now --all
        git gc --prune=now --aggressive
        
        echo "✅ Git history cleaned"
        echo "⚠️  Next push will require --force-with-lease"
    else
        echo "🛡️ Git history cleaning cancelled"
    fi
}

# Function: Validate environment security
validate_environment_security() {
    echo "🔍 $SECURITY_OFFICER Validating environment security"
    
    local issues=0
    
    # Check .env permissions
    if [[ -f "$ENV_FILE" ]]; then
        local perms=$(stat -f "%A" "$ENV_FILE" 2>/dev/null || stat -c "%a" "$ENV_FILE" 2>/dev/null)
        if [[ "$perms" != "600" ]]; then
            echo "⚠️ .env file permissions too open: $perms (should be 600)"
            chmod 600 "$ENV_FILE"
            echo "✅ Fixed .env permissions"
        fi
    fi
    
    # Check for exposed secrets in git
    local exposed_files=$(git ls-files | grep -E "\.(env|secret|key|token|backup)" | grep -v ".env.example" || true)
    if [[ -n "$exposed_files" ]]; then
        echo "⚠️ Potentially exposed secret files in git:"
        echo "$exposed_files"
        ((issues++))
    fi
    
    # Check for secrets in recent commits
    local recent_secrets=$(git log --oneline -10 --name-only | grep -E "\.(env|secret|key|token|backup)" | grep -v ".env.example" || true)
    if [[ -n "$recent_secrets" ]]; then
        echo "⚠️ Secret files in recent git history:"
        echo "$recent_secrets"
        ((issues++))
    fi
    
    if [[ $issues -eq 0 ]]; then
        echo "✅ $SECURITY_OFFICER Environment security validation passed"
    else
        echo "⚠️ $SECURITY_OFFICER Found $issues security issues"
    fi
    
    return $issues
}

# Main execution
main() {
    echo "🎯 $SECURITY_OFFICER Initiating comprehensive security protocols"
    echo ""
    
    # Step 1: Secure backup management
    manage_secure_backups
    
    # Step 2: Extract credentials from ~/.zshrc
    if extract_credentials_from_zshrc; then
        generate_secure_env
    else
        echo "⚠️ $SECURITY_OFFICER Unable to extract credentials, manual configuration required"
    fi
    
    # Step 3: Enhance .gitignore security
    enhance_gitignore_security
    
    # Step 4: Validate security
    validate_environment_security
    
    echo ""
    echo "🎯 $SECURITY_OFFICER Security protocols complete"
    echo ""
    echo "📋 SECURITY SUMMARY:"
    echo "==================="
    echo "✅ Secure .env generated from ~/.zshrc"
    echo "✅ Enhanced .gitignore security patterns"
    echo "✅ Secure backup management implemented"
    echo "✅ Environment security validated"
    echo ""
    echo "🛡️ $SECURITY_OFFICER All security protocols satisfied"
    echo ""
    
    # Optional: Offer git history cleaning
    echo "🧹 OPTIONAL: Git history cleaning available"
    echo "   (Removes .env.backup files from git history)"
    echo "   Run with --clean-history flag if needed"
}

# Handle command line arguments
case "${1:-}" in
    --clean-history)
        clean_git_history
        ;;
    --validate-only)
        validate_environment_security
        ;;
    *)
        main
        ;;
esac
