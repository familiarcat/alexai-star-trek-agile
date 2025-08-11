import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const chiefSecurityOfficer = {
      id: 'chief-security-officer',
      name: 'Lieutenant Worf',
      role: 'Chief Security Officer',
      department: 'Security',
      capabilities: [
        'Tactical analysis',
        'Combat training',
        'Security protocols',
        'Threat assessment',
        'Defensive strategies'
      ],
      status: 'active',
      currentAssignment: 'Security operations and tactical readiness',
      performanceMetrics: {
        threatDetectionRate: 99.5,
        responseEfficiency: 98.9,
        securityIncidentPrevention: 97.2
      }
    };

    return NextResponse.json(chiefSecurityOfficer);
  } catch (error) {
    console.error('Error fetching Chief Security Officer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Chief Security Officer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process security officer updates
    const updatedData = {
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system'
    };

    return NextResponse.json({
      message: 'Chief Security Officer updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating Chief Security Officer:', error);
    return NextResponse.json(
      { error: 'Failed to update Chief Security Officer' },
      { status: 500 }
    );
  }
}
