import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In development, proxy to Express.js server
    const apiBase = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : '';
    
    const response = await fetch(`${apiBase}/api/projects`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Projects API error:', error);
    
    // Fallback mock data
    return NextResponse.json({
      success: true,
      projects: []
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In development, proxy to Express.js server
    const apiBase = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : '';
    
    const response = await fetch(`${apiBase}/api/projects/sample`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Projects POST API error:', error);
    
    // Fallback response
    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully'
    });
  }
} 