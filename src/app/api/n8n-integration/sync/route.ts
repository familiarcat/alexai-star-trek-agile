import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface SyncRequest {
  direction: 'push' | 'pull' | 'bidirectional';
  workflowIds?: string[];
  force?: boolean;
}

interface SyncResult {
  success: boolean;
  operations: {
    pushed: number;
    pulled: number;
    conflicts: number;
    errors: string[];
  };
  workflows: any[];
}

export async function POST(request: Request) {
  try {
    const { direction, workflowIds, force = false }: SyncRequest = await request.json();
    
    let result: SyncResult = {
      success: false,
      operations: {
        pushed: 0,
        pulled: 0,
        conflicts: 0,
        errors: []
      },
      workflows: []
    };
    
    switch (direction) {
      case 'pull':
        result = await pullWorkflowsFromN8n(workflowIds, force);
        break;
      case 'push':
        result = await pushWorkflowsToN8n(workflowIds, force);
        break;
      case 'bidirectional':
        // First pull, then push
        const pullResult = await pullWorkflowsFromN8n(workflowIds, force);
        const pushResult = await pushWorkflowsToN8n(workflowIds, force);
        
        result = {
          success: pullResult.success && pushResult.success,
          operations: {
            pushed: pushResult.operations.pushed,
            pulled: pullResult.operations.pulled,
            conflicts: pullResult.operations.conflicts + pushResult.operations.conflicts,
            errors: [...pullResult.operations.errors, ...pushResult.operations.errors]
          },
          workflows: [...pullResult.workflows, ...pushResult.workflows]
        };
        break;
      default:
        throw new Error(`Invalid sync direction: ${direction}`);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Sync operation failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Sync operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function pullWorkflowsFromN8n(workflowIds?: string[], force = false): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    operations: { pushed: 0, pulled: 0, conflicts: 0, errors: [] },
    workflows: []
  };
  
  try {
    // Fetch workflows from n8n
    const n8nWorkflows = await fetchN8nWorkflows();
    
    // Filter if specific workflow IDs requested
    const workflowsToSync = workflowIds 
      ? n8nWorkflows.filter(w => workflowIds.includes(w.id))
      : n8nWorkflows;
    
    const workflowsDir = path.join(process.cwd(), 'sync-system', 'workflows');
    await fs.mkdir(workflowsDir, { recursive: true });
    
    for (const workflow of workflowsToSync) {
      try {
        const filename = `${workflow.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
        const filePath = path.join(workflowsDir, filename);
        
        // Check if local file exists and handle conflicts
        let shouldWrite = true;
        
        if (!force) {
          try {
            const existingContent = await fs.readFile(filePath, 'utf-8');
            const existingWorkflow = JSON.parse(existingContent);
            
            // Compare update times if available
            const n8nTime = new Date(workflow.updatedAt || 0);
            const localTime = new Date(existingWorkflow.updatedAt || 0);
            
            if (localTime > n8nTime) {
              result.operations.conflicts++;
              shouldWrite = false;
              console.warn(`Conflict: Local version of ${workflow.name} is newer than n8n version`);
            }
          } catch (error) {
            // File doesn't exist or is invalid, proceed with write
          }
        }
        
        if (shouldWrite) {
          // Add sync metadata
          const workflowWithMeta = {
            ...workflow,
            syncedAt: new Date().toISOString(),
            syncDirection: 'pulled-from-n8n',
            originalId: workflow.id
          };
          
          await fs.writeFile(filePath, JSON.stringify(workflowWithMeta, null, 2));
          result.operations.pulled++;
          result.workflows.push(workflowWithMeta);
        }
      } catch (error) {
        result.operations.errors.push(`Failed to pull ${workflow.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    result.success = result.operations.errors.length === 0;
  } catch (error) {
    result.success = false;
    result.operations.errors.push(`Failed to fetch from n8n: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return result;
}

async function pushWorkflowsToN8n(workflowIds?: string[], force = false): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    operations: { pushed: 0, pulled: 0, conflicts: 0, errors: [] },
    workflows: []
  };
  
  try {
    // Get local workflows
    const localWorkflows = await getLocalWorkflows();
    
    // Filter if specific workflow IDs requested
    const workflowsToSync = workflowIds 
      ? localWorkflows.filter(w => workflowIds.includes(w.id))
      : localWorkflows;
    
    // Get existing n8n workflows to check for conflicts
    const n8nWorkflows = await fetchN8nWorkflows();
    const n8nWorkflowsByName = new Map(n8nWorkflows.map(w => [w.name, w]));
    
    for (const localWorkflow of workflowsToSync) {
      try {
        const existingN8nWorkflow = n8nWorkflowsByName.get(localWorkflow.name);
        
        if (existingN8nWorkflow && !force) {
          // Check if n8n version is newer
          const n8nTime = new Date(existingN8nWorkflow.updatedAt || 0);
          const localTime = new Date(localWorkflow.updatedAt || 0);
          
          if (n8nTime > localTime) {
            result.operations.conflicts++;
            console.warn(`Conflict: n8n version of ${localWorkflow.name} is newer than local version`);
            continue;
          }
          
          // Update existing workflow
          await updateN8nWorkflow(existingN8nWorkflow.id, localWorkflow);
        } else {
          // Create new workflow
          await createN8nWorkflow(localWorkflow);
        }
        
        result.operations.pushed++;
        result.workflows.push(localWorkflow);
      } catch (error) {
        result.operations.errors.push(`Failed to push ${localWorkflow.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    result.success = result.operations.errors.length === 0;
  } catch (error) {
    result.success = false;
    result.operations.errors.push(`Failed to push to n8n: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return result;
}

async function fetchN8nWorkflows(): Promise<any[]> {
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
        
        return {
          ...workflow,
          id: workflow.id || `local-${file.replace('.json', '')}`,
          filename: file
        };
      })
    );
    
    return workflows;
  } catch (error) {
    console.error('Failed to read local workflows:', error);
    return [];
  }
}

async function createN8nWorkflow(workflow: any): Promise<any> {
  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_API_KEY = process.env.N8N_API_KEY;
  
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    throw new Error('N8n credentials not configured');
  }
  
  // Clean workflow data for n8n
  const { id, filename, syncedAt, syncDirection, originalId, ...cleanWorkflow } = workflow;
  
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

async function updateN8nWorkflow(workflowId: string, workflow: any): Promise<any> {
  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_API_KEY = process.env.N8N_API_KEY;
  
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    throw new Error('N8n credentials not configured');
  }
  
  // Clean workflow data for n8n
  const { id, filename, syncedAt, syncDirection, originalId, ...cleanWorkflow } = workflow;
  
  const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    method: 'PUT',
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
