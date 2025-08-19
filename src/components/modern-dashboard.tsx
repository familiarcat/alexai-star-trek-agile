'use client';

import React, { useState, useEffect } from 'react';
import { ThemeSwitcher } from './theme-switcher';

interface DashboardCard {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  gradient: string;
}

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
}

export const ModernDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'lcars' | 'modern'>('modern');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const dashboardCards: DashboardCard[] = [
    {
      id: '1',
      title: 'Total Projects',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: '📊',
      gradient: 'gradient-primary'
    },
    {
      id: '2',
      title: 'Active Tasks',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: '✅',
      gradient: 'gradient-secondary'
    },
    {
      id: '3',
      title: 'Team Members',
      value: '8',
      change: '+1',
      changeType: 'positive',
      icon: '👥',
      gradient: 'gradient-accent'
    },
    {
      id: '4',
      title: 'Completion Rate',
      value: '94%',
      change: '+2%',
      changeType: 'positive',
      icon: '🎯',
      gradient: 'gradient-primary'
    }
  ];

  const recentTasks: Task[] = [
    {
      id: '1',
      title: 'Implement modern design system',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Design Team',
      dueDate: '2025-01-25'
    },
    {
      id: '2',
      title: 'Update user interface components',
      status: 'pending',
      priority: 'medium',
      assignee: 'Frontend Team',
      dueDate: '2025-01-28'
    },
    {
      id: '3',
      title: 'Optimize performance metrics',
      status: 'completed',
      priority: 'low',
      assignee: 'Backend Team',
      dueDate: '2025-01-20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'in-progress': return 'var(--warning)';
      case 'pending': return 'var(--info)';
      default: return 'var(--text-disabled)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--error)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-disabled)';
    }
  };

  if (isLoading) {
    return (
      <div className="modern-dashboard loading">
        <div className="loading-container">
          <div className="loading-shimmer loading-header"></div>
          <div className="loading-shimmer loading-cards">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="loading-shimmer loading-card"></div>
            ))}
          </div>
          <div className="loading-shimmer loading-content"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <span className="text-gradient">Modern</span> Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Welcome to the future of design - 2025 style
            </p>
          </div>
          <div className="header-right">
            <ThemeSwitcher onThemeChange={setCurrentTheme} />
          </div>
        </div>
      </header>

      {/* Dashboard Cards */}
      <section className="dashboard-cards">
        {dashboardCards.map((card) => (
          <div key={card.id} className={`dashboard-card ${card.gradient}`}>
            <div className="card-icon">{card.icon}</div>
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <div className="card-value">{card.value}</div>
              <div className={`card-change ${card.changeType}`}>
                {card.change}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <section className="dashboard-content">
        <div className="content-grid">
          {/* Recent Tasks */}
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-heading">Recent Tasks</h2>
              <button className="btn-modern btn-small">View All</button>
            </div>
            <div className="tasks-list">
              {recentTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h4 className="task-title">{task.title}</h4>
                    <div className="task-meta">
                      <span className="task-assignee">{task.assignee}</span>
                      <span className="task-date">{task.dueDate}</span>
                    </div>
                  </div>
                  <div className="task-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {task.status}
                    </span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-heading">Quick Actions</h2>
            </div>
            <div className="actions-grid">
              <button className="action-button glass-button">
                <span className="action-icon">➕</span>
                <span className="action-text">New Project</span>
              </button>
              <button className="action-button glass-button">
                <span className="action-icon">📝</span>
                <span className="action-text">Create Task</span>
              </button>
              <button className="action-button glass-button">
                <span className="action-icon">📊</span>
                <span className="action-text">View Reports</span>
              </button>
              <button className="action-button glass-button">
                <span className="action-icon">⚙️</span>
                <span className="action-text">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .modern-dashboard {
          min-height: 100vh;
          background: var(--bg-secondary);
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: var(--text-primary);
        }

        /* Loading States */
        .loading-container {
          padding: 2rem;
        }

        .loading-header {
          height: 120px;
          border-radius: 16px;
          margin-bottom: 2rem;
          background: var(--bg-tertiary);
        }

        .loading-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .loading-card {
          height: 150px;
          border-radius: 16px;
          background: var(--bg-tertiary);
        }

        .loading-content {
          height: 400px;
          border-radius: 16px;
          background: var(--bg-tertiary);
        }

        /* Header */
        .dashboard-header {
          background: var(--bg-primary);
          border-bottom: 3px solid var(--border-primary);
          padding: 2rem 0;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-md);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          margin: 0 0 0.5rem 0;
          color: var(--text-primary);
          line-height: var(--line-height-tight);
        }

        .dashboard-subtitle {
          font-size: var(--font-size-lg);
          color: var(--text-secondary);
          margin: 0;
          font-weight: var(--font-weight-medium);
        }

        /* Dashboard Cards */
        .dashboard-cards {
          max-width: 1200px;
          margin: 0 auto 2rem auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .dashboard-card {
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
          padding: 2rem;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-normal);
          border: 2px solid var(--border-primary);
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .dashboard-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-accent);
        }

        .dashboard-card.gradient-primary {
          background: linear-gradient(135deg, var(--modern-primary), var(--modern-accent-blue));
          color: white;
          border-color: var(--modern-primary);
        }

        .dashboard-card.gradient-secondary {
          background: linear-gradient(135deg, var(--modern-secondary), var(--modern-accent-green));
          color: white;
          border-color: var(--modern-secondary);
        }

        .dashboard-card.gradient-accent {
          background: linear-gradient(135deg, var(--modern-accent-orange), var(--modern-accent-pink));
          color: white;
          border-color: var(--modern-accent-orange);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .card-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 1rem 0;
          opacity: 0.9;
        }

        .card-value {
          font-size: var(--font-size-4xl);
          font-weight: var(--font-weight-bold);
          margin: 0 0 1rem 0;
          line-height: var(--line-height-tight);
        }

        .card-change {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-change.positive {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .card-change.negative {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .card-change.neutral {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        /* Content */
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 2rem 2rem;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .content-card {
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border: 2px solid var(--border-primary);
          transition: all var(--transition-normal);
        }

        .content-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-accent);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border-primary);
        }

        .card-heading {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          margin: 0;
          color: var(--text-primary);
          line-height: var(--line-height-tight);
        }

        .btn-small {
          padding: 0.75rem 1.5rem;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
        }

        /* Tasks */
        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          border: 2px solid var(--border-primary);
          transition: all var(--transition-normal);
        }

        .task-item:hover {
          background: var(--bg-tertiary);
          border-color: var(--border-accent);
          transform: translateX(8px);
        }

        .task-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin: 0 0 0.75rem 0;
          color: var(--text-primary);
          line-height: var(--line-height-tight);
        }

        .task-meta {
          display: flex;
          gap: 1.5rem;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          font-weight: var(--font-weight-medium);
        }

        .task-status {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .status-badge,
        .priority-badge {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          min-width: 80px;
          text-align: center;
        }

        /* Actions */
        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal);
          min-height: 120px;
          justify-content: center;
          background: var(--bg-secondary);
          border: 2px solid var(--border-primary);
          color: var(--text-primary);
          cursor: pointer;
        }

        .action-button:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          background: var(--bg-tertiary);
          border-color: var(--border-accent);
        }

        .action-icon {
          font-size: 2rem;
        }

        .action-text {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-cards {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .dashboard-title {
            font-size: var(--font-size-2xl);
          }

          .dashboard-cards {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-card {
            padding: 1.5rem;
            min-height: 180px;
          }
          
          .card-value {
            font-size: var(--font-size-3xl);
          }
        }

        @media (max-width: 640px) {
          .dashboard-header {
            padding: 1.5rem 0;
          }

          .dashboard-cards,
          .dashboard-content {
            padding: 0 1rem 1rem 1rem;
          }

          .dashboard-title {
            font-size: var(--font-size-xl);
          }
          
          .dashboard-card {
            padding: 1.25rem;
            border-radius: var(--radius-md);
          }
          
          .content-card {
            padding: 1.5rem;
            border-radius: var(--radius-md);
          }
          
          .task-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .task-status {
            align-items: flex-start;
            flex-direction: row;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernDashboard;
