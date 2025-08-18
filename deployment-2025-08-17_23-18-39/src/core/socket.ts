import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });
    
    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });
    
    socket.on('connect_error', (error) => {
      console.warn('Socket connection error:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }
  
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Public methods for real-time events
export const emit = (event: string, data: any) => {
  if (socket && socket.connected) {
    socket.emit(event, data);
  } else {
    console.warn('Socket not connected, cannot emit event:', event);
  }
};

export const on = (event: string, callback: (data: any) => void) => {
  if (socket) {
    socket.on(event, callback);
  }
};

export const off = (event: string, callback?: (data: any) => void) => {
  if (socket) {
    socket.off(event, callback);
  }
};

export const getConnectionStatus = (): boolean => {
  return socket?.connected || false;
};

// Real-time collaboration methods
export const joinProject = (projectId: string) => {
  emit('join_project', { projectId });
};

export const leaveProject = (projectId: string) => {
  emit('leave_project', { projectId });
};

export const updateTask = (taskData: any) => {
  emit('task_update', taskData);
};

export const updateProject = (projectData: any) => {
  emit('project_update', projectData);
};

export const sendMessage = (message: any) => {
  emit('chat_message', message);
};

export const updateUserPresence = (userData: any) => {
  emit('user_presence', userData);
}; 