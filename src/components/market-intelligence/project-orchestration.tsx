'use client';

import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  status: string;
  marketTarget: string;
  innovationFocus: string;
  crewInvolvement: string[];
  progress: number;
}

export default function ProjectOrchestration() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/project-orchestration/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading project orchestration...</div>;

  return (
    <div className="project-orchestration">
      <h2>🚀 Project Orchestration</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Market Target:</strong> {project.marketTarget}</p>
            <p><strong>Innovation Focus:</strong> {project.innovationFocus}</p>
            <p><strong>Crew:</strong> {project.crewInvolvement.join(', ')}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <p><strong>Progress:</strong> {project.progress}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
