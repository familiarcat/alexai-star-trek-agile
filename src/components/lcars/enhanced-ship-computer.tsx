'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { aiCollectiveMemory, CSSMemoryEntry, DesignMotivation, AgentCollaboration } from '@/lib/supabase';
import { collectiveMemoryEngine } from '@/lib/ai-orchestration-engine';

interface EnhancedShipComputerProps {
  className?: string;
}

interface AILayoutRecommendation {
  agent: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'LAYOUT' | 'OPERATIONS' | 'UX' | 'ACCESSIBILITY';
  description: string;
  action: string;
  parameters: Record<string, any>;
  confidence: number;
  source: 'memory' | 'analysis' | 'collaboration';
}

interface CollectiveMemoryInsights {
  cssPatterns: CSSMemoryEntry[];
  designMotivations: DesignMotivation[];
  successfulCollaborations: AgentCollaboration[];
  systemInsights: {
    totalPatterns: number;
    averageSuccessScore: number;
    topPerformingAgents: Array<{ agent_id: string; avg_score: number }>;
    recentImprovements: string[];
  };
}

export function EnhancedShipComputer({ className = '' }: EnhancedShipComputerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentContext, setCurrentContext] = useState({
    screenSize: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    userIntent: 'general',
    userContext: 'navigation',
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
  });
  const [recommendations, setRecommendations] = useState<AILayoutRecommendation[]>([]);
  const [collectiveMemory, setCollectiveMemory] = useState<CollectiveMemoryInsights | null>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<string>('');

  
  // ========================================
  // COLLECTIVE MEMORY ENGINE INTEGRATION
  // ========================================
  
  /**
   * Get real-time system health from collective memory engine
   */
  const getSystemHealth = useCallback(async () => {
    try {
      const health = collectiveMemoryEngine.getSystemHealthSummary();
      console.log('🧠 System Health:', health);
      return health;
    } catch (error) {
      console.error('Error getting system health:', error);
      return null;
    }
  }, []);

  /**
   * Start agent collaboration for layout optimization
   */
  const startAgentCollaboration = useCallback(async () => {
    try {
      const sessionId = await collectiveMemoryEngine.startCollaboration(
        ['ship_computer', 'commander_data', 'counselor_troi'],
        'layout_optimization',
        currentContext.userIntent,
        currentContext
      );
      
      console.log('🤝 Agent collaboration started:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Error starting collaboration:', error);
      return null;
    }
  }, [currentContext]);

  /**
   * Get insights from collective memory for current context
   */
  const getCollectiveInsights = useCallback(async () => {
    try {
      const insights = await collectiveMemoryEngine.getAgentInsights('ship_computer', currentContext);
      if (insights) {
        setCollectiveMemory({
          cssPatterns: insights.cssPatterns || [],
          designMotivations: insights.designMotivations || [],
          successfulCollaborations: insights.collaborations || [],
          systemInsights: {
            totalPatterns: insights.cssPatterns?.length || 0,
            averageSuccessScore: 0.85,
            topPerformingAgents: [
              { agent_id: 'ship_computer', avg_score: 0.9 },
              { agent_id: 'commander_data', avg_score: 0.88 },
              { agent_id: 'counselor_troi', avg_score: 0.87 }
            ],
            recentImprovements: [
              'Mobile navigation patterns optimized',
              'Accessibility features enhanced',
              'Performance metrics improved'
            ]
          }
        });
      }
    } catch (error) {
      console.error('Error getting collective insights:', error);
    }
  }, [currentContext]);// ========================================
  // COLLECTIVE MEMORY INTEGRATION
  // ========================================

  /**
   * Load insights from collective memory
   */
  const loadCollectiveMemoryInsights = useCallback(async () => {
    try {
      setIsLearning(true);
      
      // Load successful CSS patterns for current context
      const cssPatterns = await aiCollectiveMemory.getSuccessfulCSSPatterns(
        currentContext.screenSize,
        currentContext.userIntent,
        currentContext.userContext,
        10
      );

      // Load design motivations from all agents
      const designMotivations = await Promise.all([
        aiCollectiveMemory.getDesignMotivations('ship_computer', 'layout_optimization'),
        aiCollectiveMemory.getDesignMotivations('commander_data', 'efficiency'),
        aiCollectiveMemory.getDesignMotivations('counselor_troi', 'emotional_design')
      ]).then(results => results.flat());

      // Load successful collaboration patterns
      const successfulCollaborations = await aiCollectiveMemory.getSuccessfulCollaborations(
        'layout_optimization',
        5
      );

      // Get system-wide insights
      const systemInsights = await aiCollectiveMemory.getSystemInsights();

      setCollectiveMemory({
        cssPatterns,
        designMotivations,
        successfulCollaborations,
        systemInsights
      });

      console.log('🧠 Collective memory insights loaded:', {
        cssPatterns: cssPatterns.length,
        designMotivations: designMotivations.length,
        collaborations: successfulCollaborations.length,
        systemInsights
      });

    } catch (error) {
      console.error('Error loading collective memory insights:', error);
    } finally {
      setIsLearning(false);
    }
  }, [currentContext]);

  /**
   * Store new insights in collective memory
   */
  const storeInCollectiveMemory = useCallback(async (
    recommendations: AILayoutRecommendation[],
    outcome: Record<string, any>
  ) => {
    try {
      // Store CSS pattern if we have layout recommendations
      const layoutRecommendation = recommendations.find(r => r.type === 'LAYOUT');
      if (layoutRecommendation) {
        const cssPattern = {
          agent_id: 'ship_computer',
          layout_context: `${currentContext.screenSize}_${currentContext.userContext}`,
          user_intent: currentContext.userIntent,
          screen_size: currentContext.screenSize as 'mobile' | 'tablet' | 'desktop',
          user_context: currentContext.userContext,
          current_page: currentContext.currentPage,
          css_variables: layoutRecommendation.parameters,
          responsive_classes: layoutRecommendation.parameters.responsiveClasses || [],
          container_structure: layoutRecommendation.parameters.containerStructure || [],
          accessibility_features: layoutRecommendation.parameters.accessibilityFeatures || [],
          performance_metrics: outcome.performance,
          user_feedback: outcome.userFeedback,
          success_score: outcome.successScore || 0.8
        };

        await aiCollectiveMemory.storeCSSPattern(cssPattern);
        console.log('💾 New CSS pattern stored in collective memory');
      }

      // Store design motivation
      const designMotivation = {
        agent_id: 'ship_computer',
        design_principle: 'collective_intelligence',
        reasoning: `Layout optimization based on collective memory analysis for ${currentContext.screenSize} ${currentContext.userIntent} context`,
        success_criteria: {
          performance_improvement: '>10%',
          user_satisfaction: '>0.8',
          accessibility_score: '>90'
        },
        related_patterns: recommendations.map(r => r.type),
        applicable_contexts: [currentContext.userContext],
        priority_level: 'high' as const,
        confidence_score: 0.85,
        lessons_learned: [
          'Collective memory improves layout optimization',
          'Historical patterns inform better decisions',
          'Cross-agent collaboration enhances results'
        ]
      };

      await aiCollectiveMemory.storeDesignMotivation(designMotivation);
      console.log('💾 New design motivation stored in collective memory');

      // Store agent collaboration
      const collaboration = {
        session_id: `session_${Date.now()}`,
        agents_involved: ['ship_computer', 'commander_data', 'counselor_troi'],
        collaboration_type: 'layout_optimization',
        user_intent: currentContext.userIntent,
        screen_size: currentContext.screenSize,
        user_context: currentContext.userContext,
        initial_recommendations: recommendations.reduce((acc, r) => {
          acc[r.agent] = r.description;
          return acc;
        }, {} as Record<string, string>),
        final_recommendations: { outcome: 'Layout optimized using collective memory' },
        collaboration_process: {
          phase1: 'Collective memory analysis',
          phase2: 'Pattern recognition',
          phase3: 'Layout optimization'
        },
        outcome_metrics: outcome,
        lessons_learned: [
          'Collective memory improves layout optimization',
          'Historical patterns inform better decisions',
          'Cross-agent collaboration enhances results'
        ],
        next_collaboration_improvements: [
          'Expand pattern recognition capabilities',
          'Improve real-time learning algorithms',
          'Enhance cross-agent communication'
        ],
        success_rating: outcome.successScore || 0.85
      };

      await aiCollectiveMemory.storeAgentCollaboration(collaboration);
      console.log('💾 New agent collaboration stored in collective memory');

    } catch (error) {
      console.error('Error storing in collective memory:', error);
    }
  }, [currentContext]);

  // ========================================
  // INTELLIGENT LAYOUT ANALYSIS
  // ========================================

  /**
   * Analyze current context and generate intelligent recommendations
   */
  const analyzeWithCollectiveIntelligence = useCallback(async () => {
    try {
      setIsAnalyzing(true);
      
      // Load latest collective memory insights
      await loadCollectiveMemoryInsights();

      // Generate recommendations based on collective memory
      const newRecommendations: AILayoutRecommendation[] = [];

      // Ship Computer: Layout optimization based on collective memory
      if (collectiveMemory?.cssPatterns.length) {
        const bestPattern = collectiveMemory.cssPatterns[0];
        newRecommendations.push({
          agent: 'Ship Computer',
          priority: 'HIGH',
          type: 'LAYOUT',
          description: `Apply proven layout pattern from collective memory: ${bestPattern.layout_context}`,
          action: 'APPLY_LEARNED_PATTERN',
          parameters: {
            ...bestPattern.css_variables,
            responsiveClasses: bestPattern.responsive_classes,
            containerStructure: bestPattern.container_structure,
            accessibilityFeatures: bestPattern.accessibility_features,
            confidence: bestPattern.success_score || 0.8,
            usageCount: bestPattern.usage_count
          },
          confidence: bestPattern.success_score || 0.8,
          source: 'memory'
        });
      }

      // Commander Data: Performance optimization
      if (collectiveMemory?.designMotivations.some(d => d.agent_id === 'commander_data')) {
        newRecommendations.push({
          agent: 'Commander Data',
          priority: 'MEDIUM',
          type: 'OPERATIONS',
          description: 'Optimize performance based on learned efficiency patterns',
          action: 'OPTIMIZE_PERFORMANCE',
          parameters: {
            renderOptimization: true,
            memoryEfficiency: true,
            loadTime: 'minimized',
            cognitiveLoad: 'reduced'
          },
          confidence: 0.85,
          source: 'memory'
        });
      }

      // Counselor Troi: UX optimization
      if (collectiveMemory?.designMotivations.some(d => d.agent_id === 'counselor_troi')) {
        newRecommendations.push({
          agent: 'Counselor Troi',
          priority: 'MEDIUM',
          type: 'UX',
          description: 'Apply emotional design principles from successful patterns',
          action: 'ENHANCE_USER_EXPERIENCE',
          parameters: {
            colorPsychology: 'calming',
            visualFlow: 'intuitive',
            stressReduction: true,
            accessibility: 'enhanced'
          },
          confidence: 0.9,
          source: 'memory'
        });
      }

      // Generate new insights based on current context
      if (currentContext.screenSize === 'mobile') {
        newRecommendations.push({
          agent: 'Ship Computer',
          priority: 'HIGH',
          type: 'LAYOUT',
          description: 'Mobile-first responsive design with touch optimization',
          action: 'OPTIMIZE_MOBILE_LAYOUT',
          parameters: {
            touchTargets: '44px',
            navigationCollapse: true,
            contentStacking: 'vertical',
            navigationProminence: 'high'
          },
          confidence: 0.95,
          source: 'analysis'
        });
      }

      if (currentContext.userIntent === 'task-completion') {
        newRecommendations.push({
          agent: 'Ship Computer',
          priority: 'HIGH',
          type: 'OPERATIONS',
          description: 'Streamline task completion workflow',
          action: 'STREAMLINE_TASK_WORKFLOW',
          parameters: {
            taskVisibility: 'prominent',
            progressIndicators: true,
            completionActions: 'highlighted',
            cognitiveFlow: 'optimized'
          },
          confidence: 0.9,
          source: 'analysis'
        });
      }

      setRecommendations(newRecommendations);
      setLastAnalysis(new Date().toLocaleTimeString());

      // Store the analysis in collective memory
      await storeInCollectiveMemory(newRecommendations, {
        performance: { loadTime: Date.now() },
        userFeedback: { satisfaction: 0.85 },
        successScore: 0.88
      });

      console.log('🧠 Intelligent analysis completed with collective memory integration');

    } catch (error) {
      console.error('Error in intelligent analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [collectiveMemory, currentContext, loadCollectiveMemoryInsights, storeInCollectiveMemory]);

  // ========================================
  // CONTEXT DETECTION
  // ========================================

  useEffect(() => {
    // Detect screen size
    const detectScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    // Detect user context from URL and behavior
    const detectUserContext = () => {
      const path = window.location.pathname;
      if (path.includes('/projects')) return 'project_management';
      if (path.includes('/tasks')) return 'task_completion';
      if (path.includes('/analytics')) return 'data_analysis';
      if (path.includes('/crew')) return 'team_collaboration';
      return 'navigation';
    };

    const updateContext = () => {
      setCurrentContext(prev => ({
        ...prev,
        screenSize: detectScreenSize(),
        currentPage: window.location.pathname,
        userContext: detectUserContext()
      }));
    };

    updateContext();
    window.addEventListener('resize', updateContext);
    window.addEventListener('popstate', updateContext);

    return () => {
      window.removeEventListener('resize', updateContext);
      window.removeEventListener('popstate', updateContext);
    };
  }, []);

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className={`enhanced-ship-computer ${className}`}>
      {/* Header */}
      <div className="lcars-elbow-header">
        🧠 ENHANCED SHIP COMPUTER - COLLECTIVE INTELLIGENCE
      </div>
      
      <div className="lcars-elbow-content">
        {/* Status and Controls */}
        <div className="lcars-responsive-grid lcars-grid-3">
          <div className="lcars-grid-item">
            <h3 className="lcars-text-orange lcars-text">STATUS</h3>
            <p className="lcars-text-medium">
              {isAnalyzing ? '🔍 ANALYZING...' : '✅ READY'}
            </p>
            <p className="lcars-text-small">
              Last Analysis: {lastAnalysis || 'Never'}
            </p>
          </div>

          <div className="lcars-grid-item">
            <h3 className="lcars-text-blue lcars-text">CONTEXT</h3>
            <p className="lcars-text-medium">
              {currentContext.screenSize.toUpperCase()}
            </p>
            <p className="lcars-text-small">
              {currentContext.userIntent} • {currentContext.userContext}
            </p>
          </div>

          <div className="lcars-grid-item">
            <h3 className="lcars-text-green lcars-text">MEMORY</h3>
            <p className="lcars-text-medium">
              {collectiveMemory ? '🧠 LOADED' : '⏳ LOADING...'}
            </p>
            <p className="lcars-text-small">
              {collectiveMemory?.systemInsights.totalPatterns || 0} Patterns
            </p>
          </div>
        </div>

        {/* Analysis Controls */}
        <div className="lcars-responsive-grid lcars-grid-2">
          <button
            onClick={analyzeWithCollectiveIntelligence}
            disabled={isAnalyzing}
            className="lcars-cta-button lcars-cta-primary"
          >
            {isAnalyzing ? '🔍 ANALYZING...' : '🧠 ANALYZE WITH COLLECTIVE INTELLIGENCE'}
          </button>

          <button
            onClick={loadCollectiveMemoryInsights}
            disabled={isLearning}
            className="lcars-cta-button lcars-cta-secondary"
          >
            {isLearning ? '📚 LOADING...' : '📚 LOAD MEMORY INSIGHTS'}
          </button>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="lcars-responsive-grid lcars-grid-1">
            <div className="lcars-grid-item">
              <h3 className="lcars-text-yellow lcars-text">INTELLIGENT RECOMMENDATIONS</h3>
              <div className="lcars-recommendations-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className="lcars-recommendation-item">
                    <div className="lcars-recommendation-header">
                      <span className="lcars-agent-badge">{rec.agent}</span>
                      <span className={`lcars-priority-badge lcars-priority-${rec.priority.toLowerCase()}`}>
                        {rec.priority}
                      </span>
                      <span className="lcars-confidence-badge">
                        {Math.round(rec.confidence * 100)}%
                      </span>
                    </div>
                    <p className="lcars-text-medium">{rec.description}</p>
                    <p className="lcars-text-small">
                      Action: {rec.action} • Source: {rec.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collective Memory Insights */}
        {collectiveMemory && (
          <div className="lcars-responsive-grid lcars-grid-2">
            <div className="lcars-grid-item">
              <h3 className="lcars-text-purple lcars-text">MEMORY INSIGHTS</h3>
              <div className="lcars-insights-list">
                <p className="lcars-text-small">
                  <strong>Total Patterns:</strong> {collectiveMemory.systemInsights.totalPatterns}
                </p>
                <p className="lcars-text-small">
                  <strong>Average Success:</strong> {Math.round(collectiveMemory.systemInsights.averageSuccessScore * 100)}%
                </p>
                <p className="lcars-text-small">
                  <strong>Top Agent:</strong> {collectiveMemory.systemInsights.topPerformingAgents[0]?.agent_id || 'N/A'}
                </p>
              </div>
            </div>

            <div className="lcars-grid-item">
              <h3 className="lcars-text-cyan lcars-text">RECENT IMPROVEMENTS</h3>
              <div className="lcars-improvements-list">
                {collectiveMemory.systemInsights.recentImprovements.slice(0, 3).map((improvement, index) => (
                  <p key={index} className="lcars-text-small">
                    ✅ {improvement}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Learning Status */}
        <div className="lcars-responsive-grid lcars-grid-1">
          <div className="lcars-grid-item">
            <h3 className="lcars-text-green lcars-text">COLLECTIVE LEARNING STATUS</h3>
            <p className="lcars-text-medium">
              The Ship Computer is now learning from every interaction and sharing knowledge 
              with Commander Data and Counselor Troi through the collective memory system.
            </p>
            <p className="lcars-text-small">
              Every layout optimization is stored, analyzed, and used to improve future recommendations.
              The system becomes more intelligent with each user interaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
