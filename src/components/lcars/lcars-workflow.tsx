'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  UserIcon, 
  ClockIcon, 
  TagIcon, 
  ChatBubbleLeftIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { WorkflowStage, WorkflowTask, WorkflowBoard } from '@/types/workflow';

// LCARS Workflow Components
// Counselor Troi - UX Empathy Officer

interface LCARSWorkflowBoardProps {
  board: WorkflowBoard;
  onTaskMove: (taskId: string, sourceStageId: string, destinationStageId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<WorkflowTask>) => void;
  onTaskCreate: (stageId: string, task: Omit<WorkflowTask, 'id' | 'createdAt' | 'updatedAt' | 'lastModifiedAt'>) => void;
}

export function LCARSWorkflowBoard({ board, onTaskMove, onTaskUpdate, onTaskCreate }: LCARSWorkflowBoardProps) {
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [creatingTaskFor, setCreatingTaskFor] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      onTaskMove(draggableId, source.droppableId, destination.droppableId);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
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

  return (
    <div className="lcars-workflow-board">
      <div className="lcars-workflow-header">
        <h2 className="lcars-title">{board.name}</h2>
        <div className="lcars-workflow-stats">
          <span className="lcars-stat">Total Tasks: {board.tasks.length}</span>
          <span className="lcars-stat">Completed: {board.tasks.filter(t => t.status === 'done').length}</span>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="lcars-workflow-columns">
          {board.stages.map((stage) => {
            const stageTasks = board.tasks.filter(task => task.stageId === stage.id);
            
            return (
              <div key={stage.id} className="lcars-workflow-column">
                <div 
                  className="lcars-stage-header"
                  style={{ backgroundColor: stage.color }}
                >
                  <h3 className="lcars-stage-title">{stage.name}</h3>
                  <span className="lcars-task-count">{stageTasks.length}</span>
                </div>

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
                              <div className="lcars-task-header">
                                <div className="lcars-task-priority">
                                  <span className={getPriorityColor(task.priority)}>
                                    {getPriorityIcon(task.priority)}
                                  </span>
                                </div>
                                <h4 className="lcars-task-title">{task.title}</h4>
                              </div>

                              {task.description && (
                                <p className="lcars-task-description">{task.description}</p>
                              )}

                              <div className="lcars-task-meta">
                                {task.assignee && (
                                  <div className="lcars-task-assignee">
                                    <UserIcon className="w-3 h-3" />
                                    <span>{task.assignee}</span>
                                  </div>
                                )}

                                {task.dueDate && (
                                  <div className="lcars-task-due">
                                    <ClockIcon className="w-3 h-3" />
                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>

                              <div className="lcars-task-progress">
                                <div className="lcars-progress-bar">
                                  <div 
                                    className="lcars-progress-fill"
                                    style={{ width: `${task.progress}%`, backgroundColor: stage.color }}
                                  />
                                </div>
                                <span className="lcars-progress-text">{task.progress}%</span>
                              </div>

                              <div className="lcars-task-footer">
                                {task.tags.length > 0 && (
                                  <div className="lcars-task-tags">
                                    <TagIcon className="w-3 h-3" />
                                    <span>{task.tags.length} tags</span>
                                  </div>
                                )}

                                {task.comments > 0 && (
                                  <div className="lcars-task-comments">
                                    <ChatBubbleLeftIcon className="w-3 h-3" />
                                    <span>{task.comments}</span>
                                  </div>
                                )}

                                {task.attachments > 0 && (
                                  <div className="lcars-task-attachments">
                                    <PaperClipIcon className="w-3 h-3" />
                                    <span>{task.attachments}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Add Task Button */}
                      <div className="lcars-add-task">
                        {creatingTaskFor === stage.id ? (
                          <div className="lcars-create-task-form">
                            <input
                              type="text"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              placeholder="Enter task title..."
                              className="lcars-task-input"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleCreateTask(stage.id);
                                }
                              }}
                            />
                            <div className="lcars-task-actions">
                              <button
                                onClick={() => handleCreateTask(stage.id)}
                                className="lcars-button lcars-button-primary"
                              >
                                Add
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
                        ) : (
                          <button
                            onClick={() => setCreatingTaskFor(stage.id)}
                            className="lcars-add-task-button"
                          >
                            + Add Task
                          </button>
                        )}
                      </div>
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
