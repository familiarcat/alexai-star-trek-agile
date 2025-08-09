#!/usr/bin/env node

/**
 * 🧠 N8N Workflow Structure Analyzer
 * Analyzes the current n8n workflow for optimization and future expansion
 */

const fs = require('fs').promises;
const path = require('path');

class WorkflowAnalyzer {
    constructor() {
        this.snapshotDir = 'bilateral-sync/snapshots/n8n';
    }

    async getLatestSnapshot() {
        const files = await fs.readdir(this.snapshotDir);
        const jsonFiles = files.filter(f => f.endsWith('.json')).sort().reverse();
        
        if (jsonFiles.length === 0) {
            throw new Error('No n8n snapshots found');
        }
        
        const latestFile = path.join(this.snapshotDir, jsonFiles[0]);
        const content = await fs.readFile(latestFile, 'utf8');
        return JSON.parse(content);
    }

    async analyzeWorkflowStructure() {
        console.log('🧠 N8N WORKFLOW STRUCTURE ANALYSIS');
        console.log('==================================');
        console.log('');
        
        const workflows = await this.getLatestSnapshot();
        
        // Find AlexAI workflow
        const alexaiWorkflow = workflows.find(w => 
            w.name && w.name.toLowerCase().includes('alexai') || 
            w.name && w.name.toLowerCase().includes('crew')
        );
        
        if (!alexaiWorkflow) {
            console.log('❌ AlexAI workflow not found');
            return;
        }
        
        console.log(`📋 Analyzing: ${alexaiWorkflow.name}`);
        console.log(`🕐 Last updated: ${alexaiWorkflow.updatedAt}`);
        console.log(`⚡ Status: ${alexaiWorkflow.active ? 'ACTIVE' : 'INACTIVE'}`);
        console.log('');
        
        // Analyze nodes
        this.analyzeNodes(alexaiWorkflow.nodes);
        
        // Analyze connections
        this.analyzeConnections(alexaiWorkflow.connections);
        
        // Generate optimization recommendations
        this.generateOptimizationRecommendations(alexaiWorkflow);
        
        // Suggest future expansion opportunities
        this.suggestExpansionOpportunities(alexaiWorkflow);
        
        return alexaiWorkflow;
    }

    analyzeNodes(nodes) {
        console.log('🔍 NODE STRUCTURE ANALYSIS');
        console.log('=========================');
        console.log('');
        
        const nodeTypes = {};
        const nodeFlow = [];
        
        nodes.forEach((node, index) => {
            const type = node.type || 'unknown';
            nodeTypes[type] = (nodeTypes[type] || 0) + 1;
            
            nodeFlow.push({
                id: node.id,
                name: node.name,
                type: type.replace('n8n-nodes-base.', ''),
                position: node.position
            });
        });
        
        console.log('📊 Node Types Distribution:');
        Object.entries(nodeTypes).forEach(([type, count]) => {
            console.log(`   ${type.replace('n8n-nodes-base.', '')}: ${count}`);
        });
        console.log('');
        
        console.log('🔄 Workflow Flow:');
        nodeFlow
            .sort((a, b) => a.position[0] - b.position[0]) // Sort by X position
            .forEach((node, index) => {
                console.log(`   ${index + 1}. ${node.name} (${node.type})`);
            });
        console.log('');
        
        return { nodeTypes, nodeFlow };
    }

    analyzeConnections(connections) {
        console.log('🔗 CONNECTION ANALYSIS');
        console.log('======================');
        console.log('');
        
        if (!connections) {
            console.log('⚠️ No connections found - workflow may be incomplete');
            return;
        }
        
        const connectionCount = Object.keys(connections).length;
        console.log(`📊 Total connections: ${connectionCount}`);
        
        // Analyze connection patterns
        Object.entries(connections).forEach(([nodeId, nodeConnections]) => {
            if (nodeConnections.main && nodeConnections.main[0]) {
                const outputs = nodeConnections.main[0].length;
                console.log(`   ${nodeId}: ${outputs} output(s)`);
            }
        });
        console.log('');
        
        return connections;
    }

    generateOptimizationRecommendations(workflow) {
        console.log('🚀 OPTIMIZATION RECOMMENDATIONS');
        console.log('===============================');
        console.log('');
        
        const recommendations = [];
        
        // Check for efficiency opportunities
        const nodes = workflow.nodes;
        const hasMultipleHttpNodes = nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest').length > 1;
        
        if (hasMultipleHttpNodes) {
            recommendations.push({
                type: 'efficiency',
                issue: 'Multiple HTTP Request nodes detected',
                solution: 'Consider consolidating API calls or using a single HTTP node with dynamic URLs',
                impact: 'Reduces latency and improves performance'
            });
        }
        
        // Check for error handling
        const hasErrorHandling = nodes.some(n => n.name && n.name.toLowerCase().includes('error'));
        if (!hasErrorHandling) {
            recommendations.push({
                type: 'reliability',
                issue: 'No explicit error handling detected',
                solution: 'Add error handling nodes for robust operation',
                impact: 'Improves workflow reliability and debugging'
            });
        }
        
        // Check for response formatting
        const hasResponseFormatter = nodes.some(n => n.name && n.name.toLowerCase().includes('format'));
        if (!hasResponseFormatter) {
            recommendations.push({
                type: 'structure',
                issue: 'Response formatting may be embedded in other nodes',
                solution: 'Extract response formatting to dedicated node for reusability',
                impact: 'Improves maintainability and allows format customization'
            });
        }
        
        // Check for crew routing efficiency
        const hasCrewRouter = nodes.some(n => n.name && n.name.toLowerCase().includes('router'));
        if (hasCrewRouter) {
            recommendations.push({
                type: 'optimization',
                issue: 'Crew Router implementation style',
                solution: 'Consider consolidating crew logic in router vs separate nodes',
                impact: 'Determines scalability for future crew members'
            });
        }
        
        recommendations.forEach((rec, index) => {
            console.log(`${index + 1}. 🔧 ${rec.type.toUpperCase()}: ${rec.issue}`);
            console.log(`   💡 Solution: ${rec.solution}`);
            console.log(`   📈 Impact: ${rec.impact}`);
            console.log('');
        });
        
        return recommendations;
    }

    suggestExpansionOpportunities(workflow) {
        console.log('🌟 FUTURE EXPANSION OPPORTUNITIES');
        console.log('=================================');
        console.log('');
        
        const expansions = [
            {
                category: 'Advanced AI Integration',
                opportunities: [
                    'Multi-model AI coordination (GPT-4, Claude, Gemini)',
                    'Context-aware model selection based on query type',
                    'AI agent memory and learning persistence',
                    'Dynamic persona adaptation based on user preferences'
                ]
            },
            {
                category: 'Workflow Intelligence',
                opportunities: [
                    'Self-optimizing workflow routing',
                    'Performance analytics and auto-tuning',
                    'Predictive crew member selection',
                    'Workflow versioning and A/B testing'
                ]
            },
            {
                category: 'Integration Expansion',
                opportunities: [
                    'Multi-platform deployment (Slack, Discord, Teams)',
                    'Database integration for persistent conversations',
                    'Real-time collaboration features',
                    'External API integrations (GitHub, Jira, etc.)'
                ]
            },
            {
                category: 'Enterprise Features',
                opportunities: [
                    'Role-based access control',
                    'Audit logging and compliance',
                    'Multi-tenant support',
                    'Advanced analytics and reporting'
                ]
            }
        ];
        
        expansions.forEach(category => {
            console.log(`🎯 ${category.category}:`);
            category.opportunities.forEach(opp => {
                console.log(`   • ${opp}`);
            });
            console.log('');
        });
        
        return expansions;
    }

    async generateOptimizedWorkflow(originalWorkflow) {
        console.log('🛠️ GENERATING OPTIMIZED WORKFLOW DESIGN');
        console.log('======================================');
        console.log('');
        
        const optimizedDesign = {
            name: "AlexAI Advanced Crew Coordination",
            description: "Optimized and future-ready workflow architecture",
            nodes: [
                {
                    name: "Crew Request Webhook",
                    type: "webhook",
                    purpose: "Entry point for all crew requests",
                    enhancements: ["Request validation", "Rate limiting", "Authentication"]
                },
                {
                    name: "Request Preprocessor",
                    type: "function",
                    purpose: "Standardize and enrich incoming requests",
                    enhancements: ["Context extraction", "User profiling", "Query classification"]
                },
                {
                    name: "AI Crew Intelligence Hub",
                    type: "function",
                    purpose: "Central routing and crew selection logic",
                    enhancements: ["Multi-model coordination", "Performance tracking", "Learning adaptation"]
                },
                {
                    name: "Dynamic Crew Router",
                    type: "switch",
                    purpose: "Route to appropriate crew member or team",
                    enhancements: ["Load balancing", "Fallback strategies", "Team coordination"]
                },
                {
                    name: "Crew Member Nodes",
                    type: "multiple",
                    purpose: "Individual crew member implementations",
                    enhancements: ["Persona consistency", "Memory integration", "Learning feedback"]
                },
                {
                    name: "Response Synthesizer",
                    type: "function",
                    purpose: "Combine and optimize responses",
                    enhancements: ["Multi-agent fusion", "Quality scoring", "Format adaptation"]
                },
                {
                    name: "Learning Feedback Loop",
                    type: "function",
                    purpose: "Capture and process learning signals",
                    enhancements: ["Performance metrics", "User satisfaction", "Adaptation triggers"]
                },
                {
                    name: "Response Delivery",
                    type: "webhook-response",
                    purpose: "Deliver optimized response to user",
                    enhancements: ["Format customization", "Delivery confirmation", "Follow-up scheduling"]
                }
            ]
        };
        
        console.log('🎯 Optimized Architecture:');
        optimizedDesign.nodes.forEach((node, index) => {
            console.log(`${index + 1}. ${node.name} (${node.type})`);
            console.log(`   Purpose: ${node.purpose}`);
            console.log(`   Enhancements: ${node.enhancements.join(', ')}`);
            console.log('');
        });
        
        return optimizedDesign;
    }
}

// CLI execution
async function main() {
    try {
        const analyzer = new WorkflowAnalyzer();
        
        console.log('🚀 Starting N8N Workflow Analysis...');
        console.log('');
        
        const workflow = await analyzer.analyzeWorkflowStructure();
        
        console.log('');
        const optimizedDesign = await analyzer.generateOptimizedWorkflow(workflow);
        
        console.log('');
        console.log('🎊 ANALYSIS COMPLETE');
        console.log('===================');
        console.log('✅ Current workflow analyzed');
        console.log('✅ Optimization opportunities identified');
        console.log('✅ Future expansion roadmap generated');
        console.log('✅ Optimized architecture designed');
        console.log('');
        console.log('🎯 Ready for workflow optimization and expansion!');
        
    } catch (error) {
        console.error('❌ Analysis failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = WorkflowAnalyzer;
