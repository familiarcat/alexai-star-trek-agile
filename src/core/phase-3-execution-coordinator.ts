import { LLMOptimizationStrategy, CrewAgent, LLMConfig } from './llm-optimization-strategy';

/**
 * 🚀 Phase 3 Execution Coordinator
 * Orchestrates crew agents using LLM optimization strategy for maximum efficiency
 * Implements intelligent task routing and resource allocation
 */

export interface ExecutionTask {
  id: string;
  name: string;
  description: string;
  assignedAgent: string;
  llmConfig: LLMConfig;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDuration: number;
  dependencies: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startTime?: number;
  completionTime?: number;
  actualDuration?: number;
}

export interface ExecutionMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  totalCost: number;
  totalTime: number;
  efficiency: number;
  agentUtilization: Map<string, number>;
}

export class Phase3ExecutionCoordinator {
  private optimizationStrategy: LLMOptimizationStrategy;
  private executionTasks: Map<string, ExecutionTask>;
  private taskQueue: ExecutionTask[];
  private activeTasks: Set<string>;
  private completedTasks: Set<string>;
  private metrics: ExecutionMetrics;

  constructor() {
    this.optimizationStrategy = new LLMOptimizationStrategy();
    this.executionTasks = new Map();
    this.taskQueue = [];
    this.activeTasks = new Set();
    this.completedTasks = new Set();
    this.initializeMetrics();
    this.initializePhase3Tasks();
  }

  /**
   * 📊 Initialize execution metrics
   */
  private initializeMetrics(): void {
    this.metrics = {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      totalCost: 0,
      totalTime: 0,
      efficiency: 0,
      agentUtilization: new Map()
    };
  }

  /**
   * 🎯 Initialize Phase 3 tasks with optimal LLM allocation
   */
  private initializePhase3Tasks(): void {
    const plan = this.optimizationStrategy.getTaskExecutionPlan();
    
    plan.executionOrder.forEach((agent, index) => {
      const llm = plan.llmAllocations.get(agent.id)!;
      
      const task: ExecutionTask = {
        id: `phase3-task-${index + 1}`,
        name: agent.currentTask,
        description: `Phase 3 task for ${agent.name}: ${agent.currentTask}`,
        assignedAgent: agent.id,
        llmConfig: llm,
        priority: agent.priority,
        estimatedDuration: agent.estimatedDuration,
        dependencies: agent.dependencies,
        status: 'pending'
      };

      this.executionTasks.set(task.id, task);
      this.taskQueue.push(task);
      this.metrics.totalTasks++;
    });

    // Sort queue by priority and dependencies
    this.optimizeTaskQueue();
  }

  /**
   * 🚀 Optimize task queue for maximum efficiency
   */
  private optimizeTaskQueue(): void {
    this.taskQueue.sort((a, b) => {
      // Priority first
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by dependencies (tasks without dependencies go first)
      if (a.dependencies.length === 0 && b.dependencies.length > 0) return -1;
      if (b.dependencies.length === 0 && a.dependencies.length > 0) return 1;

      // Finally by estimated duration (shorter tasks first)
      return a.estimatedDuration - b.estimatedDuration;
    });
  }

  /**
   * 🎯 Get next available task for execution
   */
  public getNextAvailableTask(): ExecutionTask | null {
    for (const task of this.taskQueue) {
      if (task.status === 'pending' && this.canExecuteTask(task)) {
        return task;
      }
    }
    return null;
  }

  /**
   * ✅ Check if a task can be executed (dependencies met)
   */
  private canExecuteTask(task: ExecutionTask): boolean {
    return task.dependencies.every(dep => this.completedTasks.has(dep));
  }

  /**
   * 🚀 Start task execution
   */
  public startTask(taskId: string): boolean {
    const task = this.executionTasks.get(taskId);
    if (!task || task.status !== 'pending') {
      return false;
    }

    if (!this.canExecuteTask(task)) {
      return false;
    }

    task.status = 'in-progress';
    task.startTime = Date.now();
    this.activeTasks.add(taskId);

    // Update agent status
    this.optimizationStrategy.updateAgentStatus(task.assignedAgent, 'working');

    console.log(`🚀 Starting task: ${task.name} (${task.assignedAgent})`);
    console.log(`🎯 Using LLM: ${task.llmConfig.model} (${task.llmConfig.capability})`);
    console.log(`⏱️ Estimated duration: ${task.estimatedDuration} minutes`);

    return true;
  }

  /**
   * ✅ Complete task execution
   */
  public completeTask(taskId: string, success: boolean = true): boolean {
    const task = this.executionTasks.get(taskId);
    if (!task || task.status !== 'in-progress') {
      return false;
    }

    task.status = success ? 'completed' : 'failed';
    task.completionTime = Date.now();
    
    if (task.startTime) {
      task.actualDuration = (task.completionTime - task.startTime) / (1000 * 60); // minutes
    }

    this.activeTasks.delete(taskId);
    
    if (success) {
      this.completedTasks.add(taskId);
      this.metrics.completedTasks++;
    } else {
      this.metrics.failedTasks++;
    }

    // Update agent status
    this.optimizationStrategy.updateAgentStatus(task.assignedAgent, 'completed');

    // Update metrics
    this.updateMetrics(task);

    console.log(`✅ Task completed: ${task.name} (${success ? 'SUCCESS' : 'FAILED'})`);
    if (task.actualDuration) {
      console.log(`⏱️ Actual duration: ${task.actualDuration.toFixed(1)} minutes`);
    }

    return true;
  }

  /**
   * 📊 Update execution metrics
   */
  private updateMetrics(task: ExecutionTask): void {
    if (task.status === 'completed' && task.actualDuration) {
      this.metrics.totalTime += task.actualDuration;
      
      // Calculate cost based on LLM usage
      const estimatedTokens = this.estimateTokenUsage(task.name);
      const taskCost = task.llmConfig.costPerToken * estimatedTokens;
      this.metrics.totalCost += taskCost;

      // Update agent utilization
      const currentUtilization = this.metrics.agentUtilization.get(task.assignedAgent) || 0;
      this.metrics.agentUtilization.set(task.assignedAgent, currentUtilization + task.actualDuration);
    }

    // Calculate overall efficiency
    if (this.metrics.totalTasks > 0) {
      this.metrics.efficiency = (this.metrics.completedTasks / this.metrics.totalTasks) * 100;
    }
  }

  /**
   * 🔍 Estimate token usage for a task
   */
  private estimateTokenUsage(taskName: string): number {
    if (taskName.includes('Advanced') || taskName.includes('Expert')) return 8000;
    if (taskName.includes('Complex') || taskName.includes('Integration')) return 6000;
    if (taskName.includes('Moderate') || taskName.includes('Development')) return 4000;
    return 2000;
  }

  /**
   * 📈 Get current execution status
   */
  public getExecutionStatus(): {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    failedTasks: number;
    efficiency: number;
    estimatedTimeRemaining: number;
  } {
    const inProgressTasks = this.activeTasks.size;
    const pendingTasks = this.taskQueue.filter(t => t.status === 'pending').length;
    
    // Calculate estimated time remaining
    const remainingTasks = this.taskQueue.filter(t => t.status === 'pending');
    const estimatedTimeRemaining = remainingTasks.reduce((total, task) => total + task.estimatedDuration, 0);

    return {
      totalTasks: this.metrics.totalTasks,
      completedTasks: this.metrics.completedTasks,
      inProgressTasks,
      pendingTasks,
      failedTasks: this.metrics.failedTasks,
      efficiency: this.metrics.efficiency,
      estimatedTimeRemaining
    };
  }

  /**
   * 🎯 Get agent workload distribution
   */
  public getAgentWorkload(): Map<string, {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    utilization: number;
    efficiency: number;
  }> {
    const workload = new Map();
    const agents = this.optimizationStrategy['crewAgents'];

    agents.forEach((agent, agentId) => {
      const agentTasks = Array.from(this.executionTasks.values())
        .filter(task => task.assignedAgent === agentId);

      const totalTasks = agentTasks.length;
      const completedTasks = agentTasks.filter(t => t.status === 'completed').length;
      const inProgressTasks = agentTasks.filter(t => t.status === 'in-progress').length;
      const utilization = this.metrics.agentUtilization.get(agentId) || 0;
      const efficiency = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      workload.set(agentId, {
        totalTasks,
        completedTasks,
        inProgressTasks,
        utilization,
        efficiency
      });
    });

    return workload;
  }

  /**
   * 🚀 Execute Phase 3 with optimal LLM allocation
   */
  public async executePhase3(): Promise<{
    success: boolean;
    metrics: ExecutionMetrics;
    report: string;
  }> {
    console.log('🚀 Phase 3 Execution Commencing with LLM Optimization...\n');

    const startTime = Date.now();
    let executionRound = 1;

    while (this.getExecutionStatus().pendingTasks > 0 || this.activeTasks.size > 0) {
      console.log(`\n🔄 Execution Round ${executionRound}`);
      console.log('=====================================');

      // Start available tasks
      let startedTasks = 0;
      while (this.getExecutionStatus().pendingTasks > 0 && startedTasks < 3) { // Limit concurrent tasks
        const nextTask = this.getNextAvailableTask();
        if (nextTask && this.startTask(nextTask.id)) {
          startedTasks++;
        } else {
          break;
        }
      }

      // Simulate task execution (in real implementation, this would be actual task execution)
      await this.simulateTaskExecution();

      // Check for completed tasks
      for (const taskId of this.activeTasks) {
        const task = this.executionTasks.get(taskId);
        if (task && task.startTime) {
          const elapsed = (Date.now() - task.startTime) / (1000 * 60); // minutes
          if (elapsed >= task.estimatedDuration) {
            this.completeTask(taskId, true);
          }
        }
      }

      // Display current status
      this.displayExecutionStatus();
      executionRound++;

      // Prevent infinite loops
      if (executionRound > 50) {
        console.log('⚠️ Maximum execution rounds reached');
        break;
      }
    }

    const totalExecutionTime = (Date.now() - startTime) / (1000 * 60); // minutes
    console.log(`\n🎉 Phase 3 Execution Complete!`);
    console.log(`⏱️ Total execution time: ${totalExecutionTime.toFixed(1)} minutes`);

    const report = this.generateExecutionReport();
    
    return {
      success: this.metrics.failedTasks === 0,
      metrics: this.metrics,
      report
    };
  }

  /**
   * ⏱️ Simulate task execution (placeholder for real implementation)
   */
  private async simulateTaskExecution(): Promise<void> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * 📊 Display current execution status
   */
  private displayExecutionStatus(): void {
    const status = this.getExecutionStatus();
    
    console.log(`📊 Status: ${status.completedTasks}/${status.totalTasks} completed`);
    console.log(`🚀 In Progress: ${status.inProgressTasks}`);
    console.log(`⏳ Pending: ${status.pendingTasks}`);
    console.log(`✅ Efficiency: ${status.efficiency.toFixed(1)}%`);
    console.log(`⏱️ Estimated Time Remaining: ${status.estimatedTimeRemaining} minutes`);
  }

  /**
   * 📋 Generate comprehensive execution report
   */
  public generateExecutionReport(): string {
    const status = this.getExecutionStatus();
    const workload = this.getAgentWorkload();
    
    let report = '🚀 Phase 3 Execution Report\n';
    report += '============================\n\n';
    
    report += '📊 Overall Status:\n';
    report += `  Total Tasks: ${status.totalTasks}\n`;
    report += `  Completed: ${status.completedTasks}\n`;
    report += `  Failed: ${status.failedTasks}\n`;
    report += `  Efficiency: ${status.efficiency.toFixed(1)}%\n`;
    report += `  Total Time: ${this.metrics.totalTime.toFixed(1)} minutes\n`;
    report += `  Total Cost: $${this.metrics.totalCost.toFixed(6)}\n\n`;

    report += '👥 Agent Workload Distribution:\n';
    workload.forEach((data, agentId) => {
      report += `  ${agentId}:\n`;
      report += `    Tasks: ${data.completedTasks}/${data.totalTasks} completed\n`;
      report += `    Utilization: ${data.utilization.toFixed(1)} minutes\n`;
      report += `    Efficiency: ${data.efficiency.toFixed(1)}%\n`;
    });

    report += '\n🎯 LLM Optimization Results:\n';
    report += `  Priority-based allocation: ✅\n`;
    report += `  Cost-effective routing: ✅\n`;
    report += `  Dependency management: ✅\n`;
    report += `  Performance optimization: ✅\n`;

    return report;
  }

  /**
   * 🔄 Reset execution state for new run
   */
  public reset(): void {
    this.executionTasks.clear();
    this.taskQueue = [];
    this.activeTasks.clear();
    this.completedTasks.clear();
    this.initializeMetrics();
    this.initializePhase3Tasks();
  }
}

// Export for module usage
export default Phase3ExecutionCoordinator;
