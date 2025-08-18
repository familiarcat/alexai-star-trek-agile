// LCARS Real-time Collaboration Socket Client
// Mr. Scott - Engineering Division

import React from 'react';
import { io, Socket } from 'socket.io-client';
import { useWorkflowStore, workflowMiddleware } from './workflow-store';
import { WorkflowTask, WorkflowActivity, WorkflowPresence, WorkflowConflict } from '@/core/types/workflow';

class LCARSSocketClient {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor() {
    // Only initialize socket in browser environment
    if (typeof window !== 'undefined') {
      this.initializeSocket();
    }
  }

  private initializeSocket() {
    try {
      // Check if socket server is available before connecting
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
      
      // Only connect if we're in a browser environment and socket server is configured
      if (typeof window !== 'undefined' && socketUrl !== 'http://localhost:3001') {
        console.log('🖖 Initializing LCARS Socket connection to:', socketUrl);
        
        // Connect to Socket.io server
        this.socket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          timeout: 20000,
        });

        this.setupEventListeners();
      } else {
        console.log('🖖 Socket connection disabled - running in development mode without socket server');
        this.isConnected = false;
        this.updateConnectionStatus('offline');
      }
    } catch (error) {
      console.warn('⚠️ Socket initialization skipped:', error instanceof Error ? error.message : 'Unknown error');
      this.handleConnectionError();
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('🖖 LCARS Socket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.updateConnectionStatus('online');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🖖 LCARS Socket disconnected:', reason);
      this.isConnected = false;
      this.updateConnectionStatus('offline');
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🖖 LCARS Socket connection error:', error);
      this.handleConnectionError();
    });

    // Workflow events
    this.socket.on('task:created', (task: WorkflowTask) => {
      console.log('🖖 Task created:', task.title);
      useWorkflowStore.getState().addTask(task);
      workflowMiddleware.logActivity('task-created', { taskTitle: task.title });
    });

    this.socket.on('task:updated', (task: WorkflowTask) => {
      console.log('🖖 Task updated:', task.title);
      useWorkflowStore.getState().updateTask(task.id, task);
      workflowMiddleware.logActivity('task-assigned', { taskTitle: task.title });
    });

    this.socket.on('task:moved', (data: { taskId: string; sourceStageId: string; destinationStageId: string }) => {
      console.log('🖖 Task moved:', data);
      useWorkflowStore.getState().moveTask(data.taskId, data.sourceStageId, data.destinationStageId);
      workflowMiddleware.logActivity('task-moved', data);
    });

    this.socket.on('task:deleted', (taskId: string) => {
      console.log('🖖 Task deleted:', taskId);
      useWorkflowStore.getState().deleteTask(taskId);
      workflowMiddleware.logActivity('task-completed', { action: 'deleted' });
    });

    // Presence events
    this.socket.on('presence:update', (presence: WorkflowPresence) => {
      console.log('🖖 Presence update:', presence.userName);
      useWorkflowStore.getState().updatePresence(presence);
    });

    this.socket.on('presence:user-joined', (presence: WorkflowPresence) => {
      console.log('🖖 User joined:', presence.userName);
      useWorkflowStore.getState().updatePresence(presence);
      workflowMiddleware.logActivity('user-joined', { userName: presence.userName });
    });

    this.socket.on('presence:user-left', (userId: string) => {
      console.log('🖖 User left:', userId);
      // Remove user from presence
      const state = useWorkflowStore.getState();
      const updatedPresence = state.presence.filter(p => p.userId !== userId);
      useWorkflowStore.setState({ presence: updatedPresence });
    });

    // Conflict events
    this.socket.on('conflict:detected', (conflict: WorkflowConflict) => {
      console.log('🖖 Conflict detected:', conflict.conflictType);
      const state = useWorkflowStore.getState();
      useWorkflowStore.setState({ conflicts: [...state.conflicts, conflict] });
    });

    this.socket.on('conflict:resolved', (conflictId: string) => {
      console.log('🖖 Conflict resolved:', conflictId);
      useWorkflowStore.getState().resolveConflict(conflictId, 'auto-resolve');
    });

    // Activity events
    this.socket.on('activity:new', (activity: WorkflowActivity) => {
      console.log('🖖 New activity:', activity.action);
      useWorkflowStore.getState().addActivity(activity);
    });

    // Board events
    this.socket.on('board:updated', (boardId: string, updates: any) => {
      console.log('🖖 Board updated:', boardId);
      useWorkflowStore.getState().updateBoard(boardId, updates);
    });
  }

  private handleConnectionError() {
    this.isConnected = false;
    this.reconnectAttempts++;
    
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.warn(`⚠️ Socket connection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} failed`);
      
      // Exponential backoff for reconnection
      const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 10000);
      
      setTimeout(() => {
        if (this.reconnectAttempts <= this.maxReconnectAttempts) {
          console.log(`🔄 Attempting to reconnect in ${delay}ms...`);
          this.initializeSocket();
        }
      }, delay);
    } else {
      console.warn('⚠️ Max reconnection attempts reached - socket connection disabled');
      this.updateConnectionStatus('error');
      
      // Disable socket functionality after max attempts
      this.socket = null;
    }
  }

  private updateConnectionStatus(status: 'online' | 'offline' | 'error') {
    // Only dispatch event if we're in a browser environment
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('socket-status-change', { detail: { status } });
      window.dispatchEvent(event);
    }
  }

  // Public methods for emitting events
  public joinBoard(boardId: string, userId: string, userName: string) {
    if (!this.socket || !this.isConnected) {
      console.warn('🖖 Socket not connected, cannot join board');
      return;
    }

    this.socket.emit('board:join', { boardId, userId, userName });
    console.log('🖖 Joined board:', boardId);
  }

  public leaveBoard(boardId: string, userId: string) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('board:leave', { boardId, userId });
    console.log('🖖 Left board:', boardId);
  }

  public createTask(task: Omit<WorkflowTask, 'id' | 'createdAt' | 'updatedAt' | 'lastModifiedAt'>, boardId: string) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('task:create', { task, boardId });
  }

  public updateTask(taskId: string, updates: Partial<WorkflowTask>, boardId: string) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('task:update', { taskId, updates, boardId });
  }

  public moveTask(taskId: string, sourceStageId: string, destinationStageId: string, boardId: string) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('task:move', { taskId, sourceStageId, destinationStageId, boardId });
  }

  public deleteTask(taskId: string, boardId: string) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('task:delete', { taskId, boardId });
  }

  public updatePresence(boardId: string, userId: string, userName: string, status: 'online' | 'away' | 'busy') {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('presence:update', { boardId, userId, userName, status });
  }

  public resolveConflict(conflictId: string, resolution: string, boardId: string) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit('conflict:resolve', { conflictId, resolution, boardId });
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

// Singleton instance
export const lcarsSocketClient = new LCARSSocketClient();

// React hook for using socket client
export const useSocketClient = () => {
  return lcarsSocketClient;
};

// Connection status hook
export const useConnectionStatus = () => {
  const [status, setStatus] = React.useState<'online' | 'offline' | 'error'>('offline');

  React.useEffect(() => {
    const handleStatusChange = (event: CustomEvent) => {
      setStatus(event.detail.status);
    };

    window.addEventListener('socket-status-change', handleStatusChange as EventListener);
    
    // Set initial status
    setStatus(lcarsSocketClient.getConnectionStatus() ? 'online' : 'offline');

    return () => {
      window.removeEventListener('socket-status-change', handleStatusChange as EventListener);
    };
  }, []);

  return status;
};
