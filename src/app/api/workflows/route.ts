import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Import the functions directly instead of making HTTP calls
import { getLocalWorkflows } from '@/lib/workflow-utils';

export async function GET() {
  try {
    // Get local workflows directly
    const localWorkflows = await getLocalWorkflows();
    
    return NextResponse.json({
      success: true,
      workflows: localWorkflows,
      count: localWorkflows.length,
      source: 'local'
    });
  } catch (error) {
    console.error('Failed to get workflows:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to load workflows',
      workflows: [],
      count: 0
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const workflow = await request.json();
    
    // Save workflow locally
    const workflowsDir = path.join(process.cwd(), 'workflows');
    await fs.mkdir(workflowsDir, { recursive: true });
    
    // Generate filename from workflow name
    const filename = `${workflow.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    const filePath = path.join(workflowsDir, filename);
    
    // Add metadata
    const workflowWithMeta = {
      ...workflow,
      updatedAt: new Date().toISOString(),
      source: 'local'
    };
    
    await fs.writeFile(filePath, JSON.stringify(workflowWithMeta, null, 2));
    
    return NextResponse.json({
      success: true,
      workflow: workflowWithMeta,
      saved: {
        local: true,
        n8n: false
      }
    });
  } catch (error) {
    console.error('Failed to save workflow:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
