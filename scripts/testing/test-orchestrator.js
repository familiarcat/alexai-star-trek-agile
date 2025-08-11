#!/usr/bin/env node

/**
 * N8N Workflow Test Orchestrator
 * 
 * This script orchestrates the complete workflow testing and cleanup process:
 * 1. Runs comprehensive workflow testing
 * 2. Analyzes results and generates recommendations
 * 3. Manages workflow cleanup and archiving
 * 4. Provides unified reporting and management
 */

const fs = require('fs');
const path = require('path');
const WorkflowTestingSystem = require('./workflow-testing-system');
const WorkflowCleanupManager = require('./workflow-cleanup-manager');

class TestOrchestrator {
    constructor() {
        this.testingSystem = null;
        this.cleanupManager = null;
        this.testResults = null;
        this.cleanupResults = null;
        this.orchestrationReport = null;
    }

    /**
     * Initialize the orchestrator
     */
    async initialize() {
        console.log('🎭 Initializing N8N Workflow Test Orchestrator...');
        
        try {
            this.testingSystem = new WorkflowTestingSystem();
            this.cleanupManager = new WorkflowCleanupManager();
            
            console.log('✅ Orchestrator initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing orchestrator:', error.message);
            throw error;
        }
    }

    /**
     * Run complete testing workflow
     */
    async runCompleteTesting() {
        console.log('\n🧪 Running complete workflow testing...');
        
        try {
            this.testResults = await this.testingSystem.runCompleteTest();
            console.log('✅ Complete testing workflow finished');
            return this.testResults;
        } catch (error) {
            console.error('❌ Error in complete testing workflow:', error.message);
            throw error;
        }
    }

    /**
     * Run workflow cleanup analysis
     */
    async runCleanupAnalysis() {
        console.log('\n🧹 Running workflow cleanup analysis...');
        
        try {
            this.cleanupResults = await this.cleanupManager.runCompleteCleanup(false); // Non-interactive
            console.log('✅ Cleanup analysis completed');
            return this.cleanupResults;
        } catch (error) {
            console.error('❌ Error in cleanup analysis:', error.message);
            throw error;
        }
    }

    /**
     * Generate comprehensive orchestration report
     */
    generateOrchestrationReport() {
        console.log('\n📊 Generating comprehensive orchestration report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                testingCompleted: !!this.testResults,
                cleanupAnalyzed: !!this.cleanupResults,
                totalWorkflows: 0,
                activeWorkflows: 0,
                archivedWorkflows: 0,
                testSuccessRate: 0,
                recommendationsCount: 0
            },
            testing: this.testResults || null,
            cleanup: this.cleanupResults || null,
            orchestration: {
                recommendations: this.generateOrchestrationRecommendations(),
                nextSteps: this.generateNextSteps(),
                riskAssessment: this.generateRiskAssessment()
            }
        };

        // Populate summary data
        if (this.testResults) {
            report.summary.totalWorkflows = this.testResults.summary?.totalWorkflows || 0;
            report.summary.testSuccessRate = this.testResults.summary?.successRate || 0;
        }

        if (this.cleanupResults) {
            report.summary.activeWorkflows = this.cleanupResults.summary?.activeWorkflows || 0;
            report.summary.archivedWorkflows = this.cleanupResults.summary?.archivedWorkflows || 0;
        }

        if (this.cleanupResults?.recommendations) {
            report.summary.recommendationsCount = this.cleanupResults.recommendations.length;
        }

        this.orchestrationReport = report;
        return report;
    }

    /**
     * Generate orchestration recommendations
     */
    generateOrchestrationRecommendations() {
        const recommendations = [];
        
        if (!this.testResults && !this.cleanupResults) {
            recommendations.push({
                type: 'error',
                message: 'No testing or cleanup data available',
                priority: 'high'
            });
            return recommendations;
        }

        // Testing-based recommendations
        if (this.testResults) {
            if (this.testResults.summary?.successRate < 80) {
                recommendations.push({
                    type: 'fix',
                    message: `Low test success rate (${this.testResults.summary.successRate.toFixed(1)}%) - investigate failed workflows`,
                    priority: 'high'
                });
            }

            if (this.testResults.recommendations?.length > 0) {
                recommendations.push({
                    type: 'review',
                    message: `${this.testResults.recommendations.length} testing recommendations available for review`,
                    priority: 'medium'
                });
            }
        }

        // Cleanup-based recommendations
        if (this.cleanupResults) {
            const archiveRecommendations = this.cleanupResults.recommendations?.filter(r => r.type === 'archive') || [];
            const fixRecommendations = this.cleanupResults.recommendations?.filter(r => r.type === 'fix') || [];

            if (archiveRecommendations.length > 0) {
                recommendations.push({
                    type: 'archive',
                    message: `${archiveRecommendations.length} workflows recommended for archiving`,
                    priority: 'medium',
                    details: archiveRecommendations
                });
            }

            if (fixRecommendations.length > 0) {
                recommendations.push({
                    type: 'fix',
                    message: `${fixRecommendations.length} workflows need attention due to high error rates`,
                    priority: 'high',
                    details: fixRecommendations
                });
            }
        }

        return recommendations;
    }

    /**
     * Generate next steps
     */
    generateNextSteps() {
        const nextSteps = [];
        
        if (!this.testResults && !this.cleanupResults) {
            nextSteps.push('Run complete testing workflow to gather data');
            nextSteps.push('Run cleanup analysis to identify optimization opportunities');
            return nextSteps;
        }

        // Testing next steps
        if (this.testResults) {
            if (this.testResults.summary?.successRate < 100) {
                nextSteps.push('Investigate and fix failed workflow tests');
                nextSteps.push('Review error logs for problematic workflows');
            }
            
            if (this.testResults.recommendations?.length > 0) {
                nextSteps.push('Review and implement testing recommendations');
            }
        }

        // Cleanup next steps
        if (this.cleanupResults) {
            const archiveRecommendations = this.cleanupResults.recommendations?.filter(r => r.type === 'archive') || [];
            const fixRecommendations = this.cleanupResults.recommendations?.filter(r => r.type === 'fix') || [];

            if (archiveRecommendations.length > 0) {
                nextSteps.push('Review archive recommendations and execute cleanup');
            }

            if (fixRecommendations.length > 0) {
                nextSteps.push('Prioritize fixing high-error workflows');
                nextSteps.push('Implement error handling improvements');
            }
        }

        // General next steps
        nextSteps.push('Schedule regular testing runs (weekly recommended)');
        nextSteps.push('Monitor workflow performance metrics');
        nextSteps.push('Update mock data registry as workflows evolve');

        return nextSteps;
    }

    /**
     * Generate risk assessment
     */
    generateRiskAssessment() {
        const risks = [];
        
        if (!this.testResults && !this.cleanupResults) {
            risks.push({
                level: 'high',
                message: 'No testing data available - unknown system health',
                impact: 'Unable to assess workflow reliability'
            });
            return risks;
        }

        // Testing-based risks
        if (this.testResults) {
            if (this.testResults.summary?.successRate < 70) {
                risks.push({
                    level: 'high',
                    message: 'Low test success rate indicates system instability',
                    impact: 'Production workflows may fail unexpectedly'
                });
            } else if (this.testResults.summary?.successRate < 90) {
                risks.push({
                    level: 'medium',
                    message: 'Moderate test success rate suggests some workflows need attention',
                    impact: 'Some workflows may have intermittent issues'
                });
            }
        }

        // Cleanup-based risks
        if (this.cleanupResults) {
            const highErrorWorkflows = this.cleanupResults.recommendations?.filter(r => r.type === 'fix') || [];
            
            if (highErrorWorkflows.length > 0) {
                risks.push({
                    level: 'medium',
                    message: `${highErrorWorkflows.length} workflows have high error rates`,
                    impact: 'These workflows may be unreliable in production'
                });
            }

            const complexUnusedWorkflows = this.cleanupResults.recommendations?.filter(r => 
                r.type === 'review' && r.workflows?.some(w => w.complexity === 'high')
            ) || [];

            if (complexUnusedWorkflows.length > 0) {
                risks.push({
                    level: 'low',
                    message: 'Complex unused workflows may indicate technical debt',
                    impact: 'Maintenance overhead and potential confusion'
                });
            }
        }

        return risks;
    }

    /**
     * Save orchestration report
     */
    saveOrchestrationReport(report) {
        const reportPath = path.join(__dirname, `orchestration-report-${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📊 Orchestration report saved to: ${reportPath}`);
        return reportPath;
    }

    /**
     * Display orchestration summary
     */
    displayOrchestrationSummary() {
        if (!this.orchestrationReport) {
            console.log('❌ No orchestration report available');
            return;
        }

        const report = this.orchestrationReport;
        
        console.log('\n🎭 N8N Workflow Test Orchestration Summary');
        console.log('==========================================');
        console.log(`📅 Timestamp: ${new Date(report.timestamp).toLocaleString()}`);
        console.log(`🧪 Testing Completed: ${report.summary.testingCompleted ? '✅' : '❌'}`);
        console.log(`🧹 Cleanup Analyzed: ${report.summary.cleanupAnalyzed ? '✅' : '❌'}`);
        console.log(`📊 Total Workflows: ${report.summary.totalWorkflows}`);
        console.log(`✅ Test Success Rate: ${report.summary.testSuccessRate.toFixed(1)}%`);
        console.log(`📋 Recommendations: ${report.summary.recommendationsCount}`);

        // Display key recommendations
        if (report.orchestration.recommendations.length > 0) {
            console.log('\n🎯 Key Recommendations:');
            report.orchestration.recommendations.forEach((rec, index) => {
                console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
            });
        }

        // Display next steps
        if (report.orchestration.nextSteps.length > 0) {
            console.log('\n➡️  Next Steps:');
            report.orchestration.nextSteps.forEach((step, index) => {
                console.log(`   ${index + 1}. ${step}`);
            });
        }

        // Display risk assessment
        if (report.orchestration.riskAssessment.length > 0) {
            console.log('\n⚠️  Risk Assessment:');
            report.orchestration.riskAssessment.forEach((risk, index) => {
                const levelIcon = risk.level === 'high' ? '🔴' : risk.level === 'medium' ? '🟡' : '🟢';
                console.log(`   ${index + 1}. ${levelIcon} [${risk.level.toUpperCase()}] ${risk.message}`);
            });
        }
    }

    /**
     * Run complete orchestration workflow
     */
    async runCompleteOrchestration(options = {}) {
        const {
            runTesting = true,
            runCleanup = true,
            interactive = false,
            saveReports = true
        } = options;

        try {
            console.log('🚀 Starting complete N8N workflow test orchestration...');
            
            await this.initialize();
            
            // Run testing if requested
            if (runTesting) {
                await this.runCompleteTesting();
            }
            
            // Run cleanup analysis if requested
            if (runCleanup) {
                await this.runCleanupAnalysis();
            }
            
            // Generate comprehensive report
            const report = this.generateOrchestrationReport();
            
            // Save report if requested
            if (saveReports) {
                this.saveOrchestrationReport(report);
            }
            
            // Display summary
            this.displayOrchestrationSummary();
            
            console.log('\n🎯 Orchestration Complete!');
            return report;
            
        } catch (error) {
            console.error('❌ Orchestration failed:', error.message);
            throw error;
        }
    }

    /**
     * Run specific orchestration phase
     */
    async runPhase(phase, options = {}) {
        switch (phase.toLowerCase()) {
            case 'testing':
                return await this.runCompleteTesting();
            case 'cleanup':
                return await this.runCleanupAnalysis();
            case 'analysis':
                await this.runCompleteTesting();
                await this.runCleanupAnalysis();
                return this.generateOrchestrationReport();
            default:
                throw new Error(`Unknown phase: ${phase}`);
        }
    }
}

// CLI interface
if (require.main === module) {
    const orchestrator = new TestOrchestrator();
    
    const args = process.argv.slice(2);
    const command = args[0] || 'complete';
    const options = {
        runTesting: !args.includes('--no-testing'),
        runCleanup: !args.includes('--no-cleanup'),
        interactive: args.includes('--interactive'),
        saveReports: !args.includes('--no-save')
    };

    console.log(`🎭 N8N Workflow Test Orchestrator - Command: ${command}`);
    console.log(`Options:`, options);

    if (command === 'complete') {
        orchestrator.runCompleteOrchestration(options)
            .then(() => {
                console.log('🚀 Orchestrator completed successfully');
                process.exit(0);
            })
            .catch((error) => {
                console.error('💥 Orchestrator failed:', error.message);
                process.exit(1);
            });
    } else if (command === 'phase') {
        const phase = args[1];
        if (!phase) {
            console.error('❌ Phase command requires a phase name (testing, cleanup, analysis)');
            process.exit(1);
        }
        
        orchestrator.runPhase(phase, options)
            .then(() => {
                console.log(`🚀 Phase '${phase}' completed successfully`);
                process.exit(0);
            })
            .catch((error) => {
                console.error(`💥 Phase '${phase}' failed:`, error.message);
                process.exit(1);
            });
    } else {
        console.error('❌ Unknown command. Use: complete, phase <phase-name>');
        process.exit(1);
    }
}

module.exports = TestOrchestrator;
