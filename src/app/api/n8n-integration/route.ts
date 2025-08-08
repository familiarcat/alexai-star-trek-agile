import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const N8N_BASE_URL = process.env.N8N_BASE_URL;
    const N8N_API_KEY = process.env.N8N_API_KEY;
    
    // Check if n8n credentials are configured
    if (!N8N_BASE_URL || !N8N_API_KEY) {
      return NextResponse.json({
        connected: false,
        status: 'credentials_missing',
        message: 'N8n credentials not configured',
        config: {
          baseUrl: N8N_BASE_URL || 'not_set',
          apiKey: N8N_API_KEY ? 'configured' : 'not_set'
        }
      });
    }
    
    // Test connection to n8n
    try {
      const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          connected: true,
          status: 'connected',
          message: 'Successfully connected to n8n',
          config: {
            baseUrl: N8N_BASE_URL,
            apiKey: 'configured'
          },
          workflows: {
            count: data.data?.length || 0
          }
        });
      } else {
        return NextResponse.json({
          connected: false,
          status: 'connection_failed',
          message: `Failed to connect to n8n: ${response.status} ${response.statusText}`,
          config: {
            baseUrl: N8N_BASE_URL,
            apiKey: 'configured'
          }
        });
      }
    } catch (connectionError) {
      return NextResponse.json({
        connected: false,
        status: 'network_error',
        message: `Network error connecting to n8n: ${connectionError.message}`,
        config: {
          baseUrl: N8N_BASE_URL,
          apiKey: 'configured'
        }
      });
    }
  } catch (error) {
    console.error('N8n integration check failed:', error);
    return NextResponse.json({
      connected: false,
      status: 'error',
      message: 'Internal error checking n8n integration',
      error: error.message
    }, { status: 500 });
  }
}