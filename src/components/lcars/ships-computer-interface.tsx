'use client';

import { useState, useEffect } from 'react';
import { DynamicLCARSLayout } from './dynamic-lcars-layout';
import { cn } from '@/lib/utils';

interface ShipComputerInterfaceProps {
  className?: string;
  initialQuery?: string;
  onCrewResponse?: (response: CrewResponse) => void;
}

interface CrewResponse {
  crew_member: string;
  role: string;
  response: string;
  ui_configuration: UIConfiguration;
  next_actions: string[];
}

interface UIConfiguration {
  layout: string;
  elements: string[];
  priority: string;
  crew_highlight: string;
  mission_status: string;
  dynamic_layout?: {
    sidebar_config: {
      active_crew: string;
      mission_priority: string;
      status_indicators: string[];
    };
    main_content: {
      layout_type: string;
      primary_elements: string[];
      secondary_elements: string[];
    };
    responsive_config: {
      mobile_optimized: boolean;
      tablet_optimized: boolean;
      desktop_optimized: boolean;
    };
  };
}

interface ShipComputerResponse {
  success: boolean;
  timestamp: string;
  crew_response: CrewResponse;
  ui_configuration: UIConfiguration;
  next_actions: string[];
  system_status: {
    lcars_system: string;
    bilateral_learning: string;
    crew_coordination: string;
    ui_adaptation: string;
  };
}

export function ShipComputerInterface({ 
  className = '', 
  initialQuery = '',
  onCrewResponse 
}: ShipComputerInterfaceProps) {
  const [query, setQuery] = useState(initialQuery);
  const [context, setContext] = useState('general');
  const [userRole, setUserRole] = useState('developer');
  const [urgency, setUrgency] = useState('normal');
  const [complexity, setComplexity] = useState('medium');
  const [mission, setMission] = useState('general operations');
  const [interfacePrefs, setInterfacePrefs] = useState('standard');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<ShipComputerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ship's Computer n8n endpoint
  const SHIPS_COMPUTER_ENDPOINT = 'https://n8n.pbradygeorgen.com/webhook/ships-computer';

  const consultShipComputer = async () => {
    if (!query.trim()) {
      setError('Please enter a query for the Ship\'s Computer');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(SHIPS_COMPUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          context,
          userRole,
          urgency,
          complexity,
          mission,
          interfacePrefs
        }),
      });

      if (!response.ok) {
        throw new Error(`Ship's Computer response error: ${response.status}`);
      }

      const data: ShipComputerResponse = await response.json();
      
      if (data.success) {
        setCurrentResponse(data);
        onCrewResponse?.(data.crew_response);
      } else {
        throw new Error('Ship\'s Computer analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    consultShipComputer();
  };

  const resetInterface = () => {
    setQuery('');
    setContext('general');
    setUserRole('developer');
    setUrgency('normal');
    setComplexity('medium');
    setMission('general operations');
    setInterfacePrefs('standard');
    setCurrentResponse(null);
    setError(null);
  };

  return (
    <div className={cn('ships-computer-interface', className)}>
      {/* Ship's Computer Header */}
      <div className="lcars-computer-header">
        <div className="lcars-computer-title">
          <span className="lcars-computer-icon">🖖</span>
          <span className="lcars-computer-text">SHIP'S COMPUTER INTERFACE</span>
        </div>
        <div className="lcars-computer-status">
          <span className="lcars-status-indicator lcars-status-success"></span>
          <span>LCARS SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Query Interface */}
      <form onSubmit={handleSubmit} className="lcars-query-form">
        <div className="lcars-query-section">
          <label className="lcars-label">QUERY FOR SHIP'S COMPUTER:</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your request or question..."
            className="lcars-textarea"
            rows={3}
            disabled={isProcessing}
          />
        </div>

        {/* Context Configuration */}
        <div className="lcars-context-config">
          <div className="lcars-context-row">
            <div className="lcars-context-field">
              <label className="lcars-label">CONTEXT:</label>
              <select 
                value={context} 
                onChange={(e) => setContext(e.target.value)}
                className="lcars-select"
                disabled={isProcessing}
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="strategic">Strategic</option>
                <option value="emotional">Emotional</option>
                <option value="security">Security</option>
                <option value="collaboration">Collaboration</option>
              </select>
            </div>
            
            <div className="lcars-context-field">
              <label className="lcars-label">USER ROLE:</label>
              <select 
                value={userRole} 
                onChange={(e) => setUserRole(e.target.value)}
                className="lcars-select"
                disabled={isProcessing}
              >
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="analyst">Analyst</option>
                <option value="designer">Designer</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <div className="lcars-context-row">
            <div className="lcars-context-field">
              <label className="lcars-label">URGENCY:</label>
              <select 
                value={urgency} 
                onChange={(e) => setUrgency(e.target.value)}
                className="lcars-select"
                disabled={isProcessing}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="lcars-context-field">
              <label className="lcars-label">COMPLEXITY:</label>
              <select 
                value={complexity} 
                onChange={(e) => setComplexity(e.target.value)}
                className="lcars-select"
                disabled={isProcessing}
              >
                <option value="simple">Simple</option>
                <option value="medium">Medium</option>
                <option value="complex">Complex</option>
                <option value="very-complex">Very Complex</option>
              </select>
            </div>
          </div>

          <div className="lcars-context-row">
            <div className="lcars-context-field">
              <label className="lcars-label">MISSION:</label>
              <input
                type="text"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="lcars-input"
                placeholder="Current mission or objective"
                disabled={isProcessing}
              />
            </div>
            
            <div className="lcars-context-field">
              <label className="lcars-label">INTERFACE PREFERENCES:</label>
              <select 
                value={interfacePrefs} 
                onChange={(e) => setInterfacePrefs(e.target.value)}
                className="lcars-select"
                disabled={isProcessing}
              >
                <option value="standard">Standard</option>
                <option value="minimal">Minimal</option>
                <option value="detailed">Detailed</option>
                <option value="adaptive">Adaptive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lcars-action-buttons">
          <button
            type="submit"
            className={cn('lcars-button', 'lcars-button-primary')}
            disabled={isProcessing || !query.trim()}
          >
            {isProcessing ? 'CONSULTING SHIP\'S COMPUTER...' : 'CONSULT SHIP\'S COMPUTER'}
          </button>
          
          <button
            type="button"
            onClick={resetInterface}
            className="lcars-button lcars-button-secondary"
            disabled={isProcessing}
          >
            RESET INTERFACE
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="lcars-error-display">
          <span className="lcars-error-icon">⚠️</span>
          <span className="lcars-error-text">{error}</span>
        </div>
      )}

      {/* Ship's Computer Response */}
      {currentResponse && (
        <div className="lcars-response-section">
          <div className="lcars-response-header">
            <span className="lcars-response-title">SHIP'S COMPUTER ANALYSIS COMPLETE</span>
            <span className="lcars-response-timestamp">{new Date(currentResponse.timestamp).toLocaleString()}</span>
          </div>

          {/* Crew Response */}
          <div className="lcars-crew-response">
            <div className="lcars-crew-header">
              <span className="lcars-crew-member">{currentResponse.crew_response.crew_member}</span>
              <span className="lcars-crew-role">{currentResponse.crew_response.role}</span>
            </div>
            <div className="lcars-crew-message">
              {currentResponse.crew_response.response}
            </div>
          </div>

          {/* Next Actions */}
          <div className="lcars-next-actions">
            <span className="lcars-actions-label">RECOMMENDED ACTIONS:</span>
            <div className="lcars-actions-list">
              {currentResponse.next_actions.map((action, index) => (
                <div key={index} className="lcars-action-item">
                  <span className="lcars-action-number">{index + 1}.</span>
                  <span className="lcars-action-text">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="lcars-system-status">
            <span className="lcars-status-label">SYSTEM STATUS:</span>
            <div className="lcars-status-grid">
              <div className="lcars-status-item">
                <span className="lcars-status-name">LCARS:</span>
                <span className="lcars-status-value">{currentResponse.system_status.lcars_system}</span>
              </div>
              <div className="lcars-status-item">
                <span className="lcars-status-name">BILATERAL LEARNING:</span>
                <span className="lcars-status-value">{currentResponse.system_status.bilateral_learning}</span>
              </div>
              <div className="lcars-status-item">
                <span className="lcars-status-name">CREW COORDINATION:</span>
                <span className="lcars-status-value">{currentResponse.system_status.crew_coordination}</span>
              </div>
              <div className="lcars-status-item">
                <span className="lcars-status-name">UI ADAPTATION:</span>
                <span className="lcars-status-value">{currentResponse.system_status.ui_adaptation}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic LCARS Layout Preview */}
      {currentResponse && (
        <div className="lcars-layout-preview">
          <span className="lcars-preview-label">DYNAMIC LCARS LAYOUT PREVIEW:</span>
          <DynamicLCARSLayout 
            uiConfiguration={currentResponse.ui_configuration}
            onLayoutChange={(layout) => console.log('Layout adapted:', layout)}
          >
            <div className="lcars-preview-content">
              <span className="lcars-preview-text">LCARS INTERFACE ADAPTED FOR: {currentResponse.ui_configuration.layout.toUpperCase()}</span>
            </div>
          </DynamicLCARSLayout>
        </div>
      )}
    </div>
  );
}

