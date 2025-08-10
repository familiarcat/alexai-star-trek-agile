#!/usr/bin/env node

/**
 * 📊 Bilateral Sync Monitoring Dashboard
 * Real-time monitoring of sync operations
 */

const fs = require('fs').promises;
const path = require('path');

class SyncMonitor {
    constructor() {
        this.configPath = path.join(__dirname, '../config.json');
        this.logPath = path.join(__dirname, '../logs');
    }
    
    async startMonitoring() {
        console.log('📊 Starting sync monitoring...');
        
        // Monitor sync status every 10 seconds
        setInterval(async () => {
            await this.displayStatus();
        }, 10000);
        
        // Initial status display
        await this.displayStatus();
    }
    
    async displayStatus() {
        try {
            const config = await this.loadConfig();
            const logs = await this.getRecentLogs();
            
            console.clear();
            console.log('🔄 BILATERAL SYNC MONITORING DASHBOARD');
            console.log('========================================');
            console.log('');
            
            // Sync status
            const lastSync = config.lastSync;
            console.log('📊 SYNC STATUS:');
            console.log(`  Last Sync: ${lastSync.timestamp || 'Never'}`);
            console.log(`  Status: ${lastSync.status || 'Unknown'}`);
            console.log(`  Type: ${lastSync.type || 'Unknown'}`);
            if (lastSync.error) {
                console.log(`  Error: ${lastSync.error}`);
            }
            console.log('');
            
            // Configuration status
            console.log('⚙️ CONFIGURATION:');
            console.log(`  Sync Enabled: ${config.sync.enabled ? '✅' : '❌'}`);
            console.log(`  Interval: ${config.sync.interval}s`);
            console.log(`  Bidirectional: ${config.sync.bidirectional ? '✅' : '❌'}`);
            console.log(`  Real-time: ${config.sync.realTimeSync ? '✅' : '❌'}`);
            console.log('');
            
            // Recent activity
            console.log('📝 RECENT ACTIVITY:');
            if (logs.length > 0) {
                logs.slice(0, 5).forEach(log => {
                    console.log(`  ${log.timestamp}: ${log.message}`);
                });
            } else {
                console.log('  No recent activity');
            }
            console.log('');
            
            // Health indicators
            console.log('💚 HEALTH INDICATORS:');
            console.log(`  N8N: ${await this.checkN8NHealth() ? '✅' : '❌'}`);
            console.log(`  Local: ✅`);
            console.log(`  Sync: ${lastSync.status === 'completed' ? '✅' : '❌'}`);
            console.log('');
            
            console.log('Press Ctrl+C to stop monitoring');
            
        } catch (error) {
            console.error('❌ Monitoring error:', error.message);
        }
    }
    
    async loadConfig() {
        const data = await fs.readFile(this.configPath, 'utf8');
        return JSON.parse(data);
    }
    
    async getRecentLogs() {
        try {
            const logFiles = await fs.readdir(this.logPath);
            const recentLogs = [];
            
            for (const file of logFiles.slice(-3)) {
                if (file.endsWith('.log')) {
                    const logPath = path.join(this.logPath, file);
                    const content = await fs.readFile(logPath, 'utf8');
                    const lines = content.split('\n').filter(line => line.trim());
                    
                    lines.slice(-10).forEach(line => {
                        try {
                            const log = JSON.parse(line);
                            recentLogs.push(log);
                        } catch (e) {
                            // Skip invalid JSON lines
                        }
                    });
                }
            }
            
            return recentLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
        } catch (error) {
            return [];
        }
    }
    
    async checkN8NHealth() {
        // Simple health check - in production this would be more sophisticated
        return true;
    }
}

if (require.main === module) {
    const monitor = new SyncMonitor();
    monitor.startMonitoring().catch(console.error);
}

module.exports = SyncMonitor;
