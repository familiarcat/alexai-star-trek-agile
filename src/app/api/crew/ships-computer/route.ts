import { NextResponse } from 'next/server';

// Ships Computer - LCARS Computer Core (Majel Barrett voice simulation)
export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Prepare the request for the n8n webhook
    const n8nRequest = {
      query: requestData.query || 'General ship computer analysis',
      context: requestData.context || requestData.projectContext || 'ship-computer-analysis',
      userRole: requestData.userRole || 'user',
      urgency: requestData.urgency || 'normal',
      complexity: requestData.complexity || 'medium',
      mission: requestData.mission || 'ship-computer-operations',
      interfacePrefs: requestData.interfacePrefs || 'standard'
    };

    // Call the n8n webhook endpoint (using the working test webhook for now)
    const n8nResponse = await fetch(`${process.env.N8N_BASE_URL}/webhook/test-endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nRequest)
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`);
    }

    const n8nData = await n8nResponse.json();
    
    // Return the n8n response
    return NextResponse.json({
      agent: "ships-computer",
      success: true,
      source: 'n8n-webhook',
      data: n8nData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ships Computer error:', error);
    
    // Fallback to mock data if n8n is unavailable
    const fallbackResponse = {
      voice: "majel-barrett-computer-core-fallback",
      greeting: "Computer fallback mode activated. Accessing ship's systems.",
      systemAnalysis: {
        primarySystems: "Fallback systems operational",
        relevantSystems: ["Fallback crew coordination", "Fallback technical analysis"],
        recommendations: ["Complete n8n workflow integration", "Validate crew coordination systems"]
      },
      lcarsInterface: {
        layoutType: "fallback-lcars",
        colorScheme: "fallback-orange",
        panels: ["fallback-crew-panel", "fallback-system-panel"]
      },
      crewCoordination: {
        recommendedCrew: ["Captain Picard", "Lieutenant Data"],
        coordinationStrategy: "Fallback crew coordination active"
      },
      systemStatus: {
        status: "FALLBACK_MODE",
        message: "n8n webhook unavailable, using fallback systems"
      }
    };
    
    return NextResponse.json({
      agent: "ships-computer",
      response: fallbackResponse,
      fallback: true,
      error: 'n8n webhook unavailable, using fallback data',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}

function analyzeShipSystems(query: string, projectContext: any) {
  const systemAnalysis = {
    primarySystems: "All ship's systems operational",
    relevantSystems: [],
    recommendations: []
  };
  
  // Analyze query for system relevance
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('security') || queryLower.includes('protect')) {
    systemAnalysis.relevantSystems.push('Security protocols active - Lieutenant Worf standing by');
    systemAnalysis.recommendations.push('Engage security analysis subroutines');
  }
  
  if (queryLower.includes('technical') || queryLower.includes('implement')) {
    systemAnalysis.relevantSystems.push('Technical analysis systems - Lieutenant Data available');
    systemAnalysis.recommendations.push('Initialize technical implementation protocols');
  }
  
  if (queryLower.includes('team') || queryLower.includes('coordinate')) {
    systemAnalysis.relevantSystems.push('Team coordination systems - Captain Picard and Counselor Troi ready');
    systemAnalysis.recommendations.push('Activate crew coordination and emotional intelligence subroutines');
  }
  
  if (queryLower.includes('engineer') || queryLower.includes('optimize')) {
    systemAnalysis.relevantSystems.push('Engineering systems - Chief Engineer Scott monitoring');
    systemAnalysis.recommendations.push('Engage engineering optimization protocols');
  }
  
  if (queryLower.includes('analyze') || queryLower.includes('logic')) {
    systemAnalysis.relevantSystems.push('Logical analysis systems - Commander Spock ready');
    systemAnalysis.recommendations.push('Initialize logical analysis frameworks');
  }
  
  return systemAnalysis;
}

function generateDynamicLCARSLayout(projectContext: any, agentMemories: any) {
  const lcarsLayout = {
    layoutType: "project-adaptive-lcars",
    
    // Main display panels based on project context
    primaryPanels: [
      {
        id: "main-viewer",
        type: "central-display",
        content: "Project overview and real-time status",
        adaptedTo: projectContext?.projectType || "general"
      },
      {
        id: "crew-status",
        type: "crew-panel",
        content: "Active crew member availability and specializations",
        data: "Real-time crew coordination"
      }
    ],
    
    // Side panels adapted to agent capabilities
    sidePanels: generateAgentSpecificPanels(agentMemories),
    
    // Bottom status bar
    statusBar: {
      shipStatus: "NCC-1701-B Operational",
      projectStatus: projectContext?.status || "Active",
      systemLoad: "Optimal",
      crewEfficiency: "95.7%"
    },
    
    // Interactive elements
    interactiveElements: [
      "crew-consultation-controls",
      "project-context-switcher", 
      "knowledge-base-access",
      "system-status-monitor"
    ],
    
    // Color scheme adaptation
    colorScheme: adaptColorSchemeToProject(projectContext),
    
    // Sound effects and voice responses
    audioInterface: {
      voice: "majel-barrett-simulation",
      soundEffects: "lcars-interface-sounds",
      responseType: "computer-core-standard"
    }
  };
  
  return lcarsLayout;
}

function generateAgentSpecificPanels(agentMemories: any) {
  return [
    {
      id: "strategic-panel",
      agent: "captain-picard",
      title: "Strategic Command",
      content: "Project leadership and coordination overview",
      dataTypes: ["team-status", "project-milestones", "strategic-decisions"]
    },
    {
      id: "technical-panel", 
      agent: "lieutenant-data",
      title: "Technical Operations",
      content: "System analysis and technical implementation status",
      dataTypes: ["system-metrics", "code-quality", "technical-recommendations"]
    },
    {
      id: "psychology-panel",
      agent: "counselor-troi", 
      title: "Team Dynamics",
      content: "Team effectiveness and user experience insights",
      dataTypes: ["team-sentiment", "user-feedback", "collaboration-metrics"]
    },
    {
      id: "engineering-panel",
      agent: "chief-engineer-scott",
      title: "Engineering Status", 
      content: "System performance and optimization metrics",
      dataTypes: ["performance-metrics", "optimization-opportunities", "system-health"]
    },
    {
      id: "analysis-panel",
      agent: "commander-spock",
      title: "Logical Analysis",
      content: "Data analysis and logical reasoning results",
      dataTypes: ["analysis-results", "logical-frameworks", "optimization-recommendations"]
    },
    {
      id: "security-panel",
      agent: "lieutenant-worf",
      title: "Security Status",
      content: "Security protocols and threat assessment",
      dataTypes: ["security-status", "threat-assessment", "compliance-metrics"]
    }
  ];
}

function coordinateCrewForProject(query: string, projectContext: any) {
  const crewCoordination = {
    recommendedLeadAgent: "captain-picard",
    supportingAgents: [],
    collaborationStrategy: "standard-project-team",
    consultationOrder: []
  };
  
  // Analyze query complexity and requirements
  const queryLower = query.toLowerCase();
  
  // Always include strategic leadership
  crewCoordination.consultationOrder.push("captain-picard");
  
  // Add technical expertise if needed
  if (queryLower.includes('technical') || queryLower.includes('code') || queryLower.includes('implement')) {
    crewCoordination.supportingAgents.push("lieutenant-data");
    crewCoordination.consultationOrder.push("lieutenant-data");
  }
  
  // Add engineering if optimization or performance mentioned
  if (queryLower.includes('performance') || queryLower.includes('optimize') || queryLower.includes('engineer')) {
    crewCoordination.supportingAgents.push("chief-engineer-scott");
    crewCoordination.consultationOrder.push("chief-engineer-scott");
  }
  
  // Add security for security-related queries
  if (queryLower.includes('security') || queryLower.includes('auth') || queryLower.includes('protect')) {
    crewCoordination.supportingAgents.push("lieutenant-worf");
    crewCoordination.consultationOrder.push("lieutenant-worf");
  }
  
  // Add emotional intelligence for team or user queries
  if (queryLower.includes('team') || queryLower.includes('user') || queryLower.includes('experience')) {
    crewCoordination.supportingAgents.push("counselor-troi");
    crewCoordination.consultationOrder.push("counselor-troi");
  }
  
  // Add logical analysis for complex problems
  if (queryLower.includes('analyze') || queryLower.includes('complex') || queryLower.includes('logic')) {
    crewCoordination.supportingAgents.push("commander-spock");
    crewCoordination.consultationOrder.push("commander-spock");
  }
  
  // For complex queries, suggest observation lounge consultation
  if (crewCoordination.supportingAgents.length >= 3) {
    crewCoordination.collaborationStrategy = "observation-lounge-consultation";
    crewCoordination.consultationOrder.push("observation-lounge");
  }
  
  return crewCoordination;
}

function createContextualDataViews(query: string, projectContext: any) {
  return {
    recommendedViews: [
      {
        type: "project-overview",
        title: "Project Status Overview",
        relevance: "primary",
        dataSource: "project-knowledge-base"
      },
      {
        type: "crew-expertise-map",
        title: "Available Crew Expertise",
        relevance: "secondary", 
        dataSource: "agent-capabilities"
      },
      {
        type: "knowledge-integration",
        title: "Relevant Knowledge Assets",
        relevance: "contextual",
        dataSource: "bilateral-learning-system"
      }
    ],
    
    visualizationRecommendations: [
      "Use LCARS-style data panels for authentic Star Trek experience",
      "Color-code information by urgency and relevance",
      "Include real-time updates from active crew members",
      "Provide drill-down capabilities for detailed analysis"
    ]
  };
}

function generateProjectSpecificGuidance(query: string, projectContext: any) {
  return {
    projectAdaptations: [
      "Interface adapted to current project context",
      "Crew recommendations tailored to project requirements",
      "Knowledge base filtered for project relevance",
      "UI elements customized for project domain"
    ],
    
    contextualRecommendations: [
      "Engage appropriate crew members based on query analysis",
      "Reference project-specific knowledge and constraints", 
      "Apply lessons learned from similar project phases",
      "Coordinate with observation lounge for complex decisions"
    ],
    
    intelligenceIntegration: [
      "All crew member insights available for consultation",
      "Cross-functional expertise automatically coordinated",
      "Historical project knowledge accessible",
      "Real-time learning integration active"
    ]
  };
}

function getShipSystemStatus() {
  return {
    shipRegistry: "NCC-1701-B",
    systemStatus: "All systems operational", 
    crewStatus: "Full complement available",
    knowledgeBase: "946+ assets indexed and accessible",
    bilateralLearning: "Active and growing",
    projectSystems: "Adaptive and responsive",
    computerCore: "LCARS Computer Core operational",
    voiceInterface: "Majel Barrett voice simulation ready"
  };
}

function analyzeCrewCapabilities(agentMemories: any) {
  return {
    crewReadiness: "All crew members enhanced with bilateral learning",
    capabilityGrowth: "+225% average improvement in response quality",
    knowledgeIntegration: "100% success rate in knowledge utilization",
    collaborativeIntelligence: "Cross-functional expertise coordination active",
    learningVelocity: "Exponential growth with each project milestone",
    
    individualCapabilities: {
      "captain-picard": "Strategic leadership with cross-functional awareness",
      "lieutenant-data": "Technical operations with comprehensive system knowledge", 
      "counselor-troi": "Emotional intelligence with project management integration",
      "chief-engineer-scott": "Engineering excellence with architectural understanding",
      "commander-spock": "Logical analysis with evolutionary insights",
      "lieutenant-worf": "Security protocols with operational integration"
    },
    
    systemRecommendation: "Crew intelligence optimal for complex project execution"
  };
}

function adaptColorSchemeToProject(projectContext: any) {
  // Default LCARS color scheme with project adaptations
  const baseScheme = {
    primary: "#FF9900", // LCARS Orange
    secondary: "#9999FF", // LCARS Blue
    accent: "#FF0000", // LCARS Red
    background: "#000000", // Black
    text: "#FFFFFF" // White
  };
  
  // Adapt based on project context
  if (projectContext?.domain === "healthcare") {
    baseScheme.accent = "#00FF00"; // Green for healthcare
  } else if (projectContext?.domain === "finance") {
    baseScheme.accent = "#FFD700"; // Gold for finance
  } else if (projectContext?.domain === "security") {
    baseScheme.accent = "#FF0000"; // Red for security focus
  }
  
  return baseScheme;
}

export async function GET() {
  return NextResponse.json({
    agent: "ships-computer",
    status: "LCARS Computer Core operational",
    voice: "majel-barrett-simulation",
    capabilities: [
      "Dynamic LCARS interface generation",
      "Project-adaptive UI layouts", 
      "Crew coordination and intelligence analysis",
      "Real-time system status monitoring",
      "Cross-functional knowledge integration",
      "Project-specific guidance and recommendations"
    ],
    systemIntegration: [
      "All crew member capabilities accessible",
      "Bilateral learning system integrated",
      "Knowledge base fully indexed",
      "Project context awareness active"
    ],
    timestamp: new Date().toISOString()
  });
}
