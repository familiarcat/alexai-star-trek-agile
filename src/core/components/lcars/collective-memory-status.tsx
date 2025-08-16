'use client';

import React, { useState, useEffect } from 'react';
import { collectiveMemoryEngine } from '@/core/ai-orchestration-engine';

export function CollectiveMemoryStatus() {
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refreshSystemHealth();
    const interval = setInterval(refreshSystemHealth, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshSystemHealth = async () => {
    try {
      setIsRefreshing(true);
      const health = collectiveMemoryEngine.getSystemHealthSummary();
      setSystemHealth(health);
    } catch (error) {
      console.error('Error refreshing system health:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!systemHealth) {
    return (
      <div className="collective-memory-indicator">
        <div className="collective-memory-status analyzing">
          <span>🧠</span> Analyzing Collective Intelligence...
        </div>
      </div>
    );
  }

  return (
    <div className="collective-memory-indicator">
      <div className="collective-memory-status ready">
        <span>🧠</span> Collective Intelligence Active
      </div>
      
      <div className="collective-memory-metrics">
        <div className="collective-memory-metric">
          <div>Agents</div>
          <div className="collective-memory-metric-value">{systemHealth.activeAgents}/{systemHealth.totalAgents}</div>
        </div>
        <div className="collective-memory-metric">
          <div>Performance</div>
          <div className="collective-memory-metric-value">{(systemHealth.avgPerformance * 100).toFixed(0)}%</div>
        </div>
        <div className="collective-memory-metric">
          <div>Learning</div>
          <div className="collective-memory-metric-value">{systemHealth.learningQueueSize}</div>
        </div>
        <div className="collective-memory-metric">
          <div>Collaborations</div>
          <div className="collective-memory-metric-value">{systemHealth.activeCollaborations}</div>
        </div>
      </div>
      
      <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>
        Status: {systemHealth.systemStatus}
      </div>
      
      <button 
        onClick={refreshSystemHealth}
        disabled={isRefreshing}
        style={{
          background: 'var(--lcars-orange)',
          border: 'none',
          color: 'black',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          cursor: 'pointer',
          marginTop: '0.5rem',
          width: '100%'
        }}
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
}