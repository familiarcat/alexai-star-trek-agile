'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FolderIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  team_size: number;
  created_at: string;
  deadline: string;
  priority: string;
  category: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
      } else {
        setError('Failed to load projects');
      }
    } catch (err) {
      setError('Failed to load projects');
      console.error('Projects fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMockData = async () => {
    setLoading(true);
    try {
      // Create sample projects
      const sampleProjects = [
        {
          name: 'LCARS Interface Development',
          description: 'Develop and refine the LCARS interface for the AlexAI system, ensuring authentic Star Trek aesthetics and optimal user experience.',
          status: 'active',
          priority: 'high',
          category: 'Development',
          team_size: 8,
          progress: 75,
          deadline: '2024-12-31'
        },
        {
          name: 'AI Core Optimization',
          description: 'Optimize the core AI algorithms for enhanced performance and efficiency in data processing and decision-making.',
          status: 'pending',
          priority: 'high',
          category: 'AI/ML',
          team_size: 5,
          progress: 30,
          deadline: '2024-09-30'
        },
        {
          name: 'N8N Backend Integration',
          description: 'Integrate the n8n workflow automation backend for seamless data flow and task automation within the AlexAI system.',
          status: 'active',
          priority: 'medium',
          category: 'Integration',
          team_size: 3,
          progress: 90,
          deadline: '2024-08-15'
        }
      ];

      for (const project of sampleProjects) {
        await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(project),
        });
      }

      // Refresh projects
      await fetchProjects();
    } catch (error) {
      console.error('Failed to create sample data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (projectId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit project:', projectId);
    // Could navigate to edit page or open modal
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-600';
    if (progress >= 60) return 'bg-blue-600';
    if (progress >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority.toLowerCase() === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <button 
            onClick={fetchProjects}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="lcars-panel">
        <h2>MISSION LOGS</h2>
        <p style={{ color: '#000', fontSize: '1rem', marginBottom: '20px' }}>
          Manage your Star Trek projects and missions
        </p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link href="/projects/new" className="lcars-button primary">
            <PlusIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            NEW MISSION
          </Link>
          
          <button 
            onClick={createMockData} 
            className="lcars-button secondary"
            disabled={loading}
          >
            <BeakerIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            CREATE SAMPLE DATA
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="lcars-panel">
        <h3 style={{ color: '#000', marginBottom: '15px' }}>SEARCH & FILTERS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <input
            type="text"
            placeholder="Search missions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lcars-input"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="lcars-select"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="lcars-select"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="lcars-panel">
        <h3 style={{ color: '#000', marginBottom: '20px' }}>ACTIVE MISSIONS</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#000' }}>
            <div className="lcars-animate-pulse">Loading missions...</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#000' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No missions found</div>
            <div style={{ fontSize: '1rem', opacity: 0.8 }}>Create your first mission or adjust your filters</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {filteredProjects.map((project) => (
              <div key={project.id} className="lcars-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>{project.name}</h3>
                  <div className={`lcars-status ${project.status === 'active' ? 'active' : project.status === 'completed' ? 'completed' : 'pending'}`}>
                    {project.status?.toUpperCase() || 'PENDING'}
                  </div>
                </div>
                
                {project.description && (
                  <p style={{ color: 'var(--lcars-text-purple)', marginBottom: '15px', lineHeight: '1.4' }}>
                    {project.description}
                  </p>
                )}
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--lcars-text-purple)', fontSize: '0.9rem' }}>Mission Progress</span>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{project.progress || 0}%</span>
                  </div>
                  <div className="lcars-progress">
                    <div 
                      className="lcars-progress-bar" 
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ color: 'var(--lcars-text-purple)', fontSize: '0.8rem', marginBottom: '4px' }}>Priority</div>
                    <div className={`lcars-priority-${project.priority || 'medium'}`} style={{ 
                      fontSize: '0.8rem', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {project.priority?.toUpperCase() || 'MEDIUM'}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ color: 'var(--lcars-text-purple)', fontSize: '0.8rem', marginBottom: '4px' }}>Category</div>
                    <div className={`lcars-category-${project.category?.toLowerCase() || 'general'}`} style={{ 
                      fontSize: '0.8rem', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {project.category?.toUpperCase() || 'GENERAL'}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserGroupIcon style={{ width: '16px', height: '16px', color: 'var(--lcars-sky)' }} />
                    <span style={{ color: 'var(--lcars-text-purple)', fontSize: '0.8rem' }}>
                      {project.team_size || 1} Crew Members
                    </span>
                  </div>
                  
                  {project.deadline && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CalendarIcon style={{ width: '16px', height: '16px', color: 'var(--lcars-yellow)' }} />
                      <span style={{ color: 'var(--lcars-text-purple)', fontSize: '0.8rem' }}>
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link 
                    href={`/project-detail/${project.id}`} 
                    className="lcars-button"
                    style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
                  >
                    VIEW DETAILS
                  </Link>
                  
                  <button 
                    onClick={() => handleEditProject(project.id)}
                    className="lcars-button secondary"
                    style={{ flex: 1 }}
                  >
                    EDIT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 