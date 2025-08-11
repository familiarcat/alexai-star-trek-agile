import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Prepare the request for the local fallback webhook
    const webhookRequest = {
      query: requestData.query || requestData.meetingType || 'General crew coordination',
      context: requestData.context || requestData.projectContext || 'crew-meeting',
      userRole: requestData.userRole || 'user',
      urgency: requestData.urgency || 'normal',
      complexity: requestData.complexity || 'medium',
      mission: requestData.mission || 'crew-coordination',
      interfacePrefs: requestData.interfacePrefs || 'standard'
    };

    // Use local fallback webhook instead of n8n
    const localWebhookUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    try {
      // Call the local fallback webhook endpoint
      const webhookResponse = await fetch(`${localWebhookUrl}/api/webhook/crew-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookRequest)
      });

      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        
        // Return the webhook response
        return NextResponse.json({
          success: true,
          source: 'local-fallback-webhook',
          data: webhookData,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error(`Local webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
      }
      
    } catch (webhookError) {
      // If local webhook fails, fall back to mock data
      console.warn('Local webhook failed, using mock data:', webhookError);
      
      const mockResponse = {
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
        source: 'mock-fallback'
      };
      
      return NextResponse.json({
        response: mockResponse,
        fallback: true,
        error: 'Local webhook unavailable, using mock data'
      }, { status: 503 });
    }
    
  } catch (error) {
    console.error('Observation lounge error:', error);
    
    // Final fallback to mock data if everything fails
    const fallbackResponse = {
      meetingType: 'emergency-fallback',
      crewReports: {
        captainPicard: {
          strategicOverview: "Emergency fallback mode. Crew coordination proceeding with basic protocols.",
          missionObjectives: [
            "Restore system functionality",
            "Implement emergency protocols",
            "Coordinate crew response"
          ]
        },
        lieutenantData: {
          technicalStatus: "Emergency systems operational. Basic functionality restored.",
          performanceMetrics: {
            responseTime: "emergency mode",
            accuracy: "basic",
            reliability: "degraded"
          }
        }
      },
      collectiveDecision: {
        consensus: "Emergency mode: Implement basic crew coordination protocols.",
        actionItems: [
          "Restore basic functionality",
          "Implement emergency protocols",
          "Coordinate with engineering"
        ]
      },
      timestamp: new Date().toISOString(),
      meetingId: `emergency-meeting-${Date.now()}`,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'emergency-fallback'
    };
    
    return NextResponse.json({
      response: fallbackResponse,
      fallback: true,
      error: 'System error, using emergency fallback data'
    }, { status: 503 });
  }
}
