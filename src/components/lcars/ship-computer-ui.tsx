import React, { useState, useEffect } from 'react';
import { DynamicLCARSLayout } from './dynamic-lcars-layout';

interface MissionData {
  query: string;
  context: string;
  userRole: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'low' | 'medium' | 'high' | 'critical';
  mission: string;
}

interface ShipComputerResponse {
  success: boolean;
  shipComputer: {
    status: string;
    mission: string;
    crew: number;
    priority: string;
  };
  missionPlan: {
    priority: string;
    uiLayout: string;
    requiredCrew: string[];
    interfaceElements: {
      missionStatus: boolean;
      crewHighlights: boolean;
      priorityIndicator: boolean;
      dynamicPanels: boolean;
    };
  };
  uiConfiguration: {
    layout: string;
    priority: string;
    mission: string;
    crew: {
      active: string[];
      highlights: Array<{
        name: string;
        status: string;
        contribution: string;
      }>;
    };
    lcars: {
      theme: string;
      animation: string;
      layout: string;
    };
  };
  systemStatus: {
    lcars_system: string;
    ship_computer: string;
    crew_coordination: string;
    ui_orchestration: string;
    llm_orchestration: string;
    mission_priority: string;
    active_crew: number;
  };
}

export const ShipComputerUI: React.FC = () => {
  const [missionData, setMissionData] = useState<MissionData>({
    query: '',
    context: '',
    userRole: 'captain',
    urgency: 'medium',
    complexity: 'medium',
    mission: ''
  });

  const [shipResponse, setShipResponse] = useState<ShipComputerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'mission' | 'crew' | 'ui' | 'status'>('mission');

  const handleMissionSubmit = async () => {
    if (!missionData.query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://n8n.pbradygeorgen.com/webhook/ship-agency-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(missionData),
      });
      
      const data = await response.json();
      setShipResponse(data);
    } catch (error) {
      console.error('Mission submission failed:', error);
      // Fallback to simulated response for demo
      setShipResponse(generateSimulatedResponse(missionData));
    } finally {
      setIsLoading(false);
    }
  };

  const generateSimulatedResponse = (data: MissionData): ShipComputerResponse => {
    const priority = data.urgency === 'critical' || data.complexity === 'critical' ? 'critical' :
                    data.urgency === 'high' || data.complexity === 'high' ? 'high' :
                    data.urgency === 'low' && data.complexity === 'low' ? 'low' : 'medium';
    
    const uiLayout = priority === 'critical' ? 'emergency-lcars' :
                     priority === 'high' ? 'tactical-lcars' :
                     priority === 'low' ? 'minimal-lcars' : 'standard-lcars';
    
    const requiredCrew = getCrewForContext(data.context);
    
    return {
      success: true,
      shipComputer: {
        status: 'ONLINE',
        mission: data.mission || 'Dynamic Mission',
        crew: requiredCrew.length,
        priority
      },
      missionPlan: {
        priority,
        uiLayout,
        requiredCrew,
        interfaceElements: {
          missionStatus: true,
          crewHighlights: true,
          priorityIndicator: true,
          dynamicPanels: data.complexity !== 'low'
        }
      },
      uiConfiguration: {
        layout: uiLayout,
        priority,
        mission: data.mission || 'Dynamic Mission',
        crew: {
          active: requiredCrew,
          highlights: requiredCrew.map(crew => ({
            name: crew,
            status: 'active',
            contribution: `Simulated response from ${crew} for ${data.query.substring(0, 50)}...`
          }))
        },
        lcars: {
          theme: priority === 'critical' ? 'emergency-red' : 'standard-orange',
          animation: priority === 'high' ? 'pulse' : 'standard',
          layout: uiLayout
        }
      },
      systemStatus: {
        lcars_system: 'ONLINE',
        ship_computer: 'OPERATIONAL',
        crew_coordination: 'ACTIVE',
        ui_orchestration: 'DYNAMIC',
        llm_orchestration: 'OPTIMIZED',
        mission_priority: priority,
        active_crew: requiredCrew.length
      }
    };
  };

  const getCrewForContext = (context: string): string[] => {
    const crewCapabilities = {
      'strategic': ['captain-picard', 'commander-spock'],
      'technical': ['lieutenant-data', 'chief-engineer-scott'],
      'emotional': ['counselor-troi'],
      'tactical': ['lieutenant-worf'],
      'analytical': ['observation-lounge', 'lieutenant-data']
    };
    
    let requiredCrew: string[] = [];
    if (context.includes('strategy') || context.includes('leadership')) {
      requiredCrew.push(...crewCapabilities.strategic);
    }
    if (context.includes('technical') || context.includes('engineering')) {
      requiredCrew.push(...crewCapabilities.technical);
    }
    if (context.includes('emotional') || context.includes('counseling')) {
      requiredCrew.push(...crewCapabilities.emotional);
    }
    if (context.includes('tactical') || context.includes('security')) {
      requiredCrew.push(...crewCapabilities.tactical);
    }
    if (context.includes('analysis') || context.includes('research')) {
      requiredCrew.push(...crewCapabilities.analytical);
    }
    
    return requiredCrew.length > 0 ? requiredCrew : ['captain-picard', 'lieutenant-data'];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#ffaa00';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '✅';
      default: return '⚡';
    }
  };

  return (
    <div className="ship-computer-ui">
      <div className="ship-computer-header">
        <h1>🖥️ Ship's Computer Interface</h1>
        <div className="ship-status">
          <span className="status-indicator online">ONLINE</span>
          <span className="status-text">Ship's Computer Operational</span>
        </div>
      </div>

      <div className="mission-control-panel">
        <h2>🎯 Mission Control</h2>
        <div className="mission-form">
          <div className="form-row">
            <div className="form-group">
              <label>Mission Query:</label>
              <input
                type="text"
                value={missionData.query}
                onChange={(e) => setMissionData({...missionData, query: e.target.value})}
                placeholder="Describe your mission..."
                className="lcars-input"
              />
            </div>
            <div className="form-group">
              <label>Mission Name:</label>
              <input
                type="text"
                value={missionData.mission}
                onChange={(e) => setMissionData({...missionData, mission: e.target.value})}
                placeholder="Mission identifier..."
                className="lcars-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Context Keywords:</label>
              <input
                type="text"
                value={missionData.context}
                onChange={(e) => setMissionData({...missionData, context: e.target.value})}
                placeholder="strategy, technical, tactical, emotional..."
                className="lcars-input"
              />
            </div>
            <div className="form-group">
              <label>User Role:</label>
              <select
                value={missionData.userRole}
                onChange={(e) => setMissionData({...missionData, userRole: e.target.value})}
                className="lcars-select"
              >
                <option value="captain">Captain</option>
                <option value="engineer">Engineer</option>
                <option value="scientist">Scientist</option>
                <option value="security">Security</option>
                <option value="counselor">Counselor</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Urgency:</label>
              <select
                value={missionData.urgency}
                onChange={(e) => setMissionData({...missionData, urgency: e.target.value as any})}
                className="lcars-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Complexity:</label>
              <select
                value={missionData.complexity}
                onChange={(e) => setMissionData({...missionData, complexity: e.target.value as any})}
                className="lcars-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleMissionSubmit}
            disabled={isLoading || !missionData.query.trim()}
            className="lcars-button mission-submit"
          >
            {isLoading ? '🔄 Processing...' : '🚀 Launch Mission'}
          </button>
        </div>
      </div>

      {shipResponse && (
        <div className="ship-response-panel">
          <div className="response-tabs">
            <button
              className={`tab-button ${activeTab === 'mission' ? 'active' : ''}`}
              onClick={() => setActiveTab('mission')}
            >
              🎯 Mission Plan
            </button>
            <button
              className={`tab-button ${activeTab === 'crew' ? 'active' : ''}`}
              onClick={() => setActiveTab('crew')}
            >
              👥 Crew Analysis
            </button>
            <button
              className={`tab-button ${activeTab === 'ui' ? 'active' : ''}`}
              onClick={() => setActiveTab('ui')}
            >
              🖥️ UI Configuration
            </button>
            <button
              className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveTab('status')}
            >
              📊 System Status
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'mission' && (
              <div className="mission-plan-tab">
                <h3>Mission Plan</h3>
                <div className="mission-details">
                  <div className="mission-priority">
                    <span className="priority-label">Priority:</span>
                    <span 
                      className="priority-value"
                      style={{ color: getPriorityColor(shipResponse.missionPlan.priority) }}
                    >
                      {getPriorityIcon(shipResponse.missionPlan.priority)} {shipResponse.missionPlan.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="mission-layout">
                    <span className="layout-label">UI Layout:</span>
                    <span className="layout-value">{shipResponse.missionPlan.uiLayout}</span>
                  </div>
                  <div className="crew-requirements">
                    <span className="crew-label">Required Crew:</span>
                    <div className="crew-list">
                      {shipResponse.missionPlan.requiredCrew.map(crew => (
                        <span key={crew} className="crew-member">{crew}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'crew' && (
              <div className="crew-analysis-tab">
                <h3>Crew Analysis</h3>
                <div className="crew-highlights">
                  {shipResponse.uiConfiguration.crew.highlights.map(crew => (
                    <div key={crew.name} className="crew-highlight">
                      <div className="crew-name">{crew.name}</div>
                      <div className="crew-status">{crew.status}</div>
                      <div className="crew-contribution">{crew.contribution}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ui' && (
              <div className="ui-configuration-tab">
                <h3>UI Configuration</h3>
                <div className="ui-details">
                  <div className="ui-layout">
                    <span className="layout-label">Layout:</span>
                    <span className="layout-value">{shipResponse.uiConfiguration.layout}</span>
                  </div>
                  <div className="ui-theme">
                    <span className="theme-label">Theme:</span>
                    <span className="theme-value">{shipResponse.uiConfiguration.lcars.theme}</span>
                  </div>
                  <div className="ui-animation">
                    <span className="animation-label">Animation:</span>
                    <span className="animation-value">{shipResponse.uiConfiguration.lcars.animation}</span>
                  </div>
                </div>
                
                {/* Dynamic LCARS Layout Preview */}
                <div className="lcars-preview">
                  <h4>LCARS Layout Preview</h4>
                  <DynamicLCARSLayout
                    layout={shipResponse.uiConfiguration.layout}
                    priority={shipResponse.uiConfiguration.priority}
                    mission={shipResponse.uiConfiguration.mission}
                    crew={shipResponse.uiConfiguration.crew.active}
                    theme={shipResponse.uiConfiguration.lcars.theme}
                    animation={shipResponse.uiConfiguration.lcars.animation}
                  />
                </div>
              </div>
            )}

            {activeTab === 'status' && (
              <div className="system-status-tab">
                <h3>System Status</h3>
                <div className="status-grid">
                  {Object.entries(shipResponse.systemStatus).map(([key, value]) => (
                    <div key={key} className="status-item">
                      <span className="status-key">{key.replace(/_/g, ' ').toUpperCase()}</span>
                      <span className="status-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
