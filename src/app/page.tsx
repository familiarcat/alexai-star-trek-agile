'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RocketLaunchIcon, FolderIcon, ChartBarIcon, CogIcon, UserGroupIcon, BeakerIcon, ShieldCheckIcon, SignalIcon, ComputerDesktopIcon, HeartIcon, PlusIcon, EyeIcon, ClipboardDocumentListIcon, ChartPieIcon, WrenchScrewdriverIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ShipsComputerOrchestrator } from '@/components/lcars/ships-computer-orchestrator';
import { ScalingIndicator } from '@/components/lcars/scaling-indicator';
import { EnhancedShipComputer } from '@/components/lcars/enhanced-ship-computer';
import { AICollaborationDashboard } from '@/components/lcars/ai-collaboration-dashboard';

interface DashboardStats {
  totalProjects: number;
  activeTasks: number;
  completedTasks: number;
  teamMembers: number;
  systemHealth: string;
  lastUpdate: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    systemHealth: 'Optimal',
    lastUpdate: new Date().toLocaleString()
  });
  const [isLoading, setIsLoading] = useState(true); // Restored to normal loading state
  const [activeNavigation, setActiveNavigation] = useState('dashboard');

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalProjects: 12,
          activeTasks: 28,
          completedTasks: 156,
          teamMembers: 8,
          systemHealth: 'Optimal',
          lastUpdate: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Functional CTA handlers with proper navigation
  const handleCreateProject = async () => {
    console.log('Creating new project...');
    setActiveNavigation('projects');
    window.location.href = '/projects/new';
  };

  const handleViewProjects = async () => {
    console.log('Viewing projects...');
    setActiveNavigation('projects');
    window.location.href = '/projects';
  };

  const handleViewTasks = async () => {
    console.log('Viewing tasks...');
    setActiveNavigation('tasks');
    window.location.href = '/tasks';
  };

  const handleViewAnalytics = async () => {
    console.log('Viewing analytics...');
    setActiveNavigation('analytics');
    window.location.href = '/analytics';
  };

  const handleViewWorkflows = async () => {
    console.log('Viewing workflows...');
    setActiveNavigation('workflows');
    window.location.href = '/workflows';
  };

  const handleViewCrew = async () => {
    console.log('Viewing crew...');
    setActiveNavigation('crew');
    window.location.href = '/crew';
  };

  const handleViewSecurity = async () => {
    console.log('Viewing security...');
    setActiveNavigation('security');
    window.location.href = '/security';
  };

  const handleViewObservationLounge = async () => {
    console.log('Entering observation lounge...');
    setActiveNavigation('observation-lounge');
    window.location.href = '/observation-lounge';
  };

  const handleViewSettings = async () => {
    console.log('Viewing settings...');
    setActiveNavigation('settings');
    window.location.href = '/settings';
  };

  const handleViewHelp = async () => {
    console.log('Viewing help...');
    setActiveNavigation('help');
    window.location.href = '/help';
  };

  const handleViewAbout = async () => {
    console.log('Viewing about...');
    setActiveNavigation('about');
    window.location.href = '/about';
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="lcars-elbow-container">
          <div className="lcars-elbow-header">SYSTEM INITIALIZATION</div>
          <div className="lcars-elbow-content">
            <p className="lcars-text">Loading Dashboard...</p>
            <p className="lcars-text-small">Initializing LCARS systems...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Quick Actions - Enhanced with LCARS Elbow Design */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">QUICK ACTIONS</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-4">
            <button onClick={handleCreateProject} className="lcars-cta-button lcars-cta-primary">
              <PlusIcon style={{ width: '20px', height: '20px' }} />
              <span>CREATE NEW PROJECT</span>
            </button>
            <button onClick={handleViewProjects} className="lcars-cta-button lcars-cta-secondary">
              <EyeIcon style={{ width: '20px', height: '20px' }} />
              <span>BROWSE ALL PROJECTS</span>
            </button>
            <button onClick={handleViewTasks} className="lcars-cta-button lcars-cta-success">
              <ClipboardDocumentListIcon style={{ width: '20px', height: '20px' }} />
              <span>MANAGE TASK QUEUE</span>
            </button>
            <button onClick={handleViewAnalytics} className="lcars-cta-button lcars-cta-info">
              <ChartPieIcon style={{ width: '20px', height: '20px' }} />
              <span>VIEW PERFORMANCE DATA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mission Status - Enhanced with LCARS Elbow Design */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">MISSION STATUS</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-4">
            <div className="lcars-grid-item">
              <h3 className="lcars-text-orange lcars-text">ACTIVE PROJECTS</h3>
              <p className="lcars-text-large">{stats.totalProjects}</p>
              <p className="lcars-text-small">Missions in Progress</p>
            </div>
            <div className="lcars-grid-item">
              <h3 className="lcars-text-blue lcars-text">PENDING TASKS</h3>
              <p className="lcars-text-large">{stats.activeTasks}</p>
              <p className="lcars-text-small">Awaiting Execution</p>
            </div>
            <div className="lcars-grid-item">
              <h3 className="lcars-text-green lcars-text">COMPLETED OBJECTIVES</h3>
              <p className="lcars-text-large">{stats.completedTasks}</p>
              <p className="lcars-text-small">Successfully Achieved</p>
            </div>
            <div className="lcars-grid-item">
              <h3 className="lcars-text-yellow lcars-text">CREW COMPLEMENT</h3>
              <p className="lcars-text-large">{stats.teamMembers}</p>
              <p className="lcars-text-small">Active Personnel</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status - Enhanced with LCARS Elbow Design */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">SYSTEM STATUS</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-2">
            <div className="lcars-grid-item">
              <h3 className="lcars-text-green lcars-text">OPERATIONAL STATUS</h3>
              <p className="lcars-text-large">{stats.systemHealth}</p>
              <p className="lcars-text-small">All Systems Nominal</p>
            </div>
            <div className="lcars-grid-item">
              <h3 className="lcars-text-blue lcars-text">LAST SYSTEM UPDATE</h3>
              <p className="lcars-text-medium">{stats.lastUpdate}</p>
              <p className="lcars-text-small">Data Freshness Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Operations - Enhanced with LCARS Elbow Design */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">ADVANCED OPERATIONS</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-3">
            <button onClick={handleViewWorkflows} className="lcars-cta-button lcars-cta-secondary">
              <WrenchScrewdriverIcon style={{ width: '20px', height: '20px' }} />
              <span>CONFIGURE WORKFLOWS</span>
            </button>
            <button onClick={handleViewCrew} className="lcars-cta-button lcars-cta-success">
              <UserGroupIcon style={{ width: '20px', height: '20px' }} />
              <span>MANAGE CREW ASSIGNMENTS</span>
            </button>
            <button onClick={handleViewSecurity} className="lcars-cta-button lcars-cta-danger">
              <ShieldCheckIcon style={{ width: '20px', height: '20px' }} />
              <span>SECURITY PROTOCOLS</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Administration - Enhanced with LCARS Elbow Design */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">SYSTEM ADMINISTRATION</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-4">
            <button onClick={handleViewSettings} className="lcars-cta-button lcars-cta-warning">
              <CogIcon style={{ width: '20px', height: '20px' }} />
              <span>SYSTEM CONFIGURATION</span>
            </button>
            <button onClick={handleViewHelp} className="lcars-cta-button lcars-cta-info">
              <HeartIcon style={{ width: '20px', height: '20px' }} />
              <span>USER SUPPORT CENTER</span>
            </button>
            <button onClick={handleViewAbout} className="lcars-cta-button lcars-cta-secondary">
              <ComputerDesktopIcon style={{ width: '20px', height: '20px' }} />
              <span>SYSTEM INFORMATION</span>
            </button>
            <button onClick={handleViewObservationLounge} className="lcars-cta-button lcars-cta-primary">
              <SignalIcon style={{ width: '20px', height: '20px' }} />
              <span>AI ORCHESTRATION CENTER</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Orchestrator Panel - Always Visible */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">AI ORCHESTRATION STATUS</div>
        <div className="lcars-elbow-content">
          <ShipsComputerOrchestrator />
        </div>
      </div>

      {/* Enhanced Ship Computer - Collective Intelligence */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">🧠 COLLECTIVE INTELLIGENCE SYSTEM</div>
        <div className="lcars-elbow-content">
          <EnhancedShipComputer />
        </div>
      </div>

      
             {/* AI Collaboration Dashboard */}
             <div className="lcars-elbow-container">
               <div className="lcars-elbow-header">🤖 AI AGENT COLLABORATION DASHBOARD</div>
               <div className="lcars-elbow-content">
                 <AICollaborationDashboard />
               </div>
             </div>{/* Dynamic Scaling Indicator */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">SYSTEM SCALING METRICS</div>
        <div className="lcars-elbow-content">
          <ScalingIndicator />
        </div>
      </div>
    </div>
  );
} 