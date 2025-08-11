import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Projects storage file
const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(PROJECTS_FILE);
  await fs.mkdir(dataDir, { recursive: true });
}

// Load projects from file
async function loadProjects() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return default projects if file doesn't exist
    return [
      {
        id: '1',
        name: 'LCARS Interface Development',
        status: 'active',
        progress: 75,
        team_size: 8,
        created_at: '2024-01-15',
        deadline: '2024-03-15',
        priority: 'high',
        description: 'Modern LCARS interface development for Star Trek applications',
        category: 'Development'
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
        description: 'Integration of AI agents for crew coordination and decision making',
        category: 'AI/ML'
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
        description: 'Performance optimization of the main database systems',
        category: 'Infrastructure'
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
        description: 'Enhanced security protocols for the Enterprise systems',
        category: 'Security'
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
        description: 'Real-time performance monitoring and alerting system',
        category: 'Monitoring'
      }
    ];
  }
}

// Save projects to file
async function saveProjects(projects: any[]) {
  await ensureDataDir();
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

export async function GET() {
  try {
    const projects = await loadProjects();
    
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

export async function POST(request: Request) {
  try {
    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.name || !projectData.description) {
      return NextResponse.json({
        success: false,
        error: 'Project name and description are required'
      }, { status: 400 });
    }
    
    // Load existing projects
    const projects = await loadProjects();
    
    // Create new project
    const newProject = {
      id: Date.now().toString(), // Simple ID generation
      name: projectData.name,
      description: projectData.description,
      status: projectData.status || 'pending',
      progress: projectData.progress || 0,
      team_size: projectData.team_size || 1,
      created_at: new Date().toISOString().split('T')[0],
      deadline: projectData.deadline || '',
      priority: projectData.priority || 'medium',
      category: projectData.category || 'General',
      ...projectData // Allow additional fields
    };
    
    // Add to projects array
    projects.push(newProject);
    
    // Save to file
    await saveProjects(projects);
    
    return NextResponse.json({
      success: true,
      project: newProject,
      message: 'Project created successfully'
    });
    
  } catch (error) {
    console.error('Error in projects POST:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 