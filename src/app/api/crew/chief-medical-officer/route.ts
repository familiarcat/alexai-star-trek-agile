import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const chiefMedicalOfficer = {
      id: 'chief-medical-officer',
      name: 'Dr. Beverly Crusher',
      role: 'Chief Medical Officer',
      department: 'Medical',
      capabilities: [
        'Advanced medical diagnostics',
        'Emergency medicine',
        'Research and development',
        'Crew health monitoring',
        'Medical ethics consultation'
      ],
      status: 'active',
      currentAssignment: 'Medical bay operations and crew health',
      performanceMetrics: {
        patientRecoveryRate: 98.5,
        diagnosticAccuracy: 99.2,
        emergencyResponseTime: 2.1
      }
    };

    return NextResponse.json(chiefMedicalOfficer);
  } catch (error) {
    console.error('Error fetching Chief Medical Officer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Chief Medical Officer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process medical officer updates
    const updatedData = {
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system'
    };

    return NextResponse.json({
      message: 'Chief Medical Officer updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating Chief Medical Officer:', error);
    return NextResponse.json(
      { error: 'Failed to update Chief Medical Officer' },
      { status: 500 }
    );
  }
}
