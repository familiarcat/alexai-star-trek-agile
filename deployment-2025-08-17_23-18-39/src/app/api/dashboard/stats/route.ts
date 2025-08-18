import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock dashboard statistics for now
    // In production, this would fetch from a database or external service
    const stats = {
      projects: {
        total: 5,
        active: 3,
        completed: 1,
        pending: 1
      },
      tasks: {
        total: 25,
        completed: 18,
        pending: 4,
        inProgress: 3
      },
      crew: {
        total: 12,
        online: 8,
        away: 3,
        busy: 1
      },
      system: {
        status: 'operational',
        uptime: '99.9%',
        lastUpdate: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      stats: {
        projects: { total: 0, active: 0, completed: 0, pending: 0 },
        tasks: { total: 0, completed: 0, pending: 0, inProgress: 0 },
        crew: { total: 0, online: 0, away: 0, busy: 0 },
        system: { status: 'error', uptime: '0%', lastUpdate: new Date().toISOString() }
      }
    }, { status: 500 });
  }
}
