import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In development, proxy to Express.js server
    const apiBase = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : '';
    
    const response = await fetch(`${apiBase}/api/dashboard/stats`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard stats API error:', error);
    
    // Fallback mock data
    return NextResponse.json({
      success: true,
      stats: {
        total_projects: 0,
        active_projects: 0,
        completed_projects: 0,
        total_tasks: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        team_members: 0,
        ai_consultations: 0
      }
    });
  }
} 