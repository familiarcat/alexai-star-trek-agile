// LCARS Workflow System Data Models
// Mr. Data - Analytical Intelligence Division

export interface WorkflowStage {
  id: string;
  name: string;
  color: string; // LCARS color palette
  order: number;
  maxTasks?: number;
  rules?: WorkflowRule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowTask {
  id: string;
  title: string;
  description?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  assignee?: string;
  assigneeId?: string;
  dueDate?: Date;
  progress: number; // 0-100
  tags: string[];
  comments: number;
  attachments: number;
  stageId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy?: string;
  lastModifiedAt: Date;
}

export interface WorkflowBoard {
  id: string;
  name: string;
  projectId: string;
  stages: WorkflowStage[];
  tasks: WorkflowTask[];
  realTimeUpdates: boolean;
  workflowType: 'kanban' | 'scrum' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowRule {
  id: string;
  name: string;
  condition: WorkflowCondition;
  action: WorkflowAction;
  enabled: boolean;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  value: any;
}

export interface WorkflowAction {
  type: 'move-task' | 'assign-user' | 'set-priority' | 'add-tag' | 'send-notification';
  parameters: Record<string, any>;
}

export interface WorkflowActivity {
  id: string;
  boardId: string;
  taskId?: string;
  userId: string;
  action: 'task-created' | 'task-moved' | 'task-assigned' | 'task-completed' | 'stage-added' | 'rule-triggered';
  details: Record<string, any>;
  timestamp: Date;
}

export interface WorkflowMetrics {
  boardId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  backlogTasks: number;
  averageCycleTime: number;
  velocity: number;
  throughput: number;
  lastUpdated: Date;
}

// Real-time collaboration interfaces
export interface WorkflowPresence {
  userId: string;
  userName: string;
  boardId: string;
  currentTaskId?: string;
  status: 'online' | 'away' | 'busy';
  lastSeen: Date;
}

export interface WorkflowConflict {
  id: string;
  taskId: string;
  userId: string;
  conflictType: 'simultaneous-edit' | 'stage-conflict' | 'assignment-conflict';
  resolution: 'auto-resolve' | 'manual-resolve' | 'user-choice';
  createdAt: Date;
  resolvedAt?: Date;
}
