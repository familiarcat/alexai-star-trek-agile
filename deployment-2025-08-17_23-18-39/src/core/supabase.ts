import { createClient } from '@supabase/supabase-js';

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a fallback client if environment variables are missing
let supabase: any;

// Only create Supabase client if we're in the browser or if environment variables are valid
if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url_here') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('⚠️ Failed to create Supabase client. Using fallback mode.');
    supabase = createFallbackClient();
  }
} else {
  console.warn('⚠️ Supabase environment variables not found or invalid. Using fallback mode.');
  supabase = createFallbackClient();
}

function createFallbackClient() {
  return {
    from: () => ({
      select: () => ({ eq: () => ({ gte: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      rpc: () => Promise.resolve({ data: null, error: null })
    }),
    rpc: () => Promise.resolve({ data: null, error: null })
  };
}

export { supabase };

// Types for our AI agent collective memory system
export interface CSSMemoryEntry {
  id: string;
  agent_id: string;
  layout_context: string;
  user_intent: string;
  screen_size: 'mobile' | 'tablet' | 'desktop';
  user_context: string;
  current_page: string;
  css_variables: Record<string, any>;
  responsive_classes: string[];
  container_structure: string[];
  accessibility_features: string[];
  performance_metrics?: Record<string, any>;
  user_feedback?: Record<string, any>;
  success_score?: number;
  usage_count: number;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

export interface DesignMotivation {
  id: string;
  agent_id: string;
  design_principle: string;
  reasoning: string;
  success_criteria: Record<string, any>;
  related_patterns: string[];
  applicable_contexts: string[];
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  validation_results?: Record<string, any>;
  lessons_learned: string[];
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface AgentCollaboration {
  id: string;
  session_id: string;
  agents_involved: string[];
  collaboration_type: string;
  user_intent: string;
  screen_size: string;
  user_context: string;
  initial_recommendations?: Record<string, any>;
  final_recommendations?: Record<string, any>;
  collaboration_process?: Record<string, any>;
  outcome_metrics?: Record<string, any>;
  lessons_learned: string[];
  next_collaboration_improvements: string[];
  created_at: string;
  duration_ms?: number;
  success_rating?: number;
}

export interface LayoutEvolution {
  id: string;
  layout_signature: string;
  page_path: string;
  version_number: number;
  parent_layout_id?: string;
  evolution_reason: string;
  layout_type: string;
  responsive_breakpoints?: Record<string, any>;
  accessibility_features: string[];
  render_performance?: Record<string, any>;
  user_interaction_metrics?: Record<string, any>;
  created_at: string;
  applied_count: number;
  is_current_version: boolean;
}

export interface UserBehaviorPattern {
  id: string;
  session_id: string;
  device_type: string;
  user_agent?: string;
  page_visits?: Record<string, any>;
  interaction_patterns?: Record<string, any>;
  navigation_path?: Record<string, any>;
  page_load_times?: Record<string, any>;
  user_satisfaction_indicators?: Record<string, any>;
  preferred_layouts?: Record<string, any>;
  avoided_patterns?: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

// AI Agent Collective Memory Service
export class AICollectiveMemoryService {
  private supabase = supabase;
  private isFallbackMode = !supabaseUrl || !supabaseAnonKey;

  // ========================================
  // CSS MEMORY OPERATIONS
  // ========================================

  /**
   * Store a new CSS pattern in collective memory
   */
  async storeCSSPattern(pattern: Omit<CSSMemoryEntry, 'id' | 'created_at' | 'updated_at' | 'usage_count' | 'last_used_at'>): Promise<CSSMemoryEntry | null> {
    if (this.isFallbackMode) {
      console.log('📝 [FALLBACK] CSS pattern would be stored:', pattern);
      return {
        id: `fallback_${Date.now()}`,
        ...pattern,
        usage_count: 1,
        last_used_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('css_memory')
        .insert(pattern)
        .select()
        .single();

      if (error) {
        console.error('Error storing CSS pattern:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in storeCSSPattern:', error);
      return null;
    }
  }

  /**
   * Retrieve successful CSS patterns for a specific context
   */
  async getSuccessfulCSSPatterns(
    screenSize: string,
    userIntent: string,
    userContext: string,
    limit: number = 5
  ): Promise<CSSMemoryEntry[]> {
    if (this.isFallbackMode) {
      console.log('📚 [FALLBACK] Loading CSS patterns for:', { screenSize, userIntent, userContext });
      // Return mock data for testing
      return [
        {
          id: 'fallback_1',
          agent_id: 'ship_computer',
          layout_context: `${screenSize}_${userContext}`,
          user_intent: userIntent,
          screen_size: screenSize as 'mobile' | 'tablet' | 'desktop',
          user_context: userContext,
          current_page: '/',
          css_variables: {
            '--lcars-navigation-prominence': 'high',
            '--lcars-touch-friendly': screenSize === 'mobile' ? 'true' : 'false',
            '--lcars-task-optimization': userContext === 'task-completion' ? 'true' : 'false'
          },
          responsive_classes: ['lcars-responsive', 'lcars-optimized'],
          container_structure: ['lcars-elbow-container', 'lcars-responsive-grid'],
          accessibility_features: ['high-contrast', 'keyboard-navigation'],
          success_score: 0.85,
          usage_count: 5,
          last_used_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    try {
      const { data, error } = await this.supabase
        .from('css_memory')
        .select('*')
        .eq('screen_size', screenSize)
        .eq('user_intent', userIntent)
        .eq('user_context', userContext)
        .gte('success_score', 0.8)
        .order('success_score', { ascending: false })
        .order('usage_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error retrieving CSS patterns:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSuccessfulCSSPatterns:', error);
      return [];
    }
  }

  /**
   * Update usage count and last used timestamp for a CSS pattern
   */
  async updateCSSPatternUsage(patternId: string): Promise<boolean> {
    if (this.isFallbackMode) {
      console.log('📝 [FALLBACK] CSS pattern usage updated:', patternId);
      return true;
    }

    try {
      const { error } = await this.supabase
        .from('css_memory')
        .update({ 
          usage_count: this.supabase.rpc('increment', { row_id: patternId }),
          last_used_at: new Date().toISOString()
        })
        .eq('id', patternId);

      if (error) {
        console.error('Error updating CSS pattern usage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateCSSPatternUsage:', error);
      return false;
    }
  }

  // ========================================
  // DESIGN MOTIVATION OPERATIONS
  // ========================================

  /**
   * Store a new design motivation
   */
  async storeDesignMotivation(motivation: Omit<DesignMotivation, 'id' | 'created_at' | 'updated_at'>): Promise<DesignMotivation | null> {
    if (this.isFallbackMode) {
      console.log('📝 [FALLBACK] Design motivation would be stored:', motivation);
      return {
        id: `fallback_${Date.now()}`,
        ...motivation,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('design_motivations')
        .insert(motivation)
        .select()
        .single();

      if (error) {
        console.error('Error storing design motivation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in storeDesignMotivation:', error);
      return null;
    }
  }

  /**
   * Retrieve design motivations for a specific agent and principle
   */
  async getDesignMotivations(
    agentId: string,
    designPrinciple: string,
    priorityLevel?: string
  ): Promise<DesignMotivation[]> {
    if (this.isFallbackMode) {
      console.log('📚 [FALLBACK] Loading design motivations for:', { agentId, designPrinciple });
      // Return mock data for testing
      return [
        {
          id: 'fallback_1',
          agent_id: agentId,
          design_principle: designPrinciple,
          reasoning: `Fallback design motivation for ${agentId} - ${designPrinciple}`,
          success_criteria: { performance: '>90%', satisfaction: '>0.8' },
          related_patterns: ['efficiency', 'accessibility'],
          applicable_contexts: ['general'],
          priority_level: 'medium' as const,
          validation_results: { tested: true },
          lessons_learned: ['Fallback mode provides basic functionality'],
          confidence_score: 0.8,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    try {
      let query = this.supabase
        .from('design_motivations')
        .select('*')
        .eq('agent_id', agentId)
        .eq('design_principle', designPrinciple);

      if (priorityLevel) {
        query = query.eq('priority_level', priorityLevel);
      }

      const { data, error } = await query
        .order('confidence_score', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error retrieving design motivations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDesignMotivations:', error);
      return [];
    }
  }

  // ========================================
  // AGENT COLLABORATION OPERATIONS
  // ========================================

  /**
   * Store a new agent collaboration session
   */
  async storeAgentCollaboration(collaboration: Omit<AgentCollaboration, 'id' | 'created_at'>): Promise<AgentCollaboration | null> {
    if (this.isFallbackMode) {
      console.log('📝 [FALLBACK] Agent collaboration would be stored:', collaboration);
      return {
        id: `fallback_${Date.now()}`,
        ...collaboration,
        created_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('agent_collaborations')
        .insert(collaboration)
        .select()
        .single();

      if (error) {
        console.error('Error storing agent collaboration:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in storeAgentCollaboration:', error);
      return null;
    }
  }

  /**
   * Retrieve successful collaboration patterns
   */
  async getSuccessfulCollaborations(
    collaborationType: string,
    limit: number = 10
  ): Promise<AgentCollaboration[]> {
    if (this.isFallbackMode) {
      console.log('📚 [FALLBACK] Loading collaborations for:', collaborationType);
      // Return mock data for testing
      return [
        {
          id: 'fallback_1',
          session_id: 'fallback_session',
          agents_involved: ['ship_computer', 'commander_data', 'counselor_troi'],
          collaboration_type: collaborationType,
          user_intent: 'general',
          screen_size: 'desktop',
          user_context: 'navigation',
          initial_recommendations: { ship_computer: 'Fallback recommendation' },
          final_recommendations: { outcome: 'Fallback collaboration result' },
          collaboration_process: { phase1: 'Fallback analysis' },
          outcome_metrics: { success: 0.85 },
          lessons_learned: ['Fallback mode enables testing'],
          next_collaboration_improvements: ['Improve fallback data quality'],
          created_at: new Date().toISOString(),
          duration_ms: 1000,
          success_rating: 0.85
        }
      ];
    }

    try {
      const { data, error } = await this.supabase
        .from('agent_collaborations')
        .select('*')
        .eq('collaboration_type', collaborationType)
        .gte('success_rating', 0.8)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error retrieving collaborations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSuccessfulCollaborations:', error);
      return [];
    }
  }

  // ========================================
  // LAYOUT EVOLUTION OPERATIONS
  // ========================================

  /**
   * Store a new layout evolution
   */
  async storeLayoutEvolution(evolution: Omit<LayoutEvolution, 'id' | 'created_at'>): Promise<LayoutEvolution | null> {
    if (this.isFallbackMode) {
      console.log('📝 [FALLBACK] Layout evolution would be stored:', evolution);
      return {
        id: `fallback_${Date.now()}`,
        ...evolution,
        created_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('layout_evolution')
        .insert(evolution)
        .select()
        .single();

      if (error) {
        console.error('Error storing layout evolution:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in storeLayoutEvolution:', error);
      return null;
    }
  }

  /**
   * Get current layout version for a page
   */
  async getCurrentLayoutVersion(pagePath: string): Promise<LayoutEvolution | null> {
    if (this.isFallbackMode) {
      console.log('📚 [FALLBACK] Loading layout version for:', pagePath);
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('layout_evolution')
        .select('*')
        .eq('page_path', pagePath)
        .eq('is_current_version', true)
        .single();

      if (error) {
        console.error('Error retrieving current layout version:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCurrentLayoutVersion:', error);
      return null;
    }
  }

  // ========================================
  // USER BEHAVIOR OPERATIONS
  // ========================================

  /**
   * Store user behavior patterns
   */
  async storeUserBehaviorPattern(pattern: Omit<UserBehaviorPattern, 'id' | 'created_at' | 'updated_at'>): Promise<UserBehaviorPattern | null> {
    if (this.isFallbackMode) {
      console.log('📝 [FALLBACK] User behavior pattern would be stored:', pattern);
      return {
        id: `fallback_${Date.now()}`,
        ...pattern,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('user_behavior_patterns')
        .insert(pattern)
        .select()
        .single();

      if (error) {
        console.error('Error storing user behavior pattern:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in storeUserBehaviorPattern:', error);
      return null;
    }
  }

  /**
   * Get user behavior insights for layout optimization
   */
  async getUserBehaviorInsights(deviceType: string, limit: number = 20): Promise<UserBehaviorPattern[]> {
    if (this.isFallbackMode) {
      console.log('📚 [FALLBACK] Loading user behavior insights for:', deviceType);
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('user_behavior_patterns')
        .select('*')
        .eq('device_type', deviceType)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error retrieving user behavior insights:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserBehaviorInsights:', error);
      return [];
    }
  }

  // ========================================
  // ANALYTICS AND INSIGHTS
  // ========================================

  /**
   * Get overall system performance insights
   */
  async getSystemInsights(): Promise<{
    totalPatterns: number;
    averageSuccessScore: number;
    topPerformingAgents: Array<{ agent_id: string; avg_score: number }>;
    recentImprovements: string[];
  }> {
    if (this.isFallbackMode) {
      console.log('📊 [FALLBACK] Loading system insights');
      return {
        totalPatterns: 1,
        averageSuccessScore: 0.85,
        topPerformingAgents: [
          { agent_id: 'ship_computer', avg_score: 0.9 },
          { agent_id: 'commander_data', avg_score: 0.85 },
          { agent_id: 'counselor_troi', avg_score: 0.8 }
        ],
        recentImprovements: [
          'Fallback mode enabled for testing',
          'Mock data provides realistic simulation',
          'System ready for production deployment'
        ]
      };
    }

    try {
      // Get total patterns
      const { count: totalPatterns } = await this.supabase
        .from('css_memory')
        .select('*', { count: 'exact', head: true });

      // Get average success score
      const { data: successData } = await this.supabase
        .from('css_memory')
        .select('success_score')
        .not('success_score', 'is', null);

      const averageSuccessScore = successData 
        ? (successData as any[]).reduce((sum: number, item: any) => sum + (item.success_score || 0), 0) / (successData as any[]).length
        : 0;

      // Get top performing agents
      const { data: agentData } = await this.supabase
        .from('css_memory')
        .select('agent_id, success_score')
        .not('success_score', 'is', null);

      const agentScores = (agentData as any[])?.reduce((acc: Record<string, { scores: number[]; count: number }>, item: any) => {
        if (!acc[item.agent_id]) {
          acc[item.agent_id] = { scores: [], count: 0 };
        }
        acc[item.agent_id].scores.push(item.success_score || 0);
        acc[item.agent_id].count++;
        return acc;
      }, {} as Record<string, { scores: number[]; count: number }>);

      const topPerformingAgents = Object.entries(agentScores || {})
        .map(([agent_id, data]) => ({
          agent_id,
          avg_score: data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.count
        }))
        .sort((a, b) => b.avg_score - a.avg_score)
        .slice(0, 5);

      // Get recent improvements
      const { data: recentData } = await this.supabase
        .from('css_memory')
        .select('layout_context, success_score')
        .gte('success_score', 0.8)
        .order('created_at', { ascending: false })
        .limit(10);

      const recentImprovements = (recentData as any[])?.map((item: any) => 
        `${item.layout_context}: ${Math.round((item.success_score || 0) * 100)}% success`
      ) || [];

      return {
        totalPatterns: totalPatterns || 0,
        averageSuccessScore: Math.round(averageSuccessScore * 100) / 100,
        topPerformingAgents,
        recentImprovements
      };
    } catch (error) {
      console.error('Error in getSystemInsights:', error);
      return {
        totalPatterns: 0,
        averageSuccessScore: 0,
        topPerformingAgents: [],
        recentImprovements: []
      };
    }
  }
}

// Export singleton instance
export const aiCollectiveMemory = new AICollectiveMemoryService(); 