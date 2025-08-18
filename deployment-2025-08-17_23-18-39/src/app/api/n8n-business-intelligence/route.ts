import { NextRequest, NextResponse } from 'next/server';

// 🚀 n8n Business Intelligence Dashboard API Route
// This route integrates with n8n workflows to provide AI-powered business analytics
// Revenue Potential: $3,500 - High demand from small businesses and startups

interface BusinessIntelligenceRequest {
  revenue?: number;
  expenses?: number;
  customers?: number;
  growthRate?: number;
  marketShare?: number;
  employeeCount?: number;
  projectCount?: number;
  completionRate?: number;
}

interface BusinessIntelligenceResponse {
  timestamp: string;
  businessMetrics: {
    revenue: number;
    expenses: number;
    customers: number;
    growthRate: number;
    marketShare: number;
    employeeCount: number;
    projectCount: number;
    completionRate: number;
  };
  keyPerformanceIndicators: {
    profitMargin: number;
    customerValue: number;
    efficiencyRatio: number;
    projectSuccess: number;
  };
  insights: string[];
  recommendations: string[];
  riskAssessment: {
    financialRisk: 'Low' | 'Medium' | 'High';
    growthRisk: 'Low' | 'Medium' | 'High';
    operationalRisk: 'Low' | 'Medium' | 'High';
  };
  marketPosition: {
    competitiveAdvantage: 'Strong' | 'Moderate' | 'Developing';
    marketOpportunity: 'High' | 'Medium' | 'Low';
  };
  nextSteps: string[];
  source: 'n8n-workflow' | 'fallback-analysis';
  workflowId: string;
}

// Fallback business intelligence analysis (when n8n is unavailable)
function analyzeBusinessIntelligenceFallback(data: BusinessIntelligenceRequest): BusinessIntelligenceResponse {
  const revenue = data.revenue || 0;
  const expenses = data.expenses || 0;
  const customers = data.customers || 0;
  const growthRate = data.growthRate || 0;
  const marketShare = data.marketShare || 0;
  const employeeCount = data.employeeCount || 0;
  const projectCount = data.projectCount || 0;
  const completionRate = data.completionRate || 0;

  // Calculate KPIs
  const profitMargin = revenue > 0 ? Number(((revenue - expenses) / revenue * 100).toFixed(2)) : 0;
  const customerValue = customers > 0 ? Number((revenue / customers).toFixed(2)) : 0;
  const efficiencyRatio = employeeCount > 0 ? Number((revenue / employeeCount).toFixed(2)) : 0;
  const projectSuccess = projectCount > 0 ? Number((completionRate / projectCount * 100).toFixed(2)) : 0;

  // Generate insights
  const insights = [];
  if (profitMargin > 20) insights.push('Excellent profit margins indicate strong financial health');
  else if (profitMargin > 10) insights.push('Good profit margins with room for optimization');
  else insights.push('Profit margins need attention - consider cost reduction strategies');

  if (growthRate > 15) insights.push('Strong growth trajectory - maintain momentum');
  else if (growthRate > 5) insights.push('Steady growth - look for acceleration opportunities');
  else insights.push('Growth needs attention - review business strategy');

  if (customerValue > 1000) insights.push('High customer value - excellent customer acquisition strategy');
  else if (customerValue > 500) insights.push('Good customer value - consider upselling opportunities');
  else insights.push('Customer value optimization needed - review pricing strategy');

  // Generate recommendations
  const recommendations = [];
  if (profitMargin < 15) {
    recommendations.push('Implement cost optimization strategies');
    recommendations.push('Review pricing models for margin improvement');
  }
  if (growthRate < 10) {
    recommendations.push('Explore new market opportunities');
    recommendations.push('Enhance marketing and sales strategies');
  }
  if (efficiencyRatio < 50000) {
    recommendations.push('Optimize operational efficiency');
    recommendations.push('Consider automation opportunities');
  }

  // Risk assessment
  const riskAssessment = {
    financialRisk: profitMargin < 10 ? 'High' as const : profitMargin < 20 ? 'Medium' as const : 'Low' as const,
    growthRisk: growthRate < 5 ? 'High' as const : growthRate < 15 ? 'Medium' as const : 'Low' as const,
    operationalRisk: efficiencyRatio < 30000 ? 'High' as const : efficiencyRatio < 60000 ? 'Medium' as const : 'Low' as const
  };

  // Market position
  const marketPosition = {
    competitiveAdvantage: marketShare > 20 ? 'Strong' as const : marketShare > 10 ? 'Moderate' as const : 'Developing' as const,
    marketOpportunity: growthRate > 15 ? 'High' as const : growthRate > 5 ? 'Medium' as const : 'Low' as const
  };

  return {
    timestamp: new Date().toISOString(),
    businessMetrics: { revenue, expenses, customers, growthRate, marketShare, employeeCount, projectCount, completionRate },
    keyPerformanceIndicators: { profitMargin, customerValue, efficiencyRatio, projectSuccess },
    insights,
    recommendations,
    riskAssessment,
    marketPosition,
    nextSteps: [
      'Monitor KPIs weekly for trend analysis',
      'Implement top 3 recommendations within 30 days',
      'Schedule monthly business intelligence review',
      'Track progress against industry benchmarks'
    ],
    source: 'fallback-analysis',
    workflowId: 'business-intelligence-fallback'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: BusinessIntelligenceRequest = await request.json();
    
    // Validate required fields
    if (!body.revenue && !body.customers && !body.growthRate) {
      return NextResponse.json(
        { error: 'Insufficient business data', message: 'Please provide at least revenue, customers, or growth rate data' },
        { status: 400 }
      );
    }

    // Try to call n8n workflow first
    const n8nUrl = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';
    const webhookPath = 'business-intelligence';
    
    try {
      const n8nResponse = await fetch(`${n8nUrl}/webhook/${webhookPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000) // 15 second timeout for complex analysis
      });
      
      if (n8nResponse.ok) {
        const n8nResult = await n8nResponse.json();
        
        // If n8n returns a valid response, use it
        if (n8nResult.businessMetrics && n8nResult.keyPerformanceIndicators) {
          return NextResponse.json({
            ...n8nResult,
            source: 'n8n-workflow',
            workflowId: 'business-intelligence-webhook'
          });
        }
      }
    } catch (n8nError) {
      console.log('n8n workflow call failed, using fallback analysis:', n8nError);
    }
    
    // Fallback to local analysis if n8n is unavailable
    const fallbackResult = analyzeBusinessIntelligenceFallback(body);
    
    return NextResponse.json(fallbackResult);
    
  } catch (error) {
    console.error('Error in business intelligence API:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to process business intelligence request' },
      { status: 500 }
    );
  }
}

// GET method for testing the endpoint
export async function GET() {
  return NextResponse.json({
    message: 'AI Business Intelligence Dashboard API',
    status: 'active',
    workflowId: 'business-intelligence-webhook',
    endpoints: {
      POST: '/api/n8n-business-intelligence',
      description: 'Submit business data for AI-powered intelligence analysis'
    },
    integration: 'n8n-workflow + Next.js fallback',
    revenuePotential: '$3,500',
    targetMarket: ['Small Business Owners', 'Startups', 'Consultants', 'Analysts'],
    timestamp: new Date().toISOString()
  });
}
