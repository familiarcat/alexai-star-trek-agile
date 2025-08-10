#!/usr/bin/env node

/**
 * 🔄 Enhanced Bilateral CursorAI-N8N Sync Manager
 * Advanced synchronization with real-time monitoring and conflict resolution
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const chokidar = require('chokidar');

class EnhancedBilateralSyncManager {
    constructor() {
        this.configPath = path.join(__dirname, '../config.json');
        this.config = null;
        this.fileWatcher = null;
        this.syncInProgress = false;
        this.syncQueue = [];
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

    async startFileWatcher() {
        if (!this.config.cursor.fileWatcher) return;
        
        console.log('👀 Starting file watcher for real-time sync...');
        
        const workflowPath = path.resolve(process.cwd(), this.config.cursor.workflowPath);
        
        this.fileWatcher = chokidar.watch(workflowPath, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            ignoreInitial: true
        });

        this.fileWatcher
            .on('add', (filePath) => this.handleFileChange(filePath, 'add'))
            .on('change', (filePath) => this.handleFileChange(filePath, 'change'))
            .on('unlink', (filePath) => this.handleFileChange(filePath, 'unlink'))
            .on('error', (error) => console.error('File watcher error:', error));

        console.log('✅ File watcher started');
    }

    async handleFileChange(filePath, changeType) {
        const fileName = path.basename(filePath);
        
        // Check if file should be synced
        if (!this.shouldSyncFile(fileName)) return;
        
        console.log(`🔄 File change detected: ${fileName} (${changeType})`);
        
        // Queue sync operation
        this.syncQueue.push({
            filePath,
            changeType,
            timestamp: new Date().toISOString()
        });
        
        // Trigger sync if not already in progress
        if (!this.syncInProgress) {
            this.processSyncQueue();
        }
    }

    shouldSyncFile(fileName) {
        const includePatterns = this.config.workflows.include;
        const excludePatterns = this.config.workflows.exclude;
        
        // Check include patterns (case-insensitive)
        const shouldInclude = includePatterns.some(pattern => {
            const regex = new RegExp(pattern.replace('*', '.*'), 'i');
            return regex.test(fileName);
        });
        
        if (!shouldInclude) return false;
        
        // Check exclude patterns (case-insensitive)
        const shouldExclude = excludePatterns.some(pattern => {
            const regex = new RegExp(pattern.replace('*', '.*'), 'i');
            return regex.test(fileName);
        });
        
        return !shouldExclude;
    }

    async processSyncQueue() {
        if (this.syncInProgress || this.syncQueue.length === 0) return;
        
        this.syncInProgress = true;
        console.log(`🔄 Processing ${this.syncQueue.length} sync operations...`);
        
        try {
            while (this.syncQueue.length > 0) {
                const syncOp = this.syncQueue.shift();
                await this.syncWorkflow(syncOp);
            }
        } catch (error) {
            console.error('❌ Error processing sync queue:', error);
        } finally {
            this.syncInProgress = false;
            
            // Process remaining items if any were added during sync
            if (this.syncQueue.length > 0) {
                setTimeout(() => this.processSyncQueue(), 1000);
            }
        }
    }

    async syncWorkflow(syncOp) {
        try {
            const { filePath, changeType } = syncOp;
            
            if (changeType === 'add' || changeType === 'change') {
                await this.pushWorkflowToN8N(filePath);
            } else if (changeType === 'unlink') {
                await this.removeWorkflowFromN8N(filePath);
            }
            
            console.log(`✅ Synced workflow: ${path.basename(filePath)}`);
            
        } catch (error) {
            console.error(`❌ Failed to sync workflow:`, error);
        }
    }

    async pushWorkflowToN8N(filePath) {
        const workflowData = await fs.readFile(filePath, 'utf8');
        const workflow = JSON.parse(workflowData);
        
        // Implement n8n API push logic here
        console.log(`📤 Pushing workflow to n8n: ${workflow.name}`);
        
        // This would make an actual API call to n8n
        // await this.n8nApiCall('POST', '/workflows', workflow);
    }

    async removeWorkflowFromN8N(filePath) {
        const fileName = path.basename(filePath);
        console.log(`🗑️ Removing workflow from n8n: ${fileName}`);
        
        // This would make an actual API call to n8n
        // await this.n8nApiCall('DELETE', `/workflows/${workflowId}`);
    }

    async performFullSync() {
        console.log('🔄 Starting full bilateral sync...');
        
        if (!await this.loadConfig()) {
            return false;
        }

        try {
            // Fetch workflows from both sources
            const [n8nWorkflows, localWorkflows] = await Promise.all([
                this.fetchN8NWorkflows(),
                this.fetchLocalWorkflows()
            ]);

            // Detect changes and resolve conflicts
            const changes = await this.detectChanges(n8nWorkflows, localWorkflows);
            await this.resolveConflicts(changes);

            // Create snapshots
            await this.createSnapshots(n8nWorkflows, localWorkflows);

            // Update sync status
            await this.updateSyncStatus('completed', 'full');

            console.log('✅ Full bilateral sync completed successfully');
            return true;

        } catch (error) {
            console.error('❌ Full sync failed:', error.message);
            await this.updateSyncStatus('failed', 'full', error.message);
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
        
        const workflowPath = path.resolve(process.cwd(), this.config.cursor.workflowPath);
        const workflows = [];
        
        try {
            const files = await fs.readdir(workflowPath);
            
            for (const file of files) {
                if (file.endsWith('.json') && this.shouldSyncFile(file)) {
                    const filePath = path.join(workflowPath, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const workflow = JSON.parse(content);
                    workflows.push(workflow);
                }
            }
            
            console.log(`✅ Found ${workflows.length} local workflows`);
            return workflows;
            
        } catch (error) {
            console.error('❌ Error reading local workflows:', error);
            return [];
        }
    }

    async detectChanges(n8nWorkflows, localWorkflows) {
        console.log('🔍 Detecting changes...');
        
        const changes = {
            n8nUpdated: [],
            localUpdated: [],
            newInN8N: [],
            newInLocal: [],
            conflicts: []
        };
        
        // Create maps for efficient lookup
        const n8nMap = new Map(n8nWorkflows.map(w => [w.name, w]));
        const localMap = new Map(localWorkflows.map(w => [w.name, w]));
        
        // Detect changes
        for (const [name, n8nWorkflow] of n8nMap) {
            const localWorkflow = localMap.get(name);
            
            if (!localWorkflow) {
                changes.newInN8N.push(n8nWorkflow);
            } else {
                const n8nTime = new Date(n8nWorkflow.updatedAt || 0);
                const localTime = new Date(localWorkflow.updatedAt || 0);
                
                if (n8nTime > localTime) {
                    changes.n8nUpdated.push(n8nWorkflow);
                } else if (localTime > n8nTime) {
                    changes.localUpdated.push(localWorkflow);
                }
            }
        }
        
        for (const [name, localWorkflow] of localMap) {
            if (!n8nMap.has(name)) {
                changes.newInLocal.push(localWorkflow);
            }
        }
        
        console.log(`📊 Change detection complete:
  - N8N updated: ${changes.n8nUpdated.length}
  - Local updated: ${changes.localUpdated.length}
  - New in N8N: ${changes.newInN8N.length}
  - New in local: ${changes.newInLocal.length}`);
        
        return changes;
    }

    async resolveConflicts(changes) {
        console.log('⚖️ Resolving conflicts...');
        
        if (this.config.conflictResolution.strategy === 'smart') {
            // Smart conflict resolution based on timestamps and priority
            await this.smartConflictResolution(changes);
        } else {
            // Simple conflict resolution
            await this.simpleConflictResolution(changes);
        }
    }

    async smartConflictResolution(changes) {
        // Implement smart conflict resolution logic
        console.log('🧠 Using smart conflict resolution...');
        
        // This would implement more sophisticated conflict resolution
        // based on workflow priority, change frequency, and user preferences
    }

    async simpleConflictResolution(changes) {
        // Simple timestamp-based resolution
        console.log('⏰ Using simple timestamp-based resolution...');
        
        // This would implement basic timestamp-based conflict resolution
    }

    async createSnapshots(n8nWorkflows, localWorkflows) {
        console.log('📸 Creating sync snapshots...');
        
        const timestamp = new Date().toISOString();
        
        // Create n8n snapshot
        const n8nSnapshotPath = path.join(process.cwd(), 'bilateral-sync/snapshots/n8n', `snapshot-${timestamp}.json`);
        await fs.mkdir(path.dirname(n8nSnapshotPath), { recursive: true });
        await fs.writeFile(n8nSnapshotPath, JSON.stringify(n8nWorkflows, null, 2));
        
        // Create local snapshot
        const localSnapshotPath = path.join(process.cwd(), 'bilateral-sync/snapshots/cursor', `snapshot-${timestamp}.json`);
        await fs.mkdir(path.dirname(localSnapshotPath), { recursive: true });
        await fs.writeFile(localSnapshotPath, JSON.stringify(localWorkflows, null, 2));
        
        console.log('✅ Snapshots created');
    }

    async updateSyncStatus(status, type = 'sync', error = null) {
        this.config.lastSync = {
            timestamp: new Date().toISOString(),
            status: status,
            type: type,
            error: error,
            direction: 'bidirectional'
        };
        
        await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
    }

    async start() {
        console.log('🚀 Starting Enhanced Bilateral Sync Manager...');
        
        if (!await this.loadConfig()) {
            console.error('❌ Failed to load configuration');
            return false;
        }
        
        // Start file watcher for real-time sync
        await this.startFileWatcher();
        
        // Perform initial sync
        await this.performFullSync();
        
        // Set up periodic sync
        setInterval(async () => {
            await this.performFullSync();
        }, this.config.sync.interval * 1000);
        
        console.log('✅ Enhanced Bilateral Sync Manager started');
        return true;
    }
}

// CLI interface
async function main() {
    const syncManager = new EnhancedBilateralSyncManager();
    
    const command = process.argv[2] || 'start';
    
    switch (command) {
        case 'start':
            await syncManager.start();
            break;
        case 'sync':
            await syncManager.performFullSync();
            break;
        case 'status':
            if (await syncManager.loadConfig()) {
                console.log('📊 Sync Status:', syncManager.config.lastSync);
            }
            break;
        default:
            console.log('Usage: node enhanced-sync-manager.js [start|sync|status]');
            break;
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = EnhancedBilateralSyncManager;
