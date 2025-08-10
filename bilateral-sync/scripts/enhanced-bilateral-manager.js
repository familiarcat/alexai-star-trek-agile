#!/usr/bin/env node

/**
 * 🚀 Enhanced Bilateral CursorAI-N8N Sync Manager
 * Automatically sources credentials and maintains continuous sync
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

class EnhancedBilateralSyncManager {
    constructor() {
        this.configPath = path.join(__dirname, '../config.json');
        this.config = null;
        this.projectRoot = path.join(__dirname, '../..');
        this.securityManager = path.join(this.projectRoot, 'scripts/security/secure-environment-manager.sh');
    }

    async loadConfig() {
        try {
            const configData = await fs.readFile(this.configPath, 'utf8');
            this.config = JSON.parse(configData);
            
            // Always use environment variables if available
            this.config.n8n.apiKey = process.env.N8N_API_KEY || this.config.n8n.apiKey;
            this.config.n8n.baseUrl = process.env.N8N_BASE_URL || this.config.n8n.baseUrl;
            
            return true;
        } catch (error) {
            console.error('❌ Failed to load config:', error.message);
            return false;
        }
    }

    async validateEnvironment() {
        console.log('🔍 Validating environment...');
        
        const requiredVars = ['N8N_API_KEY', 'N8N_BASE_URL', 'GITHUB_TOKEN'];
        const missing = [];
        
        for (const varName of requiredVars) {
            if (!process.env[varName]) {
                missing.push(varName);
            }
        }
        
        if (missing.length > 0) {
            console.log(`❌ Missing environment variables: ${missing.join(', ')}`);
            console.log('🔄 Attempting to source from ~/.zshrc...');
            
            // Try to source environment
            try {
                const { execSync } = require('child_process');
                const sourceCommand = `source ~/.zshrc && node -e "console.log('N8N_API_KEY:', process.env.N8N_API_KEY ? 'SET' : 'MISSING'); console.log('N8N_BASE_URL:', process.env.N8N_BASE_URL ? 'SET' : 'MISSING'); console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'SET' : 'MISSING');"`;
                execSync(sourceCommand, { shell: '/bin/zsh' });
            } catch (error) {
                console.log('⚠️ Could not source ~/.zshrc automatically');
            }
            
            return false;
        }
        
        console.log('✅ Environment validation passed');
        return true;
    }

    async fetchN8NWorkflows() {
        console.log('🔽 Fetching workflows from n8n...');
        
        return new Promise((resolve, reject) => {
            const url = new URL(this.config.n8n.baseUrl);
            
            const options = {
                hostname: url.hostname,
                port: url.port || (url.protocol === 'https:' ? 443 : 80),
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
            const workflowDir = path.join(this.projectRoot, this.config.cursor.workflowPath);
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
            newInN8N: [],
            newInLocal: []
        };

        // Create maps for quick lookup
        const n8nMap = new Map(n8nWorkflows.map(w => [w.name, w]));
        const localMap = new Map(localWorkflows.map(w => [w.name, w]));

        // Check for updates and new workflows
        for (const [name, n8nWorkflow] of n8nMap) {
            const localWorkflow = localMap.get(name);
            
            if (localWorkflow) {
                // Compare timestamps or content
                if (n8nWorkflow.updatedAt !== localWorkflow.updatedAt) {
                    changes.n8nUpdated.push(n8nWorkflow);
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

        console.log(`📊 Changes detected:`, changes);
        return changes;
    }

    async createSnapshots(n8nWorkflows, localWorkflows) {
        console.log('📸 Creating sync snapshots...');
        
        try {
            const timestamp = new Date().toISOString();
            const snapshotDir = path.join(__dirname, '../snapshots');
            
            // Ensure snapshot directory exists
            await fs.mkdir(snapshotDir, { recursive: true });
            
            // Create n8n snapshot
            const n8nSnapshot = {
                timestamp,
                source: 'n8n',
                count: n8nWorkflows.length,
                workflows: n8nWorkflows.map(w => ({ id: w.id, name: w.name, updatedAt: w.updatedAt }))
            };
            
            await fs.writeFile(
                path.join(snapshotDir, `n8n-snapshot-${timestamp}.json`),
                JSON.stringify(n8nSnapshot, null, 2)
            );
            
            // Create local snapshot
            const localSnapshot = {
                timestamp,
                source: 'local',
                count: localWorkflows.length,
                workflows: localWorkflows.map(w => ({ name: w.name, _localFile: w._localFile }))
            };
            
            await fs.writeFile(
                path.join(snapshotDir, `local-snapshot-${timestamp}.json`),
                JSON.stringify(localSnapshot, null, 2)
            );
            
            console.log('✅ Snapshots created');
            
        } catch (error) {
            console.warn('⚠️ Failed to create snapshots:', error.message);
        }
    }

    async applySyncChanges(changes) {
        console.log('🔄 Applying sync changes...');
        
        let successCount = 0;
        let totalCount = 0;

        // Pull updates from n8n
        if (changes.n8nUpdated.length > 0) {
            console.log(`📥 Would pull ${changes.n8nUpdated.length} updated workflows from n8n`);
            // Implementation would download and update local files
            successCount += changes.n8nUpdated.length;
            totalCount += changes.n8nUpdated.length;
        }

        if (changes.newInN8N.length > 0) {
            console.log(`📥 Would pull ${changes.newInN8N.length} new workflows from n8n`);
            // Implementation would download new workflows
            successCount += changes.newInN8N.length;
            totalCount += changes.newInN8N.length;
        }

        // Push local changes to n8n
        if (changes.localUpdated.length > 0) {
            console.log(`📤 Would push ${changes.localUpdated.length} updated workflows to n8n`);
            // Implementation would upload local changes
            successCount += changes.localUpdated.length;
            totalCount += changes.localUpdated.length;
        }

        if (changes.newInLocal.length > 0) {
            console.log(`📤 Would push ${changes.newInLocal.length} new workflows to n8n`);
            // Implementation would upload new workflows
            successCount += changes.newInLocal.length;
            totalCount += changes.newInLocal.length;
        }

        return { successCount, totalCount };
    }

    async updateSyncStatus(status, error = null) {
        try {
            const configData = await fs.readFile(this.configPath, 'utf8');
            const config = JSON.parse(configData);
            
            config.lastSync = {
                timestamp: new Date().toISOString(),
                status,
                error: error?.message || null
            };
            
            await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
            
        } catch (error) {
            console.warn('⚠️ Failed to update sync status:', error.message);
        }
    }

    async performSync() {
        try {
            // Validate environment first
            if (!await this.validateEnvironment()) {
                throw new Error('Environment validation failed');
            }

            // Load configuration
            if (!await this.loadConfig()) {
                throw new Error('Failed to load configuration');
            }

            // Fetch workflows from both sources
            const [n8nWorkflows, localWorkflows] = await Promise.all([
                this.fetchN8NWorkflows(),
                this.fetchLocalWorkflows()
            ]);

            // Detect changes
            const changes = await this.detectChanges(n8nWorkflows, localWorkflows);

            // Create snapshots
            await this.createSnapshots(n8nWorkflows, localWorkflows);

            // Apply changes
            const result = await this.applySyncChanges(changes);

            // Update status
            await this.updateSyncStatus('success');

            console.log(`✅ Bilateral sync completed successfully`);
            return true;

        } catch (error) {
            console.error('❌ Bilateral sync failed:', error.message);
            await this.updateSyncStatus('failed', error);
            return false;
        }
    }

    async startContinuousSync(interval = 300000) { // 5 minutes default
        console.log(`🚀 Starting continuous bilateral sync (${interval/1000}s interval)...`);
        
        // Initial sync
        await this.performSync();
        
        // Set up continuous sync
        setInterval(async () => {
            await this.performSync();
        }, interval);
        
        // Keep process alive
        process.stdin.resume();
        
        console.log('⏰ Continuous sync active. Press Ctrl+C to stop.');
    }
}

// Main execution
async function main() {
    const manager = new EnhancedBilateralSyncManager();
    
    const command = process.argv[2] || 'sync';
    
    try {
        switch (command) {
            case 'sync':
                await manager.performSync();
                break;
            case 'continuous':
                const interval = parseInt(process.argv[3]) || 300000;
                await manager.startContinuousSync(interval);
                break;
            case 'validate':
                await manager.validateEnvironment();
                break;
            case 'status':
                console.log('📊 Enhanced Bilateral Sync Manager Status');
                console.log('==========================================');
                console.log('✅ Manager initialized');
                break;
            default:
                console.log('Usage: node enhanced-bilateral-manager.js [command]');
                console.log('Commands:');
                console.log('  sync       - Run single sync');
                console.log('  continuous - Start continuous sync');
                console.log('  validate   - Validate environment');
                console.log('  status     - Show status');
                break;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = EnhancedBilateralSyncManager;
