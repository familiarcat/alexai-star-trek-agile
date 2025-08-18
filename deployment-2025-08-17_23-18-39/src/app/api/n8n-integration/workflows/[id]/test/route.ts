import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const workflowId = params.id;
    const testPayload = await request.json();
    const N8N_BASE_URL = process.env.N8N_BASE_URL;
    
    if (!N8N_BASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'N8n base URL not configured'
      }, { status: 500 });
    }
    
    // Test the webhook endpoint
    const webhookUrl = `${N8N_BASE_URL}/webhook/crew-request`;
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPayload)
      });
      
      const responseData = await response.text();
      
      if (response.ok) {
        try {
          const jsonData = JSON.parse(responseData);
          return NextResponse.json({
            success: true,
            message: 'Workflow test successful',
            response: jsonData,
            status: response.status
          });
        } catch (parseError) {
          return NextResponse.json({
            success: true,
            message: 'Workflow test completed (non-JSON response)',
            response: responseData,
            status: response.status
          });
        }
      } else {
        return NextResponse.json({
          success: false,
          message: `Workflow test failed: ${response.status}`,
          response: responseData,
          status: response.status
        });
      }
    } catch (networkError) {
      return NextResponse.json({
        success: false,
        error: 'Network error testing workflow',
        details: networkError instanceof Error ? networkError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to test workflow:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
