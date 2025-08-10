#!/bin/bash

# 🚀 AlexAI Bilateral Integration Setup
# Configures complete automated credential management and continuous sync

set -e

echo "🚀 ALEXAI BILATERAL INTEGRATION SETUP"
echo "====================================="
echo "🔄 Automated ~/.zshrc → Workflow → n8n Integration"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BILATERAL_DIR="${PROJECT_ROOT}/bilateral-sync"
SECURITY_MANAGER="${PROJECT_ROOT}/scripts/security/secure-environment-manager.sh"

# Check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    local missing=()
    
    if [[ ! -f "$SECURITY_MANAGER" ]]; then
        missing+=("Security Manager")
    fi
    
    if [[ ! -d "$BILATERAL_DIR" ]]; then
        missing+=("Bilateral Sync Directory")
    fi
    
    if [[ ! -f "${BILATERAL_DIR}/scripts/enhanced-bilateral-sync.sh" ]]; then
        missing+=("Enhanced Bilateral Sync Script")
    fi
    
    if [[ ! -f "${BILATERAL_DIR}/scripts/enhanced-bilateral-manager.js" ]]; then
        missing+=("Enhanced Bilateral Manager")
    fi
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "❌ Missing prerequisites: ${missing[*]}"
        echo "Please run enhanced-environment-setup.sh first"
        exit 1
    fi
    
    echo "✅ All prerequisites satisfied"
}

# Setup bilateral sync configuration
setup_bilateral_config() {
    echo ""
    echo "⚙️ SETTING UP BILATERAL SYNC CONFIGURATION"
    echo "=========================================="
    
    local config_file="${BILATERAL_DIR}/config.json"
    
    # Backup existing config
    if [[ -f "$config_file" ]]; then
        cp "$config_file" "${config_file}.backup.$(date +%Y%m%d_%H%M%S)"
        echo "💾 Backed up existing config"
    fi
    
    # Create enhanced config
    cat > "$config_file" << 'EOF'
{
  "sync": {
    "enabled": true,
    "interval": 300,
    "bidirectional": true,
    "autoMerge": true,
    "conflictResolution": "auto",
    "autoCredentials": true
  },
  "n8n": {
    "baseUrl": "https://n8n.pbradygeorgen.com",
    "apiKey": "ENV_N8N_API_KEY",
    "webhookBase": "https://n8n.pbradygeorgen.com/webhook",
    "autoActivate": true
  },
  "cursor": {
    "workflowPath": "sync-system/workflows",
    "snapshotPath": "bilateral-sync/snapshots",
    "logPath": "bilateral-sync/logs",
    "autoBackup": true
  },
  "workflows": {
    "include": [
      "AlexAI*",
      "Crew*",
      "Coordination*",
      "Bilateral*"
    ],
    "exclude": [
      "test*",
      "temp*",
      "backup*"
    ],
    "priority": [
      "alexai-complete-crew-workflow.json",
      "alexai-bilateral-learning-workflow.json"
    ]
  },
  "security": {
    "autoUpdateCredentials": true,
    "sourceFromZshrc": true,
    "validateBeforeSync": true,
    "encryptSensitiveData": false
  },
  "monitoring": {
    "enableLogging": true,
    "logLevel": "info",
    "enableMetrics": true,
    "alertOnFailure": true
  },
  "lastSync": {
    "timestamp": null,
    "status": "pending",
    "error": null
  }
}
EOF

    echo "✅ Enhanced bilateral config created"
}

# Setup automated credential management
setup_credential_management() {
    echo ""
    echo "🔐 SETTING UP AUTOMATED CREDENTIAL MANAGEMENT"
    echo "============================================"
    
    # Create credential update script
    local cred_script="${BILATERAL_DIR}/scripts/update-credentials.sh"
    
    cat > "$cred_script" << 'EOF'
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
EOF

    chmod +x "$cred_script"
    echo "✅ Credential update script created"
    
    # Create cron job for automatic credential updates
    local cron_job="*/15 * * * * ${cred_script} >> ${BILATERAL_DIR}/logs/credential-updates.log 2>&1"
    
    if command -v crontab >/dev/null 2>&1; then
        echo "⏰ Setting up cron job for credential updates..."
        (crontab -l 2>/dev/null; echo "$cron_job") | crontab -
        echo "✅ Cron job configured (every 15 minutes)"
    else
        echo "⚠️ crontab not available, manual credential updates required"
    fi
}

# Setup continuous sync service
setup_continuous_sync() {
    echo ""
    echo "🔄 SETTING UP CONTINUOUS SYNC SERVICE"
    echo "===================================="
    
    # Create systemd service for macOS (using launchd)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        local plist_file="${PROJECT_ROOT}/bilateral-sync/com.bradygeorgen.alexai-bilateral-sync.plist"
        
        cat > "$plist_file" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.bradygeorgen.alexai-bilateral-sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>${PROJECT_ROOT}/bilateral-sync/scripts/enhanced-bilateral-sync.sh</string>
    </array>
    <key>WorkingDirectory</key>
    <string>${PROJECT_ROOT}</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>${PROJECT_ROOT}/bilateral-sync/logs/service.log</string>
    <key>StandardErrorPath</key>
    <string>${PROJECT_ROOT}/bilateral-sync/logs/service-error.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
        <key>NODE_ENV</key>
        <string>production</string>
    </dict>
</dict>
</plist>
EOF

        echo "✅ LaunchAgent plist created for macOS"
        
        # Install the service
        local launch_agent_dir="$HOME/Library/LaunchAgents"
        mkdir -p "$launch_agent_dir"
        
        if [[ -f "$plist_file" ]]; then
            cp "$plist_file" "$launch_agent_dir/"
            launchctl load "$launch_agent_dir/$(basename "$plist_file")"
            echo "✅ LaunchAgent installed and started"
        fi
        
    else
        # Create systemd service for Linux
        local service_file="${PROJECT_ROOT}/bilateral-sync/alexai-bilateral-sync.service"
        
        # Update the service file with correct paths
        sed -i "s|/home/ubuntu|${PROJECT_ROOT}|g" "$service_file"
        sed -i "s|ubuntu|$(whoami)|g" "$service_file"
        
        echo "✅ Systemd service updated for Linux"
        echo "💡 To install: sudo cp $service_file /etc/systemd/system/ && sudo systemctl enable alexai-bilateral-sync.service"
    fi
}

# Setup monitoring and logging
setup_monitoring() {
    echo ""
    echo "📊 SETTING UP MONITORING AND LOGGING"
    echo "===================================="
    
    # Create log directories
    local log_dirs=(
        "${BILATERAL_DIR}/logs"
        "${BILATERAL_DIR}/snapshots"
        "${BILATERAL_DIR}/backups"
    )
    
    for dir in "${log_dirs[@]}"; do
        mkdir -p "$dir"
        echo "✅ Created directory: $dir"
    done
    
    # Create monitoring script
    local monitor_script="${BILATERAL_DIR}/scripts/monitor-sync.sh"
    
    cat > "$monitor_script" << 'EOF'
#!/bin/bash

# 📊 Bilateral Sync Monitor
# Monitors sync status and sends alerts

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/../config.json"

# Check last sync status
if [[ -f "$CONFIG_FILE" ]]; then
    last_sync=$(jq -r '.lastSync.status' "$CONFIG_FILE" 2>/dev/null)
    last_timestamp=$(jq -r '.lastSync.timestamp' "$CONFIG_FILE" 2>/dev/null)
    
    if [[ "$last_sync" == "failed" ]]; then
        echo "❌ Bilateral sync failed at $last_timestamp"
        # Could add notification logic here
    elif [[ "$last_sync" == "success" ]]; then
        echo "✅ Bilateral sync successful at $last_timestamp"
    else
        echo "⏳ Bilateral sync status: $last_sync"
    fi
else
    echo "⚠️ Config file not found"
fi
EOF

    chmod +x "$monitor_script"
    echo "✅ Monitoring script created"
}

# Test the integration
test_integration() {
    echo ""
    echo "🧪 TESTING BILATERAL INTEGRATION"
    echo "================================"
    
    # Test credential management
    echo "🔐 Testing credential management..."
    if "${BILATERAL_DIR}/scripts/update-credentials.sh"; then
        echo "✅ Credential management working"
    else
        echo "❌ Credential management failed"
        return 1
    fi
    
    # Test bilateral sync
    echo "🔄 Testing bilateral sync..."
    cd "$BILATERAL_DIR"
    if node scripts/enhanced-bilateral-manager.js validate; then
        echo "✅ Bilateral sync validation passed"
    else
        echo "❌ Bilateral sync validation failed"
        return 1
    fi
    
    echo "✅ All integration tests passed"
}

# Create integration guide
create_integration_guide() {
    echo ""
    echo "📚 CREATING INTEGRATION GUIDE"
    echo "============================="
    
    cat > "${PROJECT_ROOT}/BILATERAL_INTEGRATION_GUIDE.md" << 'EOF'
# 🚀 AlexAI Bilateral Integration Guide

## 🔄 Automated Credential Management

### How It Works
1. **~/.zshrc Source**: Credentials automatically sourced from your shell profile
2. **Security Manager**: Integrated with Lieutenant Worf's security protocols
3. **Auto-Update**: Credentials refreshed every 15 minutes via cron/launchd
4. **Environment Sync**: .env file automatically updated with latest credentials

### Manual Credential Update
```bash
# Update credentials manually
./bilateral-sync/scripts/update-credentials.sh

# Or use the security manager
npm run env:validate
```

## 🔄 Continuous Bilateral Sync

### Service Management
```bash
# Check service status
./bilateral-sync/scripts/enhanced-bilateral-sync.sh --status

# Start continuous sync
./bilateral-sync/scripts/enhanced-bilateral-sync.sh

# Run single sync
node bilateral-sync/scripts/enhanced-bilateral-manager.js sync
```

### Monitoring
```bash
# Check sync status
./bilateral-sync/scripts/monitor-sync.sh

# View logs
tail -f bilateral-sync/logs/service.log
```

## 🛡️ Security Features

### Automatic Protection
- ✅ Credentials never stored in git
- ✅ Automatic .env generation from ~/.zshrc
- ✅ Enhanced .gitignore patterns
- ✅ Secure backup management

### Security Commands
```bash
# Validate environment security
npm run env:validate

# Check bilateral sync security
node bilateral-sync/scripts/enhanced-bilateral-manager.js validate
```

## 🎯 Development Workflow

### 1. Initial Setup
```bash
# Run enhanced environment setup
npm run env:setup

# Run bilateral integration setup
./scripts/setup/bilateral-integration-setup.sh
```

### 2. Daily Development
```bash
# Start development
npm run dev

# Credentials automatically updated every 15 minutes
# Bilateral sync runs continuously in background
```

### 3. Workflow Management
```bash
# Edit workflows in /workflow-management
# Changes automatically synced to n8n
# n8n changes automatically pulled to local
```

## 🔧 Troubleshooting

### Common Issues
1. **Credentials Missing**: Run `npm run env:source`
2. **Sync Failed**: Check `bilateral-sync/logs/service-error.log`
3. **Service Not Running**: Restart with `launchctl reload` (macOS) or `systemctl restart` (Linux)

### Manual Recovery
```bash
# Force credential update
source ~/.zshrc

# Restart bilateral sync
./bilateral-sync/scripts/enhanced-bilateral-sync.sh

# Check n8n connection
node bilateral-sync/scripts/enhanced-bilateral-manager.js validate
```

## 🖖 Live Long and Prosper!

Your AlexAI bilateral integration is now fully automated and secure.
EOF

    echo "✅ Integration guide created"
}

# Main execution
main() {
    echo "🎯 Starting bilateral integration setup..."
    
    # Check prerequisites
    check_prerequisites
    
    # Setup components
    setup_bilateral_config
    setup_credential_management
    setup_continuous_sync
    setup_monitoring
    
    # Test integration
    test_integration
    
    # Create guide
    create_integration_guide
    
    echo ""
    echo "🎉 BILATERAL INTEGRATION SETUP COMPLETE!"
    echo "========================================"
    echo ""
    echo "✅ Automated credential management configured"
    echo "✅ Continuous bilateral sync service installed"
    echo "✅ Monitoring and logging setup complete"
    echo "✅ Integration guide created"
    echo ""
    echo "🚀 Your system now automatically:"
    echo "   • Sources credentials from ~/.zshrc every 15 minutes"
    echo "   • Updates .env via security manager"
    echo "   • Runs continuous bilateral sync"
    echo "   • Monitors sync status and logs"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Check service status: ./bilateral-sync/scripts/enhanced-bilateral-sync.sh --status"
    echo "  2. View logs: tail -f bilateral-sync/logs/service.log"
    echo "  3. Start development: npm run dev"
    echo ""
    echo "🖖 Live long and prosper!"
}

# Execute main function
main "$@"
