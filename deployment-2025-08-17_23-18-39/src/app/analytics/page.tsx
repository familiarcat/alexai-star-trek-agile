'use client';

import { useEffect, useState } from 'react';
import { LCARSLayout } from '@/core/components/lcars/lcars-layout';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CpuChipIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  projectMetrics: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    overdue_projects: number;
  };
  taskMetrics: {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
  };
  teamMetrics: {
    total_members: number;
    active_members: number;
    productivity_score: number;
    velocity: number;
  };
  timeMetrics: {
    avg_completion_time: number;
    total_hours_logged: number;
    efficiency_rating: number;
    utilization_rate: number;
  };
  trends: {
    weekly_completions: number[];
    monthly_progress: number[];
    team_performance: number[];
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock analytics data based on authentic LCARS patterns
      const mockAnalytics: AnalyticsData = {
        projectMetrics: {
          total_projects: 12,
          active_projects: 8,
          completed_projects: 3,
          overdue_projects: 1
        },
        taskMetrics: {
          total_tasks: 67,
          completed_tasks: 34,
          pending_tasks: 28,
          overdue_tasks: 5
        },
        teamMetrics: {
          total_members: 15,
          active_members: 12,
          productivity_score: 87,
          velocity: 23.4
        },
        timeMetrics: {
          avg_completion_time: 4.2,
          total_hours_logged: 1247,
          efficiency_rating: 92,
          utilization_rate: 78
        },
        trends: {
          weekly_completions: [12, 15, 18, 14, 16, 19, 22],
          monthly_progress: [65, 72, 78, 85, 89, 92],
          team_performance: [82, 85, 87, 89, 91, 93]
        }
      };
      
      setAnalytics(mockAnalytics);
    } catch (err) {
      setError('Failed to load analytics');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowTrendingUpIcon className="w-5 h-5 lcars-text-green" />;
    } else if (current < previous) {
      return <ArrowTrendingDownIcon className="w-5 h-5 lcars-text-red" />;
    }
    return <ArrowTrendingUpIcon className="w-5 h-5 lcars-text-grey" />;
  };

  const getEfficiencyColor = (rating: number) => {
    if (rating >= 90) return 'lcars-text-green';
    if (rating >= 75) return 'lcars-text-yellow';
    return 'lcars-text-red';
  };

  if (loading) {
    return (
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30 lcars-text-center">
          <div className="lcars-text-xlarge lcars-text-gold">Loading Performance Metrics...</div>
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
        <div className="lcars-page-header">
          <div className="lcars-header-content">
            <div className="lcars-text-xxlarge lcars-text-gold">PERFORMANCE METRICS</div>
            <div className="lcars-text-large lcars-text-white">STARFLEET ANALYTICS DASHBOARD</div>
          </div>
          <div className="lcars-header-actions">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="lcars-time-select"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="lcars-kpi-section">
          <div className="lcars-text-xlarge lcars-text-gold lcars-mb-20">KEY PERFORMANCE INDICATORS</div>
          
          <div className="lcars-kpi-grid">
            {/* Project Metrics */}
            <div className="lcars-kpi-card">
              <div className="lcars-kpi-header">
                <ChartBarIcon className="lcars-kpi-icon" />
                <span>PROJECT METRICS</span>
              </div>
              <div className="lcars-kpi-content">
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Total Projects</div>
                  <div className="lcars-kpi-value lcars-text-gold">{analytics?.projectMetrics.total_projects}</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Active Projects</div>
                  <div className="lcars-kpi-value lcars-text-blue">{analytics?.projectMetrics.active_projects}</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Completed</div>
                  <div className="lcars-kpi-value lcars-text-green">{analytics?.projectMetrics.completed_projects}</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Overdue</div>
                  <div className="lcars-kpi-value lcars-text-red">{analytics?.projectMetrics.overdue_projects}</div>
                </div>
              </div>
            </div>

            {/* Task Metrics */}
            <div className="lcars-kpi-card">
              <div className="lcars-kpi-header">
                <CheckCircleIcon className="lcars-kpi-icon" />
                <span>TASK METRICS</span>
              </div>
              <div className="lcars-kpi-content">
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Total Tasks</div>
                  <div className="lcars-kpi-value lcars-text-gold">{analytics?.taskMetrics.total_tasks}</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Completed</div>
                  <div className="lcars-kpi-value lcars-text-green">{analytics?.taskMetrics.completed_tasks}</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Pending</div>
                  <div className="lcars-kpi-value lcars-text-yellow">{analytics?.taskMetrics.pending_tasks}</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Overdue</div>
                  <div className="lcars-kpi-value lcars-text-red">{analytics?.taskMetrics.overdue_tasks}</div>
                </div>
              </div>
            </div>

            {/* Team Metrics */}
            <div className="lcars-kpi-card">
              <div className="lcars-kpi-header">
                <UserGroupIcon className="lcars-kpi-icon" />
                <span>TEAM METRICS</span>
              </div>
              <div className="lcars-kpi-content">
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Total Members</div>
                  <div className="lcars-kpi-value lcars-text-gold">{analytics?.teamMetrics.total_members}</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Active Members</div>
                  <div className="lcars-kpi-value lcars-text-blue">{analytics?.teamMetrics.active_members}</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Productivity Score</div>
                  <div className={`lcars-kpi-value ${getEfficiencyColor(analytics?.teamMetrics.productivity_score || 0)}`}>
                    {analytics?.teamMetrics.productivity_score}%
                  </div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Velocity</div>
                  <div className="lcars-kpi-value lcars-text-purple">{analytics?.teamMetrics.velocity}</div>
                </div>
              </div>
            </div>

            {/* Time Metrics */}
            <div className="lcars-kpi-card">
              <div className="lcars-kpi-header">
                <ClockIcon className="lcars-kpi-icon" />
                <span>TIME METRICS</span>
              </div>
              <div className="lcars-kpi-content">
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Avg Completion</div>
                  <div className="lcars-kpi-value lcars-text-gold">{analytics?.timeMetrics.avg_completion_time} days</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Hours Logged</div>
                  <div className="lcars-kpi-value lcars-text-blue">{analytics?.timeMetrics.total_hours_logged}</div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Efficiency</div>
                  <div className={`lcars-kpi-value ${getEfficiencyColor(analytics?.timeMetrics.efficiency_rating || 0)}`}>
                    {analytics?.timeMetrics.efficiency_rating}%
                  </div>
                </div>
                <div className="lcars-kpi-item">
                  <div className="lcars-kpi-label">Utilization</div>
                  <div className="lcars-kpi-value lcars-text-purple">{analytics?.timeMetrics.utilization_rate}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="lcars-trends-section">
          <div className="lcars-text-xlarge lcars-text-gold lcars-mb-20">PERFORMANCE TRENDS</div>
          
          <div className="lcars-trends-grid">
            {/* Weekly Completions */}
            <div className="lcars-trend-card">
              <div className="lcars-trend-header">
                <ChartBarIcon className="lcars-trend-icon" />
                <span>WEEKLY COMPLETIONS</span>
              </div>
              <div className="lcars-trend-chart">
                <div className="lcars-chart-bars">
                  {analytics?.trends.weekly_completions.map((value, index) => (
                    <div key={index} className="lcars-chart-bar">
                      <div 
                        className="lcars-chart-bar-fill" 
                        style={{ height: `${(value / 25) * 100}%` }}
                      ></div>
                      <div className="lcars-chart-label">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Progress */}
            <div className="lcars-trend-card">
              <div className="lcars-trend-header">
                <ChartBarIcon className="lcars-trend-icon" />
                <span>MONTHLY PROGRESS</span>
              </div>
              <div className="lcars-trend-chart">
                <div className="lcars-progress-line">
                  {analytics?.trends.monthly_progress.map((value, index) => (
                    <div key={index} className="lcars-progress-point">
                      <div className="lcars-progress-dot"></div>
                      <div className="lcars-progress-label">{value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Performance */}
            <div className="lcars-trend-card">
              <div className="lcars-trend-header">
                <UserGroupIcon className="lcars-trend-icon" />
                <span>TEAM PERFORMANCE</span>
              </div>
              <div className="lcars-trend-chart">
                <div className="lcars-performance-line">
                  {analytics?.trends.team_performance.map((value, index) => (
                    <div key={index} className="lcars-performance-point">
                      <div className="lcars-performance-dot"></div>
                      <div className="lcars-performance-label">{value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="lcars-system-status-section">
          <div className="lcars-text-xlarge lcars-text-gold lcars-mb-20">SYSTEM STATUS</div>
          
          <div className="lcars-system-grid">
            <div className="lcars-system-item">
              <CpuChipIcon className="lcars-system-icon" />
              <div className="lcars-system-info">
                <div className="lcars-system-name">CPU UTILIZATION</div>
                <div className="lcars-system-value">24%</div>
              </div>
            </div>
            <div className="lcars-system-item">
              <ServerIcon className="lcars-system-icon" />
              <div className="lcars-system-info">
                <div className="lcars-system-name">MEMORY USAGE</div>
                <div className="lcars-system-value">38%</div>
              </div>
            </div>
            <div className="lcars-system-item">
              <ServerIcon className="lcars-system-icon" />
              <div className="lcars-system-info">
                <div className="lcars-system-name">DATABASE STATUS</div>
                <div className="lcars-system-value lcars-text-green">ONLINE</div>
              </div>
            </div>
            <div className="lcars-system-item">
              <ClockIcon className="lcars-system-icon" />
              <div className="lcars-system-info">
                <div className="lcars-system-name">RESPONSE TIME</div>
                <div className="lcars-system-value">20ms</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LCARSLayout>
  );
} 