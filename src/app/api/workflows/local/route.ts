import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
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
      
      return NextResponse.json({
        success: true,
        workflows,
        count: workflows.length
      });
    } catch (error) {
      // Directory might not exist yet
      return NextResponse.json({
        success: true,
        workflows: [],
        count: 0
      });
    }
  } catch (error) {
    console.error('Failed to read local workflows:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to read local workflows',
      workflows: [],
      count: 0
    });
  }
}
