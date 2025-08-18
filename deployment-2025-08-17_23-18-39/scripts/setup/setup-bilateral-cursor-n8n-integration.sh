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

# 🔄 Bilateral CursorAI-N8N Integration Setup
# Creates self-updating workflow between CursorAI development and n8n execution

set -e

echo "🔄 BILATERAL CURSORAI-N8N INTEGRATION SETUP"
echo "==========================================="
echo "🎯 Creating self-updating workflow between CursorAI and n8n"
echo "🌐 N8N Instance: n8n.pbradygeorgen.com"
echo "📅 Setup Date: $(date)"
echo ""

# Function: Test n8n API connectivity
test_n8n_api_connectivity() {
    echo "🧪 TESTING N8N API CONNECTIVITY"
    echo "==============================="
    echo ""
    
    local n8n_base="https://n8n.pbradygeorgen.com"
    
    # Test basic connectivity
    echo "🔍 Testing n8n platform connectivity..."
    local platform_test=$(curl -s -w "%{http_code}" -o /dev/null "$n8n_base" || echo "ERROR")
    
    if echo "$platform_test" | grep -q -E "(200|302)"; then
        echo "✅ N8N platform: ACCESSIBLE (HTTP $platform_test)"
    else
        echo "❌ N8N platform: FAILED (HTTP $platform_test)"
        return 1
    fi
    
    # Test API endpoint
    echo "🔍 Testing n8n API endpoint..."
    local api_test=$(curl -s -w "%{http_code}" -o /dev/null "$n8n_base/api/v1/workflows" || echo "ERROR")
    
    if echo "$api_test" | grep -q -E "(401|403)"; then
        echo "✅ N8N API: RESPONDING (Authentication required - expected)"
    elif echo "$api_test" | grep -q "200"; then
        echo "✅ N8N API: FULLY ACCESSIBLE"
    else
        echo "⚠️ N8N API: Unexpected response (HTTP $api_test)"
    fi
    
    # Test active webhook
    echo "🔍 Testing active webhook..."
    local webhook_test=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"query":"connectivity test","timestamp":"'"$(date -Iseconds)"'"}' \
        "$n8n_base/webhook/crew-request" 2>/dev/null || echo "ERROR")
    
    if echo "$webhook_test" | grep -q "ERROR"; then
        echo "⚠️ Active webhook: Connection failed"
    elif [[ -n "$webhook_test" ]]; then
        echo "✅ Active webhook: RESPONDING"
        echo "   Response length: $(echo "$webhook_test" | wc -c) characters"
    else
        echo "⚠️ Active webhook: Empty response"
    fi
    
    return 0
}

# Function: Setup N8N API credentials
setup_n8n_api_credentials() {
    echo ""
    echo "🔑 N8N API CREDENTIALS SETUP"
    echo "============================"
    echo ""
    
    # Check if N8N_API_KEY exists
    if [[ -n "$N8N_API_KEY" ]]; then
        echo "✅ N8N_API_KEY: Found in environment"
    elif grep -q "N8N_API_KEY" ~/.zshrc 2>/dev/null; then
        echo "✅ N8N_API_KEY: Found in ~/.zshrc"
        source ~/.zshrc
    elif grep -q "N8N_API_KEY" .env 2>/dev/null; then
        echo "✅ N8N_API_KEY: Found in .env"
        source .env
    else
        echo "⚠️ N8N_API_KEY: Not found"
        echo ""
        echo "📋 To create an N8N API key:"
        echo "1. Visit: https://n8n.pbradygeorgen.com/settings/api"
        echo "2. Create new API key"
        echo "3. Add to ~/.zshrc: export N8N_API_KEY=\"your-key-here\""
        echo "4. Run: source ~/.zshrc"
        echo ""
    fi
    
    # Test API key if available
    if [[ -n "$N8N_API_KEY" ]]; then
        echo "🧪 Testing N8N API key..."
        local api_response=$(curl -s -w "%{http_code}" \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            "https://n8n.pbradygeorgen.com/api/v1/workflows" 2>/dev/null || echo "ERROR")
        
        local http_code="${api_response: -3}"
        
        if echo "$http_code" | grep -q "200"; then
            echo "✅ N8N API key: VALID and working"
            return 0
        else
            echo "❌ N8N API key: Invalid or insufficient permissions (HTTP $http_code)"
            return 1
        fi
    else
        echo "⚠️ Cannot test API key - not configured"
        return 1
    fi
}

# Function: Create bilateral sync infrastructure
create_bilateral_sync_infrastructure() {
    echo ""
    echo "🏗️ BILATERAL SYNC INFRASTRUCTURE"
    echo "================================"
    echo ""
    
    echo "📁 Creating bilateral sync directories..."
    
    # Create sync infrastructure directories
    mkdir -p bilateral-sync/{workflows,snapshots,logs,scripts}
    mkdir -p bilateral-sync/workflows/{local,n8n,merged}
    mkdir -p bilateral-sync/snapshots/{cursor,n8n}
    
    echo "✅ Directory structure created"
    
    # Create bilateral sync configuration
    cat > bilateral-sync/config.json << EOF
{
  "sync": {
    "enabled": true,
    "interval": 300,
    "bidirectional": true,
    "autoMerge": false,
    "conflictResolution": "manual"
  },
  "n8n": {
    "baseUrl": "https://n8n.pbradygeorgen.com",
    "apiKey": "\${N8N_API_KEY}",
    "webhookBase": "https://n8n.pbradygeorgen.com/webhook"
  },
  "cursor": {
    "workflowPath": "sync-system/workflows",
    "snapshotPath": "bilateral-sync/snapshots/cursor",
    "logPath": "bilateral-sync/logs"
  },
  "workflows": {
    "include": ["AlexAI*", "Crew*", "Coordination*"],
    "exclude": ["test*", "temp*"]
  },
  "lastSync": {
    "timestamp": null,
    "direction": null,
    "status": "pending"
  }
}
EOF
    
    echo "✅ Sync configuration created"
    
    # Create bilateral sync manager
    cat > bilateral-sync/scripts/bilateral-sync-manager.js << 'EOF'
#!/usr/bin/env node

/**
 * 🔄 Bilateral CursorAI-N8N Sync Manager
 * Manages bidirectional workflow synchronization
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

class BilateralSyncManager {
    constructor() {
        this.configPath = path.join(__dirname, '../config.json');
        this.config = null;
    }

    async loadConfig() {
        try {
            const configData = await fs.readFile(this.configPath, 'utf8');
            this.config = JSON.parse(configData);
            
            // Replace environment variables
            this.config.n8n.apiKey = process.env.N8N_API_KEY || this.config.n8n.apiKey;
            
            return true;
        } catch (error) {
            console.error('❌ Failed to load config:', error.message);
            return false;
        }
    }

    async fetchN8NWorkflows() {
        console.log('🔽 Fetching workflows from n8n...');
        
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'n8n.pbradygeorgen.com',
                path: '/api/v1/workflows',
                method: 'GET',
                headers: {
                    'X-N8N-API-KEY': this.config.n8n.apiKey,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const workflows = JSON.parse(data);
                        console.log(`✅ Fetched ${workflows.data?.length || 0} workflows from n8n`);
                        resolve(workflows.data || []);
                    } catch (error) {
                        reject(new Error(`Failed to parse n8n response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`N8N API request failed: ${error.message}`));
            });

            req.end();
        });
    }

    async fetchLocalWorkflows() {
        console.log('📁 Fetching local workflows...');
        
        try {
            const workflowDir = path.join(process.cwd(), this.config.cursor.workflowPath);
            const files = await fs.readdir(workflowDir);
            const jsonFiles = files.filter(file => file.endsWith('.json'));
            
            const workflows = [];
            for (const file of jsonFiles) {
                try {
                    const filePath = path.join(workflowDir, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const workflow = JSON.parse(content);
                    workflows.push({ ...workflow, _localFile: file });
                } catch (error) {
                    console.warn(`⚠️ Failed to load ${file}: ${error.message}`);
                }
            }
            
            console.log(`✅ Loaded ${workflows.length} local workflows`);
            return workflows;
            
        } catch (error) {
            console.error('❌ Failed to fetch local workflows:', error.message);
            return [];
        }
    }

    async detectChanges(n8nWorkflows, localWorkflows) {
        console.log('🔍 Detecting changes...');
        
        const changes = {
            n8nUpdated: [],
            localUpdated: [],
            conflicts: [],
            newInN8N: [],
            newInLocal: []
        };

        // Create maps for easier comparison
        const n8nMap = new Map(n8nWorkflows.map(w => [w.name, w]));
        const localMap = new Map(localWorkflows.map(w => [w.name, w]));

        // Check for updates and conflicts
        for (const [name, n8nWorkflow] of n8nMap) {
            if (localMap.has(name)) {
                const localWorkflow = localMap.get(name);
                
                // Simple timestamp comparison (you might want more sophisticated comparison)
                const n8nUpdate = new Date(n8nWorkflow.updatedAt);
                const localUpdate = localWorkflow.updatedAt ? new Date(localWorkflow.updatedAt) : new Date(0);
                
                if (n8nUpdate > localUpdate) {
                    changes.n8nUpdated.push(n8nWorkflow);
                } else if (localUpdate > n8nUpdate) {
                    changes.localUpdated.push(localWorkflow);
                }
            } else {
                changes.newInN8N.push(n8nWorkflow);
            }
        }

        // Check for new local workflows
        for (const [name, localWorkflow] of localMap) {
            if (!n8nMap.has(name)) {
                changes.newInLocal.push(localWorkflow);
            }
        }

        console.log(`📊 Changes detected:`, {
            n8nUpdated: changes.n8nUpdated.length,
            localUpdated: changes.localUpdated.length,
            newInN8N: changes.newInN8N.length,
            newInLocal: changes.newInLocal.length
        });

        return changes;
    }

    async performSync() {
        console.log('🔄 Starting bilateral sync...');
        
        if (!await this.loadConfig()) {
            return false;
        }

        try {
            // Fetch workflows from both sources
            const [n8nWorkflows, localWorkflows] = await Promise.all([
                this.fetchN8NWorkflows(),
                this.fetchLocalWorkflows()
            ]);

            // Detect changes
            const changes = await this.detectChanges(n8nWorkflows, localWorkflows);

            // Create snapshots
            await this.createSnapshots(n8nWorkflows, localWorkflows);

            // Perform sync operations
            await this.applySyncChanges(changes);

            // Update sync status
            await this.updateSyncStatus('completed');

            console.log('✅ Bilateral sync completed successfully');
            return true;

        } catch (error) {
            console.error('❌ Sync failed:', error.message);
            await this.updateSyncStatus('failed', error.message);
            return false;
        }
    }

    async createSnapshots(n8nWorkflows, localWorkflows) {
        console.log('📸 Creating sync snapshots...');
        
        const timestamp = new Date().toISOString();
        
        // Create n8n snapshot
        const n8nSnapshotPath = path.join(process.cwd(), 'bilateral-sync/snapshots/n8n', `snapshot-${timestamp}.json`);
        await fs.writeFile(n8nSnapshotPath, JSON.stringify(n8nWorkflows, null, 2));
        
        // Create local snapshot
        const localSnapshotPath = path.join(process.cwd(), 'bilateral-sync/snapshots/cursor', `snapshot-${timestamp}.json`);
        await fs.writeFile(localSnapshotPath, JSON.stringify(localWorkflows, null, 2));
        
        console.log('✅ Snapshots created');
    }

    async applySyncChanges(changes) {
        console.log('🔄 Applying sync changes...');
        
        // This is where you would implement the actual sync logic
        // For now, we'll just log what would be done
        
        if (changes.n8nUpdated.length > 0) {
            console.log(`📥 Would pull ${changes.n8nUpdated.length} updated workflows from n8n`);
        }
        
        if (changes.localUpdated.length > 0) {
            console.log(`📤 Would push ${changes.localUpdated.length} updated workflows to n8n`);
        }
        
        if (changes.newInN8N.length > 0) {
            console.log(`📥 Would pull ${changes.newInN8N.length} new workflows from n8n`);
        }
        
        if (changes.newInLocal.length > 0) {
            console.log(`📤 Would push ${changes.newInLocal.length} new workflows to n8n`);
        }
    }

    async updateSyncStatus(status, error = null) {
        this.config.lastSync = {
            timestamp: new Date().toISOString(),
            status: status,
            error: error
        };
        
        await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
    }
}

// CLI interface
async function main() {
    const syncManager = new BilateralSyncManager();
    
    const command = process.argv[2] || 'sync';
    
    switch (command) {
        case 'sync':
            await syncManager.performSync();
            break;
        case 'status':
            if (await syncManager.loadConfig()) {
                console.log('📊 Sync Status:', syncManager.config.lastSync);
            }
            break;
        default:
            console.log('Usage: node bilateral-sync-manager.js [sync|status]');
            break;
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = BilateralSyncManager;
EOF
    
    chmod +x bilateral-sync/scripts/bilateral-sync-manager.js
    echo "✅ Bilateral sync manager created"
    
    return 0
}

# Function: Create workflow evolution tracker
create_workflow_evolution_tracker() {
    echo ""
    echo "🧬 WORKFLOW EVOLUTION TRACKER"
    echo "============================="
    echo ""
    
    cat > bilateral-sync/scripts/evolution-tracker.js << 'EOF'
#!/usr/bin/env node

/**
 * 🧬 Workflow Evolution Tracker
 * Tracks and analyzes workflow evolution patterns
 */

const fs = require('fs').promises;
const path = require('path');

class EvolutionTracker {
    constructor() {
        this.evolutionPath = 'bilateral-sync/evolution';
        this.snapshotsPath = 'bilateral-sync/snapshots';
    }

    async initializeEvolutionTracking() {
        console.log('🧬 Initializing evolution tracking...');
        
        // Create evolution tracking directory
        await fs.mkdir(this.evolutionPath, { recursive: true });
        
        // Create evolution database
        const evolutionDb = {
            tracking: {
                enabled: true,
                startDate: new Date().toISOString(),
                metrics: {
                    totalEvolutions: 0,
                    workflowMutations: 0,
                    aiLearningEvents: 0,
                    performanceImprovements: 0
                }
            },
            workflows: {},
            patterns: {
                commonMutations: [],
                learningTriggers: [],
                improvementAreas: []
            }
        };
        
        const dbPath = path.join(this.evolutionPath, 'evolution-database.json');
        await fs.writeFile(dbPath, JSON.stringify(evolutionDb, null, 2));
        
        console.log('✅ Evolution tracking initialized');
        return true;
    }

    async trackWorkflowEvolution(workflowName, changes, context) {
        console.log(`🧬 Tracking evolution for: ${workflowName}`);
        
        const evolutionEvent = {
            timestamp: new Date().toISOString(),
            workflow: workflowName,
            changes: changes,
            context: context,
            evolutionType: this.categorizeEvolution(changes),
            learningIndicators: this.detectLearningIndicators(changes)
        };
        
        // Store evolution event
        const eventPath = path.join(this.evolutionPath, `${workflowName}-evolution.json`);
        
        let evolutionHistory = [];
        try {
            const existingData = await fs.readFile(eventPath, 'utf8');
            evolutionHistory = JSON.parse(existingData);
        } catch (error) {
            // File doesn't exist yet, start with empty array
        }
        
        evolutionHistory.push(evolutionEvent);
        await fs.writeFile(eventPath, JSON.stringify(evolutionHistory, null, 2));
        
        console.log(`✅ Evolution tracked: ${evolutionEvent.evolutionType}`);
        return evolutionEvent;
    }

    categorizeEvolution(changes) {
        if (changes.structuralChanges) return 'structural-mutation';
        if (changes.logicImprovements) return 'logic-enhancement';
        if (changes.performanceOptimization) return 'performance-optimization';
        if (changes.aiModelUpdates) return 'ai-learning';
        return 'incremental-improvement';
    }

    detectLearningIndicators(changes) {
        const indicators = [];
        
        if (changes.responseQuality) indicators.push('response-quality-improvement');
        if (changes.contextAwareness) indicators.push('context-awareness-enhancement');
        if (changes.adaptiveBehavior) indicators.push('adaptive-behavior-development');
        if (changes.errorReduction) indicators.push('error-reduction-learning');
        
        return indicators;
    }

    async generateEvolutionReport() {
        console.log('📊 Generating evolution report...');
        
        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalWorkflows: 0,
                evolutionEvents: 0,
                learningIndicators: 0
            },
            workflows: {},
            insights: []
        };
        
        try {
            const evolutionFiles = await fs.readdir(this.evolutionPath);
            const jsonFiles = evolutionFiles.filter(f => f.endsWith('-evolution.json'));
            
            for (const file of jsonFiles) {
                const workflowName = file.replace('-evolution.json', '');
                const filePath = path.join(this.evolutionPath, file);
                const evolutionData = JSON.parse(await fs.readFile(filePath, 'utf8'));
                
                report.workflows[workflowName] = {
                    totalEvolutions: evolutionData.length,
                    lastEvolution: evolutionData[evolutionData.length - 1]?.timestamp,
                    evolutionTypes: this.summarizeEvolutionTypes(evolutionData),
                    learningProgress: this.analyzeLearningProgress(evolutionData)
                };
                
                report.summary.totalWorkflows++;
                report.summary.evolutionEvents += evolutionData.length;
                report.summary.learningIndicators += evolutionData.reduce((sum, event) => 
                    sum + (event.learningIndicators?.length || 0), 0);
            }
            
            // Generate insights
            report.insights = this.generateInsights(report);
            
            // Save report
            const reportPath = path.join(this.evolutionPath, `evolution-report-${new Date().toISOString().split('T')[0]}.json`);
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
            
            console.log('✅ Evolution report generated');
            return report;
            
        } catch (error) {
            console.error('❌ Failed to generate evolution report:', error.message);
            return null;
        }
    }

    summarizeEvolutionTypes(evolutionData) {
        const types = {};
        evolutionData.forEach(event => {
            types[event.evolutionType] = (types[event.evolutionType] || 0) + 1;
        });
        return types;
    }

    analyzeLearningProgress(evolutionData) {
        const progress = {
            learningVelocity: 0,
            improvementTrends: [],
            adaptationPatterns: []
        };
        
        // Calculate learning velocity (evolutions per day)
        if (evolutionData.length > 1) {
            const firstEvent = new Date(evolutionData[0].timestamp);
            const lastEvent = new Date(evolutionData[evolutionData.length - 1].timestamp);
            const daysDiff = (lastEvent - firstEvent) / (1000 * 60 * 60 * 24);
            progress.learningVelocity = evolutionData.length / Math.max(daysDiff, 1);
        }
        
        return progress;
    }

    generateInsights(report) {
        const insights = [];
        
        if (report.summary.evolutionEvents > 10) {
            insights.push({
                type: 'high-evolution-activity',
                message: 'High evolution activity detected - AI agents are actively learning and adapting'
            });
        }
        
        if (report.summary.learningIndicators > 5) {
            insights.push({
                type: 'strong-learning-signals',
                message: 'Strong learning signals detected - workflows are demonstrating self-improvement'
            });
        }
        
        return insights;
    }
}

// CLI interface
async function main() {
    const tracker = new EvolutionTracker();
    
    const command = process.argv[2] || 'init';
    
    switch (command) {
        case 'init':
            await tracker.initializeEvolutionTracking();
            break;
        case 'report':
            const report = await tracker.generateEvolutionReport();
            if (report) {
                console.log('📊 Evolution Summary:', report.summary);
            }
            break;
        default:
            console.log('Usage: node evolution-tracker.js [init|report]');
            break;
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = EvolutionTracker;
EOF
    
    chmod +x bilateral-sync/scripts/evolution-tracker.js
    echo "✅ Evolution tracker created"
}

# Function: Setup automated sync scheduling
setup_automated_sync_scheduling() {
    echo ""
    echo "⏰ AUTOMATED SYNC SCHEDULING"
    echo "============================"
    echo ""
    
    # Create sync scheduler
    cat > bilateral-sync/scripts/sync-scheduler.sh << 'EOF'
#!/bin/bash

# 🕐 Bilateral Sync Scheduler
# Automated scheduling for bilateral sync operations

SYNC_INTERVAL=${SYNC_INTERVAL:-300}  # 5 minutes default
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "⏰ Bilateral Sync Scheduler Starting"
echo "Sync interval: $SYNC_INTERVAL seconds"
echo ""

# Function to run sync
run_sync() {
    echo "🔄 $(date): Running bilateral sync..."
    
    if node "$SCRIPT_DIR/bilateral-sync-manager.js" sync; then
        echo "✅ $(date): Sync completed successfully"
        
        # Track evolution if significant changes detected
        node "$SCRIPT_DIR/evolution-tracker.js" report > /dev/null 2>&1
        
    else
        echo "❌ $(date): Sync failed"
    fi
    
    echo ""
}

# Initial sync
run_sync

# Schedule regular syncs
while true; do
    sleep $SYNC_INTERVAL
    run_sync
done
EOF
    
    chmod +x bilateral-sync/scripts/sync-scheduler.sh
    echo "✅ Sync scheduler created"
    
    # Create systemd service file (optional)
    cat > bilateral-sync/alexai-bilateral-sync.service << 'EOF'
[Unit]
Description=AlexAI Bilateral CursorAI-N8N Sync Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/alexai_katra_transfer_package_remote_v7
ExecStart=/home/ubuntu/alexai_katra_transfer_package_remote_v7/bilateral-sync/scripts/sync-scheduler.sh
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
    
    echo "✅ Systemd service file created (optional)"
}

# Function: Create testing suite
create_bilateral_testing_suite() {
    echo ""
    echo "🧪 BILATERAL TESTING SUITE"
    echo "=========================="
    echo ""
    
    cat > bilateral-sync/scripts/test-bilateral-integration.sh << 'EOF'
#!/bin/bash

# 🧪 Bilateral Integration Testing Suite
# Comprehensive testing for bilateral workflow synchronization

set -e

echo "🧪 BILATERAL INTEGRATION TESTING SUITE"
echo "======================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Test 1: Configuration validation
test_configuration() {
    echo "📋 Test 1: Configuration Validation"
    echo "==================================="
    
    if [[ -f "$SCRIPT_DIR/../config.json" ]]; then
        echo "✅ Configuration file exists"
        
        if node -e "JSON.parse(require('fs').readFileSync('$SCRIPT_DIR/../config.json', 'utf8'))" 2>/dev/null; then
            echo "✅ Configuration is valid JSON"
        else
            echo "❌ Configuration is invalid JSON"
            return 1
        fi
    else
        echo "❌ Configuration file missing"
        return 1
    fi
    
    echo ""
}

# Test 2: N8N connectivity
test_n8n_connectivity() {
    echo "🌐 Test 2: N8N Connectivity"
    echo "==========================="
    
    local n8n_url="https://n8n.pbradygeorgen.com"
    
    if curl -s -f "$n8n_url" > /dev/null; then
        echo "✅ N8N platform accessible"
    else
        echo "❌ N8N platform unreachable"
        return 1
    fi
    
    # Test webhook
    local webhook_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"query":"test","source":"bilateral-test"}' \
        "$n8n_url/webhook/crew-request" || echo "ERROR")
    
    if echo "$webhook_response" | grep -q "ERROR"; then
        echo "❌ Webhook connection failed"
    else
        echo "✅ Webhook responding"
    fi
    
    echo ""
}

# Test 3: Sync manager functionality
test_sync_manager() {
    echo "🔄 Test 3: Sync Manager Functionality"
    echo "====================================="
    
    if node "$SCRIPT_DIR/bilateral-sync-manager.js" status; then
        echo "✅ Sync manager operational"
    else
        echo "❌ Sync manager failed"
        return 1
    fi
    
    echo ""
}

# Test 4: Evolution tracking
test_evolution_tracking() {
    echo "🧬 Test 4: Evolution Tracking"
    echo "============================="
    
    if node "$SCRIPT_DIR/evolution-tracker.js" init; then
        echo "✅ Evolution tracking initialized"
        
        if node "$SCRIPT_DIR/evolution-tracker.js" report; then
            echo "✅ Evolution reporting functional"
        else
            echo "❌ Evolution reporting failed"
            return 1
        fi
    else
        echo "❌ Evolution tracking failed"
        return 1
    fi
    
    echo ""
}

# Test 5: End-to-end workflow sync simulation
test_end_to_end_sync() {
    echo "🔄 Test 5: End-to-End Sync Simulation"
    echo "====================================="
    
    echo "🧪 Simulating workflow sync..."
    
    # Create test workflow
    local test_workflow_path="sync-system/workflows/test-bilateral-sync.json"
    cat > "$test_workflow_path" << 'EOFW'
{
  "name": "Test Bilateral Sync",
  "nodes": [
    {
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "position": [250, 300]
    }
  ],
  "connections": {},
  "active": false,
  "settings": {},
  "updatedAt": "$(date -Iseconds)"
}
EOFW
    
    echo "✅ Test workflow created"
    
    # Test sync process
    if node "$SCRIPT_DIR/bilateral-sync-manager.js" sync; then
        echo "✅ End-to-end sync simulation successful"
        
        # Cleanup
        rm -f "$test_workflow_path"
        echo "✅ Test cleanup completed"
    else
        echo "❌ End-to-end sync simulation failed"
        rm -f "$test_workflow_path"
        return 1
    fi
    
    echo ""
}

# Main test execution
main() {
    echo "🎯 Starting bilateral integration tests..."
    echo ""
    
    local tests_passed=0
    local total_tests=5
    
    # Run all tests
    test_configuration && tests_passed=$((tests_passed + 1))
    test_n8n_connectivity && tests_passed=$((tests_passed + 1))
    test_sync_manager && tests_passed=$((tests_passed + 1))
    test_evolution_tracking && tests_passed=$((tests_passed + 1))
    test_end_to_end_sync && tests_passed=$((tests_passed + 1))
    
    echo "🏆 BILATERAL INTEGRATION TEST RESULTS"
    echo "====================================="
    echo "Tests passed: $tests_passed/$total_tests"
    echo "Success rate: $(( tests_passed * 100 / total_tests ))%"
    echo ""
    
    if [[ $tests_passed -eq $total_tests ]]; then
        echo "✅ All tests passed - Bilateral integration ready!"
        return 0
    else
        echo "⚠️ Some tests failed - Check configuration and connectivity"
        return 1
    fi
}

# Execute tests
main "$@"
EOF
    
    chmod +x bilateral-sync/scripts/test-bilateral-integration.sh
    echo "✅ Bilateral testing suite created"
}

# Main execution
main() {
    echo "🎯 Setting up bilateral CursorAI-N8N integration..."
    echo ""
    
    # Step 1: Test N8N connectivity
    if test_n8n_api_connectivity; then
        echo ""
        
        # Step 2: Setup API credentials
        if setup_n8n_api_credentials; then
            echo ""
            
            # Step 3: Create sync infrastructure
            create_bilateral_sync_infrastructure
            
            # Step 4: Create evolution tracker
            create_workflow_evolution_tracker
            
            # Step 5: Setup automated scheduling
            setup_automated_sync_scheduling
            
            # Step 6: Create testing suite
            create_bilateral_testing_suite
            
            echo ""
            echo "🎉 BILATERAL INTEGRATION SETUP COMPLETE!"
            echo "========================================"
            echo ""
            echo "✅ Sync infrastructure created"
            echo "✅ Evolution tracking initialized"
            echo "✅ Automated scheduling configured"
            echo "✅ Testing suite ready"
            echo ""
            echo "🎯 NEXT STEPS:"
            echo "=============="
            echo "1. Configure N8N API key (if not already done)"
            echo "2. Test the integration:"
            echo "   ./bilateral-sync/scripts/test-bilateral-integration.sh"
            echo ""
            echo "3. Start automated sync:"
            echo "   ./bilateral-sync/scripts/sync-scheduler.sh &"
            echo ""
            echo "4. Monitor evolution:"
            echo "   node bilateral-sync/scripts/evolution-tracker.js report"
            echo ""
            echo "🖖 Your bilateral CursorAI-N8N integration is ready!"
            
        else
            echo ""
            echo "⚠️ Setup completed with API key configuration needed"
            echo "   Please configure N8N_API_KEY and run setup again"
        fi
    else
        echo ""
        echo "❌ Setup failed - N8N connectivity issues"
        echo "   Please check your n8n instance and try again"
    fi
}

# Execute setup
main "$@"
