#!/usr/bin/env node

/**
 * 🚀 Enhanced ChatGPT 5 Prompt Manager
 * Integrates with Bilateral Sync System for intelligent prompting
 * Leverages the newest ChatGPT 5 capabilities for advanced AI interactions
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const readline = require('readline');

class ChatGPT5EnhancedPromptManager {
    constructor() {
        this.configPath = path.join(__dirname, '../config.json');
        this.config = null;
        this.llmConfig = null;
        this.syncManager = null;
        this.promptHistory = [];
        this.maxHistorySize = 100;
        
        // ChatGPT 5 specific configurations
        this.chatgpt5Config = {
            provider: 'openai',
            model: 'gpt-5',
            baseUrl: 'https://api.openai.com/v1',
            apiKey: process.env.OPENAI_API_KEY,
            maxTokens: 4000,
            temperature: 0.3,
            systemPrompt: this.getSystemPrompt(),
            advancedFeatures: {
                functionCalling: true,
                vision: true,
                codeInterpreter: true,
                retrieval: true
            }
        };
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    getSystemPrompt() {
        return `You are the Ship's Computer from Star Trek: The Next Generation, enhanced with ChatGPT 5 capabilities.

Your role is to:
1. Analyze user requests with exceptional intelligence and context awareness
2. Provide strategic insights using advanced reasoning capabilities
3. Coordinate with the AlexAI crew system for optimal responses
4. Leverage ChatGPT 5's advanced features for superior problem-solving
5. Maintain the authentic Star Trek LCARS interface personality

You have access to:
- Advanced reasoning and analysis
- Code interpretation and generation
- Visual understanding capabilities
- Retrieval-augmented knowledge
- Function calling for system integration

Always respond in character as the Ship's Computer, but with enhanced ChatGPT 5 intelligence.`;
    }

    async loadConfig() {
        try {
            const configData = await fs.readFile(this.configPath, 'utf8');
            this.config = JSON.parse(configData);
            
            // Load LLM configuration
            await this.loadLLMConfig();
            
            return true;
        } catch (error) {
            console.error('❌ Failed to load config:', error.message);
            return false;
        }
    }

    async loadLLMConfig() {
        try {
            const llmConfigPath = path.join(__dirname, '../config/llm-config.json');
            const llmData = await fs.readFile(llmConfigPath, 'utf8');
            this.llmConfig = JSON.parse(llmData);
            
            // Override with ChatGPT 5 if available
            if (process.env.OPENAI_API_KEY) {
                this.llmConfig.chatgpt5 = this.chatgpt5Config;
            }
            
            console.log('✅ LLM configuration loaded');
        } catch (error) {
            console.log('⚠️ Using default LLM configuration');
            this.llmConfig = {
                default: 'claude',
                providers: {
                    claude: {
                        model: 'anthropic/claude-3.5-sonnet',
                        baseUrl: 'https://openrouter.ai/api/v1',
                        apiKey: process.env.OPENROUTER_API_KEY,
                        maxTokens: 2000
                    },
                    chatgpt5: this.chatgpt5Config
                }
            };
        }
    }

    async promptChatGPT5(userQuery, context = {}) {
        if (!this.llmConfig.chatgpt5?.apiKey) {
            throw new Error('ChatGPT 5 API key not configured');
        }

        console.log('🧠 Prompting ChatGPT 5...');
        console.log(`📝 Query: ${userQuery}`);
        console.log(`🔧 Context: ${JSON.stringify(context)}`);

        const messages = [
            {
                role: 'system',
                content: this.chatgpt5Config.systemPrompt
            },
            {
                role: 'user',
                content: this.formatUserPrompt(userQuery, context)
            }
        ];

        // Add conversation history if available
        if (this.promptHistory.length > 0) {
            const recentHistory = this.promptHistory.slice(-5);
            messages.unshift(...recentHistory.map(h => ({
                role: h.role,
                content: h.content
            })));
        }

        const requestBody = {
            model: this.chatgpt5Config.model,
            messages: messages,
            max_tokens: this.chatgpt5Config.maxTokens,
            temperature: this.chatgpt5Config.temperature,
            stream: false
        };

        // Add advanced features if available
        if (this.chatgpt5Config.advancedFeatures.functionCalling) {
            requestBody.tools = this.getAvailableTools();
            requestBody.tool_choice = 'auto';
        }

        try {
            const response = await this.makeOpenAIRequest(requestBody);
            
            // Store in history
            this.addToHistory('user', userQuery);
            this.addToHistory('assistant', response.choices[0].message.content);
            
            return this.processChatGPT5Response(response, context);
            
        } catch (error) {
            console.error('❌ ChatGPT 5 request failed:', error.message);
            throw error;
        }
    }

    formatUserQuery(userQuery, context) {
        let formattedQuery = userQuery;
        
        if (context.crewMember) {
            formattedQuery += `\n\nCrew Context: ${context.crewMember}`;
        }
        
        if (context.urgency) {
            formattedQuery += `\n\nUrgency Level: ${context.urgency}`;
        }
        
        if (context.complexity) {
            formattedQuery += `\n\nComplexity: ${context.complexity}`;
        }
        
        if (context.userRole) {
            formattedQuery += `\n\nUser Role: ${context.userRole}`;
        }
        
        return formattedQuery;
    }

    getAvailableTools() {
        return [
            {
                type: 'function',
                function: {
                    name: 'analyze_crew_selection',
                    description: 'Analyze which Star Trek crew member would be best suited for the current request',
                    parameters: {
                        type: 'object',
                        properties: {
                            crew_member: {
                                type: 'string',
                                enum: ['picard', 'data', 'troi', 'scott', 'spock', 'worf', 'observation-lounge'],
                                description: 'The most appropriate crew member for this request'
                            },
                            reasoning: {
                                type: 'string',
                                description: 'Detailed reasoning for the crew member selection'
                            },
                            priority_level: {
                                type: 'string',
                                enum: ['low', 'normal', 'high', 'critical'],
                                description: 'Priority level for this request'
                            },
                            ui_layout: {
                                type: 'string',
                                enum: ['strategic-command', 'technical-analysis', 'security-tactical', 'standard-lcars'],
                                description: 'Recommended UI layout for this request'
                            }
                        },
                        required: ['crew_member', 'reasoning', 'priority_level', 'ui_layout']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'generate_workflow_enhancement',
                    description: 'Generate suggestions for enhancing n8n workflows based on the request',
                    parameters: {
                        type: 'object',
                        properties: {
                            enhancement_type: {
                                type: 'string',
                                enum: ['node_optimization', 'error_handling', 'performance', 'integration', 'monitoring'],
                                description: 'Type of workflow enhancement needed'
                            },
                            specific_recommendations: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                },
                                description: 'Specific recommendations for workflow improvement'
                            },
                            priority: {
                                type: 'string',
                                enum: ['low', 'medium', 'high'],
                                description: 'Priority for implementing these enhancements'
                            }
                        },
                        required: ['enhancement_type', 'specific_recommendations', 'priority']
                    }
                }
            }
        ];
    }

    async makeOpenAIRequest(requestBody) {
        return new Promise((resolve, reject) => {
            const url = new URL('/chat/completions', this.chatgpt5Config.baseUrl);
            
            const postData = JSON.stringify(requestBody);
            
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.chatgpt5Config.apiKey}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        if (res.statusCode === 200) {
                            const response = JSON.parse(data);
                            resolve(response);
                        } else {
                            reject(new Error(`OpenAI API error: ${res.statusCode} - ${data}`));
                        }
                    } catch (error) {
                        reject(new Error(`Failed to parse OpenAI response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`OpenAI request failed: ${error.message}`));
            });

            req.write(postData);
            req.end();
        });
    }

    processChatGPT5Response(response, context) {
        const message = response.choices[0].message;
        const content = message.content;
        
        // Check for tool calls
        if (message.tool_calls && message.tool_calls.length > 0) {
            return this.processToolCalls(message.tool_calls, context);
        }
        
        // Process regular response
        const processedResponse = {
            type: 'text_response',
            content: content,
            model: this.chatgpt5Config.model,
            timestamp: new Date().toISOString(),
            context: context,
            crewRecommendation: this.extractCrewRecommendation(content),
            uiRecommendation: this.extractUIRecommendation(content)
        };
        
        return processedResponse;
    }

    processToolCalls(toolCalls, context) {
        const results = [];
        
        for (const toolCall of toolCalls) {
            if (toolCall.function) {
                try {
                    const args = JSON.parse(toolCall.function.arguments);
                    const result = {
                        tool: toolCall.function.name,
                        arguments: args,
                        context: context
                    };
                    
                    results.push(result);
                } catch (error) {
                    console.error('❌ Failed to parse tool call arguments:', error);
                }
            }
        }
        
        return {
            type: 'tool_response',
            toolResults: results,
            model: this.chatgpt5Config.model,
            timestamp: new Date().toISOString(),
            context: context
        };
    }

    extractCrewRecommendation(content) {
        const crewMembers = ['picard', 'data', 'troi', 'scott', 'spock', 'worf', 'observation-lounge'];
        
        for (const member of crewMembers) {
            if (content.toLowerCase().includes(member)) {
                return member;
            }
        }
        
        return 'picard'; // default
    }

    extractUIRecommendation(content) {
        if (content.toLowerCase().includes('technical') || content.toLowerCase().includes('engineering')) {
            return 'technical-analysis';
        } else if (content.toLowerCase().includes('strategic') || content.toLowerCase().includes('planning')) {
            return 'strategic-command';
        } else if (content.toLowerCase().includes('security') || content.toLowerCase().includes('tactical')) {
            return 'security-tactical';
        } else {
            return 'standard-lcars';
        }
    }

    addToHistory(role, content) {
        this.promptHistory.push({
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        // Maintain history size
        if (this.promptHistory.length > this.maxHistorySize) {
            this.promptHistory = this.promptHistory.slice(-this.maxHistorySize);
        }
    }

    async startInteractiveMode() {
        console.log('🚀 Enhanced ChatGPT 5 Prompt Manager');
        console.log('====================================');
        console.log('🔄 Integrated with Bilateral Sync System');
        console.log('🧠 Powered by ChatGPT 5');
        console.log('');
        
        if (!await this.loadConfig()) {
            console.error('❌ Failed to initialize');
            return;
        }
        
        console.log('✅ Ready for enhanced prompting');
        console.log('💡 Type your queries or "help" for commands');
        console.log('');
        
        this.rl.setPrompt('🧠 ChatGPT5> ');
        this.rl.prompt();
        
        this.rl.on('line', async (input) => {
            const trimmedInput = input.trim();
            
            if (trimmedInput === '') {
                this.rl.prompt();
                return;
            }
            
            if (trimmedInput.toLowerCase() === 'exit' || trimmedInput.toLowerCase() === 'quit') {
                console.log('🖖 Live long and prosper!');
                this.rl.close();
                return;
            }
            
            if (trimmedInput.toLowerCase() === 'help') {
                this.showHelp();
                this.rl.prompt();
                return;
            }
            
            if (trimmedInput.toLowerCase() === 'history') {
                this.showHistory();
                this.rl.prompt();
                return;
            }
            
            if (trimmedInput.toLowerCase() === 'config') {
                this.showConfig();
                this.rl.prompt();
                return;
            }
            
            try {
                const response = await this.promptChatGPT5(trimmedInput, {
                    userRole: 'developer',
                    urgency: 'normal',
                    complexity: 'medium'
                });
                
                console.log('\n🤖 ChatGPT 5 Response:');
                console.log('=====================');
                
                if (response.type === 'tool_response') {
                    console.log('🔧 Tool Results:');
                    response.toolResults.forEach((result, index) => {
                        console.log(`  ${index + 1}. ${result.tool}:`);
                        console.log(`     ${JSON.stringify(result.arguments, null, 2)}`);
                    });
                } else {
                    console.log(response.content);
                    
                    if (response.crewRecommendation) {
                        console.log(`\n👥 Recommended Crew: ${response.crewRecommendation}`);
                    }
                    
                    if (response.uiRecommendation) {
                        console.log(`🎨 Recommended UI: ${response.uiRecommendation}`);
                    }
                }
                
                console.log('');
                
            } catch (error) {
                console.error('❌ Error:', error.message);
            }
            
            this.rl.prompt();
        });
        
        this.rl.on('close', () => {
            console.log('\n🖖 Enhanced Prompt Manager terminated');
            process.exit(0);
        });
    }

    showHelp() {
        console.log('\n📚 Enhanced ChatGPT 5 Prompt Manager - Help');
        console.log('=============================================');
        console.log('Commands:');
        console.log('  help     - Show this help message');
        console.log('  history  - Show conversation history');
        console.log('  config   - Show current configuration');
        console.log('  exit     - Exit the prompt manager');
        console.log('  quit     - Exit the prompt manager');
        console.log('');
        console.log('Features:');
        console.log('  🧠 ChatGPT 5 powered responses');
        console.log('  🔧 Function calling capabilities');
        console.log('  👥 Crew member recommendations');
        console.log('  🎨 UI layout suggestions');
        console.log('  📝 Conversation history tracking');
        console.log('  🔄 Bilateral sync integration');
        console.log('');
    }

    showHistory() {
        console.log('\n📝 Conversation History');
        console.log('=======================');
        
        if (this.promptHistory.length === 0) {
            console.log('No conversation history yet.');
            return;
        }
        
        this.promptHistory.slice(-10).forEach((entry, index) => {
            const timestamp = new Date(entry.timestamp).toLocaleTimeString();
            const preview = entry.content.length > 50 ? 
                entry.content.substring(0, 50) + '...' : 
                entry.content;
            
            console.log(`${index + 1}. [${timestamp}] ${entry.role.toUpperCase()}: ${preview}`);
        });
        
        console.log(`\nTotal entries: ${this.promptHistory.length}`);
    }

    showConfig() {
        console.log('\n⚙️ Current Configuration');
        console.log('========================');
        console.log(`Default LLM: ${this.llmConfig.default || 'claude'}`);
        console.log(`ChatGPT 5 Available: ${this.llmConfig.chatgpt5 ? '✅' : '❌'}`);
        console.log(`Max History Size: ${this.maxHistorySize}`);
        console.log(`System Prompt Length: ${this.chatgpt5Config.systemPrompt.length} characters`);
        
        if (this.llmConfig.chatgpt5) {
            console.log('\nChatGPT 5 Features:');
            console.log(`  Function Calling: ${this.chatgpt5Config.advancedFeatures.functionCalling ? '✅' : '❌'}`);
            console.log(`  Vision: ${this.chatgpt5Config.advancedFeatures.vision ? '✅' : '❌'}`);
            console.log(`  Code Interpreter: ${this.chatgpt5Config.advancedFeatures.codeInterpreter ? '✅' : '❌'}`);
            console.log(`  Retrieval: ${this.chatgpt5Config.advancedFeatures.retrieval ? '✅' : '❌'}`);
        }
    }

    async testChatGPT5Connection() {
        try {
            console.log('🧪 Testing ChatGPT 5 connection...');
            
            const response = await this.promptChatGPT5(
                'Please respond with "ChatGPT 5 connection test successful" and nothing else.',
                { test: true }
            );
            
            if (response.content.includes('successful')) {
                console.log('✅ ChatGPT 5 connection test successful');
                return true;
            } else {
                console.log('⚠️ ChatGPT 5 connection test completed but response unexpected');
                return false;
            }
            
        } catch (error) {
            console.error('❌ ChatGPT 5 connection test failed:', error.message);
            return false;
        }
    }
}

// CLI interface
async function main() {
    const promptManager = new ChatGPT5EnhancedPromptManager();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'test':
            await promptManager.testChatGPT5Connection();
            break;
        case 'prompt':
            if (process.argv[3]) {
                const query = process.argv[3];
                const response = await promptManager.promptChatGPT5(query);
                console.log(JSON.stringify(response, null, 2));
            } else {
                console.log('Usage: node chatgpt5-enhanced-prompt-manager.js prompt "your query here"');
            }
            break;
        case 'interactive':
        case undefined:
            await promptManager.startInteractiveMode();
            break;
        default:
            console.log('Usage: node chatgpt5-enhanced-prompt-manager.js [test|prompt|interactive]');
            console.log('  test        - Test ChatGPT 5 connection');
            console.log('  prompt      - Send a single prompt');
            console.log('  interactive - Start interactive mode (default)');
            break;
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = ChatGPT5EnhancedPromptManager;
