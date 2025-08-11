import { Suspense } from 'react';
import Link from 'next/link';
import { RealtimeStatus } from '@/components/lcars/realtime-collaboration';
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
  BeakerIcon
} from '@heroicons/react/24/outline';

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
}

// Server-side data fetching
async function getProjects(): Promise<Project[]> {
  try {
    // Use absolute URL to avoid parsing issues
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
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
      ai_consultations: 127 // Default Star Trek value
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
      ai_consultations: 8
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
    <div className="lcars-main-content">
      {/* Mission Status */}
      <div className="lcars-mission-status-section">
        <div className="lcars-section-header">
          <RocketLaunchIcon className="lcars-icon" />
          <span>MISSION STATUS</span>
        </div>
        <div className="lcars-metrics-grid">
          <div className="lcars-metric-card">
            <div className="lcars-metric-icon">
              <FolderIcon className="lcars-icon" />
            </div>
            <div className="lcars-metric-content">
              <div className="lcars-metric-value">{stats.total_projects}</div>
              <div className="lcars-metric-label">TOTAL MISSIONS</div>
            </div>
          </div>
          
          <div className="lcars-metric-card">
            <div className="lcars-metric-icon">
              <CheckCircleIcon className="lcars-icon" />
            </div>
            <div className="lcars-metric-content">
              <div className="lcars-metric-value">{stats.active_projects}</div>
              <div className="lcars-metric-label">ACTIVE MISSIONS</div>
            </div>
          </div>
          
          <div className="lcars-metric-card">
            <div className="lcars-metric-icon">
              <UserGroupIcon className="lcars-icon" />
            </div>
            <div className="lcars-metric-content">
              <div className="lcars-metric-value">{stats.team_members}</div>
              <div className="lcars-metric-label">CREW MEMBERS</div>
            </div>
          </div>
          
          <div className="lcars-metric-card">
            <div className="lcars-metric-icon">
              <BeakerIcon className="lcars-icon" />
            </div>
            <div className="lcars-metric-content">
              <div className="lcars-metric-value">{stats.ai_consultations}</div>
              <div className="lcars-metric-label">AI CONSULTATIONS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Missions Grid */}
      <div className="lcars-missions-section">
        <div className="lcars-section-header">
          <RocketLaunchIcon className="lcars-icon" />
          <span>ACTIVE MISSIONS</span>
        </div>
        <div className="lcars-missions-grid">
          {projects.filter(p => p.status === 'active').map((project) => {
            const ProjectIcon = getProjectIcon(project.name);
            return (
              <Link key={project.id} href={`/project-detail/${project.id}`} className="lcars-mission-card">
                <div className="lcars-mission-header">
                  <ProjectIcon className="lcars-mission-icon" />
                  <div className="lcars-mission-status">
                    <div className={`lcars-status-indicator ${getStatusColor(project.status)}`}></div>
                    <span className="lcars-status-text">{project.status.toUpperCase()}</span>
                  </div>
                </div>
                <div className="lcars-mission-content">
                  <div className="lcars-mission-title">{project.name}</div>
                  <div className="lcars-mission-progress">
                    <div className="lcars-progress-bar">
                      <div 
                        className="lcars-progress-fill" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="lcars-progress-text">{project.progress}% COMPLETE</span>
                  </div>
                  <div className="lcars-mission-meta">
                    <div className="lcars-mission-team">
                      <UserGroupIcon className="lcars-meta-icon" />
                      <span>{project.team_size} CREW MEMBERS</span>
                    </div>
                    <div className={`lcars-mission-priority ${getPriorityColor(project.priority || 'medium')}`}>
                      <FlagIcon className="lcars-meta-icon" />
                      <span>{(project.priority || 'medium').toUpperCase()} PRIORITY</span>
                    </div>
                  </div>
                </div>
                <div className="lcars-mission-actions">
                  <div className="lcars-action-button">
                    <EyeIcon className="lcars-action-icon" />
                    <span>VIEW MISSION</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="lcars-system-status-section">
        <div className="lcars-section-header">
          <CogIcon className="lcars-icon" />
          <span>SYSTEM STATUS</span>
        </div>
        <div className="lcars-system-grid">
          {systemStatus.map((system, index) => (
            <div key={index} className="lcars-system-item">
              <system.icon className="lcars-system-icon" />
              <div className="lcars-system-info">
                <div className="lcars-system-name">{system.name}</div>
                <div className="lcars-system-value">{system.status}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Real-time Status */}
        <div className="mt-4">
          <RealtimeStatus />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="lcars-quick-actions">
        <div className="lcars-section-header">
          <RocketLaunchIcon className="lcars-icon" />
          <span>QUICK ACTIONS</span>
        </div>
        <div className="lcars-actions-grid">
          <Link href="/projects" className="lcars-action-button">
            <FolderIcon className="lcars-action-icon" />
            <span>ALL MISSIONS</span>
          </Link>
          <Link href="/tasks" className="lcars-action-button">
            <FlagIcon className="lcars-action-icon" />
            <span>MISSION TASKS</span>
          </Link>
          <Link href="/analytics" className="lcars-action-button">
            <ChartBarIcon className="lcars-action-icon" />
            <span>MISSION ANALYTICS</span>
          </Link>
          <Link href="/observation-lounge" className="lcars-action-button">
            <BeakerIcon className="lcars-action-icon" />
            <span>AI CONSULTATION</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Loading component
function DashboardLoading() {
  return (
    <div className="lcars-main-content">
      <div className="lcars-panel lcars-p-30">
        <div className="lcars-text-xxlarge lcars-text-gold">INITIALIZING LCARS SYSTEM...</div>
        <div className="lcars-text-large lcars-text-white">LOADING MISSION DATA</div>
      </div>
    </div>
  );
}

// Main page component
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
} 