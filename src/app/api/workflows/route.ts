import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Try to get workflows from n8n integration first
    try {
      const n8nResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/n8n-integration/workflows`);
      if (n8nResponse.ok) {
        const n8nData = await n8nResponse.json();
        return NextResponse.json(n8nData);
      }
    } catch (error) {
      console.warn('N8n integration failed, falling back to local workflows');
    }

    // Fallback to local workflows
    const localResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/workflows/local`);
    if (localResponse.ok) {
      const localData = await localResponse.json();
      return NextResponse.json(localData);
    }

    // If both fail, return empty result
    return NextResponse.json({
      success: true,
      workflows: [],
      count: 0,
      message: 'No workflows available'
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
    
    // Try to save to n8n integration first
    try {
      const n8nResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/n8n-integration/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      });
      
      if (n8nResponse.ok) {
        const n8nData = await n8nResponse.json();
        return NextResponse.json(n8nData);
      }
    } catch (error) {
      console.warn('N8n integration failed, falling back to local storage');
    }

    // Fallback to local storage
    const localResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/workflows/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    });
    
    if (localResponse.ok) {
      const localData = await localResponse.json();
      return NextResponse.json(localData);
    }

    throw new Error('Failed to save workflow to both n8n and local storage');
  } catch (error) {
    console.error('Failed to save workflow:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
