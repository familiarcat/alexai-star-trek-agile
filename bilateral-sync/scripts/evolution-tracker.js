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
