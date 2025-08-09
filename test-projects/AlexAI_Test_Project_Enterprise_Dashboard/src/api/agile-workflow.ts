// Agile Workflow API Integration with AlexAI Crew Coordination

export interface AgileTask {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'sprint-backlog' | 'in-progress' | 'code-review' | 'testing' | 'done';
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  storyPoints: number;
  labels: string[];
  sprintId?: string;
  crewMember?: string;
  aiInsights?: {
    complexity: string;
    estimatedHours: number;
    suggestedApproach: string;
    riskFactors: string[];
    recommendedCrewMember: string;
  };
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  status: 'planning' | 'active' | 'completed';
  tasks: string[];
  velocity: number;
}

export class AgileWorkflowAPI {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // Task Management
  async createTask(task: Partial<AgileTask>): Promise<AgileTask> {
    // Get AI insights for the new task
    const aiInsights = await this.getAITaskInsights(task.title || '', task.description || '');
    
    const taskWithInsights = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      aiInsights
    };

    // Notify crew of new task
    await this.notifyCrewOfTaskCreation(taskWithInsights);
    
    return taskWithInsights as AgileTask;
  }

  async updateTask(taskId: string, updates: Partial<AgileTask>): Promise<AgileTask> {
    // Notify crew of task update
    await this.notifyCrewOfTaskUpdate(taskId, updates);
    
    // Return updated task (in real implementation, this would come from backend)
    return { ...updates, id: taskId } as AgileTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    // Notify crew of task deletion
    await this.notifyCrewOfTaskDeletion(taskId);
  }

  // Sprint Management
  async createSprint(sprint: Partial<Sprint>): Promise<Sprint> {
    const newSprint = {
      ...sprint,
      id: `sprint-${Date.now()}`,
      status: 'planning' as const
    };

    // Get crew input on sprint planning
    await this.getCrewSprintInput(newSprint);
    
    return newSprint as Sprint;
  }

  // AI Crew Integration
  private async getAITaskInsights(title: string, description: string) {
    try {
      const response = await fetch(`${this.baseUrl}/crew/lieutenant-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Analyze this agile task for insights: "${title}" - ${description}`,
          context: 'agile-task-analysis',
          urgency: 'normal'
        })
      });

      if (response.ok) {
        const result = await response.json();
        return this.parseAIInsights(result.response);
      }
    } catch (error) {
      console.error('Failed to get AI insights:', error);
    }

    return {
      complexity: 'medium',
      estimatedHours: 8,
      suggestedApproach: 'Standard development approach',
      riskFactors: ['Time estimation'],
      recommendedCrewMember: 'data'
    };
  }

  private parseAIInsights(aiResponse: any) {
    // Parse AI response to extract structured insights
    return {
      complexity: this.extractComplexity(aiResponse),
      estimatedHours: this.extractEstimatedHours(aiResponse),
      suggestedApproach: this.extractApproach(aiResponse),
      riskFactors: this.extractRiskFactors(aiResponse),
      recommendedCrewMember: this.extractRecommendedCrew(aiResponse)
    };
  }

  private extractComplexity(response: any): string {
    const text = JSON.stringify(response).toLowerCase();
    if (text.includes('very complex') || text.includes('highly complex')) return 'very-high';
    if (text.includes('complex') || text.includes('difficult')) return 'high';
    if (text.includes('moderate') || text.includes('medium')) return 'medium';
    if (text.includes('simple') || text.includes('easy')) return 'low';
    return 'medium';
  }

  private extractEstimatedHours(response: any): number {
    const text = JSON.stringify(response);
    const hourMatches = text.match(/(\d+)\s*hours?/i);
    if (hourMatches) return parseInt(hourMatches[1]);
    
    const dayMatches = text.match(/(\d+)\s*days?/i);
    if (dayMatches) return parseInt(dayMatches[1]) * 8;
    
    return 8; // Default estimate
  }

  private extractApproach(response: any): string {
    const message = response.message || response.analysis || JSON.stringify(response);
    // Extract key recommendations from the response
    return message.length > 100 ? message.substring(0, 100) + '...' : message;
  }

  private extractRiskFactors(response: any): string[] {
    const text = JSON.stringify(response).toLowerCase();
    const risks = [];
    
    if (text.includes('deadline') || text.includes('time')) risks.push('Time constraints');
    if (text.includes('complex') || text.includes('difficult')) risks.push('Technical complexity');
    if (text.includes('dependency') || text.includes('depend')) risks.push('Dependencies');
    if (text.includes('api') || text.includes('integration')) risks.push('Integration challenges');
    
    return risks.length > 0 ? risks : ['Standard project risks'];
  }

  private extractRecommendedCrew(response: any): string {
    const text = JSON.stringify(response).toLowerCase();
    
    if (text.includes('technical') || text.includes('code')) return 'data';
    if (text.includes('engineering') || text.includes('infrastructure')) return 'scott';
    if (text.includes('security') || text.includes('protect')) return 'worf';
    if (text.includes('strategy') || text.includes('leadership')) return 'picard';
    if (text.includes('team') || text.includes('communication')) return 'troi';
    if (text.includes('logic') || text.includes('analysis')) return 'spock';
    
    return 'data'; // Default to Data for technical tasks
  }

  // Crew Notification Methods
  private async notifyCrewOfTaskCreation(task: Partial<AgileTask>) {
    try {
      await fetch(`${this.baseUrl}/crew/observation-lounge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `New agile task created: "${task.title}"`,
          context: 'agile-task-creation',
          urgency: task.priority === 'critical' ? 'high' : 'normal',
          taskData: task
        })
      });
    } catch (error) {
      console.error('Failed to notify crew of task creation:', error);
    }
  }

  private async notifyCrewOfTaskUpdate(taskId: string, updates: Partial<AgileTask>) {
    try {
      await fetch(`${this.baseUrl}/crew/dynamic-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Agile task updated: ${taskId}`,
          context: 'agile-task-update',
          urgency: 'normal',
          taskData: { id: taskId, ...updates }
        })
      });
    } catch (error) {
      console.error('Failed to notify crew of task update:', error);
    }
  }

  private async notifyCrewOfTaskDeletion(taskId: string) {
    try {
      await fetch(`${this.baseUrl}/crew/observation-lounge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Agile task deleted: ${taskId}`,
          context: 'agile-task-deletion',
          urgency: 'low'
        })
      });
    } catch (error) {
      console.error('Failed to notify crew of task deletion:', error);
    }
  }

  private async getCrewSprintInput(sprint: Partial<Sprint>) {
    try {
      await fetch(`${this.baseUrl}/crew/captain-picard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Sprint planning input needed for: "${sprint.name}"`,
          context: 'agile-sprint-planning',
          urgency: 'normal',
          sprintData: sprint
        })
      });
    } catch (error) {
      console.error('Failed to get crew sprint input:', error);
    }
  }

  // Agile Metrics
  async getSprintMetrics(sprintId: string) {
    // In real implementation, this would calculate actual metrics
    return {
      completedStoryPoints: 22,
      totalStoryPoints: 34,
      velocity: 22,
      burndownData: [34, 30, 25, 22, 18, 15, 12, 8, 5, 2, 0],
      teamEfficiency: 0.87
    };
  }
}

export default AgileWorkflowAPI;
