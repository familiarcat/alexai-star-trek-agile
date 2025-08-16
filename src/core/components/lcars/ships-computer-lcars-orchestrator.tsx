'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { collectiveMemoryService, MissionOrchestration, AgentLearningProfile } from '@/core/supabase-collective-memory';

interface LCARSLayoutConfig {
  theme: string;
  panels: string[];
  data_visualizations: string[];
  priority_indicators: boolean;
  dynamic_elements: boolean;
}

interface ShipComputerState {
  status: 'online' | 'offline' | 'maintenance' | 'emergency';
  current_mission: MissionOrchestration | null;
  active_agents: AgentLearningProfile[];
  lcars_layout: LCARSLayoutConfig;
  system_health: {
    memory_usage: number;
    processing_power: number;
    network_status: string;
    collective_intelligence: number;
  };
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export default function ShipsComputerLCARSOrchestrator() {
  const [shipState, setShipState] = useState<ShipComputerState>({
    status: 'online',
    current_mission: null,
    active_agents: [],
    lcars_layout: {
      theme: 'standard-orange',
      panels: ['System Status', 'Mission Control', 'Agent Coordination', 'Collective Intelligence'],
      data_visualizations: ['System Health', 'Mission Progress', 'Agent Performance', 'Learning Trends'],
      priority_indicators: true,
      dynamic_elements: true
    },
    system_health: {
      memory_usage: 0,
      processing_power: 0,
      network_status: 'stable',
      collective_intelligence: 0
    },
    alerts: []
  });

  const [isOrchestrating, setIsOrchestrating] = useState(false);

  // Initialize Ship's Computer
  useEffect(() => {
    initializeShipComputer();
  }, []);

  const initializeShipComputer = useCallback(async () => {
    try {
      setIsOrchestrating(true);
      
      // Analyze collective intelligence
      const collectiveIntelligence = await collectiveMemoryService.analyzeCollectiveIntelligence();
      
      // Get current active missions
      const activeMissions = await collectiveMemoryService.getMissionRecommendations(['strategic', 'technical', 'analytical']);
      
      // Update ship state
      setShipState(prev => ({
        ...prev,
        system_health: {
          ...prev.system_health,
          collective_intelligence: collectiveIntelligence.overall_success_rate,
          memory_usage: Math.random() * 100,
          processing_power: Math.random() * 100
        },
        current_mission: activeMissions[0] || null
      }));

      // Generate initial LCARS layout
      if (activeMissions[0]) {
        await updateLCARSLayout(activeMissions[0].mission_type, activeMissions[0].priority);
      }

    } catch (error) {
      console.error('Ship Computer initialization failed:', error);
      addAlert('error', 'Ship Computer initialization failed', 'critical');
    } finally {
      setIsOrchestrating(false);
    }
  }, []);

  // Update LCARS layout based on mission context
  const updateLCARSLayout = useCallback(async (missionType: string, priority: string) => {
    try {
      const layoutConfig = await collectiveMemoryService.getLCARSLayoutRecommendations(missionType, priority);
      
      setShipState(prev => ({
        ...prev,
        lcars_layout: layoutConfig
      }));

      addAlert('success', `LCARS layout updated for ${missionType} mission`, 'medium');
    } catch (error) {
      console.error('Failed to update LCARS layout:', error);
      addAlert('error', 'Failed to update LCARS layout', 'high');
    }
  }, []);

  // Add system alert
  const addAlert = useCallback((type: 'info' | 'warning' | 'error' | 'success', message: string, priority: 'low' | 'medium' | 'high' | 'critical') => {
    const newAlert = {
      id: `alert-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      priority
    };

    setShipState(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts.slice(0, 9)] // Keep last 10 alerts
    }));
  }, []);

  // Orchestrate mission execution
  const orchestrateMission = useCallback(async (mission: MissionOrchestration) => {
    try {
      setIsOrchestrating(true);
      
      // Update mission status to active
      await collectiveMemoryService.updateMissionProgress(mission.mission_id, 0, 'active');
      
      // Update LCARS layout for mission
      await updateLCARSLayout(mission.mission_type, mission.priority);
      
      // Update ship state
      setShipState(prev => ({
        ...prev,
        current_mission: mission,
        status: mission.priority === 'critical' ? 'emergency' : 'online'
      }));

      addAlert('info', `Mission ${mission.mission_id} initiated`, 'medium');
      
    } catch (error) {
      console.error('Mission orchestration failed:', error);
      addAlert('error', 'Mission orchestration failed', 'critical');
    } finally {
      setIsOrchestrating(false);
    }
  }, [updateLCARSLayout]);

  // Monitor mission progress
  useEffect(() => {
    if (!shipState.current_mission) return;

    const progressInterval = setInterval(async () => {
      try {
        // Simulate progress update (in real implementation, this would come from actual mission execution)
        const currentProgress = shipState.current_mission?.current_progress || 0;
        const newProgress = Math.min(currentProgress + Math.random() * 10, 100);
        
        if (shipState.current_mission) {
          await collectiveMemoryService.updateMissionProgress(
            shipState.current_mission.mission_id,
            newProgress,
            newProgress === 100 ? 'completed' : 'active'
          );

          setShipState(prev => ({
            ...prev,
            current_mission: prev.current_mission ? {
              ...prev.current_mission,
              current_progress: newProgress
            } : null
          }));

          if (newProgress === 100) {
            addAlert('success', `Mission ${shipState.current_mission.mission_id} completed!`, 'high');
          }
        }
      } catch (error) {
        console.error('Progress monitoring failed:', error);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(progressInterval);
  }, [shipState.current_mission]);

  // Get theme-specific CSS classes
  const getThemeClasses = (theme: string) => {
    const themeClasses = {
      'emergency-red': 'lcars-emergency-red',
      'standard-orange': 'lcars-standard-orange',
      'success-green': 'lcars-success-green',
      'tactical-blue': 'lcars-tactical-blue'
    };
    return themeClasses[theme as keyof typeof themeClasses] || 'lcars-standard-orange';
  };

  return (
    <div className={`ships-computer-orchestrator ${getThemeClasses(shipState.lcars_layout.theme)}`}>
      {/* Ship's Computer Header */}
      <div className="lcars-header">
        <div className="lcars-title">
          <h1>🖖 SHIP'S COMPUTER - LCARS ORCHESTRATOR</h1>
          <div className="lcars-status">
            <span className={`status-indicator status-${shipState.status}`}>
              {shipState.status.toUpperCase()}
            </span>
            <span className="stardate">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* System Health Dashboard */}
      <div className="lcars-panel system-health">
        <h2>SYSTEM HEALTH</h2>
        <div className="health-metrics">
          <div className="metric">
            <label>Memory Usage</label>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${shipState.system_health.memory_usage}%` }}
              ></div>
            </div>
            <span>{shipState.system_health.memory_usage.toFixed(1)}%</span>
          </div>
          <div className="metric">
            <label>Processing Power</label>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${shipState.system_health.processing_power}%` }}
              ></div>
            </div>
            <span>{shipState.system_health.processing_power.toFixed(1)}%</span>
          </div>
          <div className="metric">
            <label>Collective Intelligence</label>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${shipState.system_health.collective_intelligence}%` }}
              ></div>
            </div>
            <span>{shipState.system_health.collective_intelligence.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Mission Control */}
      <div className="lcars-panel mission-control">
        <h2>MISSION CONTROL</h2>
        {shipState.current_mission ? (
          <div className="mission-status">
            <div className="mission-header">
              <h3>{shipState.current_mission.mission_type.toUpperCase()}</h3>
              <span className={`priority priority-${shipState.current_mission.priority}`}>
                {shipState.current_mission.priority.toUpperCase()}
              </span>
            </div>
            <div className="mission-progress">
              <label>Progress: {shipState.current_mission.current_progress}%</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${shipState.current_mission.current_progress}%` }}
                ></div>
              </div>
            </div>
            <div className="mission-details">
              <p><strong>Status:</strong> {shipState.current_mission.status}</p>
              <p><strong>Agents:</strong> {shipState.current_mission.assigned_agents.join(', ')}</p>
              <p><strong>Estimated Completion:</strong> {shipState.current_mission.estimated_completion}</p>
            </div>
          </div>
        ) : (
          <div className="no-mission">
            <p>No active mission</p>
            <button 
              className="lcars-button"
              onClick={() => initializeShipComputer()}
              disabled={isOrchestrating}
            >
              {isOrchestrating ? 'Initializing...' : 'Initialize Mission'}
            </button>
          </div>
        )}
      </div>

      {/* LCARS Layout Configuration */}
      <div className="lcars-panel lcars-config">
        <h2>LCARS LAYOUT CONFIGURATION</h2>
        <div className="layout-details">
          <div className="config-item">
            <label>Theme:</label>
            <span className="theme-display">{shipState.lcars_layout.theme}</span>
          </div>
          <div className="config-item">
            <label>Panels:</label>
            <div className="panels-list">
              {shipState.lcars_layout.panels.map((panel, index) => (
                <span key={index} className="panel-tag">{panel}</span>
              ))}
            </div>
          </div>
          <div className="config-item">
            <label>Data Visualizations:</label>
            <div className="visualizations-list">
              {shipState.lcars_layout.data_visualizations.map((viz, index) => (
                <span key={index} className="viz-tag">{viz}</span>
              ))}
            </div>
          </div>
          <div className="config-item">
            <label>Priority Indicators:</label>
            <span className={`indicator ${shipState.lcars_layout.priority_indicators ? 'enabled' : 'disabled'}`}>
              {shipState.lcars_layout.priority_indicators ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          <div className="config-item">
            <label>Dynamic Elements:</label>
            <span className={`indicator ${shipState.lcars_layout.dynamic_elements ? 'enabled' : 'disabled'}`}>
              {shipState.lcars_layout.dynamic_elements ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="lcars-panel alerts">
        <h2>SYSTEM ALERTS</h2>
        <div className="alerts-list">
          {shipState.alerts.length > 0 ? (
            shipState.alerts.map((alert) => (
              <div key={alert.id} className={`alert alert-${alert.type} priority-${alert.priority}`}>
                <div className="alert-header">
                  <span className="alert-type">{alert.type.toUpperCase()}</span>
                  <span className="alert-priority">{alert.priority.toUpperCase()}</span>
                  <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="alert-message">{alert.message}</p>
              </div>
            ))
          ) : (
            <p className="no-alerts">No active alerts</p>
          )}
        </div>
      </div>

      {/* Orchestration Controls */}
      <div className="lcars-panel controls">
        <h2>ORCHESTRATION CONTROLS</h2>
        <div className="control-buttons">
          <button 
            className="lcars-button primary"
            onClick={() => initializeShipComputer()}
            disabled={isOrchestrating}
          >
            {isOrchestrating ? '🔄 ORCHESTRATING...' : '🚀 INITIALIZE SYSTEM'}
          </button>
          <button 
            className="lcars-button secondary"
            onClick={() => updateLCARSLayout('functionality', 'high')}
          >
            🎨 UPDATE LAYOUT
          </button>
          <button 
            className="lcars-button secondary"
            onClick={() => addAlert('info', 'Test alert generated', 'low')}
          >
            🧪 TEST ALERT
          </button>
        </div>
      </div>
    </div>
  );
}
