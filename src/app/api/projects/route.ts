import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock projects data for now
    // In production, this would fetch from a database or external service
    const projects = [
      {
        id: '1',
        name: 'LCARS Interface Development',
        status: 'active',
        progress: 75,
        team_size: 8,
        created_at: '2024-01-15',
        deadline: '2024-03-15',
        priority: 'high',
        description: 'Modern LCARS interface development for Star Trek applications'
      },
      {
        id: '2',
        name: 'AI Agent Integration',
        status: 'active',
        progress: 45,
        team_size: 6,
        created_at: '2024-01-20',
        deadline: '2024-04-20',
        priority: 'medium',
        description: 'Integration of AI agents for crew coordination and decision making'
      },
      {
        id: '3',
        name: 'Database Optimization',
        status: 'completed',
        progress: 100,
        team_size: 4,
        created_at: '2024-01-10',
        deadline: '2024-02-10',
        priority: 'low',
        description: 'Performance optimization of the main database systems'
      },
      {
        id: '4',
        name: 'Security Protocol Implementation',
        status: 'pending',
        progress: 0,
        team_size: 5,
        created_at: '2024-01-25',
        deadline: '2024-05-25',
        priority: 'high',
        description: 'Enhanced security protocols for the Enterprise systems'
      },
      {
        id: '5',
        name: 'Performance Monitoring System',
        status: 'active',
        progress: 30,
        team_size: 7,
        created_at: '2024-01-20',
        deadline: '2024-03-20',
        priority: 'medium',
        description: 'Real-time performance monitoring and alerting system'
      }
    ];

    return NextResponse.json({
      success: true,
      projects,
      total: projects.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Projects API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch projects',
      projects: [],
      total: 0
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Database seeding functionality not yet configured
    return NextResponse.json({
      success: false,
      error: 'Database seeding functionality not yet configured'
    }, { status: 501 });
  } catch (error) {
    console.error('Error in projects POST:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 });
  }
} 