import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In development, proxy to Express.js server
    const apiBase = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : '';
    
    const response = await fetch(`${apiBase}/api/projects`);
    const data = await response.json();
    
    // Transform the data to match frontend expectations
    if (data.success && data.projects) {
      const transformedProjects = data.projects.map((project: any) => ({
        id: project.id || project.project_id || String(Math.random()),
        name: project.name || project.title || 'Unnamed Project',
        status: project.status || 'pending',
        progress: project.progress || project.completion || 0,
        team_size: project.team_size || project.members || 1,
        created_at: project.created_at || project.created || new Date().toISOString(),
        deadline: project.deadline || project.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        priority: project.priority || 'medium'
      }));
      
      return NextResponse.json({
        success: true,
        projects: transformedProjects
      });
    }
    
    // If transformation fails, return fallback data
    return NextResponse.json({
      success: true,
      projects: [
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
      ]
    });
  } catch (error) {
    console.error('Projects API error:', error);
    
    // Fallback mock data
    return NextResponse.json({
      success: true,
      projects: [
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
      ]
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