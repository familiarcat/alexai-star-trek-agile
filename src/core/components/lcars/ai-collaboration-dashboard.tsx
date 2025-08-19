'use client';

import React, { useState, useEffect } from 'react';
import { collectiveMemoryEngine } from '@/core/ai-orchestration-engine';
import type { AIAgent } from '@/core/ai-orchestration-engine';

export function AICollaborationDashboard() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [activeCollaborations, setActiveCollaborations] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000); // Every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = useCallback(() => {
    try {
      const allAgents = collectiveMemoryEngine.getAllAgents();
      setAgents(allAgents);
      
      const health = collectiveMemoryEngine.getSystemHealthSummary();
      setSystemHealth(health);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []); // Empty dependency array - only load once

  const startCollaboration = async (agentIds: string[], type: string) => {
    try {
      const sessionId = await collectiveMemoryEngine.startCollaboration(
        agentIds,
        type,
        'dashboard_collaboration',
        {
          screenSize: 'desktop',
          userIntent: 'collaboration',
          userContext: 'dashboard',
          currentPage: '/',
          userBehavior: {
            navigationPattern: [],
            interactionFrequency: 0,
            preferredFeatures: [],
            painPoints: [],
            satisfactionScore: 0.8
          },
          systemState: {
            performance: { loadTime: 0, renderTime: 0, memoryUsage: 0, cpuUsage: 0, successRate: 0.8 },
            accessibility: { wcagCompliance: 0.9, keyboardNavigation: true, screenReaderSupport: true, colorContrast: 0.95, focusManagement: true },
            userExperience: { taskCompletionRate: 0.85, userSatisfaction: 0.8, errorRate: 0.1, learningCurve: 0.7, engagementScore: 0.8 },
            technicalHealth: { buildSuccess: true, testCoverage: 0.8, deploymentStatus: 'operational', errorLogs: [], systemUptime: 99.9 }
          }
        }
      );
      
      console.log('🤝 Collaboration started:', sessionId);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error starting collaboration:', error);
    }
  };

  return (
    <div className="lcars-elbow-container">
      <div className="lcars-elbow-header">🤖 AI AGENT COLLABORATION DASHBOARD</div>
      <div className="lcars-elbow-content">
        
        {/* System Health Overview */}
        {systemHealth && (
          <div className="lcars-grid-item">
            <h3>System Health</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <strong>Agents:</strong> {systemHealth.activeAgents}/{systemHealth.totalAgents}
              </div>
              <div>
                <strong>Performance:</strong> {(systemHealth.avgPerformance * 100).toFixed(0)}%
              </div>
              <div>
                <strong>Learning Queue:</strong> {systemHealth.learningQueueSize}
              </div>
              <div>
                <strong>Collaborations:</strong> {systemHealth.activeCollaborations}
              </div>
            </div>
            <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
              <strong>Status:</strong> {systemHealth.systemStatus}
            </div>
          </div>
        )}

        {/* Agent Status Grid */}
        <div className="lcars-responsive-grid lcars-grid-3">
          {agents.map((agent) => (
            <div key={agent.id} className="lcars-grid-item">
              <h4>{agent.name}</h4>
              <p><strong>Role:</strong> {agent.role}</p>
              <p><strong>Expertise:</strong> {agent.expertise.join(', ')}</p>
              <p><strong>Status:</strong> {agent.isActive ? '🟢 Active' : '🔴 Inactive'}</p>
              <p><strong>Performance:</strong> {(agent.performanceMetrics.successRate * 100).toFixed(0)}%</p>
              <p><strong>Last Activity:</strong> {new Date(agent.lastActivity).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>

        {/* Collaboration Controls */}
        <div className="lcars-grid-item">
          <h3>Start Collaboration</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button
              className="lcars-cta-button lcars-cta-primary"
              onClick={() => startCollaboration(['ship_computer', 'commander_data'], 'performance_optimization')}
            >
              🚀 Performance Optimization
            </button>
            <button
              className="lcars-cta-button lcars-cta-secondary"
              onClick={() => startCollaboration(['counselor_troi', 'ship_computer'], 'ux_improvement')}
            >
              🎨 UX Improvement
            </button>
            <button
              className="lcars-cta-button lcars-cta-primary"
              onClick={() => startCollaboration(['commander_data', 'geordi_la_forge'], 'technical_analysis')}
            >
              🔧 Technical Analysis
            </button>
            <button
              className="lcars-cta-button lcars-cta-secondary"
              onClick={() => startCollaboration(['captain_picard', 'ship_computer'], 'strategic_planning')}
            >
              🎯 Strategic Planning
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}