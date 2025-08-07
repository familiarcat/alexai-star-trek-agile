'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LCARSLayout } from '@/components/lcars/lcars-layout';
import { 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  FlagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  project: string;
  due_date: string;
  created_at: string;
  estimated_hours: number;
  actual_hours: number;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real implementation, this would come from API
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Design LCARS Color Palette',
          description: 'Create authentic Star Trek LCARS color scheme with proper contrast ratios',
          status: 'completed',
          priority: 'high',
          assignee: 'Captain Picard',
          project: 'LCARS Interface Redesign',
          due_date: '2024-01-15',
          created_at: '2024-01-01',
          estimated_hours: 8,
          actual_hours: 6
        },
        {
          id: '2',
          title: 'Implement L-Shaped Elements',
          description: 'Build characteristic LCARS L-shaped interface components',
          status: 'in_progress',
          priority: 'high',
          assignee: 'Geordi La Forge',
          project: 'LCARS Interface Redesign',
          due_date: '2024-02-01',
          created_at: '2024-01-10',
          estimated_hours: 16,
          actual_hours: 12
        },
        {
          id: '3',
          title: 'Database Schema Optimization',
          description: 'Optimize database structure for Star Fleet operations',
          status: 'pending',
          priority: 'medium',
          assignee: 'Commander Data',
          project: 'Enterprise Database Migration',
          due_date: '2024-02-15',
          created_at: '2024-01-20',
          estimated_hours: 24,
          actual_hours: 0
        },
        {
          id: '4',
          title: 'AI Agent Coordination',
          description: 'Coordinate multiple AI agents for project management',
          status: 'pending',
          priority: 'critical',
          assignee: 'Counselor Troi',
          project: 'AI Consultation System',
          due_date: '2024-01-31',
          created_at: '2024-01-25',
          estimated_hours: 12,
          actual_hours: 0
        },
        {
          id: '5',
          title: 'Security Protocol Update',
          description: 'Update security protocols for new LCARS interface',
          status: 'overdue',
          priority: 'critical',
          assignee: 'Lieutenant Worf',
          project: 'Security Protocol Update',
          due_date: '2024-01-10',
          created_at: '2023-12-15',
          estimated_hours: 20,
          actual_hours: 15
        }
      ];
      
      setTasks(mockTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Tasks fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'lcars-status-success';
      case 'in_progress': return 'lcars-status-warning';
      case 'pending': return 'lcars-status-info';
      case 'overdue': return 'lcars-status-error';
      default: return 'lcars-status-info';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'lcars-text-red';
      case 'high': return 'lcars-text-orange';
      case 'medium': return 'lcars-text-yellow';
      case 'low': return 'lcars-text-green';
      default: return 'lcars-text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-5 h-5" />;
      case 'in_progress': return <ClockIcon className="w-5 h-5" />;
      case 'pending': return <ClockIcon className="w-5 h-5" />;
      case 'overdue': return <ExclamationTriangleIcon className="w-5 h-5" />;
      default: return <ClockIcon className="w-5 h-5" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30 lcars-text-center">
          <div className="lcars-text-xlarge lcars-text-gold">Loading Task Management...</div>
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
            <div className="lcars-text-xxlarge lcars-text-gold">TASK MANAGEMENT</div>
            <div className="lcars-text-large lcars-text-white">STARFLEET MISSION CONTROL</div>
          </div>
          <div className="lcars-header-actions">
            <button className="lcars-button lcars-button-primary">
              <PlusIcon className="w-5 h-5 lcars-mr-10" />
              NEW TASK
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="lcars-filters-section">
          <div className="lcars-search-box">
            <MagnifyingGlassIcon className="lcars-search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lcars-search-input"
            />
          </div>
          
          <div className="lcars-filter-controls">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="lcars-filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="lcars-filter-select"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="lcars-stats-grid">
          <div className="lcars-stat-item">
            <div className="lcars-stat-value lcars-text-gold">{tasks.length}</div>
            <div className="lcars-stat-label">TOTAL TASKS</div>
          </div>
          <div className="lcars-stat-item">
            <div className="lcars-stat-value lcars-text-blue">{tasks.filter(t => t.status === 'in_progress').length}</div>
            <div className="lcars-stat-label">IN PROGRESS</div>
          </div>
          <div className="lcars-stat-item">
            <div className="lcars-stat-value lcars-text-green">{tasks.filter(t => t.status === 'completed').length}</div>
            <div className="lcars-stat-label">COMPLETED</div>
          </div>
          <div className="lcars-stat-item">
            <div className="lcars-stat-value lcars-text-red">{tasks.filter(t => t.status === 'overdue').length}</div>
            <div className="lcars-stat-label">OVERDUE</div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="lcars-tasks-container">
          <div className="lcars-text-xlarge lcars-text-gold lcars-mb-20">MISSION TASKS</div>
          
          {filteredTasks.length === 0 ? (
            <div className="lcars-empty-state">
              <div className="lcars-text-large lcars-text-white">No tasks found</div>
              <div className="lcars-text-base lcars-text-grey">Try adjusting your search or filters</div>
            </div>
          ) : (
            <div className="lcars-tasks-grid">
              {filteredTasks.map((task) => (
                <div key={task.id} className="lcars-task-card">
                  <div className="lcars-task-header">
                    <div className="lcars-task-status">
                      <div className={`lcars-status-indicator ${getStatusColor(task.status)}`}></div>
                      <span className="lcars-task-status-text">{task.status.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div className={`lcars-task-priority ${getPriorityColor(task.priority)}`}>
                      <FlagIcon className="w-4 h-4" />
                      {task.priority.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="lcars-task-content">
                    <div className="lcars-task-title">{task.title}</div>
                    <div className="lcars-task-description">{task.description}</div>
                  </div>
                  
                  <div className="lcars-task-meta">
                    <div className="lcars-task-assignee">
                      <UserIcon className="w-4 h-4" />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="lcars-task-project">
                      <span>{task.project}</span>
                    </div>
                    <div className="lcars-task-due">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="lcars-task-progress">
                    <div className="lcars-progress-label">
                      Progress: {task.actual_hours}/{task.estimated_hours} hours
                    </div>
                    <div className="lcars-progress">
                      <div 
                        className="lcars-progress-bar" 
                        style={{ width: `${Math.min((task.actual_hours / task.estimated_hours) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LCARSLayout>
  );
} 