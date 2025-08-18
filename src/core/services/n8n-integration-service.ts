/**
 * 🚀 Enhanced n8n Integration Service
 * Provides seamless integration between Next.js SSR, n8n workflows, and LCARS DataProvider
 * Enables server-side orchestration of data and UI components
 */

import { lcarsSystem } from '../ship-computer-lcars-system';

// n8n Workflow Types
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: N8nNode[];
  connections: Record<string, any>;
  settings: any;
  tags: string[];
  versionId: string;
  meta: {
    instanceId: string;
    templateCredsSetupCompleted: boolean;
  };
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: any;
  webhookId?: string;
}

// LCARS-n8n Integration Types
export interface LCARSWorkflowExecution {
  id: string;
  workflowId: string;
  crewMember: string;
  context: string;
  input: any;
  output: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  error?: string;
  performance: {
    responseTime: number;
    memoryUsage: number;
    crewConsensus: number;
  };
}

export interface LCARSDataOrchestration {
  id: string;
  mission: string;
  crewMembers: string[];
  workflows: string[];
  dataRequirements: string[];
  uiComponents: string[];
  status: 'planning' | 'executing' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  results: any;
}

// Enhanced n8n Integration Service
export class N8nIntegrationService {
  private baseUrl: string;
  private apiKey: string;
  private lcarsSystem: typeof lcarsSystem;
  private activeExecutions: Map<string, LCARSWorkflowExecution> = new Map();
  private orchestrations: Map<string, LCARSDataOrchestration> = new Map();

  constructor() {
    this.baseUrl = process.env.N8N_URL || process.env.NEXT_PUBLIC_N8N_URL || '';
    this.apiKey = process.env.N8N_API_KEY || process.env.NEXT_PUBLIC_N8N_API_KEY || '';
    this.lcarsSystem = lcarsSystem;
  }

  /**
   * Initialize n8n Integration Service
   */
  async initialize(): Promise<boolean> {
    try {
      if (!this.baseUrl || !this.apiKey) {
        console.warn('⚠️ n8n credentials not configured');
        return false;
      }

      // Test connection
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('✅ n8n Integration Service initialized successfully');
        return true;
      } else {
        console.error('❌ n8n connection failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ n8n initialization failed:', error);
      return false;
    }
  }

  /**
   * Get all available workflows
   */
  async getWorkflows(): Promise<N8nWorkflow[]> {
    try {
      if (!this.baseUrl || !this.apiKey) {
        throw new Error('n8n credentials not configured');
      }

      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`n8n API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch n8n workflows:', error);
      return [];
    }
  }

  /**
   * Execute a workflow with LCARS orchestration
   */
  async executeWorkflow(
    workflowId: string,
    crewMember: string,
    context: string,
    input: any
  ): Promise<LCARSWorkflowExecution> {
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const execution: LCARSWorkflowExecution = {
      id: executionId,
      workflowId,
      crewMember,
      context,
      input,
      output: null,
      status: 'pending',
      startTime: new Date().toISOString(),
      performance: {
        responseTime: 0,
        memoryUsage: 0,
        crewConsensus: 0,
      },
    };

    // Add to active executions
    this.activeExecutions.set(executionId, execution);

    try {
      // Update status to running
      execution.status = 'running';
      
      // Execute workflow via n8n webhook or API
      const output = await this.executeWorkflowViaN8n(workflowId, input);
      
      // Update execution
      execution.output = output;
      execution.status = 'completed';
      execution.endTime = new Date().toISOString();
      execution.performance.responseTime = Date.now() - new Date(execution.startTime).getTime();

      // Record in LCARS memory
      await this.lcarsSystem.recordMemory({
        crewMember: 'n8n-integration-service',
        entryType: 'coordination',
        content: {
          executionId,
          workflowId,
          crewMember,
          context,
          input,
          output,
          performance: execution.performance,
        },
        context: 'workflow-execution',
        priority: 'medium',
        tags: ['n8n', 'workflow', 'execution', crewMember],
        relatedEntries: [],
        crewConsensus: 0.9,
        validationStatus: 'validated',
      });

      return execution;
    } catch (error) {
      // Update execution with error
      execution.status = 'failed';
      execution.endTime = new Date().toISOString();
      execution.error = error instanceof Error ? error.message : 'Unknown error';

      // Record error in LCARS memory
      await this.lcarsSystem.recordMemory({
        crewMember: 'n8n-integration-service',
        entryType: 'observation',
        content: {
          executionId,
          workflowId,
          crewMember,
          context,
          error: execution.error,
          timestamp: new Date().toISOString(),
        },
        context: 'workflow-execution-error',
        priority: 'high',
        tags: ['n8n', 'workflow', 'error', crewMember],
        relatedEntries: [],
        crewConsensus: 1.0,
        validationStatus: 'validated',
      });

      throw error;
    } finally {
      // Remove from active executions
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * Execute workflow via n8n API
   */
  private async executeWorkflowViaN8n(workflowId: string, input: any): Promise<any> {
    try {
      // Try webhook execution first
      const webhookResult = await this.executeWorkflowViaWebhook(workflowId, input);
      if (webhookResult) {
        return webhookResult;
      }

      // Fallback to API execution
      return await this.executeWorkflowViaAPI(workflowId, input);
    } catch (error) {
      console.error('Failed to execute workflow via n8n:', error);
      throw error;
    }
  }

  /**
   * Execute workflow via webhook
   */
  private async executeWorkflowViaWebhook(workflowId: string, input: any): Promise<any> {
    try {
      // Get workflow details to find webhook nodes
      const workflows = await this.getWorkflows();
      const workflow = workflows.find(w => w.id === workflowId);
      
      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      // Find webhook nodes
      const webhookNodes = workflow.nodes.filter(node => 
        node.type === 'n8n-nodes-base.webhook' && node.webhookId
      );

      if (webhookNodes.length === 0) {
        return null; // No webhook nodes found
      }

      // Execute via first webhook
      const webhookNode = webhookNodes[0];
      const webhookUrl = `${this.baseUrl}/webhook/${webhookNode.webhookId}`;

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Webhook execution failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Webhook execution failed:', error);
      return null;
    }
  }

  /**
   * Execute workflow via n8n API
   */
  private async executeWorkflowViaAPI(workflowId: string, input: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'X-N8N-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n API execution failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API execution failed:', error);
      throw error;
    }
  }

  /**
   * Orchestrate data and UI components through LCARS
   */
  async orchestrateDataAndUI(
    mission: string,
    crewMembers: string[],
    workflows: string[],
    dataRequirements: string[],
    uiComponents: string[]
  ): Promise<LCARSDataOrchestration> {
    const orchestrationId = `orch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const orchestration: LCARSDataOrchestration = {
      id: orchestrationId,
      mission,
      crewMembers,
      workflows,
      dataRequirements,
      uiComponents,
      status: 'planning',
      startTime: new Date().toISOString(),
      results: {},
    };

    // Add to orchestrations
    this.orchestrations.set(orchestrationId, orchestration);

    try {
      // Start orchestration
      orchestration.status = 'executing';

      // Coordinate crew members
      const crewCoordination = await this.lcarsSystem.startCoordination(
        'n8n-integration-service',
        mission,
        crewMembers
      );

      // Execute workflows in parallel
      const workflowResults = await Promise.allSettled(
        workflows.map(workflowId =>
          this.executeWorkflow(workflowId, 'orchestration-service', mission, {
            mission,
            crewMembers,
            dataRequirements,
            uiComponents,
          })
        )
      );

      // Process results
      const results = {
        crewCoordination,
        workflowResults: workflowResults.map((result, index) => ({
          workflowId: workflows[index],
          result: result.status === 'fulfilled' ? result.value : result.reason,
        })),
        dataCollected: dataRequirements.map(req => ({
          requirement: req,
          status: 'collected',
          timestamp: new Date().toISOString(),
        })),
        uiComponentsReady: uiComponents.map(comp => ({
          component: comp,
          status: 'ready',
          timestamp: new Date().toISOString(),
        })),
      };

      orchestration.results = results;
      orchestration.status = 'completed';
      orchestration.endTime = new Date().toISOString();

      // Record orchestration in LCARS memory
      await this.lcarsSystem.recordMemory({
        crewMember: 'n8n-integration-service',
        entryType: 'coordination',
        content: {
          orchestrationId,
          mission,
          crewMembers,
          workflows,
          results,
          performance: {
            totalTime: Date.now() - new Date(orchestration.startTime).getTime(),
            workflowsExecuted: workflows.length,
            crewMembersCoordinated: crewMembers.length,
          },
        },
        context: 'data-ui-orchestration',
        priority: 'high',
        tags: ['orchestration', 'data', 'ui', 'crew-coordination'],
        relatedEntries: [],
        crewConsensus: 0.95,
        validationStatus: 'validated',
      });

      return orchestration;
    } catch (error) {
      orchestration.status = 'failed';
      orchestration.endTime = new Date().toISOString();
      orchestration.results = { error: error instanceof Error ? error.message : 'Unknown error' };

      // Record error in LCARS memory
      await this.lcarsSystem.recordMemory({
        crewMember: 'n8n-integration-service',
        entryType: 'observation',
        content: {
          orchestrationId,
          mission,
          error: orchestration.results.error,
          timestamp: new Date().toISOString(),
        },
        context: 'orchestration-error',
        priority: 'critical',
        tags: ['orchestration', 'error', 'crew-coordination'],
        relatedEntries: [],
        crewConsensus: 1.0,
        validationStatus: 'validated',
      });

      throw error;
    }
  }

  /**
   * Get active executions
   */
  getActiveExecutions(): LCARSWorkflowExecution[] {
    return Array.from(this.activeExecutions.values());
  }

  /**
   * Get orchestrations
   */
  getOrchestrations(): LCARSDataOrchestration[] {
    return Array.from(this.orchestrations.values());
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    return {
      connected: !!(this.baseUrl && this.apiKey),
      activeExecutions: this.activeExecutions.size,
      activeOrchestrations: this.orchestrations.size,
      baseUrl: this.baseUrl,
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const n8nIntegrationService = new N8nIntegrationService();
