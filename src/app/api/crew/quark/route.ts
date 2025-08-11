import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, context, priority = 'normal', crewMember, businessFocus } = await request.json();

    // Quark's enhanced crew-wide business analysis
    const profitAnalysis = analyzeProfitOpportunities(message, context, crewMember);
    const ethicalConsiderations = analyzeEthicalImplications(message, context, crewMember);
    const businessRecommendations = generateBusinessRecommendations(profitAnalysis, ethicalConsiderations, crewMember);
    const productivityTools = suggestProductivityTools(crewMember, businessFocus);
    const hierarchicalDashboard = generateHierarchicalDashboard(crewMember, businessFocus);

    const response = {
      agent: 'Quark',
      role: 'Crew-Wide Business Optimization & Profit Strategy',
      crewMember: crewMember || 'all',
      analysis: {
        profitOpportunities: profitAnalysis,
        ethicalImplications: ethicalConsiderations,
        businessRecommendations: businessRecommendations,
        productivityTools: productivityTools,
        hierarchicalDashboard: hierarchicalDashboard
      },
      ferengiWisdom: generateFerengiWisdom(context, crewMember),
      consultationFee: 'Free (this time, but remember me for future deals!)',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Quark is temporarily unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}

function analyzeProfitOpportunities(message: string, context: string, crewMember?: string) {
  const opportunities = [];
  
  // Universal profit opportunities
  if (message.toLowerCase().includes('market') || context.toLowerCase().includes('market')) {
    opportunities.push({
      type: 'Market Expansion',
      potential: 'High',
      estimatedProfit: '15-25% increase',
      timeframe: '3-6 months',
      risk: 'Medium',
      crewBenefit: 'All crew members gain from expanded market presence'
    });
  }
  
  if (message.toLowerCase().includes('scaling') || context.toLowerCase().includes('scaling')) {
    opportunities.push({
      type: 'Enterprise Scaling',
      potential: 'Very High',
      estimatedProfit: '30-50% increase',
      timeframe: '6-12 months',
      risk: 'Low',
      crewBenefit: 'Chief Engineer Scott\'s miracle worker protocols amplified'
    });
  }
  
  if (message.toLowerCase().includes('global') || context.toLowerCase().includes('global')) {
    opportunities.push({
      type: 'Global Expansion',
      potential: 'Extremely High',
      estimatedProfit: '50-100% increase',
      timeframe: '12-18 months',
      risk: 'Medium-High',
      crewBenefit: 'Captain Picard\'s diplomatic skills maximized'
    });
  }

  // Crew-specific profit opportunities
  if (crewMember) {
    switch (crewMember.toLowerCase()) {
      case 'captain picard':
        opportunities.push({
          type: 'Diplomatic Profit Optimization',
          potential: 'High',
          estimatedProfit: '20-30% increase',
          timeframe: '4-8 months',
          risk: 'Low',
          crewBenefit: 'Strategic partnerships and trade agreements'
        });
        break;
      case 'chief engineer scott':
        opportunities.push({
          type: 'Engineering Efficiency Profit',
          potential: 'Very High',
          estimatedProfit: '35-45% increase',
          timeframe: '2-6 months',
          risk: 'Very Low',
          crewBenefit: 'Miracle worker protocols generate cost savings'
        });
        break;
      case 'counselor troi':
        opportunities.push({
          type: 'Ethical Business Consulting',
          potential: 'Medium-High',
          estimatedProfit: '25-35% increase',
          timeframe: '6-12 months',
          risk: 'Low',
          crewBenefit: 'Ethical compliance reduces legal costs'
        });
        break;
      case 'commander data':
        opportunities.push({
          type: 'AI-Driven Profit Optimization',
          potential: 'Extremely High',
          estimatedProfit: '40-60% increase',
          timeframe: '3-9 months',
          risk: 'Low',
          crewBenefit: 'Data-driven decisions maximize efficiency'
        });
        break;
      case 'lieutenant worf':
        opportunities.push({
          type: 'Security-Enhanced Profit',
          potential: 'High',
          estimatedProfit: '20-30% increase',
          timeframe: '4-8 months',
          risk: 'Low',
          crewBenefit: 'Reduced security incidents protect profits'
        });
        break;
      case 'ships computer':
        opportunities.push({
          type: 'System-Wide Profit Coordination',
          potential: 'Very High',
          estimatedProfit: '30-50% increase',
          timeframe: '1-6 months',
          risk: 'Very Low',
          crewBenefit: 'Centralized optimization benefits all systems'
        });
        break;
    }
  }

  return opportunities;
}

function analyzeEthicalImplications(message: string, context: string, crewMember?: string) {
  const implications = [];
  
  // Universal ethical considerations
  implications.push({
    aspect: 'Customer Welfare',
    consideration: 'Ensure our profit doesn\'t harm user experience',
    troiApproval: 'Required',
    crewBenefit: 'All crew members maintain ethical standards'
  });
  
  implications.push({
    aspect: 'Market Fairness',
    consideration: 'Maintain competitive but fair business practices',
    troiApproval: 'Required',
    crewBenefit: 'Sustainable long-term growth for all'
  });
  
  implications.push({
    aspect: 'Long-term Sustainability',
    consideration: 'Profit today vs. sustainable growth tomorrow',
    troiApproval: 'Recommended',
    crewBenefit: 'Future-proofing our business model'
  });

  // Crew-specific ethical considerations
  if (crewMember) {
    switch (crewMember.toLowerCase()) {
      case 'captain picard':
        implications.push({
          aspect: 'Diplomatic Integrity',
          consideration: 'Maintain Federation values in business dealings',
          troiApproval: 'Required',
          crewBenefit: 'Preserves our reputation and trust'
        });
        break;
      case 'chief engineer scott':
        implications.push({
          aspect: 'Engineering Ethics',
          consideration: 'Ensure safety standards aren\'t compromised for profit',
          troiApproval: 'Required',
          crewBenefit: 'Protects crew and vessel integrity'
        });
        break;
      case 'counselor troi':
        implications.push({
          aspect: 'Emotional Intelligence',
          consideration: 'Balance profit motives with empathic understanding',
          troiApproval: 'Required',
          crewBenefit: 'Maintains our human-centered approach'
        });
        break;
    }
  }

  return implications;
}

function generateBusinessRecommendations(profitAnalysis: any[], ethicalConsiderations: any[], crewMember?: string) {
  const recommendations = [];
  
  if (profitAnalysis.length > 0) {
    recommendations.push({
      action: 'Immediate Profit Optimization',
      description: 'Focus on low-risk, high-return opportunities first',
      priority: 'High',
      ethicalApproval: 'Confirmed',
      crewBenefit: 'All crew members gain from immediate improvements'
    });
  }
  
  if (ethicalConsiderations.some(c => c.troiApproval === 'Required')) {
    recommendations.push({
      action: 'Ethical Review Process',
      description: 'Consult with Counselor Troi before proceeding',
      priority: 'Critical',
      ethicalApproval: 'Pending',
      crewBenefit: 'Ensures all decisions align with our values'
    });
  }
  
  recommendations.push({
    action: 'Balanced Growth Strategy',
    description: 'Combine profit maximization with ethical business practices',
    priority: 'Medium',
    ethicalApproval: 'Confirmed',
    crewBenefit: 'Sustainable success for the entire crew'
  });

  // Crew-specific recommendations
  if (crewMember) {
    recommendations.push({
      action: `${crewMember} Profit Optimization`,
      description: `Customized profit strategies for ${crewMember}'s unique capabilities`,
      priority: 'High',
      ethicalApproval: 'Confirmed',
      crewBenefit: `Maximizes ${crewMember}'s contribution to overall success`
    });
  }

  return recommendations;
}

function suggestProductivityTools(crewMember?: string, businessFocus?: string) {
  const tools = [];
  
  // Universal productivity tools
  tools.push({
    name: 'Profit Dashboard',
    description: 'Real-time profit tracking and optimization metrics',
    crewBenefit: 'All crew members can monitor their contribution to profitability',
    implementation: 'Immediate'
  });
  
  tools.push({
    name: 'Ethical Decision Matrix',
    description: 'Framework for balancing profit and ethics',
    crewBenefit: 'Ensures all decisions maintain our values',
    implementation: 'Immediate'
  });

  // Crew-specific productivity tools
  if (crewMember) {
    switch (crewMember.toLowerCase()) {
      case 'captain picard':
        tools.push({
          name: 'Diplomatic Profit Tracker',
          description: 'Monitor profit gains from strategic partnerships',
          crewBenefit: 'Maximizes diplomatic business opportunities',
          implementation: '1-2 weeks'
        });
        break;
      case 'chief engineer scott':
        tools.push({
          name: 'Miracle Worker Profit Calculator',
          description: 'Track cost savings from engineering optimizations',
          crewBenefit: 'Quantifies miracle worker protocol benefits',
          implementation: 'Immediate'
        });
        break;
      case 'counselor troi':
        tools.push({
          name: 'Ethical Profit Balance',
          description: 'Visualize profit vs. ethical compliance',
          crewBenefit: 'Maintains perfect balance of success and integrity',
          implementation: '1 week'
        });
        break;
      case 'commander data':
        tools.push({
          name: 'AI Profit Optimization Engine',
          description: 'Machine learning for profit maximization',
          crewBenefit: 'Data-driven profit optimization',
          implementation: '2-3 weeks'
        });
        break;
      case 'lieutenant worf':
        tools.push({
          name: 'Security Profit Protector',
          description: 'Track profit protection from security measures',
          crewBenefit: 'Demonstrates security investment ROI',
          implementation: '1 week'
        });
        break;
      case 'ships computer':
        tools.push({
          name: 'System-Wide Profit Coordinator',
          description: 'Coordinate all crew profit optimization efforts',
          crewBenefit: 'Maximizes collective profit potential',
          implementation: 'Immediate'
        });
        break;
    }
  }

  return tools;
}

function generateHierarchicalDashboard(crewMember?: string, businessFocus?: string) {
  const dashboard = {
    level1: 'Strategic Overview',
    level2: 'Crew Performance',
    level3: 'Individual Optimization',
    level4: 'Profit Metrics',
    level5: 'Ethical Compliance',
    crewSpecific: {}
  };

  if (crewMember) {
    dashboard.crewSpecific = {
      [crewMember]: {
        profitMetrics: ['Individual Contribution', 'Team Impact', 'ROI Analysis'],
        optimizationTools: ['Personal Dashboard', 'Performance Tracker', 'Goal Setting'],
        ethicalGuidelines: ['Personal Values', 'Crew Standards', 'Federation Principles']
      }
    };
  }

  return dashboard;
}

function generateFerengiWisdom(context: string, crewMember?: string) {
  const wisdom = [
    "Rule of Acquisition #3: Never spend more for an acquisition than you have to.",
    "Rule of Acquisition #34: War is good for business.",
    "Rule of Acquisition #62: The riskier the road, the greater the profit.",
    "Rule of Acquisition #285: No good deed ever goes unpunished.",
    "Rule of Acquisition #102: Nature decays, but latinum lasts forever.",
    "Rule of Acquisition #9: Opportunity plus instinct equals profit.",
    "Rule of Acquisition #45: Expand or die.",
    "Rule of Acquisition #75: Home is where the heart is, but the stars are made of latinum."
  ];
  
  // Crew-specific wisdom
  if (crewMember) {
    switch (crewMember.toLowerCase()) {
      case 'captain picard':
        wisdom.push("Rule of Acquisition #Captain: The best profit is one that benefits the entire Federation.");
        break;
      case 'chief engineer scott':
        wisdom.push("Rule of Acquisition #Engineer: A miracle worker's profit is measured in efficiency gains.");
        break;
      case 'counselor troi':
        wisdom.push("Rule of Acquisition #Counselor: Profit without empathy is hollow success.");
        break;
      case 'commander data':
        wisdom.push("Rule of Acquisition #Data: Logical profit optimization maximizes efficiency.");
        break;
      case 'lieutenant worf':
        wisdom.push("Rule of Acquisition #Worf: Security investments protect future profits.");
        break;
      case 'ships computer':
        wisdom.push("Rule of Acquisition #Computer: Coordinated optimization yields maximum profit.");
        break;
    }
  }
  
  return wisdom[Math.floor(Math.random() * wisdom.length)];
}
