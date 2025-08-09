import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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
  const onDragEnd = async (result: DropResult) => {
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

                  <Droppable droppableId={column.id} isDropDisabled={false}>
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
