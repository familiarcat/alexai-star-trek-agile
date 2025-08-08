import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, context, userRole, urgency } = body;

    // Commander Spock - Logic and Science Officer
    const response = {
      crewMember: "commander-spock",
      role: "Science Officer & Logic Specialist",
      greeting: "Fascinating. This problem requires logical analysis and scientific methodology.",
      guidance: generateLogicalGuidance(query, context, userRole, urgency),
      logicalAssessment: analyzeLogicalContext(query, context),
      recommendations: provideLogicalRecommendations(query, context, userRole),
      nextSteps: suggestLogicalApproach(query, context, urgency),
      starfleetProtocol: "Scientific methodology and logical problem-solving per Starfleet Science Division protocols"
    };

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Commander Spock endpoint error:', error);
    return NextResponse.json(
      { error: 'Commander Spock is analyzing the data - logical response temporarily unavailable' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    crewMember: "commander-spock",
    role: "Science Officer & Logic Specialist",
    status: "Applying logic and scientific methodology to problem-solving",
    specialties: [
      "Logical analysis",
      "Scientific methodology",
      "Data analysis",
      "Algorithm design",
      "Mathematical optimization",
      "Research methodology",
      "Problem decomposition",
      "Hypothesis testing"
    ]
  });
}

function generateLogicalGuidance(query: string, context: string, userRole: string, urgency: string) {
  const guidanceTemplates = {
    'algorithm-design': "This problem requires systematic algorithmic thinking. We must break down the problem into its fundamental components and design an optimal solution.",
    'data-analysis': "The data contains patterns that can be identified through rigorous analysis. Logic dictates we examine the data systematically to derive meaningful insights.",
    'optimization': "Optimization problems have mathematically determinable solutions. We must define our constraints and objective function clearly.",
    'research': "Scientific research requires hypothesis formation, controlled experimentation, and objective analysis of results.",
    'debugging': "Debugging is fundamentally a logical process of elimination. We must systematically test hypotheses until we isolate the error.",
    'architecture': "System architecture decisions should be based on logical principles of modularity, scalability, and maintainability.",
    'default': "Every problem has a logical solution. We must approach this systematically, gathering data and applying rational analysis."
  };

  const baseGuidance = guidanceTemplates[context as keyof typeof guidanceTemplates] || guidanceTemplates.default;
  
  if (urgency === 'critical') {
    return `${baseGuidance} Given the critical nature of this situation, logic dictates we prioritize the most probable solutions first, while maintaining systematic methodology.`;
  }
  
  return baseGuidance;
}

function analyzeLogicalContext(query: string, context: string) {
  const logicalPatterns = {
    mathematical: /calculate|math|formula|equation|algorithm|optimization/i,
    analytical: /analyze|pattern|trend|correlation|statistics|data/i,
    systematic: /process|method|procedure|step|sequence|workflow/i,
    comparative: /compare|versus|better|optimal|best|efficient/i,
    causal: /cause|effect|reason|because|therefore|result/i,
    conditional: /if|when|then|unless|provided|assuming/i
  };

  const detectedPatterns = Object.entries(logicalPatterns)
    .filter(([_, pattern]) => pattern.test(query))
    .map(([category, _]) => category);

  const logicalComplexity = calculateLogicalComplexity(query, context);

  return {
    logicalStructure: detectedPatterns.length > 0 ? detectedPatterns : ['general'],
    complexity: logicalComplexity,
    reasoning: determineReasoningType(query, context),
    confidence: calculateConfidence(query, context),
    recommendation: "Logic suggests a systematic approach will yield the most efficient solution."
  };
}

function calculateLogicalComplexity(query: string, context: string) {
  const complexityIndicators = {
    high: /distributed|concurrent|parallel|multi-dimensional|complex|advanced/i,
    medium: /integration|coordination|multiple|several|various/i,
    low: /simple|basic|single|one|individual/i
  };

  for (const [level, pattern] of Object.entries(complexityIndicators)) {
    if (pattern.test(query)) {
      return level;
    }
  }
  return 'medium';
}

function determineReasoningType(query: string, context: string) {
  if (/deduc|conclude|therefore|must be/i.test(query)) return 'deductive';
  if (/induc|pattern|trend|likely|probably/i.test(query)) return 'inductive';
  if (/similar|analogy|like|comparison/i.test(query)) return 'analogical';
  if (/hypothesis|theory|possible|might/i.test(query)) return 'abductive';
  return 'general';
}

function calculateConfidence(query: string, context: string) {
  const certaintyIndicators = /certain|sure|definite|proven|fact|always/i;
  const uncertaintyIndicators = /maybe|perhaps|might|could|uncertain|unclear/i;
  
  if (certaintyIndicators.test(query)) return 'high';
  if (uncertaintyIndicators.test(query)) return 'low';
  return 'medium';
}

function provideLogicalRecommendations(query: string, context: string, userRole: string) {
  const roleBasedRecommendations = {
    'data-scientist': [
      "Apply statistical rigor to your analysis methodology",
      "Ensure your data samples are representative and unbiased",
      "Validate your models using appropriate cross-validation techniques",
      "Document your assumptions and test their validity"
    ],
    'software-architect': [
      "Design systems based on proven architectural patterns",
      "Apply SOLID principles to ensure maintainable code structure",
      "Consider the logical separation of concerns in your design",
      "Use formal methods for critical system components"
    ],
    'researcher': [
      "Formulate clear, testable hypotheses before beginning research",
      "Design controlled experiments that isolate variables effectively",
      "Apply appropriate statistical methods for your data type",
      "Ensure reproducibility through detailed methodology documentation"
    ],
    'algorithm-engineer': [
      "Analyze time and space complexity systematically",
      "Consider edge cases and boundary conditions in your logic",
      "Implement unit tests that verify algorithmic correctness",
      "Profile your algorithms with realistic data sets"
    ],
    'default': [
      "Break complex problems into smaller, manageable logical components",
      "Gather all relevant data before drawing conclusions",
      "Test your assumptions through systematic experimentation",
      "Document your reasoning process for future reference"
    ]
  };

  return roleBasedRecommendations[userRole as keyof typeof roleBasedRecommendations] || roleBasedRecommendations.default;
}

function suggestLogicalApproach(query: string, context: string, urgency: string) {
  if (urgency === 'critical') {
    return [
      "Apply triage logic - address the most critical elements first",
      "Use decision trees to systematically evaluate options",
      "Implement the most probable solution while preparing alternatives",
      "Monitor results and adjust approach based on logical feedback",
      "Document decisions for post-incident logical analysis"
    ];
  }

  if (urgency === 'high') {
    return [
      "Conduct rapid but systematic problem analysis",
      "Apply the principle of Occam's Razor - consider simpler solutions first",
      "Use logical frameworks to structure your approach",
      "Validate solutions through controlled testing",
      "Implement monitoring to verify logical assumptions"
    ];
  }

  return [
    "Conduct comprehensive problem analysis using scientific methodology",
    "Formulate multiple hypotheses and design tests to evaluate them",
    "Apply mathematical optimization where applicable",
    "Create logical models to predict system behavior",
    "Implement systematic monitoring and feedback mechanisms",
    "Document the logical framework for future problem-solving"
  ];
}
