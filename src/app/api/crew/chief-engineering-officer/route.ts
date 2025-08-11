import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const chiefEngineeringOfficer = {
      id: 'chief-engineering-officer',
      name: 'Lieutenant Commander Geordi La Forge',
      role: 'Chief Engineering Officer',
      department: 'Engineering',
      capabilities: [
        'Warp core maintenance',
        'Systems integration',
        'Emergency repairs',
        'Innovation and optimization',
        'Technical troubleshooting'
      ],
      status: 'active',
      currentAssignment: 'Engineering bay and warp core operations',
      performanceMetrics: {
        systemEfficiency: 99.1,
        repairSuccessRate: 98.8,
        innovationIndex: 94.5
      }
    };

    return NextResponse.json(chiefEngineeringOfficer);
  } catch (error) {
    console.error('Error fetching Chief Engineering Officer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Chief Engineering Officer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process engineering officer updates
    const updatedData = {
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system'
    };

    return NextResponse.json({
      message: 'Chief Engineering Officer updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating Chief Engineering Officer:', error);
    return NextResponse.json(
      { error: 'Failed to update Chief Engineering Officer' },
      { status: 500 }
    );
  }
}
