import { NextResponse } from 'next/server';

export async function GET() {
  // Pure Next.js API route with mock data
  const projects = [
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
    projects
  });
}

export async function POST() {
  // Mock response for creating sample data
  return NextResponse.json({
    success: true,
    message: 'Sample data created successfully'
  });
} 