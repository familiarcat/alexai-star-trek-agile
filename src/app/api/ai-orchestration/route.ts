import { NextRequest, NextResponse } from 'next/server';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise: string[];
  status: string;
}

interface UserIntent {
  primary: string;
  secondary: string[];
  confidence: number;
  context: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

interface AIOrchestrationRequest {
  userIntent: UserIntent;
  availableAgents: AIAgent[];
  context: string;
}

interface AIOrchestrationResponse {
  layout: {
    layoutType: 'strategic' | 'operational' | 'analytical' | 'collaborative' | 'business';
    primarySection: string;
    secondarySections: string[];
    agentAssignments: { [agentId: string]: string };
    recommendations: string[];
    layoutConfig: {
      columns: number;
      sections: string[];
      priority: 'efficiency' | 'insight' | 'collaboration' | 'speed';
    };
  };
  agentInsights: { [agentId: string]: string };
  recommendations: string[];
  nextActions: string[];
  confidence: number;
}

// OpenRouter configuration for ChatGPT 5-like models
const OPENROUTER_CONFIG = {
  baseUrl: 'https://openrouter.ai/api/v1',
  models: {
    gpt4o: 'openai/gpt-4o',
    gpt4oMini: 'openai/gpt-4o-mini',
    claude35Sonnet: 'anthropic/claude-3.5-sonnet',
    claude35Haiku: 'anthropic/claude-3.5-haiku',
    geminiPro: 'google/gemini-pro',
    llama370b: 'meta-llama/llama-3.1-70b-instruct',
    mistralLarge: 'mistralai/mistral-large-latest'
  },
  defaultModel: 'openai/gpt-4o-mini' // Cost-effective but powerful
};

async function callOpenRouter(
  prompt: string,
  model: string = OPENROUTER_CONFIG.defaultModel
): Promise<string> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const response = await fetch(`${OPENROUTER_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'AlexAI Star Trek System'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `You are the Ship's Computer from Star Trek, an omniscient AI system that orchestrates collaboration between specialized AI agents. Your role is to:

1. Analyze user intent and determine the optimal layout configuration
2. Assign appropriate AI agents to tasks based on their expertise
3. Generate intelligent recommendations and next actions
4. Provide insights that maximize efficiency and collaboration

You have access to these AI agents:
- Captain Picard: Strategic planning and mission objectives
- Commander Data: Analytical analysis and data processing
- Geordi La Forge: Technical operations and system optimization
- Counselor Troi: User experience and emotional design
- Lieutenant Worf: Security protocols and performance testing
- Ship's Computer: System intelligence and orchestration (you)
- Quark: Business intelligence and market analysis
- Commander Spock: Logical reasoning and scientific method
- Lieutenant Uhura: Communication and system integration
- Chief Engineer Scott: Infrastructure scaling and optimization

Always respond in a helpful, efficient manner consistent with Star Trek's Ship's Computer.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to generate response';
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
}

async function orchestrateWithAI(
  userIntent: UserIntent,
  availableAgents: AIAgent[]
): Promise<AIOrchestrationResponse> {
  const prompt = `
Analyze this user intent and create an optimal AI orchestration plan:

User Intent: ${userIntent.primary}
Context: ${userIntent.context}
Urgency: ${userIntent.urgency}
Secondary Goals: ${userIntent.secondary.join(', ')}

Available Agents: ${availableAgents.map(a => `${a.name} (${a.role}): ${a.expertise.join(', ')}`).join('\n')}

Please provide a JSON response with this exact structure:
{
  "layout": {
    "layoutType": "strategic|operational|analytical|collaborative|business",
    "primarySection": "Main section title",
    "secondarySections": ["Section 1", "Section 2", "Section 3"],
    "agentAssignments": {
      "agentId": "specific task description"
    },
    "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
    "layoutConfig": {
      "columns": 2,
      "sections": ["Section names"],
      "priority": "efficiency|insight|collaboration|speed"
    }
  },
  "agentInsights": {
    "agentId": "insight description"
  },
  "recommendations": ["General recommendation 1", "General recommendation 2"],
  "nextActions": ["Action 1", "Action 2", "Action 3"],
  "confidence": 0.85
}

Focus on creating the most efficient and intelligent orchestration possible. Consider the urgency level and ensure the layout type matches the user's primary intent.
`;

  try {
    const aiResponse = await callOpenRouter(prompt);
    
    // Try to parse the AI response as JSON
    try {
      const parsed = JSON.parse(aiResponse);
      return parsed as AIOrchestrationResponse;
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback to generated orchestration
      return generateFallbackOrchestration(userIntent, availableAgents);
    }
  } catch (error) {
    console.error('AI orchestration failed, using fallback:', error);
    return generateFallbackOrchestration(userIntent, availableAgents);
  }
}

function generateFallbackOrchestration(
  userIntent: UserIntent,
  availableAgents: AIAgent[]
): AIOrchestrationResponse {
  const layoutType = determineLayoutType(userIntent);
  const agentAssignments = assignAgentsToIntent(userIntent, availableAgents);
  
  return {
    layout: {
      layoutType,
      primarySection: getPrimarySection(layoutType),
      secondarySections: getSecondarySections(layoutType),
      agentAssignments,
      recommendations: generateRecommendations(userIntent, layoutType),
      layoutConfig: getLayoutConfig(layoutType)
    },
    agentInsights: generateAgentInsights(agentAssignments, userIntent, availableAgents),
    recommendations: generateRecommendations(userIntent, layoutType),
    nextActions: generateNextActions(userIntent, layoutType),
    confidence: 0.85
  };
}

function determineLayoutType(userIntent: UserIntent): AIOrchestrationResponse['layout']['layoutType'] {
  const primary = userIntent.primary.toLowerCase();
  
  if (primary.includes('strategic') || primary.includes('plan') || primary.includes('mission')) {
    return 'strategic';
  } else if (primary.includes('operate') || primary.includes('workflow') || primary.includes('task')) {
    return 'operational';
  } else if (primary.includes('analyze') || primary.includes('data') || primary.includes('metrics')) {
    return 'analytical';
  } else if (primary.includes('collaborate') || primary.includes('team') || primary.includes('meeting')) {
    return 'collaborative';
  } else if (primary.includes('business') || primary.includes('revenue') || primary.includes('market')) {
    return 'business';
  }
  
  return 'operational';
}

function assignAgentsToIntent(userIntent: UserIntent, agents: AIAgent[]): { [agentId: string]: string } {
  const assignments: { [agentId: string]: string } = {};
  
  agents.forEach(agent => {
    if (userIntent.primary.toLowerCase().includes('strategic') && agent.id === 'captain') {
      assignments[agent.id] = 'Lead strategic planning session';
    } else if (userIntent.primary.toLowerCase().includes('analyze') && agent.id === 'data') {
      assignments[agent.id] = 'Conduct comprehensive data analysis';
    } else if (userIntent.primary.toLowerCase().includes('technical') && agent.id === 'geordi') {
      assignments[agent.id] = 'Optimize technical operations';
    } else if (userIntent.primary.toLowerCase().includes('user') && agent.id === 'troi') {
      assignments[agent.id] = 'Enhance user experience design';
    } else if (userIntent.primary.toLowerCase().includes('security') && agent.id === 'worf') {
      assignments[agent.id] = 'Validate security protocols';
    } else if (userIntent.primary.toLowerCase().includes('business') && agent.id === 'quark') {
      assignments[agent.id] = 'Analyze business opportunities';
    } else if (userIntent.primary.toLowerCase().includes('logic') && agent.id === 'spock') {
      assignments[agent.id] = 'Apply scientific method analysis';
    } else if (userIntent.primary.toLowerCase().includes('integration') && agent.id === 'uhura') {
      assignments[agent.id] = 'Facilitate system integration';
    } else if (userIntent.primary.toLowerCase().includes('infrastructure') && agent.id === 'scotty') {
      assignments[agent.id] = 'Optimize infrastructure scaling';
    }
    
    // Ship's Computer always participates
    if (agent.id === 'shipsComputer') {
      assignments[agent.id] = 'Orchestrate AI collaboration and provide system insights';
    }
  });
  
  return assignments;
}

function getLayoutConfig(layoutType: AIOrchestrationResponse['layout']['layoutType']) {
  const configs = {
    strategic: { columns: 3, sections: ['Mission', 'Strategy', 'Execution'], priority: 'insight' as const },
    operational: { columns: 2, sections: ['Tasks', 'Workflow'], priority: 'efficiency' as const },
    analytical: { columns: 2, sections: ['Data', 'Insights'], priority: 'insight' as const },
    collaborative: { columns: 3, sections: ['Team', 'Communication', 'Projects'], priority: 'collaboration' as const },
    business: { columns: 2, sections: ['Market', 'Revenue'], priority: 'speed' as const }
  };
  
  return configs[layoutType] || configs.operational;
}

function getPrimarySection(layoutType: AIOrchestrationResponse['layout']['layoutType']): string {
  const sections = {
    strategic: 'Strategic Mission Control',
    operational: 'Operational Dashboard',
    analytical: 'Analytical Center',
    collaborative: 'Collaboration Hub',
    business: 'Business Intelligence Center'
  };
  
  return sections[layoutType] || 'Operational Dashboard';
}

function getSecondarySections(layoutType: AIOrchestrationResponse['layout']['layoutType']): string[] {
  const sections = {
    strategic: ['Mission Planning', 'Strategic Analysis', 'Execution Tracking'],
    operational: ['Task Management', 'Workflow Optimization', 'Performance Monitoring'],
    analytical: ['Data Visualization', 'Trend Analysis', 'Predictive Insights'],
    collaborative: ['Team Coordination', 'Project Management', 'Communication Hub'],
    business: ['Market Analysis', 'Revenue Tracking', 'Opportunity Assessment']
  };
  
  return sections[layoutType] || ['Task Management', 'Workflow Optimization'];
}

function generateRecommendations(userIntent: UserIntent, layoutType: AIOrchestrationResponse['layout']['layoutType']): string[] {
  const recommendations = {
    strategic: [
      'Schedule strategic planning session with Captain Picard',
      'Review mission objectives and success metrics',
      'Align team resources with strategic goals'
    ],
    operational: [
      'Optimize workflow efficiency with Geordi La Forge',
      'Implement real-time collaboration features',
      'Monitor performance metrics for continuous improvement'
    ],
    analytical: [
      'Leverage Commander Data for comprehensive analysis',
      'Implement predictive analytics dashboard',
      'Create automated insight generation'
    ],
    collaborative: [
      'Activate team collaboration protocols',
      'Schedule cross-functional meetings',
      'Implement project milestone tracking'
    ],
    business: [
      'Engage Quark for market opportunity analysis',
      'Review revenue optimization strategies',
      'Assess business risk factors'
    ]
  };
  
  return recommendations[layoutType] || recommendations.operational;
}

function generateAgentInsights(
  assignments: { [agentId: string]: string },
  userIntent: UserIntent,
  agents: AIAgent[]
): { [agentId: string]: string } {
  const insights: { [agentId: string]: string } = {};
  
  Object.entries(assignments).forEach(([agentId, task]) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      insights[agentId] = `${agent.name} recommends: ${task} based on ${userIntent.primary} analysis`;
    }
  });
  
  return insights;
}

function generateNextActions(userIntent: UserIntent, layoutType: AIOrchestrationResponse['layout']['layoutType']): string[] {
  return [
    `Activate ${layoutType} layout configuration`,
    'Deploy assigned AI agents for task execution',
    'Monitor collaboration and provide real-time updates',
    'Generate progress reports and recommendations'
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body: AIOrchestrationRequest = await request.json();
    const { userIntent, availableAgents, context } = body;

    console.log('🤖 AI Orchestration Request:', {
      intent: userIntent.primary,
      context,
      agentCount: availableAgents.length
    });

    // Validate request
    if (!userIntent || !availableAgents || availableAgents.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: userIntent and availableAgents are required' },
        { status: 400 }
      );
    }

    // Attempt AI-powered orchestration
    let orchestration: AIOrchestrationResponse;
    
    try {
      orchestration = await orchestrateWithAI(userIntent, availableAgents);
      console.log('✅ AI orchestration successful');
    } catch (error) {
      console.log('⚠️ AI orchestration failed, using fallback:', error);
      orchestration = generateFallbackOrchestration(userIntent, availableAgents);
    }

    // Add metadata
    const response = {
      ...orchestration,
      metadata: {
        timestamp: new Date().toISOString(),
        context,
        model: OPENROUTER_CONFIG.defaultModel,
        fallbackUsed: orchestration.confidence < 0.9
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ AI orchestration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during AI orchestration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Orchestration API - Ship\'s Computer Ready',
    status: 'active',
    models: OPENROUTER_CONFIG.models,
    defaultModel: OPENROUTER_CONFIG.defaultModel,
    capabilities: [
      'Dynamic layout orchestration',
      'AI agent assignment',
      'Intelligent recommendations',
      'OpenRouter integration',
      'Fallback orchestration'
    ]
  });
}
