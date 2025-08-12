import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Import the fixed getLocalWorkflows function
import { getLocalWorkflows } from '@/lib/workflow-utils';

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  try {
    // Get workflows from both sources
    const [n8nWorkflows, localWorkflows] = await Promise.all([
      fetchN8nWorkflows(),
      getLocalWorkflows()
    ]);

    // Merge and return workflows
    const mergedWorkflows = mergeWorkflows(n8nWorkflows, localWorkflows);
    
    return NextResponse.json({
      success: true,
      workflows: mergedWorkflows,
      count: mergedWorkflows.length,
      sources: {
        n8n: n8nWorkflows.length,
        local: localWorkflows.length
      }
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

async function fetchN8nWorkflows(): Promise<N8nWorkflow[]> {
  // This would fetch from n8n instance
  // For now, return empty array
  return [];
}

function mergeWorkflows(n8nWorkflows: N8nWorkflow[], localWorkflows: any[]): any[] {
  const merged = [...n8nWorkflows.map(w => ({ ...w, source: 'n8n' }))];
  
  // Add local workflows that don't exist in n8n (by name matching)
  const n8nNames = new Set(n8nWorkflows.map(w => w.name));
  const uniqueLocal = localWorkflows.filter(w => !n8nNames.has(w.name));
  
  merged.push(...uniqueLocal);
  
  // Sort by update time
  return merged.sort((a, b) => 
    new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  );
}

export async function POST(request: Request) {
  try {
    const workflow = await request.json();
    
    // Save workflow locally first
    const savedLocal = await saveWorkflowLocally(workflow);
    
    // Try to push to n8n if credentials are available
    let savedN8n = null;
    try {
      savedN8n = await pushWorkflowToN8n(workflow);
    } catch (n8nError) {
      console.warn('Failed to push to n8n:', n8nError);
    }
    
    return NextResponse.json({
      success: true,
      workflow: savedN8n || savedLocal,
      saved: {
        local: !!savedLocal,
        n8n: !!savedN8n
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

async function saveWorkflowLocally(workflow: any): Promise<any> {
  const workflowsDir = path.join(process.cwd(), 'workflows');
  
  // Ensure directory exists
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
  
  return workflowWithMeta;
}

async function pushWorkflowToN8n(workflow: any): Promise<any> {
  // This would push to n8n instance
  // For now, return null to indicate failure
  return null;
}
