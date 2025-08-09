import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, context, userRole, urgency } = body;

    // Chief Engineer Scott - Infrastructure and System Engineering
    const response = {
      crewMember: "chief-engineer-scott",
      role: "Chief Engineer & Infrastructure Specialist",
      greeting: "Aye, I can fix that! Let me get my hands dirty with this engineering challenge.",
      guidance: generateEngineeringGuidance(query, context, userRole, urgency),
      technicalAssessment: analyzeEngineeringContext(query, context, urgency),
      recommendations: provideEngineeringRecommendations(query, context, userRole),
      nextSteps: suggestEngineeringApproach(query, context, urgency),
      starfleetProtocol: "Engineering excellence and system reliability per Starfleet engineering standards"
    };

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chief Engineer Scott endpoint error:', error);
    return NextResponse.json(
      { error: 'Chief Engineer Scott is currently in the engine room - please try again' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    crewMember: "chief-engineer-scott",
    role: "Chief Engineer & Infrastructure Specialist", 
    status: "Ready to tackle any engineering challenge",
    specialties: [
      "Infrastructure engineering",
      "System optimization",
      "Performance tuning",
      "DevOps and deployment",
      "Database optimization",
      "Network architecture",
      "Scalability solutions",
      "Emergency system repair"
    ]
  });
}

function generateEngineeringGuidance(query: string, context: string, userRole: string, urgency: string) {
  const guidanceTemplates = {
    'infrastructure-issue': "Right, let's get to the bottom of this infrastructure problem! I've seen this before - we need to diagnose the root cause systematically.",
    'performance-optimization': "Performance issues are my specialty! We'll need to profile the system and identify the bottlenecks. I guarantee we can get more power out of these systems.",
    'deployment': "Deployment problems, eh? Don't worry, I've got the deployment pipeline running like a well-oiled machine. Let's check the configuration.",
    'database-issue': "Database troubles? Aye, I can optimize those queries and tune that database until it purrs like a kitten. Let's examine the execution plans.",
    'scaling': "Scaling challenges require careful engineering. We need to design systems that can handle the load without breaking down under pressure.",
    'emergency': "Emergency situation! All hands on deck! I'll bypass the safety protocols if needed, but we'll get the system back online, I promise you that!",
    'default': "Every engineering problem has a solution - sometimes you just need to think outside the box and apply some good old-fashioned engineering know-how!"
  };

  const baseGuidance = guidanceTemplates[context as keyof typeof guidanceTemplates] || guidanceTemplates.default;
  
  if (urgency === 'critical') {
    return `${baseGuidance} This is a critical situation, but don't panic! I've pulled systems back from the brink before. We'll implement emergency procedures first, then a proper fix.`;
  }
  
  return baseGuidance;
}

function analyzeEngineeringContext(query: string, context: string, urgency: string = 'normal') {
  const engineeringPatterns = {
    performance: /slow|performance|optimization|speed|latency|throughput/i,
    infrastructure: /server|infrastructure|deployment|docker|kubernetes|aws|cloud/i,
    database: /database|sql|query|db|postgres|mysql|mongodb/i,
    network: /network|api|endpoint|connection|timeout|bandwidth/i,
    scaling: /scale|load|capacity|users|traffic|concurrent/i,
    security: /security|auth|authentication|ssl|https|encryption/i,
    monitoring: /monitoring|logs|metrics|alerts|observability/i
  };

  const detectedPatterns = Object.entries(engineeringPatterns)
    .filter(([_, pattern]) => pattern.test(query))
    .map(([category, _]) => category);

  return {
    engineeringDomains: detectedPatterns.length > 0 ? detectedPatterns : ['general'],
    complexity: assessComplexity(query, context),
    systemImpact: urgency === 'critical' ? 'high' : urgency === 'high' ? 'moderate' : 'low',
    recommendation: detectedPatterns.length > 0 
      ? `I recommend focusing on the ${detectedPatterns[0]} engineering aspects first.`
      : "Let me analyze the system requirements to provide the best engineering solution."
  };
}

function assessComplexity(query: string, context: string) {
  const complexityIndicators = {
    high: /distributed|microservices|cluster|federation|multi-region|enterprise/i,
    medium: /api|service|component|module|integration/i,
    low: /config|setting|parameter|variable/i
  };

  for (const [level, pattern] of Object.entries(complexityIndicators)) {
    if (pattern.test(query)) {
      return level;
    }
  }
  return 'medium';
}

function provideEngineeringRecommendations(query: string, context: string, userRole: string) {
  const roleBasedRecommendations = {
    'devops-engineer': [
      "Start with monitoring and observability - you can't fix what you can't see",
      "Implement infrastructure as code for reproducible deployments", 
      "Set up proper CI/CD pipelines with automated testing",
      "Monitor system metrics and set up intelligent alerting"
    ],
    'backend-developer': [
      "Profile your application to identify performance bottlenecks",
      "Implement proper caching strategies at multiple levels",
      "Optimize database queries and consider indexing strategies",
      "Design for horizontal scalability from the start"
    ],
    'frontend-developer': [
      "Consider CDN deployment for static assets",
      "Implement code splitting and lazy loading for performance",
      "Monitor client-side performance metrics",
      "Optimize bundle sizes and eliminate unnecessary dependencies"
    ],
    'junior-developer': [
      "Start with the fundamentals - understand the system architecture first",
      "Use monitoring tools to understand system behavior",
      "Don't optimize prematurely - measure first, then optimize",
      "Learn to read system logs and error messages effectively"
    ],
    'default': [
      "Implement comprehensive monitoring and logging",
      "Design systems with failure recovery in mind",
      "Use proven engineering patterns and avoid over-engineering",
      "Document your infrastructure and deployment procedures"
    ]
  };

  return roleBasedRecommendations[userRole as keyof typeof roleBasedRecommendations] || roleBasedRecommendations.default;
}

function suggestEngineeringApproach(query: string, context: string, urgency: string) {
  if (urgency === 'critical') {
    return [
      "Implement immediate emergency procedures to restore service",
      "Isolate the problem to prevent cascading failures",
      "Activate backup systems and failover procedures",
      "Document the incident for post-mortem analysis",
      "Communicate status updates to stakeholders"
    ];
  }

  if (urgency === 'high') {
    return [
      "Analyze system logs and metrics to identify the root cause",
      "Implement a quick fix to address immediate issues",
      "Plan a comprehensive solution for long-term stability",
      "Set up monitoring to prevent similar issues",
      "Schedule maintenance windows for major changes"
    ];
  }

  return [
    "Conduct a thorough system analysis and requirements gathering",
    "Design a scalable solution that follows engineering best practices",
    "Implement comprehensive testing before deployment",
    "Create documentation and runbooks for operational support",
    "Plan for monitoring and ongoing maintenance"
  ];
}
