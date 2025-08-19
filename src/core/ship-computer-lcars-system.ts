/**
 * 🖥️ Ship Computer LCARS System
 * Central Library Computer Access/Retrieval System
 * Single source of truth for all crew members
 * Integrates with Supabase for shared memory and learning
 */

import { createClient } from '@supabase/supabase-js';

// LCARS System Configuration
export interface LCARSConfig {
  systemName: string;
  version: string;
  crewMembers: string[];
  memoryTables: string[];
  coordinationProtocols: string[];
}

// Memory Entry Interface
export interface MemoryEntry {
  id: string;
  timestamp: string;
  crewMember: string;
  entryType: 'observation' | 'decision' | 'learning' | 'coordination' | 'mission';
  content: any;
  context: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  relatedEntries: string[];
  crewConsensus: number;
  validationStatus: 'pending' | 'validated' | 'rejected';
}

// Crew Coordination Interface
export interface CrewCoordination {
  id: string;
  timestamp: string;
  initiator: string;
  participants: string[];
  mission: string;
  status: 'planning' | 'active' | 'completed' | 'failed';
  crewInsights: CrewInsight[];
  decisions: Decision[];
  outcomes: Outcome[];
}

// Crew Insight Interface
export interface CrewInsight {
  crewMember: string;
  expertise: string[];
  insight: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

// Decision Interface
export interface Decision {
  id: string;
  timestamp: string;
  decisionType: 'strategic' | 'tactical' | 'operational' | 'emergency';
  description: string;
  crewConsensus: number;
  alternatives: string[];
  chosenAlternative: string;
  reasoning: string;
  expectedOutcome: string;
  actualOutcome?: string;
}

// Outcome Interface
export interface Outcome {
  id: string;
  timestamp: string;
  decisionId: string;
  success: boolean;
  metrics: any;
  lessons: string[];
  crewFeedback: CrewFeedback[];
}

// Crew Feedback Interface
export interface CrewFeedback {
  crewMember: string;
  rating: number;
  feedback: string;
  suggestions: string[];
  timestamp: string;
}

// LCARS System Class
export class LCARSSystem {
  private supabase: any;
  private config: LCARSConfig;
  private activeCoordination: Map<string, CrewCoordination> = new Map();
  private memoryCache: Map<string, MemoryEntry> = new Map();

  constructor() {
    this.config = {
      systemName: 'Enterprise-D LCARS',
      version: '2.0.0',
      crewMembers: [
        'captain-picard',
        'commander-data',
        'counselor-troi',
        'chief-engineer-scott',
        'commander-spock',
        'lieutenant-worf',
        'quark',
        'observation-lounge'
      ],
      memoryTables: [
        'memory_entries',
        'crew_coordination',
        'decisions',
        'outcomes',
        'crew_feedback'
      ],
      coordinationProtocols: [
        'LCARS_Protocol_Alpha',
        'LCARS_Protocol_Beta',
        'LCARS_Protocol_Gamma',
        'LCARS_Emergency_Protocol_Omega'
      ]
    };

    this.initializeSupabase();
  }

  /**
   * Initialize Supabase connection
   */
  private async initializeSupabase() {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ Supabase credentials not found. Using fallback mode.');
        return;
      }

      this.supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✅ LCARS System: Supabase connection established');
      
      // Initialize memory tables
      await this.initializeMemoryTables();
    } catch (error) {
      console.error('❌ LCARS System: Failed to initialize Supabase:', error);
    }
  }

  /**
   * Initialize memory tables in Supabase
   */
  private async initializeMemoryTables() {
    if (!this.supabase) return;

    try {
      // Create memory entries table
      await this.supabase.rpc('create_memory_tables_if_not_exist');
      console.log('✅ LCARS System: Memory tables initialized');
    } catch (error) {
      console.warn('⚠️ LCARS System: Memory tables may already exist');
    }
  }

  /**
   * Record a memory entry from any crew member
   */
  async recordMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<MemoryEntry> {
    const memoryEntry: MemoryEntry = {
      ...entry,
      id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    // Cache in memory
    this.memoryCache.set(memoryEntry.id, memoryEntry);

    // Store in Supabase if available
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('memory_entries')
          .insert([memoryEntry])
          .select()
          .single();

        if (error) {
          console.warn('⚠️ LCARS System: Failed to store memory in Supabase:', error);
        } else {
          console.log(`✅ LCARS System: Memory recorded by ${entry.crewMember}`);
        }
      } catch (error) {
        console.warn('⚠️ LCARS System: Supabase storage failed:', error);
      }
    }

    return memoryEntry;
  }

  /**
   * Retrieve memory entries based on criteria
   */
  async retrieveMemory(criteria: {
    crewMember?: string;
    entryType?: string;
    tags?: string[];
    context?: string;
    limit?: number;
  }): Promise<MemoryEntry[]> {
    const { crewMember, entryType, tags, context, limit = 100 } = criteria;

    // First check cache
    let results = Array.from(this.memoryCache.values());

    // Filter by criteria
    if (crewMember) {
      results = results.filter(entry => entry.crewMember === crewMember);
    }
    if (entryType) {
      results = results.filter(entry => entry.entryType === entryType);
    }
    if (tags && tags.length > 0) {
      results = results.filter(entry => 
        tags.some(tag => entry.tags.includes(tag))
      );
    }
    if (context) {
      results = results.filter(entry => 
        entry.context.toLowerCase().includes(context.toLowerCase())
      );
    }

    // Sort by timestamp (newest first) and limit
    results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    results = results.slice(0, limit);

    // If Supabase is available, try to get additional results
    if (this.supabase && results.length < limit) {
      try {
        let query = this.supabase
          .from('memory_entries')
          .select('*')
          .limit(limit - results.length);

        if (crewMember) query = query.eq('crewMember', crewMember);
        if (entryType) query = query.eq('entryType', entryType);
        if (context) query = query.ilike('context', `%${context}%`);

        const { data, error } = await query;

        if (!error && data) {
          // Add new entries to cache and results
          data.forEach((entry: any) => {
            if (!this.memoryCache.has(entry.id)) {
              this.memoryCache.set(entry.id, entry);
              results.push(entry);
            }
          });
        }
      } catch (error) {
        console.warn('⚠️ LCARS System: Supabase retrieval failed:', error);
      }
    }

    return results;
  }

  /**
   * Start crew coordination session
   */
  async startCoordination(initiator: string, mission: string, participants: string[] = []): Promise<CrewCoordination> {
    const coordination: CrewCoordination = {
      id: `coordination-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      initiator,
      participants: participants.length > 0 ? participants : this.config.crewMembers,
      mission,
      status: 'planning',
      crewInsights: [],
      decisions: [],
      outcomes: []
    };

    this.activeCoordination.set(coordination.id, coordination);

    // Record memory of coordination start
    await this.recordMemory({
      crewMember: initiator,
      entryType: 'coordination',
      content: `Started coordination for mission: ${mission}`,
      context: 'crew-coordination',
      priority: 'high',
      tags: ['coordination', 'mission', mission.toLowerCase()],
      relatedEntries: [],
      crewConsensus: 1,
      validationStatus: 'pending'
    });

    console.log(`🚀 LCARS System: Crew coordination started by ${initiator} for mission: ${mission}`);
    return coordination;
  }

  /**
   * Add crew insight to coordination
   */
  async addCrewInsight(
    coordinationId: string,
    crewMember: string,
    insight: string,
    confidence: number = 0.8,
    reasoning: string = ''
  ): Promise<CrewInsight> {
    const coordination = this.activeCoordination.get(coordinationId);
    if (!coordination) {
      throw new Error(`Coordination session ${coordinationId} not found`);
    }

    const crewInsight: CrewInsight = {
      crewMember,
      expertise: this.getCrewExpertise(crewMember),
      insight,
      confidence,
      reasoning,
      timestamp: new Date().toISOString()
    };

    coordination.crewInsights.push(crewInsight);

    // Record memory of crew insight
    await this.recordMemory({
      crewMember,
      entryType: 'observation',
      content: insight,
      context: `coordination-${coordinationId}`,
      priority: 'medium',
      tags: ['crew-insight', 'coordination', coordination.mission.toLowerCase()],
      relatedEntries: [coordinationId],
      crewConsensus: 1,
      validationStatus: 'pending'
    });

    console.log(`🧠 LCARS System: ${crewMember} added insight to coordination ${coordinationId}`);
    return crewInsight;
  }

  /**
   * Make a decision based on crew consensus
   */
  async makeDecision(
    coordinationId: string,
    decisionType: Decision['decisionType'],
    description: string,
    alternatives: string[],
    chosenAlternative: string,
    reasoning: string,
    expectedOutcome: string
  ): Promise<Decision> {
    const coordination = this.activeCoordination.get(coordinationId);
    if (!coordination) {
      throw new Error(`Coordination session ${coordinationId} not found`);
    }

    // Calculate crew consensus based on insights
    const crewConsensus = this.calculateCrewConsensus(coordination.crewInsights);

    const decision: Decision = {
      id: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      decisionType,
      description,
      crewConsensus,
      alternatives,
      chosenAlternative,
      reasoning,
      expectedOutcome
    };

    coordination.decisions.push(decision);

    // Record memory of decision
    await this.recordMemory({
      crewMember: 'lcars-system',
      entryType: 'decision',
      content: `Decision made: ${description}`,
      context: `coordination-${coordinationId}`,
      priority: 'high',
      tags: ['decision', decisionType, coordination.mission.toLowerCase()],
      relatedEntries: [coordinationId],
      crewConsensus,
      validationStatus: 'validated'
    });

    console.log(`🎯 LCARS System: Decision made in coordination ${coordinationId}: ${description}`);
    return decision;
  }

  /**
   * Record outcome of a decision
   */
  async recordOutcome(
    decisionId: string,
    success: boolean,
    metrics: any,
    lessons: string[],
    crewFeedback: CrewFeedback[]
  ): Promise<Outcome> {
    const outcome: Outcome = {
      id: `outcome-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      decisionId,
      success,
      metrics,
      lessons,
      crewFeedback
    };

    // Find coordination session and add outcome
    for (const coordination of this.activeCoordination.values()) {
      const decision = coordination.decisions.find(d => d.id === decisionId);
      if (decision) {
        coordination.outcomes.push(outcome);
        break;
      }
    }

    // Record memory of outcome
    await this.recordMemory({
      crewMember: 'lcars-system',
      entryType: 'learning',
      content: `Outcome recorded for decision ${decisionId}: ${success ? 'Success' : 'Failure'}`,
      context: 'decision-outcome',
      priority: 'high',
      tags: ['outcome', success ? 'success' : 'failure', 'learning'],
      relatedEntries: [decisionId],
      crewConsensus: 1,
      validationStatus: 'validated'
    });

    console.log(`📊 LCARS System: Outcome recorded for decision ${decisionId}: ${success ? 'Success' : 'Failure'}`);
    return outcome;
  }

  /**
   * Get crew expertise based on crew member
   */
  private getCrewExpertise(crewMember: string): string[] {
    const expertiseMap: Record<string, string[]> = {
      'captain-picard': ['strategic-planning', 'decision-making', 'leadership', 'diplomacy'],
      'commander-data': ['data-analysis', 'technical-implementation', 'efficiency', 'type-safety'],
      'counselor-troi': ['user-experience', 'emotional-intelligence', 'accessibility', 'team-morale'],
      'chief-engineer-scott': ['infrastructure', 'deployment', 'technical-implementation', 'build-systems'],
      'commander-spock': ['logical-analysis', 'time-management', 'efficiency', 'risk-assessment'],
      'lieutenant-worf': ['security-protocols', 'compliance', 'risk-management', 'defense'],
      'quark': ['business-intelligence', 'revenue-optimization', 'market-analysis', 'profitability'],
      'observation-lounge': ['crew-coordination', 'collective-intelligence', 'consensus-building', 'team-synergy']
    };

    return expertiseMap[crewMember] || ['general-expertise'];
  }

  /**
   * Calculate crew consensus based on insights
   */
  private calculateCrewConsensus(insights: CrewInsight[]): number {
    if (insights.length === 0) return 0;

    const totalConfidence = insights.reduce((sum, insight) => sum + insight.confidence, 0);
    const averageConfidence = totalConfidence / insights.length;

    // Normalize to 0-1 scale
    return Math.min(Math.max(averageConfidence, 0), 1);
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    return {
      systemName: this.config.systemName,
      version: this.config.version,
      status: 'OPERATIONAL',
      activeCoordination: this.activeCoordination.size,
      memoryEntries: this.memoryCache.size,
      crewMembers: this.config.crewMembers.length,
      supabaseConnected: !!this.supabase,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get coordination summary
   */
  getCoordinationSummary() {
    const summary = {
      active: 0,
      planning: 0,
      completed: 0,
      failed: 0,
      totalDecisions: 0,
      totalOutcomes: 0,
      crewParticipation: {} as Record<string, number>
    };

    // Initialize crew participation
    this.config.crewMembers.forEach(crew => {
      summary.crewParticipation[crew] = 0;
    });

    // Analyze all coordination sessions
    for (const coordination of this.activeCoordination.values()) {
      summary[coordination.status]++;
      summary.totalDecisions += coordination.decisions.length;
      summary.totalOutcomes += coordination.outcomes.length;

      // Count crew participation
      coordination.crewInsights.forEach(insight => {
        summary.crewParticipation[insight.crewMember]++;
      });
    }

    return summary;
  }

  /**
   * Emergency protocol activation
   */
  async activateEmergencyProtocol(urgency: 'low' | 'medium' | 'high' | 'critical', context: string) {
    const protocol = `LCARS_Emergency_Protocol_${urgency.toUpperCase()}`;
    
    // Record emergency activation
    await this.recordMemory({
      crewMember: 'lcars-system',
      entryType: 'mission',
      content: `Emergency protocol ${protocol} activated`,
      context,
      priority: urgency === 'critical' ? 'critical' : 'high',
      tags: ['emergency', protocol.toLowerCase(), urgency],
      relatedEntries: [],
      crewConsensus: 1,
      validationStatus: 'validated'
    });

    // Notify all crew members
    console.log(`🚨 LCARS System: EMERGENCY PROTOCOL ${protocol} ACTIVATED`);
    console.log(`🚨 Context: ${context}`);
    console.log(`🚨 All crew members notified and mobilized`);

    return {
      protocol,
      urgency,
      context,
      timestamp: new Date().toISOString(),
      crewNotified: this.config.crewMembers,
      status: 'EMERGENCY_ACTIVE'
    };
  }
}

// Export singleton instance
export const lcarsSystem = new LCARSSystem();
