import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, crewMember, action, target } = body;

    // Simulate crew coordination response
    const coordinationResponse = {
      timestamp: new Date().toISOString(),
      crewMember: crewMember || 'unknown',
      action: action || 'coordination',
      message: message || 'Crew coordination initiated',
      target: target || 'all',
      status: 'coordinated',
      response: generateCrewResponse(crewMember, message, action),
      metadata: {
        priority: 'medium',
        department: getDepartmentForCrewMember(crewMember),
        coordinationId: `coord-${Date.now()}`
      }
    };

    return NextResponse.json(coordinationResponse);
  } catch (error) {
    console.error('Error in crew coordination:', error);
    return NextResponse.json({
      error: 'Failed to process crew coordination',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateCrewResponse(crewMember: string, message: string, action: string): string {
  const responses = {
    'captain-picard': `Captain's Log: ${message}. Make it so.`,
    'commander-riker': `Acknowledged, Captain. Executing ${action}.`,
    'commander-data': `Analysis complete. ${message} processed with 99.9% accuracy.`,
    'chief-medical-officer': `Medical protocols activated. ${message} under medical supervision.`,
    'chief-communications-officer': `Communications established. ${message} transmitted to all departments.`,
    'chief-engineering-officer': `Engineering systems engaged. ${action} operational.`,
    'chief-security-officer': `Security protocols implemented. ${message} secured.`,
    'default': `Crew coordination acknowledged: ${message}`
  };

  return responses[crewMember as keyof typeof responses] || responses.default;
}

function getDepartmentForCrewMember(crewMember: string): string {
  const departments = {
    'captain-picard': 'Command',
    'commander-riker': 'Command',
    'commander-data': 'Operations',
    'chief-medical-officer': 'Medical',
    'chief-communications-officer': 'Communications',
    'chief-engineering-officer': 'Engineering',
    'chief-security-officer': 'Security',
    'default': 'General'
  };

  return departments[crewMember as keyof typeof departments] || departments.default;
}

export async function GET() {
  try {
    const coordinationStatus = {
      status: 'active',
      activeCoordination: 3,
      lastUpdate: new Date().toISOString(),
      crewMembers: [
        'captain-picard',
        'commander-riker',
        'commander-data',
        'chief-medical-officer',
        'chief-communications-officer',
        'chief-engineering-officer',
        'chief-security-officer'
      ],
      departments: ['Command', 'Operations', 'Medical', 'Communications', 'Engineering', 'Security']
    };

    return NextResponse.json(coordinationStatus);
  } catch (error) {
    console.error('Error fetching coordination status:', error);
    return NextResponse.json({
      error: 'Failed to fetch coordination status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
