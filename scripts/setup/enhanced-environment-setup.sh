#!/bin/bash

# 🚀 AlexAI Enhanced Environment Setup
# Integrates with Secure Environment Manager for comprehensive protection
# Prevents GitHub secret scanning issues while maintaining ~/.zshrc workflow

set -e

echo "🚀 ALEXAI ENHANCED ENVIRONMENT SETUP"
echo "===================================="
echo "🛡️ Integrated with Worf's Security Protocols"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
SECURITY_MANAGER="${SCRIPT_DIR}/../security/secure-environment-manager.sh"

# Check if security manager exists
if [[ ! -f "$SECURITY_MANAGER" ]]; then
    echo "❌ Security manager not found: $SECURITY_MANAGER"
    echo "Please ensure the secure environment manager is available"
    exit 1
fi

echo "🛡️ Lieutenant Worf's Security Manager: LOCATED"
echo "📋 Running comprehensive security protocols..."
echo ""

# Run the secure environment manager
"$SECURITY_MANAGER"

# Additional setup for development workflow
setup_development_workflow() {
    echo ""
    echo "🔧 DEVELOPMENT WORKFLOW SETUP"
    echo "============================="
    
    # Ensure scripts are executable
    local scripts_to_make_executable=(
        "scripts/sync/push-workflows.sh"
        "scripts/sync/pull-workflows.sh" 
        "scripts/sync/sync-workflows.sh"
        "scripts/setup/source-env-from-zshrc.sh"
        "deploy-alexai-workflow.sh"
        "deploy-complete-crew-workflow-direct.sh"
        "test-sync-system.sh"
    )
    
    for script in "${scripts_to_make_executable[@]}"; do
        local script_path="${PROJECT_ROOT}/${script}"
        if [[ -f "$script_path" ]]; then
            chmod +x "$script_path"
            echo "✅ Made executable: $script"
        else
            echo "⚠️ Script not found: $script"
        fi
    done
    
    # Setup npm scripts for easy access
    echo ""
    echo "📦 NPM SCRIPT SHORTCUTS"
    echo "======================="
    echo "You can now use these npm shortcuts:"
    echo "  npm run env:setup     - Run this setup script"
    echo "  npm run env:source    - Source environment from ~/.zshrc"
    echo "  npm run env:validate  - Validate environment security"
    echo "  npm run env:clean     - Clean git history (advanced)"
    echo "  npm run sync:push     - Push workflows to n8n"
    echo "  npm run sync:pull     - Pull workflows from n8n"
    echo "  npm run sync:both     - Bidirectional sync"
}

# Update package.json scripts
update_package_scripts() {
    echo ""
    echo "📝 UPDATING PACKAGE.JSON SCRIPTS"
    echo "================================"
    
    # Check if package.json exists
    local package_json="${PROJECT_ROOT}/package.json"
    if [[ ! -f "$package_json" ]]; then
        echo "⚠️ package.json not found"
        return 1
    fi
    
    # Create temporary package.json with enhanced scripts
    local temp_package=$(mktemp)
    
    # Add our environment and sync scripts
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$package_json', 'utf8'));
    
    // Add our custom scripts
    pkg.scripts = pkg.scripts || {};
    
    // Environment management
    pkg.scripts['env:setup'] = './scripts/setup/enhanced-environment-setup.sh';
    pkg.scripts['env:source'] = './scripts/setup/source-env-from-zshrc.sh';
    pkg.scripts['env:validate'] = './scripts/security/secure-environment-manager.sh --validate-only';
    pkg.scripts['env:clean'] = './scripts/security/secure-environment-manager.sh --clean-history';
    
    // Workflow synchronization
    pkg.scripts['sync:push'] = './scripts/sync/push-workflows.sh';
    pkg.scripts['sync:pull'] = './scripts/sync/pull-workflows.sh';
    pkg.scripts['sync:both'] = './scripts/sync/sync-workflows.sh';
    
    // Deployment
    pkg.scripts['deploy:workflow'] = './deploy-complete-crew-workflow-direct.sh';
    pkg.scripts['deploy:all'] = './deploy-all-platforms.sh';
    
    // Testing
    pkg.scripts['test:env'] = './test-sync-system.sh';
    pkg.scripts['test:n8n'] = './comprehensive-system-wide-test.sh';
    pkg.scripts['test:ui'] = './test-ui-local-deployment.sh';
    
    fs.writeFileSync('$temp_package', JSON.stringify(pkg, null, 2));
    " 2>/dev/null
    
    if [[ $? -eq 0 ]]; then
        mv "$temp_package" "$package_json"
        echo "✅ Enhanced package.json with AlexAI scripts"
    else
        echo "⚠️ Could not update package.json scripts"
        rm -f "$temp_package"
    fi
}

# Create development guide
create_development_guide() {
    echo ""
    echo "📚 CREATING DEVELOPMENT GUIDE"
    echo "============================"
    
    cat > "${PROJECT_ROOT}/ENHANCED_DEVELOPMENT_GUIDE.md" << 'EOF'
# 🚀 AlexAI Enhanced Development Guide

## 🛡️ Secure Environment Management

### Quick Setup
```bash
# One-time setup with security protocols
npm run env:setup

# Source environment variables from ~/.zshrc
npm run env:source

# Validate security anytime
npm run env:validate

# Clean git history if needed (advanced)
npm run env:clean
```

### Manual Setup
```bash
# Run enhanced environment setup
./scripts/setup/enhanced-environment-setup.sh

# Or use the security manager directly
./scripts/security/secure-environment-manager.sh
```

## 🔄 Workflow Synchronization

### NPM Shortcuts
```bash
# Push local workflows to n8n
npm run sync:push

# Pull workflows from n8n
npm run sync:pull

# Bidirectional sync
npm run sync:both
```

### Manual Sync
```bash
# Push workflows
./scripts/sync/push-workflows.sh

# Pull workflows  
./scripts/sync/pull-workflows.sh

# Full sync
./scripts/sync/sync-workflows.sh
```

## 🚀 Deployment

### Deploy Workflows
```bash
# Deploy complete crew workflow
npm run deploy:workflow

# Deploy to all platforms
npm run deploy:all
```

### Manual Deployment
```bash
# Deploy n8n workflow
./deploy-complete-crew-workflow-direct.sh

# Full platform deployment
./deploy-all-platforms.sh
```

## 🧪 Testing

### NPM Test Scripts
```bash
# Test environment setup
npm run test:env

# Test n8n integration
npm run test:n8n

# Test UI components
npm run test:ui
```

### Manual Testing
```bash
# Test sync system
./test-sync-system.sh

# Comprehensive system test
./comprehensive-system-wide-test.sh

# UI testing
./test-ui-local-deployment.sh
```

## 🔒 Security Features

### Automatic Protection
- ✅ Secure .env generation from ~/.zshrc
- ✅ Enhanced .gitignore patterns
- ✅ Backup management (never in git)
- ✅ File permission management
- ✅ Git history validation

### Security Commands
```bash
# Validate environment security
npm run env:validate

# Clean sensitive files from git history
npm run env:clean

# Manual security check
./scripts/security/secure-environment-manager.sh --validate-only
```

## 🎯 Development Workflow

1. **Initial Setup**: `npm run env:setup`
2. **Source Environment**: `npm run env:source` (sources from ~/.zshrc)
3. **Start Development**: `npm run dev`
4. **Edit Workflows**: Visit `/workflow-management`
5. **Sync Changes**: `npm run sync:push`
6. **Test Integration**: `npm run test:n8n`
7. **Deploy**: `npm run deploy:all`

## 🛡️ Best Practices

### DO:
- ✅ Use npm scripts for common tasks
- ✅ Let the security manager handle .env generation
- ✅ Keep credentials in ~/.zshrc only
- ✅ Use the visual workflow editor
- ✅ Run security validation regularly

### DON'T:
- ❌ Manually edit .env files
- ❌ Commit backup files
- ❌ Bypass security protocols
- ❌ Push credentials to git
- ❌ Skip environment validation

## 🖖 Live Long and Prosper!

Your AlexAI development environment is now secured by Lieutenant Worf's protocols and enhanced with seamless n8n integration.
EOF

    echo "✅ Created comprehensive development guide"
}

# Main execution
main() {
    echo "🎯 Starting enhanced environment setup..."
    
    # Run security protocols via security manager
    echo "🛡️ Executing Worf's security protocols..."
    
    # Setup development workflow
    setup_development_workflow
    
    # Update package.json scripts
    update_package_scripts
    
    # Create development guide
    create_development_guide
    
    echo ""
    echo "🎉 ENHANCED ENVIRONMENT SETUP COMPLETE!"
    echo "======================================"
    echo ""
    echo "✅ Security protocols active (Lieutenant Worf approved)"
    echo "✅ Development workflow configured"
    echo "✅ NPM scripts enhanced"
    echo "✅ Development guide created"
    echo ""
    echo "🚀 READY FOR SEAMLESS N8N-CURSORAI INTEGRATION!"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. npm run dev                    # Start development"
    echo "  2. Visit /workflow-management     # Visual editor" 
    echo "  3. npm run sync:push              # Deploy workflows"
    echo "  4. npm run test:n8n               # Test integration"
    echo ""
    echo "🖖 Live long and prosper!"
}

# Execute main function
main "$@"
