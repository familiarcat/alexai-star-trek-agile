'use client';

import { useState, useEffect } from 'react';
import { DynamicLCARSLayout } from './dynamic-lcars-layout';
import { cn } from '@/lib/utils';

// Enhanced interfaces for multi-LLM support
interface LLMInfo {
  provider: string;
  model: string;
  maxTokens: number;
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

interface CrewResponse {
  crew_member: string;
  role: string;
  response: string;
  ui_configuration: UIConfiguration;
  next_actions: string[];
  llm_info: LLMInfo;
}

interface ShipComputerResponse {
  success: boolean;
  timestamp: string;
  crew_response: CrewResponse;
  ui_configuration: UIConfiguration;
  next_actions: string[];
  llm_info: LLMInfo;
  system_status: {
    lcars_system: string;
    bilateral_learning: string;
    crew_coordination: string;
    ui_adaptation: string;
    llm_provider: string;
    model_active: string;
  };
}

interface EnhancedShipComputerInterfaceProps {
  className?: string;
  initialQuery?: string;
  onCrewResponse?: (response: ShipComputerResponse) => void;
}

export function EnhancedShipComputerInterface({ 
  className = '', 
  initialQuery = '',
  onCrewResponse 
}: EnhancedShipComputerInterfaceProps) {
  const [query, setQuery] = useState(initialQuery);
  const [context, setContext] = useState('general');
  const [userRole, setUserRole] = useState('developer');
  const [urgency, setUrgency] = useState('normal');
  const [complexity, setComplexity] = useState('medium');
  const [mission, setMission] = useState('general operations');
  const [interfacePrefs, setInterfacePrefs] = useState('standard');
  const [preferredLLM, setPreferredLLM] = useState<'claude' | 'chatgpt' | 'gpt4'>('claude');
  const [useChatGPT5, setUseChatGPT5] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<ShipComputerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [llmStatus, setLlmStatus] = useState<LLMInfo | null>(null);

  // Endpoint for the new ChatGPT 5 ready workflow
  const ENHANCED_ENDPOINT = 'https://n8n.pbradygeorgen.com/webhook/crew-request-chatgpt5';

  const consultShipComputer = async () => {
    if (!query.trim()) {
      setError('Please enter a query for the Ship\'s Computer');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const requestData = {
        query: query.trim(),
        context,
        userRole,
        urgency,
        complexity,
        mission,
        interfacePrefs,
        preferredLLM,
        useChatGPT5
      };

      console.log('🚀 Sending request to Ship\'s Computer:', requestData);

      const response = await fetch(ENHANCED_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ShipComputerResponse = await response.json();
      console.log('✅ Ship\'s Computer Response:', data);

      if (data.success) {
        setCurrentResponse(data);
        setLlmStatus(data.llm_info);
        onCrewResponse?.(data);
      } else {
        throw new Error('Ship\'s Computer returned an error response');
      }

    } catch (err) {
      console.error('❌ Error consulting Ship\'s Computer:', err);
      setError(err instanceof Error ? err.message : 'Failed to consult Ship\'s Computer');
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
    setPreferredLLM('claude');
    setUseChatGPT5(false);
    setCurrentResponse(null);
    setError(null);
    setLlmStatus(null);
  };

  const getLLMDisplayName = (provider: string, model: string) => {
    if (provider === 'openai' && model === 'gpt-5') return 'ChatGPT 5';
    if (provider === 'openai' && model === 'gpt-4') return 'GPT-4';
    if (provider === 'anthropic' && model.includes('claude-3.5')) return 'Claude 3.5 Sonnet';
    return `${provider} (${model})`;
  };

  return (
    <div className={cn('enhanced-ships-computer-interface', className)}>
      {/* Enhanced Header with LLM Status */}
      <div className="lcars-computer-header">
        <h2 className="lcars-computer-title">🚀 ENHANCED SHIP'S COMPUTER INTERFACE</h2>
        <div className="lcars-llm-status">
          <span className="lcars-status-label">ACTIVE LLM:</span>
          <span className="lcars-llm-provider">
            {llmStatus ? getLLMDisplayName(llmStatus.provider, llmStatus.model) : 'Claude 3.5 Sonnet (Default)'}
          </span>
        </div>
      </div>

      {/* Enhanced Query Form */}
      <form onSubmit={handleSubmit} className="lcars-query-form">
        <div className="lcars-form-row">
          <div className="lcars-form-group">
            <label className="lcars-label">QUERY FOR SHIP'S COMPUTER:</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="lcars-textarea"
              placeholder="Enter your request for the Ship's Computer..."
              rows={3}
              required
            />
          </div>
        </div>

        <div className="lcars-form-row">
          <div className="lcars-form-group">
            <label className="lcars-label">CONTEXT:</label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="lcars-select"
            >
              <option value="general">General Operations</option>
              <option value="technical">Technical Analysis</option>
              <option value="strategic">Strategic Planning</option>
              <option value="security">Security & Tactics</option>
              <option value="engineering">Engineering Solutions</option>
              <option value="emotional">Emotional Intelligence</option>
            </select>
          </div>

          <div className="lcars-form-group">
            <label className="lcars-label">USER ROLE:</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="lcars-select"
            >
              <option value="developer">Developer</option>
              <option value="engineer">Engineer</option>
              <option value="analyst">Analyst</option>
              <option value="manager">Manager</option>
              <option value="user">End User</option>
            </select>
          </div>
        </div>

        <div className="lcars-form-row">
          <div className="lcars-form-group">
            <label className="lcars-label">URGENCY:</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="lcars-select"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="lcars-form-group">
            <label className="lcars-label">COMPLEXITY:</label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="lcars-select"
            >
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="complex">Complex</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* LLM Selection Section */}
        <div className="lcars-form-row lcars-llm-selection">
          <div className="lcars-form-group">
            <label className="lcars-label">PREFERRED LLM:</label>
            <select
              value={preferredLLM}
              onChange={(e) => setPreferredLLM(e.target.value as any)}
              className="lcars-select"
            >
              <option value="claude">Claude 3.5 Sonnet (Default)</option>
              <option value="chatgpt">ChatGPT 5 (Premium)</option>
              <option value="gpt4">GPT-4 (Standard)</option>
            </select>
          </div>

          <div className="lcars-form-group lcars-checkbox-group">
            <label className="lcars-checkbox-label">
              <input
                type="checkbox"
                checked={useChatGPT5}
                onChange={(e) => setUseChatGPT5(e.target.checked)}
                className="lcars-checkbox"
                disabled={preferredLLM !== 'chatgpt'}
              />
              <span className="lcars-checkbox-text">Use ChatGPT 5 (Requires ChatGPT subscription)</span>
            </label>
          </div>
        </div>

        <div className="lcars-form-row">
          <div className="lcars-form-group">
            <label className="lcars-label">MISSION:</label>
            <input
              type="text"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="lcars-input"
              placeholder="Current mission context..."
            />
          </div>

          <div className="lcars-form-group">
            <label className="lcars-label">INTERFACE PREFERENCES:</label>
            <select
              value={interfacePrefs}
              onChange={(e) => setInterfacePrefs(e.target.value)}
              className="lcars-select"
            >
              <option value="standard">Standard LCARS</option>
              <option value="minimal">Minimal Interface</option>
              <option value="detailed">Detailed View</option>
              <option value="tactical">Tactical Display</option>
            </select>
          </div>
        </div>

        <div className="lcars-form-actions">
          <button
            type="submit"
            disabled={isProcessing}
            className={cn('lcars-button', 'lcars-button-primary')}
          >
            {isProcessing ? '🔄 CONSULTING SHIP\'S COMPUTER...' : '🚀 CONSULT SHIP\'S COMPUTER'}
          </button>
          
          <button
            type="button"
            onClick={resetInterface}
            className={cn('lcars-button', 'lcars-button-secondary')}
          >
            🔄 RESET INTERFACE
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

      {/* Response Section */}
      {currentResponse && (
        <div className="lcars-response-section">
          <div className="lcars-response-header">
            <h3 className="lcars-response-title">SHIP'S COMPUTER RESPONSE</h3>
            <div className="lcars-response-meta">
              <span className="lcars-timestamp">Timestamp: {new Date(currentResponse.timestamp).toLocaleString()}</span>
              <span className="lcars-llm-used">
                LLM: {getLLMDisplayName(currentResponse.llm_info.provider, currentResponse.llm_info.model)}
              </span>
            </div>
          </div>

          <div className="lcars-crew-response">
            <div className="lcars-crew-header">
              <span className="lcars-crew-member">{currentResponse.crew_response.crew_member.toUpperCase()}</span>
              <span className="lcars-crew-role">({currentResponse.crew_response.role})</span>
            </div>
            <div className="lcars-crew-message">{currentResponse.crew_response.response}</div>
          </div>

          <div className="lcars-next-actions">
            <h4 className="lcars-actions-title">RECOMMENDED ACTIONS:</h4>
            <ul className="lcars-actions-list">
              {currentResponse.next_actions.map((action, index) => (
                <li key={index} className="lcars-action-item">• {action}</li>
              ))}
            </ul>
          </div>

          <div className="lcars-system-status">
            <h4 className="lcars-status-title">SYSTEM STATUS:</h4>
            <div className="lcars-status-grid">
              {Object.entries(currentResponse.system_status).map(([key, value]) => (
                <div key={key} className="lcars-status-item">
                  <span className="lcars-status-key">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                  <span className="lcars-status-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic LCARS Layout Preview */}
          <div className="lcars-layout-preview">
            <span className="lcars-preview-label">DYNAMIC LCARS LAYOUT PREVIEW:</span>
            <DynamicLCARSLayout 
              initialIntent={currentResponse.crew_response.response}
              onLayoutChange={(layout) => console.log('Layout adapted:', layout)}
            >
              <div className="lcars-preview-content">
                <span className="lcars-preview-text">
                  LCARS INTERFACE ADAPTED FOR: {currentResponse.ui_configuration.layout.toUpperCase()}
                </span>
                <span className="lcars-preview-priority">
                  PRIORITY: {currentResponse.ui_configuration.priority.toUpperCase()}
                </span>
                <span className="lcars-preview-crew">
                  ACTIVE CREW: {currentResponse.crew_response.crew_member.toUpperCase()}
                </span>
              </div>
            </DynamicLCARSLayout>
          </div>
        </div>
      )}
    </div>
  );
}

