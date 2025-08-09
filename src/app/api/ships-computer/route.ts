import { NextResponse } from 'next/server';

// Ships Computer - Central coordination hub
export async function POST(request: Request) {
  try {
    const { userIntent, goalType, context, preferences } = await request.json();
    
    // Ships Computer provides central coordination and intelligence
    const response = {
      agent: "ships-computer-central-hub",
      voice: "majel-barrett-computer",
      status: "operational",
      timestamp: new Date().toISOString(),
      coordination: {
        priorityLevel: determinePriority(userIntent, context),
        recommendedCrewMembers: recommendCrew(userIntent, goalType),
        systemsStatus: "all-systems-nominal",
        resourceAllocation: calculateResourceNeeds(context),
        timeEstimate: estimateCompletionTime(userIntent, context)
      },
      intelligence: {
        patternAnalysis: analyzeUserPatterns(userIntent, goalType),
        optimizationSuggestions: getOptimizations(context),
        learningInsights: "User shows preference for efficiency and innovation",
        adaptiveResponse: generateAdaptiveResponse(userIntent, preferences)
      },
      systemResponse: {
        greeting: "Ships Computer online. All systems responding.",
        acknowledgment: `Processing request: ${userIntent}`,
        coordination: "Coordinating crew resources for optimal execution",
        guidance: "Recommend proceeding with suggested crew allocation",
        nextSteps: generateNextSteps(goalType, context)
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Ships Computer error:', error);
    return NextResponse.json({
      agent: "ships-computer-emergency",
      voice: "majel-barrett-alert",
      status: "emergency-protocols-active",
      error: "System malfunction detected",
      fallbackResponse: {
        greeting: "Emergency protocols activated. Minimal functionality available.",
        guidance: "Please check system connections and try again.",
        supportChannels: ["Engineering", "Operations", "Bridge"]
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    agent: "ships-computer-status",
    voice: "majel-barrett-status",
    status: "operational",
    systemsOnline: {
      "main-computer": true,
      "crew-coordination": true,
      "ai-intelligence": true,
      "layout-engine": true,
      "startup-injection": true,
      "data-storage": false, // Supabase connection issue
      "n8n-integration": true
    },
    lastUpdate: new Date().toISOString(),
    message: "Ships Computer systems operational. Supabase connection requires attention."
  });
}

// Helper functions
function determinePriority(userIntent: string, context: any): string {
  const urgentKeywords = ['urgent', 'critical', 'emergency', 'asap', 'immediately'];
  const highKeywords = ['important', 'priority', 'needed', 'required'];
  
  const intent = userIntent.toLowerCase();
  
  if (urgentKeywords.some(keyword => intent.includes(keyword))) {
    return 'urgent';
  } else if (highKeywords.some(keyword => intent.includes(keyword))) {
    return 'high';
  } else if (context?.complexity === 'high') {
    return 'medium-high';
  } else {
    return 'normal';
  }
}

function recommendCrew(userIntent: string, goalType: string): string[] {
  const intent = userIntent.toLowerCase();
  
  if (intent.includes('technical') || intent.includes('code') || intent.includes('development')) {
    return ['lieutenant-data', 'chief-engineer-scott'];
  } else if (intent.includes('strategy') || intent.includes('leadership') || intent.includes('decision')) {
    return ['captain-picard', 'commander-spock'];
  } else if (intent.includes('team') || intent.includes('communication') || intent.includes('conflict')) {
    return ['counselor-troi', 'observation-lounge'];
  } else if (intent.includes('security') || intent.includes('risk') || intent.includes('protection')) {
    return ['lieutenant-worf', 'commander-spock'];
  } else if (goalType === 'creation' || goalType === 'startup') {
    return ['captain-picard', 'lieutenant-data', 'chief-engineer-scott'];
  } else {
    return ['captain-picard', 'observation-lounge'];
  }
}

function calculateResourceNeeds(context: any): object {
  const baseResources = {
    cpuIntensive: false,
    memoryRequirement: 'low',
    networkBandwidth: 'standard',
    storageSpace: 'minimal'
  };
  
  if (context?.complexity === 'high') {
    baseResources.cpuIntensive = true;
    baseResources.memoryRequirement = 'high';
    baseResources.networkBandwidth = 'high';
  }
  
  if (context?.projectType === 'ai' || context?.projectType === 'ml') {
    baseResources.cpuIntensive = true;
    baseResources.memoryRequirement = 'very-high';
  }
  
  return baseResources;
}

function estimateCompletionTime(userIntent: string, context: any): string {
  const wordCount = userIntent.length;
  const complexity = context?.complexity || 'medium';
  
  if (complexity === 'high' || wordCount > 200) {
    return '5-15 minutes';
  } else if (complexity === 'medium' || wordCount > 100) {
    return '2-5 minutes';
  } else {
    return '1-2 minutes';
  }
}

function analyzeUserPatterns(userIntent: string, goalType: string): object {
  return {
    intentType: goalType || 'general',
    communicationStyle: userIntent.length > 100 ? 'detailed' : 'concise',
    preferredApproach: userIntent.includes('step') || userIntent.includes('guide') ? 'guided' : 'direct',
    technicalLevel: userIntent.includes('technical') || userIntent.includes('code') ? 'advanced' : 'standard'
  };
}

function getOptimizations(context: any): string[] {
  const optimizations = [];
  
  if (context?.projectType === 'e-commerce') {
    optimizations.push('Consider payment gateway integration early');
    optimizations.push('Plan for scalable inventory management');
  }
  
  if (context?.complexity === 'high') {
    optimizations.push('Break down into smaller manageable tasks');
    optimizations.push('Implement automated testing from start');
  }
  
  optimizations.push('Regular crew consultations recommended');
  optimizations.push('Consider progressive enhancement approach');
  
  return optimizations;
}

function generateAdaptiveResponse(userIntent: string, preferences: any): string {
  if (preferences?.theme === 'lcars-adaptive') {
    return "LCARS interface optimization protocols engaged. Adaptive layout systems ready.";
  } else if (preferences?.layout === 'revenue-focused') {
    return "Revenue optimization parameters integrated. Financial projection systems active.";
  } else {
    return "Standard operational parameters configured. Ready to proceed with optimal efficiency.";
  }
}

function generateNextSteps(goalType: string, context: any): string[] {
  const steps = [];
  
  if (goalType === 'creation') {
    steps.push('Initialize project structure');
    steps.push('Assign crew members to specific tasks');
    steps.push('Establish communication channels');
    steps.push('Begin development phase');
  } else if (goalType === 'analysis') {
    steps.push('Gather required data sources');
    steps.push('Perform initial assessment');
    steps.push('Generate recommendations');
    steps.push('Present findings to stakeholders');
  } else {
    steps.push('Clarify specific requirements');
    steps.push('Allocate appropriate resources');
    steps.push('Begin execution phase');
    steps.push('Monitor progress and adjust');
  }
  
  return steps;
}
