import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const commanderRiker = {
      id: 'commander-riker',
      name: 'Commander William T. Riker',
      role: 'First Officer',
      department: 'Command',
      capabilities: [
        'Strategic command decisions',
        'Tactical operations',
        'Crew coordination',
        'Diplomatic negotiations',
        'Emergency response leadership'
      ],
      status: 'active',
      currentAssignment: 'Bridge command and tactical operations',
      performanceMetrics: {
        leadership: 95.2,
        tactical: 92.8,
        diplomacy: 88.5,
        responseTime: 0.8
      }
    };

    return NextResponse.json(commanderRiker);
  } catch (error) {
    console.error('Error fetching Commander Riker:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Commander Riker' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process commander riker updates
    const updatedData = {
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system'
    };

    return NextResponse.json({
      message: 'Commander Riker updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating Commander Riker:', error);
    return NextResponse.json(
      { error: 'Failed to update Commander Riker' },
      { status: 500 }
    );
  }
}
