import { NextResponse } from 'next/server';

// Existing POST method (preserved)
export async function POST(request: Request) {
  try {
    const { query, context, urgency } = await request.json();
    
    // For now, return a mock response since we don't have N8N credentials
    const mockResponse = {
      status: 'processed',
      crew: 'dynamic-selection',
      response: {
        message: `Processed query: "${query}" with context: "${context}"`,
        urgency: urgency,
        selectedCrew: 'captain-picard',
        confidence: 0.85,
        processingTime: Date.now()
      }
    };
    
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('N8N integration error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// New GET method for status and info
export async function GET() {
  try {
    // Check if we can actually connect to n8n
    const n8nUrl = process.env.N8N_URL;
    const n8nApiKey = process.env.N8N_API_KEY;
    
    let connected = false;
    if (n8nUrl && n8nApiKey) {
      try {
        // Test connection by trying to fetch workflows
        const testResponse = await fetch(`${n8nUrl}/api/v1/workflows`, {
          headers: {
            'X-N8N-API-KEY': n8nApiKey
          }
        });
        connected = testResponse.ok;
      } catch (error) {
        console.log('N8N connection test failed:', error);
        connected = false;
      }
    }
    
    const systemStatus = {
      status: 'operational',
      connected: connected,
      architecture: 'best-of-both-worlds',
      timestamp: new Date().toISOString(),
      workflows: {
        current: 'human-intuition',
        enhanced: 'human-borg-hybrid',
        optimized: 'borg-efficiency'
      },
      crew: {
        active: 7,
        available: ['picard', 'data', 'troi', 'scott', 'spock', 'worf', 'observation-lounge']
      },
      integration: {
        supabase: 'connected',
        bilateral_sync: 'active',
        ui_refinement: 'live',
        n8n: connected ? 'connected' : 'disconnected'
      }
    };
    
    return NextResponse.json(systemStatus);
  } catch (error) {
    console.error('N8N status error:', error);
    return NextResponse.json(
      { error: 'Failed to get status', connected: false },
      { status: 500 }
    );
  }
}
