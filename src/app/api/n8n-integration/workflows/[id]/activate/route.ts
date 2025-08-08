import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = params.id;
    const N8N_BASE_URL = process.env.N8N_BASE_URL;
    const N8N_API_KEY = process.env.N8N_API_KEY;
    
    if (!N8N_BASE_URL || !N8N_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'N8n credentials not configured'
      }, { status: 500 });
    }
    
    // Activate the workflow in n8n
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
      method: 'PATCH',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ active: true })
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: 'Workflow activated successfully',
        workflow: data.data
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `Failed to activate workflow: ${response.status} ${errorText}`
      }, { status: response.status });
    }
  } catch (error) {
    console.error('Failed to activate workflow:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to activate workflow',
      details: error.message
    }, { status: 500 });
  }
}
