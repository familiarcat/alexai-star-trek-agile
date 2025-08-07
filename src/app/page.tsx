'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LCARSLayout } from '@/components/lcars/lcars-layout';
import { 
  ChartBarIcon, 
  FolderIcon, 
  EyeIcon, 
  CogIcon, 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

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

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Use Next.js API routes (same domain)
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch recent projects
      const projectsResponse = await fetch('/api/projects');
      const projectsData = await projectsResponse.json();
      
      if (projectsData.success) {
        setRecentProjects(projectsData.projects.slice(0, 5)); // Show only 5 recent projects
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-600 bg-gray-100';
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) return 'text-gray-600';
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30 lcars-text-center">
          <div className="lcars-text-xlarge lcars-text-gold">Loading Dashboard...</div>
          <div className="lcars-mt-10">
            <div className="lcars-progress">
              <div className="lcars-progress-bar" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </LCARSLayout>
    );
  }

  if (error) {
    return (
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30 lcars-text-center">
          <div className="lcars-text-xlarge lcars-text-orange">Error</div>
          <div className="lcars-text-large lcars-mt-10">{error}</div>
        </div>
      </LCARSLayout>
    );
  }

  return (
    <LCARSLayout>
      <div className="lcars-panel lcars-p-30">
        {/* Header */}
        <div className="lcars-nav">
          <div className="lcars-nav-brand">
            <div className="lcars-text-xxlarge lcars-text-gold">AlexAI Dashboard</div>
            <div className="lcars-text-large lcars-text-white">Star Trek Agile Management System</div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="lcars-data-grid lcars-mt-20">
            <div className="lcars-data-item">
              <div className="lcars-data-value lcars-text-gold">{stats.total_projects}</div>
              <div className="lcars-data-label">Total Projects</div>
            </div>
            <div className="lcars-data-item">
              <div className="lcars-data-value lcars-text-green">{stats.active_projects}</div>
              <div className="lcars-data-label">Active Projects</div>
            </div>
            <div className="lcars-data-item">
              <div className="lcars-data-value lcars-text-blue">{stats.completed_projects}</div>
              <div className="lcars-data-label">Completed</div>
            </div>
            <div className="lcars-data-item">
              <div className="lcars-data-value lcars-text-purple">{stats.total_tasks}</div>
              <div className="lcars-data-label">Total Tasks</div>
            </div>
            <div className="lcars-data-item">
              <div className="lcars-data-value lcars-text-green">{stats.completed_tasks}</div>
              <div className="lcars-data-label">Completed Tasks</div>
            </div>
            <div className="lcars-data-item">
              <div className="lcars-data-value lcars-text-orange">{stats.pending_tasks}</div>
              <div className="lcars-data-label">Pending Tasks</div>
            </div>
            <div className="lcars-data-item">
              <div className="lcars-data-value lcars-text-blue">{stats.team_members}</div>
              <div className="lcars-data-label">Team Members</div>
            </div>
            <div className="lcars-data-item">
              <div className="lcars-data-value lcars-text-purple">{stats.ai_consultations}</div>
              <div className="lcars-data-label">AI Consultations</div>
            </div>
          </div>
        )}

        {/* Recent Projects */}
        <div className="lcars-mt-30">
          <div className="lcars-text-xlarge lcars-text-gold lcars-mb-10">Recent Projects</div>
          <div className="lcars-data-grid">
            {recentProjects.map((project) => (
              <div key={project.id} className="lcars-data-item">
                <div className="lcars-text-large lcars-text-white">{project.name}</div>
                <div className="lcars-mt-10">
                  <div className="lcars-progress">
                    <div 
                      className="lcars-progress-bar" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="lcars-text-small lcars-mt-5">{project.progress}% Complete</div>
                </div>
                <div className="lcars-mt-10">
                  <span className={`lcars-status ${getStatusColor(project.status).includes('green') ? 'success' : getStatusColor(project.status).includes('red') ? 'error' : 'warning'}`}>
                    {project.status}
                  </span>
                  <span className={`lcars-text-small lcars-ml-10 ${getPriorityColor(project.priority)}`}>
                    {project.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lcars-mt-30">
          <div className="lcars-text-xlarge lcars-text-gold lcars-mb-10">Quick Actions</div>
          <div className="lcars-data-grid">
            <Link href="/projects" className="lcars-button">
              <FolderIcon className="h-6 w-6" />
              <span>View All Projects</span>
            </Link>
            <Link href="/observation-lounge" className="lcars-button secondary">
              <EyeIcon className="h-6 w-6" />
              <span>AI Consultation</span>
            </Link>
            <Link href="/alexai" className="lcars-button secondary">
              <CogIcon className="h-6 w-6" />
              <span>System Status</span>
            </Link>
          </div>
        </div>
      </div>
    </LCARSLayout>
  );
} 