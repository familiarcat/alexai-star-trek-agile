'use client';

import React from 'react';

// 🚀 Agile Project Management Component - LCARS Elbow Design
// This component represents the Technical Lead managing multiple n8n workflow "project functions"

export default function AgileProjectManagement() {
  const projects = [
    {
      id: 'project1',
      name: 'AI-Powered Content Creation Platform',
      description: 'Automated content generation using AI for social media and marketing',
      revenuePotential: 8500,
      priority: 'high',
      progress: 25
    },
    {
      id: 'project2',
      name: 'SaaS Analytics Dashboard',
      description: 'Comprehensive analytics platform for business intelligence',
      revenuePotential: 7200,
      priority: 'medium',
      progress: 15
    },
    {
      id: 'project3',
      name: 'E-commerce Automation Suite',
      description: 'Automated inventory management and order processing system',
      revenuePotential: 6800,
      priority: 'medium',
      progress: 0
    }
  ];

  return (
    <div className="agile-project-management">
      {/* Navigation Tabs with LCARS Elbow Design */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">PROJECT VIEWS</div>
        <div className="lcars-elbow-content">
          <div className="view-navigation">
            <button className="nav-tab active">🎯 Kanban Board</button>
            <button className="nav-tab">📅 Timeline View</button>
            <button className="nav-tab">🚀 Sprint Management</button>
            <button className="nav-tab">🛰️ Project Functions</button>
            <button className="nav-tab">👥 Team Management</button>
          </div>
        </div>
      </div>

      {/* Project Display with LCARS Elbow Design */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">ACTIVE PROJECTS</div>
        <div className="lcars-elbow-content">
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className={`priority-badge ${project.priority}`}>
                    {project.priority}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-metrics">
                  <div className="metric">
                    <span className="label">Revenue Potential:</span>
                    <span className="value">${project.revenuePotential.toLocaleString()}</span>
                  </div>
                  <div className="metric">
                    <span className="label">Progress:</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{project.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Systems Status with LCARS Elbow Design */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">🛰️ PROJECT SYSTEMS STATUS</div>
        <div className="lcars-elbow-content">
          <div className="systems-grid">
            <div className="system-card operational">
              <h4>YouTube Extraction System</h4>
              <p>Status: Operational</p>
              <p>Efficiency: 98.7%</p>
            </div>
            <div className="system-card operational">
              <h4>AI Automation Core</h4>
              <p>Status: Operational</p>
              <p>Efficiency: 97.3%</p>
            </div>
            <div className="system-card operational">
              <h4>Project Generation Engine</h4>
              <p>Status: Operational</p>
              <p>Efficiency: 95.9%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
