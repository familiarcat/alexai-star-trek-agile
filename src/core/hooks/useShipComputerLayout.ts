/**
 * useShipComputerLayout Hook
 * React hook for integrating with the Ship Computer Layout Orchestrator
 * Provides intelligent, AI-driven layout management based on user intent
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import ShipComputerLayoutOrchestrator, {
  LayoutAnalysis,
  UserIntent,
  ComponentLayout,
  LayoutStrategy
} from '../ship-computer-layout-orchestrator';

export interface UseShipComputerLayoutOptions {
  pageId: string;
  userBehavior?: any;
  contentContext?: any;
  currentLayout?: any;
  autoAnalyze?: boolean;
  optimizationInterval?: number;
}

export interface UseShipComputerLayoutReturn {
  // Layout Analysis
  layoutAnalysis: LayoutAnalysis | null;
  userIntent: UserIntent | null;
  layoutStrategy: LayoutStrategy | null;
  componentHierarchy: ComponentLayout[];
  
  // Status
  isAnalyzing: boolean;
  isOptimizing: boolean;
  lastAnalysis: Date | null;
  optimizationScore: number;
  
  // Actions
  analyzeLayout: () => Promise<void>;
  optimizeLayout: () => Promise<void>;
  updateUserBehavior: (behavior: any) => void;
  updateContentContext: (context: any) => void;
  
  // Crew Information
  crewMembers: any[];
  crewRecommendations: any[];
  
  // Error Handling
  error: string | null;
  clearError: () => void;
}

let orchestratorInstance: ShipComputerLayoutOrchestrator | null = null;

/**
 * Get or create the Ship Computer Layout Orchestrator instance
 */
const getOrchestrator = (): ShipComputerLayoutOrchestrator => {
  if (!orchestratorInstance) {
    orchestratorInstance = new ShipComputerLayoutOrchestrator();
    console.log('🚀 Ship Computer Layout Orchestrator: Instance created');
  }
  return orchestratorInstance;
};

/**
 * useShipComputerLayout Hook
 * Provides intelligent layout management powered by all 8 Star Trek crew members
 */
export const useShipComputerLayout = (options: UseShipComputerLayoutOptions): UseShipComputerLayoutReturn => {
  const {
    pageId,
    userBehavior: initialUserBehavior = {},
    contentContext: initialContentContext = {},
    currentLayout: initialCurrentLayout = {},
    autoAnalyze = true,
    optimizationInterval = 30000 // 30 seconds
  } = options;

  // State management
  const [layoutAnalysis, setLayoutAnalysis] = useState<LayoutAnalysis | null>(null);
  const [userIntent, setUserIntent] = useState<UserIntent | null>(null);
  const [layoutStrategy, setLayoutStrategy] = useState<LayoutStrategy | null>(null);
  const [componentHierarchy, setComponentHierarchy] = useState<ComponentLayout[]>([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [optimizationScore, setOptimizationScore] = useState(0);
  
  const [userBehavior, setUserBehavior] = useState(initialUserBehavior);
  const [contentContext, setContentContext] = useState(initialContentContext);
  const [currentLayout, setCurrentLayout] = useState(initialCurrentLayout);
  
  const [error, setError] = useState<string | null>(null);
  
  // Refs for tracking
  const orchestratorRef = useRef<ShipComputerLayoutOrchestrator | null>(null);
  const optimizationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize orchestrator
  useEffect(() => {
    try {
      orchestratorRef.current = getOrchestrator();
      console.log(`🧠 Ship Computer: Hook initialized for page ${pageId}`);
    } catch (err) {
      setError(`Failed to initialize Ship Computer: ${err}`);
    }
  }, [pageId]);

  // Auto-analyze on mount if enabled
  useEffect(() => {
    if (autoAnalyze && orchestratorRef.current) {
      analyzeLayout();
    }
  }, [autoAnalyze]);

  // Set up optimization interval
  useEffect(() => {
    if (optimizationInterval > 0) {
      optimizationTimerRef.current = setInterval(() => {
        if (layoutAnalysis && !isOptimizing) {
          optimizeLayout();
        }
      }, optimizationInterval);
    }

    return () => {
      if (optimizationTimerRef.current) {
        clearInterval(optimizationTimerRef.current);
      }
    };
  }, [optimizationInterval, layoutAnalysis, isOptimizing]);

  // Analyze layout with all crew members
  const analyzeLayout = useCallback(async () => {
    if (!orchestratorRef.current) {
      setError('Ship Computer not initialized');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      console.log(`🔍 Ship Computer: Starting layout analysis for ${pageId}...`);

      // Perform comprehensive analysis with all 8 crew members
      const analysis = await orchestratorRef.current.analyzeUserIntentAndLayout(
        pageId,
        userBehavior,
        contentContext,
        currentLayout
      );

      // Update state with analysis results
      setLayoutAnalysis(analysis);
      setUserIntent(analysis.userIntent);
      setLayoutStrategy(analysis.layoutStrategy);
      setComponentHierarchy(analysis.componentHierarchy);
      setOptimizationScore(analysis.optimizationScore);
      setLastAnalysis(new Date());

      console.log(`✅ Ship Computer: Layout analysis complete for ${pageId}`);
      console.log(`📊 Optimization Score: ${analysis.optimizationScore}/100`);
      console.log(`👥 Crew Consensus: ${analysis.crewConsensus}/100`);

      // Log crew recommendations
      analysis.implementationPlan.forEach(step => {
        console.log(`👨‍✈️ ${step.crewResponsible}: ${step.description}`);
      });

    } catch (err) {
      const errorMessage = `Layout analysis failed: ${err}`;
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [pageId, userBehavior, contentContext, currentLayout]);

  // Optimize layout based on crew recommendations
  const optimizeLayout = useCallback(async () => {
    if (!orchestratorRef.current || !layoutAnalysis) {
      setError('No layout analysis available for optimization');
      return;
    }

    try {
      setIsOptimizing(true);
      setError(null);

      console.log(`🔄 Ship Computer: Starting layout optimization for ${pageId}...`);

      // Get current layout from orchestrator
      const currentLayoutFromOrchestrator = orchestratorRef.current.getCurrentLayout(pageId);
      
      if (currentLayoutFromOrchestrator) {
        // Update state with optimized layout
        setLayoutAnalysis(currentLayoutFromOrchestrator);
        setComponentHierarchy(currentLayoutFromOrchestrator.componentHierarchy);
        setOptimizationScore(currentLayoutFromOrchestrator.optimizationScore);
        
        console.log(`✅ Ship Computer: Layout optimization complete for ${pageId}`);
        console.log(`📊 New Optimization Score: ${currentLayoutFromOrchestrator.optimizationScore}/100`);
      }

    } catch (err) {
      const errorMessage = `Layout optimization failed: ${err}`;
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsOptimizing(false);
    }
  }, [pageId, layoutAnalysis]);

  // Update user behavior for real-time analysis
  const updateUserBehavior = useCallback((behavior: any) => {
    setUserBehavior((prev: any) => ({ ...prev, ...behavior }));
    
    // Trigger re-analysis if significant behavior change
    if (behavior.errorRate > 0.1 || behavior.completionRate < 0.5) {
      console.log(`🚨 Ship Computer: Significant behavior change detected, triggering re-analysis`);
      setTimeout(() => analyzeLayout(), 1000);
    }
  }, [analyzeLayout]);

  // Update content context for dynamic layout adaptation
  const updateContentContext = useCallback((context: any) => {
    setContentContext((prev: any) => ({ ...prev, ...context }));
    
    // Trigger re-analysis if content type changes
    if (context.pageType && contentContext.pageType !== context.pageType) {
      console.log(`🔄 Ship Computer: Content type changed, triggering re-analysis`);
      setTimeout(() => analyzeLayout(), 1000);
    }
  }, [contentContext.pageType, analyzeLayout]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get crew information
  const crewMembers = orchestratorRef.current?.getAllCrewMembers() || [];
  const crewRecommendations = layoutAnalysis?.implementationPlan || [];

  return {
    // Layout Analysis
    layoutAnalysis,
    userIntent,
    layoutStrategy,
    componentHierarchy,
    
    // Status
    isAnalyzing,
    isOptimizing,
    lastAnalysis,
    optimizationScore,
    
    // Actions
    analyzeLayout,
    optimizeLayout,
    updateUserBehavior,
    updateContentContext,
    
    // Crew Information
    crewMembers,
    crewRecommendations,
    
    // Error Handling
    error,
    clearError
  };
};

export default useShipComputerLayout;
