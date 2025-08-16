// LCARS Workflow State Management
// Mr. Spock - Logical Analysis Division

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { WorkflowBoard, WorkflowTask, WorkflowStage, WorkflowActivity, WorkflowPresence, WorkflowConflict } from '@/types/workflow';

interface WorkflowState {
  // Core State
  boards: WorkflowBoard[];
  currentBoard: WorkflowBoard | null;
  tasks: WorkflowTask[];
  stages: WorkflowStage[];
  
  // Real-time Collaboration
  presence: WorkflowPresence[];
  activities: WorkflowActivity[];
  conflicts: WorkflowConflict[];
  
  // UI State
  loading: boolean;
  error: string | null;
  selectedTask: WorkflowTask | null;
  
  // Actions
  setCurrentBoard: (board: WorkflowBoard) => void;
  addBoard: (board: WorkflowBoard) => void;
  updateBoard: (boardId: string, updates: Partial<WorkflowBoard>) => void;
  
  addTask: (task: WorkflowTask) => void;
  updateTask: (taskId: string, updates: Partial<WorkflowTask>) => void;
  moveTask: (taskId: string, sourceStageId: string, destinationStageId: string) => void;
  deleteTask: (taskId: string) => void;
  
  addStage: (stage: WorkflowStage) => void;
  updateStage: (stageId: string, updates: Partial<WorkflowStage>) => void;
  deleteStage: (stageId: string) => void;
  
  // Real-time Actions
  updatePresence: (presence: WorkflowPresence) => void;
  addActivity: (activity: WorkflowActivity) => void;
      resolveConflict: (conflictId: string, resolution: 'auto-resolve' | 'manual-resolve' | 'user-choice') => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectTask: (task: WorkflowTask | null) => void;
  
  // Computed Values
  getTasksByStage: (stageId: string) => WorkflowTask[];
  getBoardMetrics: (boardId: string) => {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    backlogTasks: number;
    averageProgress: number;
  };
}

export const useWorkflowStore = create<WorkflowState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    boards: [],
    currentBoard: null,
    tasks: [],
    stages: [],
    presence: [],
    activities: [],
    conflicts: [],
    loading: false,
    error: null,
    selectedTask: null,

    // Board Actions
    setCurrentBoard: (board) => set({ currentBoard: board }),
    
    addBoard: (board) => set((state) => ({
      boards: [...state.boards, board],
      currentBoard: board
    })),
    
    updateBoard: (boardId, updates) => set((state) => ({
      boards: state.boards.map(board => 
        board.id === boardId ? { ...board, ...updates, updatedAt: new Date() } : board
      ),
      currentBoard: state.currentBoard?.id === boardId 
        ? { ...state.currentBoard, ...updates, updatedAt: new Date() }
        : state.currentBoard
    })),

    // Task Actions
    addTask: (task) => set((state) => ({
      tasks: [...state.tasks, task],
      activities: [...state.activities, {
        id: `activity-${Date.now()}`,
        boardId: task.projectId,
        taskId: task.id,
        userId: 'current-user', // TODO: Get from auth
        action: 'task-created',
        details: { taskTitle: task.title },
        timestamp: new Date()
      }]
    })),
    
    updateTask: (taskId, updates) => set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              ...updates, 
              updatedAt: new Date(),
              lastModifiedAt: new Date(),
              lastModifiedBy: 'current-user' // TODO: Get from auth
            }
          : task
      ),
      activities: [...state.activities, {
        id: `activity-${Date.now()}`,
        boardId: state.currentBoard?.id || '',
        taskId,
        userId: 'current-user',
        action: 'task-assigned',
        details: updates,
        timestamp: new Date()
      }]
    })),
    
    moveTask: (taskId, sourceStageId, destinationStageId) => {
      const state = get();
      const task = state.tasks.find(t => t.id === taskId);
      
      if (!task) return;
      
      // Check for conflicts
      const existingConflict = state.conflicts.find(c => c.taskId === taskId);
      if (existingConflict) {
        set((state) => ({
          conflicts: [...state.conflicts, {
            id: `conflict-${Date.now()}`,
            taskId,
            userId: 'current-user',
            conflictType: 'stage-conflict',
            resolution: 'manual-resolve',
            createdAt: new Date()
          }]
        }));
        return;
      }
      
      set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === taskId 
            ? { 
                ...t, 
                stageId: destinationStageId,
                updatedAt: new Date(),
                lastModifiedAt: new Date(),
                lastModifiedBy: 'current-user'
              }
            : t
        ),
        activities: [...state.activities, {
          id: `activity-${Date.now()}`,
          boardId: state.currentBoard?.id || '',
          taskId,
          userId: 'current-user',
          action: 'task-moved',
          details: { 
            fromStage: sourceStageId, 
            toStage: destinationStageId 
          },
          timestamp: new Date()
        }]
      }));
    },
    
    deleteTask: (taskId) => set((state) => ({
      tasks: state.tasks.filter(t => t.id !== taskId),
      activities: [...state.activities, {
        id: `activity-${Date.now()}`,
        boardId: state.currentBoard?.id || '',
        taskId,
        userId: 'current-user',
        action: 'task-completed',
        details: { action: 'deleted' },
        timestamp: new Date()
      }]
    })),

    // Stage Actions
    addStage: (stage) => set((state) => ({
      stages: [...state.stages, stage],
      activities: [...state.activities, {
        id: `activity-${Date.now()}`,
        boardId: state.currentBoard?.id || '',
        userId: 'current-user',
        action: 'stage-added',
        details: { stageName: stage.name },
        timestamp: new Date()
      }]
    })),
    
    updateStage: (stageId, updates) => set((state) => ({
      stages: state.stages.map(stage => 
        stage.id === stageId ? { ...stage, ...updates, updatedAt: new Date() } : stage
      )
    })),
    
    deleteStage: (stageId) => set((state) => ({
      stages: state.stages.filter(s => s.id !== stageId),
      tasks: state.tasks.filter(t => t.stageId !== stageId)
    })),

    // Real-time Actions
    updatePresence: (presence) => set((state) => ({
      presence: state.presence.map(p => 
        p.userId === presence.userId && p.boardId === presence.boardId
          ? { ...p, ...presence, lastSeen: new Date() }
          : p
      ).filter(p => 
        p.userId !== presence.userId || p.boardId !== presence.boardId
      ).concat(presence)
    })),
    
    addActivity: (activity) => set((state) => ({
      activities: [...state.activities, activity]
    })),
    
    resolveConflict: (conflictId: string, resolution: 'auto-resolve' | 'manual-resolve' | 'user-choice') => set((state) => ({
      conflicts: state.conflicts.map(conflict => 
        conflict.id === conflictId 
          ? { ...conflict, resolution, resolvedAt: new Date() }
          : conflict
      )
    })),

    // UI Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    selectTask: (task) => set({ selectedTask: task }),

    // Computed Values
    getTasksByStage: (stageId) => {
      const state = get();
      return state.tasks.filter(task => task.stageId === stageId);
    },
    
    getBoardMetrics: (boardId) => {
      const state = get();
      const boardTasks = state.tasks.filter(task => task.projectId === boardId);
      
      return {
        totalTasks: boardTasks.length,
        completedTasks: boardTasks.filter(t => t.status === 'done').length,
        inProgressTasks: boardTasks.filter(t => t.status === 'in-progress').length,
        backlogTasks: boardTasks.filter(t => t.status === 'backlog').length,
        averageProgress: boardTasks.length > 0 
          ? boardTasks.reduce((sum, task) => sum + task.progress, 0) / boardTasks.length
          : 0
      };
    }
  }))
);

// Real-time collaboration middleware
export const workflowMiddleware = {
  // Conflict detection
  detectConflicts: (taskId: string, userId: string) => {
    const state = useWorkflowStore.getState();
    const existingConflict = state.conflicts.find(c => c.taskId === taskId);
    
    if (existingConflict && existingConflict.userId !== userId) {
      return {
        type: 'simultaneous-edit',
        conflict: existingConflict
      };
    }
    
    return null;
  },
  
  // Presence management
  updateUserPresence: (boardId: string, userId: string, status: 'online' | 'away' | 'busy') => {
    const presence: WorkflowPresence = {
      userId,
      userName: 'Current User', // TODO: Get from auth
      boardId,
      status,
      lastSeen: new Date()
    };
    
    useWorkflowStore.getState().updatePresence(presence);
  },
  
  // Activity logging
  logActivity: (action: string, details: Record<string, any>) => {
    const state = useWorkflowStore.getState();
    const activity: WorkflowActivity = {
      id: `activity-${Date.now()}`,
      boardId: state.currentBoard?.id || '',
      userId: 'current-user', // TODO: Get from auth
      action: action as any,
      details,
      timestamp: new Date()
    };
    
    useWorkflowStore.getState().addActivity(activity);
  }
};
