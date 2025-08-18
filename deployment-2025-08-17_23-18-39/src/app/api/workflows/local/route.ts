import { NextResponse } from 'next/server';
import { getLocalWorkflows } from '@/core/workflow-utils';

export async function GET() {
  try {
    const workflows = await getLocalWorkflows();
    
    return NextResponse.json({
      success: true,
      workflows,
      count: workflows.length
    });
  } catch (error) {
    console.error('Failed to read local workflows:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to load workflows',
      workflows: [],
      count: 0
    }, { status: 500 });
  }
}
