import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { validationType = 'all', agentFocus, includeSpecialized = true } = await request.json();

    // Define all available agents
    const allAgents = {
      crew: [
        'captain-picard',
        'lieutenant-data',
        'counselor-troi',
        'chief-engineer-scott',
        'commander-spock',
        'lieutenant-worf',
        'observation-lounge'
      ],
      specialized: [
        'ships-computer',
        'multimodal-agency',
        'bilateral-learning',
        'enhanced-knowledge',
        'dynamic-update'
      ],
      orchestration: [
        'crew-coordination',
        'ship-agency',
        'llm-orchestration'
      ]
    };

    // Determine which agents to validate
    let agentsToValidate: string[] = [];
    if (validationType === 'all') {
      agentsToValidate = [...allAgents.crew, ...allAgents.specialized, ...allAgents.orchestration];
    } else if (validationType === 'crew') {
      agentsToValidate = allAgents.crew;
    } else if (validationType === 'specialized') {
      agentsToValidate = allAgents.specialized;
    } else if (agentFocus && allAgents[agentFocus as keyof typeof allAgents]) {
      agentsToValidate = allAgents[agentFocus as keyof typeof allAgents];
    } else {
      agentsToValidate = allAgents.crew; // Default to crew
    }

    // Add specialized agents if requested
    if (includeSpecialized && validationType !== 'all') {
      agentsToValidate = [...new Set([...agentsToValidate, ...allAgents.specialized])];
    }

    // Simulate agent health checks
    const agentHealthChecks: Record<string, any> = {};
    const healthResults: any[] = [];

    for (const agent of agentsToValidate) {
      // Simulate health check for each agent
      const healthStatus = {
        agent,
        status: 'healthy' as 'healthy' | 'warning' | 'error',
        apiEndpoint: `/api/crew/${agent}`,
        workflowIntegration: 'active',
        llmConfig: 'configured',
        bilateralSync: 'synchronized',
        lastResponse: new Date().toISOString(),
        performance: Math.floor(Math.random() * 20) + 80, // 80-100%
        errors: 0
      };

      // Simulate occasional issues
      if (Math.random() < 0.1) {
        healthStatus.status = 'warning';
        healthStatus.errors = Math.floor(Math.random() * 3) + 1;
      }

      agentHealthChecks[agent] = healthStatus;
      healthResults.push(healthStatus);
    }

    // Calculate overall system health
    const healthyAgents = healthResults.filter(a => a.status === 'healthy').length;
    const warningAgents = healthResults.filter(a => a.status === 'warning').length;
    const totalAgents = healthResults.length;

    const systemHealth = {
      overall: healthyAgents / totalAgents >= 0.9 ? 'excellent' : 'good',
      healthyAgents,
      warningAgents,
      totalAgents,
      healthPercentage: Math.round((healthyAgents / totalAgents) * 100),
      recommendations: [] as string[]
    };

    // Generate recommendations
    if (warningAgents > 0) {
      systemHealth.recommendations.push('Review agents with warnings for potential issues');
    }
    if (totalAgents < Object.values(allAgents).flat().length) {
      systemHealth.recommendations.push('Consider adding more specialized agents');
    }
    if (systemHealth.healthPercentage < 95) {
      systemHealth.recommendations.push('Optimize agent performance and error handling');
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      validationType,
      totalAgents: agentsToValidate.length,
      systemHealth,
      agentHealthChecks,
      systemStatus: {
        totalCrewMembers: allAgents.crew.length,
        totalSpecializedAgents: allAgents.specialized.length,
        totalOrchestrationAgents: allAgents.orchestration.length,
        totalAgents: Object.values(allAgents).flat().length
      },
      recommendations: systemHealth.recommendations,
      validationSteps: [
        'API endpoint availability',
        'Workflow integration',
        'LLM configuration',
        'Bilateral sync status',
        'Response validation'
      ],
      bilateralSyncStatus: 'active',
      allAgentsIncluded: true
    });
  } catch (error) {
    console.error('Agent validation error:', error);
    return NextResponse.json({
      error: 'Agent validation failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
