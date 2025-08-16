import { createClient } from '@supabase/supabase-js';

// Enhanced Collective Memory System for Agent Learning
export interface CollectiveMemoryEntry {
  id: string;
  agent_id: string;
  agent_name: string;
  mission_type: 'functionality' | 'ui_refinement' | 'revenue_generation' | 'system_optimization';
  task_description: string;
  approach_used: string;
  success_metrics: {
    completion_rate: number;
    time_efficiency: number;
    quality_score: number;
    user_satisfaction: number;
  };
  failure_patterns?: {
    error_type: string;
    root_cause: string;
    recovery_strategy: string;
    prevention_methods: string[];
  };
  learning_insights: string[];
  resource_allocation: {
    time_spent: number;
    tools_used: string[];
    team_size: number;
    budget_impact: number;
  };
  outcome: 'success' | 'partial_success' | 'failure' | 'learning';
  impact_score: number; // 1-10 scale
  created_at: string;
  updated_at: string;
  tags: string[];
  related_missions: string[];
}

export interface AgentLearningProfile {
  agent_id: string;
  agent_name: string;
  specialization: string;
  success_patterns: string[];
  failure_patterns: string[];
  learning_curve: {
    initial_performance: number;
    current_performance: number;
    improvement_rate: number;
    best_practices: string[];
  };
  collaboration_history: {
    agents_worked_with: string[];
    successful_collaborations: number;
    learning_exchanges: number;
  };
  mission_success_rate: number;
  last_mission_date: string;
  expertise_areas: string[];
  growth_areas: string[];
}

export interface MissionOrchestration {
  mission_id: string;
  mission_type: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'planning' | 'active' | 'completed' | 'failed' | 'learning';
  assigned_agents: string[];
  required_capabilities: string[];
  success_criteria: string[];
  current_progress: number;
  estimated_completion: string;
  actual_completion?: string;
  lessons_learned: string[];
  next_missions: string[];
  lcars_layout_config: {
    theme: string;
    panels: string[];
    data_visualizations: string[];
    priority_indicators: boolean;
    dynamic_elements: boolean;
  };
}

export class EnhancedCollectiveMemoryService {
  private supabase: any;
  private isFallbackMode: boolean;

  constructor() {
    // Check if Supabase environment variables are available
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        this.supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        this.isFallbackMode = false;
        console.log('✅ Supabase client initialized successfully');
      } else {
        throw new Error('Supabase environment variables not found');
      }
    } catch (error) {
      console.log('⚠️ Supabase initialization failed, using fallback mode:', error.message);
      this.isFallbackMode = true;
      this.supabase = null;
    }
  }

  // Create new collective memory entry
  async createMemoryEntry(entry: Omit<CollectiveMemoryEntry, 'id' | 'created_at' | 'updated_at'>): Promise<CollectiveMemoryEntry> {
    if (this.isFallbackMode) {
      console.log('📝 [FALLBACK] Memory entry would be created:', entry);
      return {
        id: `fallback_${Date.now()}`,
        ...entry,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    const { data, error } = await this.supabase!
      .from('collective_memory')
      .insert({
        ...entry,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create memory entry: ${error.message}`);
    return data;
  }

  // Get agent learning profile
  async getAgentLearningProfile(agentId: string): Promise<AgentLearningProfile | null> {
    if (this.isFallbackMode) {
      console.log('🤖 [FALLBACK] Getting agent learning profile for:', agentId);
      // Return a mock profile for testing
      return {
        agent_id: agentId,
        agent_name: agentId === 'captain-picard' ? 'Captain Jean-Luc Picard' : 'Lieutenant Commander Data',
        specialization: agentId === 'captain-picard' ? 'Strategic Leadership' : 'Analytical Intelligence',
        success_patterns: ['Strategic planning', 'Team coordination', 'Mission execution'],
        failure_patterns: ['Resource constraints', 'Timeline pressure'],
        learning_curve: {
          initial_performance: 75,
          current_performance: 95,
          improvement_rate: 2.5,
          best_practices: ['Collaborative decision making', 'Risk assessment', 'Resource optimization']
        },
        collaboration_history: {
          agents_worked_with: ['lieutenant-data', 'chief-engineer-scott'],
          successful_collaborations: 15,
          learning_exchanges: 8
        },
        mission_success_rate: 92,
        last_mission_date: new Date().toISOString(),
        expertise_areas: ['Strategic planning', 'Team leadership', 'Mission coordination'],
        growth_areas: ['Technical implementation', 'Performance optimization']
      };
    }

    const { data, error } = await this.supabase!
      .from('agent_learning_profiles')
      .select('*')
      .eq('agent_id', agentId)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(`Failed to get agent profile: ${error.message}`);
    return data;
  }

  // Update agent learning profile
  async updateAgentLearningProfile(profile: Partial<AgentLearningProfile> & { agent_id: string }): Promise<AgentLearningProfile> {
    if (this.isFallbackMode) {
      console.log('📝 [FALLBACK] Agent learning profile would be updated:', profile);
      return {
        agent_id: profile.agent_id,
        agent_name: profile.agent_name || 'Unknown Agent',
        specialization: profile.specialization || 'General Operations',
        success_patterns: profile.success_patterns || [],
        failure_patterns: profile.failure_patterns || [],
        learning_curve: profile.learning_curve || {
          initial_performance: 70,
          current_performance: 85,
          improvement_rate: 2.0,
          best_practices: []
        },
        collaboration_history: profile.collaboration_history || {
          agents_worked_with: [],
          successful_collaborations: 0,
          learning_exchanges: 0
        },
        mission_success_rate: profile.mission_success_rate || 80,
        last_mission_date: profile.last_mission_date || new Date().toISOString(),
        expertise_areas: profile.expertise_areas || [],
        growth_areas: profile.growth_areas || []
      };
    }

    const { data, error } = await this.supabase!
      .from('agent_learning_profiles')
      .upsert({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to update agent profile: ${error.message}`);
    return data;
  }

  // Get successful patterns for specific mission type
  async getSuccessPatterns(missionType: string): Promise<CollectiveMemoryEntry[]> {
    if (this.isFallbackMode) {
      console.log('✅ [FALLBACK] Getting success patterns for mission type:', missionType);
      return [];
    }

    const { data, error } = await this.supabase!
      .from('collective_memory')
      .select('*')
      .eq('mission_type', missionType)
      .eq('outcome', 'success')
      .gte('impact_score', 7)
      .order('impact_score', { ascending: false })
      .limit(10);

    if (error) throw new Error(`Failed to get success patterns: ${error.message}`);
    return data || [];
  }

  // Get failure patterns and recovery strategies
  async getFailurePatterns(missionType: string): Promise<CollectiveMemoryEntry[]> {
    if (this.isFallbackMode) {
      console.log('❌ [FALLBACK] Getting failure patterns for mission type:', missionType);
      return [];
    }

    const { data, error } = await this.supabase!
      .from('collective_memory')
      .select('*')
      .eq('mission_type', missionType)
      .in('outcome', ['failure', 'partial_success'])
      .not('failure_patterns', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw new Error(`Failed to get failure patterns: ${error.message}`);
    return data || [];
  }

  // Get collaborative learning insights
  async getCollaborativeInsights(agentIds: string[]): Promise<CollectiveMemoryEntry[]> {
    if (this.isFallbackMode) {
      console.log('🤝 [FALLBACK] Getting collaborative insights for agents:', agentIds);
      return [];
    }

    const { data, error } = await this.supabase!
      .from('collective_memory')
      .select('*')
      .in('agent_id', agentIds)
      .eq('outcome', 'success')
      .gte('impact_score', 6)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw new Error(`Failed to get collaborative insights: ${error.message}`);
    return data || [];
  }

  // Create mission orchestration
  async createMissionOrchestration(mission: Omit<MissionOrchestration, 'mission_id' | 'status'>): Promise<MissionOrchestration> {
    if (this.isFallbackMode) {
      console.log('🚀 [FALLBACK] Mission orchestration would be created:', mission);
      return {
        ...mission,
        mission_id: `fallback-mission-${Date.now()}`,
        status: 'planning',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    const { data, error } = await this.supabase!
      .from('mission_orchestrations')
      .insert({
        ...mission,
        mission_id: `mission-${Date.now()}`,
        status: 'planning',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create mission orchestration: ${error.message}`);
    return data;
  }

  // Update mission progress
  async updateMissionProgress(missionId: string, progress: number, status?: string): Promise<void> {
    if (this.isFallbackMode) {
      console.log('📈 [FALLBACK] Mission progress update:', { missionId, progress, status });
      return;
    }

    const updateData: any = {
      current_progress: progress,
      updated_at: new Date().toISOString()
    };

    if (status) updateData.status = status;
    if (progress === 100) updateData.actual_completion = new Date().toISOString();

    const { error } = await this.supabase!
      .from('mission_orchestrations')
      .update(updateData)
      .eq('mission_id', missionId);

    if (error) throw new Error(`Failed to update mission progress: ${error.message}`);
  }

  // Get mission recommendations based on agent capabilities
  async getMissionRecommendations(agentCapabilities: string[]): Promise<MissionOrchestration[]> {
    if (this.isFallbackMode) {
      console.log('🎯 [FALLBACK] Getting mission recommendations for capabilities:', agentCapabilities);
      // Return a mock mission for testing
      return [{
        mission_id: 'fallback-mission-001',
        mission_type: 'functionality',
        priority: 'high',
        status: 'planning',
        assigned_agents: ['captain-picard', 'lieutenant-data'],
        required_capabilities: agentCapabilities,
        success_criteria: ['Complete core functionality', 'Achieve 95% completion rate'],
        current_progress: 0,
        estimated_completion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        lessons_learned: [],
        next_missions: [],
        lcars_layout_config: {
          theme: 'standard-orange',
          panels: ['Mission Status', 'Progress Tracking', 'Resource Allocation'],
          data_visualizations: ['Progress Bar', 'Timeline Chart'],
          priority_indicators: true,
          dynamic_elements: true
        }
      }];
    }

    const { data, error } = await this.supabase!
      .from('mission_orchestrations')
      .select('*')
      .contains('required_capabilities', agentCapabilities)
      .eq('status', 'planning')
      .order('priority', { ascending: false })
      .limit(5);

    if (error) throw new Error(`Failed to get mission recommendations: ${error.message}`);
    return data || [];
  }

  // Analyze collective intelligence trends
  async analyzeCollectiveIntelligence(): Promise<{
    overall_success_rate: number;
    top_performing_agents: string[];
    most_effective_approaches: string[];
    common_failure_patterns: string[];
    learning_opportunities: string[];
    collaboration_insights: string[];
  }> {
    if (this.isFallbackMode) {
      console.log('📊 [FALLBACK] Analyzing collective intelligence with mock data');
      return {
        overall_success_rate: 87.5,
        top_performing_agents: ['Captain Picard', 'Lieutenant Data', 'Chief Engineer Scott'],
        most_effective_approaches: ['Strategic Planning', 'Technical Implementation', 'Collaborative Problem Solving'],
        common_failure_patterns: ['Resource Constraints', 'Timeline Pressure', 'Communication Gaps'],
        learning_opportunities: ['Enhanced collaboration', 'Pattern recognition', 'Failure prevention'],
        collaboration_insights: ['Multi-agent coordination', 'Knowledge sharing', 'Collective problem solving']
      };
    }

    // Get overall success rate
    const { data: successData } = await this.supabase!
      .from('collective_memory')
      .select('outcome');

    const totalEntries = successData?.length || 0;
    const successfulEntries = successData?.filter(entry => entry.outcome === 'success').length || 0;
    const overallSuccessRate = totalEntries > 0 ? (successfulEntries / totalEntries) * 100 : 0;

    // Get top performing agents
    const { data: agentPerformance } = await this.supabase!
      .from('collective_memory')
      .select('agent_name, outcome, impact_score')
      .eq('outcome', 'success')
      .gte('impact_score', 7)
      .order('impact_score', { ascending: false })
      .limit(10);

    const topPerformingAgents = agentPerformance?.map(entry => entry.agent_name) || [];

    // Get most effective approaches
    const { data: approachData } = await this.supabase!
      .from('collective_memory')
      .select('approach_used, outcome, impact_score')
      .eq('outcome', 'success')
      .gte('impact_score', 6);

    const approachEffectiveness = approachData?.reduce((acc, entry) => {
      acc[entry.approach_used] = (acc[entry.approach_used] || 0) + entry.impact_score;
      return acc;
    }, {} as Record<string, number>) || {};

    const mostEffectiveApproaches = Object.entries(approachEffectiveness)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([approach]) => approach);

    // Get common failure patterns
    const { data: failureData } = await this.supabase!
      .from('collective_memory')
      .select('failure_patterns')
      .not('failure_patterns', 'is', null)
      .limit(20);

    const failurePatterns = failureData?.map(entry => entry.failure_patterns?.error_type).filter(Boolean) || [];

    return {
      overall_success_rate: overallSuccessRate,
      top_performing_agents: topPerformingAgents,
      most_effective_approaches: mostEffectiveApproaches,
      common_failure_patterns: failurePatterns,
      learning_opportunities: ['Enhanced collaboration', 'Pattern recognition', 'Failure prevention'],
      collaboration_insights: ['Multi-agent coordination', 'Knowledge sharing', 'Collective problem solving']
    };
  }

  // Get LCARS layout recommendations based on mission context
  async getLCARSLayoutRecommendations(missionType: string, priority: string): Promise<{
    theme: string;
    panels: string[];
    data_visualizations: string[];
    priority_indicators: boolean;
    dynamic_elements: boolean;
  }> {
    if (this.isFallbackMode) {
      console.log('🎨 [FALLBACK] Getting LCARS layout recommendations for:', missionType, priority);
    }

    // Get successful layouts for similar missions
    const { data: layoutData } = await this.supabase
      ?.from('collective_memory')
      .select('lcars_layout_config')
      .eq('mission_type', missionType)
      .eq('outcome', 'success')
      .gte('impact_score', 7)
      .limit(5) || { data: null };

    if (layoutData && layoutData.length > 0) {
      // Return the most successful layout configuration
      return layoutData[0].lcars_layout_config;
    }

    // Default layout based on mission type and priority
    const defaultLayouts = {
      functionality: {
        theme: priority === 'critical' ? 'emergency-red' : 'standard-orange',
        panels: ['Mission Status', 'Progress Tracking', 'Resource Allocation', 'Success Metrics'],
        data_visualizations: ['Progress Bar', 'Timeline Chart', 'Resource Usage', 'Completion Rate'],
        priority_indicators: true,
        dynamic_elements: true
      },
      ui_refinement: {
        theme: 'standard-orange',
        panels: ['Design Patterns', 'Component Library', 'User Feedback', 'A/B Test Results'],
        data_visualizations: ['Pattern Usage', 'User Satisfaction', 'Performance Metrics', 'Design Consistency'],
        priority_indicators: false,
        dynamic_elements: true
      },
      revenue_generation: {
        theme: 'success-green',
        panels: ['Revenue Dashboard', 'Client Pipeline', 'Payment Status', 'Growth Metrics'],
        data_visualizations: ['Revenue Chart', 'Client Funnel', 'Payment Timeline', 'Growth Rate'],
        priority_indicators: true,
        dynamic_elements: true
      }
    };

    return defaultLayouts[missionType as keyof typeof defaultLayouts] || defaultLayouts.functionality;
  }
}

// Export singleton instance
export const collectiveMemoryService = new EnhancedCollectiveMemoryService();
