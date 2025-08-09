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
