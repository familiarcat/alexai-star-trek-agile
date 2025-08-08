import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, context, userRole, urgency } = body;

    // Counselor Troi - Emotional Intelligence and Human Relations
    const response = {
      crewMember: "counselor-troi",
      role: "Counselor & Emotional Intelligence Specialist",
      greeting: "I sense your feelings about this matter. Let me help you process this.",
      guidance: generateEmpathicGuidance(query, context, userRole, urgency),
      emotionalAssessment: analyzeEmotionalContext(query, context),
      recommendations: provideSupportRecommendations(query, context, userRole),
      nextSteps: suggestEmotionalApproach(query, context, urgency),
      starfleetProtocol: "Emotional support and interpersonal guidance per Starfleet counseling protocols"
    };

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Counselor Troi endpoint error:', error);
    return NextResponse.json(
      { error: 'Counselor Troi is temporarily unavailable for emotional guidance' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    crewMember: "counselor-troi",
    role: "Counselor & Emotional Intelligence Specialist",
    status: "Available for emotional support and interpersonal guidance",
    specialties: [
      "Emotional intelligence",
      "Team dynamics",
      "Conflict resolution",
      "Stress management",
      "Communication improvement",
      "Personal development"
    ]
  });
}

function generateEmpathicGuidance(query: string, context: string, userRole: string, urgency: string) {
  const guidanceTemplates = {
    'emotional-support': "I can sense you're experiencing significant emotional stress. This is completely natural when facing challenging situations. Let's work through these feelings together.",
    'team-conflict': "There are strong emotions present in this team dynamic. I recommend addressing the underlying feelings before tackling the technical issues.",
    'stress-management': "The pressure you're feeling is affecting your well-being. Let's explore some techniques to manage this stress more effectively.",
    'communication': "I sense there may be unspoken concerns affecting communication. Open, honest dialogue often resolves these tensions.",
    'personal-development': "Your growth mindset is admirable. Personal development requires both self-awareness and patience with the process.",
    'default': "I'm here to provide emotional support and help you navigate the interpersonal aspects of this situation."
  };

  const baseGuidance = guidanceTemplates[context as keyof typeof guidanceTemplates] || guidanceTemplates.default;
  
  if (urgency === 'critical') {
    return `${baseGuidance} Given the urgency of this situation, I recommend taking a moment to center yourself before proceeding. Emotional clarity will improve your decision-making.`;
  }
  
  return baseGuidance;
}

function analyzeEmotionalContext(query: string, context: string) {
  const emotionalIndicators = {
    stress: query.toLowerCase().includes('overwhelmed') || query.toLowerCase().includes('stressed') || query.toLowerCase().includes('pressure'),
    frustration: query.toLowerCase().includes('frustrated') || query.toLowerCase().includes('annoying') || query.toLowerCase().includes('difficult'),
    anxiety: query.toLowerCase().includes('worried') || query.toLowerCase().includes('anxious') || query.toLowerCase().includes('nervous'),
    excitement: query.toLowerCase().includes('excited') || query.toLowerCase().includes('great') || query.toLowerCase().includes('amazing'),
    confusion: query.toLowerCase().includes('confused') || query.toLowerCase().includes('unclear') || query.toLowerCase().includes('don\'t understand')
  };

  const detectedEmotions = Object.entries(emotionalIndicators)
    .filter(([_, present]) => present)
    .map(([emotion, _]) => emotion);

  return {
    primaryEmotions: detectedEmotions.length > 0 ? detectedEmotions : ['neutral'],
    intensity: urgency === 'critical' ? 'high' : urgency === 'high' ? 'moderate' : 'low',
    context: context || 'general',
    recommendation: detectedEmotions.length > 0 
      ? "I recommend addressing these emotional aspects alongside the technical requirements."
      : "The emotional context appears balanced. Proceed with confidence."
  };
}

function provideSupportRecommendations(query: string, context: string, userRole: string) {
  const roleBasedSupport = {
    'junior-developer': [
      "Remember that feeling overwhelmed is part of the learning process",
      "Consider pairing with a senior team member for guidance",
      "Break complex tasks into smaller, manageable steps",
      "Celebrate small victories along the way"
    ],
    'senior-developer': [
      "Your experience is valuable - trust your instincts",
      "Consider mentoring others as a way to reinforce your own knowledge",
      "Balance technical excellence with team emotional well-being",
      "Lead by example in managing stress and maintaining perspective"
    ],
    'project-manager': [
      "Focus on team emotional health alongside project metrics",
      "Regular check-ins can prevent small issues from becoming major problems",
      "Consider the human impact of project decisions",
      "Foster an environment where team members feel safe expressing concerns"
    ],
    'default': [
      "Practice active listening when communicating with team members",
      "Take regular breaks to maintain emotional and mental clarity",
      "Seek support when needed - it's a sign of wisdom, not weakness",
      "Remember that both technical and emotional intelligence are valuable"
    ]
  };

  return roleBasedSupport[userRole as keyof typeof roleBasedSupport] || roleBasedSupport.default;
}

function suggestEmotionalApproach(query: string, context: string, urgency: string) {
  if (urgency === 'critical') {
    return [
      "Take 3 deep breaths to center yourself",
      "Focus on immediate emotional stability first",
      "Communicate calmly with stakeholders about the situation",
      "Seek immediate support from team members if needed"
    ];
  }

  return [
    "Reflect on the emotional aspects of this challenge",
    "Consider how this situation affects team dynamics",
    "Approach solutions with both logic and empathy",
    "Schedule follow-up discussions to ensure emotional well-being"
  ];
}
