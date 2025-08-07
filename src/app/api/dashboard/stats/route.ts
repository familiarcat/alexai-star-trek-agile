import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function GET() {
  try {
    const stats = await db.getDashboardStats();
    
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Fallback to mock data if database is not available
    const fallbackStats = {
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
      stats: fallbackStats,
      note: 'Using fallback data - database connection not configured'
    });
  }
} 