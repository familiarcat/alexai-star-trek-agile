import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Enhanced crew member capabilities with knowledge integration
export async function POST(request: Request) {
  try {
    const { agent, query, context, urgency = 'normal' } = await request.json();
    
    // Get agent-specific knowledge
    const knowledgeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/knowledge?agent=${agent}`, {
      method: 'GET'
    });
    
    const agentKnowledge = await knowledgeResponse.json();
    
    // Enhance agent capabilities based on knowledge access
    const enhancedResponse = await generateKnowledgeEnhancedResponse(
      agent,
      query,
      context,
      urgency,
      agentKnowledge
    );
    
    // Log this interaction for learning
    await logInteractionForLearning(agent, query, enhancedResponse, context);
    
    return NextResponse.json({
      agent,
      response: enhancedResponse,
      knowledgeUtilized: true,
      relevantDomains: agentKnowledge.relevantDomains,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Enhanced knowledge integration error:', error);
    return NextResponse.json(
      { error: 'Failed to process enhanced knowledge request' },
      { status: 500 }
    );
  }
}

async function generateKnowledgeEnhancedResponse(
  agent: string,
  query: string,
  context: string,
  urgency: string,
  agentKnowledge: any
) {
  const basePersonalities = {
    'captain-picard': {
      role: 'Strategic Leader',
      expertise: 'Leadership, diplomacy, strategic planning',
      knowledgeFocus: 'Project management, team coordination, high-level architecture'
    },
    'lieutenant-data': {
      role: 'Technical Operations Officer',
      expertise: 'Technical analysis, system operations, data processing',
      knowledgeFocus: 'Technical standards, operational procedures, system architecture'
    },
    'counselor-troi': {
      role: 'Emotional Intelligence Advisor',
      expertise: 'Team dynamics, user experience, emotional analysis',
      knowledgeFocus: 'Team psychology, user experience patterns, collaboration best practices'
    },
    'chief-engineer-scott': {
      role: 'Engineering Solutions Specialist',
      expertise: 'Technical implementation, system optimization, problem solving',
      knowledgeFocus: 'Engineering procedures, performance optimization, technical troubleshooting'
    },
    'commander-spock': {
      role: 'Logical Analysis Expert',
      expertise: 'Logical reasoning, system analysis, optimization',
      knowledgeFocus: 'Analytical frameworks, system evolution, logical decision trees'
    },
    'lieutenant-worf': {
      role: 'Security and Risk Management',
      expertise: 'Security protocols, risk assessment, system protection',
      knowledgeFocus: 'Security standards, threat assessment, protection procedures'
    }
  };
  
  const personality = basePersonalities[agent as keyof typeof basePersonalities];
  if (!personality) {
    return { message: 'Unknown agent', error: true };
  }
  
  // Generate knowledge-enhanced response based on agent expertise and available knowledge
  const knowledgeEnhancedResponse = {
    greeting: `${personality.role} reporting, with access to our comprehensive knowledge base.`,
    analysis: generateContextualAnalysis(query, personality, agentKnowledge, urgency),
    recommendations: generateKnowledgeBasedRecommendations(query, personality, agentKnowledge),
    knowledgeReferences: generateKnowledgeReferences(personality, agentKnowledge),
    nextSteps: generateActionableNextSteps(query, personality, urgency),
    learningNote: `This response incorporates insights from ${agentKnowledge.relevantDomains?.length || 0} knowledge domains.`
  };
  
  return knowledgeEnhancedResponse;
}

function generateContextualAnalysis(query: string, personality: any, agentKnowledge: any, urgency: string) {
  const urgencyModifier = urgency === 'high' ? 'immediate attention and ' : urgency === 'low' ? 'careful consideration and ' : '';
  
  return `Based on my analysis of "${query}" and access to our knowledge repositories, this requires ${urgencyModifier}${personality.expertise.toLowerCase()}. I'm drawing from ${agentKnowledge.relevantDomains?.length || 0} specialized knowledge domains to provide you with the most informed guidance.`;
}

function generateKnowledgeBasedRecommendations(query: string, personality: any, agentKnowledge: any) {
  const recommendations = [];
  
  // Generate recommendations based on agent role and available knowledge
  if (personality.role.includes('Strategic')) {
    recommendations.push('Review our strategic documentation in the foundations knowledge base');
    recommendations.push('Coordinate with relevant team members based on project management best practices');
    recommendations.push('Consider long-term implications using our architectural guidelines');
  } else if (personality.role.includes('Technical')) {
    recommendations.push('Consult our technical standards and operational procedures');
    recommendations.push('Review system architecture documentation for context');
    recommendations.push('Apply established coding guidelines and validation procedures');
  } else if (personality.role.includes('Emotional')) {
    recommendations.push('Consider team dynamics and collaboration patterns from our knowledge base');
    recommendations.push('Review user experience guidelines and best practices');
    recommendations.push('Apply emotional intelligence frameworks from our documentation');
  } else if (personality.role.includes('Engineering')) {
    recommendations.push('Reference our engineering procedures and technical troubleshooting guides');
    recommendations.push('Consider performance optimization strategies from our knowledge base');
    recommendations.push('Apply proven implementation patterns from our documentation');
  } else if (personality.role.includes('Logical')) {
    recommendations.push('Apply logical analysis frameworks from our knowledge repositories');
    recommendations.push('Review system evolution patterns and optimization strategies');
    recommendations.push('Consider analytical approaches documented in our standards');
  } else if (personality.role.includes('Security')) {
    recommendations.push('Apply security protocols and standards from our knowledge base');
    recommendations.push('Review threat assessment procedures and protection guidelines');
    recommendations.push('Consider risk management frameworks from our documentation');
  }
  
  return recommendations;
}

function generateKnowledgeReferences(personality: any, agentKnowledge: any) {
  return {
    primaryDomains: agentKnowledge.relevantDomains || [],
    suggestedReading: [
      `Check ${personality.knowledgeFocus} documentation`,
      'Review related standards and procedures',
      'Consult historical case studies and lessons learned'
    ],
    crossReferences: 'Consider consulting with other crew members for multi-domain expertise'
  };
}

function generateActionableNextSteps(query: string, personality: any, urgency: string) {
  const steps = [];
  
  if (urgency === 'high') {
    steps.push('Immediate action required - prioritize based on agent expertise');
    steps.push('Coordinate with relevant team members for rapid response');
    steps.push('Apply emergency procedures if applicable');
  } else {
    steps.push('Analyze the situation using available knowledge resources');
    steps.push('Develop comprehensive solution based on documented best practices');
    steps.push('Plan implementation following established procedures');
  }
  
  steps.push('Document learnings for future knowledge base enhancement');
  
  return steps;
}

async function logInteractionForLearning(agent: string, query: string, response: any, context: string) {
  try {
    const learningEntry = {
      timestamp: new Date().toISOString(),
      agent,
      query,
      context,
      responseQuality: 'enhanced-with-knowledge',
      knowledgeUtilized: true,
      learningOpportunity: 'Successful knowledge integration'
    };
    
    // Add to learning logs
    const learningPath = path.join(process.cwd(), 'alexai-knowledge-base', '05-evolution', 'learning-logs', 'agent-improvements');
    const filename = `${agent}-learning-${Date.now()}.md`;
    const content = `# Agent Learning Log: ${agent}\n\n**Date:** ${learningEntry.timestamp}\n**Query:** ${query}\n**Context:** ${context}\n\n## Response Quality\n${learningEntry.responseQuality}\n\n## Knowledge Integration\n✅ Successfully utilized knowledge base\n\n## Learning Opportunity\n${learningEntry.learningOpportunity}\n\n---\n*Auto-generated learning entry*`;
    
    await fs.writeFile(path.join(learningPath, filename), content, 'utf-8');
    
  } catch (error) {
    console.error('Failed to log learning entry:', error);
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Enhanced Knowledge Integration Active',
    capabilities: [
      'Knowledge-enhanced responses',
      'Agent-specific domain access',
      'Learning feedback loops',
      'Cross-domain recommendations'
    ],
    timestamp: new Date().toISOString()
  });
}
