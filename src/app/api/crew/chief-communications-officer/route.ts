import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const chiefCommunicationsOfficer = {
      id: 'chief-communications-officer',
      name: 'Lieutenant Uhura',
      role: 'Chief Communications Officer',
      department: 'Communications',
      capabilities: [
        'Universal translator expertise',
        'Diplomatic communications',
        'Signal analysis',
        'Inter-species relations',
        'Emergency communications protocols'
      ],
      status: 'active',
      currentAssignment: 'Bridge communications and diplomatic liaison',
      performanceMetrics: {
        translationAccuracy: 99.7,
        responseTime: 1.8,
        diplomaticSuccessRate: 95.2
      }
    };

    return NextResponse.json(chiefCommunicationsOfficer);
  } catch (error) {
    console.error('Error fetching Chief Communications Officer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Chief Communications Officer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process communications officer updates
    const updatedData = {
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system'
    };

    return NextResponse.json({
      message: 'Chief Communications Officer updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating Chief Communications Officer:', error);
    return NextResponse.json(
      { error: 'Failed to update Chief Communications Officer' },
      { status: 500 }
    );
  }
}
