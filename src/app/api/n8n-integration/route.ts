import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query, context, userRole } = await request.json();
    
    // n8n workflow integration endpoint
    const n8nBaseUrl = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';
    const webhookUrl = `${n8nBaseUrl}/webhook/crew-request`;
    
    // Forward request to n8n workflow
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        context,
        userRole
      })
    });
    
    if (!n8nResponse.ok) {
      // Fallback to direct crew selection if n8n is not available
      console.log('n8n workflow not available, using fallback crew selection');
      
      // Simple crew selection logic as fallback
      let selectedCrew = 'lieutenant-data'; // Default
      
      if (query.toLowerCase().includes('mission') || query.toLowerCase().includes('strategy')) {
        selectedCrew = 'captain-picard';
      } else if (query.toLowerCase().includes('meeting') || query.toLowerCase().includes('team')) {
        selectedCrew = 'observation-lounge';
      } else if (query.toLowerCase().includes('security') || query.toLowerCase().includes('vulnerability')) {
        selectedCrew = 'lieutenant-worf';
      }
      
      // Call the appropriate crew endpoint
      const crewResponse = await fetch(`${process.env.NEXTJS_BASE_URL || 'http://localhost:3000'}/api/crew/${selectedCrew}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          context,
          userRole
        })
      });
      
      const crewData = await crewResponse.json();
      
      return NextResponse.json({
        source: 'fallback',
        n8nStatus: 'unavailable',
        crewMember: selectedCrew,
        response: crewData.response,
        timestamp: new Date().toISOString(),
        confidence: 0.85
      });
    }
    
    const n8nData = await n8nResponse.json();
    
    return NextResponse.json({
      source: 'n8n-workflow',
      n8nStatus: 'operational',
      ...n8nData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('n8n integration error:', error);
    
    // Emergency fallback to Lieutenant Data
    try {
      const fallbackResponse = await fetch(`${process.env.NEXTJS_BASE_URL || 'http://localhost:3000'}/api/crew/lieutenant-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: "Emergency fallback response",
          context: "system-error",
          userRole: "system"
        })
      });
      
      const fallbackData = await fallbackResponse.json();
      
      return NextResponse.json({
        source: 'emergency-fallback',
        n8nStatus: 'error',
        crewMember: 'lieutenant-data',
        response: {
          ...fallbackData.response,
          emergencyNote: "I am responding via emergency fallback due to n8n workflow issues. Please check system status."
        },
        timestamp: new Date().toISOString(),
        confidence: 0.75
      });
      
    } catch (fallbackError) {
      return NextResponse.json(
        { 
          error: 'I apologize, but I am experiencing technical difficulties. Please try again.',
          n8nStatus: 'error',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  // Health check endpoint
  const n8nBaseUrl = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';
  
  try {
    const healthCheck = await fetch(`${n8nBaseUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return NextResponse.json({
      status: 'healthy',
      n8nStatus: healthCheck.ok ? 'operational' : 'unavailable',
      n8nUrl: n8nBaseUrl,
      timestamp: new Date().toISOString(),
      endpoints: {
        crewRequest: `${n8nBaseUrl}/webhook/crew-request`,
        health: `${n8nBaseUrl}/health`
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      n8nStatus: 'unavailable',
      n8nUrl: n8nBaseUrl,
      timestamp: new Date().toISOString(),
      error: 'n8n.pbradygeorgen.com not accessible'
    });
  }
}
