'use client';

import React, { useEffect, useState } from 'react';
import { useLCARS } from '../../providers/lcars-data-provider';
import { n8nIntegrationService } from '../../services/n8n-integration-service';

// Enhanced LCARS Layout Component
// Integrates Next.js SSR, n8n workflows, and global state management
export function EnhancedLCARSLayout({ children }: { children: React.ReactNode }) {
  const { state, actions } = useLCARS();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize enhanced LCARS system
  useEffect(() => {
    initializeEnhancedLCARS();
  }, []);

  // Initialize enhanced LCARS system
  const initializeEnhancedLCARS = async () => {
    try {
      console.log('🚀 Initializing Enhanced LCARS System...');

      // Initialize n8n integration service
      const n8nInitialized = await n8nIntegrationService.initialize();
      
      if (n8nInitialized) {
        actions.updateSystemStatus({ n8nConnected: true });
        console.log('✅ n8n Integration Service initialized');
      } else {
        console.warn('⚠️ n8n Integration Service not available');
      }

      // Start data orchestration
      await startDataOrchestration();

      // Initialize UI state
      initializeUIState();

      setIsInitialized(true);
      console.log('🎉 Enhanced LCARS System initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Enhanced LCARS System:', error);
      actions.updateSystemStatus({ status: 'degraded' });
    }
  };

  // Start data orchestration
  const startDataOrchestration = async () => {
    try {
      // Define initial data requirements
      const dataRequirements = [
        'system-status',
        'crew-status',
        'workflow-status',
        'performance-metrics',
        'ui-components',
      ];

      // Define UI components to orchestrate
      const uiComponents = [
        'navigation',
        'sidebar',
        'main-content',
        'status-bar',
        'crew-panel',
        'workflow-panel',
      ];

      // Start orchestration
      const orchestration = await n8nIntegrationService.orchestrateDataAndUI(
        'Enhanced LCARS System Initialization',
        state.crew.activeMembers,
        [], // No specific workflows for initialization
        dataRequirements,
        uiComponents
      );

      console.log('✅ Data orchestration completed:', orchestration.id);

    } catch (error) {
      console.error('❌ Data orchestration failed:', error);
    }
  };

  // Initialize UI state
  const initializeUIState = () => {
    // Set responsive breakpoint
    const updateResponsiveBreakpoint = () => {
      const width = window.innerWidth;
      let breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      
      if (width < 768) {
        breakpoint = 'mobile';
      } else if (width < 1024) {
        breakpoint = 'tablet';
      }

      actions.updateUIState({ responsiveBreakpoint: breakpoint });
    };

    // Set initial breakpoint
    updateResponsiveBreakpoint();

    // Listen for resize events
    window.addEventListener('resize', updateResponsiveBreakpoint);

    // Set theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    actions.updateUIState({ theme: prefersDark ? 'lcars' : 'modern' });

    // Set layout based on screen size
    const layout = window.innerWidth < 1024 ? 'compact' : 'standard';
    actions.updateUIState({ layout });
  };

  // Render loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-yellow-400">Initializing Enhanced LCARS</h2>
          <p className="text-gray-400">Orchestrating data and UI components...</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>System Status: {state.system.status}</p>
            <p>n8n Connected: {state.system.n8nConnected ? 'Yes' : 'No'}</p>
            <p>Crew Members: {state.crew.activeMembers.length}</p>
          </div>
        </div>
      </div>
    );
  }

  // Render enhanced LCARS layout
  return (
    <div className={`enhanced-lcars-layout theme-${state.ui.theme} layout-${state.ui.layout}`}>
      {/* Enhanced LCARS Header */}
      <header className="enhanced-lcars-header">
        <div className="header-content">
          <div className="system-status">
            <h1 className="system-title">Enterprise-D Enhanced LCARS</h1>
            <div className="status-indicators">
              <span className={`status-indicator ${state.system.status}`}>
                {state.system.status.toUpperCase()}
              </span>
              <span className={`n8n-indicator ${state.system.n8nConnected ? 'connected' : 'disconnected'}`}>
                n8n: {state.system.n8nConnected ? 'Connected' : 'Disconnected'}
              </span>
              <span className="crew-indicator">
                Crew: {state.crew.activeMembers.length} Active
              </span>
            </div>
          </div>
          
          <div className="performance-metrics">
            <span className="metric">Response: {state.performance.responseTime}ms</span>
            <span className="metric">Memory: {state.performance.memoryUsage}MB</span>
            <span className="metric">Errors: {state.performance.errorRate}</span>
          </div>
        </div>
      </header>

      {/* Enhanced LCARS Navigation */}
      <nav className="enhanced-lcars-navigation">
        <div className="nav-content">
          <div className="nav-section">
            <h3>Navigation</h3>
            <ul className="nav-links">
              <li><a href="/">Dashboard</a></li>
              <li><a href="/crew">Crew</a></li>
              <li><a href="/workflows">Workflows</a></li>
              <li><a href="/projects">Projects</a></li>
              <li><a href="/analytics">Analytics</a></li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h3>Active Components</h3>
            <ul className="component-list">
              {state.ui.activeComponents.map(component => (
                <li key={component} className="component-item">
                  {component}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Enhanced LCARS Sidebar */}
      <aside className="enhanced-lcars-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3>Crew Status</h3>
            <div className="crew-status-list">
              {Object.entries(state.crew.crewStatus).map(([member, status]) => (
                <div key={member} className={`crew-member ${status}`}>
                  <span className="member-name">{member}</span>
                  <span className="member-status">{status}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="sidebar-section">
            <h3>Workflow Status</h3>
            <div className="workflow-status-list">
              <div className="status-item">
                <span className="status-label">Active:</span>
                <span className="status-value">{state.workflows.active.length}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Pending:</span>
                <span className="status-value">{state.workflows.pending.length}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Completed:</span>
                <span className="status-value">{state.workflows.completed.length}</span>
              </div>
            </div>
          </div>
          
          <div className="sidebar-section">
            <h3>Data Cache</h3>
            <div className="cache-info">
              <span className="cache-size">{state.data.cache.size} items</span>
              <button 
                className="clear-cache-btn"
                onClick={() => actions.clearCache('all')}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Enhanced LCARS Main Content */}
      <main className="enhanced-lcars-main">
        <div className="main-content">
          {/* Mission Status Bar */}
          <div className="mission-status-bar">
            <div className="mission-info">
              <span className="mission-label">Current Mission:</span>
              <span className="mission-name">
                {state.crew.currentMission || 'No active mission'}
              </span>
            </div>
            
            <div className="mission-actions">
              <button 
                className="action-btn primary"
                onClick={() => startNewMission()}
              >
                New Mission
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => actions.syncN8nWorkflows()}
              >
                Sync Workflows
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {children}
          </div>
        </div>
      </main>

      {/* Enhanced LCARS Footer */}
      <footer className="enhanced-lcars-footer">
        <div className="footer-content">
          <div className="footer-section">
            <span className="version">v{state.system.version}</span>
            <span className="timestamp">Last Update: {state.system.lastUpdate}</span>
          </div>
          
          <div className="footer-section">
            <span className="connections">
              Connections: {state.performance.activeConnections}
            </span>
            <span className="memory-usage">
              Memory: {state.performance.memoryUsage}MB
            </span>
          </div>
        </div>
      </footer>

      {/* Enhanced LCARS Overlay */}
      {state.system.status === 'degraded' && (
        <div className="enhanced-lcars-overlay degraded">
          <div className="overlay-content">
            <h3>System Degraded</h3>
            <p>Some services are experiencing issues. Check crew status and workflow connections.</p>
            <button 
              className="overlay-btn"
              onClick={() => actions.updateSystemStatus({ status: 'operational' })}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Start new mission
  async function startNewMission() {
    try {
      const missionName = `Mission ${Date.now()}`;
      
      // Start coordination session
      const coordination = await actions.addCoordinationSession(
        `mission-${Date.now()}`,
        {
          mission: missionName,
          initiator: 'enhanced-lcars-layout',
          participants: state.crew.activeMembers,
          status: 'planning',
        }
      );

      // Update current mission
      actions.updateData('currentMission', missionName);
      
      console.log('🚀 New mission started:', coordination.id);
      
    } catch (error) {
      console.error('❌ Failed to start new mission:', error);
    }
  }
}

// Enhanced LCARS Layout Styles
const enhancedLCARSStyles = `
  .enhanced-lcars-layout {
    display: grid;
    grid-template-areas: 
      "header header header"
      "nav sidebar main"
      "footer footer footer";
    grid-template-columns: 250px 300px 1fr;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    background: var(--lcars-bg-primary);
    color: var(--lcars-text-primary);
  }

  .enhanced-lcars-header {
    grid-area: header;
    background: var(--lcars-bg-secondary);
    border-bottom: 2px solid var(--lcars-accent);
    padding: 1rem;
  }

  .enhanced-lcars-navigation {
    grid-area: nav;
    background: var(--lcars-bg-tertiary);
    border-right: 1px solid var(--lcars-border);
    padding: 1rem;
  }

  .enhanced-lcars-sidebar {
    grid-area: sidebar;
    background: var(--lcars-bg-tertiary);
    border-right: 1px solid var(--lcars-border);
    padding: 1rem;
  }

  .enhanced-lcars-main {
    grid-area: main;
    background: var(--lcars-bg-primary);
    padding: 1rem;
  }

  .enhanced-lcars-footer {
    grid-area: footer;
    background: var(--lcars-bg-secondary);
    border-top: 1px solid var(--lcars-accent);
    padding: 1rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .system-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--lcars-accent);
  }

  .status-indicators {
    display: flex;
    gap: 1rem;
  }

  .status-indicator {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  .status-indicator.operational {
    background: var(--lcars-success);
    color: white;
  }

  .status-indicator.degraded {
    background: var(--lcars-warning);
    color: black;
  }

  .status-indicator.offline {
    background: var(--lcars-error);
    color: white;
  }

  .n8n-indicator.connected {
    color: var(--lcars-success);
  }

  .n8n-indicator.disconnected {
    color: var(--lcars-warning);
  }

  .performance-metrics {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
  }

  .metric {
    padding: 0.25rem 0.5rem;
    background: var(--lcars-bg-tertiary);
    border-radius: 0.25rem;
  }

  .nav-section {
    margin-bottom: 2rem;
  }

  .nav-section h3 {
    color: var(--lcars-accent);
    margin-bottom: 0.5rem;
  }

  .nav-links {
    list-style: none;
    padding: 0;
  }

  .nav-links li {
    margin-bottom: 0.5rem;
  }

  .nav-links a {
    color: var(--lcars-text-primary);
    text-decoration: none;
    padding: 0.5rem;
    display: block;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }

  .nav-links a:hover {
    background: var(--lcars-bg-secondary);
  }

  .component-list {
    list-style: none;
    padding: 0;
  }

  .component-item {
    padding: 0.25rem 0.5rem;
    background: var(--lcars-bg-secondary);
    margin-bottom: 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .sidebar-section {
    margin-bottom: 2rem;
  }

  .sidebar-section h3 {
    color: var(--lcars-accent);
    margin-bottom: 0.5rem;
  }

  .crew-status-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .crew-member {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: var(--lcars-bg-secondary);
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .crew-member.active {
    border-left: 3px solid var(--lcars-success);
  }

  .crew-member.busy {
    border-left: 3px solid var(--lcars-warning);
  }

  .crew-member.offline {
    border-left: 3px solid var(--lcars-error);
  }

  .workflow-status-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0;
    font-size: 0.875rem;
  }

  .cache-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .clear-cache-btn {
    padding: 0.25rem 0.5rem;
    background: var(--lcars-warning);
    color: black;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .mission-status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--lcars-bg-secondary);
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .mission-info {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .mission-label {
    color: var(--lcars-text-muted);
  }

  .mission-name {
    font-weight: bold;
    color: var(--lcars-accent);
  }

  .mission-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .action-btn:hover {
    opacity: 0.8;
  }

  .action-btn.primary {
    background: var(--lcars-accent);
    color: white;
  }

  .action-btn.secondary {
    background: var(--lcars-bg-tertiary);
    color: var(--lcars-text-primary);
  }

  .content-area {
    background: var(--lcars-bg-secondary);
    border-radius: 0.5rem;
    padding: 1rem;
    min-height: 400px;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
  }

  .enhanced-lcars-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .overlay-content {
    background: var(--lcars-bg-secondary);
    padding: 2rem;
    border-radius: 0.5rem;
    text-align: center;
    max-width: 400px;
  }

  .overlay-content h3 {
    color: var(--lcars-warning);
    margin-bottom: 1rem;
  }

  .overlay-btn {
    padding: 0.5rem 1rem;
    background: var(--lcars-accent);
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-top: 1rem;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .enhanced-lcars-layout {
      grid-template-areas: 
        "header"
        "nav"
        "main"
        "sidebar"
        "footer";
      grid-template-columns: 1fr;
      grid-template-rows: auto auto 1fr auto auto;
    }
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
    }

    .status-indicators {
      flex-wrap: wrap;
      justify-content: center;
    }

    .performance-metrics {
      flex-wrap: wrap;
      justify-content: center;
    }

    .mission-status-bar {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = enhancedLCARSStyles;
  document.head.appendChild(styleElement);
}
