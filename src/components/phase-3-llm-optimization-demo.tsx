import React, { useState, useEffect } from 'react';
import { LLMOptimizationStrategy } from '../core/llm-optimization-strategy';
import { Phase3ExecutionCoordinator } from '../core/phase-3-execution-coordinator';
import { EnhancedGlassCard, EnhancedGlowButton } from './enhanced-modern-components';

/**
 * 🌟 Phase 3 LLM Optimization Demo
 * Showcases optimal LLM switching between crew agents for maximum efficiency
 */
const Phase3LLMOptimizationDemo: React.FC = () => {
  const [optimizationStrategy, setOptimizationStrategy] = useState<LLMOptimizationStrategy | null>(null);
  const [executionCoordinator, setExecutionCoordinator] = useState<Phase3ExecutionCoordinator | null>(null);
  const [optimizationReport, setOptimizationReport] = useState<string>('');
  const [executionStatus, setExecutionStatus] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionReport, setExecutionReport] = useState<string>('');

  useEffect(() => {
    // Initialize the optimization strategy
    const strategy = new LLMOptimizationStrategy();
    setOptimizationStrategy(strategy);

    // Initialize the execution coordinator
    const coordinator = new Phase3ExecutionCoordinator();
    setExecutionCoordinator(coordinator);

    // Generate initial optimization report
    setOptimizationReport(strategy.generateOptimizationReport());
  }, []);

  useEffect(() => {
    if (executionCoordinator) {
      // Update execution status every second
      const interval = setInterval(() => {
        setExecutionStatus(executionCoordinator.getExecutionStatus());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [executionCoordinator]);

  const handleStartExecution = async () => {
    if (!executionCoordinator) return;

    setIsExecuting(true);
    setExecutionReport('');

    try {
      const result = await executionCoordinator.executePhase3();
      setExecutionReport(result.report);
    } catch (error) {
      console.error('Execution failed:', error);
      setExecutionReport('Execution failed with error: ' + error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetExecution = () => {
    if (executionCoordinator) {
      executionCoordinator.reset();
      setExecutionReport('');
      setExecutionStatus(executionCoordinator.getExecutionStatus());
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

  if (!optimizationStrategy || !executionCoordinator) {
    return (
      <div className="phase-3-demo">
        <div className="loading-container">
          <div className="loading-shimmer">Initializing Phase 3 LLM Optimization...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="phase-3-demo">
      {/* Header */}
      <header className="demo-header">
        <div className="header-content">
          <h1 className="demo-title">🚀 Phase 3: LLM Optimization Strategy</h1>
          <p className="demo-subtitle">
            Optimal model switching between crew agents for maximum efficiency
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="demo-main">
        {/* Optimization Strategy Overview */}
        <section className="optimization-overview">
          <h2>🎯 LLM Optimization Strategy</h2>
          
          <div className="strategy-grid">
            <EnhancedGlassCard variant="elevated" animation="fade-in">
              <h3>🚀 Priority-Based Allocation</h3>
              <p>Critical tasks get expert LLMs, basic tasks use cost-effective models</p>
              <ul>
                <li>Critical: Claude 3.5 Sonnet (Expert)</li>
                <li>High: Claude 3 Haiku (Advanced)</li>
                <li>Medium: GPT-3.5 Turbo (Basic)</li>
                <li>Low: Cost-optimized models</li>
              </ul>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" animation="fade-in" delay={100}>
              <h3>💰 Cost Optimization</h3>
              <p>Intelligent model selection based on task complexity and requirements</p>
              <ul>
                <li>Token usage estimation</li>
                <li>Cost-per-token analysis</li>
                <li>Efficiency calculations</li>
                <li>Performance vs. cost balance</li>
              </ul>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" animation="fade-in" delay={200}>
              <h3>🔗 Dependency Management</h3>
              <p>Smart task ordering based on dependencies and resource availability</p>
              <ul>
                <li>Dependency resolution</li>
                <li>Parallel execution</li>
                <li>Resource allocation</li>
                <li>Bottleneck prevention</li>
              </ul>
            </EnhancedGlassCard>

            <EnhancedGlassCard variant="elevated" animation="fade-in" delay={300}>
              <h3>⚡ Performance Optimization</h3>
              <p>Real-time monitoring and optimization of execution efficiency</p>
              <ul>
                <li>Execution metrics</li>
                <li>Agent utilization</li>
                <li>Performance trends</li>
                <li>Optimization recommendations</li>
              </ul>
            </EnhancedGlassCard>
          </div>
        </section>

        {/* Optimization Report */}
        <section className="optimization-report">
          <h2>📊 Optimization Strategy Report</h2>
          
          <EnhancedGlassCard variant="interactive" className="report-container">
            <pre className="optimization-report-text">{optimizationReport}</pre>
          </EnhancedGlassCard>
        </section>

        {/* Execution Control */}
        <section className="execution-control">
          <h2>🎮 Phase 3 Execution Control</h2>
          
          <div className="control-panel">
            <div className="control-buttons">
              <EnhancedGlowButton
                variant="primary"
                size="large"
                onClick={handleStartExecution}
                disabled={isExecuting}
                loading={isExecuting}
              >
                {isExecuting ? 'Executing...' : '🚀 Start Phase 3 Execution'}
              </EnhancedGlowButton>

              <EnhancedGlowButton
                variant="secondary"
                size="large"
                onClick={handleResetExecution}
                disabled={isExecuting}
              >
                🔄 Reset Execution
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

        {/* Execution Report */}
        {executionReport && (
          <section className="execution-report">
            <h2>📋 Execution Report</h2>
            
            <EnhancedGlassCard variant="elevated" className="report-container">
              <pre className="execution-report-text">{executionReport}</pre>
            </EnhancedGlassCard>
          </section>
        )}

        {/* Crew Agent Details */}
        <section className="crew-details">
          <h2>👥 Crew Agent Details & LLM Allocation</h2>
          
          <div className="crew-grid">
            {executionCoordinator && Array.from(executionCoordinator.getAgentWorkload().entries()).map(([agentId, workload]) => (
              <EnhancedGlassCard key={agentId} variant="interactive" className="crew-card">
                <h3>{agentId.replace('-', ' ').toUpperCase()}</h3>
                <div className="crew-stats">
                  <div className="stat-row">
                    <span className="stat-label">Tasks:</span>
                    <span className="stat-value">
                      {workload.completedTasks}/{workload.totalTasks}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Utilization:</span>
                    <span className="stat-value">
                      {workload.utilization.toFixed(1)} min
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Efficiency:</span>
                    <span className="stat-value">
                      {workload.efficiency.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </EnhancedGlassCard>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="demo-footer">
        <div className="footer-content">
          <p>🚀 Phase 3: LLM Optimization Strategy Active</p>
          <p>Optimal model switching and execution coordination for maximum efficiency</p>
        </div>
      </footer>
    </div>
  );
};

export default Phase3LLMOptimizationDemo;
