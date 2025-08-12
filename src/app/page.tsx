import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { RealtimeStatus } from '@/components/lcars/realtime-collaboration';
import DashboardErrorBoundary from '@/components/lcars/dashboard-error-boundary';
import { 
  FolderIcon, 
  EyeIcon, 
  CogIcon, 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  CpuChipIcon,
  ServerIcon,
  SignalIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CalendarIcon,
  FlagIcon,
  StarIcon,
  ShieldCheckIcon,
  BeakerIcon,
  CircleStackIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { ShipsComputerControlPanel } from '@/components/lcars/ships-computer-controller';
import { YouTubeAnalysisWorkflow } from '@/components/lcars/youtube-analysis-workflow';
import { ProfitabilityResultsFlow } from '@/components/lcars/profitability-results-flow';
import { KnowledgeBaseExpander } from '@/components/lcars/knowledge-base-expander';
import { AutomatedBusinessExecutor } from '@/components/lcars/automated-business-executor';

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  team_size: number;
  created_at: string;
  deadline: string;
  priority: string;
}

interface DashboardStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  team_members: number;
  ai_consultations: number;
  total_crew: number;
  total_workflows: number;
}

// Server-side data fetching
async function getProjects(): Promise<Project[]> {
  try {
    // Use absolute URL to avoid parsing issues
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/projects`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    return data.projects || data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return fallback data if API fails
    return [
      {
        id: '1',
        name: 'LCARS Interface Development',
        status: 'active',
        progress: 75,
        team_size: 8,
        created_at: '2024-01-15',
        deadline: '2024-03-15',
        priority: 'high'
      },
      {
        id: '2',
        name: 'AI Agent Integration',
        status: 'active',
        progress: 45,
        team_size: 6,
        created_at: '2024-01-20',
        deadline: '2024-04-20',
        priority: 'medium'
      },
      {
        id: '3',
        name: 'Database Optimization',
        status: 'completed',
        progress: 100,
        team_size: 4,
        created_at: '2024-01-10',
        deadline: '2024-02-10',
        priority: 'low'
      },
      {
        id: '4',
        name: 'Security Protocol Implementation',
        status: 'pending',
        progress: 0,
        team_size: 5,
        created_at: '2024-01-25',
        deadline: '2024-05-25',
        priority: 'high'
      },
      {
        id: '5',
        name: 'Performance Monitoring System',
        status: 'active',
        progress: 30,
        team_size: 7,
        created_at: '2024-01-20',
        deadline: '2024-03-20',
        priority: 'medium'
      }
    ];
  }
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Use absolute URL to avoid parsing issues
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/dashboard/stats`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    const stats = data.stats || data;
    
    // Map the complex API response to the expected DashboardStats interface
    return {
      total_projects: stats.projects?.total || 0,
      active_projects: stats.projects?.active || 0,
      completed_projects: stats.projects?.completed || 0,
      total_tasks: stats.tasks?.total || 0,
      completed_tasks: stats.tasks?.completed || 0,
      pending_tasks: (stats.tasks?.pending || 0) + (stats.tasks?.inProgress || 0),
      team_members: stats.crew?.total || 0,
      ai_consultations: 127, // Default Star Trek value
      total_crew: stats.crew?.total || 0,
      total_workflows: 127 // Default Star Trek value
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return fallback data if API fails
    return {
      total_projects: 5,
      active_projects: 3,
      completed_projects: 1,
      total_tasks: 25,
      completed_tasks: 18,
      pending_tasks: 7,
      team_members: 12,
      ai_consultations: 127,
      total_crew: 12,
      total_workflows: 127
    };
  }
}

// Dashboard Content Component
async function DashboardContent() {
  const [projects, stats] = await Promise.all([
    getProjects(),
    getDashboardStats()
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'lcars-status-success';
      case 'completed': return 'lcars-status-success';
      case 'pending': return 'lcars-status-warning';
      default: return 'lcars-status-info';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'lcars-text-red';
      case 'medium': return 'lcars-text-yellow';
      case 'low': return 'lcars-text-green';
      default: return 'lcars-text-grey';
    }
  };

  const getProjectIcon = (name: string) => {
    if (name.includes('Database')) return ServerIcon;
    if (name.includes('LCARS')) return CpuChipIcon;
    if (name.includes('AI')) return BeakerIcon;
    if (name.includes('Security')) return ShieldCheckIcon;
    if (name.includes('Performance')) return ChartBarIcon;
    return FolderIcon;
  };

  const systemStatus = [
    { name: 'SUBSPACE LINK', status: 'ESTABLISHED', icon: SignalIcon },
    { name: 'STARFLEET DATABASE', status: 'CONNECTED', icon: ServerIcon },
    { name: 'QUANTUM MEMORY FIELD', status: 'STABLE', icon: CpuChipIcon },
    { name: 'OPTICAL DATA NETWORK', status: 'ONLINE', icon: ChartBarIcon }
  ];

  return (
    <>
      {/* Mission Status */}
      <div className="lcars-panel">
        <h2>MISSION STATUS</h2>
        <div className="lcars-metrics-grid">
          <div className="lcars-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <FolderIcon style={{ width: '40px', height: '40px', color: 'var(--lcars-orange)' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{stats.total_projects}</div>
                <div style={{ fontSize: '0.9rem', color: '#000' }}>TOTAL MISSIONS</div>
              </div>
            </div>
          </div>
          
          <div className="lcars-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <ClockIcon style={{ width: '40px', height: '40px', color: 'var(--lcars-yellow)' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{stats.active_projects}</div>
                <div style={{ fontSize: '0.9rem', color: '#000' }}>ACTIVE MISSIONS</div>
              </div>
            </div>
          </div>
          
          <div className="lcars-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <UserGroupIcon style={{ width: '40px', height: '40px', color: 'var(--lcars-green)' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{stats.total_crew}</div>
                <div style={{ fontSize: '0.9rem', color: '#000' }}>CREW MEMBERS</div>
              </div>
            </div>
          </div>
          
          <div className="lcars-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <CpuChipIcon style={{ width: '40px', height: '40px', color: 'var(--lcars-violet)' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>{stats.total_workflows}</div>
                <div style={{ fontSize: '0.9rem', color: '#000' }}>AI CONSULTATIONS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="lcars-panel">
        <h2>SYSTEM STATUS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--lcars-inner-radius)' }}>
            <SignalIcon style={{ width: '30px', height: '30px', color: 'var(--lcars-orange)' }} />
            <div>
              <div style={{ color: 'var(--lcars-orange)', fontWeight: 'bold' }}>SUBSPACE LINK</div>
              <div style={{ color: 'var(--lcars-green)', fontSize: '0.9rem' }}>ESTABLISHED</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--lcars-inner-radius)' }}>
            <CircleStackIcon style={{ width: '30px', height: '30px', color: 'var(--lcars-orange)' }} />
            <div>
              <div style={{ color: 'var(--lcars-orange)', fontWeight: 'bold' }}>STARFLEET DATABASE</div>
              <div style={{ color: 'var(--lcars-green)', fontSize: '0.9rem' }}>CONNECTED</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--lcars-inner-radius)' }}>
            <CpuChipIcon style={{ width: '30px', height: '30px', color: 'var(--lcars-orange)' }} />
            <div>
              <div style={{ color: 'var(--lcars-orange)', fontWeight: 'bold' }}>QUANTUM MEMORY FIELD</div>
              <div style={{ color: 'var(--lcars-green)', fontSize: '0.9rem' }}>STABLE</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--lcars-inner-radius)' }}>
            <ChartBarIcon style={{ width: '30px', height: '30px', color: 'var(--lcars-orange)' }} />
            <div>
              <div style={{ color: 'var(--lcars-orange)', fontWeight: 'bold' }}>OPTICAL DATA NETWORK</div>
              <div style={{ color: 'var(--lcars-green)', fontSize: '0.9rem' }}>OPERATIONAL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Missions */}
      <div className="lcars-panel">
        <h2>ACTIVE MISSIONS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="lcars-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>{project.name}</h3>
                <div className={`lcars-status ${project.status === 'active' ? 'active' : 'pending'}`}>
                  {project.status?.toUpperCase() || 'PENDING'}
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--lcars-text-purple)', fontSize: '0.9rem' }}>Progress</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{project.progress || 0}%</span>
                </div>
                <div className="lcars-progress">
                  <div 
                    className="lcars-progress-bar" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserGroupIcon style={{ width: '16px', height: '16px', color: 'var(--lcars-sky)' }} />
                  <span style={{ color: 'var(--lcars-text-purple)', fontSize: '0.8rem' }}>
                    {project.team_size || 1} Crew
                  </span>
                </div>
                
                <div className={`lcars-priority-${project.priority || 'medium'}`} style={{ 
                  fontSize: '0.8rem', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontWeight: 'bold' 
                }}>
                  {project.priority?.toUpperCase() || 'MEDIUM'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="lcars-panel">
        <h2>QUICK ACTIONS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <Link href="/projects/new" className="lcars-button primary">
            <RocketLaunchIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            NEW MISSION
          </Link>
          
          <Link href="/projects" className="lcars-button secondary">
            <FolderIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            VIEW MISSIONS
          </Link>
          
          <Link href="/observation-lounge" className="lcars-button success">
            <UserIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            AI CONSULTATION
          </Link>
          
          <Link href="/analytics" className="lcars-button">
            <ChartBarIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            ANALYTICS
          </Link>
        </div>
      </div>

      {/* YouTube Analysis Workflow */}
      <div className="lcars-panel">
        <h2>🎬 YOUTUBE CONTENT ANALYSIS & PROJECT GENERATION</h2>
        <p style={{ color: '#000', fontSize: '1rem', marginBottom: '20px' }}>
          Analyze YouTube content to generate profitable automation projects using our crew's expertise
        </p>
        <YouTubeAnalysisWorkflow videoUrl="https://www.youtube.com/watch?v=S8a7gkFhoBA&t=398s" />
      </div>

      {/* Profitability Results Flow */}
      <div className="lcars-panel">
        <h2>💰 IMMEDIATE PROFITABILITY ROADMAP</h2>
        <p style={{ color: '#000', fontSize: '1rem', marginBottom: '20px' }}>
          Results-based UX flow for immediate profitability with actionable next steps
        </p>
        <ProfitabilityResultsFlow />
      </div>

      {/* Knowledge Base Expansion System */}
      <div className="lcars-panel">
        <h2>🧠 KNOWLEDGE BASE EXPANSION & AGENT LEARNING</h2>
        <p style={{ color: '#000', fontSize: '1rem', marginBottom: '20px' }}>
          Expand knowledge base with additional YouTube content and create self-referential logic for all agents
        </p>
        <KnowledgeBaseExpander />
      </div>

      {/* Automated Business Executor */}
      <div className="lcars-panel">
        <h2>🚀 AUTOMATED BUSINESS EXECUTOR & PROFITABILITY LAUNCHER</h2>
        <p style={{ color: '#000', fontSize: '1rem', marginBottom: '20px' }}>
          Launch your first profitable AI consulting business with automated execution phases and crew coordination
        </p>
        <AutomatedBusinessExecutor />
      </div>

      {/* Ship's Computer Control Panel */}
      <div className="lcars-panel">
        <h2>SHIP'S COMPUTER AGENT CONTROL</h2>
        <p style={{ color: '#000', fontSize: '1rem', marginBottom: '20px' }}>
          Control the entire LCARS layout system through the ship's computer agent
        </p>
        <ShipsComputerControlPanel />
      </div>
    </>
  );
}

// Enhanced Loading component with better UX
function DashboardLoading() {
  return (
    <div className="lcars-main-content">
      <div className="lcars-panel lcars-p-30">
        <div className="lcars-loading-spinner">
          <CpuChipIcon className="lcars-spinner-icon" />
        </div>
        <div className="lcars-text-xxlarge lcars-text-gold">INITIALIZING LCARS SYSTEM...</div>
        <div className="lcars-text-large lcars-text-white">LOADING MISSION DATA</div>
        <div className="lcars-loading-progress">
          <div className="lcars-progress-bar">
            <div className="lcars-progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with error boundary and loading states
export default function DashboardPage() {
  return (
    <DashboardErrorBoundary>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </DashboardErrorBoundary>
  );
} 