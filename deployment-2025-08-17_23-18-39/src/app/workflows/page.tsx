'use client';

import { useState, useEffect } from 'react';
import { CogIcon, PlayIcon, PauseIcon, StopIcon, EyeIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  type: 'automation' | 'integration' | 'notification' | 'data-processing';
  lastRun: string;
  nextRun: string;
  executionCount: number;
  successRate: number;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchWorkflows = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWorkflows([
          {
            id: '1',
            name: 'AI Agent Coordination',
            description: 'Automated coordination between Ship Computer, Data, and Troi AI agents',
            status: 'running',
            type: 'automation',
            lastRun: '2025-01-12 16:45:30',
            nextRun: '2025-01-12 17:00:00',
            executionCount: 156,
            successRate: 98.7
          },
          {
            id: '2',
            name: 'Database Synchronization',
            description: 'Real-time synchronization between local and remote databases',
            status: 'running',
            type: 'integration',
            lastRun: '2025-01-12 16:50:15',
            nextRun: '2025-01-12 17:00:00',
            executionCount: 89,
            successRate: 99.2
          },
          {
            id: '3',
            name: 'System Health Monitoring',
            description: 'Continuous monitoring of system health and performance metrics',
            status: 'paused',
            type: 'automation',
            lastRun: '2025-01-12 15:30:00',
            nextRun: '2025-01-12 18:00:00',
            executionCount: 234,
            successRate: 99.8
          },
          {
            id: '4',
            name: 'Notification Dispatch',
            description: 'Automated dispatch of system notifications and alerts',
            status: 'stopped',
            type: 'notification',
            lastRun: '2025-01-12 14:15:00',
            nextRun: '2025-01-12 20:00:00',
            executionCount: 67,
            successRate: 95.5
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch workflows:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  const handleCreateWorkflow = () => {
    console.log('Creating new workflow...');
    // Navigate to workflow creation form
  };

  const handleStartWorkflow = (workflowId: string) => {
    console.log('Starting workflow:', workflowId);
    // Start workflow execution
  };

  const handlePauseWorkflow = (workflowId: string) => {
    console.log('Pausing workflow:', workflowId);
    // Pause workflow execution
  };

  const handleStopWorkflow = (workflowId: string) => {
    console.log('Stopping workflow:', workflowId);
    // Stop workflow execution
  };

  const handleViewWorkflow = (workflowId: string) => {
    console.log('Viewing workflow:', workflowId);
    // Navigate to workflow detail
  };

  const handleEditWorkflow = (workflowId: string) => {
    console.log('Editing workflow:', workflowId);
    // Navigate to workflow edit form
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    console.log('Deleting workflow:', workflowId);
    // Show confirmation dialog and delete
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'var(--lcars-green)';
      case 'stopped': return 'var(--lcars-red)';
      case 'paused': return 'var(--lcars-yellow)';
      case 'error': return 'var(--lcars-red)';
      default: return 'var(--lcars-gray)';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'automation': return 'var(--lcars-blue)';
      case 'integration': return 'var(--lcars-african-violet)';
      case 'notification': return 'var(--lcars-orange)';
      case 'data-processing': return 'var(--lcars-green)';
      default: return 'var(--lcars-gray)';
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="lcars-elbow-container">
          <div className="lcars-elbow-header">WORKFLOW SYSTEM</div>
          <div className="lcars-elbow-content">
            <p className="lcars-text">Loading Workflows...</p>
            <p className="lcars-text-small">Initializing automation systems...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Workflow Management Header */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">WORKFLOW MANAGEMENT</div>
        <div className="lcars-elbow-content">
          <p className="lcars-text-medium">Configure and manage automated workflow systems</p>
          <div className="lcars-responsive-grid lcars-grid-2">
            <button onClick={handleCreateWorkflow} className="lcars-cta-button lcars-cta-primary">
              <PlusIcon className="lcars-icon" />
              <span>CREATE NEW WORKFLOW</span>
            </button>
            <button className="lcars-cta-button lcars-cta-secondary">
              <CogIcon className="lcars-icon" />
              <span>SYSTEM CONFIGURATION</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Workflows */}
      <div className="lcars-elbow-container">
        <div className="lcars-elbow-header">ACTIVE WORKFLOWS</div>
        <div className="lcars-elbow-content">
          <div className="lcars-responsive-grid lcars-grid-2">
            {workflows.map(workflow => (
              <div key={workflow.id} className="lcars-grid-item lcars-workflow-card">
                <div className="lcars-workflow-header">
                  <h3 className="lcars-text-medium lcars-text-orange">{workflow.name}</h3>
                  <div className="lcars-workflow-status">
                    <span 
                      className="lcars-status-badge"
                      style={{ backgroundColor: getStatusColor(workflow.status) }}
                    >
                      {workflow.status.toUpperCase()}
                    </span>
                    <span 
                      className="lcars-type-badge"
                      style={{ backgroundColor: getTypeColor(workflow.type) }}
                    >
                      {workflow.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="lcars-text-small lcars-workflow-description">
                  {workflow.description}
                </p>
                
                <div className="lcars-workflow-metrics">
                  <div className="lcars-metric-row">
                    <span className="lcars-text-small">Last Run:</span>
                    <span className="lcars-text-small">{workflow.lastRun}</span>
                  </div>
                  <div className="lcars-metric-row">
                    <span className="lcars-text-small">Next Run:</span>
                    <span className="lcars-text-small">{workflow.nextRun}</span>
                  </div>
                  <div className="lcars-metric-row">
                    <span className="lcars-text-small">Executions:</span>
                    <span className="lcars-text-small">{workflow.executionCount}</span>
                  </div>
                  <div className="lcars-metric-row">
                    <span className="lcars-text-small">Success Rate:</span>
                    <span className="lcars-text-small">{workflow.successRate}%</span>
                  </div>
                </div>
                
                <div className="lcars-workflow-controls">
                  {workflow.status === 'running' && (
                    <>
                      <button 
                        onClick={() => handlePauseWorkflow(workflow.id)}
                        className="lcars-cta-button lcars-cta-warning"
                      >
                        <PauseIcon className="lcars-icon-small" />
                        <span>PAUSE</span>
                      </button>
                      <button 
                        onClick={() => handleStopWorkflow(workflow.id)}
                        className="lcars-cta-button lcars-cta-danger"
                      >
                        <StopIcon className="lcars-icon-small" />
                        <span>STOP</span>
                      </button>
                    </>
                  )}
                  {workflow.status === 'paused' && (
                    <button 
                      onClick={() => handleStartWorkflow(workflow.id)}
                      className="lcars-cta-button lcars-cta-success"
                    >
                      <PlayIcon className="lcars-icon-small" />
                      <span>RESUME</span>
                    </button>
                  )}
                  {workflow.status === 'stopped' && (
                    <button 
                      onClick={() => handleStartWorkflow(workflow.id)}
                      className="lcars-cta-button lcars-cta-success"
                    >
                      <PlayIcon className="lcars-icon-small" />
                      <span>START</span>
                    </button>
                  )}
                </div>
                
                <div className="lcars-workflow-actions">
                  <button 
                    onClick={() => handleViewWorkflow(workflow.id)}
                    className="lcars-cta-button lcars-cta-info"
                  >
                    <EyeIcon className="lcars-icon-small" />
                    <span>VIEW</span>
                  </button>
                  <button 
                    onClick={() => handleEditWorkflow(workflow.id)}
                    className="lcars-cta-button lcars-cta-warning"
                  >
                    <PencilIcon className="lcars-icon-small" />
                    <span>EDIT</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteWorkflow(workflow.id)}
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
