import { NextResponse } from 'next/server';

// Startup Injection Engine
// Analyzes startup ideas and generates revenue-producing projects
export async function POST(request: Request) {
  try {
    const { startupIdea, businessPlan, targetMarket, revenueModel } = await request.json();
    
    // Ships Computer analyzes startup viability and generates project plan
    const startupAnalysis = await analyzeStartupViability(
      startupIdea,
      businessPlan,
      targetMarket,
      revenueModel
    );
    
    // Generate complete project creation plan
    const projectCreationPlan = await generateProjectCreationPlan(startupAnalysis);
    
    // Allocate crew resources based on project requirements
    const crewAllocation = await allocateCrewResources(projectCreationPlan);
    
    // Create revenue generation strategy
    const revenueStrategy = await createRevenueStrategy(startupAnalysis, revenueModel);
    
    return NextResponse.json({
      agent: "startup-injection-engine",
      voice: "ships-computer-venture-creation",
      startupAnalysis,
      projectCreationPlan,
      crewAllocation,
      revenueStrategy,
      estimatedTimeline: projectCreationPlan.timeline,
      projectedRevenue: revenueStrategy.projections,
      computerNote: "Startup analysis complete. Project creation workflow initialized.",
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Startup injection error:', error);
    return NextResponse.json(
      { 
        error: 'Startup analysis systems experiencing difficulties',
        fallback: 'Manual project creation recommended',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function analyzeStartupViability(
  startupIdea: string,
  businessPlan: string,
  targetMarket: string,
  revenueModel: string
) {
  const analysis = {
    ideaValidation: {},
    marketAnalysis: {},
    technicalFeasibility: {},
    revenueProjection: {},
    competitiveAnalysis: {},
    riskAssessment: {},
    recommendedApproach: {}
  };
  
  // Analyze startup idea for market viability
  analysis.ideaValidation = analyzeIdeaViability(startupIdea, targetMarket);
  
  // Market size and opportunity assessment
  analysis.marketAnalysis = assessMarketOpportunity(targetMarket, startupIdea);
  
  // Technical complexity and feasibility
  analysis.technicalFeasibility = evaluateTechnicalFeasibility(startupIdea, businessPlan);
  
  // Revenue potential and timeline
  analysis.revenueProjection = projectRevenuePotential(revenueModel, targetMarket);
  
  // Competition and differentiation
  analysis.competitiveAnalysis = analyzeCompetitiveLandscape(startupIdea, targetMarket);
  
  // Risk factors and mitigation
  analysis.riskAssessment = assessProjectRisks(startupIdea, businessPlan, targetMarket);
  
  // Strategic recommendations
  analysis.recommendedApproach = generateStrategicRecommendations(analysis);
  
  return analysis;
}

function analyzeIdeaViability(startupIdea: string, targetMarket: string) {
  const ideaLower = startupIdea.toLowerCase();
  const marketLower = targetMarket.toLowerCase();
  
  let viabilityScore = 0.5;
  let strengths = [];
  let concerns = [];
  let marketFit = 'medium';
  
  // Analyze for proven market patterns
  if (ideaLower.includes('saas') || ideaLower.includes('software') || ideaLower.includes('platform')) {
    viabilityScore += 0.2;
    strengths.push('Scalable SaaS model with recurring revenue potential');
  }
  
  if (ideaLower.includes('ai') || ideaLower.includes('automation') || ideaLower.includes('machine learning')) {
    viabilityScore += 0.15;
    strengths.push('Leverages cutting-edge AI technology trends');
  }
  
  if (ideaLower.includes('marketplace') || ideaLower.includes('two-sided') || ideaLower.includes('network')) {
    viabilityScore += 0.1;
    strengths.push('Network effects potential for sustainable competitive advantage');
    concerns.push('Chicken-and-egg problem in marketplace development');
  }
  
  if (ideaLower.includes('subscription') || ideaLower.includes('recurring')) {
    viabilityScore += 0.15;
    strengths.push('Predictable recurring revenue model');
  }
  
  // Market size indicators
  if (marketLower.includes('enterprise') || marketLower.includes('business') || marketLower.includes('b2b')) {
    viabilityScore += 0.1;
    strengths.push('Enterprise market with higher customer value');
    marketFit = 'high';
  }
  
  if (marketLower.includes('healthcare') || marketLower.includes('finance') || marketLower.includes('education')) {
    viabilityScore += 0.05;
    strengths.push('Large addressable market with established buying patterns');
    concerns.push('Potential regulatory compliance requirements');
  }
  
  // Risk factors
  if (ideaLower.includes('crypto') || ideaLower.includes('blockchain') || ideaLower.includes('nft')) {
    viabilityScore -= 0.1;
    concerns.push('Volatile and heavily regulated market space');
  }
  
  if (ideaLower.includes('social') && ideaLower.includes('media')) {
    viabilityScore -= 0.05;
    concerns.push('Highly competitive market dominated by large players');
  }
  
  // Ensure score stays within bounds
  viabilityScore = Math.max(0.1, Math.min(1.0, viabilityScore));
  
  return {
    viabilityScore,
    marketFitAssessment: marketFit,
    strengths,
    concerns,
    recommendation: viabilityScore > 0.7 ? 'high-priority' : viabilityScore > 0.5 ? 'medium-priority' : 'low-priority'
  };
}

function assessMarketOpportunity(targetMarket: string, startupIdea: string) {
  const marketLower = targetMarket.toLowerCase();
  const ideaLower = startupIdea.toLowerCase();
  
  let marketSize = 'medium';
  let growthPotential = 'medium';
  let competitionLevel = 'medium';
  let entryBarriers = [];
  let opportunities = [];
  
  // Market size assessment
  if (marketLower.includes('global') || marketLower.includes('worldwide')) {
    marketSize = 'large';
    opportunities.push('Global market reach potential');
  } else if (marketLower.includes('local') || marketLower.includes('regional')) {
    marketSize = 'small';
    opportunities.push('Focused local market with personal touch advantage');
  }
  
  // Industry-specific analysis
  if (marketLower.includes('healthcare')) {
    growthPotential = 'high';
    entryBarriers.push('HIPAA compliance required');
    entryBarriers.push('Medical certification may be needed');
    opportunities.push('Large market with digital transformation needs');
  }
  
  if (marketLower.includes('finance') || marketLower.includes('fintech')) {
    growthPotential = 'high';
    competitionLevel = 'high';
    entryBarriers.push('Financial regulations and licensing');
    entryBarriers.push('Security and compliance requirements');
    opportunities.push('High-value transactions and customer lifetime value');
  }
  
  if (marketLower.includes('education') || marketLower.includes('edtech')) {
    growthPotential = 'high';
    opportunities.push('Growing online education market');
    entryBarriers.push('Educational content expertise required');
  }
  
  if (marketLower.includes('enterprise') || marketLower.includes('b2b')) {
    marketSize = 'large';
    opportunities.push('Higher customer values and longer retention');
    entryBarriers.push('Longer sales cycles and relationship building');
  }
  
  if (marketLower.includes('consumer') || marketLower.includes('b2c')) {
    competitionLevel = 'high';
    opportunities.push('Faster user acquisition and viral potential');
    entryBarriers.push('High marketing costs for user acquisition');
  }
  
  // Technology trend analysis
  if (ideaLower.includes('ai') || ideaLower.includes('automation')) {
    growthPotential = 'high';
    opportunities.push('Riding the AI technology wave');
    competitionLevel = 'high';
  }
  
  if (ideaLower.includes('mobile') || ideaLower.includes('app')) {
    competitionLevel = 'very-high';
    entryBarriers.push('App store competition and discovery challenges');
  }
  
  return {
    marketSize,
    growthPotential,
    competitionLevel,
    entryBarriers,
    opportunities,
    timeToMarket: estimateTimeToMarket(marketLower, ideaLower),
    customerAcquisitionComplexity: assessCustomerAcquisition(marketLower)
  };
}

function evaluateTechnicalFeasibility(startupIdea: string, businessPlan: string) {
  const ideaLower = startupIdea.toLowerCase();
  const planLower = businessPlan.toLowerCase();
  
  let complexityLevel = 'medium';
  let developmentTime = '3-6 months';
  let technicalChallenges = [];
  let recommendedStack = [];
  let scalabilityFactors = [];
  
  // Complexity assessment
  if (ideaLower.includes('ai') || ideaLower.includes('machine learning') || ideaLower.includes('nlp')) {
    complexityLevel = 'high';
    developmentTime = '6-12 months';
    technicalChallenges.push('AI model training and optimization');
    technicalChallenges.push('Large dataset requirements');
    recommendedStack.push('Python/TensorFlow ecosystem');
    recommendedStack.push('Cloud ML platforms (AWS SageMaker, Google AI)');
  }
  
  if (ideaLower.includes('blockchain') || ideaLower.includes('crypto') || ideaLower.includes('smart contract')) {
    complexityLevel = 'high';
    developmentTime = '6-9 months';
    technicalChallenges.push('Blockchain integration complexity');
    technicalChallenges.push('Security and audit requirements');
    recommendedStack.push('Solidity for smart contracts');
    recommendedStack.push('Web3 integration libraries');
  }
  
  if (ideaLower.includes('real-time') || ideaLower.includes('live') || ideaLower.includes('streaming')) {
    complexityLevel = 'high';
    technicalChallenges.push('Real-time data synchronization');
    technicalChallenges.push('Scalable WebSocket architecture');
    recommendedStack.push('Node.js with Socket.io');
    recommendedStack.push('Redis for real-time data');
  }
  
  if (ideaLower.includes('mobile') || ideaLower.includes('app')) {
    technicalChallenges.push('Cross-platform mobile development');
    recommendedStack.push('React Native or Flutter');
    recommendedStack.push('Mobile-first API design');
  }
  
  if (ideaLower.includes('marketplace') || ideaLower.includes('two-sided')) {
    complexityLevel = 'high';
    developmentTime = '4-8 months';
    technicalChallenges.push('Multi-tenant architecture');
    technicalChallenges.push('Complex user role management');
    technicalChallenges.push('Payment splitting and escrow systems');
    scalabilityFactors.push('Database partitioning strategies');
    scalabilityFactors.push('Load balancing for different user types');
  }
  
  // Standard technology recommendations
  if (ideaLower.includes('saas') || ideaLower.includes('web')) {
    recommendedStack.push('Next.js 15 with TypeScript');
    recommendedStack.push('Supabase or PostgreSQL');
    recommendedStack.push('Vercel deployment');
    scalabilityFactors.push('CDN for global performance');
    scalabilityFactors.push('Database read replicas');
  }
  
  // Payment and e-commerce
  if (ideaLower.includes('payment') || ideaLower.includes('commerce') || ideaLower.includes('subscription')) {
    technicalChallenges.push('PCI compliance for payment processing');
    technicalChallenges.push('Subscription management complexity');
    recommendedStack.push('Stripe for payment processing');
    recommendedStack.push('Webhook handling for payment events');
  }
  
  // Default stack if nothing specific identified
  if (recommendedStack.length === 0) {
    complexityLevel = 'low';
    developmentTime = '2-4 months';
    recommendedStack.push('Next.js with TypeScript');
    recommendedStack.push('Supabase database');
    recommendedStack.push('Tailwind CSS');
  }
  
  return {
    complexityLevel,
    estimatedDevelopmentTime: developmentTime,
    technicalChallenges,
    recommendedTechStack: recommendedStack,
    scalabilityConsiderations: scalabilityFactors,
    mvpApproach: generateMVPStrategy(complexityLevel, ideaLower),
    resourceRequirements: calculateResourceNeeds(complexityLevel, developmentTime)
  };
}

function projectRevenuePotential(revenueModel: string, targetMarket: string) {
  const modelLower = revenueModel.toLowerCase();
  const marketLower = targetMarket.toLowerCase();
  
  let revenueType = 'one-time';
  let projectedMRR = { month3: 0, month6: 0, month12: 0 };
  let customerValue = { low: 0, average: 0, high: 0 };
  let scalabilityFactor = 'medium';
  
  // Revenue model analysis
  if (modelLower.includes('subscription') || modelLower.includes('saas') || modelLower.includes('recurring')) {
    revenueType = 'recurring';
    scalabilityFactor = 'high';
    
    if (marketLower.includes('enterprise') || marketLower.includes('b2b')) {
      customerValue = { low: 100, average: 500, high: 2000 };
      projectedMRR = {
        month3: 5000,   // 10 customers at $500 avg
        month6: 15000,  // 30 customers at $500 avg  
        month12: 50000  // 100 customers at $500 avg
      };
    } else {
      customerValue = { low: 10, average: 50, high: 200 };
      projectedMRR = {
        month3: 2500,   // 50 customers at $50 avg
        month6: 10000,  // 200 customers at $50 avg
        month12: 30000  // 600 customers at $50 avg
      };
    }
  }
  
  if (modelLower.includes('marketplace') || modelLower.includes('commission') || modelLower.includes('transaction')) {
    revenueType = 'transaction-based';
    scalabilityFactor = 'very-high';
    
    const transactionVolume = marketLower.includes('enterprise') ? 
      { month3: 50000, month6: 200000, month12: 1000000 } :
      { month3: 10000, month6: 50000, month12: 200000 };
    
    const commissionRate = 0.05; // 5% average commission
    projectedMRR = {
      month3: transactionVolume.month3 * commissionRate,
      month6: transactionVolume.month6 * commissionRate,
      month12: transactionVolume.month12 * commissionRate
    };
  }
  
  if (modelLower.includes('freemium')) {
    revenueType = 'freemium';
    scalabilityFactor = 'high';
    
    const conversionRate = 0.02; // 2% freemium conversion
    const freeUsers = { month3: 1000, month6: 5000, month12: 20000 };
    const avgRevenuePer = marketLower.includes('enterprise') ? 200 : 30;
    
    projectedMRR = {
      month3: freeUsers.month3 * conversionRate * avgRevenuePer,
      month6: freeUsers.month6 * conversionRate * avgRevenuePer,
      month12: freeUsers.month12 * conversionRate * avgRevenuePer
    };
  }
  
  if (modelLower.includes('one-time') || modelLower.includes('product') || modelLower.includes('license')) {
    revenueType = 'one-time';
    scalabilityFactor = 'medium';
    
    customerValue = marketLower.includes('enterprise') ? 
      { low: 1000, average: 5000, high: 25000 } :
      { low: 50, average: 200, high: 1000 };
    
    // Convert to monthly equivalent for comparison
    const monthlySales = marketLower.includes('enterprise') ? 
      { month3: 2, month6: 5, month12: 10 } :
      { month3: 25, month6: 50, month12: 100 };
    
    projectedMRR = {
      month3: monthlySales.month3 * customerValue.average,
      month6: monthlySales.month6 * customerValue.average,
      month12: monthlySales.month12 * customerValue.average
    };
  }
  
  return {
    revenueModel: revenueType,
    projectedMonthlyRecurringRevenue: projectedMRR,
    customerLifetimeValue: calculateCustomerLTV(customerValue, revenueType),
    scalabilityFactor,
    revenueGrowthProjection: calculateGrowthProjection(projectedMRR),
    monetizationStrategy: generateMonetizationStrategy(revenueType, marketLower),
    pricingRecommendations: generatePricingStrategy(marketLower, revenueType)
  };
}

function analyzeCompetitiveLandscape(startupIdea: string, targetMarket: string) {
  const ideaLower = startupIdea.toLowerCase();
  const marketLower = targetMarket.toLowerCase();
  
  let competitionLevel = 'medium';
  let differentiationOpportunities = [];
  let competitiveThreats = [];
  let marketPositioning = 'fast-follower';
  
  // Analyze competition level by market and idea type
  if (ideaLower.includes('social media') || ideaLower.includes('social network')) {
    competitionLevel = 'very-high';
    competitiveThreats.push('Dominated by Meta, Twitter, TikTok');
    differentiationOpportunities.push('Niche community focus');
    differentiationOpportunities.push('Privacy-first approach');
  }
  
  if (ideaLower.includes('ai') || ideaLower.includes('automation')) {
    competitionLevel = 'high';
    competitiveThreats.push('Large tech companies investing heavily');
    differentiationOpportunities.push('Industry-specific AI solutions');
    differentiationOpportunities.push('Easier to use AI tools');
    marketPositioning = 'innovation-leader';
  }
  
  if (ideaLower.includes('saas') && marketLower.includes('enterprise')) {
    competitionLevel = 'high';
    competitiveThreats.push('Established enterprise software vendors');
    differentiationOpportunities.push('Modern user experience');
    differentiationOpportunities.push('Integration-first approach');
    marketPositioning = 'disruptor';
  }
  
  if (ideaLower.includes('marketplace')) {
    competitionLevel = 'high';
    competitiveThreats.push('Network effects favor existing players');
    differentiationOpportunities.push('Vertical specialization');
    differentiationOpportunities.push('Better user experience');
    marketPositioning = 'niche-leader';
  }
  
  if (marketLower.includes('healthcare')) {
    competitionLevel = 'medium';
    competitiveThreats.push('Regulatory barriers protect incumbents');
    differentiationOpportunities.push('Patient-centric design');
    differentiationOpportunities.push('Compliance-first architecture');
  }
  
  if (marketLower.includes('fintech') || marketLower.includes('finance')) {
    competitionLevel = 'very-high';
    competitiveThreats.push('Banks and fintech giants with deep pockets');
    differentiationOpportunities.push('Specialized financial products');
    differentiationOpportunities.push('Better customer experience');
  }
  
  return {
    competitionLevel,
    marketPositioning,
    differentiationOpportunities,
    competitiveThreats,
    competitiveAdvantages: identifyCompetitiveAdvantages(ideaLower, marketLower),
    marketEntryStrategy: generateMarketEntryStrategy(competitionLevel, marketPositioning),
    sustainabilityFactors: assessCompetitiveSustainability(ideaLower, marketLower)
  };
}

function assessProjectRisks(startupIdea: string, businessPlan: string, targetMarket: string) {
  const risks = {
    technical: [],
    market: [],
    financial: [],
    operational: [],
    regulatory: [],
    mitigation: {}
  };
  
  const ideaLower = startupIdea.toLowerCase();
  const marketLower = targetMarket.toLowerCase();
  
  // Technical risks
  if (ideaLower.includes('ai') || ideaLower.includes('machine learning')) {
    risks.technical.push('AI model accuracy and reliability');
    risks.technical.push('Data quality and availability');
    risks.mitigation['ai-risks'] = 'Start with simpler models, extensive testing';
  }
  
  if (ideaLower.includes('real-time') || ideaLower.includes('live')) {
    risks.technical.push('Scalability under high load');
    risks.technical.push('Real-time data synchronization challenges');
    risks.mitigation['realtime-risks'] = 'Load testing, progressive scaling';
  }
  
  // Market risks
  if (marketLower.includes('consumer') || marketLower.includes('b2c')) {
    risks.market.push('High customer acquisition costs');
    risks.market.push('Fickle consumer preferences');
    risks.mitigation['consumer-risks'] = 'Viral growth strategies, strong product-market fit';
  }
  
  if (ideaLower.includes('marketplace')) {
    risks.market.push('Chicken-and-egg problem for two-sided markets');
    risks.mitigation['marketplace-risks'] = 'Single-sided value first, gradual expansion';
  }
  
  // Financial risks
  risks.financial.push('Runway and funding requirements');
  risks.financial.push('Revenue growth and profitability timeline');
  risks.mitigation['financial-risks'] = 'Lean startup approach, early revenue focus';
  
  // Regulatory risks
  if (marketLower.includes('healthcare')) {
    risks.regulatory.push('HIPAA compliance requirements');
    risks.regulatory.push('Medical device regulations');
    risks.mitigation['healthcare-risks'] = 'Compliance-first design, legal consultation';
  }
  
  if (marketLower.includes('finance') || ideaLower.includes('payment')) {
    risks.regulatory.push('Financial services regulations');
    risks.regulatory.push('PCI compliance for payments');
    risks.mitigation['finance-risks'] = 'Partner with compliant providers initially';
  }
  
  // Operational risks
  risks.operational.push('Team scaling and talent acquisition');
  risks.operational.push('Operational complexity as business grows');
  risks.mitigation['operational-risks'] = 'Strong hiring process, automation-first approach';
  
  return risks;
}

function generateStrategicRecommendations(analysis: any) {
  const recommendations = {
    approachStrategy: 'lean-startup',
    priorityAreas: [],
    timeline: {},
    resourceAllocation: {},
    successMetrics: []
  };
  
  // Determine approach based on viability and complexity
  if (analysis.ideaValidation.viabilityScore > 0.8 && analysis.technicalFeasibility.complexityLevel === 'low') {
    recommendations.approachStrategy = 'rapid-launch';
    recommendations.timeline = { mvp: '4-6 weeks', launch: '8-12 weeks', scale: '6 months' };
  } else if (analysis.ideaValidation.viabilityScore > 0.6) {
    recommendations.approachStrategy = 'lean-startup';
    recommendations.timeline = { mvp: '8-12 weeks', launch: '4-6 months', scale: '12 months' };
  } else {
    recommendations.approachStrategy = 'research-first';
    recommendations.timeline = { research: '4-6 weeks', mvp: '3-4 months', launch: '6-9 months' };
  }
  
  // Priority areas based on analysis
  if (analysis.technicalFeasibility.complexityLevel === 'high') {
    recommendations.priorityAreas.push('Technical team and expertise');
  }
  
  if (analysis.marketAnalysis.competitionLevel === 'high') {
    recommendations.priorityAreas.push('Strong differentiation and marketing');
  }
  
  if (analysis.revenueProjection.scalabilityFactor === 'high') {
    recommendations.priorityAreas.push('Scalable infrastructure from day one');
  }
  
  // Success metrics
  recommendations.successMetrics = [
    'User acquisition rate',
    'Revenue growth month-over-month',
    'Customer satisfaction scores',
    'Market penetration in target segment'
  ];
  
  return recommendations;
}

// Helper functions
function estimateTimeToMarket(market: string, idea: string) {
  if (market.includes('enterprise')) return '6-12 months';
  if (idea.includes('ai') || idea.includes('complex')) return '4-8 months';
  return '2-4 months';
}

function assessCustomerAcquisition(market: string) {
  if (market.includes('enterprise')) return 'high-touch-sales';
  if (market.includes('consumer')) return 'digital-marketing';
  return 'mixed-approach';
}

function generateMVPStrategy(complexity: string, idea: string) {
  if (complexity === 'high') {
    return 'Prototype key features, validate core assumptions, iterative development';
  }
  return 'Full feature MVP, rapid user feedback, quick iterations';
}

function calculateResourceNeeds(complexity: string, timeline: string) {
  const baseTeam = ['Full-stack developer', 'UI/UX designer'];
  
  if (complexity === 'high') {
    baseTeam.push('Technical lead', 'DevOps engineer');
  }
  
  return {
    teamSize: baseTeam.length,
    roles: baseTeam,
    estimatedCost: baseTeam.length * 8000 * parseTimelineMonths(timeline)
  };
}

function parseTimelineMonths(timeline: string): number {
  const match = timeline.match(/(\d+)-?(\d+)?/);
  return match ? parseInt(match[1]) : 3;
}

function calculateCustomerLTV(customerValue: any, revenueType: string) {
  if (revenueType === 'recurring') {
    return customerValue.average * 12; // Assume 12 month average lifecycle
  }
  return customerValue.average;
}

function calculateGrowthProjection(projectedMRR: any) {
  const month3to6Growth = ((projectedMRR.month6 - projectedMRR.month3) / projectedMRR.month3) * 100;
  const month6to12Growth = ((projectedMRR.month12 - projectedMRR.month6) / projectedMRR.month6) * 100;
  
  return {
    quarterlyGrowthRate: Math.round(month3to6Growth),
    annualGrowthRate: Math.round(month6to12Growth),
    compoundGrowth: 'exponential'
  };
}

function generateMonetizationStrategy(revenueType: string, market: string) {
  const strategies = [];
  
  if (revenueType === 'recurring') {
    strategies.push('Tiered subscription pricing');
    strategies.push('Annual discount incentives');
    strategies.push('Usage-based billing for high-volume users');
  }
  
  if (market.includes('enterprise')) {
    strategies.push('Custom enterprise packages');
    strategies.push('Professional services add-ons');
  }
  
  strategies.push('Freemium acquisition funnel');
  strategies.push('Referral program incentives');
  
  return strategies;
}

function generatePricingStrategy(market: string, revenueType: string) {
  if (market.includes('enterprise')) {
    return {
      starter: '$200/month',
      professional: '$500/month', 
      enterprise: 'Custom pricing'
    };
  }
  
  return {
    free: '$0 (limited features)',
    starter: '$29/month',
    professional: '$79/month',
    enterprise: '$199/month'
  };
}

function identifyCompetitiveAdvantages(idea: string, market: string) {
  const advantages = [];
  
  if (idea.includes('ai')) {
    advantages.push('AI-powered automation and insights');
  }
  
  if (market.includes('enterprise')) {
    advantages.push('Enterprise-grade security and compliance');
  }
  
  advantages.push('Modern, intuitive user experience');
  advantages.push('Rapid deployment and setup');
  advantages.push('Flexible integration capabilities');
  
  return advantages;
}

function generateMarketEntryStrategy(competitionLevel: string, positioning: string) {
  if (competitionLevel === 'very-high') {
    return 'Niche focus first, then expand adjacent markets';
  }
  
  if (positioning === 'innovation-leader') {
    return 'Technology leadership and thought leadership content';
  }
  
  return 'Direct competition with superior user experience';
}

function assessCompetitiveSustainability(idea: string, market: string) {
  const factors = [];
  
  if (idea.includes('network') || idea.includes('marketplace')) {
    factors.push('Network effects create sustainable moats');
  }
  
  if (idea.includes('ai') || idea.includes('data')) {
    factors.push('Data advantage compounds over time');
  }
  
  if (market.includes('enterprise')) {
    factors.push('High switching costs for enterprise customers');
  }
  
  factors.push('Continuous innovation and feature development');
  
  return factors;
}

async function generateProjectCreationPlan(startupAnalysis: any) {
  const plan = {
    projectType: determineProjectType(startupAnalysis),
    techStack: startupAnalysis.technicalFeasibility.recommendedTechStack,
    timeline: createDetailedTimeline(startupAnalysis),
    milestones: generateProjectMilestones(startupAnalysis),
    resourceRequirements: startupAnalysis.technicalFeasibility.resourceRequirements,
    riskMitigation: createRiskMitigationPlan(startupAnalysis.riskAssessment)
  };
  
  return plan;
}

async function allocateCrewResources(projectCreationPlan: any) {
  return {
    primaryCrew: assignPrimaryCrew(projectCreationPlan.projectType),
    specializedRoles: assignSpecializedRoles(projectCreationPlan.techStack),
    workloadDistribution: calculateWorkloadDistribution(projectCreationPlan.timeline),
    collaborationStrategy: 'observation-lounge-coordination'
  };
}

async function createRevenueStrategy(startupAnalysis: any, revenueModel: string) {
  return {
    revenueStreams: identifyRevenueStreams(revenueModel, startupAnalysis),
    pricingStrategy: startupAnalysis.revenueProjection.pricingRecommendations,
    paymentIntegration: designPaymentIntegration(revenueModel),
    leadGeneration: createLeadGenerationStrategy(startupAnalysis.marketAnalysis),
    conversionOptimization: designConversionFunnel(startupAnalysis),
    projections: startupAnalysis.revenueProjection.projectedMonthlyRecurringRevenue
  };
}

// Additional helper functions for plan generation
function determineProjectType(analysis: any) {
  const idea = analysis.ideaValidation;
  const tech = analysis.technicalFeasibility;
  
  if (tech.recommendedTechStack.some((stack: string) => stack.includes('marketplace'))) {
    return 'marketplace-platform';
  }
  
  if (tech.recommendedTechStack.some((stack: string) => stack.includes('AI') || stack.includes('ML'))) {
    return 'ai-powered-saas';
  }
  
  return 'standard-saas';
}

function createDetailedTimeline(analysis: any) {
  const baseTime = analysis.technicalFeasibility.estimatedDevelopmentTime;
  
  return {
    planning: '1-2 weeks',
    mvpDevelopment: baseTime,
    testing: '2-3 weeks', 
    launch: '1 week',
    iterationCycle: '2-4 weeks'
  };
}

function generateProjectMilestones(analysis: any) {
  return [
    { milestone: 'Project Setup Complete', timeline: 'Week 1', deliverables: ['Repository setup', 'CI/CD pipeline', 'Team onboarding'] },
    { milestone: 'MVP Core Features', timeline: 'Month 1', deliverables: ['User authentication', 'Core functionality', 'Basic UI'] },
    { milestone: 'Beta Launch Ready', timeline: 'Month 2', deliverables: ['Payment integration', 'User testing', 'Performance optimization'] },
    { milestone: 'Public Launch', timeline: 'Month 3', deliverables: ['Marketing site', 'Documentation', 'Customer support'] },
    { milestone: 'Growth Phase', timeline: 'Month 6', deliverables: ['Feature expansion', 'Scaling infrastructure', 'Revenue optimization'] }
  ];
}

function createRiskMitigationPlan(riskAssessment: any) {
  return {
    technicalRisks: riskAssessment.mitigation,
    contingencyPlans: ['Scope reduction for timeline pressure', 'Alternative technology approaches', 'External consultant hiring'],
    monitoringStrategy: 'Weekly risk assessment and milestone reviews'
  };
}

function assignPrimaryCrew(projectType: string) {
  const baseCrew = ['captain-picard', 'lieutenant-data', 'ships-computer'];
  
  if (projectType.includes('marketplace')) {
    baseCrew.push('counselor-troi', 'chief-engineer-scott');
  }
  
  if (projectType.includes('ai')) {
    baseCrew.push('commander-spock', 'lieutenant-data');
  }
  
  baseCrew.push('lieutenant-worf'); // Security always important
  
  return [...new Set(baseCrew)]; // Remove duplicates
}

function assignSpecializedRoles(techStack: string[]) {
  const roles = [];
  
  if (techStack.some(tech => tech.includes('AI') || tech.includes('ML'))) {
    roles.push('AI/ML Engineer');
  }
  
  if (techStack.some(tech => tech.includes('mobile'))) {
    roles.push('Mobile Developer');
  }
  
  if (techStack.some(tech => tech.includes('blockchain'))) {
    roles.push('Blockchain Developer');
  }
  
  roles.push('DevOps Engineer', 'UI/UX Designer');
  
  return roles;
}

function calculateWorkloadDistribution(timeline: any) {
  return {
    development: '60%',
    testing: '20%', 
    deployment: '10%',
    documentation: '10%'
  };
}

function identifyRevenueStreams(revenueModel: string, analysis: any) {
  const streams = [];
  
  if (revenueModel.includes('subscription')) {
    streams.push('Monthly/Annual subscriptions');
  }
  
  if (revenueModel.includes('marketplace')) {
    streams.push('Transaction fees', 'Listing fees', 'Premium seller features');
  }
  
  if (analysis.marketAnalysis.marketSize === 'large') {
    streams.push('Enterprise packages', 'Professional services');
  }
  
  streams.push('API usage fees', 'Integration partnerships');
  
  return streams;
}

function designPaymentIntegration(revenueModel: string) {
  return {
    primaryGateway: 'Stripe',
    features: ['Subscription management', 'Invoice generation', 'Tax calculation', 'Churn prevention'],
    supportedMethods: ['Credit cards', 'ACH', 'PayPal', 'Apple Pay', 'Google Pay'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD'],
    compliance: ['PCI DSS', 'SOX', 'GDPR']
  };
}

function createLeadGenerationStrategy(marketAnalysis: any) {
  const strategies = [];
  
  if (marketAnalysis.customerAcquisitionComplexity === 'digital-marketing') {
    strategies.push('Content marketing and SEO', 'Social media advertising', 'Email marketing campaigns');
  }
  
  if (marketAnalysis.customerAcquisitionComplexity === 'high-touch-sales') {
    strategies.push('Direct sales outreach', 'Industry conference presence', 'Partnership channels');
  }
  
  strategies.push('Referral programs', 'Product-led growth', 'Free trial conversions');
  
  return strategies;
}

function designConversionFunnel(analysis: any) {
  return {
    awareness: 'Content marketing and SEO',
    interest: 'Free trial or freemium tier',
    consideration: 'Product demos and case studies',
    purchase: 'Streamlined signup and onboarding',
    retention: 'Feature adoption and success programs',
    advocacy: 'Referral incentives and community building'
  };
}

export async function GET() {
  return NextResponse.json({
    agent: "startup-injection-engine",
    status: "Startup analysis and project generation system operational",
    capabilities: [
      "Startup idea viability analysis",
      "Market opportunity assessment",
      "Technical feasibility evaluation", 
      "Revenue projection modeling",
      "Competitive landscape analysis",
      "Risk assessment and mitigation",
      "Project creation plan generation",
      "Crew resource allocation",
      "Revenue strategy development"
    ],
    supportedRevenueModels: [
      "SaaS subscriptions",
      "Marketplace commissions", 
      "E-commerce sales",
      "Freemium conversions",
      "One-time licenses",
      "Transaction-based fees"
    ],
    analysisFramework: [
      "Idea validation scoring",
      "Market size assessment",
      "Technical complexity evaluation",
      "Competition analysis",
      "Revenue projections",
      "Resource requirements",
      "Timeline estimation",
      "Risk mitigation planning"
    ],
    timestamp: new Date().toISOString()
  });
}
