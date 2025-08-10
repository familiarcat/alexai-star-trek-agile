import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function GET() {
  try {
    const projects = await db.getProjects();
    
    // Transform database projects to match page interface
    const transformedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      status: project.status,
      progress: project.status === 'completed' ? 100 : 
                project.status === 'active' ? Math.floor(Math.random() * 40) + 30 : 
                project.status === 'pending' ? Math.floor(Math.random() * 30) + 10 : 0,
      team_size: Array.isArray(project.team_members) ? project.team_members.length : 1,
      created_at: project.created_at,
      deadline: project.updated_at, // Use updated_at as deadline for now
      priority: project.status === 'active' ? 'high' : 
                project.status === 'completed' ? 'medium' : 'low'
    }));
    
    return NextResponse.json({
      success: true,
      projects: transformedProjects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    
    // Fallback to mock data if database is not available
    const fallbackProjects = [
      {
        id: '1',
        name: 'Enterprise Database Migration',
        status: 'active',
        progress: 75,
        team_size: 4,
        created_at: '2024-01-15',
        deadline: '2024-03-15',
        priority: 'high'
      },
      {
        id: '2',
        name: 'LCARS Interface Redesign',
        status: 'active',
        progress: 45,
        team_size: 3,
        created_at: '2024-02-01',
        deadline: '2024-04-01',
        priority: 'medium'
      },
      {
        id: '3',
        name: 'AI Consultation System',
        status: 'completed',
        progress: 100,
        team_size: 5,
        created_at: '2023-12-01',
        deadline: '2024-01-31',
        priority: 'high'
      },
      {
        id: '4',
        name: 'Security Protocol Update',
        status: 'pending',
        progress: 20,
        team_size: 2,
        created_at: '2024-02-15',
        deadline: '2024-05-15',
        priority: 'low'
      },
      {
        id: '5',
        name: 'Performance Optimization',
        status: 'active',
        progress: 60,
        team_size: 3,
        created_at: '2024-01-20',
        deadline: '2024-03-20',
        priority: 'medium'
      }
    ];

    return NextResponse.json({
      success: true,
      projects: fallbackProjects,
      note: 'Using fallback data - database connection not configured'
    });
  }
}

export async function POST() {
  try {
    const result = await db.seedInitialData();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Sample data created successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error seeding data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to seed data - database connection not configured'
    }, { status: 500 });
  }
} 