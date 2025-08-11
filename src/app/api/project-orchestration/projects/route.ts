import { NextResponse } from 'next/server';

export async function GET() {
  const projects = [
    {
      id: "market-domination-core",
      name: "Market Domination Core",
      status: "active",
      marketTarget: "Primary market segment",
      innovationFocus: "Core platform enhancement",
      crewInvolvement: ["Commander Data", "Chief Engineer Scott", "Ships Computer"],
      progress: 85
    },
    {
      id: "continuous-innovation-engine",
      name: "Continuous Innovation Engine",
      status: "development",
      marketTarget: "Innovation leadership",
      innovationFocus: "Automated innovation pipeline",
      crewInvolvement: ["Chief Engineer Scott", "Counselor Troi", "Ships Computer"],
      progress: 60
    },
    {
      id: "ai-coordination-platform",
      name: "AI Coordination Platform",
      status: "planning",
      marketTarget: "AI coordination market",
      innovationFocus: "Multi-agent orchestration",
      crewInvolvement: ["Commander Data", "Lieutenant Worf", "Ships Computer"],
      progress: 25
    }
  ];

  return NextResponse.json(projects);
}
