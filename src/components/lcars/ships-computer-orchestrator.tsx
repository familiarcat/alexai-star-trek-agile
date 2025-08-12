import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types for the Ship's Computer orchestration system
interface UserIntent {
  id: string;
  type: 'navigation' | 'analysis' | 'command' | 'monitoring' | 'communication' | 'research';
  priority: 'critical' | 'high' | 'medium' | 'low';
  context: string;
  emotionalState?: 'stressed' | 'focused' | 'relaxed' | 'alert';
  timestamp: Date;
}

interface LayoutConfiguration {
  id: string;
  name: string;
  description: string;
  gridTemplate: string;
  components: LayoutComponent[];
  colorScheme: ColorScheme;
  interactionPatterns: InteractionPattern[];
  accessibility: AccessibilityConfig;
}

interface LayoutComponent {
  id: string;
  type: 'navigation' | 'data-display' | 'action-panel' | 'status-indicator' | 'communication' | 'analysis';
  position: { x: number; y: number; width: number; height: number };
  priority: number;
  content: any;
  adaptive: boolean;
}

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  warning: string;
  error: string;
  success: string;
  background: string;
  text: string;
}

interface InteractionPattern {
  type: 'gesture' | 'voice' | 'touch' | 'keyboard';
  action: string;
  feedback: string;
  accessibility: boolean;
}

interface AccessibilityConfig {
  highContrast: boolean;
  largeText: boolean;
  voiceCommands: boolean;
  gestureSupport: boolean;
  keyboardNavigation: boolean;
}

interface ShipsComputerState {
  currentIntent: UserIntent | null;
  activeLayout: LayoutConfiguration | null;
  userPreferences: UserPreferences;
  systemStatus: SystemStatus;
  crewRecommendations: CrewRecommendation[];
  adaptiveHistory: AdaptiveHistory[];
}

interface UserPreferences {
  interactionMode: 'standard' | 'accessibility' | 'expert';
  colorScheme: 'standard' | 'high-contrast' | 'colorblind-friendly';
  layoutDensity: 'compact' | 'standard' | 'spacious';
  voiceCommands: boolean;
  gestureSupport: boolean;
}

interface SystemStatus {
  performance: 'optimal' | 'good' | 'degraded' | 'critical';
  load: number;
  responseTime: number;
  errors: string[];
}

interface CrewRecommendation {
  crewMember: string;
  recommendation: string;
  priority: number;
  timestamp: Date;
  implemented: boolean;
}

interface AdaptiveHistory {
  timestamp: Date;
  intent: UserIntent;
  layout: LayoutConfiguration;
  performance: number;
  userSatisfaction: number;
}

// Action types for the reducer
type ShipsComputerAction =
  | { type: 'SET_USER_INTENT'; payload: UserIntent }
  | { type: 'UPDATE_LAYOUT'; payload: LayoutConfiguration }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'ADD_CREW_RECOMMENDATION'; payload: CrewRecommendation }
  | { type: 'UPDATE_SYSTEM_STATUS'; payload: Partial<SystemStatus> }
  | { type: 'RECORD_ADAPTIVE_HISTORY'; payload: AdaptiveHistory }
  | { type: 'IMPLEMENT_RECOMMENDATION'; payload: string };

// Initial state
const initialState: ShipsComputerState = {
  currentIntent: null,
  activeLayout: null,
  userPreferences: {
    interactionMode: 'standard',
    colorScheme: 'standard',
    layoutDensity: 'standard',
    voiceCommands: false,
    gestureSupport: false
  },
  systemStatus: {
    performance: 'optimal',
    load: 0.3,
    responseTime: 150,
    errors: []
  },
  crewRecommendations: [],
  adaptiveHistory: []
};

// Reducer function
function shipsComputerReducer(state: ShipsComputerState, action: ShipsComputerAction): ShipsComputerState {
  switch (action.type) {
    case 'SET_USER_INTENT':
      return {
        ...state,
        currentIntent: action.payload
      };
    
    case 'UPDATE_LAYOUT':
      return {
        ...state,
        activeLayout: action.payload
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload }
      };
    
    case 'ADD_CREW_RECOMMENDATION':
      return {
        ...state,
        crewRecommendations: [...state.crewRecommendations, action.payload]
      };
    
    case 'UPDATE_SYSTEM_STATUS':
      return {
        ...state,
        systemStatus: { ...state.systemStatus, ...action.payload }
      };
    
    case 'RECORD_ADAPTIVE_HISTORY':
      return {
        ...state,
        adaptiveHistory: [...state.adaptiveHistory, action.payload]
      };
    
    case 'IMPLEMENT_RECOMMENDATION':
      return {
        ...state,
        crewRecommendations: state.crewRecommendations.map(rec =>
          rec.crewMember === action.payload ? { ...rec, implemented: true } : rec
        )
      };
    
    default:
      return state;
  }
}

// Context
const ShipsComputerContext = createContext<{
  state: ShipsComputerState;
  dispatch: React.Dispatch<ShipsComputerAction>;
  analyzeUserIntent: (context: string, emotionalState?: string) => UserIntent;
  generateOptimalLayout: (intent: UserIntent) => LayoutConfiguration;
  getCrewRecommendations: () => CrewRecommendation[];
  implementRecommendation: (crewMember: string) => void;
} | null>(null);

// Hook to use the Ship's Computer
export const useShipsComputer = () => {
  const context = useContext(ShipsComputerContext);
  if (!context) {
    throw new Error('useShipsComputer must be used within a ShipsComputerProvider');
  }
  return context;
};

// Layout configurations based on Okuda's principles
const layoutConfigurations: Record<string, LayoutConfiguration> = {
  navigation: {
    id: 'navigation',
    name: 'Navigation Station',
    description: 'Primary navigation and command interface',
    gridTemplate: 'grid-template-areas: "nav nav nav" "main main side" "status status status"',
    components: [
      {
        id: 'nav-panel',
        type: 'navigation',
        position: { x: 0, y: 0, width: 3, height: 1 },
        priority: 1,
        content: { type: 'navigation-panel' },
        adaptive: true
      },
      {
        id: 'main-display',
        type: 'data-display',
        position: { x: 0, y: 1, width: 2, height: 1 },
        priority: 2,
        content: { type: 'main-display' },
        adaptive: true
      },
      {
        id: 'side-panel',
        type: 'action-panel',
        position: { x: 2, y: 1, width: 1, height: 1 },
        priority: 3,
        content: { type: 'action-panel' },
        adaptive: true
      },
      {
        id: 'status-bar',
        type: 'status-indicator',
        position: { x: 0, y: 2, width: 3, height: 1 },
        priority: 4,
        content: { type: 'status-bar' },
        adaptive: false
      }
    ],
    colorScheme: {
      primary: '#FF9C00',
      secondary: '#6699CC',
      accent: '#CC99CC',
      warning: '#CCCC66',
      error: '#CC6666',
      success: '#66CC66',
      background: '#000000',
      text: '#FFFFFF'
    },
    interactionPatterns: [
      {
        type: 'touch',
        action: 'swipe',
        feedback: 'haptic',
        accessibility: true
      },
      {
        type: 'voice',
        action: 'command',
        feedback: 'audio',
        accessibility: true
      }
    ],
    accessibility: {
      highContrast: false,
      largeText: false,
      voiceCommands: true,
      gestureSupport: true,
      keyboardNavigation: true
    }
  },
  
  analysis: {
    id: 'analysis',
    name: 'Analysis Station',
    description: 'Data analysis and research interface',
    gridTemplate: 'grid-template-areas: "tools data" "chart chart" "results results"',
    components: [
      {
        id: 'analysis-tools',
        type: 'action-panel',
        position: { x: 0, y: 0, width: 1, height: 1 },
        priority: 1,
        content: { type: 'analysis-tools' },
        adaptive: true
      },
      {
        id: 'data-panel',
        type: 'data-display',
        position: { x: 1, y: 0, width: 1, height: 1 },
        priority: 2,
        content: { type: 'data-panel' },
        adaptive: true
      },
      {
        id: 'chart-area',
        type: 'data-display',
        position: { x: 0, y: 1, width: 2, height: 1 },
        priority: 3,
        content: { type: 'chart-area' },
        adaptive: true
      },
      {
        id: 'results-panel',
        type: 'analysis',
        position: { x: 0, y: 2, width: 2, height: 1 },
        priority: 4,
        content: { type: 'results-panel' },
        adaptive: true
      }
    ],
    colorScheme: {
      primary: '#CC99CC',
      secondary: '#6699CC',
      accent: '#66CC66',
      warning: '#CCCC66',
      error: '#CC6666',
      success: '#66CC66',
      background: '#000000',
      text: '#FFFFFF'
    },
    interactionPatterns: [
      {
        type: 'touch',
        action: 'pinch-zoom',
        feedback: 'visual',
        accessibility: true
      },
      {
        type: 'keyboard',
        action: 'shortcuts',
        feedback: 'audio',
        accessibility: true
      }
    ],
    accessibility: {
      highContrast: false,
      largeText: false,
      voiceCommands: true,
      gestureSupport: true,
      keyboardNavigation: true
    }
  },
  
  monitoring: {
    id: 'monitoring',
    name: 'Monitoring Station',
    description: 'System monitoring and status interface',
    gridTemplate: 'grid-template-areas: "alerts alerts" "systems systems" "logs logs"',
    components: [
      {
        id: 'alert-panel',
        type: 'status-indicator',
        position: { x: 0, y: 0, width: 2, height: 1 },
        priority: 1,
        content: { type: 'alert-panel' },
        adaptive: true
      },
      {
        id: 'systems-panel',
        type: 'data-display',
        position: { x: 0, y: 1, width: 2, height: 1 },
        priority: 2,
        content: { type: 'systems-panel' },
        adaptive: true
      },
      {
        id: 'log-panel',
        type: 'data-display',
        position: { x: 0, y: 2, width: 2, height: 1 },
        priority: 3,
        content: { type: 'log-panel' },
        adaptive: true
      }
    ],
    colorScheme: {
      primary: '#6699CC',
      secondary: '#66CC66',
      accent: '#CCCC66',
      warning: '#CCCC66',
      error: '#CC6666',
      success: '#66CC66',
      background: '#000000',
      text: '#FFFFFF'
    },
    interactionPatterns: [
      {
        type: 'touch',
        action: 'tap',
        feedback: 'visual',
        accessibility: true
      },
      {
        type: 'voice',
        action: 'status-query',
        feedback: 'audio',
        accessibility: true
      }
    ],
    accessibility: {
      highContrast: false,
      largeText: false,
      voiceCommands: true,
      gestureSupport: true,
      keyboardNavigation: true
    }
  }
};

// Provider component
interface ShipsComputerProviderProps {
  children: ReactNode;
}

export const ShipsComputerProvider: React.FC<ShipsComputerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(shipsComputerReducer, initialState);

  // Analyze user intent using Counselor Troi's emotional intelligence
  const analyzeUserIntent = (context: string, emotionalState?: string): UserIntent => {
    const intentTypes = ['navigation', 'analysis', 'command', 'monitoring', 'communication', 'research'];
    const priorities = ['critical', 'high', 'medium', 'low'];
    
    // Simple intent analysis based on context keywords
    let type: UserIntent['type'] = 'navigation';
    let priority: UserIntent['priority'] = 'medium';
    
    if (context.toLowerCase().includes('analyze') || context.toLowerCase().includes('research')) {
      type = 'analysis';
    } else if (context.toLowerCase().includes('command') || context.toLowerCase().includes('control')) {
      type = 'command';
    } else if (context.toLowerCase().includes('monitor') || context.toLowerCase().includes('status')) {
      type = 'monitoring';
    } else if (context.toLowerCase().includes('communicate') || context.toLowerCase().includes('message')) {
      type = 'communication';
    }
    
    if (context.toLowerCase().includes('urgent') || context.toLowerCase().includes('critical')) {
      priority = 'critical';
    } else if (context.toLowerCase().includes('important')) {
      priority = 'high';
    }
    
    const intent: UserIntent = {
      id: `intent-${Date.now()}`,
      type,
      priority,
      context,
      emotionalState: emotionalState as UserIntent['emotionalState'],
      timestamp: new Date()
    };
    
    dispatch({ type: 'SET_USER_INTENT', payload: intent });
    return intent;
  };

  // Generate optimal layout using Commander Data's efficiency analysis
  const generateOptimalLayout = (intent: UserIntent): LayoutConfiguration => {
    let layoutKey = 'navigation';
    
    switch (intent.type) {
      case 'analysis':
      case 'research':
        layoutKey = 'analysis';
        break;
      case 'monitoring':
        layoutKey = 'monitoring';
        break;
      default:
        layoutKey = 'navigation';
    }
    
    const baseLayout = layoutConfigurations[layoutKey];
    
    // Adapt layout based on user preferences and emotional state
    const adaptedLayout: LayoutConfiguration = {
      ...baseLayout,
      id: `${baseLayout.id}-${Date.now()}`,
      accessibility: {
        ...baseLayout.accessibility,
        highContrast: state.userPreferences.colorScheme === 'high-contrast',
        largeText: state.userPreferences.layoutDensity === 'spacious',
        voiceCommands: state.userPreferences.voiceCommands,
        gestureSupport: state.userPreferences.gestureSupport
      }
    };
    
    dispatch({ type: 'UPDATE_LAYOUT', payload: adaptedLayout });
    return adaptedLayout;
  };

  // Get crew recommendations
  const getCrewRecommendations = (): CrewRecommendation[] => {
    return state.crewRecommendations.filter(rec => !rec.implemented);
  };

  // Implement crew recommendation
  const implementRecommendation = (crewMember: string) => {
    dispatch({ type: 'IMPLEMENT_RECOMMENDATION', payload: crewMember });
  };

  // Simulate crew recommendations
  useEffect(() => {
    const crewRecommendations: CrewRecommendation[] = [
      {
        crewMember: 'Counselor Troi',
        recommendation: 'Adapt interface based on user emotional state for better engagement',
        priority: 1,
        timestamp: new Date(),
        implemented: false
      },
      {
        crewMember: 'Commander Data',
        recommendation: 'Optimize layout efficiency for faster task completion',
        priority: 2,
        timestamp: new Date(),
        implemented: false
      },
      {
        crewMember: 'Ship\'s Computer',
        recommendation: 'Implement predictive layout changes based on user behavior',
        priority: 3,
        timestamp: new Date(),
        implemented: false
      }
    ];
    
    crewRecommendations.forEach(rec => {
      dispatch({ type: 'ADD_CREW_RECOMMENDATION', payload: rec });
    });
  }, []);

  const value = {
    state,
    dispatch,
    analyzeUserIntent,
    generateOptimalLayout,
    getCrewRecommendations,
    implementRecommendation
  };

  return (
    <ShipsComputerContext.Provider value={value}>
      {children}
    </ShipsComputerContext.Provider>
  );
};

// Main orchestrator component
export const ShipsComputerOrchestrator: React.FC = () => {
  const { state, analyzeUserIntent, generateOptimalLayout, getCrewRecommendations, implementRecommendation } = useShipsComputer();

  const handleUserInteraction = (context: string) => {
    const intent = analyzeUserIntent(context);
    const layout = generateOptimalLayout(intent);
    
    console.log('Ship\'s Computer: Analyzing user intent...', intent);
    console.log('Ship\'s Computer: Generating optimal layout...', layout);
  };

  return (
    <div className="lcars-ships-computer">
      <div className="lcars-panel lcars-p-20">
        <div className="lcars-text-xlarge lcars-text-gold lcars-mb-20">
          SHIP'S COMPUTER ORCHESTRATOR
        </div>
        
        <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-2 lcars-gap-20">
          {/* Current Intent Display */}
          <div className="lcars-panel lcars-p-15">
            <div className="lcars-text-large lcars-text-orange lcars-mb-10">
              CURRENT USER INTENT
            </div>
            {state.currentIntent ? (
              <div className="lcars-text-medium lcars-text-white">
                <div>Type: {state.currentIntent.type}</div>
                <div>Priority: {state.currentIntent.priority}</div>
                <div>Context: {state.currentIntent.context}</div>
                {state.currentIntent.emotionalState && (
                  <div>Emotional State: {state.currentIntent.emotionalState}</div>
                )}
              </div>
            ) : (
              <div className="lcars-text-medium lcars-text-white">
                No active intent detected
              </div>
            )}
          </div>
          
          {/* Active Layout Display */}
          <div className="lcars-panel lcars-p-15">
            <div className="lcars-text-large lcars-text-orange lcars-mb-10">
              ACTIVE LAYOUT
            </div>
            {state.activeLayout ? (
              <div className="lcars-text-medium lcars-text-white">
                <div>Name: {state.activeLayout.name}</div>
                <div>Description: {state.activeLayout.description}</div>
                <div>Components: {state.activeLayout.components.length}</div>
              </div>
            ) : (
              <div className="lcars-text-medium lcars-text-white">
                No active layout
              </div>
            )}
          </div>
        </div>
        
        {/* Crew Recommendations */}
        <div className="lcars-panel lcars-p-15 lcars-mt-20">
          <div className="lcars-text-large lcars-text-orange lcars-mb-10">
            CREW RECOMMENDATIONS
          </div>
          <div className="lcars-grid lcars-grid-cols-1 lcars-gap-10">
            {getCrewRecommendations().map((rec, index) => (
              <div key={index} className="lcars-panel lcars-p-10">
                <div className="lcars-text-medium lcars-text-gold">
                  {rec.crewMember}
                </div>
                <div className="lcars-text-small lcars-text-white lcars-mt-5">
                  {rec.recommendation}
                </div>
                <button
                  onClick={() => implementRecommendation(rec.crewMember)}
                  className="lcars-button lcars-button-primary lcars-mt-10"
                >
                  Implement
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* System Status */}
        <div className="lcars-panel lcars-p-15 lcars-mt-20">
          <div className="lcars-text-large lcars-text-orange lcars-mb-10">
            SYSTEM STATUS
          </div>
          <div className="lcars-text-medium lcars-text-white">
            <div>Performance: {state.systemStatus.performance}</div>
            <div>Load: {(state.systemStatus.load * 100).toFixed(1)}%</div>
            <div>Response Time: {state.systemStatus.responseTime}ms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipsComputerOrchestrator;
