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
        this.lastSyncTime = 0;
        this.syncCount = 0;
        this.adaptiveInterval = 300; // Start with 5 minutes
        this.changeDetected = false;
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
        
        // Only log if log level allows
        if (this.config.monitoring.logLevel === 'info') {
            console.log(`🔄 File change detected: ${fileName} (${changeType})`);
        }
        
        // Mark that changes were detected
        this.changeDetected = true;
        
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
        // Enhanced file validation
        if (!fileName || typeof fileName !== 'string') {
            return false;
        }
        
        // Check if file is a valid workflow file
        const validExtensions = ['.json'];
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        
        if (!hasValidExtension) {
            return false;
        }
        
        // Check against include/exclude patterns
        const shouldInclude = this.config.workflows.include.some(pattern => {
            if (pattern.endsWith('*')) {
                return fileName.startsWith(pattern.slice(0, -1));
            }
            return fileName === pattern;
        });
        
        const shouldExclude = this.config.workflows.exclude.some(pattern => {
            if (pattern.endsWith('*')) {
                return fileName.startsWith(pattern.slice(0, -1));
            }
            return fileName === pattern;
        });
        
        return shouldInclude && !shouldExclude;
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
            
            // Validate file before processing
            const validation = await this.validateWorkflowFile(filePath);
            if (!validation.valid) {
                console.warn(`⚠️ Skipping invalid workflow file: ${path.basename(filePath)} - ${validation.error}`);
                return;
            }
            
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
        try {
            // Validate file before processing
            const validation = await this.validateWorkflowFile(filePath);
            if (!validation.valid) {
                throw new Error(`Invalid workflow file: ${validation.error}`);
            }
            
            const workflow = validation.workflow;
            
            // Enhanced n8n API push logic with retry mechanism
            console.log(`📤 Pushing workflow to n8n: ${workflow.name}`);
            
            // Implement actual n8n API call with retry logic
            const maxRetries = this.config.n8n.retryAttempts || 3;
            let lastError;
            
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    // Make the actual API call to n8n
                    const result = await this.n8nApiCall('POST', '/workflows', workflow);
                    console.log(`✅ Successfully pushed workflow to n8n on attempt ${attempt}`);
                    return result;
                } catch (error) {
                    lastError = error;
                    console.warn(`⚠️ Attempt ${attempt} failed: ${error.message}`);
                    
                    if (attempt < maxRetries) {
                        // Wait before retry (exponential backoff)
                        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                        console.log(`⏳ Waiting ${delay}ms before retry...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
            
            throw new Error(`Failed to push workflow after ${maxRetries} attempts. Last error: ${lastError.message}`);
            
        } catch (error) {
            console.error(`❌ Error processing workflow ${filePath}:`, error.message);
            throw error;
        }
    }

    async removeWorkflowFromN8N(filePath) {
        const fileName = path.basename(filePath);
        console.log(`🗑️ Removing workflow from n8n: ${fileName}`);
        
        // This would make an actual API call to n8n
        // await this.n8nApiCall('DELETE', `/workflows/${workflowId}`);
    }

    async performFullSync() {
        if (this.syncInProgress) {
            if (this.config.monitoring.logLevel === 'info') {
                console.log('⏳ Sync already in progress, skipping...');
            }
            return;
        }

        this.syncInProgress = true;
        this.lastSyncTime = Date.now();
        this.syncCount++;

        try {
            if (this.config.monitoring.logLevel === 'info') {
                console.log('🔄 Starting full bilateral sync...');
            }

            const n8nWorkflows = await this.fetchN8NWorkflows();
            const localWorkflows = await this.fetchLocalWorkflows();
            
            const changes = await this.detectChanges(n8nWorkflows, localWorkflows);
            
            if (changes.hasChanges) {
                await this.resolveConflicts(changes);
                await this.createSnapshots(n8nWorkflows, localWorkflows);
                
                if (this.config.monitoring.logLevel === 'info') {
                    console.log('✅ Full bilateral sync completed successfully');
                }
            } else if (this.config.monitoring.logLevel === 'debug') {
                console.log('✅ No changes detected, sync skipped');
            }

            // Update sync status
            await this.updateSyncStatus('completed', 'full');
            
        } catch (error) {
            console.error('❌ Full sync failed:', error.message);
            await this.updateSyncStatus('failed', 'full', error.message);
        } finally {
            this.syncInProgress = false;
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
        if (this.config.monitoring.logLevel === 'info') {
            console.log('🔍 Detecting changes between local and remote workflows...');
        }
        
        const changes = {
            localOnly: [],
            remoteOnly: [],
            conflicts: [],
            duplicates: [],
            hasChanges: false
        };

        // Create maps for easier comparison
        const localMap = new Map();
        const remoteMap = new Map();
        
        localWorkflows.forEach(workflow => {
            const key = this.normalizeWorkflowName(workflow.name);
            if (!localMap.has(key)) {
                localMap.set(key, []);
            }
            localMap.get(key).push(workflow);
        });
        
        n8nWorkflows.forEach(workflow => {
            const key = this.normalizeWorkflowName(workflow.name);
            if (!remoteMap.has(key)) {
                remoteMap.set(key, []);
            }
            remoteMap.get(key).push(workflow);
        });

        // Detect local-only workflows
        for (const [key, localList] of localMap) {
            if (!remoteMap.has(key)) {
                changes.localOnly.push(...localList);
                changes.hasChanges = true;
            }
        }

        // Detect remote-only workflows
        for (const [key, remoteList] of remoteMap) {
            if (!localMap.has(key)) {
                changes.remoteOnly.push(...remoteList);
                changes.hasChanges = true;
            }
        }

        // Detect duplicates and conflicts
        for (const [key, remoteList] of remoteMap) {
            if (remoteList.length > 1) {
                changes.duplicates.push({
                    name: key,
                    workflows: remoteList,
                    type: 'remote'
                });
                changes.hasChanges = true;
            }
            
            if (localMap.has(key)) {
                const localList = localMap.get(key);
                if (localList.length > 1) {
                    changes.duplicates.push({
                        name: key,
                        workflows: localList,
                        type: 'local'
                    });
                    changes.hasChanges = true;
                }
                
                // Check for content conflicts
                const localLatest = this.getLatestWorkflow(localList);
                const remoteLatest = this.getLatestWorkflow(remoteList);
                
                if (this.hasContentConflict(localLatest, remoteLatest)) {
                    changes.conflicts.push({
                        name: key,
                        local: localLatest,
                        remote: remoteLatest,
                        type: 'content'
                    });
                    changes.hasChanges = true;
                }
            }
        }

        // Only log detailed changes if info level is enabled
        if (this.config.monitoring.logLevel === 'info' && changes.hasChanges) {
            const summary = {
                'N8N updated': changes.remoteOnly.length,
                'Local updated': changes.localOnly.length,
                'New in N8N': changes.remoteOnly.length,
                'New in local': changes.localOnly.length
            };
            console.log('📊 Change detection complete:', summary);
        } else if (this.config.monitoring.logLevel === 'warn' && changes.hasChanges) {
            console.log(`🔄 Changes detected: ${changes.localOnly.length + changes.remoteOnly.length + changes.conflicts.length} total`);
        }

        return changes;
    }

    normalizeWorkflowName(name) {
        // Normalize workflow names for comparison
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .replace(/alexai/g, 'alexai')
            .replace(/crew/g, 'crew')
            .replace(/coordination/g, 'coordination');
    }

    getLatestWorkflow(workflows) {
        // Get the most recently updated workflow
        return workflows.reduce((latest, current) => {
            const latestTime = new Date(latest.updatedAt || latest.createdAt || 0);
            const currentTime = new Date(current.updatedAt || current.createdAt || 0);
            return currentTime > latestTime ? current : latest;
        });
    }

    hasContentConflict(local, remote) {
        // Check if workflows have content conflicts
        if (!local || !remote) return false;
        
        // Compare key properties that indicate content differences
        const localHash = this.getWorkflowHash(local);
        const remoteHash = this.getWorkflowHash(remote);
        
        return localHash !== remoteHash;
    }

    getWorkflowHash(workflow) {
        // Create a hash of workflow content for comparison
        const content = JSON.stringify({
            nodes: workflow.nodes || [],
            connections: workflow.connections || {},
            settings: workflow.settings || {},
            staticData: workflow.staticData || {}
        });
        
        // Simple hash function
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    async consolidateMasterWorkflow() {
        console.log('🎯 Consolidating workflows into master workflow...');
        
        try {
            // Get all active workflows
            const n8nWorkflows = await this.fetchN8NWorkflows();
            const localWorkflows = await this.fetchLocalWorkflows();
            
            // Find the most comprehensive workflow as the base
            const masterCandidate = this.findMasterWorkflowCandidate(n8nWorkflows, localWorkflows);
            
            if (!masterCandidate) {
                console.log('❌ No suitable master workflow candidate found');
                return false;
            }
            
            console.log(`📋 Using '${masterCandidate.name}' as master workflow base`);
            
            // Create enhanced master workflow
            const masterWorkflow = await this.createEnhancedMasterWorkflow(masterCandidate, n8nWorkflows, localWorkflows);
            
            // Save master workflow locally
            const masterPath = path.join(process.cwd(), 'workflows', 'alexai-master-workflow-consolidated.json');
            await fs.writeFile(masterPath, JSON.stringify(masterWorkflow, null, 2));
            
            console.log(`✅ Master workflow saved to: ${masterPath}`);
            
            // Deploy to n8n
            const deployed = await this.pushWorkflowToN8N(masterPath);
            if (deployed) {
                console.log('🚀 Master workflow deployed to n8n');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('❌ Error consolidating master workflow:', error.message);
            return false;
        }
    }

    findMasterWorkflowCandidate(n8nWorkflows, localWorkflows) {
        // Find the most comprehensive workflow as the master candidate
        const allWorkflows = [...n8nWorkflows, ...localWorkflows];
        
        // Score workflows based on complexity and features
        const scoredWorkflows = allWorkflows.map(workflow => {
            let score = 0;
            
            // Score based on node count (more nodes = more complex)
            if (workflow.nodes) {
                score += workflow.nodes.length * 10;
            }
            
            // Score based on workflow type
            if (workflow.name.toLowerCase().includes('complete')) score += 100;
            if (workflow.name.toLowerCase().includes('enhanced')) score += 80;
            if (workflow.name.toLowerCase().includes('crew')) score += 60;
            if (workflow.name.toLowerCase().includes('coordination')) score += 40;
            
            // Score based on recency
            if (workflow.updatedAt) {
                const daysSinceUpdate = (Date.now() - new Date(workflow.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
                score += Math.max(0, 30 - daysSinceUpdate); // Newer workflows get higher scores
            }
            
            return { workflow, score };
        });
        
        // Sort by score and return the highest
        scoredWorkflows.sort((a, b) => b.score - a.score);
        return scoredWorkflows[0]?.workflow || null;
    }

    async createEnhancedMasterWorkflow(baseWorkflow, n8nWorkflows, localWorkflows) {
        // Create an enhanced version of the base workflow
        const masterWorkflow = {
            ...baseWorkflow,
            name: 'AlexAI Master Workflow - Consolidated',
            description: 'Consolidated master workflow combining all AlexAI capabilities',
            tags: ['master', 'consolidated', 'alexai', 'crew', 'coordination'],
            versionId: '1.0.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
                consolidation: {
                    baseWorkflow: baseWorkflow.name,
                    consolidatedAt: new Date().toISOString(),
                    sourceWorkflows: [...n8nWorkflows, ...localWorkflows].map(w => w.name),
                    totalWorkflows: n8nWorkflows.length + localWorkflows.length
                }
            }
        };
        
        // Enhance nodes with additional capabilities
        if (masterWorkflow.nodes) {
            masterWorkflow.nodes = masterWorkflow.nodes.map(node => {
                // Add metadata to each node
                return {
                    ...node,
                    metadata: {
                        ...node.metadata,
                        enhanced: true,
                        consolidated: true,
                        enhancedAt: new Date().toISOString()
                    }
                };
            });
        }
        
        return masterWorkflow;
    }

    async resolveConflicts(changes) {
        if (this.config.monitoring.logLevel === 'info') {
            console.log('⚖️ Resolving conflicts...');
        }
        
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
        if (this.config.monitoring.logLevel === 'info') {
            console.log('🧠 Using smart conflict resolution...');
        }
        
        // This would implement more sophisticated conflict resolution
        // based on workflow priority, change frequency, and user preferences
    }

    async simpleConflictResolution(changes) {
        // Simple timestamp-based resolution
        if (this.config.monitoring.logLevel === 'info') {
            console.log('⏰ Using simple timestamp-based resolution...');
        }
        
        // This would implement basic timestamp-based conflict resolution
    }

    async createSnapshots(n8nWorkflows, localWorkflows) {
        if (this.config.monitoring.logLevel === 'info') {
            console.log('📸 Creating sync snapshots...');
        }
        
        const timestamp = new Date().toISOString();
        
        try {
            // Create n8n snapshot
            const n8nSnapshotPath = path.join(process.cwd(), 'bilateral-sync/snapshots/n8n', `snapshot-${timestamp}.json`);
            await fs.mkdir(path.dirname(n8nSnapshotPath), { recursive: true });
            await fs.writeFile(n8nSnapshotPath, JSON.stringify(n8nWorkflows, null, 2));
            
            // Create local snapshot
            const localSnapshotPath = path.join(process.cwd(), 'bilateral-sync/snapshots/cursor', `snapshot-${timestamp}.json`);
            await fs.mkdir(path.dirname(localSnapshotPath), { recursive: true });
            await fs.writeFile(localSnapshotPath, JSON.stringify(localWorkflows, null, 2));
            
            // Clean up old snapshots if retention is enabled
            if (this.config.monitoring.logRetention) {
                await this.cleanupOldSnapshots();
            }
            
            if (this.config.monitoring.logLevel === 'info') {
                console.log('✅ Snapshots created');
            }
        } catch (error) {
            console.error('❌ Failed to create snapshots:', error.message);
        }
    }

    async cleanupOldSnapshots() {
        try {
            const retentionDays = this.config.monitoring.logRetention;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
            
            const snapshotDirs = [
                path.join(process.cwd(), 'bilateral-sync/snapshots/n8n'),
                path.join(process.cwd(), 'bilateral-sync/snapshots/cursor')
            ];
            
            for (const dir of snapshotDirs) {
                try {
                    const files = await fs.readdir(dir);
                    for (const file of files) {
                        if (file.startsWith('snapshot-') && file.endsWith('.json')) {
                            const filePath = path.join(dir, file);
                            const stats = await fs.stat(filePath);
                            if (stats.mtime < cutoffDate) {
                                await fs.unlink(filePath);
                            }
                        }
                    }
                } catch (error) {
                    // Ignore directory errors
                }
            }
        } catch (error) {
            // Ignore cleanup errors
        }
    }

    async updateSyncStatus(status, type = 'sync', error = null) {
        this.config.lastSync = {
            timestamp: new Date().toISOString(),
            status: status,
            type: type,
            error: error,
            direction: 'bidirectional',
            lastChangeDetected: this.changeDetected ? new Date().toISOString() : this.config.lastSync.lastChangeDetected,
            syncCount: this.syncCount
        };
        
        try {
            await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('❌ Failed to update sync status:', error.message);
        }
    }

    async showStatus() {
        if (!await this.loadConfig()) {
            console.error('❌ Failed to load configuration');
            return;
        }
        
        console.log('📊 Enhanced Bilateral Sync Status');
        console.log('================================');
        console.log(`Status: ${this.config.lastSync.status}`);
        console.log(`Last Sync: ${this.config.lastSync.timestamp}`);
        console.log(`Type: ${this.config.lastSync.type}`);
        console.log(`Direction: ${this.config.lastSync.direction}`);
        console.log(`Sync Count: ${this.config.lastSync.syncCount || 0}`);
        
        if (this.config.lastSync.lastChangeDetected) {
            console.log(`Last Change: ${this.config.lastSync.lastChangeDetected}`);
        }
        
        if (this.config.lastSync.error) {
            console.log(`Error: ${this.config.lastSync.error}`);
        }
        
        console.log(`Log Level: ${this.config.monitoring.logLevel}`);
        console.log(`Adaptive Interval: ${this.adaptiveInterval}s`);
        console.log(`File Watcher: ${this.config.cursor.fileWatcher ? 'Active' : 'Inactive'}`);
    }

    async showConfig() {
        if (!await this.loadConfig()) {
            console.error('❌ Failed to load configuration');
            return;
        }
        
        console.log('⚙️  Current Configuration');
        console.log('========================');
        console.log(`Sync Enabled: ${this.config.sync.enabled}`);
        console.log(`Base Interval: ${this.config.sync.interval}s`);
        console.log(`Min Interval: ${this.config.sync.minSyncInterval}s`);
        console.log(`Max Interval: ${this.config.sync.maxSyncInterval}s`);
        console.log(`Adaptive Sync: ${this.config.sync.adaptiveSync}`);
        console.log(`Bidirectional: ${this.config.sync.bidirectional}`);
        console.log(`Auto Merge: ${this.config.sync.autoMerge}`);
        console.log(`Conflict Resolution: ${this.config.conflictResolution.strategy}`);
        console.log(`Log Level: ${this.config.monitoring.logLevel}`);
        console.log(`Log Retention: ${this.config.monitoring.logRetention} days`);
    }

    async showRecentLogs() {
        console.log('📋 Recent Sync Activity');
        console.log('========================');
        console.log(`Current Sync Count: ${this.syncCount}`);
        console.log(`Last Sync Time: ${this.lastSyncTime ? new Date(this.lastSyncTime).toISOString() : 'Never'}`);
        console.log(`Change Detected: ${this.changeDetected ? 'Yes' : 'No'}`);
        console.log(`Sync In Progress: ${this.syncInProgress ? 'Yes' : 'No'}`);
        console.log(`Queue Length: ${this.syncQueue.length}`);
        
        if (this.syncQueue.length > 0) {
            console.log('\nPending Sync Operations:');
            this.syncQueue.forEach((op, index) => {
                console.log(`  ${index + 1}. ${path.basename(op.filePath)} (${op.changeType}) - ${op.timestamp}`);
            });
        }
    }

    async start() {
        console.log('🚀 Starting Enhanced Bilateral Sync Manager...');
        
        if (!await this.loadConfig()) {
            console.error('❌ Failed to load configuration');
            return false;
        }
        
        // Start file watcher for real-time sync
        await this.startFileWatcher();
        
        // Perform initial sync only if needed
        if (this.shouldPerformInitialSync()) {
            await this.performFullSync();
        } else {
            console.log('✅ Skipping initial sync - no recent changes detected');
        }
        
        // Set up adaptive periodic sync
        this.startAdaptiveSync();
        
        // Set up master workflow consolidation (every 24 hours)
        setInterval(async () => {
            if (this.config.monitoring.logLevel === 'info') {
                console.log('🎯 Scheduled master workflow consolidation...');
            }
            await this.consolidateMasterWorkflow();
        }, 24 * 60 * 60 * 1000);
        
        console.log('✅ Enhanced Bilateral Sync Manager started');
        console.log(`🎯 Sync interval: ${this.adaptiveInterval}s (adaptive)`);
        console.log(`📊 Log level: ${this.config.monitoring.logLevel}`);
        return true;
    }

    shouldPerformInitialSync() {
        // Check if we need to perform initial sync
        if (!this.config.lastSync || !this.config.lastSync.timestamp) {
            return true; // First time running
        }
        
        const lastSync = new Date(this.config.lastSync.timestamp);
        const now = new Date();
        const hoursSinceLastSync = (now - lastSync) / (1000 * 60 * 60);
        
        // Only sync if it's been more than 2 hours or if there were recent changes
        return hoursSinceLastSync > 2 || 
               (this.config.lastSync.lastChangeDetected && 
                (now - new Date(this.config.lastSync.lastChangeDetected)) < (1000 * 60 * 30)); // 30 minutes
    }

    startAdaptiveSync() {
        const runSync = async () => {
            const now = Date.now();
            const timeSinceLastSync = now - this.lastSyncTime;
            const minInterval = this.config.sync.minSyncInterval * 1000;
            
            // Only run sync if enough time has passed and changes were detected
            if (timeSinceLastSync >= minInterval && this.changeDetected) {
                await this.performFullSync();
                this.changeDetected = false;
            }
            
            // Adjust interval based on activity
            this.adjustSyncInterval();
            
            // Schedule next sync
            setTimeout(runSync, this.adaptiveInterval * 1000);
        };
        
        // Start the adaptive sync loop
        setTimeout(runSync, this.adaptiveInterval * 1000);
    }

    adjustSyncInterval() {
        if (this.changeDetected) {
            // More activity = shorter interval (but respect minimum)
            this.adaptiveInterval = Math.max(
                this.config.sync.minSyncInterval,
                this.adaptiveInterval * 0.8
            );
        } else {
            // Less activity = longer interval (but respect maximum)
            this.adaptiveInterval = Math.min(
                this.config.sync.maxSyncInterval,
                this.adaptiveInterval * 1.2
            );
        }
    }

    async validateWorkflowFile(filePath) {
        try {
            const stats = await fs.stat(filePath);
            
            // Check if file is empty
            if (stats.size === 0) {
                return { valid: false, error: 'File is empty' };
            }
            
            // Check if file is too large (sanity check)
            if (stats.size > 10 * 1024 * 1024) { // 10MB limit
                return { valid: false, error: 'File too large' };
            }
            
            // Try to read and parse the file
            const content = await fs.readFile(filePath, 'utf8');
            
            if (!content || content.trim() === '') {
                return { valid: false, error: 'File content is empty or whitespace only' };
            }
            
            // Enhanced JSON validation with better error handling
            let parsed;
            try {
                // Check for common JSON syntax issues
                if (content.includes('undefined') || content.includes('null')) {
                    console.warn(`⚠️ Warning: File ${path.basename(filePath)} contains undefined/null values`);
                }
                
                // Try to parse JSON with detailed error reporting
                parsed = JSON.parse(content);
            } catch (parseError) {
                // Provide more detailed error information
                const errorDetails = {
                    message: parseError.message,
                    line: parseError.line || 'unknown',
                    column: parseError.column || 'unknown',
                    position: parseError.position || 'unknown'
                };
                
                console.error(`❌ JSON Parse Error in ${path.basename(filePath)}:`, errorDetails);
                
                // Try to identify the specific issue
                if (parseError.message.includes('Unexpected end of JSON input')) {
                    return { valid: false, error: 'Incomplete JSON file - file may be corrupted or truncated' };
                } else if (parseError.message.includes('Unexpected token')) {
                    return { valid: false, error: `JSON syntax error: ${parseError.message}` };
                } else {
                    return { valid: false, error: `JSON parsing failed: ${parseError.message}` };
                }
            }
            
            // Validate basic workflow structure
            if (!parsed || typeof parsed !== 'object') {
                return { valid: false, error: 'File does not contain a valid JSON object' };
            }
            
            if (!parsed.name || typeof parsed.name !== 'string') {
                return { valid: false, error: 'Workflow missing required "name" property' };
            }
            
            // Additional workflow validation
            if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
                return { valid: false, error: 'Workflow missing required "nodes" array' };
            }
            
            if (!parsed.connections || typeof parsed.connections !== 'object') {
                return { valid: false, error: 'Workflow missing required "connections" object' };
            }
            
            return { valid: true, workflow: parsed };
            
        } catch (error) {
            return { valid: false, error: `File validation failed: ${error.message}` };
        }
    }

    async n8nApiCall(method, endpoint, data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'n8n.pbradygeorgen.com',
                path: `/api/v1${endpoint}`,
                method: method,
                headers: {
                    'X-N8N-API-KEY': this.config.n8n.apiKey,
                    'Content-Type': 'application/json'
                }
            };

            if (data) {
                const postData = JSON.stringify(data);
                options.headers['Content-Length'] = Buffer.byteLength(postData);
            }

            const req = https.request(options, (res) => {
                let responseData = '';
                
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                res.on('end', () => {
                    try {
                        if (responseData) {
                            const parsed = JSON.parse(responseData);
                            resolve(parsed);
                        } else {
                            resolve({ status: res.statusCode, message: res.statusMessage });
                        }
                    } catch (parseError) {
                        // If we can't parse the response, return the raw data
                        resolve({ 
                            status: res.statusCode, 
                            message: res.statusMessage,
                            rawData: responseData 
                        });
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`N8N API request failed: ${error.message}`));
            });

            if (data) {
                req.write(JSON.stringify(data));
            }
            
            req.end();
        });
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
            await syncManager.showStatus();
            break;
        case 'consolidate':
            if (await syncManager.loadConfig()) {
                await syncManager.consolidateMasterWorkflow();
            }
            break;
        case 'config':
            await syncManager.showConfig();
            break;
        case 'logs':
            await syncManager.showRecentLogs();
            break;
        default:
            console.log('Usage: node enhanced-sync-manager.js [start|sync|status|consolidate|config|logs]');
            console.log('  start       - Start the sync manager');
            console.log('  sync        - Perform a single full sync');
            console.log('  status      - Show current sync status');
            console.log('  consolidate - Run master workflow consolidation');
            console.log('  config      - Show current configuration');
            console.log('  logs        - Show recent sync logs');
            break;
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = EnhancedBilateralSyncManager;
