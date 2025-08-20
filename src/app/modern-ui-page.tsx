'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RocketLaunchIcon, FolderIcon, ChartBarIcon, CogIcon, UserGroupIcon, BeakerIcon, ShieldCheckIcon, SignalIcon, ComputerDesktopIcon, HeartIcon, PlusIcon, EyeIcon, ClipboardDocumentListIcon, ChartPieIcon, WrenchScrewdriverIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DashboardStats {
  totalProjects: number;
  activeTasks: number;
  completedTasks: number;
  teamMembers: number;
  systemHealth: string;
  lastUpdate: string;
}

export default function ModernUIPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    systemHealth: 'Optimal',
    lastUpdate: new Date().toLocaleString()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
        setStats({
          totalProjects: 0,
          activeTasks: 0,
          completedTasks: 0,
          teamMembers: 0,
          systemHealth: 'Warning',
          lastUpdate: new Date().toLocaleString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    fetchData();
    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return (
      <div className="modern-ui-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>🚀 Initializing Modern UI System</h2>
          <p>Loading 2025 Design Trends & Crew Optimization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-ui-container">
      {/* Hero Section */}
      <header className="modern-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🚀</span>
            AlexAI Agile Management System
          </h1>
          <p className="hero-subtitle">
            AI-powered project management with cutting-edge 2025 design trends
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.totalProjects}</span>
              <span className="stat-label">Active Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.activeTasks}</span>
              <span className="stat-label">Pending Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.teamMembers}</span>
              <span className="stat-label">Team Members</span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions Grid */}
      <section className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <PlusIcon />
            </div>
            <h3>Create New Project</h3>
            <p>Start a new agile project with AI assistance</p>
          </button>
          
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <FolderIcon />
            </div>
            <h3>Browse Projects</h3>
            <p>View and manage existing projects</p>
          </button>
          
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <ClipboardDocumentListIcon />
            </div>
            <h3>Task Queue</h3>
            <p>Manage and prioritize tasks</p>
          </button>
          
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <ChartBarIcon />
            </div>
            <h3>Analytics</h3>
            <p>View performance metrics and insights</p>
          </button>
        </div>
      </section>

      {/* System Status */}
      <section className="system-status-section">
        <h2 className="section-title">System Status</h2>
        <div className="status-grid">
          <div className="glass-card glass-card-elevated glass-card-responsive">
            <div className="status-header">
              <h3>Operational Status</h3>
              <div className={`status-indicator status-${stats.systemHealth.toLowerCase()}`}>
                {stats.systemHealth}
              </div>
            </div>
            <p>All systems operating at optimal performance</p>
            <div className="status-details">
              <span>Last Update: {stats.lastUpdate}</span>
            </div>
          </div>
          
          <div className="glass-card glass-card-elevated glass-card-responsive">
            <div className="status-header">
              <h3>Performance Metrics</h3>
              <div className="performance-score">98%</div>
            </div>
            <p>System efficiency and response times</p>
            <div className="performance-bars">
              <div className="performance-bar">
                <span>CPU</span>
                <div className="bar-fill" style={{ width: '85%' }}></div>
              </div>
              <div className="performance-bar">
                <span>Memory</span>
                <div className="bar-fill" style={{ width: '72%' }}></div>
              </div>
              <div className="performance-bar">
                <span>Network</span>
                <div className="bar-fill" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern UI Design System Showcase */}
      <section className="design-system-section">
        <h2 className="section-title">🚀 Modern UI Design System</h2>
        <p className="section-subtitle">2025 Design Trends & Crew Optimization</p>
        
        <div className="demo-grid">
          <Link href="/phase-2-demo" className="glass-card glass-card-interactive demo-card glass-card-responsive">
            <div className="demo-icon">🚀</div>
            <h3>Phase 2 Demo</h3>
            <p>Enhanced Components & Performance Monitoring</p>
            <div className="demo-features">
              <span>Glassmorphism</span>
              <span>Advanced Animations</span>
              <span>Performance Tracking</span>
            </div>
          </Link>
          
          <Link href="/phase-3-llm-optimization-demo" className="glass-card glass-card-interactive demo-card glass-card-responsive">
            <div className="demo-icon">🧠</div>
            <h3>LLM Optimization</h3>
            <p>Intelligent Crew Agent Coordination</p>
            <div className="demo-features">
              <span>LLM Switching</span>
              <span>Task Optimization</span>
              <span>Cost Efficiency</span>
            </div>
          </Link>
          
          <Link href="/phase-4-final-integration-demo" className="glass-card glass-card-interactive demo-card glass-card-responsive">
            <div className="demo-icon">🎯</div>
            <h3>Phase 4 Final</h3>
            <p>Complete System Integration</p>
            <div className="demo-features">
              <span>Persistent Memory</span>
              <span>System Learning</span>
              <span>Full Automation</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Advanced Operations */}
      <section className="advanced-operations-section">
        <h2 className="section-title">Advanced Operations</h2>
        <div className="operations-grid">
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <WrenchScrewdriverIcon />
            </div>
            <h3>Configure Workflows</h3>
            <p>Set up automated workflow processes</p>
          </button>
          
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <UserGroupIcon />
            </div>
            <h3>Team Management</h3>
            <p>Manage team assignments and roles</p>
          </button>
          
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <ShieldCheckIcon />
            </div>
            <h3>Security Protocols</h3>
            <p>Configure system security settings</p>
          </button>
        </div>
      </section>

      {/* System Administration */}
      <section className="admin-section">
        <h2 className="section-title">System Administration</h2>
        <div className="admin-grid">
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <CogIcon />
            </div>
            <h3>System Configuration</h3>
            <p>Configure system settings and preferences</p>
          </button>
          
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <HeartIcon />
            </div>
            <h3>Support Center</h3>
            <p>Access user support and documentation</p>
          </button>
          
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <ComputerDesktopIcon />
            </div>
            <h3>System Information</h3>
            <p>View system details and status</p>
          </button>
          
          <button className="glass-card glass-card-interactive glass-card-responsive">
            <div className="card-icon">
              <BeakerIcon />
            </div>
            <h3>Observation Lounge</h3>
            <p>Access advanced AI analysis tools</p>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-content">
          <p>🚀 Modern UI Design System - 2025 Trends</p>
          <p>Powered by AlexAI Crew Optimization</p>
        </div>
      </footer>
    </div>
  );
}
