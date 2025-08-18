import fs from 'fs/promises';
import path from 'path';

export async function getLocalWorkflows(): Promise<any[]> {
  try {
    const workflowsDir = path.join(process.cwd(), 'workflows');
    
    try {
      const files = await fs.readdir(workflowsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const workflows = [];
      
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(workflowsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const workflow = JSON.parse(content);
          
          // Add metadata
          const stats = await fs.stat(filePath);
          
          workflows.push({
            ...workflow,
            id: `local-${file.replace('.json', '')}`,
            source: 'local',
            filename: file,
            updatedAt: stats.mtime.toISOString(),
            createdAt: stats.birthtime.toISOString()
          });
        } catch (fileError) {
          console.warn(`Skipping corrupted workflow file ${file}:`, fileError);
          // Continue processing other files instead of failing completely
          continue;
        }
      }
      
      return workflows;
    } catch (error) {
      // Directory might not exist yet
      return [];
    }
  } catch (error) {
    console.error('Failed to read local workflows:', error);
    return [];
  }
}
