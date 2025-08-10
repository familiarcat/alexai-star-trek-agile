import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Prepare the request for the n8n webhook
    const n8nRequest = {
      query: requestData.query || requestData.meetingType || 'General crew coordination',
      context: requestData.context || requestData.projectContext || 'crew-meeting',
      userRole: requestData.userRole || 'user',
      urgency: requestData.urgency || 'normal',
      complexity: requestData.complexity || 'medium',
      mission: requestData.mission || 'crew-coordination',
      interfacePrefs: requestData.interfacePrefs || 'standard'
    };

    // Get n8n configuration from environment
    const n8nBaseUrl = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';
    
         // Call the n8n webhook endpoint (using the working test webhook for now)
     const n8nResponse = await fetch(`${n8nBaseUrl}/webhook/test-endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nRequest)
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`);
    }

    const n8nData = await n8nResponse.json();
    
    // Return the n8n response
    return NextResponse.json({
      success: true,
      source: 'n8n-webhook',
      data: n8nData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Observation lounge error:', error);
    
    // Fallback to mock data if n8n is unavailable
    const fallbackResponse = {
      meetingType: 'fallback-crew-meeting',
      crewReports: {
        captainPicard: {
          strategicOverview: "Fallback mode activated. The crew is assembled for project review.",
          missionObjectives: [
            "Complete n8n workflow integration",
            "Validate crew coordination systems",
            "Prepare for production deployment"
          ]
        },
        lieutenantData: {
          technicalStatus: "Fallback systems operational. Technical integration proceeding.",
          performanceMetrics: {
            responseTime: "fallback mode",
            accuracy: "fallback mode",
            reliability: "fallback mode"
          }
        }
      },
      collectiveDecision: {
        consensus: "Fallback mode: Proceed with n8n workflow testing.",
        actionItems: [
          "Complete n8n workflow integration testing",
          "Validate all crew member responses"
        ]
      },
      timestamp: new Date().toISOString(),
      meetingId: `fallback-meeting-${Date.now()}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json({
      response: fallbackResponse,
      fallback: true,
      error: 'n8n webhook unavailable, using fallback data'
    }, { status: 503 });
  }
}
