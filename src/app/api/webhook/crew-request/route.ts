import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Simulate n8n webhook response
    const mockResponse = {
      meetingType: 'crew-coordination',
      crewReports: {
        captainPicard: {
          strategicOverview: "Crew assembled for project review. All systems operational.",
          missionObjectives: [
            "Complete n8n workflow integration",
            "Validate crew coordination systems",
            "Prepare for production deployment"
          ]
        },
        lieutenantData: {
          technicalStatus: "All systems operational. Technical integration proceeding.",
          performanceMetrics: {
            responseTime: "< 100ms",
            accuracy: "99.9%",
            reliability: "99.99%"
          }
        }
      },
      collectiveDecision: {
        consensus: "Proceed with n8n workflow testing and validation.",
        actionItems: [
          "Complete n8n workflow integration testing",
          "Validate all crew member responses",
          "Prepare deployment pipeline"
        ]
      },
      timestamp: new Date().toISOString(),
      meetingId: `meeting-${Date.now()}`,
      source: 'fallback-webhook'
    };
    
    return NextResponse.json(mockResponse);
    
  } catch (error) {
    console.error('Fallback webhook error:', error);
    
    return NextResponse.json({
      error: 'Invalid request format',
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}
