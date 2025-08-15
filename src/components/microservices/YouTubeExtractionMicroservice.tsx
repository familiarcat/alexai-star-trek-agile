'use client';

import React, { useState, useEffect } from 'react';

// 🚀 YouTube Project Extraction Microservice Component
// This component provides a UI for the reusable n8n microservice

interface MicroserviceConfig {
  channelUrl: string;
  extractionType: 'full' | 'quick' | 'targeted';
  options: {
    maxVideos: number;
    includeArchived: boolean;
    revenueEstimation: boolean;
    complexityAssessment: boolean;
    autoApproval: boolean;
    emailNotification: boolean;
    agileIntegration: boolean;
    recipients: string[];
  };
}

interface ExtractionResult {
  success: boolean;
  requestId: string;
  timestamp: string;
  extractionStatus: string;
  channel: any;
  projects: any[];
  revenue: any;
  email?: any;
  agile?: any[];
  metadata: any;
}

interface ServiceStatus {
  service: string;
  version: string;
  status: string;
  microservice: {
    url: string;
    status: string;
    lastChecked: string;
  };
  capabilities: {
    extractionTypes: string[];
    supportedOptions: string[];
    features: string[];
  };
}

const YouTubeExtractionMicroservice: React.FC = () => {
  const [config, setConfig] = useState<MicroserviceConfig>({
    channelUrl: 'https://www.youtube.com/@GregIsenberg/videos',
    extractionType: 'full',
    options: {
      maxVideos: 50,
      includeArchived: false,
      revenueEstimation: true,
      complexityAssessment: true,
      autoApproval: false,
      emailNotification: true,
      agileIntegration: false,
      recipients: ['team@company.com'],
    },
  });

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractionHistory, setExtractionHistory] = useState<ExtractionResult[]>([]);

  // Load service status on component mount
  useEffect(() => {
    loadServiceStatus();
  }, []);

  const loadServiceStatus = async () => {
    try {
      const response = await fetch('/api/youtube-extraction-microservice');
      if (response.ok) {
        const status = await response.json();
        setServiceStatus(status);
      }
    } catch (error) {
      console.error('Error loading service status:', error);
    }
  };

  const handleExtraction = async () => {
    setIsExtracting(true);
    setError(null);
    setExtractionResult(null);

    try {
      const response = await fetch('/api/youtube-extraction-microservice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          requestId: `extraction_${Date.now()}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setExtractionResult(result);
        setExtractionHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10
      } else {
        setError(result.error?.message || 'Extraction failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfigChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof MicroserviceConfig],
          [child]: value,
        },
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return '#00ff00';
      case 'degraded': return '#ffff00';
      case 'disconnected': return '#ff0000';
      default: return '#666666';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="lcars-container">
      {/* Service Status Panel */}
      <div className="lcars-panel lcars-primary-panel">
        <h2 className="lcars-title">🚀 YouTube Project Extraction Microservice</h2>
        <p className="lcars-subtitle">
          Reusable n8n Microservice for YouTube Project Extraction
        </p>
        {serviceStatus && (
          <div className="service-status">
            <div className="status-indicator" style={{ backgroundColor: getStatusColor(serviceStatus.status) }}>
              {serviceStatus.status.toUpperCase()}
            </div>
            <div className="service-info">
              <p><strong>Version:</strong> {serviceStatus.version}</p>
              <p><strong>Microservice:</strong> {serviceStatus.microservice.status}</p>
              <p><strong>Last Checked:</strong> {new Date(serviceStatus.microservice.lastChecked).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Panel */}
      <div className="lcars-panel lcars-info-panel">
        <h3 className="lcars-panel-title">⚙️ Microservice Configuration</h3>
        
        <div className="config-grid">
          <div className="config-group">
            <label>Channel URL:</label>
            <input
              type="text"
              value={config.channelUrl}
              onChange={(e) => handleConfigChange('channelUrl', e.target.value)}
              className="lcars-input"
              placeholder="https://www.youtube.com/@channel"
            />
          </div>

          <div className="config-group">
            <label>Extraction Type:</label>
            <select
              value={config.extractionType}
              onChange={(e) => handleConfigChange('extractionType', e.target.value)}
              className="lcars-select"
            >
              <option value="full">Full Extraction</option>
              <option value="quick">Quick Extraction</option>
              <option value="targeted">Targeted Extraction</option>
            </select>
          </div>

          <div className="config-group">
            <label>Max Videos:</label>
            <input
              type="number"
              value={config.options.maxVideos}
              onChange={(e) => handleConfigChange('options.maxVideos', parseInt(e.target.value))}
              className="lcars-input"
              min="1"
              max="100"
            />
          </div>

          <div className="config-group">
            <label>Email Recipients:</label>
            <input
              type="text"
              value={config.options.recipients.join(', ')}
              onChange={(e) => handleConfigChange('options.recipients', e.target.value.split(',').map(s => s.trim()))}
              className="lcars-input"
              placeholder="email1@domain.com, email2@domain.com"
            />
          </div>
        </div>

        <div className="options-grid">
          <div className="option-item">
            <input
              type="checkbox"
              id="includeArchived"
              checked={config.options.includeArchived}
              onChange={(e) => handleConfigChange('options.includeArchived', e.target.checked)}
            />
            <label htmlFor="includeArchived">Include Archived Videos</label>
          </div>

          <div className="option-item">
            <input
              type="checkbox"
              id="revenueEstimation"
              checked={config.options.revenueEstimation}
              onChange={(e) => handleConfigChange('options.revenueEstimation', e.target.checked)}
            />
            <label htmlFor="revenueEstimation">Revenue Estimation</label>
          </div>

          <div className="option-item">
            <input
              type="checkbox"
              id="complexityAssessment"
              checked={config.options.complexityAssessment}
              onChange={(e) => handleConfigChange('options.complexityAssessment', e.target.checked)}
            />
            <label htmlFor="complexityAssessment">Complexity Assessment</label>
          </div>

          <div className="option-item">
            <input
              type="checkbox"
              id="autoApproval"
              checked={config.options.autoApproval}
              onChange={(e) => handleConfigChange('options.autoApproval', e.target.checked)}
            />
            <label htmlFor="autoApproval">Auto Approval</label>
          </div>

          <div className="option-item">
            <input
              type="checkbox"
              id="emailNotification"
              checked={config.options.emailNotification}
              onChange={(e) => handleConfigChange('options.emailNotification', e.target.checked)}
            />
            <label htmlFor="emailNotification">Email Notification</label>
          </div>

          <div className="option-item">
            <input
              type="checkbox"
              id="agileIntegration"
              checked={config.options.agileIntegration}
              onChange={(e) => handleConfigChange('options.agileIntegration', e.target.checked)}
            />
            <label htmlFor="agileIntegration">Agile Integration</label>
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="lcars-button lcars-button-primary"
            onClick={handleExtraction}
            disabled={isExtracting}
          >
            {isExtracting ? '🔄 Extracting...' : '🚀 Start Extraction'}
          </button>
          <button
            className="lcars-button lcars-button-secondary"
            onClick={loadServiceStatus}
          >
            🔄 Refresh Status
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="lcars-panel lcars-warning-panel">
          <h3 className="lcars-panel-title">❌ Error</h3>
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* Extraction Results */}
      {extractionResult && (
        <div className="lcars-panel lcars-success-panel">
          <h3 className="lcars-panel-title">✅ Extraction Results</h3>
          
          <div className="result-summary">
            <div className="summary-item">
              <label>Request ID:</label>
              <span>{extractionResult.requestId}</span>
            </div>
            <div className="summary-item">
              <label>Status:</label>
              <span>{extractionResult.extractionStatus}</span>
            </div>
            <div className="summary-item">
              <label>Total Projects:</label>
              <span>{extractionResult.metadata.totalProjects}</span>
            </div>
            <div className="summary-item">
              <label>Total Revenue:</label>
              <span>{formatCurrency(extractionResult.metadata.totalRevenue)}</span>
            </div>
            <div className="summary-item">
              <label>ROI:</label>
              <span>{extractionResult.metadata.roi.toFixed(1)}%</span>
            </div>
            <div className="summary-item">
              <label>Processing Time:</label>
              <span>{extractionResult.metadata.processingTime}ms</span>
            </div>
          </div>

          {/* Channel Information */}
          <div className="channel-info">
            <h4>📺 Channel Information</h4>
            <div className="channel-details">
              <p><strong>Name:</strong> {extractionResult.channel.name}</p>
              <p><strong>Subscribers:</strong> {extractionResult.channel.subscribers}</p>
              <p><strong>Video Count:</strong> {extractionResult.channel.videoCount}</p>
              <p><strong>Category:</strong> {extractionResult.channel.category}</p>
            </div>
          </div>

          {/* Projects List */}
          <div className="projects-section">
            <h4>📋 Extracted Projects</h4>
            <div className="projects-grid">
              {extractionResult.projects.map((project, index) => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h5>{project.name}</h5>
                    <span className="revenue-badge">{formatCurrency(project.revenuePotential)}</span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-meta">
                    <span className="complexity-badge">{project.complexity}</span>
                    <span className="category-badge">{project.category}</span>
                    <span className="time-badge">{project.estimatedTime}</span>
                  </div>
                  <div className="project-features">
                    {project.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Analysis */}
          <div className="revenue-section">
            <h4>💰 Revenue Analysis</h4>
            <div className="revenue-grid">
              <div className="revenue-item">
                <label>Total Revenue Potential:</label>
                <span className="revenue-value">{formatCurrency(extractionResult.revenue.totalRevenuePotential)}</span>
              </div>
              <div className="revenue-item">
                <label>Average per Project:</label>
                <span className="revenue-value">{formatCurrency(extractionResult.revenue.averageRevenuePerProject)}</span>
              </div>
              <div className="revenue-item">
                <label>Estimated ROI:</label>
                <span className="revenue-value">{extractionResult.revenue.estimatedROI.toFixed(1)}%</span>
              </div>
              <div className="revenue-item">
                <label>Net Profit:</label>
                <span className="revenue-value">{formatCurrency(extractionResult.revenue.netProfit)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extraction History */}
      {extractionHistory.length > 0 && (
        <div className="lcars-panel lcars-accent-panel">
          <h3 className="lcars-panel-title">📚 Extraction History</h3>
          <div className="history-grid">
            {extractionHistory.map((result, index) => (
              <div key={result.requestId} className="history-item">
                <div className="history-header">
                  <span className="history-id">{result.requestId}</span>
                  <span className="history-date">{new Date(result.timestamp).toLocaleString()}</span>
                </div>
                <div className="history-summary">
                  <span>{result.metadata.totalProjects} projects</span>
                  <span>{formatCurrency(result.metadata.totalRevenue)}</span>
                  <span>{result.metadata.roi.toFixed(1)}% ROI</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeExtractionMicroservice;
