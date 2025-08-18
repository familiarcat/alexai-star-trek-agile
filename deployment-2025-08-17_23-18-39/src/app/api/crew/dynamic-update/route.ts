import { NextResponse } from 'next/server';

// Dynamic update system for adapting to project demands
interface ProjectContext {
  projectId: string;
  sprintPhase: 'planning' | 'development' | 'testing' | 'deployment';
  teamSize: number;
  technicalComplexity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  blockers: string[];
  achievements: string[];
  teamVelocity: number;
}

interface DynamicCrewResponse {
  crewMember: string;
  response: {
    greeting: string;
    projectContext: ProjectContext;
    adaptiveGuidance: string;
    nextSteps: string[];
    urgencyLevel: string;
    crewRecommendations: string[];
  };
  timestamp: string;
  confidence: number;
  updateSource: 'dynamic' | 'fallback';
}

export async function POST(request: Request) {
  try {
    const { query, context, userRole, projectContext } = await request.json();
    
    // Analyze project context for dynamic adaptation
    const projectAnalysis = analyzeProjectContext(projectContext);
    
    // Select crew member based on project demands
    const selectedCrew = selectCrewByProjectDemands(query, context, userRole, projectAnalysis);
    
    // Generate adaptive response
    const adaptiveResponse = generateAdaptiveResponse(selectedCrew, query, projectAnalysis);
    
    const response: DynamicCrewResponse = {
      crewMember: selectedCrew,
      response: {
        greeting: adaptiveResponse.greeting,
        projectContext: projectAnalysis,
        adaptiveGuidance: adaptiveResponse.guidance,
        nextSteps: adaptiveResponse.nextSteps,
        urgencyLevel: projectAnalysis.urgency,
        crewRecommendations: adaptiveResponse.recommendations
      },
      timestamp: new Date().toISOString(),
      confidence: 0.95,
      updateSource: 'dynamic'
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Dynamic update error:', error);
    
    // Fallback to basic crew selection
    const fallbackResponse = await fetch(`${process.env.NEXTJS_BASE_URL || 'http://localhost:3000'}/api/crew/lieutenant-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: "Dynamic update fallback response",
        context: "system-error",
        userRole: "system"
      })
    });
    
    const fallbackData = await fallbackResponse.json();
    
    return NextResponse.json({
      ...fallbackData,
      updateSource: 'fallback',
      error: 'Dynamic update unavailable, using fallback response'
    });
  }
}

function analyzeProjectContext(context: any): ProjectContext {
  // Default project context
  const defaultContext: ProjectContext = {
    projectId: context?.projectId || 'alexai-platform',
    sprintPhase: context?.sprintPhase || 'development',
    teamSize: context?.teamSize || 5,
    technicalComplexity: context?.technicalComplexity || 'medium',
    urgency: context?.urgency || 'medium',
    blockers: context?.blockers || [],
    achievements: context?.achievements || [],
    teamVelocity: context?.teamVelocity || 15
  };
  
  // Analyze and enhance context based on data
  if (context?.blockers?.length > 0 && defaultContext.urgency !== 'critical') {
    defaultContext.urgency = 'high';
  }
  
  if (context?.teamVelocity < 10) {
    defaultContext.technicalComplexity = 'high';
  }
  
  return defaultContext;
}

function selectCrewByProjectDemands(query: string, context: string, userRole: string, projectAnalysis: ProjectContext): string {
  // Dynamic crew selection based on project demands
  
  // High urgency situations
  if (projectAnalysis.urgency === 'critical') {
    return 'captain-picard'; // Strategic leadership needed
  }
  
  // Technical complexity
  if (projectAnalysis.technicalComplexity === 'high') {
    return 'lieutenant-data'; // Technical expertise needed
  }
  
  // Team coordination needs
  if (projectAnalysis.teamSize > 8 || projectAnalysis.blockers.length > 2) {
    return 'observation-lounge'; // Crew meeting needed
  }
  
  // Jr. Developer support
  if (userRole === 'jr-developer') {
    return 'lieutenant-data'; // Specialized support
  }
  
  // Strategic planning
  if (query.toLowerCase().includes('mission') || query.toLowerCase().includes('strategy')) {
    return 'captain-picard';
  }
  
  // Technical problems
  if (query.toLowerCase().includes('error') || query.toLowerCase().includes('bug') || query.toLowerCase().includes('fix')) {
    return 'lieutenant-data';
  }
  
  // Team dynamics
  if (query.toLowerCase().includes('team') || query.toLowerCase().includes('collaboration')) {
    return 'counselor-troi';
  }
  
  // Default to Lieutenant Data for technical guidance
  return 'lieutenant-data';
}

function generateAdaptiveResponse(crewMember: string, query: string, projectAnalysis: ProjectContext) {
  const baseResponses = {
    'captain-picard': {
      greeting: "Make it so.",
      guidance: `Our mission requires immediate attention. With ${projectAnalysis.urgency} urgency and ${projectAnalysis.teamSize} crew members, we must proceed with determination.`,
      nextSteps: [
        "Prioritize critical blockers",
        "Coordinate team resources",
        "Maintain mission focus",
        "Prepare for deployment phase"
      ],
      recommendations: [
        "Schedule emergency crew meeting",
        "Reallocate resources to critical tasks",
        "Implement contingency plans"
      ]
    },
    'lieutenant-data': {
      greeting: "Good morning, Ensign. I have analyzed the project context and prepared adaptive guidance.",
      guidance: `Technical complexity is ${projectAnalysis.technicalComplexity} with team velocity of ${projectAnalysis.teamVelocity}. I recommend systematic approach to current challenges.`,
      nextSteps: [
        "Analyze technical blockers",
        "Optimize development workflow",
        "Provide technical guidance",
        "Monitor performance metrics"
      ],
      recommendations: [
        "Implement automated testing",
        "Optimize build processes",
        "Enhance code review procedures"
      ]
    },
    'counselor-troi': {
      greeting: "I sense the team dynamics require attention.",
      guidance: `With ${projectAnalysis.teamSize} team members and ${projectAnalysis.blockers.length} blockers, team morale and collaboration are crucial for success.`,
      nextSteps: [
        "Assess team morale",
        "Facilitate communication",
        "Address collaboration challenges",
        "Support team well-being"
      ],
      recommendations: [
        "Schedule team building activities",
        "Improve communication channels",
        "Address interpersonal conflicts"
      ]
    },
    'observation-lounge': {
      greeting: "The crew is assembled for project review.",
      guidance: `Project ${projectAnalysis.projectId} is in ${projectAnalysis.sprintPhase} phase with ${projectAnalysis.teamSize} crew members. Collective wisdom is needed.`,
      nextSteps: [
        "Review project status",
        "Address team concerns",
        "Plan next sprint",
        "Coordinate crew efforts"
      ],
      recommendations: [
        "Schedule regular crew meetings",
        "Implement cross-team collaboration",
        "Share knowledge across departments"
      ]
    }
  };
  
  return baseResponses[crewMember as keyof typeof baseResponses] || baseResponses['lieutenant-data'];
}

export async function GET() {
  // Health check for dynamic update system
  return NextResponse.json({
    status: 'healthy',
    dynamicUpdateCapabilities: {
      projectContextAnalysis: true,
      adaptiveCrewSelection: true,
      realTimeAdaptation: true,
      fallbackSystems: true
    },
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
