'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

// Dynamic Intent-Driven Page Component
// Replaces static page templates with intelligent layout generation
export default function DynamicIntentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [layoutConfig, setLayoutConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract intent from URL parameters
  const intentPath = Array.isArray(params.intent) ? params.intent.join('/') : params.intent;
  const userIntent = searchParams.get('intent') || extractIntentFromPath(intentPath || 'default');
  const goalType = searchParams.get('goal') || 'information-seeking';
  const context = {
    projectId: searchParams.get('project'),
    clientId: searchParams.get('client'),
    userRole: searchParams.get('role') || 'user',
    device: detectDevice(),
    preferences: getUserPreferences()
  };

  useEffect(() => {
    generateDynamicLayout();
  }, [intentPath, userIntent, goalType]);

  const generateDynamicLayout = async () => {
    try {
      setLoading(true);
      
      // Call Ships Computer Layout Engine
      const response = await fetch('/api/ships-computer/layout-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIntent,
          goalType,
          context,
          preferences: context.preferences
        })
      });

      if (!response.ok) {
        throw new Error('Ships Computer layout generation failed');
      }

      const layoutData = await response.json();
      setLayoutConfig(layoutData);
      
      // Log layout generation for analytics
      console.log('🖖 Ships Computer generated layout:', {
        intent: userIntent,
        goalType,
        layoutType: layoutData.dynamicLayout?.layoutType,
        components: layoutData.dynamicLayout?.componentConfiguration?.length || 0
      });
      
    } catch (err) {
      console.error('Dynamic layout generation error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Fallback to basic layout
      setLayoutConfig({
        dynamicLayout: {
          layoutType: 'fallback-basic',
          componentConfiguration: [
            {
              component: 'LCARSBasicPanel',
              position: 'primary',
              configuration: { content: 'Basic interface loaded due to error' }
            }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DynamicLayoutLoader />;
  }

  if (error && !layoutConfig) {
    return <DynamicLayoutError error={error} onRetry={generateDynamicLayout} />;
  }

  return (
    <DynamicLayoutRenderer 
      layoutConfig={layoutConfig} 
      userIntent={userIntent}
      goalType={goalType}
      context={context}
    />
  );
}

// Dynamic Layout Renderer Component
function DynamicLayoutRenderer({ layoutConfig, userIntent, goalType, context }: any) {
  if (!layoutConfig?.dynamicLayout) {
    return <div>No layout configuration available</div>;
  }

  const { dynamicLayout, lcarsConfiguration } = layoutConfig;
  
  return (
    <div className="dynamic-intent-layout" data-intent={userIntent} data-goal={goalType}>
      {/* Ships Computer Voice Response */}
      <ShipsComputerVoiceResponse layoutConfig={layoutConfig} />
      
      {/* LCARS Header with Intent Context */}
      <LCARSIntentHeader 
        intent={userIntent}
        goalType={goalType}
        layoutType={dynamicLayout.layoutType}
        lcarsConfig={lcarsConfiguration}
      />
      
      {/* Dynamic Component Grid */}
      <div className={`layout-grid layout-${dynamicLayout.layoutType}`}>
        {dynamicLayout.componentConfiguration.map((componentConfig: any, index: number) => (
          <DynamicComponent
            key={`${componentConfig.component}-${index}`}
            componentConfig={componentConfig}
            context={context}
            lcarsConfig={lcarsConfiguration}
          />
        ))}
      </div>
      
      {/* Performance Analytics */}
      <LayoutPerformanceTracker layoutConfig={layoutConfig} />
    </div>
  );
}

// Ships Computer Voice Response Component
function ShipsComputerVoiceResponse({ layoutConfig }: any) {
  const [voiceResponse, setVoiceResponse] = useState('');

  useEffect(() => {
    if (layoutConfig?.computerNote) {
      setVoiceResponse(layoutConfig.computerNote);
      
      // Simulate Majel Barrett computer voice
      console.log('🗣️ Ships Computer:', layoutConfig.computerNote);
    }
  }, [layoutConfig]);

  return (
    <div className="ships-computer-response lcars-panel">
      <div className="computer-indicator">
        <span className="computer-icon">💻</span>
        <span className="voice-indicator">🗣️</span>
      </div>
      <div className="computer-message">
        {voiceResponse}
      </div>
    </div>
  );
}

// LCARS Intent Header Component
function LCARSIntentHeader({ intent, goalType, layoutType, lcarsConfig }: any) {
  return (
    <header className="lcars-intent-header" style={{
      backgroundColor: lcarsConfig?.lcarsConfiguration?.colorScheme?.background || '#000000',
      borderBottom: `3px solid ${lcarsConfig?.lcarsConfiguration?.colorScheme?.primary || '#FF9900'}`
    }}>
      <div className="intent-identification">
        <div className="intent-label">USER INTENT</div>
        <div className="intent-value">{intent.toUpperCase()}</div>
      </div>
      
      <div className="goal-identification">
        <div className="goal-label">GOAL TYPE</div>
        <div className="goal-value">{goalType.toUpperCase()}</div>
      </div>
      
      <div className="layout-identification">
        <div className="layout-label">LAYOUT TYPE</div>
        <div className="layout-value">{layoutType.toUpperCase()}</div>
      </div>
      
      <div className="ships-computer-status">
        <div className="status-label">SHIPS COMPUTER</div>
        <div className="status-value">OPERATIONAL</div>
      </div>
    </header>
  );
}

// Dynamic Component Renderer
function DynamicComponent({ componentConfig, context, lcarsConfig }: any) {
  const { component, position, configuration } = componentConfig;
  
  // Select appropriate component based on Ships Computer recommendation
  const ComponentToRender = selectLCARSComponent(component);
  
  return (
    <div 
      className={`dynamic-component position-${position}`}
      data-component={component}
    >
      <ComponentToRender 
        configuration={configuration}
        context={context}
        lcarsConfig={lcarsConfig}
      />
    </div>
  );
}

// LCARS Component Selection
function selectLCARSComponent(componentName: string) {
  const componentMap: { [key: string]: React.ComponentType<any> } = {
    'LCARSFormPanel': LCARSFormPanel,
    'LCARSSearchPanel': LCARSSearchPanel,
    'LCARSResultsGrid': LCARSResultsGrid,
    'LCARSDataVisualization': LCARSDataVisualization,
    'LCARSMetricsOverview': LCARSMetricsOverview,
    'LCARSTeamOverview': LCARSTeamOverview,
    'LCARSStatusOverview': LCARSStatusOverview,
    'LCARSActionPanel': LCARSActionPanel,
    'LCARSProgressIndicator': LCARSProgressIndicator,
    'LCARSFilterPanel': LCARSFilterPanel,
    'LCARSContentPanel': LCARSContentPanel,
    'LCARSBasicPanel': LCARSBasicPanel
  };
  
  return componentMap[componentName] || LCARSBasicPanel;
}

// LCARS Component Implementations
function LCARSFormPanel({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-form-panel">
      <div className="panel-header">
        <h3>Data Input Interface</h3>
      </div>
      <div className="form-content">
        {configuration?.fields?.map((field: any, index: number) => (
          <div key={index} className="form-field">
            <label>{field.type.toUpperCase()} FIELD</label>
            <input 
              type={field.type}
              required={field.required}
              className="lcars-input"
            />
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button className="lcars-button primary">Submit</button>
        <button className="lcars-button secondary">Save Draft</button>
      </div>
    </div>
  );
}

function LCARSSearchPanel({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-search-panel">
      <div className="search-interface">
        <input 
          type="search"
          placeholder="Enter search parameters..."
          className="lcars-search-input"
        />
        <button className="lcars-search-button">Search</button>
      </div>
      {configuration?.filters && (
        <div className="search-filters">
          {configuration.filters.map((filter: any, index: number) => (
            <div key={index} className="filter-option">
              <label>{filter.type.toUpperCase()}</label>
              <select className="lcars-select">
                <option>All {filter.type}</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LCARSResultsGrid({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-results-grid">
      <div className="results-header">
        <h3>Search Results</h3>
        <div className="result-count">42 items found</div>
      </div>
      <div className="results-container">
        {[1, 2, 3, 4, 5, 6].map(item => (
          <div key={item} className="result-item lcars-panel">
            <div className="item-title">Result Item {item}</div>
            <div className="item-summary">Summary of search result content...</div>
            <div className="item-actions">
              <button className="lcars-button small">View</button>
              <button className="lcars-button small">Select</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LCARSDataVisualization({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-data-visualization">
      <div className="visualization-header">
        <h3>Data Analysis Interface</h3>
      </div>
      <div className="chart-container">
        <div className="chart-placeholder">
          [Interactive Data Visualization]
          <div className="chart-type">
            Chart Type: {configuration?.chartTypes?.[0] || 'Line Chart'}
          </div>
        </div>
      </div>
      <div className="data-controls">
        <button className="lcars-button">Drill Down</button>
        <button className="lcars-button">Export</button>
        <button className="lcars-button">Share</button>
      </div>
    </div>
  );
}

function LCARSMetricsOverview({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-metrics-overview">
      <div className="metrics-grid">
        {['Performance', 'Efficiency', 'Quality', 'Progress'].map(metric => (
          <div key={metric} className="metric-card lcars-panel">
            <div className="metric-label">{metric}</div>
            <div className="metric-value">95.7%</div>
            <div className="metric-trend">↗ +5.2%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LCARSTeamOverview({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-team-overview">
      <div className="team-header">
        <h3>Crew Status</h3>
      </div>
      <div className="team-members">
        {['Captain Picard', 'Lieutenant Data', 'Counselor Troi'].map(member => (
          <div key={member} className="team-member lcars-panel">
            <div className="member-name">{member}</div>
            <div className="member-status online">Online</div>
            <div className="member-actions">
              <button className="lcars-button small">Consult</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LCARSStatusOverview({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-status-overview">
      <div className="status-grid">
        {['Systems', 'Network', 'Security', 'Performance'].map(system => (
          <div key={system} className="status-item lcars-panel">
            <div className="status-label">{system}</div>
            <div className="status-indicator operational">Operational</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LCARSActionPanel({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-action-panel">
      <div className="action-buttons">
        {configuration?.primaryAction && (
          <button className="lcars-button primary">
            {configuration.primaryAction}
          </button>
        )}
        {configuration?.secondaryAction && (
          <button className="lcars-button secondary">
            {configuration.secondaryAction}
          </button>
        )}
        {configuration?.cancelAction && (
          <button className="lcars-button cancel">
            {configuration.cancelAction}
          </button>
        )}
      </div>
    </div>
  );
}

function LCARSProgressIndicator({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-progress-indicator">
      <div className="progress-header">
        <h4>Progress Status</h4>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '67%' }}></div>
      </div>
      <div className="progress-steps">
        <div className="step completed">Step 1</div>
        <div className="step completed">Step 2</div>
        <div className="step active">Step 3</div>
        <div className="step">Step 4</div>
      </div>
    </div>
  );
}

function LCARSFilterPanel({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-filter-panel">
      <div className="filter-header">
        <h4>Filter Options</h4>
      </div>
      <div className="filter-groups">
        {['Category', 'Status', 'Date Range'].map(filterGroup => (
          <div key={filterGroup} className="filter-group">
            <label>{filterGroup}</label>
            <select className="lcars-select">
              <option>All {filterGroup}</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function LCARSContentPanel({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-content-panel">
      <div className="content-header">
        <h3>Information Display</h3>
      </div>
      <div className="content-body">
        <p>Dynamic content generated based on user intent analysis.</p>
        <p>This interface adapts to your specific goals and requirements.</p>
      </div>
      <div className="content-actions">
        <button className="lcars-button">Take Action</button>
        <button className="lcars-button">Learn More</button>
      </div>
    </div>
  );
}

function LCARSBasicPanel({ configuration, context, lcarsConfig }: any) {
  return (
    <div className="lcars-basic-panel">
      <div className="panel-content">
        {configuration?.content || 'Basic LCARS interface panel'}
      </div>
    </div>
  );
}

// Loading Component
function DynamicLayoutLoader() {
  return (
    <div className="dynamic-layout-loader">
      <div className="lcars-panel loading">
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            Ships Computer generating optimal interface...
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Component
function DynamicLayoutError({ error, onRetry }: any) {
  return (
    <div className="dynamic-layout-error">
      <div className="lcars-panel error">
        <div className="error-header">
          <h3>Interface Generation Error</h3>
        </div>
        <div className="error-message">
          {error}
        </div>
        <div className="error-actions">
          <button className="lcars-button" onClick={onRetry}>
            Retry Layout Generation
          </button>
        </div>
      </div>
    </div>
  );
}

// Performance Tracker Component
function LayoutPerformanceTracker({ layoutConfig }: any) {
  useEffect(() => {
    // Track layout performance metrics
    const metrics = {
      layoutType: layoutConfig?.dynamicLayout?.layoutType,
      componentCount: layoutConfig?.dynamicLayout?.componentConfiguration?.length || 0,
      generationTime: Date.now(),
      userIntent: layoutConfig?.layoutAnalysis?.primaryIntent
    };
    
    console.log('📊 Layout Performance:', metrics);
  }, [layoutConfig]);
  
  return null; // This component only tracks, doesn't render
}

// Helper Functions
function extractIntentFromPath(path: string): string {
  if (!path) return 'view-information';
  
  // Convert URL path to intent
  const pathMap: { [key: string]: string } = {
    'create': 'create-new-item',
    'edit': 'modify-existing-item', 
    'search': 'find-information',
    'analyze': 'analyze-data',
    'monitor': 'monitor-status',
    'collaborate': 'team-collaboration',
    'dashboard': 'monitor-status',
    'form': 'create-new-item',
    'settings': 'modify-configuration'
  };
  
  const firstSegment = path.split('/')[0].toLowerCase();
  return pathMap[firstSegment] || `explore-${firstSegment}`;
}

function detectDevice(): string {
  if (typeof window === 'undefined') return 'server';
  
  const userAgent = window.navigator.userAgent;
  if (/Mobi|Android/i.test(userAgent)) return 'mobile';
  if (/Tablet|iPad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function getUserPreferences(): any {
  if (typeof window === 'undefined') return {};
  
  // Get user preferences from localStorage or defaults
  return {
    theme: 'lcars-default',
    accessibility: 'standard',
    layout: 'adaptive',
    animations: 'enabled'
  };
}
