#!/bin/zsh

# 🚀 Agile Test Project Creator
# Creates a comprehensive test project with full agile workflow and Kanban board

set -e

echo "🚀 AGILE TEST PROJECT CREATOR"
echo "============================="
echo "🎯 Creating test project with full agile workflow"
echo "📋 Includes: Kanban board, UI/UX, crew integration"
echo ""

PROJECT_NAME="AlexAI_Test_Project_Enterprise_Dashboard"
PROJECT_DIR="test-projects/$PROJECT_NAME"

# Create project structure
echo "📁 Creating project structure..."
mkdir -p "$PROJECT_DIR"/{src,docs,tests,assets}
mkdir -p "$PROJECT_DIR"/src/{components,pages,api,hooks,utils,types}
mkdir -p "$PROJECT_DIR"/src/components/{kanban,agile,ui,crew}

# Create the main project configuration
cat > "$PROJECT_DIR/project.json" << 'EOF'
{
  "name": "AlexAI Test Project - Enterprise Dashboard",
  "version": "1.0.0",
  "type": "agile-test-project",
  "created": "2025-08-09",
  "status": "active",
  "methodology": "agile-scrum",
  "tools": {
    "kanban": "custom-react-implementation",
    "crew": "alexai-n8n-integration",
    "ui": "nextjs-tailwind-lcars"
  },
  "sprints": [
    {
      "id": "sprint-1",
      "name": "Foundation Sprint",
      "duration": "2 weeks",
      "goals": [
        "Set up Kanban board UI",
        "Integrate AlexAI crew coordination",
        "Implement basic agile workflow",
        "Test end-to-end functionality"
      ]
    }
  ],
  "team": {
    "product_owner": "Captain Picard",
    "scrum_master": "Lieutenant Data",
    "developers": ["Chief Engineer Scott", "Lieutenant Worf"],
    "stakeholders": ["Counselor Troi", "Commander Spock"]
  }
}
EOF

echo "✅ Project configuration created"

# Create enhanced Kanban board component
cat > "$PROJECT_DIR/src/components/kanban/AgileKanbanBoard.tsx" << 'EOF'
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  storyPoints: number;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  crewMember?: string;
  aiInsights?: {
    complexity: string;
    estimatedHours: number;
    suggestedApproach: string;
    riskFactors: string[];
  };
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
  color: string;
  wipLimit?: number;
}

interface KanbanData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

const AgileKanbanBoard: React.FC = () => {
  const [kanbanData, setKanbanData] = useState<KanbanData>({
    tasks: {
      'task-1': {
        id: 'task-1',
        title: 'Set up Kanban Board UI',
        description: 'Create responsive Kanban board with drag-and-drop functionality',
        assignee: 'Chief Engineer Scott',
        priority: 'high',
        storyPoints: 8,
        labels: ['frontend', 'ui/ux'],
        createdAt: '2025-08-09T10:00:00Z',
        updatedAt: '2025-08-09T10:00:00Z',
        crewMember: 'scott',
        aiInsights: {
          complexity: 'high',
          estimatedHours: 16,
          suggestedApproach: 'Use React Beautiful DnD for drag-and-drop, implement LCARS design system',
          riskFactors: ['Complex state management', 'Mobile responsiveness']
        }
      },
      'task-2': {
        id: 'task-2',
        title: 'Integrate AlexAI Crew Coordination',
        description: 'Connect Kanban board with n8n crew workflow system',
        assignee: 'Lieutenant Data',
        priority: 'critical',
        storyPoints: 13,
        labels: ['integration', 'ai', 'backend'],
        createdAt: '2025-08-09T10:00:00Z',
        updatedAt: '2025-08-09T10:00:00Z',
        crewMember: 'data',
        aiInsights: {
          complexity: 'very-high',
          estimatedHours: 24,
          suggestedApproach: 'Use webhook integration with real-time updates via WebSocket',
          riskFactors: ['API rate limits', 'Real-time synchronization', 'Error handling']
        }
      },
      'task-3': {
        id: 'task-3',
        title: 'Implement Agile Metrics Dashboard',
        description: 'Create burndown charts, velocity tracking, and sprint analytics',
        assignee: 'Lieutenant Worf',
        priority: 'medium',
        storyPoints: 5,
        labels: ['analytics', 'charts'],
        createdAt: '2025-08-09T10:00:00Z',
        updatedAt: '2025-08-09T10:00:00Z',
        crewMember: 'worf',
        aiInsights: {
          complexity: 'medium',
          estimatedHours: 12,
          suggestedApproach: 'Use Chart.js or D3.js for visualizations',
          riskFactors: ['Data accuracy', 'Performance with large datasets']
        }
      }
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'Product Backlog',
        taskIds: ['task-1'],
        color: '#1f2937',
        wipLimit: 10
      },
      'column-2': {
        id: 'column-2',
        title: 'Sprint Backlog',
        taskIds: [],
        color: '#374151',
        wipLimit: 8
      },
      'column-3': {
        id: 'column-3',
        title: 'In Progress',
        taskIds: ['task-2'],
        color: '#f59e0b',
        wipLimit: 4
      },
      'column-4': {
        id: 'column-4',
        title: 'Code Review',
        taskIds: [],
        color: '#8b5cf6',
        wipLimit: 3
      },
      'column-5': {
        id: 'column-5',
        title: 'Testing',
        taskIds: ['task-3'],
        color: '#06b6d4',
        wipLimit: 3
      },
      'column-6': {
        id: 'column-6',
        title: 'Done',
        taskIds: [],
        color: '#10b981'
      }
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6']
  });

  const [isCrewConnected, setIsCrewConnected] = useState(false);
  const [lastCrewUpdate, setLastCrewUpdate] = useState<string>('');

  // Connect to AlexAI crew coordination
  useEffect(() => {
    const connectToCrew = async () => {
      try {
        const response = await fetch('/api/crew/observation-lounge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'Initialize agile project coordination',
            context: 'kanban-board-startup',
            urgency: 'normal'
          })
        });
        
        if (response.ok) {
          setIsCrewConnected(true);
          setLastCrewUpdate(new Date().toISOString());
        }
      } catch (error) {
        console.error('Failed to connect to crew:', error);
      }
    };

    connectToCrew();
  }, []);

  // Handle drag and drop
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = kanbanData.columns[source.droppableId];
    const finishColumn = kanbanData.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      // Moving within the same column
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds
      };

      setKanbanData({
        ...kanbanData,
        columns: {
          ...kanbanData.columns,
          [newColumn.id]: newColumn
        }
      });
    } else {
      // Moving to a different column
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds
      };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinishColumn = {
        ...finishColumn,
        taskIds: finishTaskIds
      };

      setKanbanData({
        ...kanbanData,
        columns: {
          ...kanbanData.columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn
        }
      });

      // Notify crew of task movement
      await notifyCrewOfTaskUpdate(draggableId, finishColumn.title);
    }
  };

  // Notify AlexAI crew of task updates
  const notifyCrewOfTaskUpdate = async (taskId: string, newStatus: string) => {
    const task = kanbanData.tasks[taskId];
    if (!task || !isCrewConnected) return;

    try {
      await fetch('/api/crew/dynamic-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Task "${task.title}" moved to ${newStatus}`,
          context: 'agile-workflow-update',
          urgency: task.priority === 'critical' ? 'high' : 'normal',
          taskData: {
            id: taskId,
            title: task.title,
            assignee: task.assignee,
            newStatus: newStatus,
            crewMember: task.crewMember
          }
        })
      });
      setLastCrewUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Failed to notify crew:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCrewMemberIcon = (crewMember: string) => {
    const icons = {
      'picard': '🖖',
      'data': '🤖',
      'troi': '💫',
      'scott': '⚙️',
      'spock': '🔬',
      'worf': '🛡️'
    };
    return icons[crewMember as keyof typeof icons] || '👤';
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          🚀 AlexAI Agile Project Dashboard
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <span className={`px-2 py-1 rounded ${isCrewConnected ? 'bg-green-600' : 'bg-red-600'}`}>
            Crew Status: {isCrewConnected ? 'Connected' : 'Disconnected'}
          </span>
          {lastCrewUpdate && (
            <span className="text-gray-400">
              Last Update: {new Date(lastCrewUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanData.columnOrder.map((columnId) => {
            const column = kanbanData.columns[columnId];
            const tasks = column.taskIds.map(taskId => kanbanData.tasks[taskId]);

            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{column.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {tasks.length}
                        {column.wipLimit && `/${column.wipLimit}`}
                      </span>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                    </div>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-32 ${
                          snapshot.isDraggingOver ? 'bg-gray-700' : ''
                        } rounded-md transition-colors`}
                      >
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 p-3 bg-gray-700 rounded-md shadow-md ${
                                  snapshot.isDragging ? 'rotate-1 shadow-xl' : ''
                                } transition-transform hover:shadow-lg`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-sm">{task.title}</h4>
                                  <div className="flex items-center gap-1">
                                    <span className="text-lg">
                                      {getCrewMemberIcon(task.crewMember || '')}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                                  </div>
                                </div>
                                
                                <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                                  {task.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-400">{task.assignee}</span>
                                  <span className="bg-blue-600 px-2 py-1 rounded">
                                    {task.storyPoints} SP
                                  </span>
                                </div>
                                
                                {task.aiInsights && (
                                  <div className="mt-2 p-2 bg-gray-600 rounded text-xs">
                                    <div className="text-yellow-400 font-medium">AI Insights:</div>
                                    <div>Complexity: {task.aiInsights.complexity}</div>
                                    <div>Est. Hours: {task.aiInsights.estimatedHours}</div>
                                  </div>
                                )}
                                
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {task.labels.map(label => (
                                    <span key={label} className="px-1 py-0.5 bg-purple-600 text-xs rounded">
                                      {label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Sprint Metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Sprint Progress</h3>
          <div className="text-2xl font-bold text-blue-400">3/8 tasks</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Story Points</h3>
          <div className="text-2xl font-bold text-green-400">26 SP</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Velocity</h3>
          <div className="text-2xl font-bold text-yellow-400">22 SP/sprint</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Team Efficiency</h3>
          <div className="text-2xl font-bold text-purple-400">87%</div>
        </div>
      </div>
    </div>
  );
};

export default AgileKanbanBoard;
EOF

echo "✅ Enhanced Kanban board component created"

# Create agile workflow API integration
cat > "$PROJECT_DIR/src/api/agile-workflow.ts" << 'EOF'
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
EOF

echo "✅ Agile workflow API integration created"

# Create test suite for the agile workflow
cat > "$PROJECT_DIR/tests/agile-workflow.test.js" << 'EOF'
// Agile Workflow Test Suite
// Tests the complete agile workflow integration with AlexAI crew coordination

const AgileWorkflowAPI = require('../src/api/agile-workflow');

describe('AlexAI Agile Workflow Integration', () => {
  let agileAPI;

  beforeEach(() => {
    agileAPI = new AgileWorkflowAPI();
  });

  describe('Task Management', () => {
    test('should create task with AI insights', async () => {
      const taskData = {
        title: 'Implement user authentication',
        description: 'Create secure login system with JWT tokens',
        priority: 'high',
        assignee: 'Lieutenant Data'
      };

      const task = await agileAPI.createTask(taskData);
      
      expect(task.id).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.aiInsights).toBeDefined();
      expect(task.aiInsights.complexity).toBeDefined();
      expect(task.aiInsights.estimatedHours).toBeGreaterThan(0);
    });

    test('should recommend appropriate crew member based on task type', async () => {
      const technicalTask = {
        title: 'Optimize database queries',
        description: 'Improve performance of user data retrieval'
      };

      const task = await agileAPI.createTask(technicalTask);
      expect(['data', 'scott']).toContain(task.aiInsights.recommendedCrewMember);
    });

    test('should classify task complexity correctly', async () => {
      const complexTask = {
        title: 'Implement real-time collaborative editing',
        description: 'Build complex real-time synchronization system'
      };

      const task = await agileAPI.createTask(complexTask);
      expect(['high', 'very-high']).toContain(task.aiInsights.complexity);
    });
  });

  describe('Sprint Management', () => {
    test('should create sprint with crew input', async () => {
      const sprintData = {
        name: 'Sprint 1 - Foundation',
        goal: 'Set up basic project infrastructure',
        startDate: '2025-08-09',
        endDate: '2025-08-23'
      };

      const sprint = await agileAPI.createSprint(sprintData);
      
      expect(sprint.id).toBeDefined();
      expect(sprint.name).toBe(sprintData.name);
      expect(sprint.status).toBe('planning');
    });
  });

  describe('AI Crew Integration', () => {
    test('should extract complexity from AI response', async () => {
      const mockResponse = {
        message: 'This is a highly complex task requiring extensive technical knowledge'
      };

      const complexity = agileAPI.extractComplexity(mockResponse);
      expect(complexity).toBe('high');
    });

    test('should estimate hours from AI response', async () => {
      const mockResponse = {
        analysis: 'This task will take approximately 16 hours to complete'
      };

      const hours = agileAPI.extractEstimatedHours(mockResponse);
      expect(hours).toBe(16);
    });

    test('should identify risk factors', async () => {
      const mockResponse = {
        message: 'This has API integration dependencies and tight deadlines'
      };

      const risks = agileAPI.extractRiskFactors(mockResponse);
      expect(risks).toContain('Integration challenges');
      expect(risks).toContain('Time constraints');
    });
  });

  describe('Metrics and Analytics', () => {
    test('should calculate sprint metrics', async () => {
      const metrics = await agileAPI.getSprintMetrics('sprint-1');
      
      expect(metrics.completedStoryPoints).toBeDefined();
      expect(metrics.totalStoryPoints).toBeDefined();
      expect(metrics.velocity).toBeDefined();
      expect(metrics.teamEfficiency).toBeBetween(0, 1);
    });
  });
});

// Helper function for range testing
expect.extend({
  toBeBetween(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be between ${floor} and ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be between ${floor} and ${ceiling}`,
        pass: false,
      };
    }
  },
});
EOF

echo "✅ Test suite created"

echo ""
echo "🎊 AGILE TEST PROJECT CREATED!"
echo "============================="
echo ""
echo "📁 Project location: $PROJECT_DIR"
echo ""
echo "✅ Components created:"
echo "   • Enhanced Kanban board with drag-and-drop"
echo "   • AlexAI crew integration"
echo "   • Agile workflow API"
echo "   • Comprehensive test suite"
echo "   • Sprint metrics and analytics"
echo ""
echo "🎯 Features included:"
echo "   • Real-time crew coordination"
echo "   • AI-powered task insights"
echo "   • Story point estimation"
echo "   • Risk factor analysis"
echo "   • Crew member recommendations"
echo "   • Sprint planning integration"
echo ""
echo "🚀 Ready for integration testing!"
EOF
