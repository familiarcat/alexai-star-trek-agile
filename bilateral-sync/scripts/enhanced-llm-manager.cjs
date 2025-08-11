#!/usr/bin/env node

/**
 * Enhanced LLM Manager for AlexAI Bilateral Sync System
 * Intelligently selects the optimal LLM based on task requirements, cost, and performance
 * 
 * Features:
 * - Multi-provider support (OpenAI, Anthropic, Google, Continue, BitO)
 * - Intelligent model selection based on task type
 * - Cost optimization and fallback strategies
 * - Performance tracking and adaptive selection
 * - Load balancing across providers
 */

const fs = require('fs');
const path = require('path');

class EnhancedLLMManager {
    constructor() {
        this.config = this.loadConfig();
        this.performanceMetrics = this.loadPerformanceMetrics();
        this.currentProvider = null;
        this.fallbackChain = [];
    }

    loadConfig() {
        try {
            const configPath = path.join(__dirname, '../config/llm-config.json');
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            console.log(`✅ Loaded LLM configuration v${config.version}`);
            return config;
        } catch (error) {
            console.error('❌ Failed to load LLM configuration:', error.message);
            process.exit(1);
        }
    }

    loadPerformanceMetrics() {
        try {
            const metricsPath = path.join(__dirname, '../evolution/llm-performance.json');
            if (fs.existsSync(metricsPath)) {
                return JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
            }
        } catch (error) {
            console.warn('⚠️ Could not load performance metrics, starting fresh');
        }
        
        return {
            providers: {},
            tasks: {},
            lastUpdated: new Date().toISOString()
        };
    }

    savePerformanceMetrics() {
        try {
            const metricsPath = path.join(__dirname, '../evolution/llm-performance.json');
            this.performanceMetrics.lastUpdated = new Date().toISOString();
            fs.writeFileSync(metricsPath, JSON.stringify(this.performanceMetrics, null, 2));
        } catch (error) {
            console.warn('⚠️ Could not save performance metrics:', error.message);
        }
    }

    selectOptimalLLM(taskType, complexity, urgency, costSensitivity = 'balanced') {
        console.log(`🎯 Selecting optimal LLM for task: ${taskType}`);
        console.log(`📊 Complexity: ${complexity}, Urgency: ${urgency}, Cost Sensitivity: ${costSensitivity}`);

        const availableProviders = this.getAvailableProviders();
        const scoredProviders = this.scoreProviders(availableProviders, taskType, complexity, urgency, costSensitivity);
        
        // Select primary provider
        const primaryProvider = scoredProviders[0];
        this.currentProvider = primaryProvider.name;
        
        // Build fallback chain
        this.fallbackChain = scoredProviders.slice(1, 4).map(p => p.name);
        
        console.log(`🚀 Selected primary LLM: ${primaryProvider.name} (${primaryProvider.provider})`);
        console.log(`🔄 Fallback chain: ${this.fallbackChain.join(' → ')}`);
        
        return {
            primary: primaryProvider,
            fallbacks: this.fallbackChain,
            reasoning: this.explainSelection(primaryProvider, scoredProviders, taskType)
        };
    }

    getAvailableProviders() {
        const providers = [];
        
        for (const [key, provider] of Object.entries(this.config.providers)) {
            if (this.validateProvider(provider)) {
                providers.push({
                    key,
                    ...provider
                });
            }
        }
        
        return providers;
    }

    validateProvider(provider) {
        const requiredEnvVars = {
            'openai': 'OPENAI_API_KEY',
            'anthropic': 'OPENROUTER_API_KEY',
            'google': 'GEMINI_API_KEY',
            'continue': 'CONTINUE_API_KEY',
            'bito': 'BITO_API_KEY'
        };
        
        const envVar = requiredEnvVars[provider.provider];
        if (!envVar || !process.env[envVar]) {
            return false;
        }
        
        return true;
    }

    scoreProviders(providers, taskType, complexity, urgency, costSensitivity) {
        const scored = providers.map(provider => {
            let score = 0;
            
            // Base capability score
            score += this.calculateCapabilityScore(provider, taskType);
            
            // Performance score
            score += this.calculatePerformanceScore(provider);
            
            // Cost optimization score
            score += this.calculateCostScore(provider, costSensitivity);
            
            // Urgency and complexity adjustments
            score += this.calculateTaskSpecificScore(provider, complexity, urgency);
            
            return { ...provider, score };
        });
        
        return scored.sort((a, b) => b.score - a.score);
    }

    calculateCapabilityScore(provider, taskType) {
        let score = 0;
        const capabilities = provider.capabilities;
        
        // Task-specific capability scoring
        switch (taskType) {
            case 'code_generation':
                if (capabilities.codeInterpreter) score += 30;
                if (capabilities.functionCalling) score += 20;
                break;
            case 'strategic_planning':
                if (capabilities.advancedReasoning) score += 30;
                if (capabilities.contextAwareness) score += 20;
                break;
            case 'creative_writing':
                if (capabilities.advancedReasoning) score += 25;
                score += 15; // Creative tasks don't need specific capabilities
                break;
            case 'technical_analysis':
                if (capabilities.functionCalling) score += 25;
                if (capabilities.advancedReasoning) score += 20;
                break;
            default:
                score += 20; // Base score for general tasks
        }
        
        // Provider status bonus
        if (provider.status === 'premium') score += 15;
        if (provider.status === 'specialized') score += 10;
        if (provider.status === 'cost_effective') score += 20; // Bonus for cost-effective providers
        
        return score;
    }

    calculatePerformanceScore(provider) {
        const metrics = this.performanceMetrics.providers[provider.key];
        if (!metrics) return 10; // Default score for new providers
        
        let score = 10;
        
        // Response time scoring (lower is better)
        if (metrics.avgResponseTime) {
            if (metrics.avgResponseTime < 2000) score += 20;
            else if (metrics.avgResponseTime < 5000) score += 15;
            else if (metrics.avgResponseTime < 10000) score += 10;
        }
        
        // Success rate scoring
        if (metrics.successRate) {
            score += Math.floor(metrics.successRate * 20);
        }
        
        // Recent performance bonus
        if (metrics.lastUsed) {
            const hoursSinceLastUse = (Date.now() - new Date(metrics.lastUsed).getTime()) / (1000 * 60 * 60);
            if (hoursSinceLastUse < 1) score += 5; // Recent usage bonus
        }
        
        return score;
    }

    calculateCostScore(provider, costSensitivity) {
        let score = 0;
        const costPer1K = provider.costPer1K || 0.01;
        
        switch (costSensitivity) {
            case 'cost_conscious':
                if (costPer1K < 0.001) score += 25;
                else if (costPer1K < 0.005) score += 20;
                else if (costPer1K < 0.01) score += 15;
                break;
            case 'balanced':
                if (costPer1K < 0.005) score += 20;
                else if (costPer1K < 0.02) score += 15;
                else if (costPer1K < 0.05) score += 10;
                break;
            case 'performance_focused':
                score += 15; // Less emphasis on cost
                break;
        }
        
        return score;
    }

    calculateTaskSpecificScore(provider, complexity, urgency) {
        let score = 0;
        
        // Complexity adjustments
        if (complexity === 'high' && provider.maxTokens >= 4000) score += 15;
        if (complexity === 'medium' && provider.maxTokens >= 2000) score += 10;
        
        // Urgency adjustments
        if (urgency === 'high') {
            const metrics = this.performanceMetrics.providers[provider.key];
            if (metrics && metrics.avgResponseTime < 3000) score += 10;
        }
        
        return score;
    }

    explainSelection(selectedProvider, allProviders, taskType) {
        const reasons = [];
        
        reasons.push(`Selected ${selectedProvider.name} for ${taskType}`);
        
        if (selectedProvider.capabilities.codeInterpreter && taskType === 'code_generation') {
            reasons.push('Has code interpreter capabilities');
        }
        
        if (selectedProvider.capabilities.advancedReasoning && taskType === 'strategic_planning') {
            reasons.push('Excels at advanced reasoning');
        }
        
        if (selectedProvider.status === 'premium') {
            reasons.push('Premium model for high-quality results');
        }
        
        const costRank = allProviders.findIndex(p => p.name === selectedProvider.name) + 1;
        if (costRank <= 3) {
            reasons.push(`Top ${costRank} cost-effective option`);
        }
        
        return reasons.join('. ');
    }

    async executeTask(task, content, options = {}) {
        const {
            taskType = 'general',
            complexity = 'medium',
            urgency = 'normal',
            costSensitivity = 'balanced',
            maxRetries = 2
        } = options;
        
        const selection = this.selectOptimalLLM(taskType, complexity, urgency, costSensitivity);
        let attempts = 0;
        
        while (attempts <= maxRetries) {
            const provider = attempts === 0 ? selection.primary : 
                           this.config.providers[selection.fallbacks[attempts - 1]];
            
            if (!provider) {
                console.error('❌ No more fallback providers available');
                break;
            }
            
            try {
                console.log(`🔄 Attempt ${attempts + 1}: Using ${provider.name}`);
                const result = await this.callProvider(provider, task, content);
                
                // Record successful execution
                this.recordExecution(provider.key, true, Date.now());
                
                return {
                    success: true,
                    provider: provider.name,
                    result,
                    attempts: attempts + 1,
                    fallbackUsed: attempts > 0
                };
                
            } catch (error) {
                console.warn(`⚠️ Attempt ${attempts + 1} failed with ${provider.name}:`, error.message);
                
                // Record failed execution
                this.recordExecution(provider.key, false, Date.now());
                
                attempts++;
            }
        }
        
        throw new Error(`All LLM providers failed after ${maxRetries + 1} attempts`);
    }

    async callProvider(provider, task, content) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            // This is a simplified implementation - in practice, you'd implement
            // the actual API calls to each provider
            const mockResponse = `Response from ${provider.name}: ${task} - ${content.substring(0, 100)}...`;
            
            // Simulate API call delay
            setTimeout(() => {
                const responseTime = Date.now() - startTime;
                
                // Record performance metrics
                this.recordPerformance(provider.key, responseTime, true);
                
                resolve(mockResponse);
            }, Math.random() * 2000 + 500); // Random delay between 500ms and 2.5s
        });
    }

    recordExecution(providerKey, success, timestamp) {
        if (!this.performanceMetrics.providers[providerKey]) {
            this.performanceMetrics.providers[providerKey] = {
                totalCalls: 0,
                successfulCalls: 0,
                failedCalls: 0,
                avgResponseTime: 0,
                lastUsed: null
            };
        }
        
        const metrics = this.performanceMetrics.providers[providerKey];
        metrics.totalCalls++;
        metrics.lastUsed = new Date(timestamp).toISOString();
        
        if (success) {
            metrics.successfulCalls++;
        } else {
            metrics.failedCalls++;
        }
        
        metrics.successRate = metrics.successfulCalls / metrics.totalCalls;
    }

    recordPerformance(providerKey, responseTime, success) {
        if (!this.performanceMetrics.providers[providerKey]) {
            this.performanceMetrics.providers[providerKey] = {
                totalCalls: 0,
                successfulCalls: 0,
                failedCalls: 0,
                avgResponseTime: 0,
                lastUsed: null
            };
        }
        
        const metrics = this.performanceMetrics.providers[providerKey];
        
        // Update average response time
        if (metrics.avgResponseTime === 0) {
            metrics.avgResponseTime = responseTime;
        } else {
            metrics.avgResponseTime = (metrics.avgResponseTime + responseTime) / 2;
        }
    }

    getPerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {},
            recommendations: []
        };
        
        for (const [key, metrics] of Object.entries(this.performanceMetrics.providers)) {
            const provider = this.config.providers[key];
            if (!provider) continue;
            
            report.summary[key] = {
                name: provider.name,
                totalCalls: metrics.totalCalls,
                successRate: metrics.successRate,
                avgResponseTime: metrics.avgResponseTime,
                costPer1K: provider.costPer1K
            };
            
            // Generate recommendations
            if (metrics.successRate < 0.8) {
                report.recommendations.push(`Consider reducing usage of ${provider.name} due to low success rate (${(metrics.successRate * 100).toFixed(1)}%)`);
            }
            
            if (metrics.avgResponseTime > 10000) {
                report.recommendations.push(`${provider.name} has slow response times (${metrics.avgResponseTime}ms) - consider for non-urgent tasks only`);
            }
        }
        
        return report;
    }

    async cleanup() {
        this.savePerformanceMetrics();
        console.log('✅ Performance metrics saved');
    }
}

// CLI interface
if (require.main === module) {
    const manager = new EnhancedLLMManager();
    
    const command = process.argv[2];
    const args = process.argv.slice(3);
    
    switch (command) {
        case 'select':
            const taskType = args[0] || 'general';
            const complexity = args[1] || 'medium';
            const urgency = args[2] || 'normal';
            const costSensitivity = args[3] || 'balanced';
            
            const selection = manager.selectOptimalLLM(taskType, complexity, urgency, costSensitivity);
            console.log('\n🎯 LLM Selection Results:');
            console.log(JSON.stringify(selection, null, 2));
            break;
            
        case 'execute':
            const task = args[0] || 'Test task';
            const content = args[1] || 'Test content';
            const executeTaskType = args[2] || 'general';
            
            manager.executeTask(task, content, { taskType: executeTaskType })
                .then(result => {
                    console.log('\n✅ Task Execution Result:');
                    console.log(JSON.stringify(result, null, 2));
                })
                .catch(error => {
                    console.error('❌ Task execution failed:', error.message);
                });
            break;
            
        case 'performance':
            const report = manager.getPerformanceReport();
            console.log('\n📊 Performance Report:');
            console.log(JSON.stringify(report, null, 2));
            break;
            
        case 'providers':
            const providers = manager.getAvailableProviders();
            console.log('\n🔌 Available Providers:');
            providers.forEach(p => {
                console.log(`- ${p.name} (${p.provider}): ${p.status} - $${p.costPer1K}/1K tokens`);
            });
            break;
            
        default:
            console.log(`
🎯 Enhanced LLM Manager for AlexAI

Usage:
  node enhanced-llm-manager.js <command> [args...]

Commands:
  select <taskType> [complexity] [urgency] [costSensitivity]  - Select optimal LLM
  execute <task> [content] [taskType]                         - Execute task with optimal LLM
  performance                                                  - Show performance report
  providers                                                   - List available providers

Examples:
  node enhanced-llm-manager.js select code_generation high urgent cost_conscious
  node enhanced-llm-manager.js execute "Generate React component" "Create a button component" code_generation
  node enhanced-llm-manager.js performance
            `);
    }
    
    // Cleanup
    manager.cleanup();
}

module.exports = EnhancedLLMManager;
