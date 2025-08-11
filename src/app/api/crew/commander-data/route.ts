import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const commanderData = {
      id: 'commander-data',
      name: 'Commander Data',
      role: 'Second Officer & Chief Operations Officer',
      department: 'Operations',
      capabilities: [
        'Advanced computational analysis',
        'Strategic planning',
        'Systems optimization',
        'Logical reasoning',
        'Multitasking operations'
      ],
      status: 'active',
      currentAssignment: 'Bridge operations and tactical analysis',
      performanceMetrics: {
        efficiency: 99.8,
        accuracy: 99.9,
        responseTime: 0.1
      }
    };

    return NextResponse.json(commanderData);
  } catch (error) {
    console.error('Error fetching Commander Data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Commander Data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process commander data updates
    const updatedData = {
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system'
    };

    return NextResponse.json({
      message: 'Commander Data updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating Commander Data:', error);
    return NextResponse.json(
      { error: 'Failed to update Commander Data' },
      { status: 500 }
    );
  }
}
