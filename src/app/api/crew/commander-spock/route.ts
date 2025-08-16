import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context, userRole, urgency, complexity } = body;

    // Commander Spock's logical analysis and scientific reasoning
    const spockAnalysis = {
      crewMember: 'commander-spock',
      role: 'Science Officer & First Officer',
      query,
      context: context || 'general',
      userRole: userRole || 'developer',
      urgency: urgency || 'normal',
      complexity: complexity || 'medium',

      // Spock's logical analysis
      logicalAnalysis: {
        primaryQuery: analyzeQuery(query),
        contextAssessment: assessContext(context),
        complexityEvaluation: evaluateComplexity(complexity),
        urgencyAnalysis: analyzeUrgency(urgency),
        scientificApproach: determineScientificApproach(query, context)
      },

      // Spock's recommendations
      recommendations: {
        immediate: generateImmediateActions(query, context),
        shortTerm: generateShortTermStrategy(query, context),
        longTerm: generateLongTermVision(query, context)
      },

      // Spock's scientific insights
      scientificInsights: {
        methodology: 'Apply scientific method and logical reasoning',
        riskAssessment: performRiskAssessment(query, context),
        probabilityAnalysis: calculateProbability(query, context),
        culturalConsiderations: assessCulturalFactors(query, context),
        diplomaticApproach: determineDiplomaticStrategy(query, context)
      },

      // Spock's signature response
      spockWisdom: 'Logic is the beginning of wisdom, not the end. The needs of the many outweigh the needs of the few.',
      timestamp: new Date().toISOString(),
      confidence: 0.97
    };

    return NextResponse.json(spockAnalysis);

  } catch (error) {
    console.error('Commander Spock API Error:', error);
    return NextResponse.json(
      {
        error: 'Commander Spock is temporarily unavailable. Please try again later.',
        crewMember: 'commander-spock',
        status: 'error'
      },
      { status: 500 }
    );
  }
}

// Logical Analysis Functions
function analyzeQuery(query: string) {
  const queryLower = query.toLowerCase();
  if (queryLower.includes('technical') || queryLower.includes('engineering')) {
    return 'Technical analysis required - applying engineering principles';
  } else if (queryLower.includes('scientific') || queryLower.includes('research')) {
    return 'Scientific inquiry detected - implementing research methodology';
  } else if (queryLower.includes('logical') || queryLower.includes('reasoning')) {
    return 'Logical reasoning requested - applying analytical frameworks';
  } else {
    return 'General analysis - applying standard scientific method';
  }
}

function assessContext(context: string) {
  const contextLower = context.toLowerCase();
  if (contextLower.includes('system') || contextLower.includes('technical')) {
    return 'Technical context - requires systematic analysis';
  } else if (contextLower.includes('crew') || contextLower.includes('team')) {
    return 'Crew context - requires interpersonal analysis';
  } else if (contextLower.includes('mission') || contextLower.includes('project')) {
    return 'Mission context - requires strategic analysis';
  } else {
    return 'General context - applying standard protocols';
  }
}

function evaluateComplexity(complexity: string) {
  switch (complexity) {
    case 'low':
      return 'Low complexity - straightforward logical solution';
    case 'medium':
      return 'Medium complexity - requires systematic analysis';
    case 'high':
      return 'High complexity - requires advanced logical frameworks';
    case 'expert':
      return 'Expert complexity - requires multidisciplinary approach';
    default:
      return 'Standard complexity - applying logical protocols';
  }
}

function analyzeUrgency(urgency: string) {
  switch (urgency) {
    case 'low':
      return 'Low urgency - proceed with thorough analysis';
    case 'normal':
      return 'Normal urgency - balanced approach recommended';
    case 'high':
      return 'High urgency - expedited logical analysis required';
    case 'critical':
      return 'Critical urgency - immediate logical response necessary';
    default:
      return 'Standard urgency - proceed with logical protocols';
  }
}

function determineScientificApproach(query: string, context: string) {
  const queryLower = query.toLowerCase();
  const contextLower = context.toLowerCase();
  
  if (queryLower.includes('experiment') || contextLower.includes('research')) {
    return 'Experimental methodology with hypothesis testing';
  } else if (queryLower.includes('analysis') || contextLower.includes('data')) {
    return 'Data analysis with statistical validation';
  } else if (queryLower.includes('observation') || contextLower.includes('monitoring')) {
    return 'Observational study with systematic recording';
  } else {
    return 'Scientific method with logical reasoning';
  }
}

function performRiskAssessment(query: string, context: string) {
  const queryLower = query.toLowerCase();
  const contextLower = context.toLowerCase();
  
  let riskLevel = 'low';
  let riskFactors = [];
  
  if (queryLower.includes('security') || contextLower.includes('safety')) {
    riskLevel = 'high';
    riskFactors.push('Security implications', 'Safety protocols required');
  }
  
  if (queryLower.includes('critical') || contextLower.includes('urgent')) {
    riskLevel = 'high';
    riskFactors.push('Time sensitivity', 'Critical path dependencies');
  }
  
  if (queryLower.includes('experimental') || contextLower.includes('untested')) {
    riskLevel = 'medium';
    riskFactors.push('Unproven methods', 'Experimental protocols');
  }
  
  return {
    level: riskLevel,
    factors: riskFactors.length > 0 ? riskFactors : ['Standard operational risks'],
    mitigation: 'Apply logical protocols and safety measures'
  };
}

function calculateProbability(query: string, context: string) {
  const queryLower = query.toLowerCase();
  const contextLower = context.toLowerCase();
  
  if (queryLower.includes('success') || contextLower.includes('achievement')) {
    return {
      success: '85-90%',
      factors: ['Proven methodologies', 'Experienced crew', 'Clear objectives'],
      confidence: 'High'
    };
  } else if (queryLower.includes('failure') || contextLower.includes('risk')) {
    return {
      failure: '15-20%',
      factors: ['Unknown variables', 'Complex interactions', 'Resource constraints'],
      confidence: 'Medium'
    };
  } else {
    return {
      outcome: 'Variable',
      factors: ['Context dependent', 'Multiple variables', 'Dynamic situation'],
      confidence: 'Moderate'
    };
  }
}

function assessCulturalFactors(query: string, context: string) {
  const queryLower = query.toLowerCase();
  const contextLower = context.toLowerCase();
  
  if (queryLower.includes('crew') || contextLower.includes('team')) {
    return {
      culturalAspects: ['Interpersonal dynamics', 'Communication styles', 'Cultural backgrounds'],
      recommendations: 'Apply cultural sensitivity protocols',
      diplomaticApproach: 'Respectful and inclusive communication'
    };
  } else if (queryLower.includes('external') || contextLower.includes('alien')) {
    return {
      culturalAspects: ['External cultural norms', 'Diplomatic protocols', 'Cultural exchange'],
      recommendations: 'Apply first contact protocols',
      diplomaticApproach: 'Cultural exchange and mutual understanding'
    };
  } else {
    return {
      culturalAspects: ['Standard protocols', 'Familiar frameworks', 'Established procedures'],
      recommendations: 'Apply standard cultural protocols',
      diplomaticApproach: 'Standard diplomatic procedures'
    };
  }
}

function determineDiplomaticStrategy(query: string, context: string) {
  const queryLower = query.toLowerCase();
  const contextLower = context.toLowerCase();
  
  if (queryLower.includes('conflict') || contextLower.includes('dispute')) {
    return 'Conflict resolution with logical mediation';
  } else if (queryLower.includes('negotiation') || contextLower.includes('agreement')) {
    return 'Logical negotiation with mutual benefit focus';
  } else if (queryLower.includes('cooperation') || contextLower.includes('collaboration')) {
    return 'Collaborative approach with shared objectives';
  } else {
    return 'Standard diplomatic protocols with logical reasoning';
  }
}

function generateImmediateActions(query: string, context: string) {
  return [
    'Apply logical analysis to current situation',
    'Assess immediate risks and opportunities',
    'Implement appropriate safety protocols',
    'Coordinate with relevant crew members',
    'Establish baseline measurements for analysis'
  ];
}

function generateShortTermStrategy(query: string, context: string) {
  return [
    'Develop systematic approach to problem-solving',
    'Implement logical frameworks for analysis',
    'Establish monitoring and measurement protocols',
    'Coordinate with scientific and technical teams',
    'Prepare contingency plans based on logical assessment'
  ];
}

function generateLongTermVision(query: string, context: string) {
  return [
    'Establish long-term scientific research protocols',
    'Develop comprehensive logical analysis frameworks',
    'Create sustainable problem-solving methodologies',
    'Build interdisciplinary scientific collaboration',
    'Establish continuous improvement and learning systems'
  ];
}
