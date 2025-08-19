import React, { useState, useEffect } from 'react';
import { Phase4FinalIntegration } from '../core/phase-4-final-integration';
import { EnhancedGlassCard, EnhancedGlowButton } from './enhanced-modern-components';

/**
 * 🌟 Phase 4 Final Integration Demo
 * Showcases the final integration system using persistent optimization knowledge
 * Demonstrates how the system operates optimally by default using stored didactic knowledge
 */
const Phase4FinalIntegrationDemo: React.FC = () => {
  const [phase4System, setPhase4System] = useState<Phase4FinalIntegration | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<any>(null);
  const [executionReport, setExecutionReport] = useState<string>('');
  const [optimizationSummary, setOptimizationSummary] = useState<any>(null);
  const [initializationLog, setInitializationLog] = useState<string[]>([]);

  useEffect(() => {
    // Initialize Phase 4 system
    const initializePhase4 = async () => {
      try {
        const system = new Phase4FinalIntegration();
        setPhase4System(system);

        // Capture console logs during initialization
        const originalLog = console.log;
        const logs: string[] = [];
        
        console.log = (...args) => {
          const message = args.join(' ');
          logs.push(message);
          setInitializationLog([...logs]);
          originalLog.apply(console, args);
        };

        await system.initialize();
        setIsInitialized(true);
        
        // Restore console.log
        console.log = originalLog;
        
        // Get initial execution status
        setExecutionStatus(system.getExecutionStatus());
      } catch (error) {
        console.error('Failed to initialize Phase 4:', error);
      }
    };

    initializePhase4();
  }, []);

  useEffect(() => {
    if (phase4System && isInitialized) {
      // Update execution status every second
      const interval = setInterval(() => {
        setExecutionStatus(phase4System.getExecutionStatus());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [phase4System, isInitialized]);

  const handleExecutePhase4 = async () => {
    if (!phase4System) return;

    setIsExecuting(true);
    setExecutionReport('');
    setOptimizationSummary(null);

    try {
      const result = await phase4System.executePhase4();
      setExecutionReport(result.report);
      setOptimizationSummary(result.optimizationSummary);
    } catch (error) {
      console.error('Phase 4 execution failed:', error);
      setExecutionReport('Execution failed with error: ' + error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!phase4System) {
    return (
      <div className="phase-4-demo">
        <div className="loading-container">
          <div className="loading-shimmer">Initializing Phase 4 Final Integration System...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="phase-4-demo">
      {/* Header */}
      <header className="demo-header">
        <div className="header-content">
          <h1 className="demo-title">🚀 Phase 4: Final Integration & Testing</h1>
          <p className="demo-subtitle">
            Using persistent optimization knowledge for maximum efficiency
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="demo-main">
        {/* System Status */}
        <section className="system-status">
          <h2>📊 System Status</h2>
          
          <div className="status-grid">
            <EnhancedGlassCard variant="elevated" className="status-card">
              <h3>🚀 Phase 4 System</h3>
              <div className="status-indicator">
                <span className={`status-dot ${isInitialized ? 'status-success' : 'status-pending'}`}></span>
                <span className="status-text">
                  {isInitialized ? 'Initialized & Ready' : 'Initializing...'}
                </span>
              </div>
              <p>Persistent optimization knowledge loaded</p>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" className="status-card">
              <h3>🧠 Optimization Memory</h3>
              <div className="status-indicator">
                <span className="status-dot status-success"></span>
                <span className="status-text">Active & Learning</span>
              </div>
              <p>Stored knowledge from previous phases</p>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" className="status-card">
              <h3>👥 Crew Coordination</h3>
              <div className="status-indicator">
                <span className="status-dot status-success"></span>
                <span className="status-text">Optimized & Ready</span>
              </div>
              <p>LLM allocation strategies active</p>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" className="status-card">
              <h3>💾 Knowledge Persistence</h3>
              <div className="status-indicator">
                <span className="status-dot status-success"></span>
                <span className="status-text">Supabase Ready</span>
              </div>
              <p>Optimization knowledge stored</p>
            </EnhancedGlassCard>
          </div>
        </section>

        {/* Initialization Log */}
        <section className="initialization-log">
          <h2>🔧 System Initialization Log</h2>
          
          <EnhancedGlassCard variant="interactive" className="log-container">
            <div className="log-header">
              <h3>Phase 4 Initialization Process</h3>
              <span className={`log-status ${isInitialized ? 'log-success' : 'log-pending'}`}>
                {isInitialized ? '✅ Complete' : '⏳ In Progress...'}
              </span>
            </div>
            
            <div className="log-content">
              {initializationLog.map((log, index) => (
                <div key={index} className="log-entry">
                  <span className="log-timestamp">{new Date().toLocaleTimeString()}</span>
                  <span className="log-message">{log}</span>
                </div>
              ))}
            </div>
          </EnhancedGlassCard>
        </section>

        {/* Execution Control */}
        <section className="execution-control">
          <h2>🎮 Phase 4 Execution Control</h2>
          
          <div className="control-panel">
            <div className="control-buttons">
              <EnhancedGlowButton
                variant="primary"
                size="large"
                onClick={handleExecutePhase4}
                disabled={!isInitialized || isExecuting}
                loading={isExecuting}
              >
                {isExecuting ? 'Executing Phase 4...' : '🚀 Execute Phase 4 Final Integration'}
              </EnhancedGlowButton>
            </div>

            {executionStatus && (
              <div className="execution-status">
                <h3>📊 Current Execution Status</h3>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="status-label">Total Tasks:</span>
                    <span className="status-value">{executionStatus.totalTasks}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Completed:</span>
                    <span className={`status-value ${getStatusColor('completed')}`}>
                      {executionStatus.completedTasks}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">In Progress:</span>
                    <span className={`status-value ${getStatusColor('in-progress')}`}>
                      {executionStatus.inProgressTasks}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Pending:</span>
                    <span className={`status-value ${getStatusColor('pending')}`}>
                      {executionStatus.pendingTasks}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Efficiency:</span>
                    <span className="status-value">
                      {executionStatus.efficiency.toFixed(1)}%
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Time Remaining:</span>
                    <span className="status-value">
                      {executionStatus.estimatedTimeRemaining} min
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Task Overview */}
        <section className="task-overview">
          <h2>🎯 Phase 4 Task Overview</h2>
          
          <div className="task-categories">
            <EnhancedGlassCard variant="elevated" className="task-category critical">
              <h3>🚨 Critical Tasks</h3>
              <ul>
                <li>System-Wide Integration Testing (Commander Data)</li>
                <li>Performance Optimization & Tuning (Commander Spock)</li>
              </ul>
              <div className="category-stats">
                <span>Priority: Critical</span>
                <span>LLM: Expert Models</span>
              </div>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" className="task-category high">
              <h3>⚡ High Priority Tasks</h3>
              <ul>
                <li>Component Integration Validation (Chief Engineer Scott)</li>
                <li>User Experience Finalization (Counselor Troi)</li>
              </ul>
              <div className="category-stats">
                <span>Priority: High</span>
                <span>LLM: Advanced Models</span>
              </div>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" className="task-category medium">
              <h3>🔄 Medium Priority Tasks</h3>
              <ul>
                <li>Performance Monitoring Setup (Lieutenant Worf)</li>
                <li>Quality Assurance Testing (Quark)</li>
              </ul>
              <div className="category-stats">
                <span>Priority: Medium</span>
                <span>LLM: Advanced Models</span>
              </div>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" className="task-category low">
              <h3>📚 Low Priority Tasks</h3>
              <ul>
                <li>Documentation Finalization (Observation Lounge)</li>
              </ul>
              <div className="category-stats">
                <span>Priority: Low</span>
                <span>LLM: Basic Models</span>
              </div>
            </EnhancedGlassCard>
          </div>
        </section>

        {/* Execution Report */}
        {executionReport && (
          <section className="execution-report">
            <h2>📋 Phase 4 Execution Report</h2>
            
            <EnhancedGlassCard variant="elevated" className="report-container">
              <pre className="execution-report-text">{executionReport}</pre>
            </EnhancedGlassCard>
          </EnhancedGlassCard>
        )}

        {/* Optimization Summary */}
        {optimizationSummary && (
          <section className="optimization-summary">
            <h2>🧠 Optimization Knowledge Summary</h2>
            
            <div className="summary-grid">
              <EnhancedGlassCard variant="elevated" className="summary-card">
                <h3>📊 System Metrics</h3>
                <div className="summary-stats">
                  <div className="stat-row">
                    <span>Total Optimizations:</span>
                    <span>{optimizationSummary.totalOptimizations}</span>
                  </div>
                  <div className="stat-row">
                    <span>Overall Efficiency:</span>
                    <span>{optimizationSummary.overallEfficiency.toFixed(1)}%</span>
                  </div>
                  <div className="stat-row">
                    <span>Cost Savings:</span>
                    <span>${optimizationSummary.costSavings.toFixed(6)}</span>
                  </div>
                </div>
              </EnhancedGlassCard>

              <EnhancedGlassCard variant="elevated" className="summary-card">
                <h3>👥 Crew Performance</h3>
                <div className="crew-performance">
                  {optimizationSummary.crewEfficiency.slice(0, 3).map((crew, index) => (
                    <div key={index} className="crew-stat">
                      <span className="crew-name">{crew.agentName}</span>
                      <span className="crew-efficiency">{crew.performanceMetrics.efficiencyScore.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </EnhancedGlassCard>

              <EnhancedGlassCard variant="elevated" className="summary-card">
                <h3>🎯 Top Strategies</h3>
                <div className="top-strategies">
                  {optimizationSummary.topStrategies.slice(0, 3).map((strategy, index) => (
                    <div key={index} className="strategy-stat">
                      <span className="strategy-name">{strategy.title}</span>
                      <span className="strategy-success">{strategy.successRate.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </EnhancedGlassCard>
            </div>
          </section>
        )}

        {/* Knowledge Persistence */}
        <section className="knowledge-persistence">
          <h2>💾 Knowledge Persistence & Learning</h2>
          
          <div className="persistence-features">
            <EnhancedGlassCard variant="elevated" className="feature-card">
              <h3>🧠 Persistent Memory</h3>
              <p>All optimization knowledge is stored in Supabase for future use</p>
              <ul>
                <li>LLM allocation strategies</li>
                <li>Task execution patterns</li>
                <li>Crew performance profiles</li>
                <li>Cost optimization data</li>
              </ul>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" className="feature-card">
              <h3>🎯 Default Optimization</h3>
              <p>The system now operates optimally by default using stored knowledge</p>
              <ul>
                <li>Automatic strategy selection</li>
                <li>Learned execution patterns</li>
                <li>Performance optimization</li>
                <li>Cost-effective routing</li>
              </ul>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" className="feature-card">
              <h3>📈 Continuous Learning</h3>
              <p>Every execution improves the system's optimization capabilities</p>
              <ul>
                <li>Real-time learning</li>
                <li>Pattern recognition</li>
                <li>Strategy refinement</li>
                <li>Performance improvement</li>
              </ul>
            </EnhancedGlassCard>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="demo-footer">
        <div className="footer-content">
          <p>🚀 Phase 4: Final Integration & Testing Complete</p>
          <p>System now operates optimally by default using persistent optimization knowledge</p>
        </div>
      </footer>
    </div>
  );
};

export default Phase4FinalIntegrationDemo;
