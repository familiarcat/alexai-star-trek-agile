#!/usr/bin/env node

/**
 * ✅ Bilateral Sync Validation Script
 * Validates synchronization between CursorAI and n8n
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

async function validateSync() {
    console.log('✅ Validating bilateral sync...');
    
    try {
        // Load configuration
        const configPath = path.join(__dirname, '../config.json');
        const configData = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(configData);
        
        // Validate n8n connectivity
        const n8nHealth = await checkN8NHealth(config.n8n.baseUrl);
        console.log(`🌐 N8N Health: ${n8nHealth ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
        
        // Validate local workflows
        const localWorkflows = await getLocalWorkflows(config.cursor.workflowPath);
        console.log(`📁 Local Workflows: ${localWorkflows.length} found`);
        
        // Validate sync configuration
        const configValid = validateConfig(config);
        console.log(`⚙️ Configuration: ${configValid ? '✅ VALID' : '❌ INVALID'}`);
        
        // Overall validation result
        const allValid = n8nHealth && configValid && localWorkflows.length > 0;
        console.log(`\n🎯 Overall Validation: ${allValid ? '✅ PASSED' : '❌ FAILED'}`);
        
        return allValid;
        
    } catch (error) {
        console.error('❌ Validation failed:', error.message);
        return false;
    }
}

async function checkN8NHealth(baseUrl) {
    return new Promise((resolve) => {
        const url = new URL('/healthz', baseUrl);
        
        const req = https.request(url, { method: 'GET' }, (res) => {
            resolve(res.statusCode === 200);
        });
        
        req.on('error', () => resolve(false));
        req.setTimeout(5000, () => resolve(false));
        req.end();
    });
}

async function getLocalWorkflows(workflowPath) {
    try {
        const fullPath = path.resolve(process.cwd(), workflowPath);
        const files = await fs.readdir(fullPath);
        return files.filter(f => f.endsWith('.json'));
    } catch (error) {
        return [];
    }
}

function validateConfig(config) {
    const required = ['sync', 'n8n', 'cursor', 'workflows'];
    return required.every(key => config[key] && typeof config[key] === 'object');
}

if (require.main === module) {
    validateSync().catch(console.error);
}

module.exports = { validateSync };
