'use client';

import React, { useState, useEffect } from 'react';

// 🚀 YouTube Project Review Component
// This component provides a UI for reviewing and managing YouTube-extracted projects

interface ProjectReview {
  id: string;
  name: string;
  description: string;
  revenuePotential: number;
  targetMarket: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  estimatedTime: string;
  category: string;
  features: string[];
  n8nWorkflowTemplate: string;
  nextJsComponent: string;
  apiRoute: string;
  sourceVideo: string;
  sourceChannel: string;
  status: 'pending' | 'approved' | 'archived' | 'deleted';
  reviewNotes?: string;
}

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  archived: number;
  deleted: number;
  totalRevenuePotential: number;
}

const YouTubeProjectReview: React.FC = () => {
  const [projects, setProjects] = useState<ProjectReview[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectReview[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    pending: 0,
    approved: 0,
    archived: 0,
    deleted: 0,
    totalRevenuePotential: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Update filtered projects when filters change
  useEffect(() => {
    filterProjects();
  }, [projects, selectedStatus, searchTerm]);

  // Update stats when projects change
  useEffect(() => {
    updateStats();
  }, [projects]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // Load from local storage or API
      const savedProjects = localStorage.getItem('youtube-projects-review');
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      } else {
        // Load mock data for demonstration
        const mockProjects: ProjectReview[] = [
          {
            id: 'saas-business-builder',
            name: 'SaaS Business Builder',
            description: 'SaaS platform based on the concept: How I Built a $10M SaaS Business in 6 Months',
            revenuePotential: 5000,
            targetMarket: 'Startups, Entrepreneurs',
            complexity: 'Complex',
            estimatedTime: '35 minutes',
            category: 'Software & SaaS',
            features: ['User Management', 'Analytics', 'Customization'],
            n8nWorkflowTemplate: 'saas-business-builder-webhook',
            nextJsComponent: 'SaaSBusinessBuilderComponent',
            apiRoute: '/api/n8n-saas-business-builder',
            sourceVideo: 'https://www.youtube.com/watch?v=example1',
            sourceChannel: 'Greg Isenberg',
            status: 'pending'
          },
          {
            id: 'ai-automation-platform',
            name: 'AI Automation Platform',
            description: 'AI-powered solution for: The Ultimate Guide to AI Automation for Startups',
            revenuePotential: 5000,
            targetMarket: 'Startups, Entrepreneurs',
            complexity: 'Complex',
            estimatedTime: '35 minutes',
            category: 'AI & Automation',
            features: ['AI Integration', 'Automation', 'Analytics'],
            n8nWorkflowTemplate: 'ai-automation-platform-webhook',
            nextJsComponent: 'AIAutomationPlatformComponent',
            apiRoute: '/api/n8n-ai-automation-platform',
            sourceVideo: 'https://www.youtube.com/watch?v=example2',
            sourceChannel: 'Greg Isenberg',
            status: 'pending'
          },
          {
            id: 'passive-income-generator',
            name: 'Passive Income Generator',
            description: 'Business solution for: 5 Passive Income Ideas That Actually Work in 2024',
            revenuePotential: 3000,
            targetMarket: 'General Business Audience',
            complexity: 'Medium',
            estimatedTime: '25 minutes',
            category: 'Business & Entrepreneurship',
            features: ['User Management', 'Analytics', 'Customization'],
            n8nWorkflowTemplate: 'passive-income-generator-webhook',
            nextJsComponent: 'PassiveIncomeGeneratorComponent',
            apiRoute: '/api/n8n-passive-income-generator',
            sourceVideo: 'https://www.youtube.com/watch?v=example3',
            sourceChannel: 'Greg Isenberg',
            status: 'pending'
          }
        ];
        setProjects(mockProjects);
        localStorage.setItem('youtube-projects-review', JSON.stringify(mockProjects));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const updateStats = () => {
    const stats: ReviewStats = {
      total: projects.length,
      pending: projects.filter(p => p.status === 'pending').length,
      approved: projects.filter(p => p.status === 'approved').length,
      archived: projects.filter(p => p.status === 'archived').length,
      deleted: projects.filter(p => p.status === 'deleted').length,
      totalRevenuePotential: projects
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + p.revenuePotential, 0)
    };
    setStats(stats);
  };

  const updateProjectStatus = (projectId: string, status: ProjectReview['status'], notes?: string) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId
        ? { ...project, status, reviewNotes: notes }
        : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('youtube-projects-review', JSON.stringify(updatedProjects));
    setSelectedProject(null);
    setReviewNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'approved': return '#00ff00';
      case 'archived': return '#808080';
      case 'deleted': return '#ff0000';
      default: return '#666666';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return '#00ff00';
      case 'Medium': return '#ffff00';
      case 'Complex': return '#ff0000';
      default: return '#666666';
    }
  };

  const handleExtractNewProjects = async () => {
    setIsLoading(true);
    try {
      // Simulate extraction process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new mock projects
      const newProjects: ProjectReview[] = [
        {
          id: 'social-media-agency-builder',
          name: 'Social Media Agency Builder',
          description: 'Marketing solution for: How to Build a Social Media Marketing Agency',
          revenuePotential: 3500,
          targetMarket: 'Marketers, Social Media Managers',
          complexity: 'Medium',
          estimatedTime: '25 minutes',
          category: 'Marketing & Social Media',
          features: ['Marketing Tools', 'Social Media Integration', 'Analytics'],
          n8nWorkflowTemplate: 'social-media-agency-builder-webhook',
          nextJsComponent: 'SocialMediaAgencyBuilderComponent',
          apiRoute: '/api/n8n-social-media-agency-builder',
          sourceVideo: 'https://www.youtube.com/watch?v=example4',
          sourceChannel: 'Greg Isenberg',
          status: 'pending'
        }
      ];
      
      setProjects(prev => [...prev, ...newProjects]);
      localStorage.setItem('youtube-projects-review', JSON.stringify([...projects, ...newProjects]));
    } catch (error) {
      console.error('Error extracting projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDailyEmail = async () => {
    const approvedProjects = projects.filter(p => p.status === 'approved');
    if (approvedProjects.length === 0) {
      alert('No approved projects to include in email');
      return;
    }
    
    // Generate email content
    const emailContent = {
      date: new Date().toISOString().split('T')[0],
      projects: approvedProjects,
      totalRevenue: approvedProjects.reduce((sum, p) => sum + p.revenuePotential, 0)
    };
    
    // Save email template
    localStorage.setItem('daily-email-template', JSON.stringify(emailContent));
    alert(`Daily email generated with ${approvedProjects.length} approved projects!`);
  };

  const handleIntegrateToAgile = async () => {
    const approvedProjects = projects.filter(p => p.status === 'approved');
    if (approvedProjects.length === 0) {
      alert('No approved projects to integrate');
      return;
    }
    
    // Simulate integration process
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mark projects as integrated
      const updatedProjects = projects.map(project =>
        project.status === 'approved'
          ? { ...project, status: 'integrated' as any }
          : project
      );
      setProjects(updatedProjects);
      localStorage.setItem('youtube-projects-review', JSON.stringify(updatedProjects));
      
      alert(`Successfully integrated ${approvedProjects.length} projects into agile workflow!`);
    } catch (error) {
      console.error('Error integrating projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lcars-container">
      {/* Header Panel */}
      <div className="lcars-panel lcars-primary-panel">
        <h2 className="lcars-title">🔍 YouTube Project Review & Management</h2>
        <p className="lcars-subtitle">
          Review, Approve, and Integrate YouTube-Extracted Projects into Agile Workflow
        </p>
        <div className="lcars-revenue-potential">
          <strong>Total Revenue Potential: ${stats.totalRevenuePotential.toLocaleString()}</strong>
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="lcars-panel lcars-info-panel">
        <h3 className="lcars-panel-title">📊 Review Statistics</h3>
        <div className="review-stats-grid">
          <div className="stat-item">
            <label>Total Projects</label>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-item">
            <label>Pending Review</label>
            <div className="stat-value pending">{stats.pending}</div>
          </div>
          <div className="stat-item">
            <label>Approved</label>
            <div className="stat-value approved">{stats.approved}</div>
          </div>
          <div className="stat-item">
            <label>Archived</label>
            <div className="stat-value archived">{stats.archived}</div>
          </div>
          <div className="stat-item">
            <label>Deleted</label>
            <div className="stat-value deleted">{stats.deleted}</div>
          </div>
          <div className="stat-item">
            <label>Revenue Potential</label>
            <div className="stat-value revenue">${stats.totalRevenuePotential.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="lcars-panel lcars-secondary-panel">
        <h3 className="lcars-panel-title">🚀 Actions</h3>
        <div className="action-buttons">
          <button
            className="lcars-button lcars-button-primary"
            onClick={handleExtractNewProjects}
            disabled={isLoading}
          >
            {isLoading ? '🔄 Extracting...' : '🎬 Extract New Projects'}
          </button>
          <button
            className="lcars-button lcars-button-secondary"
            onClick={handleGenerateDailyEmail}
            disabled={stats.approved === 0}
          >
            📧 Generate Daily Email
          </button>
          <button
            className="lcars-button lcars-button-secondary"
            onClick={handleIntegrateToAgile}
            disabled={stats.approved === 0}
          >
            🔗 Integrate to Agile
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="lcars-panel lcars-warning-panel">
        <h3 className="lcars-panel-title">🔍 Filters</h3>
        <div className="filter-controls">
          <div className="filter-group">
            <label>Status Filter:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="lcars-select"
            >
              <option value="all">All Projects</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="lcars-input"
            />
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="lcars-panel lcars-success-panel">
        <h3 className="lcars-panel-title">📋 Projects ({filteredProjects.length})</h3>
        
        {isLoading ? (
          <div className="loading-message">🔄 Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="no-projects">📭 No projects found matching your criteria</div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-review-card">
                <div className="project-header">
                  <h4>{project.name}</h4>
                  <div className="project-status" style={{ backgroundColor: getStatusColor(project.status) }}>
                    {project.status.toUpperCase()}
                  </div>
                </div>
                
                <p className="project-description">{project.description}</p>
                
                <div className="project-meta">
                  <span className="revenue-badge">${project.revenuePotential.toLocaleString()}</span>
                  <span 
                    className="complexity-badge"
                    style={{ backgroundColor: getComplexityColor(project.complexity) }}
                  >
                    {project.complexity}
                  </span>
                  <span className="time-estimate">{project.estimatedTime}</span>
                </div>
                
                <div className="project-category">{project.category}</div>
                
                <div className="project-features">
                  {project.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                  {project.features.length > 3 && (
                    <span className="feature-tag">+{project.features.length - 3} more</span>
                  )}
                </div>
                
                <div className="project-source">
                  <small>Source: {project.sourceChannel}</small>
                </div>
                
                {project.status === 'pending' && (
                  <div className="project-actions">
                    <button
                      className="lcars-button lcars-button-success"
                      onClick={() => updateProjectStatus(project.id, 'approved')}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="lcars-button lcars-button-warning"
                      onClick={() => updateProjectStatus(project.id, 'archived')}
                    >
                      📁 Archive
                    </button>
                    <button
                      className="lcars-button lcars-button-danger"
                      onClick={() => updateProjectStatus(project.id, 'deleted')}
                    >
                      🗑️ Delete
                    </button>
                    <button
                      className="lcars-button lcars-button-secondary"
                      onClick={() => setSelectedProject(project)}
                    >
                      📝 Review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Review Modal */}
      {selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Review Project: {selectedProject.name}</h3>
            <div className="review-form">
              <div className="form-group">
                <label>Review Notes:</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add your review notes..."
                  className="lcars-textarea"
                  rows={4}
                />
              </div>
              
              <div className="modal-actions">
                <button
                  className="lcars-button lcars-button-success"
                  onClick={() => updateProjectStatus(selectedProject.id, 'approved', reviewNotes)}
                >
                  ✅ Approve
                </button>
                <button
                  className="lcars-button lcars-button-warning"
                  onClick={() => updateProjectStatus(selectedProject.id, 'archived', reviewNotes)}
                >
                  📁 Archive
                </button>
                <button
                  className="lcars-button lcars-button-danger"
                  onClick={() => updateProjectStatus(selectedProject.id, 'deleted', reviewNotes)}
                >
                  🗑️ Delete
                </button>
                <button
                  className="lcars-button lcars-button-secondary"
                  onClick={() => {
                    setSelectedProject(null);
                    setReviewNotes('');
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeProjectReview;
