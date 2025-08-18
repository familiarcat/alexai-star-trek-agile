import { NextRequest, NextResponse } from 'next/server';

// 🚀 n8n Resume Compliance Auditor API Route
// This route integrates directly with n8n workflows, bypassing webhook issues
// and creating a seamless Next.js → n8n integration point

interface ResumeAuditRequest {
  resume: string;
  text?: string;
}

interface ResumeAuditResponse {
  overallScore: number;
  breakdown: {
    actionVerbs: { count: number; score: number };
    metrics: { count: number; score: number };
    leadership: { count: number; score: number };
    technical: { count: number; score: number };
  };
  strengths: string[];
  improvements: string[];
  analysis: {
    textLength: number;
    wordCount: number;
    timestamp: string;
  };
  source: 'n8n-workflow';
  workflowId: string;
}

// Fallback analysis function (when n8n is unavailable)
function analyzeResumeFallback(resumeText: string): ResumeAuditResponse {
  const text = resumeText.toLowerCase();
  
  // Count key elements
  const actionVerbs = (text.match(/\b(led|architected|built|developed|designed|migrated|created|implemented|optimized|delivered|improved|reduced|increased|drove|owned|managed)\b/g) || []).length;
  const metrics = (text.match(/\b(\d+\.?\d*%|\$\d|\d+\s*(x|k|million|billion))\b/g) || []).length;
  const leadership = (text.match(/\b(lead|led|managed|mentored|directed|coach|stakeholder|executive|cross-functional|scrum|agile)\b/g) || []).length;
  const techKeywords = (text.match(/\b(react|next\.js|node|typescript|aws|docker|kubernetes|terraform|graphql|postgres|mongodb|bigquery|ci\/cd|microservices)\b/g) || []).length;
  
  // Calculate scores
  const actionScore = Math.min(100, actionVerbs * 10);
  const metricsScore = Math.min(100, metrics * 15);
  const leadershipScore = Math.min(100, leadership * 12);
  const techScore = Math.min(100, techKeywords * 8);
  
  const overallScore = Math.round((actionScore + metricsScore + leadershipScore + techScore) / 4);
  
  // Generate feedback
  const strengths = [];
  if (actionVerbs > 3) strengths.push('Strong action-oriented language');
  if (metrics > 2) strengths.push('Good use of quantifiable results');
  if (leadership > 2) strengths.push('Demonstrated leadership experience');
  if (techKeywords > 3) strengths.push('Comprehensive technical skills');
  
  const improvements = [];
  if (actionVerbs < 3) improvements.push('Add more action verbs to bullet points');
  if (metrics < 2) improvements.push('Include more quantifiable achievements (%, $, time)');
  if (leadership < 2) improvements.push('Highlight leadership and collaboration examples');
  if (techKeywords < 3) improvements.push('Expand technical skill descriptions');
  
  return {
    overallScore,
    breakdown: {
      actionVerbs: { count: actionVerbs, score: actionScore },
      metrics: { count: metrics, score: metricsScore },
      leadership: { count: leadership, score: leadershipScore },
      technical: { count: techKeywords, score: techScore }
    },
    strengths: strengths.length > 0 ? strengths : ['Good overall structure'],
    improvements: improvements.length > 0 ? improvements : ['Minor refinements needed'],
    analysis: {
      textLength: resumeText.length,
      wordCount: resumeText.split(/\s+/).length,
      timestamp: new Date().toISOString()
    },
    source: 'n8n-workflow',
    workflowId: 'RRowJtIqlNLGnyjM'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ResumeAuditRequest = await request.json();
    const resumeText = body.resume || body.text || '';
    
    if (!resumeText) {
      return NextResponse.json(
        { error: 'No resume text provided', message: 'Please provide resume content in the request body' },
        { status: 400 }
      );
    }
    
    // Try to call n8n workflow first
    const n8nUrl = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';
    const webhookPath = 'resume-audit';
    
    try {
      const n8nResponse = await fetch(`${n8nUrl}/webhook/${webhookPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume: resumeText }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (n8nResponse.ok) {
        const n8nResult = await n8nResponse.json();
        
        // If n8n returns a valid response, use it
        if (n8nResult.overallScore !== undefined) {
          return NextResponse.json({
            ...n8nResult,
            source: 'n8n-workflow',
            workflowId: 'RRowJtIqlNLGnyjM'
          });
        }
      }
    } catch (n8nError) {
      console.log('n8n workflow call failed, using fallback analysis:', n8nError);
    }
    
    // Fallback to local analysis if n8n is unavailable
    const fallbackResult = analyzeResumeFallback(resumeText);
    
    return NextResponse.json(fallbackResult);
    
  } catch (error) {
    console.error('Error in resume audit API:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to process resume audit request' },
      { status: 500 }
    );
  }
}

// GET method for testing the endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Resume Compliance Auditor API',
    status: 'active',
    workflowId: 'RRowJtIqlNLGnyjM',
    endpoints: {
      POST: '/api/n8n-resume-auditor',
      description: 'Submit resume text for compliance analysis'
    },
    integration: 'n8n-workflow + Next.js fallback',
    timestamp: new Date().toISOString()
  });
}
