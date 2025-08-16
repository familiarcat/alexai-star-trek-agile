'use client';

import React, { useState, useEffect } from 'react';

// 🚀 YouTube Project Ideas Analyzer Component
// This component displays YouTube channel analysis results and generates project templates

interface YouTubeVideo {
  title: string;
  url: string;
  views: string;
  index: number;
}

interface ProjectIdea {
  title: string;
  url: string;
  views: string;
  category: string;
  revenuePotential: number;
  targetMarket: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  description: string;
  features: string[];
}

interface ProjectTemplate {
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
}

interface YouTubeAnalysisResults {
  channel: {
    name: string;
    subscribers: string;
    videoCount: string;
    description: string;
    url: string;
  };
  videos: YouTubeVideo[];
  projectIdeas: { [category: string]: ProjectIdea[] };
  projectTemplates: ProjectTemplate[];
}

const YouTubeProjectIdeasAnalyzer: React.FC = () => {
  const [channelUrl, setChannelUrl] = useState('https://www.youtube.com/@GregIsenberg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<YouTubeAnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!channelUrl.trim()) {
      setError('Please enter a valid YouTube channel URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/youtube-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelUrl }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const analysisResults = await response.json();
      setResults(analysisResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleGenerateProjects = async () => {
    if (selectedTemplates.length === 0) {
      setError('Please select at least one project template');
      return;
    }

    // Here you would integrate with the project generator
    console.log('Generating projects for templates:', selectedTemplates);
    
    // For now, just show a success message
    alert(`Selected ${selectedTemplates.length} templates for project generation!`);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return '#00ff00';
      case 'Medium': return '#ffff00';
      case 'Complex': return '#ff0000';
      default: return '#666666';
    }
  };

  return (
    <div className="lcars-container">
      {/* Header Panel */}
      <div className="lcars-panel lcars-primary-panel">
        <h2 className="lcars-title">🚀 YouTube Project Ideas Analyzer</h2>
        <p className="lcars-subtitle">
          Extract Revenue-Generating Project Ideas from YouTube Channels
        </p>
        <p className="lcars-description">
          Analyze successful entrepreneurs' YouTube channels to discover proven business ideas
          and convert them into revenue-generating project templates.
        </p>
        <div className="lcars-revenue-potential">
          <strong>Revenue Potential: $2,000 - $5,000 per Project</strong>
        </div>
      </div>

      {/* Channel Analysis Input */}
      <div className="lcars-panel lcars-secondary-panel">
        <h3 className="lcars-panel-title">📺 Channel Analysis</h3>
        <div className="channel-input-section">
          <div className="form-group">
            <label>YouTube Channel URL</label>
            <input
              type="url"
              className="lcars-input"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="https://www.youtube.com/@ChannelName"
            />
          </div>
          <button
            className={`lcars-button ${isAnalyzing ? 'lcars-button-disabled' : 'lcars-button-primary'}`}
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? '🔍 Analyzing Channel...' : '🚀 Analyze Channel'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="lcars-panel lcars-error-panel">
          <h3 className="lcars-panel-title">⚠️ Error</h3>
          <p className="lcars-error-text">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {results && (
        <>
          {/* Channel Information */}
          <div className="lcars-panel lcars-info-panel">
            <h3 className="lcars-panel-title">📊 Channel Analysis Results</h3>
            <div className="channel-info-grid">
              <div className="channel-info-item">
                <label>Channel Name</label>
                <div className="channel-value">{results.channel.name}</div>
              </div>
              <div className="channel-info-item">
                <label>Subscribers</label>
                <div className="channel-value">{results.channel.subscribers}</div>
              </div>
              <div className="channel-info-item">
                <label>Videos Analyzed</label>
                <div className="channel-value">{results.videos.length}</div>
              </div>
              <div className="channel-info-item">
                <label>Project Ideas Found</label>
                <div className="channel-value">
                  {Object.values(results.projectIdeas).flat().length}
                </div>
              </div>
              <div className="channel-info-item">
                <label>Project Templates Generated</label>
                <div className="channel-value">{results.projectTemplates.length}</div>
              </div>
              <div className="channel-info-item">
                <label>Total Revenue Potential</label>
                <div className="channel-value revenue-highlight">
                  ${results.projectTemplates.reduce((sum, template) => sum + template.revenuePotential, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Project Templates */}
          <div className="lcars-panel lcars-success-panel">
            <h3 className="lcars-panel-title">🔧 Generated Project Templates</h3>
            <p>Select templates to generate revenue-generating projects:</p>
            
            <div className="templates-selection">
              <div className="templates-grid">
                {results.projectTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`template-card ${selectedTemplates.includes(template.id) ? 'selected' : ''}`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="template-header">
                      <h4>{template.name}</h4>
                      <div className="revenue-badge">${template.revenuePotential.toLocaleString()}</div>
                    </div>
                    
                    <p className="template-description">{template.description}</p>
                    
                    <div className="template-meta">
                      <span 
                        className="complexity-badge"
                        style={{ backgroundColor: getComplexityColor(template.complexity) }}
                      >
                        {template.complexity}
                      </span>
                      <span className="time-estimate">{template.estimatedTime}</span>
                    </div>
                    
                    <div className="template-category">{template.category}</div>
                    
                    <div className="template-features">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                      {template.features.length > 3 && (
                        <span className="feature-tag">+{template.features.length - 3} more</span>
                      )}
                    </div>
                    
                    <div className="template-source">
                      <small>Source: {template.sourceChannel}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="templates-actions">
              <button
                className="lcars-button lcars-button-primary"
                onClick={handleGenerateProjects}
                disabled={selectedTemplates.length === 0}
              >
                🚀 Generate {selectedTemplates.length} Projects
              </button>
              <button
                className="lcars-button lcars-button-secondary"
                onClick={() => setSelectedTemplates(results.projectTemplates.map(t => t.id))}
              >
                📋 Select All Templates
              </button>
              <button
                className="lcars-button lcars-button-secondary"
                onClick={() => setSelectedTemplates([])}
              >
                🗑️ Clear Selection
              </button>
            </div>
          </div>

          {/* Video Analysis */}
          <div className="lcars-panel lcars-warning-panel">
            <h3 className="lcars-panel-title">📹 Video Analysis</h3>
            <div className="videos-grid">
              {results.videos.slice(0, 10).map((video) => (
                <div key={video.index} className="video-item">
                  <div className="video-title">{video.title}</div>
                  <div className="video-meta">
                    <span className="video-views">{video.views}</span>
                    <span className="video-index">#{video.index}</span>
                  </div>
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    🔗 Watch Video
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Project Ideas by Category */}
          <div className="lcars-panel lcars-info-panel">
            <h3 className="lcars-panel-title">💡 Project Ideas by Category</h3>
            <div className="categories-grid">
              {Object.entries(results.projectIdeas).map(([category, ideas]) => (
                <div key={category} className="category-section">
                  <h4 className="category-title">{category}</h4>
                  <div className="ideas-list">
                    {ideas.slice(0, 5).map((idea, index) => (
                      <div key={index} className="idea-item">
                        <div className="idea-title">{idea.title}</div>
                        <div className="idea-meta">
                          <span className="idea-revenue">${idea.revenuePotential.toLocaleString()}</span>
                          <span 
                            className="idea-complexity"
                            style={{ color: getComplexityColor(idea.complexity) }}
                          >
                            {idea.complexity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Integration Status */}
      <div className="lcars-panel lcars-info-panel">
        <h3 className="lcars-panel-title">🔗 Integration Status</h3>
        <div className="lcars-integration-status">
          <p><strong>YouTube Scraper:</strong> Active</p>
          <p><strong>Project Generator:</strong> Ready</p>
          <p><strong>n8n Integration:</strong> Available</p>
          <p><strong>Revenue Potential:</strong> $2,000 - $5,000 per project</p>
          <p><strong>Analysis Status:</strong> {results ? 'Complete' : 'Pending'}</p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeProjectIdeasAnalyzer;
