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
