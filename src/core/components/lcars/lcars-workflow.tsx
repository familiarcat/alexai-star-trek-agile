'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  UserIcon, 
  ClockIcon, 
  TagIcon, 
  ChatBubbleLeftIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlusIcon,
  SignalIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { WorkflowStage, WorkflowTask, WorkflowBoard } from '@/core/types/workflow';

interface LCARSWorkflowBoardProps {
  board: WorkflowBoard;
  onTaskMove: (taskId: string, sourceStageId: string, destinationStageId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<WorkflowTask>) => void;
  onTaskCreate: (stageId: string, task: Omit<WorkflowTask, 'id' | 'createdAt' | 'updatedAt' | 'lastModifiedAt'>) => void;
}

interface UserPresence {
  userId: string;
  userName: string;
  isOnline: boolean;
  currentTask?: string;
  lastSeen: string;
}

export function LCARSWorkflowBoard({ board, onTaskMove, onTaskUpdate, onTaskCreate }: LCARSWorkflowBoardProps) {
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [creatingTaskFor, setCreatingTaskFor] = useState<string | null>(null);
  const [userPresence, setUserPresence] = useState<UserPresence[]>([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState<boolean>(true);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<WorkflowTask>>({});

  useEffect(() => {
    // Initialize real-time user presence
    const mockUsers: UserPresence[] = [
      {
        userId: '1',
        userName: 'Captain Picard',
        isOnline: true,
        lastSeen: new Date().toISOString(),
        currentTask: '1'
      },
      {
        userId: '2',
        userName: 'Commander Data',
        isOnline: true,
        lastSeen: new Date().toISOString(),
        currentTask: '3'
      },
      {
        userId: '3',
        userName: 'Geordi La Forge',
        isOnline: false,
        lastSeen: new Date(Date.now() - 300000).toISOString()
      }
    ];
    setUserPresence(mockUsers);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (realTimeUpdates) {
        // Update task timestamps
        board.tasks.forEach(task => {
          task.lastModifiedAt = new Date();
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [board.tasks, realTimeUpdates]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      onTaskMove(draggableId, source.droppableId, destination.droppableId);
      
      // Update user presence for the moved task
      setUserPresence(prev => 
        prev.map(user => 
          user.currentTask === draggableId 
            ? { ...user, currentTask: destination.droppableId }
            : user
        )
      );
    }
  };

  const handleCreateTask = (stageId: string) => {
    if (!newTaskTitle.trim()) return;

    const newTask: Omit<WorkflowTask, 'id' | 'createdAt' | 'updatedAt' | 'lastModifiedAt'> = {
      title: newTaskTitle,
      priority: 'medium',
      status: 'backlog',
      progress: 0,
      tags: [],
      comments: 0,
      attachments: 0,
      stageId,
      projectId: board.projectId,
    };

    onTaskCreate(stageId, newTask);
    setNewTaskTitle('');
    setCreatingTaskFor(null);
  };

  const startEditingTask = (task: WorkflowTask) => {
    setEditingTask(task.id);
    setEditData(task);
    
    // Update user presence
    setUserPresence(prev => 
      prev.map(user => 
        user.userName === 'Captain Picard' 
          ? { ...user, currentTask: task.id }
          : user
      )
    );
  };

  const saveTaskEdit = (taskId: string) => {
    onTaskUpdate(taskId, editData);
    setEditingTask(null);
    setEditData({});
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'lcars-text-red';
      case 'high': return 'lcars-text-orange';
      case 'medium': return 'lcars-text-yellow';
      case 'low': return 'lcars-text-green';
      default: return 'lcars-text-grey';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'high': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'medium': return <ArrowRightIcon className="w-4 h-4" />;
      case 'low': return <CheckCircleIcon className="w-4 h-4" />;
      default: return <ArrowRightIcon className="w-4 h-4" />;
    }
  };

  const getStageProgress = (stageId: string) => {
    const stageTasks = board.tasks.filter(task => task.stageId === stageId);
    if (stageTasks.length === 0) return 0;
    
    const totalProgress = stageTasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / stageTasks.length);
  };

  return (
    <div className="lcars-workflow-board">
      {/* Real-time Header */}
      <div className="lcars-workflow-header">
        <div className="lcars-header-content">
          <h2 className="lcars-title">{board.name}</h2>
          <div className="lcars-workflow-stats">
            <span className="lcars-stat">Total Tasks: {board.tasks.length}</span>
            <span className="lcars-stat">Completed: {board.tasks.filter(t => t.status === 'done').length}</span>
            <span className="lcars-stat">In Progress: {board.tasks.filter(t => t.status === 'in-progress').length}</span>
          </div>
        </div>
        
        {/* Real-time Indicators */}
        <div className="lcars-realtime-controls">
          <div className="lcars-online-indicator">
            <SignalIcon className="w-4 h-4 lcars-text-green" />
            <span className="lcars-text-white">
              {userPresence.filter(u => u.isOnline).length} crew online
            </span>
          </div>
          <button
            onClick={() => setRealTimeUpdates(!realTimeUpdates)}
            className={`lcars-button lcars-button-small ${realTimeUpdates ? 'lcars-button-success' : 'lcars-button-secondary'}`}
          >
            <SignalIcon className="w-4 h-4" />
            <span className="lcars-ml-2">
              {realTimeUpdates ? 'Real-time ON' : 'Real-time OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* User Presence Panel */}
      <div className="lcars-user-presence-panel">
        <div className="lcars-text-medium lcars-text-gold lcars-mb-10">ACTIVE CREW</div>
        <div className="lcars-flex lcars-gap-10 lcars-flex-wrap">
          {userPresence.map((user) => (
            <div key={user.userId} className="lcars-user-indicator">
              <div className={`lcars-user-avatar ${user.isOnline ? 'lcars-online' : 'lcars-offline'}`}>
                <UserIcon className="w-3 h-3" />
              </div>
              <span className="lcars-text-white lcars-text-sm">{user.userName}</span>
              {user.currentTask && (
                <div className="lcars-current-task">
                  <EyeIcon className="w-3 h-3 lcars-text-blue" />
                  <span className="lcars-text-blue lcars-text-xs">Task {user.currentTask}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="lcars-workflow-columns">
          {board.stages.map((stage) => {
            const stageTasks = board.tasks.filter(task => task.stageId === stage.id);
            const stageProgress = getStageProgress(stage.id);
            
            return (
              <div key={stage.id} className="lcars-workflow-column">
                <div 
                  className="lcars-stage-header"
                  style={{ backgroundColor: stage.color }}
                >
                  <div className="lcars-stage-info">
                    <h3 className="lcars-stage-title">{stage.name}</h3>
                    <div className="lcars-stage-meta">
                      <span className="lcars-task-count">{stageTasks.length} tasks</span>
                      <div className="lcars-stage-progress">
                        <div className="lcars-progress-bar">
                          <div 
                            className="lcars-progress-fill"
                            style={{ width: `${stageProgress}%`, backgroundColor: stage.color }}
                          />
                        </div>
                        <span className="lcars-progress-text">{stageProgress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setCreatingTaskFor(stage.id)}
                    className="lcars-add-task-button"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Create Task Form */}
                {creatingTaskFor === stage.id && (
                  <div className="lcars-create-task-form">
                    <input
                      type="text"
                      placeholder="Enter task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="lcars-input lcars-mb-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateTask(stage.id)}
                    />
                    <div className="lcars-form-actions">
                      <button
                        onClick={() => handleCreateTask(stage.id)}
                        className="lcars-button lcars-button-success lcars-mr-10"
                        disabled={!newTaskTitle.trim()}
                      >
                        Create
                      </button>
                      <button
                        onClick={() => {
                          setCreatingTaskFor(null);
                          setNewTaskTitle('');
                        }}
                        className="lcars-button lcars-button-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`lcars-stage-content ${snapshot.isDraggingOver ? 'lcars-dragging-over' : ''}`}
                    >
                      {stageTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`lcars-task-card ${snapshot.isDragging ? 'lcars-dragging' : ''}`}
                            >
                              {editingTask === task.id ? (
                                <div className="lcars-task-editing">
                                  <input
                                    type="text"
                                    value={editData.title || task.title}
                                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                                    className="lcars-input lcars-mb-10"
                                  />
                                  <textarea
                                    value={editData.description || task.description || ''}
                                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                                    className="lcars-textarea lcars-mb-10"
                                    rows={2}
                                    placeholder="Task description..."
                                  />
                                  <div className="lcars-edit-actions">
                                    <button
                                      onClick={() => saveTaskEdit(task.id)}
                                      className="lcars-button lcars-button-success lcars-mr-10"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingTask(null);
                                        setEditData({});
                                      }}
                                      className="lcars-button lcars-button-secondary"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="lcars-task-header">
                                    <div className="lcars-task-priority">
                                      <span className={getPriorityColor(task.priority)}>
                                        {getPriorityIcon(task.priority)}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => startEditingTask(task)}
                                      className="lcars-edit-button"
                                    >
                                      <PlusIcon className="w-3 h-3" />
                                    </button>
                                  </div>
                                  
                                  <div className="lcars-task-content">
                                    <h4 className="lcars-task-title">{task.title}</h4>
                                    {task.description && (
                                      <p className="lcars-task-description">{task.description}</p>
                                    )}
                                  </div>
                                  
                                  <div className="lcars-task-meta">
                                    {task.assignee && (
                                      <div className="lcars-task-assignee">
                                        <UserIcon className="w-3 h-3" />
                                        <span>{task.assignee}</span>
                                      </div>
                                    )}
                                    
                                    <div className="lcars-task-progress">
                                      <div className="lcars-progress-bar">
                                        <div 
                                          className="lcars-progress-fill"
                                          style={{ width: `${task.progress}%`, backgroundColor: stage.color }}
                                        />
                                      </div>
                                      <span className="lcars-progress-text">{task.progress}%</span>
                                    </div>
                                  </div>
                                  
                                  {task.lastModifiedAt && (
                                    <div className="lcars-task-modified">
                                      <ClockIcon className="w-3 h-3" />
                                      <span className="lcars-text-xs">
                                        {new Date(task.lastModifiedAt).toLocaleTimeString()}
                                      </span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

// LCARS Workflow Task Card Component
interface LCARSTaskCardProps {
  task: WorkflowTask;
  stage: WorkflowStage;
  onUpdate: (updates: Partial<WorkflowTask>) => void;
}

export function LCARSTaskCard({ task, stage, onUpdate }: LCARSTaskCardProps) {
  return (
    <div className="lcars-task-card">
      <div className="lcars-task-header">
        <h4 className="lcars-task-title">{task.title}</h4>
        <div className="lcars-task-priority">
          <span className={`lcars-priority-indicator lcars-priority-${task.priority}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="lcars-task-description">{task.description}</p>
      )}

      <div className="lcars-task-progress">
        <div className="lcars-progress-container">
          <div className="lcars-progress-bar">
            <div 
              className="lcars-progress-fill"
              style={{ 
                width: `${task.progress}%`,
                backgroundColor: stage.color 
              }}
            />
          </div>
          <span className="lcars-progress-percentage">{task.progress}%</span>
        </div>
      </div>

      <div className="lcars-task-meta">
        {task.assignee && (
          <div className="lcars-task-assignee">
            <UserIcon className="w-4 h-4" />
            <span>{task.assignee}</span>
          </div>
        )}

        {task.dueDate && (
          <div className="lcars-task-due">
            <ClockIcon className="w-4 h-4" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="lcars-task-footer">
        {task.tags.length > 0 && (
          <div className="lcars-task-tags">
            {task.tags.map((tag, index) => (
              <span key={index} className="lcars-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="lcars-task-actions">
          {task.comments > 0 && (
            <span className="lcars-action-count">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              {task.comments}
            </span>
          )}

          {task.attachments > 0 && (
            <span className="lcars-action-count">
              <PaperClipIcon className="w-4 h-4" />
              {task.attachments}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
