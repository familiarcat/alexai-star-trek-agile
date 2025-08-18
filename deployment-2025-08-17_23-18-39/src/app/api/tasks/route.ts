import { NextResponse } from 'next/server';
import { supabase } from '@/core/supabase';

export async function GET() {
  try {
    // For now, return mock data since we don't have a tasks table
    // In the future, this would query: const { data: tasks } = await supabase.from('tasks').select('*');
    
    return NextResponse.json({
      success: true,
      tasks: []
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    
    // Fallback to mock data if database is not available
    const fallbackTasks = [
      {
        id: '1',
        title: 'Design LCARS Color Palette',
        description: 'Create authentic Star Trek LCARS color scheme with proper contrast ratios',
        status: 'completed',
        priority: 'high',
        assignee: 'Captain Picard',
        project_id: '1',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        due_date: '2024-01-15T00:00:00Z',
        tags: ['design', 'ui', 'lcars'],
        story_points: 8,
        dependencies: []
      },
      {
        id: '2',
        title: 'Implement L-Shaped Elements',
        description: 'Build characteristic LCARS L-shaped interface components',
        status: 'in_progress',
        priority: 'high',
        assignee: 'Geordi La Forge',
        project_id: '2',
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
        due_date: '2024-02-01T00:00:00Z',
        tags: ['frontend', 'components'],
        story_points: 16,
        dependencies: ['Design LCARS Color Palette']
      },
      {
        id: '3',
        title: 'Database Schema Optimization',
        description: 'Optimize database structure for Star Fleet operations',
        status: 'todo',
        priority: 'medium',
        assignee: 'Commander Data',
        project_id: '1',
        created_at: '2024-02-15T00:00:00Z',
        updated_at: '2024-02-15T00:00:00Z',
        due_date: '2024-02-15T00:00:00Z',
        tags: ['database', 'optimization'],
        story_points: 24,
        dependencies: []
      },
      {
        id: '4',
        title: 'AI Agent Coordination',
        description: 'Coordinate multiple AI agents for project management',
        status: 'todo',
        priority: 'critical',
        assignee: 'Counselor Troi',
        project_id: '3',
        created_at: '2024-01-31T00:00:00Z',
        updated_at: '2024-01-31T00:00:00Z',
        due_date: '2024-01-31T00:00:00Z',
        tags: ['ai', 'coordination'],
        story_points: 12,
        dependencies: []
      },
      {
        id: '5',
        title: 'Security Protocol Update',
        description: 'Update security protocols for new LCARS interface',
        status: 'overdue',
        priority: 'critical',
        assignee: 'Lieutenant Worf',
        project_id: '4',
        created_at: '2024-01-10T00:00:00Z',
        updated_at: '2024-01-10T00:00:00Z',
        due_date: '2024-01-10T00:00:00Z',
        tags: ['security', 'protocols'],
        story_points: 20,
        dependencies: []
      }
    ];

    return NextResponse.json({
      success: true,
      tasks: fallbackTasks,
      note: 'Using fallback data - database connection not configured'
    });
  }
} 