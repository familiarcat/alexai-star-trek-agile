import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
    // Try to fetch from n8n first
    const n8nWorkflows = await fetchN8nWorkflows();
    
    // Also get local workflows
    const localWorkflows = await getLocalWorkflows();
    
    // Merge and deduplicate
    const allWorkflows = mergeWorkflows(n8nWorkflows, localWorkflows);
    
    return NextResponse.json({
      success: true,
      workflows: allWorkflows,
      sources: {
        n8n: n8nWorkflows.length,
        local: localWorkflows.length,
        total: allWorkflows.length
      }
    });
  } catch (error) {
    console.error('Failed to get workflows:', error);
    
    // Fallback to local workflows only
    try {
      const localWorkflows = await getLocalWorkflows();
      return NextResponse.json({
        success: true,
        workflows: localWorkflows,
        sources: {
          n8n: 0,
          local: localWorkflows.length,
          total: localWorkflows.length
        },
        warning: 'n8n connection failed, showing local workflows only'
      });
    } catch (localError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to load workflows from both n8n and local storage',
        details: {
          n8n: error instanceof Error ? error.message : 'Unknown error',
          local: localError instanceof Error ? localError.message : 'Unknown error'
        }
      }, { status: 500 });
    }
  }
}

async function fetchN8nWorkflows(): Promise<N8nWorkflow[]> {
  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_API_KEY = process.env.N8N_API_KEY;
  
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    throw new Error('N8n credentials not configured');
  }
  
  const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`N8n API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data || [];
}

async function getLocalWorkflows(): Promise<any[]> {
  const workflowsDir = path.join(process.cwd(), 'sync-system', 'workflows');
  
  try {
    const files = await fs.readdir(workflowsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const workflows = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(workflowsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const workflow = JSON.parse(content);
        
        // Add metadata
        const stats = await fs.stat(filePath);
        
        return {
          ...workflow,
          id: `local-${file.replace('.json', '')}`,
          source: 'local',
          filename: file,
          updatedAt: stats.mtime.toISOString(),
          createdAt: stats.birthtime.toISOString()
        };
      })
    );
    
    return workflows;
  } catch (error) {
    console.error('Failed to read local workflows:', error);
    return [];
  }
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
  const workflowsDir = path.join(process.cwd(), 'sync-system', 'workflows');
  
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
  
  return {
    ...workflowWithMeta,
    id: `local-${filename.replace('.json', '')}`,
    filename
  };
}

async function pushWorkflowToN8n(workflow: any): Promise<any> {
  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_API_KEY = process.env.N8N_API_KEY;
  
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    throw new Error('N8n credentials not configured');
  }
  
  // Remove local metadata before pushing
  const { source, filename, ...cleanWorkflow } = workflow;
  
  const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
    method: 'POST',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cleanWorkflow)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`N8n API error: ${response.status} ${errorText}`);
  }
  
  const data = await response.json();
  return data.data;
}
