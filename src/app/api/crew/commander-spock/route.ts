import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const commanderSpock = {
      id: 'commander-spock',
      name: 'Commander Spock',
      role: 'Science Officer & First Officer',
      department: 'Science',
      capabilities: [
        'Logical analysis and scientific reasoning',
        'Risk assessment and probability calculations',
        'Scientific method and research methodology',
        'Strategic planning and tactical analysis',
        'Inter-species diplomacy and cultural analysis'
      ],
      status: 'active',
      currentAssignment: 'Scientific research and logical analysis',
      performanceMetrics: {
        logicalReasoning: 99.9,
        scientificAccuracy: 99.8,
        riskAssessment: 98.5,
        responseTime: 0.2
      }
    };

    return NextResponse.json(commanderSpock);
  } catch (error) {
    console.error('Error fetching Commander Spock:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Commander Spock' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process commander spock updates
    const updatedData = {
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system'
    };

    return NextResponse.json({
      message: 'Commander Spock updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating Commander Spock:', error);
    return NextResponse.json(
      { error: 'Failed to update Commander Spock' },
      { status: 500 }
    );
  }
}
