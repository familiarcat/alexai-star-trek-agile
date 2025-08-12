'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, EyeIcon, PencilIcon, TrashIcon, CalendarIcon, UserIcon, FlagIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'overdue' | 'planning';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  teamSize: number;
  progress: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchProjects = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProjects([
          {
            id: '1',
            name: 'LCARS Interface Development',
            description: 'Modern LCARS interface development for Star Trek applications with responsive design',
            status: 'active',
            priority: 'high',
            startDate: '2025-01-15',
            endDate: '2025-06-30',
            teamSize: 5,
            progress: 75
          },
          {
            id: '2',
            name: 'AI Agent Integration',
            description: 'Integration of AI agents for crew coordination and decision making',
            status: 'active',
            priority: 'high',
            startDate: '2025-02-01',
            endDate: '2025-08-15',
            teamSize: 3,
            progress: 45
          },
          {
            id: '3',
            name: 'Quantum Database Optimization',
            description: 'Optimization of quantum database systems for faster data retrieval',
            status: 'planning',
            priority: 'medium',
            startDate: '2025-03-01',
            endDate: '2025-09-30',
            teamSize: 4,
            progress: 0
          },
          {
            id: '4',
            name: 'Security Protocol Enhancement',
            description: 'Enhanced security protocols for Starfleet communications',
            status: 'completed',
            priority: 'high',
            startDate: '2024-10-01',
            endDate: '2025-01-31',
            teamSize: 2,
            progress: 100
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    console.log('Creating new project...');
    // Navigate to project creation form
  };

  const handleViewProject = (projectId: string) => {
    console.log('Viewing project:', projectId);
    // Navigate to project detail
  };

  const handleEditProject = (projectId: string) => {
    console.log('Editing project:', projectId);
    // Navigate to project edit form
  };

  const handleDeleteProject = (projectId: string) => {
    console.log('Deleting project:', projectId);
    // Show confirmation dialog and delete
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--lcars-green)';
      case 'completed': return 'var(--lcars-blue)';
      case 'overdue': return 'var(--lcars-red)';
      case 'planning': return 'var(--lcars-yellow)';
      default: return 'var(--lcars-gray)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--lcars-red)';
      case 'medium': return 'var(--lcars-yellow)';
      case 'low': return 'var(--lcars-green)';
      default: return 'var(--lcars-gray)';
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="lcars-elbow-container">
          <div className="lcars-elbow-header">PROJECTS SYSTEM</div>
          <div className="lcars-elbow-content">
            <p className="lcars-text">Loading Projects...</p>
            <p className="lcars-text-small">Initializing mission database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Mission Logs Section */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">MISSION LOGS</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-medium">Manage your Star Trek projects and missions</p>
          <div className="lcars-responsive-grid lcars-grid-2">
            <button onClick={handleCreateProject} className="lcars-cta-button lcars-cta-primary">
              <PlusIcon className="lcars-icon" />
              <span>CREATE NEW MISSION</span>
            </button>
            <button className="lcars-cta-button lcars-cta-secondary">
              <EyeIcon className="lcars-icon" />
              <span>GENERATE SAMPLE DATA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">SEARCH & FILTERS</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-3">
            <div className="lcars-grid-item">
              <label className="lcars-text-small">Search Missions</label>
              <div className="lcars-input-container">
                <MagnifyingGlassIcon className="lcars-icon" />
                <input
                  type="text"
                  placeholder="Search missions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="lcars-input"
                />
              </div>
            </div>
            <div className="lcars-grid-item">
              <label className="lcars-text-small">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="lcars-select"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="planning">Planning</option>
              </select>
            </div>
            <div className="lcars-grid-item">
              <label className="lcars-text-small">Priority Filter</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="lcars-select"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Missions Section */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">ACTIVE MISSIONS</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-2">
            {filteredProjects.map(project => (
              <div key={project.id} className="lcars-grid-item lcars-mission-card">
                <div className="lcars-mission-header">
                  <h3 className="lcars-text-medium lcars-text-orange">{project.name}</h3>
                  <div className="lcars-mission-status">
                    <span 
                      className="lcars-status-badge"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    >
                      {project.status.toUpperCase()}
                    </span>
                    <span 
                      className="lcars-priority-badge"
                      style={{ backgroundColor: getPriorityColor(project.priority) }}
                    >
                      {project.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="lcars-text-small lcars-mission-description">
                  {project.description}
                </p>
                
                <div className="lcars-mission-details">
                  <div className="lcars-mission-info">
                    <CalendarIcon className="lcars-icon-small" />
                    <span className="lcars-text-small">
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  <div className="lcars-mission-info">
                    <UserIcon className="lcars-icon-small" />
                    <span className="lcars-text-small">
                      Team: {project.teamSize} members
                    </span>
                  </div>
                  <div className="lcars-mission-info">
                    <FlagIcon className="lcars-icon-small" />
                    <span className="lcars-text-small">
                      Progress: {project.progress}%
                    </span>
                  </div>
                </div>
                
                <div className="lcars-progress-bar">
                  <div 
                    className="lcars-progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                
                <div className="lcars-mission-actions">
                  <button 
                    onClick={() => handleViewProject(project.id)}
                    className="lcars-cta-button lcars-cta-info"
                  >
                    <EyeIcon className="lcars-icon-small" />
                    <span>VIEW</span>
                  </button>
                  <button 
                    onClick={() => handleEditProject(project.id)}
                    className="lcars-cta-button lcars-cta-warning"
                  >
                    <PencilIcon className="lcars-icon-small" />
                    <span>EDIT</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="lcars-cta-button lcars-cta-danger"
                  >
                    <TrashIcon className="lcars-icon-small" />
                    <span>DELETE</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 