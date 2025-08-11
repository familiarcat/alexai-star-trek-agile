import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const crewMembers = [
      {
        id: 'captain-picard',
        name: 'Captain Jean-Luc Picard',
        role: 'Commanding Officer',
        department: 'Command',
        status: 'active'
      },
      {
        id: 'commander-riker',
        name: 'Commander William T. Riker',
        role: 'First Officer',
        department: 'Command',
        status: 'active'
      },
      {
        id: 'commander-data',
        name: 'Commander Data',
        role: 'Second Officer & Chief Operations Officer',
        department: 'Operations',
        status: 'active'
      },
      {
        id: 'chief-medical-officer',
        name: 'Dr. Beverly Crusher',
        role: 'Chief Medical Officer',
        department: 'Medical',
        status: 'active'
      },
      {
        id: 'chief-communications-officer',
        name: 'Lieutenant Uhura',
        role: 'Chief Communications Officer',
        department: 'Communications',
        status: 'active'
      },
      {
        id: 'chief-engineering-officer',
        name: 'Lieutenant Commander Geordi La Forge',
        role: 'Chief Engineering Officer',
        department: 'Engineering',
        status: 'active'
      },
      {
        id: 'chief-security-officer',
        name: 'Lieutenant Worf',
        role: 'Chief Security Officer',
        department: 'Security',
        status: 'active'
      }
    ];

    return NextResponse.json(crewMembers);
  } catch (error) {
    console.error('Error fetching crew list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crew list' },
      { status: 500 }
    );
  }
}
