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
  const [isLoading, setIsLoading] = useState(true);
  const [activeNavigation, setActiveNavigation] = useState('dashboard');

  useEffect(() => {
    // Simulate data fetching with a more reliable approach
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
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
    console.log('Viewing team...');
    setActiveNavigation('crew');
    window.location.href = '/crew';
  };

  const handleViewSecurity = async () => {
    console.log('Viewing security...');
    setActiveNavigation('security');
    window.location.href = '/security';
  };

  const handleViewObservationLounge = async () => {
    console.log('Viewing observation lounge...');
    setActiveNavigation('observation');
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
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">SYSTEM INITIALIZATION</div>
        <div className="lcars-elbow-content">
          <p>Initializing project management systems...</p>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Quick Actions - LCARS Elbow Container */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">QUICK ACTIONS</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-secondary">Primary system operations</p>
          <div className="functional-grid functional-grid-4">
            <button onClick={handleCreateProject} className="functional-button functional-button-primary">
              <PlusIcon style={{ width: '20px', height: '20px' }} />
              <span>CREATE NEW PROJECT</span>
            </button>
            <button onClick={handleViewProjects} className="functional-button functional-button-secondary">
              <EyeIcon style={{ width: '20px', height: '20px' }} />
              <span>BROWSE ALL PROJECTS</span>
            </button>
            <button onClick={handleViewTasks} className="functional-button functional-button-success">
              <ClipboardDocumentListIcon style={{ width: '20px', height: '20px' }} />
              <span>MANAGE TASK QUEUE</span>
            </button>
            <button onClick={handleViewAnalytics} className="functional-button functional-button-info">
              <ChartPieIcon style={{ width: '20px', height: '20px' }} />
              <span>VIEW PERFORMANCE DATA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Project Status - LCARS Elbow Container */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">PROJECT STATUS</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-secondary">Current system metrics</p>
          <div className="functional-grid functional-grid-4">
            <div className="metric-item">
              <h3 className="metric-title">ACTIVE PROJECTS</h3>
              <p className="metric-value">{stats.totalProjects}</p>
              <p className="metric-description">Projects in Progress</p>
            </div>
            <div className="metric-item">
              <h3 className="metric-title">PENDING TASKS</h3>
              <p className="metric-value">{stats.activeTasks}</p>
              <p className="metric-description">Ready for Development</p>
            </div>
            <div className="metric-item">
              <h3 className="metric-title">COMPLETED OBJECTIVES</h3>
              <p className="metric-value">{stats.completedTasks}</p>
              <p className="metric-description">Successfully Achieved</p>
            </div>
            <div className="metric-item">
              <h3 className="metric-title">TEAM MEMBERS</h3>
              <p className="metric-value">{stats.teamMembers}</p>
              <p className="metric-description">Active Personnel</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status - LCARS Elbow Container */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">SYSTEM STATUS</div>
        <div className="lcars-elbow-content">
          <div className="status-indicator status-indicator-success">{stats.systemHealth}</div>
          <div className="functional-grid functional-grid-2">
            <div className="metric-item">
              <h3 className="metric-title">OPERATIONAL STATUS</h3>
              <p className="metric-value">{stats.systemHealth}</p>
              <p className="metric-description">All Systems Nominal</p>
            </div>
            <div className="metric-item">
              <h3 className="metric-title">LAST SYSTEM UPDATE</h3>
              <p className="metric-value">{stats.lastUpdate}</p>
              <p className="metric-description">Data Freshness Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Operations - LCARS Elbow Container */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">ADVANCED OPERATIONS</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-secondary">System configuration and management</p>
          <div className="functional-grid functional-grid-3">
            <button onClick={handleViewWorkflows} className="functional-button functional-button-secondary">
              <WrenchScrewdriverIcon style={{ width: '20px', height: '20px' }} />
              <span>CONFIGURE WORKFLOWS</span>
            </button>
            <button onClick={handleViewCrew} className="functional-button functional-button-success">
              <UserGroupIcon style={{ width: '20px', height: '20px' }} />
              <span>MANAGE TEAM ASSIGNMENTS</span>
            </button>
            <button onClick={handleViewSecurity} className="functional-button functional-button-danger">
              <ShieldCheckIcon style={{ width: '20px', height: '20px' }} />
              <span>SECURITY PROTOCOLS</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Administration - LCARS Elbow Container */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">SYSTEM ADMINISTRATION</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-secondary">Configuration and support</p>
          <div className="functional-grid functional-grid-4">
            <button onClick={handleViewSettings} className="functional-button functional-button-warning">
              <CogIcon style={{ width: '20px', height: '20px' }} />
              <span>SYSTEM CONFIGURATION</span>
            </button>
            <button onClick={handleViewHelp} className="functional-button functional-button-info">
              <HeartIcon style={{ width: '20px', height: '20px' }} />
              <span>USER SUPPORT CENTER</span>
            </button>
            <button onClick={handleViewAbout} className="functional-button functional-button-secondary">
              <ComputerDesktopIcon style={{ width: '20px', height: '20px' }} />
              <span>SYSTEM INFORMATION</span>
            </button>
            <button onClick={handleViewObservationLounge} className="functional-button functional-button-primary">
              <BeakerIcon style={{ width: '20px', height: '20px' }} />
              <span>OBSERVATION LOUNGE</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Collaboration Dashboard - LCARS Elbow Container */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">AI COLLABORATION DASHBOARD</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-secondary">Enhanced AI-powered insights</p>
          <AICollaborationDashboard />
        </div>
      </div>

      {/* Enhanced Ship Computer - LCARS Elbow Container */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">ENHANCED SHIP COMPUTER</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-secondary">Advanced system monitoring</p>
          <EnhancedShipComputer />
        </div>
      </div>

      {/* Scaling Indicator - LCARS Elbow Container */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">SYSTEM SCALING</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-secondary">Performance and capacity monitoring</p>
          <ScalingIndicator />
        </div>
      </div>
    </div>
  );
} 