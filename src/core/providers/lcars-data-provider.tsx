'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { lcarsSystem } from '../ship-computer-lcars-system';

// Enhanced LCARS Data Types
export interface LCARSDataState {
  // System Status
  system: {
    status: 'operational' | 'degraded' | 'offline';
    version: string;
    lastUpdate: string;
    supabaseConnected: boolean;
    n8nConnected: boolean;
  };
  
  // Crew Coordination
  crew: {
    activeMembers: string[];
    coordinationSessions: Map<string, any>;
    currentMission: string | null;
    crewStatus: Record<string, 'active' | 'busy' | 'offline'>;
  };
  
  // Data Management
  data: {
    workflows: any[];
    projects: any[];
    tasks: any[];
    analytics: any;
    memory: any[];
    cache: Map<string, any>;
  };
  
  // UI State
  ui: {
    theme: 'lcars' | 'modern' | 'classic';
    layout: 'standard' | 'compact' | 'expanded';
    activeComponents: string[];
    responsiveBreakpoint: 'mobile' | 'tablet' | 'desktop';
  };
  
  // Workflow State
  workflows: {
    active: string[];
    pending: string[];
    completed: string[];
    failed: string[];
    n8nStatus: 'connected' | 'disconnected' | 'error';
  };
  
  // Performance Metrics
  performance: {
    responseTime: number;
    memoryUsage: number;
    activeConnections: number;
    errorRate: number;
  };
}

// LCARS Actions
export type LCARSAction =
  | { type: 'UPDATE_SYSTEM_STATUS'; payload: Partial<LCARSDataState['system']> }
  | { type: 'UPDATE_CREW_STATUS'; payload: { member: string; status: string } }
  | { type: 'ADD_COORDINATION_SESSION'; payload: { id: string; session: any } }
  | { type: 'UPDATE_WORKFLOW_STATUS'; payload: { workflowId: string; status: string } }
  | { type: 'UPDATE_DATA'; payload: { key: string; data: any } }
  | { type: 'UPDATE_UI_STATE'; payload: Partial<LCARSDataState['ui']> }
  | { type: 'UPDATE_PERFORMANCE'; payload: Partial<LCARSDataState['performance']> }
  | { type: 'SYNC_N8N_WORKFLOWS'; payload: any[] }
  | { type: 'ADD_MEMORY_ENTRY'; payload: any }
  | { type: 'CLEAR_CACHE'; payload: string }
  | { type: 'RESET_STATE' };

// LCARS Context
interface LCARSContextType {
  state: LCARSDataState;
  dispatch: React.Dispatch<LCARSAction>;
  actions: {
    updateSystemStatus: (status: Partial<LCARSDataState['system']>) => void;
    updateCrewStatus: (member: string, status: string) => void;
    addCoordinationSession: (id: string, session: any) => void;
    updateWorkflowStatus: (workflowId: string, status: string) => void;
    updateData: (key: string, data: any) => void;
    updateUIState: (uiState: Partial<LCARSDataState['ui']>) => void;
    syncN8nWorkflows: () => Promise<void>;
    addMemoryEntry: (entry: any) => Promise<void>;
    clearCache: (key: string) => void;
    resetState: () => void;
  };
}

// Initial State
const initialState: LCARSDataState = {
  system: {
    status: 'operational',
    version: '2.0.0',
    lastUpdate: new Date().toISOString(),
    supabaseConnected: false,
    n8nConnected: false,
  },
  crew: {
    activeMembers: [],
    coordinationSessions: new Map(),
    currentMission: null,
    crewStatus: {},
  },
  data: {
    workflows: [],
    projects: [],
    tasks: [],
    analytics: {},
    memory: [],
    cache: new Map(),
  },
  ui: {
    theme: 'lcars',
    layout: 'standard',
    activeComponents: [],
    responsiveBreakpoint: 'desktop',
  },
  workflows: {
    active: [],
    pending: [],
    completed: [],
    failed: [],
    n8nStatus: 'disconnected',
  },
  performance: {
    responseTime: 0,
    memoryUsage: 0,
    activeConnections: 0,
    errorRate: 0,
  },
};

// LCARS Reducer
function lcarsReducer(state: LCARSDataState, action: LCARSAction): LCARSDataState {
  switch (action.type) {
    case 'UPDATE_SYSTEM_STATUS':
      return {
        ...state,
        system: { ...state.system, ...action.payload },
      };
      
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
      
    case 'UPDATE_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.key]: action.payload.data,
        },
      };
      
    case 'UPDATE_UI_STATE':
      return {
        ...state,
        ui: { ...state.ui, ...action.payload },
      };
      
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        performance: { ...state.performance, ...action.payload },
      };
      
    case 'SYNC_N8N_WORKFLOWS':
      return {
        ...state,
        data: {
          ...state.data,
          workflows: action.payload,
        },
        workflows: {
          ...state.workflows,
          n8nStatus: 'connected',
        },
      };
      
    case 'ADD_MEMORY_ENTRY':
      return {
        ...state,
        data: {
          ...state.data,
          memory: [...state.data.memory, action.payload],
        },
      };
      
    case 'CLEAR_CACHE':
      const newCache = new Map(state.data.cache);
      newCache.delete(action.payload);
      return {
        ...state,
        data: {
          ...state.data,
          cache: newCache,
        },
      };
      
    case 'RESET_STATE':
      return initialState;
      
    default:
      return state;
  }
}

// LCARS Data Provider Component
export function LCARSDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(lcarsReducer, initialState);

  // Initialize LCARS System
  useEffect(() => {
    initializeLCARSSystem();
  }, []);

  // Initialize LCARS System
  const initializeLCARSSystem = async () => {
    try {
      // Get system status
      const systemStatus = lcarsSystem.getSystemStatus();
      
      // Update system status
      dispatch({
        type: 'UPDATE_SYSTEM_STATUS',
        payload: {
          supabaseConnected: systemStatus.supabaseConnected,
          n8nConnected: systemStatus.supabaseConnected, // Will be updated by n8n sync
        },
      });

      // Initialize crew members
      const crewMembers = systemStatus.crewMembers || [];
      const crewStatus: Record<string, 'active' | 'busy' | 'offline'> = {};
      crewMembers.forEach(member => {
        crewStatus[member] = 'active';
      });

      dispatch({
        type: 'UPDATE_DATA',
        payload: { key: 'crewMembers', data: crewMembers },
      });

      // Sync n8n workflows
      await syncN8nWorkflows();

      // Start performance monitoring
      startPerformanceMonitoring();

    } catch (error) {
      console.error('Failed to initialize LCARS system:', error);
      dispatch({
        type: 'UPDATE_SYSTEM_STATUS',
        payload: { status: 'degraded' },
      });
    }
  };

  // Sync n8n Workflows
  const syncN8nWorkflows = async () => {
    try {
      const response = await fetch('/api/n8n-integration/workflows');
      if (response.ok) {
        const workflows = await response.json();
        dispatch({
          type: 'SYNC_N8N_WORKFLOWS',
          payload: workflows,
        });
      }
    } catch (error) {
      console.error('Failed to sync n8n workflows:', error);
      dispatch({
        type: 'UPDATE_SYSTEM_STATUS',
        payload: { n8nConnected: false },
      });
    }
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
    updateSystemStatus: (status: Partial<LCARSDataState['system']>) => {
      dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: status });
    },
    
    updateCrewStatus: (member: string, status: string) => {
      dispatch({ type: 'UPDATE_CREW_STATUS', payload: { member, status } });
    },
    
    addCoordinationSession: (id: string, session: any) => {
      dispatch({ type: 'ADD_COORDINATION_SESSION', payload: { id, session } });
    },
    
    updateWorkflowStatus: (workflowId: string, status: string) => {
      dispatch({ type: 'UPDATE_WORKFLOW_STATUS', payload: { workflowId, status } });
    },
    
    updateData: (key: string, data: any) => {
      dispatch({ type: 'UPDATE_DATA', payload: { key, data } });
    },
    
    updateUIState: (uiState: Partial<LCARSDataState['ui']>) => {
      dispatch({ type: 'UPDATE_UI_STATE', payload: uiState });
    },
    
    syncN8nWorkflows: async () => {
      await syncN8nWorkflows();
    },
    
    addMemoryEntry: async (entry: any) => {
      try {
        const memoryEntry = await lcarsSystem.recordMemory(entry);
        dispatch({ type: 'ADD_MEMORY_ENTRY', payload: memoryEntry });
        return memoryEntry;
      } catch (error) {
        console.error('Failed to add memory entry:', error);
        throw error;
      }
    },
    
    clearCache: (key: string) => {
      dispatch({ type: 'CLEAR_CACHE', payload: key });
    },
    
    resetState: () => {
      dispatch({ type: 'RESET_STATE' });
    },
  };

  const contextValue: LCARSContextType = {
    state,
    dispatch,
    actions,
  };

  return (
    <LCARSContext.Provider value={contextValue}>
      {children}
    </LCARSContext.Provider>
  );
}

// LCARS Context
const LCARSContext = createContext<LCARSContextType | undefined>(undefined);

// LCARS Hook
export function useLCARS() {
  const context = useContext(LCARSContext);
  if (context === undefined) {
    throw new Error('useLCARS must be used within a LCARSDataProvider');
  }
  return context;
}

// Export the context for direct usage if needed
export { LCARSContext };
