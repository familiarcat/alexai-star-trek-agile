'use client';

import React, { useEffect, useState } from 'react';
import { LCARSWorkflowBoard } from '@/core/components/lcars/lcars-workflow';
import { LCARSPresence, LCARSActivityFeed, LCARSConflictResolution } from '@/core/components/lcars/lcars-presence';
import { useWorkflowStore } from '@/core/workflow-store';
import { useSocketClient } from '@/core/socket-client';
import { WorkflowBoard, WorkflowStage, WorkflowTask } from '@/core/types/workflow';
import { 
  PlusIcon, 
  CogIcon, 
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// LCARS Workflow Main Page
// Counselor Troi - UX Empathy Officer

// Note: Metadata should be exported from layout.tsx for client components

export default function WorkflowPage() {
  const [currentBoard, setCurrentBoard] = useState<WorkflowBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const socketClient = useSocketClient();
  const { 
    boards, 
    addBoard, 
    addTask, 
    moveTask, 
    updateTask,
    getBoardMetrics,
    setLoading,
    setError: setStoreError
  } = useWorkflowStore();

  // Mock user data (replace with actual auth)
  const currentUserId = 'user-1';
  const currentUserName = 'Captain Picard';

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);
    initializeWorkflow();
  }, []);

  const initializeWorkflow = async () => {
    try {
      setLoading(true);
      
      // Create default board if none exists
      if (boards.length === 0) {
        const defaultBoard: WorkflowBoard = {
          id: 'board-1',
          name: 'Mission Control',
          projectId: 'project-1',
          stages: createDefaultStages(),
          tasks: createSampleTasks(),
          realTimeUpdates: true,
          workflowType: 'kanban',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        addBoard(defaultBoard);
        setCurrentBoard(defaultBoard);
        
        // Join board for real-time collaboration
        if (typeof window !== 'undefined') {
          socketClient.joinBoard(defaultBoard.id, currentUserId, currentUserName);
        }
      } else {
        setCurrentBoard(boards[0]);
        if (typeof window !== 'undefined') {
          socketClient.joinBoard(boards[0].id, currentUserId, currentUserName);
        }
      }

      // Update user presence
      if (typeof window !== 'undefined') {
        socketClient.updatePresence(
          currentBoard?.id || 'board-1',
          currentUserId,
          currentUserName,
          'online'
        );
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize workflow';
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultStages = (): WorkflowStage[] => [
    {
      id: 'stage-backlog',
      name: 'Backlog',
      color: 'var(--lcars-orange)',
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'stage-in-progress',
      name: 'In Progress',
      color: 'var(--lcars-blue)',
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'stage-review',
      name: 'Review',
      color: 'var(--lcars-purple)',
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'stage-done',
      name: 'Done',
      color: 'var(--lcars-gold)',
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const createSampleTasks = (): WorkflowTask[] => [
    {
      id: 'task-1',
      title: 'Implement LCARS Workflow System',
      description: 'Create the core workflow visualization system with real-time collaboration',
      priority: 'critical',
      status: 'in-progress',
      assignee: 'Mr. Scott',
      assigneeId: 'user-2',
      progress: 75,
      tags: ['frontend', 'real-time'],
      comments: 3,
      attachments: 2,
      stageId: 'stage-in-progress',
      projectId: 'project-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModifiedAt: new Date(),
      lastModifiedBy: 'user-2'
    },
    {
      id: 'task-2',
      title: 'Design User Interface Components',
      description: 'Create LCARS-styled components for the workflow system',
      priority: 'high',
      status: 'done',
      assignee: 'Counselor Troi',
      assigneeId: 'user-3',
      progress: 100,
      tags: ['design', 'ui'],
      comments: 5,
      attachments: 1,
      stageId: 'stage-done',
      projectId: 'project-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModifiedAt: new Date(),
      lastModifiedBy: 'user-3'
    },
    {
      id: 'task-3',
      title: 'Set Up Real-time Communication',
      description: 'Implement Socket.io for real-time collaboration features',
      priority: 'high',
      status: 'review',
      assignee: 'Mr. Data',
      assigneeId: 'user-4',
      progress: 90,
      tags: ['backend', 'socket.io'],
      comments: 2,
      attachments: 0,
      stageId: 'stage-review',
      projectId: 'project-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModifiedAt: new Date(),
      lastModifiedBy: 'user-4'
    },
    {
      id: 'task-4',
      title: 'Add Conflict Resolution System',
      description: 'Implement conflict detection and resolution for simultaneous edits',
      priority: 'medium',
      status: 'backlog',
      assignee: 'Mr. Spock',
      assigneeId: 'user-5',
      progress: 0,
      tags: ['conflict-resolution', 'algorithms'],
      comments: 0,
      attachments: 0,
      stageId: 'stage-backlog',
      projectId: 'project-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModifiedAt: new Date(),
      lastModifiedBy: 'user-5'
    }
  ];

  const handleTaskMove = (taskId: string, sourceStageId: string, destinationStageId: string) => {
    if (!currentBoard) return;

    // Update local state
    moveTask(taskId, sourceStageId, destinationStageId);
    
    // Emit to socket for real-time updates
    if (typeof window !== 'undefined') {
      socketClient.moveTask(taskId, sourceStageId, destinationStageId, currentBoard.id);
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<WorkflowTask>) => {
    if (!currentBoard) return;

    // Update local state
    updateTask(taskId, updates);
    
    // Emit to socket for real-time updates
    if (typeof window !== 'undefined') {
      socketClient.updateTask(taskId, updates, currentBoard.id);
    }
  };

  const handleTaskCreate = (stageId: string, task: Omit<WorkflowTask, 'id' | 'createdAt' | 'updatedAt' | 'lastModifiedAt'>) => {
    if (!currentBoard) return;

    const newTask: WorkflowTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModifiedAt: new Date(),
      lastModifiedBy: currentUserId
    };

    // Add to local state
    addTask(newTask);
    
    // Emit to socket for real-time updates
    if (typeof window !== 'undefined') {
      socketClient.createTask(task, currentBoard.id);
    }
  };

  const boardMetrics = currentBoard ? getBoardMetrics(currentBoard.id) : null;

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="lcars-loading">
        <div className="lcars-loading-spinner" />
        <span className="ml-3">Initializing LCARS Workflow System...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="lcars-loading">
        <div className="lcars-loading-spinner" />
        <span className="ml-3">Loading LCARS Workflow System...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lcars-error">
        <ExclamationTriangleIcon className="w-6 h-6" />
        <span className="ml-2">Error: {error}</span>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="lcars-error">
        <span>No workflow board available</span>
      </div>
    );
  }

  return (
    <div className="lcars-workflow-page">
      {/* Header */}
      <div className="lcars-workflow-page-header">
        <div className="lcars-workflow-page-title">
          <h1 className="lcars-page-title">{currentBoard.name}</h1>
          <span className="lcars-page-subtitle">Real-time collaboration workflow</span>
        </div>

        <div className="lcars-workflow-page-actions">
          <button className="lcars-button lcars-button-secondary">
            <CogIcon className="w-4 h-4 mr-2" />
            Settings
          </button>
          <button className="lcars-button lcars-button-secondary">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button className="lcars-button lcars-button-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      {boardMetrics && (
        <div className="lcars-workflow-metrics">
          <div className="lcars-metric">
            <span className="lcars-metric-label">Total Tasks</span>
            <span className="lcars-metric-value">{boardMetrics.totalTasks}</span>
          </div>
          <div className="lcars-metric">
            <span className="lcars-metric-label">In Progress</span>
            <span className="lcars-metric-value">{boardMetrics.inProgressTasks}</span>
          </div>
          <div className="lcars-metric">
            <span className="lcars-metric-label">Completed</span>
            <span className="lcars-metric-value">{boardMetrics.completedTasks}</span>
          </div>
          <div className="lcars-metric">
            <span className="lcars-metric-label">Progress</span>
            <span className="lcars-metric-value">{Math.round(boardMetrics.averageProgress)}%</span>
          </div>
        </div>
      )}

      {/* Main Workflow Board */}
      <div className="lcars-workflow-main">
        <LCARSWorkflowBoard
          board={currentBoard}
          onTaskMove={handleTaskMove}
          onTaskUpdate={handleTaskUpdate}
          onTaskCreate={handleTaskCreate}
        />
      </div>

      {/* Real-time Collaboration Components */}
      <div className="lcars-collaboration-panel">
        <LCARSPresence
          boardId={currentBoard.id}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
        />
        
        <LCARSActivityFeed boardId={currentBoard.id} />
      </div>

      {/* Conflict Resolution */}
      <LCARSConflictResolution boardId={currentBoard.id} />
    </div>
  );
}
