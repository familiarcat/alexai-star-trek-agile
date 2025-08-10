import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envVars = {
      N8N_BASE_URL: process.env.N8N_BASE_URL,
      N8N_API_KEY: process.env.N8N_API_KEY ? `${process.env.N8N_API_KEY.substring(0, 20)}...` : 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV,
    };

    // Test n8n connection
    let n8nTest = null;
    if (process.env.N8N_BASE_URL) {
      try {
        const response = await fetch(`${process.env.N8N_BASE_URL}/api/v1/workflows`, {
          headers: {
            'X-N8N-API-KEY': process.env.N8N_API_KEY || '',
          },
        });
        
        n8nTest = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        };
      } catch (error) {
        n8nTest = {
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envVars,
      n8nTest,
      message: 'Debug information retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
