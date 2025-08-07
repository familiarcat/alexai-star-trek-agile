import { NextResponse } from 'next/server';

export async function GET() {
  // Pure Next.js API route with mock data
  const stats = {
    total_projects: 12,
    active_projects: 8,
    completed_projects: 4,
    total_tasks: 67,
    completed_tasks: 34,
    pending_tasks: 33,
    team_members: 15,
    ai_consultations: 234
  };

  return NextResponse.json({
    success: true,
    stats
  });
} 