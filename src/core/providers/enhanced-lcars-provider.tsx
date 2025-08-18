'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, Suspense, useState } from 'react';
import { lcarsSystem } from '../ship-computer-lcars-system';
import { n8nIntegrationService } from '../services/n8n-integration-service';

// Enhanced LCARS System State
export interface EnhancedLCARSState {
  // System Core
  system: {
    status: 'initializing' | 'operational' | 'degraded' | 'offline';
    version: string;
    lastUpdate: string;
    supabaseConnected: boolean;
    n8nConnected: boolean;
    initializationProgress: number;
    errorCount: number;
  };
  
  // Crew Management
  crew: {
    activeMembers: string[];
    coordinationSessions: Map<string, any>;
    currentMission: string | null;
    crewStatus: Record<string, 'active' | 'busy' | 'offline' | 'error'>;
    crewPerformance: Record<string, any>;
    crewAssignments: Record<string, string[]>;
  };
  
  // Data Management
  data: {
    workflows: any[];
    projects: any[];
    tasks: any[];
    analytics: any;
    memory: any[];
    cache: Map<string, any>;
    dataSources: Record<string, 'loading' | 'loaded' | 'error'>;
    lastSync: Record<string, string>;
  };
  
  // UI State Management
  ui: {
    theme: 'lcars' | 'modern' | 'classic' | 'auto';
    layout: 'standard' | 'compact' | 'expanded' | 'minimal';
    activeComponents: string[];
    responsiveBreakpoint: 'mobile' | 'tablet' | 'desktop';
    componentStates: Record<string, 'loading' | 'ready' | 'error'>;
    layoutPreferences: Record<string, any>;
    accessibility: {
      highContrast: boolean;
      reducedMotion: boolean;
      fontSize: 'small' | 'medium' | 'large';
    };
  };
  
  // Workflow Management
  workflows: {
    active: string[];
    pending: string[];
    completed: string[];
    failed: string[];
    n8nStatus: 'connected' | 'disconnected' | 'error';
    executionHistory: any[];
    performanceMetrics: Record<string, any>;
  };
  
  // Performance & Monitoring
  performance: {
    responseTime: number;
    memoryUsage: number;
    activeConnections: number;
    errorRate: number;
    componentRenderTimes: Record<string, number>;
    dataFetchTimes: Record<string, number>;
    cacheHitRate: number;
  };
  
  // Layout Management
  layout: {
    currentLayout: string;
    availableLayouts: string[];
    layoutConfigurations: Record<string, any>;
    responsiveRules: Record<string, any>;
    componentPositions: Record<string, any>;
    layoutHistory: any[];
  };
  
  // Suspense & Loading States
  suspense: {
    loadingComponents: Set<string>;
    errorBoundaries: Record<string, any>;
    fallbackStates: Record<string, ReactNode>;
    retryAttempts: Record<string, number>;
  };
}

// Enhanced LCARS Actions
export type EnhancedLCARSAction =
  // System Actions
  | { type: 'UPDATE_SYSTEM_STATUS'; payload: Partial<EnhancedLCARSState['system']> }
  | { type: 'SET_INITIALIZATION_PROGRESS'; payload: number }
  | { type: 'INCREMENT_ERROR_COUNT' }
  
  // Crew Actions
  | { type: 'UPDATE_CREW_STATUS'; payload: { member: string; status: string } }
  | { type: 'ADD_COORDINATION_SESSION'; payload: { id: string; session: any } }
  | { type: 'UPDATE_CREW_PERFORMANCE'; payload: { member: string; metrics: any } }
  | { type: 'ASSIGN_CREW_MEMBER'; payload: { member: string; assignment: string } }
  
  // Data Actions
  | { type: 'UPDATE_DATA'; payload: { key: string; data: any } }
  | { type: 'SET_DATA_SOURCE_STATUS'; payload: { source: string; status: string } }
  | { type: 'UPDATE_LAST_SYNC'; payload: { source: string; timestamp: string } }
  | { type: 'CLEAR_CACHE'; payload: string }
  
  // UI Actions
  | { type: 'UPDATE_UI_STATE'; payload: Partial<EnhancedLCARSState['ui']> }
  | { type: 'SET_COMPONENT_STATE'; payload: { component: string; state: string } }
  | { type: 'UPDATE_LAYOUT_PREFERENCES'; payload: { component: string; preferences: any } }
  | { type: 'UPDATE_ACCESSIBILITY'; payload: Partial<EnhancedLCARSState['ui']['accessibility']> }
  
  // Workflow Actions
  | { type: 'UPDATE_WORKFLOW_STATUS'; payload: { workflowId: string; status: string } }
  | { type: 'ADD_EXECUTION_HISTORY'; payload: any }
  | { type: 'UPDATE_PERFORMANCE_METRICS'; payload: { workflowId: string; metrics: any } }
  
  // Performance Actions
  | { type: 'UPDATE_PERFORMANCE'; payload: Partial<EnhancedLCARSState['performance']> }
  | { type: 'SET_COMPONENT_RENDER_TIME'; payload: { component: string; time: number } }
  | { type: 'SET_DATA_FETCH_TIME'; payload: { source: string; time: number } }
  | { type: 'UPDATE_CACHE_HIT_RATE'; payload: number }
  
  // Layout Actions
  | { type: 'SET_CURRENT_LAYOUT'; payload: string }
  | { type: 'ADD_LAYOUT_CONFIGURATION'; payload: { name: string; config: any } }
  | { type: 'UPDATE_COMPONENT_POSITION'; payload: { component: string; position: any } }
  | { type: 'ADD_LAYOUT_HISTORY'; payload: any }
  
  // Suspense Actions
  | { type: 'ADD_LOADING_COMPONENT'; payload: string }
  | { type: 'REMOVE_LOADING_COMPONENT'; payload: string }
  | { type: 'SET_ERROR_BOUNDARY'; payload: { component: string; error: any } }
  | { type: 'SET_FALLBACK_STATE'; payload: { component: string; fallback: ReactNode } }
  | { type: 'INCREMENT_RETRY_ATTEMPT'; payload: string }
  
  // Bulk Actions
  | { type: 'BULK_UPDATE'; payload: Partial<EnhancedLCARSState> }
  | { type: 'RESET_STATE' };

// Enhanced LCARS Context
interface EnhancedLCARSContextType {
  state: EnhancedLCARSState;
  dispatch: React.Dispatch<EnhancedLCARSAction>;
  actions: {
    // System Actions
    updateSystemStatus: (status: Partial<EnhancedLCARSState['system']>) => void;
    setInitializationProgress: (progress: number) => void;
    incrementErrorCount: () => void;
    
    // Crew Actions
    updateCrewStatus: (member: string, status: string) => void;
    addCoordinationSession: (id: string, session: any) => void;
    updateCrewPerformance: (member: string, metrics: any) => void;
    assignCrewMember: (member: string, assignment: string) => void;
    
    // Data Actions
    updateData: (key: string, data: any) => void;
    setDataSourceStatus: (source: string, status: string) => void;
    updateLastSync: (source: string, timestamp: string) => void;
    clearCache: (key: string) => void;
    
    // UI Actions
    updateUIState: (uiState: Partial<EnhancedLCARSState['ui']>) => void;
    setComponentState: (component: string, state: string) => void;
    updateLayoutPreferences: (component: string, preferences: any) => void;
    updateAccessibility: (settings: Partial<EnhancedLCARSState['ui']['accessibility']>) => void;
    
    // Workflow Actions
    updateWorkflowStatus: (workflowId: string, status: string) => void;
    addExecutionHistory: (execution: any) => void;
    updatePerformanceMetrics: (workflowId: string, metrics: any) => void;
    
    // Performance Actions
    updatePerformance: (metrics: Partial<EnhancedLCARSState['performance']>) => void;
    setComponentRenderTime: (component: string, time: number) => void;
    setDataFetchTime: (source: string, time: number) => void;
    updateCacheHitRate: (rate: number) => void;
    
    // Layout Actions
    setCurrentLayout: (layout: string) => void;
    addLayoutConfiguration: (name: string, config: any) => void;
    updateComponentPosition: (component: string, position: any) => void;
    addLayoutHistory: (history: any) => void;
    
    // Suspense Actions
    addLoadingComponent: (component: string) => void;
    removeLoadingComponent: (component: string) => void;
    setErrorBoundary: (component: string, error: any) => void;
    setFallbackState: (component: string, fallback: ReactNode) => void;
    incrementRetryAttempt: (component: string) => void;
    
    // Utility Actions
    bulkUpdate: (updates: Partial<EnhancedLCARSState>) => void;
    resetState: () => void;
  };
  
  // Utility Functions
  utils: {
    isComponentLoading: (component: string) => boolean;
    getComponentState: (component: string) => string;
    getDataSourceStatus: (source: string) => string;
    getCrewMemberStatus: (member: string) => string;
    getWorkflowStatus: (workflowId: string) => string;
    getLayoutConfiguration: (layout: string) => any;
    getPerformanceMetrics: (component: string) => any;
  };
}

// Initial State
const initialState: EnhancedLCARSState = {
  system: {
    status: 'initializing',
    version: '3.0.0',
    lastUpdate: new Date().toISOString(),
    supabaseConnected: false,
    n8nConnected: false,
    initializationProgress: 0,
    errorCount: 0,
  },
  crew: {
    activeMembers: [],
    coordinationSessions: new Map(),
    currentMission: null,
    crewStatus: {},
    crewPerformance: {},
    crewAssignments: {},
  },
  data: {
    workflows: [],
    projects: [],
    tasks: [],
    analytics: {},
    memory: [],
    cache: new Map(),
    dataSources: {},
    lastSync: {},
  },
  ui: {
    theme: 'auto',
    layout: 'standard',
    activeComponents: [],
    responsiveBreakpoint: 'desktop',
    componentStates: {},
    layoutPreferences: {},
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
    },
  },
  workflows: {
    active: [],
    pending: [],
    completed: [],
    failed: [],
    n8nStatus: 'disconnected',
    executionHistory: [],
    performanceMetrics: {},
  },
  performance: {
    responseTime: 0,
    memoryUsage: 0,
    activeConnections: 0,
    errorRate: 0,
    componentRenderTimes: {},
    dataFetchTimes: {},
    cacheHitRate: 0,
  },
  layout: {
    currentLayout: 'default',
    availableLayouts: ['default', 'compact', 'expanded', 'minimal'],
    layoutConfigurations: {},
    responsiveRules: {},
    componentPositions: {},
    layoutHistory: [],
  },
  suspense: {
    loadingComponents: new Set(),
    errorBoundaries: {},
    fallbackStates: {},
    retryAttempts: {},
  },
};

// Enhanced LCARS Reducer
function enhancedLCARSReducer(state: EnhancedLCARSState, action: EnhancedLCARSAction): EnhancedLCARSState {
  switch (action.type) {
    // System Actions
    case 'UPDATE_SYSTEM_STATUS':
      return {
        ...state,
        system: { ...state.system, ...action.payload },
      };
      
    case 'SET_INITIALIZATION_PROGRESS':
      return {
        ...state,
        system: { ...state.system, initializationProgress: action.payload },
      };
      
    case 'INCREMENT_ERROR_COUNT':
      return {
        ...state,
        system: { ...state.system, errorCount: state.system.errorCount + 1 },
      };
      
    // Crew Actions
    case 'UPDATE_CREW_STATUS':
      return {
        ...state,
        crew: {
          ...state.crew,
          crewStatus: {
            ...state.crew.crewStatus,
            [action.payload.member]: action.payload.status as any,
          },
        },
      };
      
    case 'ADD_COORDINATION_SESSION':
      const newSessions = new Map(state.crew.coordinationSessions);
      newSessions.set(action.payload.id, action.payload.session);
      return {
        ...state,
        crew: {
          ...state.crew,
          coordinationSessions: newSessions,
        },
      };
      
    case 'UPDATE_CREW_PERFORMANCE':
      return {
        ...state,
        crew: {
          ...state.crew,
          crewPerformance: {
            ...state.crew.crewPerformance,
            [action.payload.member]: action.payload.metrics,
          },
        },
      };
      
    case 'ASSIGN_CREW_MEMBER':
      return {
        ...state,
        crew: {
          ...state.crew,
          crewAssignments: {
            ...state.crew.crewAssignments,
            [action.payload.member]: [
              ...(state.crew.crewAssignments[action.payload.member] || []),
              action.payload.assignment,
            ],
          },
        },
      };
      
    // Data Actions
    case 'UPDATE_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.key]: action.payload.data,
        },
      };
      
    case 'SET_DATA_SOURCE_STATUS':
      return {
        ...state,
        data: {
          ...state.data,
          dataSources: {
            ...state.data.dataSources,
            [action.payload.source]: action.payload.status as any,
          },
        },
      };
      
    case 'UPDATE_LAST_SYNC':
      return {
        ...state,
        data: {
          ...state.data,
          lastSync: {
            ...state.data.lastSync,
            [action.payload.source]: action.payload.timestamp,
          },
        },
      };
      
    case 'CLEAR_CACHE':
      const newCache = new Map(state.data.cache);
      if (action.payload === 'all') {
        newCache.clear();
      } else {
        newCache.delete(action.payload);
      }
      return {
        ...state,
        data: {
          ...state.data,
          cache: newCache,
        },
      };
      
    // UI Actions
    case 'UPDATE_UI_STATE':
      return {
        ...state,
        ui: { ...state.ui, ...action.payload },
      };
      
    case 'SET_COMPONENT_STATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          componentStates: {
            ...state.ui.componentStates,
            [action.payload.component]: action.payload.state as any,
          },
        },
      };
      
    case 'UPDATE_LAYOUT_PREFERENCES':
      return {
        ...state,
        ui: {
          ...state.ui,
          layoutPreferences: {
            ...state.ui.layoutPreferences,
            [action.payload.component]: action.payload.preferences,
          },
        },
      };
      
    case 'UPDATE_ACCESSIBILITY':
      return {
        ...state,
        ui: {
          ...state.ui,
          accessibility: {
            ...state.ui.accessibility,
            ...action.payload,
          },
        },
      };
      
    // Workflow Actions
    case 'UPDATE_WORKFLOW_STATUS':
      const { workflowId, status } = action.payload;
      const workflows = { ...state.workflows };
      
      // Remove from current status arrays
      workflows.active = workflows.active.filter(id => id !== workflowId);
      workflows.pending = workflows.pending.filter(id => id !== workflowId);
      workflows.completed = workflows.completed.filter(id => id !== workflowId);
      workflows.failed = workflows.failed.filter(id => id !== workflowId);
      
      // Add to new status array
      workflows[status as keyof typeof workflows].push(workflowId);
      
      return {
        ...state,
        workflows,
      };
      
    case 'ADD_EXECUTION_HISTORY':
      return {
        ...state,
        workflows: {
          ...state.workflows,
          executionHistory: [...state.workflows.executionHistory, action.payload],
        },
      };
      
    case 'UPDATE_PERFORMANCE_METRICS':
      return {
        ...state,
        workflows: {
          ...state.workflows,
          performanceMetrics: {
            ...state.workflows.performanceMetrics,
            [action.payload.workflowId]: action.payload.metrics,
          },
        },
      };
      
    // Performance Actions
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        performance: { ...state.performance, ...action.payload },
      };
      
    case 'SET_COMPONENT_RENDER_TIME':
      return {
        ...state,
        performance: {
          ...state.performance,
          componentRenderTimes: {
            ...state.performance.componentRenderTimes,
            [action.payload.component]: action.payload.time,
          },
        },
      };
      
    case 'SET_DATA_FETCH_TIME':
      return {
        ...state,
        performance: {
          ...state.performance,
          dataFetchTimes: {
            ...state.performance.dataFetchTimes,
            [action.payload.source]: action.payload.time,
          },
        },
      };
      
    case 'UPDATE_CACHE_HIT_RATE':
      return {
        ...state,
        performance: {
          ...state.performance,
          cacheHitRate: action.payload,
        },
      };
      
    // Layout Actions
    case 'SET_CURRENT_LAYOUT':
      return {
        ...state,
        layout: {
          ...state.layout,
          currentLayout: action.payload,
        },
      };
      
    case 'ADD_LAYOUT_CONFIGURATION':
      return {
        ...state,
        layout: {
          ...state.layout,
          layoutConfigurations: {
            ...state.layout.layoutConfigurations,
            [action.payload.name]: action.payload.config,
          },
        },
      };
      
    case 'UPDATE_COMPONENT_POSITION':
      return {
        ...state,
        layout: {
          ...state.layout,
          componentPositions: {
            ...state.layout.componentPositions,
            [action.payload.component]: action.payload.position,
          },
        },
      };
      
    case 'ADD_LAYOUT_HISTORY':
      return {
        ...state,
        layout: {
          ...state.layout,
          layoutHistory: [...state.layout.layoutHistory, action.payload],
        },
      };
      
    // Suspense Actions
    case 'ADD_LOADING_COMPONENT':
      const newLoadingComponents = new Set(state.suspense.loadingComponents);
      newLoadingComponents.add(action.payload);
      return {
        ...state,
        suspense: {
          ...state.suspense,
          loadingComponents: newLoadingComponents,
        },
      };
      
    case 'REMOVE_LOADING_COMPONENT':
      const updatedLoadingComponents = new Set(state.suspense.loadingComponents);
      updatedLoadingComponents.delete(action.payload);
      return {
        ...state,
        suspense: {
          ...state.suspense,
          loadingComponents: updatedLoadingComponents,
        },
      };
      
    case 'SET_ERROR_BOUNDARY':
      return {
        ...state,
        suspense: {
          ...state.suspense,
          errorBoundaries: {
            ...state.suspense.errorBoundaries,
            [action.payload.component]: action.payload.error,
          },
        },
      };
      
    case 'SET_FALLBACK_STATE':
      return {
        ...state,
        suspense: {
          ...state.suspense,
          fallbackStates: {
            ...state.suspense.fallbackStates,
            [action.payload.component]: action.payload.fallback,
          },
        },
      };
      
    case 'INCREMENT_RETRY_ATTEMPT':
      return {
        ...state,
        suspense: {
          ...state.suspense,
          retryAttempts: {
            ...state.suspense.retryAttempts,
            [action.payload]: (state.suspense.retryAttempts[action.payload] || 0) + 1,
          },
        },
      };
      
    // Bulk Actions
    case 'BULK_UPDATE':
      return {
        ...state,
        ...action.payload,
      };
      
    case 'RESET_STATE':
      return initialState;
      
    default:
      return state;
  }
}

// Enhanced LCARS Provider Component
export function EnhancedLCARSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(enhancedLCARSReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Enhanced LCARS System
  useEffect(() => {
    initializeEnhancedLCARSSystem();
  }, []);

  // Initialize Enhanced LCARS System
  const initializeEnhancedLCARSSystem = async () => {
    try {
      console.log('🚀 Initializing Enhanced LCARS System...');
      
      // Step 1: Initialize core system
      dispatch({ type: 'SET_INITIALIZATION_PROGRESS', payload: 10 });
      
      // Step 2: Initialize LCARS system
      const systemStatus = lcarsSystem.getSystemStatus();
      dispatch({
        type: 'UPDATE_SYSTEM_STATUS',
        payload: {
          supabaseConnected: systemStatus.supabaseConnected,
          n8nConnected: systemStatus.supabaseConnected,
        },
      });
      dispatch({ type: 'SET_INITIALIZATION_PROGRESS', payload: 30 });
      
      // Step 3: Initialize crew members
      const crewMembers = systemStatus.crewMembers || [];
      const crewStatus: Record<string, 'active' | 'busy' | 'offline' | 'error'> = {};
      crewMembers.forEach(member => {
        crewStatus[member] = 'active';
      });
      
      dispatch({
        type: 'UPDATE_DATA',
        payload: { key: 'crewMembers', data: crewMembers },
      });
      dispatch({ type: 'SET_INITIALIZATION_PROGRESS', payload: 50 });
      
      // Step 4: Initialize n8n integration
      const n8nInitialized = await n8nIntegrationService.initialize();
      if (n8nInitialized) {
        dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: { n8nConnected: true } });
        console.log('✅ n8n Integration Service initialized');
      } else {
        console.warn('⚠️ n8n Integration Service not available');
      }
      dispatch({ type: 'SET_INITIALIZATION_PROGRESS', payload: 70 });
      
      // Step 5: Initialize UI state
      initializeUIState();
      dispatch({ type: 'SET_INITIALIZATION_PROGRESS', payload: 90 });
      
      // Step 6: Start performance monitoring
      startPerformanceMonitoring();
      dispatch({ type: 'SET_INITIALIZATION_PROGRESS', payload: 100 });
      
      // Step 7: Mark as operational
      dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: { status: 'operational' } });
      setIsInitialized(true);
      
      console.log('🎉 Enhanced LCARS System initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Enhanced LCARS System:', error);
      dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: { status: 'degraded' } });
      dispatch({ type: 'INCREMENT_ERROR_COUNT' });
    }
  };

  // Initialize UI State
  const initializeUIState = () => {
    // Set responsive breakpoint
    const updateResponsiveBreakpoint = () => {
      const width = window.innerWidth;
      let breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      
      if (width < 768) breakpoint = 'mobile';
      else if (width < 1024) breakpoint = 'tablet';
      
      dispatch({ type: 'UPDATE_UI_STATE', payload: { responsiveBreakpoint: breakpoint } });
    };

    // Set initial breakpoint
    updateResponsiveBreakpoint();

    // Listen for resize events
    window.addEventListener('resize', updateResponsiveBreakpoint);

    // Set theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    dispatch({ type: 'UPDATE_UI_STATE', payload: { theme: prefersDark ? 'lcars' : 'modern' } });

    // Set layout based on screen size
    const layout = window.innerWidth < 1024 ? 'compact' : 'standard';
    dispatch({ type: 'UPDATE_UI_STATE', payload: { layout } });
  };

  // Start Performance Monitoring
  const startPerformanceMonitoring = () => {
    const interval = setInterval(() => {
      // Monitor memory usage
      if (typeof window !== 'undefined' && 'performance' in window) {
        const memory = (performance as any).memory;
        if (memory) {
          dispatch({
            type: 'UPDATE_PERFORMANCE',
            payload: {
              memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
            },
          });
        }
      }

      // Monitor response time
      const startTime = performance.now();
      fetch('/api/health')
        .then(() => {
          const responseTime = performance.now() - startTime;
          dispatch({
            type: 'UPDATE_PERFORMANCE',
            payload: { responseTime: Math.round(responseTime) },
          });
        })
        .catch(() => {
          dispatch({
            type: 'UPDATE_PERFORMANCE',
            payload: { errorRate: 1 },
          });
        });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  };

  // Action Creators
  const actions = {
    // System Actions
    updateSystemStatus: (status: Partial<EnhancedLCARSState['system']>) => {
      dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: status });
    },
    
    setInitializationProgress: (progress: number) => {
      dispatch({ type: 'SET_INITIALIZATION_PROGRESS', payload: progress });
    },
    
    incrementErrorCount: () => {
      dispatch({ type: 'INCREMENT_ERROR_COUNT' });
    },
    
    // Crew Actions
    updateCrewStatus: (member: string, status: string) => {
      dispatch({ type: 'UPDATE_CREW_STATUS', payload: { member, status } });
    },
    
    addCoordinationSession: (id: string, session: any) => {
      dispatch({ type: 'ADD_COORDINATION_SESSION', payload: { id, session } });
    },
    
    updateCrewPerformance: (member: string, metrics: any) => {
      dispatch({ type: 'UPDATE_CREW_PERFORMANCE', payload: { member, metrics } });
    },
    
    assignCrewMember: (member: string, assignment: string) => {
      dispatch({ type: 'ASSIGN_CREW_MEMBER', payload: { member, assignment } });
    },
    
    // Data Actions
    updateData: (key: string, data: any) => {
      dispatch({ type: 'UPDATE_DATA', payload: { key, data } });
    },
    
    setDataSourceStatus: (source: string, status: string) => {
      dispatch({ type: 'SET_DATA_SOURCE_STATUS', payload: { source, status } });
    },
    
    updateLastSync: (source: string, timestamp: string) => {
      dispatch({ type: 'UPDATE_LAST_SYNC', payload: { source, timestamp } });
    },
    
    clearCache: (key: string) => {
      dispatch({ type: 'CLEAR_CACHE', payload: key });
    },
    
    // UI Actions
    updateUIState: (uiState: Partial<EnhancedLCARSState['ui']>) => {
      dispatch({ type: 'UPDATE_UI_STATE', payload: uiState });
    },
    
    setComponentState: (component: string, state: string) => {
      dispatch({ type: 'SET_COMPONENT_STATE', payload: { component, state } });
    },
    
    updateLayoutPreferences: (component: string, preferences: any) => {
      dispatch({ type: 'UPDATE_LAYOUT_PREFERENCES', payload: { component, preferences } });
    },
    
    updateAccessibility: (settings: Partial<EnhancedLCARSState['ui']['accessibility']>) => {
      dispatch({ type: 'UPDATE_ACCESSIBILITY', payload: settings });
    },
    
    // Workflow Actions
    updateWorkflowStatus: (workflowId: string, status: string) => {
      dispatch({ type: 'UPDATE_WORKFLOW_STATUS', payload: { workflowId, status } });
    },
    
    addExecutionHistory: (execution: any) => {
      dispatch({ type: 'ADD_EXECUTION_HISTORY', payload: execution });
    },
    
    updatePerformanceMetrics: (workflowId: string, metrics: any) => {
      dispatch({ type: 'UPDATE_PERFORMANCE_METRICS', payload: { workflowId, metrics } });
    },
    
    // Performance Actions
    updatePerformance: (metrics: Partial<EnhancedLCARSState['performance']>) => {
      dispatch({ type: 'UPDATE_PERFORMANCE', payload: metrics });
    },
    
    setComponentRenderTime: (component: string, time: number) => {
      dispatch({ type: 'SET_COMPONENT_RENDER_TIME', payload: { component, time } });
    },
    
    setDataFetchTime: (source: string, time: number) => {
      dispatch({ type: 'SET_DATA_FETCH_TIME', payload: { source, time } });
    },
    
    updateCacheHitRate: (rate: number) => {
      dispatch({ type: 'UPDATE_CACHE_HIT_RATE', payload: rate });
    },
    
    // Layout Actions
    setCurrentLayout: (layout: string) => {
      dispatch({ type: 'SET_CURRENT_LAYOUT', payload: layout });
    },
    
    addLayoutConfiguration: (name: string, config: any) => {
      dispatch({ type: 'ADD_LAYOUT_CONFIGURATION', payload: { name, config } });
    },
    
    updateComponentPosition: (component: string, position: any) => {
      dispatch({ type: 'UPDATE_COMPONENT_POSITION', payload: { component, position } });
    },
    
    addLayoutHistory: (history: any) => {
      dispatch({ type: 'ADD_LAYOUT_HISTORY', payload: history });
    },
    
    // Suspense Actions
    addLoadingComponent: (component: string) => {
      dispatch({ type: 'ADD_LOADING_COMPONENT', payload: component });
    },
    
    removeLoadingComponent: (component: string) => {
      dispatch({ type: 'REMOVE_LOADING_COMPONENT', payload: component });
    },
    
    setErrorBoundary: (component: string, error: any) => {
      dispatch({ type: 'SET_ERROR_BOUNDARY', payload: { component, error } });
    },
    
    setFallbackState: (component: string, fallback: ReactNode) => {
      dispatch({ type: 'SET_FALLBACK_STATE', payload: { component, fallback } });
    },
    
    incrementRetryAttempt: (component: string) => {
      dispatch({ type: 'INCREMENT_RETRY_ATTEMPT', payload: component });
    },
    
    // Utility Actions
    bulkUpdate: (updates: Partial<EnhancedLCARSState>) => {
      dispatch({ type: 'BULK_UPDATE', payload: updates });
    },
    
    resetState: () => {
      dispatch({ type: 'RESET_STATE' });
    },
  };

  // Utility Functions
  const utils = {
    isComponentLoading: (component: string) => state.suspense.loadingComponents.has(component),
    getComponentState: (component: string) => state.ui.componentStates[component] || 'ready',
    getDataSourceStatus: (source: string) => state.data.dataSources[source] || 'unknown',
    getCrewMemberStatus: (member: string) => state.crew.crewStatus[member] || 'unknown',
    getWorkflowStatus: (workflowId: string) => {
      if (state.workflows.active.includes(workflowId)) return 'active';
      if (state.workflows.pending.includes(workflowId)) return 'pending';
      if (state.workflows.completed.includes(workflowId)) return 'completed';
      if (state.workflows.failed.includes(workflowId)) return 'failed';
      return 'unknown';
    },
    getLayoutConfiguration: (layout: string) => state.layout.layoutConfigurations[layout] || {},
    getPerformanceMetrics: (component: string) => state.performance.componentRenderTimes[component] || 0,
  };

  const contextValue: EnhancedLCARSContextType = {
    state,
    dispatch,
    actions,
    utils,
  };

  // Render loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-yellow-400">Initializing Enhanced LCARS</h2>
          <p className="text-gray-400">Setting up centralized data and UI management...</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Initialization Progress: {state.system.initializationProgress}%</p>
            <p>System Status: {state.system.status}</p>
            <p>Error Count: {state.system.errorCount}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EnhancedLCARSContext.Provider value={contextValue}>
      <Suspense fallback={<EnhancedLCARSFallback />}>
        {children}
      </Suspense>
    </EnhancedLCARSContext.Provider>
  );
}

// Enhanced LCARS Fallback Component
function EnhancedLCARSFallback() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse rounded-full h-32 w-32 bg-yellow-400 mb-4"></div>
        <h2 className="text-2xl font-bold text-yellow-400">Loading Enhanced LCARS</h2>
        <p className="text-gray-400">Suspending components for optimal performance...</p>
      </div>
    </div>
  );
}

// Enhanced LCARS Context
const EnhancedLCARSContext = createContext<EnhancedLCARSContextType | undefined>(undefined);

// Enhanced LCARS Hook
export function useEnhancedLCARS() {
  const context = useContext(EnhancedLCARSContext);
  if (context === undefined) {
    throw new Error('useEnhancedLCARS must be used within an EnhancedLCARSProvider');
  }
  return context;
}

// Export the context for direct usage if needed
export { EnhancedLCARSContext };
