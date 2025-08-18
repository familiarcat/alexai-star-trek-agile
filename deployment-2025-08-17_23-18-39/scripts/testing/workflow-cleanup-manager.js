#!/usr/bin/env node

/**
 * N8N Workflow Cleanup Manager
 * 
 * This script helps identify and safely archive unused workflows:
 * 1. Analyzes workflow usage patterns
 * 2. Identifies workflows that can be safely archived
 * 3. Provides safe archiving with backup
 * 4. Generates cleanup recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class WorkflowCleanupManager {
    constructor() {
        this.n8nBaseUrl = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';
        this.apiKey = process.env.N8N_API_KEY;
        this.workflows = [];
        this.cleanupRecommendations = [];
        this.archivedWorkflows = [];
        
        if (!this.apiKey) {
            throw new Error('N8N_API_KEY environment variable is required');
        }
    }

    /**
     * Initialize the cleanup manager
     */
    async initialize() {
        console.log('🧹 Initializing N8N Workflow Cleanup Manager...');
        
        try {
            // Fetch all workflows
            await this.fetchAllWorkflows();
            
            // Analyze usage patterns
            await this.analyzeWorkflowUsage();
            
            // Generate cleanup recommendations
            this.generateCleanupRecommendations();
            
            console.log('✅ Cleanup manager initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing cleanup manager:', error.message);
            throw error;
        }
    }

    /**
     * Fetch all workflows from n8n
     */
    async fetchAllWorkflows() {
        try {
            const response = await fetch(`${this.n8nBaseUrl}/api/v1/workflows`, {
                headers: {
                    'X-N8N-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            this.workflows = await response.json();
            console.log(`📋 Fetched ${this.workflows.length} workflows from n8n`);
        } catch (error) {
            console.error('❌ Error fetching workflows:', error.message);
            throw error;
        }
    }

    /**
     * Analyze workflow usage patterns
     */
    async analyzeWorkflowUsage() {
        console.log('📊 Analyzing workflow usage patterns...');
        
        for (const workflow of this.workflows) {
            try {
                const usage = await this.analyzeSingleWorkflow(workflow);
                workflow.usage = usage;
            } catch (error) {
                console.warn(`⚠️ Could not analyze workflow ${workflow.name}:`, error.message);
                workflow.usage = { estimatedUsage: 'unknown', errorRate: 0 };
            }
        }
        
        console.log('✅ Workflow usage analysis completed');
    }

    /**
     * Analyze usage of a single workflow
     */
    async analyzeSingleWorkflow(workflow) {
        const usage = {
            executionCount: 0,
            lastExecuted: null,
            errorRate: 0,
            estimatedUsage: 'unknown',
            complexity: 'low',
            dependencies: []
        };

        try {
            // Get execution history
            const executions = await this.getWorkflowExecutions(workflow.id);
            
            if (executions && executions.length > 0) {
                usage.executionCount = executions.length;
                usage.lastExecuted = executions[0].startedAt;
                
                // Calculate error rate
                const errorCount = executions.filter(e => e.status === 'error').length;
                usage.errorRate = (errorCount / executions.length) * 100;
                
                // Estimate usage based on patterns
                usage.estimatedUsage = this.estimateWorkflowUsage(executions);
            }
            
            // Analyze complexity
            usage.complexity = this.analyzeWorkflowComplexity(workflow);
            
            // Find dependencies
            usage.dependencies = this.findWorkflowDependencies(workflow);
            
        } catch (error) {
            console.warn(`⚠️ Could not analyze workflow ${workflow.name}:`, error.message);
        }

        return usage;
    }

    /**
     * Get execution history for a workflow
     */
    async getWorkflowExecutions(workflowId) {
        try {
            const response = await fetch(`${this.n8nBaseUrl}/api/v1/workflows/${workflowId}/executions`, {
                headers: {
                    'X-N8N-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return [];
            }

            const executions = await response.json();
            return executions.data || executions || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Estimate workflow usage based on execution patterns
     */
    estimateWorkflowUsage(executions) {
        if (executions.length === 0) return 'unused';
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const recentExecutions = executions.filter(e => new Date(e.startedAt) > oneWeekAgo);
        const monthlyExecutions = executions.filter(e => new Date(e.startedAt) > oneMonthAgo);
        
        if (recentExecutions.length === 0) return 'inactive';
        if (recentExecutions.length >= 10) return 'high';
        if (monthlyExecutions.length >= 5) return 'medium';
        return 'low';
    }

    /**
     * Analyze workflow complexity
     */
    analyzeWorkflowComplexity(workflow) {
        if (!workflow.nodes || workflow.nodes.length === 0) {
            return 'unknown';
        }

        const nodeCount = workflow.nodes.length;
        const connectionCount = workflow.connections ? Object.keys(workflow.connections).length : 0;
        
        if (nodeCount > 20 || connectionCount > 30) return 'high';
        if (nodeCount > 10 || connectionCount > 15) return 'medium';
        return 'low';
    }

    /**
     * Find workflow dependencies
     */
    findWorkflowDependencies(workflow) {
        const dependencies = [];
        
        if (!workflow.nodes) return dependencies;
        
        // Look for HTTP Request nodes that might call other workflows
        workflow.nodes.forEach(node => {
            if (node.type === 'n8n-nodes-base.httpRequest') {
                const url = node.parameters?.url;
                if (url && url.includes('/webhook/')) {
                    dependencies.push({
                        type: 'webhook',
                        url: url,
                        nodeName: node.name
                    });
                }
            }
        });
        
        return dependencies;
    }

    /**
     * Generate cleanup recommendations
     */
    generateCleanupRecommendations() {
        console.log('🔍 Generating cleanup recommendations...');
        
        this.cleanupRecommendations = [];
        
        // Categorize workflows
        const unusedWorkflows = this.workflows.filter(w => 
            w.usage.estimatedUsage === 'unused' && w.active
        );
        
        const inactiveWorkflows = this.workflows.filter(w => 
            w.usage.estimatedUsage === 'inactive' && w.active
        );
        
        const highErrorWorkflows = this.workflows.filter(w => 
            w.usage.errorRate > 20 && w.active
        );
        
        const complexUnusedWorkflows = this.workflows.filter(w => 
            w.usage.estimatedUsage === 'unused' && 
            w.usage.complexity === 'high' && 
            w.active
        );

        // Generate recommendations
        if (unusedWorkflows.length > 0) {
            this.cleanupRecommendations.push({
                type: 'archive',
                priority: 'high',
                message: `Archive ${unusedWorkflows.length} unused workflows`,
                workflows: unusedWorkflows.map(w => ({
                    id: w.id,
                    name: w.name,
                    reason: 'No executions in recent history'
                }))
            });
        }

        if (inactiveWorkflows.length > 0) {
            this.cleanupRecommendations.push({
                type: 'archive',
                priority: 'medium',
                message: `Archive ${inactiveWorkflows.length} inactive workflows`,
                workflows: inactiveWorkflows.map(w => ({
                    id: w.id,
                    name: w.name,
                    reason: 'No recent executions'
                }))
            });
        }

        if (highErrorWorkflows.length > 0) {
            this.cleanupRecommendations.push({
                type: 'fix',
                priority: 'high',
                message: `Fix ${highErrorWorkflows.length} high-error workflows`,
                workflows: highErrorWorkflows.map(w => ({
                    id: w.id,
                    name: w.name,
                    errorRate: w.usage.errorRate,
                    reason: 'High error rate indicates issues'
                }))
            });
        }

        if (complexUnusedWorkflows.length > 0) {
            this.cleanupRecommendations.push({
                type: 'review',
                priority: 'medium',
                message: `Review ${complexUnusedWorkflows.length} complex unused workflows`,
                workflows: complexUnusedWorkflows.map(w => ({
                    id: w.id,
                    name: w.name,
                    complexity: w.usage.complexity,
                    reason: 'Complex but unused - may need investigation'
                }))
            });
        }

        console.log(`✅ Generated ${this.cleanupRecommendations.length} cleanup recommendations`);
    }

    /**
     * Display cleanup recommendations
     */
    displayCleanupRecommendations() {
        console.log('\n🎯 Cleanup Recommendations:');
        console.log('============================');
        
        if (this.cleanupRecommendations.length === 0) {
            console.log('✅ No cleanup actions recommended at this time');
            return;
        }

        this.cleanupRecommendations.forEach((rec, index) => {
            console.log(`\n${index + 1}. ${rec.type.toUpperCase()} - ${rec.priority.toUpperCase()} PRIORITY`);
            console.log(`   ${rec.message}`);
            
            rec.workflows.forEach(workflow => {
                console.log(`   • ${workflow.name} (ID: ${workflow.id})`);
                if (workflow.reason) {
                    console.log(`     Reason: ${workflow.reason}`);
                }
                if (workflow.errorRate) {
                    console.log(`     Error Rate: ${workflow.errorRate.toFixed(1)}%`);
                }
                if (workflow.complexity) {
                    console.log(`     Complexity: ${workflow.complexity}`);
                }
            });
        });
    }

    /**
     * Create backup of workflow before archiving
     */
    async createWorkflowBackup(workflow) {
        const backupDir = path.join(__dirname, 'backups');
        
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `${workflow.name}-${timestamp}.json`);
        
        const backupData = {
            workflow: workflow,
            backupTimestamp: new Date().toISOString(),
            originalId: workflow.id,
            backupReason: 'Cleanup archive'
        };
        
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
        console.log(`💾 Backup created: ${backupPath}`);
        
        return backupPath;
    }

    /**
     * Archive a workflow (deactivate it)
     */
    async archiveWorkflow(workflow, reason = 'Cleanup archive') {
        try {
            console.log(`📦 Archiving workflow: ${workflow.name}`);
            
            // Create backup first
            const backupPath = await this.createWorkflowBackup(workflow);
            
            // Deactivate the workflow
            const response = await fetch(`${this.n8nBaseUrl}/api/v1/workflows/${workflow.id}`, {
                method: 'PATCH',
                headers: {
                    'X-N8N-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    active: false,
                    meta: {
                        archived: true,
                        archivedAt: new Date().toISOString(),
                        archiveReason: reason,
                        backupPath: backupPath
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            this.archivedWorkflows.push({
                id: workflow.id,
                name: workflow.name,
                backupPath: backupPath,
                archivedAt: new Date().toISOString(),
                reason: reason
            });

            console.log(`✅ Successfully archived: ${workflow.name}`);
            return result;
            
        } catch (error) {
            console.error(`❌ Error archiving workflow ${workflow.name}:`, error.message);
            throw error;
        }
    }

    /**
     * Execute cleanup based on recommendations
     */
    async executeCleanup(interactive = true) {
        console.log('\n🚀 Executing cleanup operations...');
        
        if (this.cleanupRecommendations.length === 0) {
            console.log('✅ No cleanup actions to execute');
            return;
        }

        const archiveRecommendations = this.cleanupRecommendations.filter(r => r.type === 'archive');
        
        if (archiveRecommendations.length === 0) {
            console.log('✅ No workflows to archive');
            return;
        }

        console.log(`\n📦 Found ${archiveRecommendations.length} archive recommendations`);
        
        if (interactive) {
            console.log('\n⚠️  This will deactivate workflows. Continue? (y/N)');
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const answer = await new Promise(resolve => {
                rl.question('Continue? ', resolve);
            });
            rl.close();

            if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
                console.log('❌ Cleanup cancelled by user');
                return;
            }
        }

        // Execute archive operations
        for (const recommendation of archiveRecommendations) {
            console.log(`\n📦 Processing ${recommendation.type} recommendation: ${recommendation.message}`);
            
            for (const workflow of recommendation.workflows) {
                try {
                    const fullWorkflow = this.workflows.find(w => w.id === workflow.id);
                    if (fullWorkflow) {
                        await this.archiveWorkflow(fullWorkflow, recommendation.message);
                        await this.delay(1000); // Rate limiting
                    }
                } catch (error) {
                    console.error(`❌ Failed to archive workflow ${workflow.name}:`, error.message);
                }
            }
        }

        console.log(`\n✅ Cleanup completed. Archived ${this.archivedWorkflows.length} workflows`);
    }

    /**
     * Generate cleanup report
     */
    generateCleanupReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalWorkflows: this.workflows.length,
                activeWorkflows: this.workflows.filter(w => w.active).length,
                archivedWorkflows: this.archivedWorkflows.length,
                recommendations: this.cleanupRecommendations.length
            },
            recommendations: this.cleanupRecommendations,
            archivedWorkflows: this.archivedWorkflows,
            workflowAnalysis: this.workflows.map(w => ({
                id: w.id,
                name: w.name,
                active: w.active,
                usage: w.usage
            }))
        };

        return report;
    }

    /**
     * Save cleanup report to file
     */
    saveCleanupReport(report) {
        const reportPath = path.join(__dirname, `workflow-cleanup-report-${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📊 Cleanup report saved to: ${reportPath}`);
        return reportPath;
    }

    /**
     * Utility function for delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Run complete cleanup workflow
     */
    async runCompleteCleanup(interactive = true) {
        try {
            await this.initialize();
            
            this.displayCleanupRecommendations();
            
            if (interactive) {
                await this.executeCleanup(interactive);
            }
            
            const report = this.generateCleanupReport();
            const reportPath = this.saveCleanupReport(report);
            
            console.log('\n🎯 Cleanup Complete!');
            console.log(`📊 Report saved to: ${reportPath}`);
            
            return report;
        } catch (error) {
            console.error('❌ Cleanup manager error:', error.message);
            throw error;
        }
    }
}

// CLI interface
if (require.main === module) {
    const cleanupManager = new WorkflowCleanupManager();
    
    const args = process.argv.slice(2);
    const interactive = !args.includes('--non-interactive');
    
    cleanupManager.runCompleteCleanup(interactive)
        .then(() => {
            console.log('🚀 Cleanup manager completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Cleanup manager failed:', error.message);
            process.exit(1);
        });
}

module.exports = WorkflowCleanupManager;
