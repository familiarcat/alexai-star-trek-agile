'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LCARSLayout } from '@/core/components/lcars/lcars-layout';
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
  ArrowPathIcon,
  PencilIcon,
  EyeIcon,
  SignalIcon
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
  editingBy?: string;
  lastModified?: string;
}

interface UserPresence {
  userId: string;
  userName: string;
  isOnline: boolean;
  lastSeen: string;
  currentTask?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [userPresence, setUserPresence] = useState<UserPresence[]>([]);
  const [conflictResolution, setConflictResolution] = useState<{
    taskId: string;
    localChanges: Partial<Task>;
    remoteChanges: Partial<Task>;
  } | null>(null);

  useEffect(() => {
    fetchTasks();
    initializeRealTimeCollaboration();
  }, []);

  const initializeRealTimeCollaboration = () => {
    // Simulate real-time user presence
    const mockUsers: UserPresence[] = [
      {
        userId: '1',
        userName: 'Captain Picard',
        isOnline: true,
        lastSeen: new Date().toISOString(),
        currentTask: '1'
      },
      {
        userId: '2',
        userName: 'Commander Data',
        isOnline: true,
        lastSeen: new Date().toISOString(),
        currentTask: '3'
      },
      {
        userId: '3',
        userName: 'Geordi La Forge',
        isOnline: false,
        lastSeen: new Date(Date.now() - 300000).toISOString()
      }
    ];
    setUserPresence(mockUsers);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => ({
          ...task,
          lastModified: new Date().toISOString()
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  };

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
          actual_hours: 6,
          lastModified: new Date().toISOString()
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
          actual_hours: 12,
          lastModified: new Date().toISOString()
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
          actual_hours: 0,
          lastModified: new Date().toISOString()
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
          actual_hours: 0,
          lastModified: new Date().toISOString()
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
          actual_hours: 15,
          lastModified: new Date().toISOString()
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

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditData(task);
    // Simulate user presence for editing
    setUserPresence(prev => 
      prev.map(user => 
        user.userName === 'Captain Picard' 
          ? { ...user, currentTask: task.id }
          : user
      )
    );
  };

  const saveTask = async (taskId: string) => {
    try {
      // Simulate conflict detection
      const hasConflict = Math.random() < 0.1; // 10% chance of conflict
      
      if (hasConflict) {
        setConflictResolution({
          taskId,
          localChanges: editData,
          remoteChanges: {
            title: 'Updated by another user',
            description: 'This task was modified by another crew member'
          }
        });
        return;
      }

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, ...editData, lastModified: new Date().toISOString() }
            : task
        )
      );
      
      setEditingTask(null);
      setEditData({});
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const resolveConflict = (resolution: 'local' | 'remote' | 'merge') => {
    if (!conflictResolution) return;

    if (resolution === 'local') {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === conflictResolution.taskId 
            ? { ...task, ...conflictResolution.localChanges, lastModified: new Date().toISOString() }
            : task
        )
      );
    } else if (resolution === 'remote') {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === conflictResolution.taskId 
            ? { ...task, ...conflictResolution.remoteChanges, lastModified: new Date().toISOString() }
            : task
        )
      );
    } else if (resolution === 'merge') {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === conflictResolution.taskId 
            ? { 
                ...task, 
                ...conflictResolution.localChanges,
                ...conflictResolution.remoteChanges,
                lastModified: new Date().toISOString() 
              }
            : task
        )
      );
    }

    setConflictResolution(null);
    setEditingTask(null);
    setEditData({});
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
        {/* Header with real-time indicators */}
        <div className="lcars-header lcars-mb-20">
          <div className="lcars-text-xlarge lcars-text-gold">MISSION TASKS</div>
          <div className="lcars-realtime-indicators lcars-mt-10">
            <div className="lcars-flex lcars-gap-20">
              <div className="lcars-online-users">
                <SignalIcon className="w-4 h-4 lcars-text-green" />
                <span className="lcars-text-white">
                  {userPresence.filter(u => u.isOnline).length} crew online
                </span>
              </div>
              <div className="lcars-last-update">
                <ClockIcon className="w-4 h-4 lcars-text-blue" />
                <span className="lcars-text-white">Last update: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Presence Panel */}
        <div className="lcars-user-presence lcars-mb-20">
          <div className="lcars-text-large lcars-text-gold lcars-mb-10">CREW STATUS</div>
          <div className="lcars-flex lcars-gap-10 lcars-flex-wrap">
            {userPresence.map((user) => (
              <div key={user.userId} className="lcars-user-indicator">
                <div className={`lcars-user-avatar ${user.isOnline ? 'lcars-online' : 'lcars-offline'}`}>
                  <UserIcon className="w-3 h-3" />
                </div>
                <span className="lcars-text-white lcars-text-sm">{user.userName}</span>
                {user.currentTask && (
                  <div className="lcars-current-task">
                    <EyeIcon className="w-3 h-3 lcars-text-blue" />
                    <span className="lcars-text-blue lcars-text-xs">Editing Task {user.currentTask}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="lcars-filters lcars-mb-20">
          <div className="lcars-flex lcars-gap-20 lcars-items-center">
            <div className="lcars-search">
              <MagnifyingGlassIcon className="w-5 h-5 lcars-text-grey" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="lcars-input lcars-ml-10"
              />
            </div>
            <div className="lcars-filter-group">
              <FunnelIcon className="w-5 h-5 lcars-text-grey" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="lcars-select lcars-ml-10"
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
                className="lcars-select lcars-ml-10"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <button
              onClick={fetchTasks}
              className="lcars-button lcars-button-secondary"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span className="lcars-ml-5">Refresh</span>
            </button>
          </div>
        </div>

        {/* Conflict Resolution Modal */}
        {conflictResolution && (
          <div className="lcars-modal-overlay">
            <div className="lcars-modal lcars-conflict-resolution">
              <div className="lcars-modal-header">
                <div className="lcars-text-large lcars-text-orange">⚠️ CONFLICT DETECTED</div>
                <div className="lcars-text-base lcars-text-white">
                  Task {conflictResolution.taskId} has been modified by another crew member
                </div>
              </div>
              <div className="lcars-modal-content">
                <div className="lcars-conflict-comparison">
                  <div className="lcars-local-changes">
                    <div className="lcars-text-medium lcars-text-gold">Your Changes</div>
                    <div className="lcars-text-sm lcars-text-white">
                      {conflictResolution.localChanges.title && (
                        <div><strong>Title:</strong> {conflictResolution.localChanges.title}</div>
                      )}
                      {conflictResolution.localChanges.description && (
                        <div><strong>Description:</strong> {conflictResolution.localChanges.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="lcars-remote-changes">
                    <div className="lcars-text-medium lcars-text-gold">Remote Changes</div>
                    <div className="lcars-text-sm lcars-text-white">
                      {conflictResolution.remoteChanges.title && (
                        <div><strong>Title:</strong> {conflictResolution.remoteChanges.title}</div>
                      )}
                      {conflictResolution.remoteChanges.description && (
                        <div><strong>Description:</strong> {conflictResolution.remoteChanges.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lcars-modal-actions">
                <button
                  onClick={() => resolveConflict('local')}
                  className="lcars-button lcars-button-primary"
                >
                  Keep My Changes
                </button>
                <button
                  onClick={() => resolveConflict('remote')}
                  className="lcars-button lcars-button-secondary"
                >
                  Use Remote Changes
                </button>
                <button
                  onClick={() => resolveConflict('merge')}
                  className="lcars-button lcars-button-warning"
                >
                  Merge Both
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Container */}
        <div className="lcars-tasks-container">
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
                    {editingTask === task.id ? (
                      <div className="lcars-task-editing">
                        <input
                          type="text"
                          value={editData.title || task.title}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="lcars-input lcars-mb-10"
                        />
                        <textarea
                          value={editData.description || task.description}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          className="lcars-textarea lcars-mb-10"
                          rows={3}
                        />
                        <div className="lcars-edit-actions">
                          <button
                            onClick={() => saveTask(task.id)}
                            className="lcars-button lcars-button-success lcars-mr-10"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingTask(null);
                              setEditData({});
                            }}
                            className="lcars-button lcars-button-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="lcars-task-title">{task.title}</div>
                        <div className="lcars-task-description">{task.description}</div>
                        <div className="lcars-task-actions">
                          <button
                            onClick={() => startEditing(task)}
                            className="lcars-button lcars-button-small lcars-button-primary"
                          >
                            <PencilIcon className="w-3 h-3" />
                            <span className="lcars-ml-2">Edit</span>
                          </button>
                        </div>
                      </>
                    )}
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
                    {task.lastModified && (
                      <div className="lcars-task-modified">
                        <ClockIcon className="w-3 h-3" />
                        <span className="lcars-text-xs">
                          Modified: {new Date(task.lastModified).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
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