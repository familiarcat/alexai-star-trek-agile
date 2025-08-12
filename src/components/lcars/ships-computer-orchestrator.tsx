'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  ComputerDesktopIcon,
  CpuChipIcon,
  HeartIcon,
  ChartBarIcon,
  CogIcon,
  SignalIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  BeakerIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { collectiveMemoryEngine } from '@/lib/ai-orchestration-engine';

// AI Agent Interface Definitions
interface AIAgent {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  status: 'active' | 'standby' | 'processing';
  currentTask?: string;
  recommendations: AgentRecommendation[];
}

interface AgentRecommendation {
  id: string;
  type: 'layout' | 'ux' | 'efficiency' | 'emotional' | 'security';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
  timestamp: Date;
}

interface LayoutElement {
  id: string;
  type: 'panel' | 'button' | 'card' | 'sidebar' | 'navigation';
  priority: number;
  responsive: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  functionality: {
    executable: boolean;
    action: string;
    intent: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  };
  aiRecommendations: string[];
}

interface ShipsComputerState {
  agents: AIAgent[];
  layoutElements: LayoutElement[];
  currentIntent: string;
  userContext: {
    device: 'mobile' | 'tablet' | 'desktop';
    screenSize: { width: number; height: number };
    userBehavior: string[];
    emotionalState: 'focused' | 'exploring' | 'efficient' | 'creative';
  };
  recommendations: AgentRecommendation[];
  isProcessing: boolean;
}

// AI Agents Configuration
const AI_AGENTS: AIAgent[] = [
  {
    id: 'ships-computer',
    name: "Ship's Computer",
    role: 'Dynamic Layout Orchestrator',
    expertise: ['layout-optimization', 'content-prioritization', 'responsive-design', 'ai-coordination'],
    status: 'active',
    currentTask: 'Analyzing user intent and orchestrating layout elements',
    recommendations: []
  },
  {
    id: 'commander-data',
    name: 'Commander Data',
    role: 'Efficiency Optimization Specialist',
    expertise: ['performance-analysis', 'workflow-optimization', 'data-driven-decisions', 'logical-reasoning'],
    status: 'active',
    currentTask: 'Optimizing UI efficiency and responsive patterns',
    recommendations: []
  },
  {
    id: 'counselor-troi',
    name: 'Counselor Troi',
    role: 'User Experience & Emotional Intelligence',
    expertise: ['emotional-intelligence', 'user-empathy', 'experience-design', 'behavioral-analysis'],
    status: 'active',
    currentTask: 'Analyzing user emotional state and UX needs',
    recommendations: []
  }
];

// Context Creation
const ShipsComputerContext = createContext<{
  state: ShipsComputerState;
  updateIntent: (intent: string) => void;
  addRecommendation: (agentId: string, recommendation: Omit<AgentRecommendation, 'id' | 'timestamp'>) => void;
  updateLayoutElement: (elementId: string, updates: Partial<LayoutElement>) => void;
  executeAction: (action: string) => Promise<void>;
  getCollectiveInsights: () => Promise<any[]>;
  startMultiAgentCollaboration: (taskType: string, userIntent: string) => Promise<string | null>;
  updateAgentContexts: () => void;
} | null>(null);

// Provider Component
export function ShipsComputerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShipsComputerState>({
    agents: AI_AGENTS,
    layoutElements: [],
    currentIntent: 'Navigate to main bridge',
    userContext: {
      device: 'desktop',
      screenSize: { width: 1920, height: 1080 },
      userBehavior: [],
      emotionalState: 'focused'
    },
    recommendations: [],
    isProcessing: false
  });

  // Responsive detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      
      if (width < 768) device = 'mobile';
      else if (width < 1024) device = 'tablet';
      
      setState(prev => ({
        ...prev,
        userContext: {
          ...prev.userContext,
          device,
          screenSize: { width, height }
        }
      }));
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // AI Agent Coordination
  useEffect(() => {
    const coordinateAgents = async () => {
      setState(prev => ({ ...prev, isProcessing: true }));
      
      try {
        // Ship's Computer analyzes current intent and layout needs
        const shipsComputerAnalysis = await analyzeLayoutNeeds(state.currentIntent, state.userContext);
        
        // Commander Data provides efficiency recommendations
        const dataEfficiencyAnalysis = await analyzeEfficiency(state.layoutElements, state.userContext);
        
        // Counselor Troi provides UX and emotional intelligence insights
        const troiUXAnalysis = await analyzeUserExperience(state.userContext, state.currentIntent);
        
        // Combine all recommendations
        const allRecommendations = [
          ...shipsComputerAnalysis,
          ...dataEfficiencyAnalysis,
          ...troiUXAnalysis
        ];
        
        setState(prev => ({
          ...prev,
          recommendations: allRecommendations,
          isProcessing: false
        }));
      } catch (error) {
        console.warn('AI agent coordination failed:', error);
        setState(prev => ({ ...prev, isProcessing: false }));
      }
    };

    // Only coordinate agents when intent or user context changes significantly
    const shouldCoordinate = state.recommendations.length === 0 || 
                           state.userContext.device !== 'desktop' ||
                           state.currentIntent !== 'Navigate to main bridge';
    
    if (shouldCoordinate) {
      coordinateAgents();
    }
  }, [state.currentIntent, state.userContext.device, state.userContext.screenSize.width, state.userContext.screenSize.height]);

  const updateIntent = (intent: string) => {
    setState(prev => ({ ...prev, currentIntent: intent }));
  };

  const addRecommendation = (agentId: string, recommendation: Omit<AgentRecommendation, 'id' | 'timestamp'>) => {
    const newRecommendation: AgentRecommendation = {
      ...recommendation,
      id: `${agentId}-${Date.now()}`,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      agents: prev.agents.map(agent => 
        agent.id === agentId 
          ? { ...agent, recommendations: [...agent.recommendations, newRecommendation] }
          : agent
      ),
      recommendations: [...prev.recommendations, newRecommendation]
    }));
  };

  const updateLayoutElement = (elementId: string, updates: Partial<LayoutElement>) => {
    setState(prev => ({
      ...prev,
      layoutElements: prev.layoutElements.map(element =>
        element.id === elementId ? { ...element, ...updates } : element
      )
    }));
  };

  const executeAction = async (action: string) => {
    // Log the action for AI analysis
    console.log(`Executing action: ${action}`);
    
    // Update user behavior context
    setState(prev => ({
      ...prev,
      userContext: {
        ...prev.userContext,
        userBehavior: [...prev.userContext.userBehavior, action]
      }
    }));

    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Trigger AI agent analysis of the action
    addRecommendation('ships-computer', {
      type: 'layout',
      priority: 'medium',
      title: 'Action Executed',
      description: `User executed action: ${action}`,
      action: 'analyze_user_behavior',
      impact: 'positive'
    });
  };

  // ========================================
  // COLLECTIVE MEMORY INTEGRATION
  // ========================================
  
  /**
   * Get insights from collective memory for all agents
   */
  const getCollectiveInsights = useCallback(async () => {
    try {
      const agents = collectiveMemoryEngine.getAllAgents();
      const insights = await Promise.all(
        agents.map(async (agent) => {
          const agentInsights = await collectiveMemoryEngine.getAgentInsights(
            agent.id,
            agent.currentContext
          );
          return { agent, insights: agentInsights };
        })
      );
      
      console.log('🧠 Collective insights gathered for all agents:', insights);
      return insights;
    } catch (error) {
      console.error('Error getting collective insights:', error);
      return [];
    }
  }, []);

  /**
   * Start multi-agent collaboration for complex tasks
   */
  const startMultiAgentCollaboration = useCallback(async (taskType: string, userIntent: string) => {
    try {
      const agents = ['ship_computer', 'commander_data', 'counselor_troi'];
      const sessionId = await collectiveMemoryEngine.startCollaboration(
        agents,
        taskType,
        userIntent,
        {
          screenSize: 'desktop',
          userIntent,
          userContext: 'collaboration',
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
      
      console.log('🤝 Multi-agent collaboration started:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Error starting multi-agent collaboration:', error);
      return null;
    }
  }, []);

  /**
   * Update agent contexts based on current system state
   */
  const updateAgentContexts = useCallback(() => {
    try {
      const agents = collectiveMemoryEngine.getAllAgents();
      agents.forEach(agent => {
        collectiveMemoryEngine.updateAgentContext(agent.id, {
          screenSize: 'desktop',
          userIntent: 'system_monitoring',
          userContext: 'orchestration',
          currentPage: '/'
        });
      });
      
      console.log('🔄 Agent contexts updated');
    } catch (error) {
      console.error('Error updating agent contexts:', error);
    }
  }, []);

  return (
    <ShipsComputerContext.Provider value={{
      state,
      updateIntent,
      addRecommendation,
      updateLayoutElement,
      executeAction,
      getCollectiveInsights,
      startMultiAgentCollaboration,
      updateAgentContexts
    }}>
      {children}
    </ShipsComputerContext.Provider>
  );
}

// Hook for using the context
export function useShipsComputer() {
  const context = useContext(ShipsComputerContext);
  if (!context) {
    throw new Error('useShipsComputer must be used within a ShipsComputerProvider');
  }
  return context;
}

// AI Analysis Functions
async function analyzeLayoutNeeds(intent: string, userContext: ShipsComputerState['userContext']): Promise<AgentRecommendation[]> {
  const recommendations: AgentRecommendation[] = [];
  
  // Analyze intent and suggest layout optimizations
  if (intent.includes('navigate') || intent.includes('bridge')) {
    recommendations.push({
      id: 'layout-navigation',
      type: 'layout',
      priority: 'high',
      title: 'Navigation-Focused Layout',
      description: 'Optimize layout for navigation tasks with prominent navigation elements',
      action: 'prioritize_navigation_elements',
      impact: 'high',
      timestamp: new Date()
    });
  }
  
  if (userContext.device === 'mobile') {
    recommendations.push({
      id: 'layout-mobile',
      type: 'layout',
      priority: 'critical',
      title: 'Mobile-First Optimization',
      description: 'Ensure all elements are touch-friendly and properly sized for mobile',
      action: 'optimize_mobile_layout',
      impact: 'critical',
      timestamp: new Date()
    });
  }
  
  return recommendations;
}

async function analyzeEfficiency(layoutElements: LayoutElement[], userContext: ShipsComputerState['userContext']): Promise<AgentRecommendation[]> {
  const recommendations: AgentRecommendation[] = [];
  
  // Analyze layout efficiency
  const nonExecutableElements = layoutElements.filter(el => !el.functionality.executable);
  if (nonExecutableElements.length > 0) {
    recommendations.push({
      id: 'efficiency-executable',
      type: 'efficiency',
      priority: 'high',
      title: 'Non-Executable Elements Detected',
      description: `${nonExecutableElements.length} UI elements lack executable functionality`,
      action: 'implement_executable_functionality',
      impact: 'high',
      timestamp: new Date()
    });
  }
  
  // Responsive efficiency analysis
  if (userContext.device === 'mobile' && layoutElements.some(el => !el.responsive.mobile)) {
    recommendations.push({
      id: 'efficiency-responsive',
      type: 'efficiency',
      priority: 'critical',
      title: 'Mobile Responsiveness Issues',
      description: 'Some elements are not optimized for mobile devices',
      action: 'fix_mobile_responsiveness',
      impact: 'critical',
      timestamp: new Date()
    });
  }
  
  return recommendations;
}

async function analyzeUserExperience(userContext: ShipsComputerState['userContext'], intent: string): Promise<AgentRecommendation[]> {
  const recommendations: AgentRecommendation[] = [];
  
  // Emotional intelligence analysis
  if (userContext.emotionalState === 'efficient') {
    recommendations.push({
      id: 'ux-efficient',
      type: 'ux',
      priority: 'medium',
      title: 'Efficiency-Focused User',
      description: 'User is in efficiency mode - prioritize quick access and streamlined workflows',
      action: 'optimize_for_efficiency',
      impact: 'medium',
      timestamp: new Date()
    });
  }
  
  // Device-specific UX recommendations
  if (userContext.device === 'mobile') {
    recommendations.push({
      id: 'ux-mobile',
      type: 'ux',
      priority: 'high',
      title: 'Mobile UX Optimization',
      description: 'Ensure touch targets are appropriately sized and gestures are intuitive',
      action: 'optimize_mobile_ux',
      impact: 'high',
      timestamp: new Date()
    });
  }
  
  return recommendations;
}

// Main Orchestrator Component
export function ShipsComputerOrchestrator() {
  const { state, updateIntent, executeAction } = useShipsComputer();

  const handleIntentChange = (intent: string) => {
    updateIntent(intent);
  };

  const handleActionExecution = async (action: string) => {
    await executeAction(action);
  };

  return (
    <div className="lcars-panel lcars-panel-secondary">
      <div className="lcars-text-large lcars-text-blue lcars-mb-20">
        SHIP'S COMPUTER ORCHESTRATOR
      </div>
      
      {/* AI Agent Status */}
      <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-3 lcars-gap-15 lcars-mb-20">
        {state.agents.map(agent => (
          <div key={agent.id} className="lcars-card">
            <div className="lcars-text-medium lcars-text-white lcars-mb-10">
              {agent.name}
            </div>
            <div className="lcars-text-small lcars-text-cyan lcars-mb-10">
              {agent.role}
            </div>
            <div className="lcars-text-small lcars-text-white">
              Status: {agent.status}
            </div>
            {agent.currentTask && (
              <div className="lcars-text-small lcars-text-yellow lcars-mt-10">
                {agent.currentTask}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Intent */}
      <div className="lcars-mb-20">
        <div className="lcars-text-medium lcars-text-orange lcars-mb-10">
          CURRENT USER INTENT
        </div>
        <div className="lcars-text-large lcars-text-white">
          {state.currentIntent}
        </div>
      </div>

      {/* User Context */}
      <div className="lcars-mb-20">
        <div className="lcars-text-medium lcars-text-orange lcars-mb-10">
          USER CONTEXT
        </div>
        <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-2 lcars-gap-15">
          <div className="lcars-card">
            <div className="lcars-text-small lcars-text-cyan">Device</div>
            <div className="lcars-text-medium lcars-text-white">{state.userContext.device}</div>
          </div>
          <div className="lcars-card">
            <div className="lcars-text-small lcars-text-cyan">Screen Size</div>
            <div className="lcars-text-medium lcars-text-white">
              {state.userContext.screenSize.width} x {state.userContext.screenSize.height}
            </div>
          </div>
          <div className="lcars-card">
            <div className="lcars-text-small lcars-text-cyan">Emotional State</div>
            <div className="lcars-text-medium lcars-text-white">{state.userContext.emotionalState}</div>
          </div>
          <div className="lcars-card">
            <div className="lcars-text-small lcars-text-cyan">Recent Actions</div>
            <div className="lcars-text-small lcars-text-white">
              {state.userContext.userBehavior.slice(-3).join(', ') || 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="lcars-mb-20">
        <div className="lcars-text-medium lcars-text-orange lcars-mb-10">
          AI RECOMMENDATIONS ({state.recommendations.length})
        </div>
        <div className="lcars-grid lcars-grid-cols-1 lcars-gap-10">
          {state.recommendations.slice(0, 5).map(rec => (
            <div key={rec.id} className="lcars-card">
              <div className="lcars-text-medium lcars-text-white lcars-mb-5">
                {rec.title}
              </div>
              <div className="lcars-text-small lcars-text-cyan lcars-mb-5">
                Priority: {rec.priority.toUpperCase()} | Type: {rec.type.toUpperCase()}
              </div>
              <div className="lcars-text-small lcars-text-white lcars-mb-5">
                {rec.description}
              </div>
              <button
                onClick={() => handleActionExecution(rec.action)}
                className="lcars-button lcars-button-secondary"
              >
                Execute: {rec.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Intent Controls */}
      <div className="lcars-mb-20">
        <div className="lcars-text-medium lcars-text-orange lcars-mb-10">
          CHANGE USER INTENT
        </div>
        <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-2 lcars-gap-10">
          <button
            onClick={() => handleIntentChange('Navigate to main bridge')}
            className="lcars-button lcars-button-primary"
          >
            Navigation Intent
          </button>
          <button
            onClick={() => handleIntentChange('Analyze sensor data')}
            className="lcars-button lcars-button-secondary"
          >
            Analysis Intent
          </button>
          <button
            onClick={() => handleIntentChange('Monitor system status')}
            className="lcars-button lcars-button-success"
          >
            Monitoring Intent
          </button>
          <button
            onClick={() => handleIntentChange('Execute tactical command')}
            className="lcars-button lcars-button-danger"
          >
            Tactical Intent
          </button>
        </div>
      </div>

      {/* Processing Status */}
      {state.isProcessing && (
        <div className="lcars-text-medium lcars-text-yellow">
          AI AGENTS COORDINATING...
        </div>
      )}
    </div>
  );
}
