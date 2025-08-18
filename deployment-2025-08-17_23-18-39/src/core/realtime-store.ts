import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { initializeSocket, getSocket, emit, on, off, getConnectionStatus, joinProject, leaveProject, updateTask, updateProject, sendMessage, updateUserPresence } from './socket';

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  team_size: number;
  created_at: string;
  deadline: string;
  priority: string;
  collaborators: User[];
  lastModified: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: User;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  projectId?: string;
}

interface RealtimeState {
  // Connection state
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  
  // Real-time data
  activeUsers: User[];
  currentProject: Project | null;
  projectTasks: Task[];
  chatMessages: ChatMessage[];
  
  // Collaboration state
  onlineCollaborators: User[];
  userPresence: Map<string, User>;
  typingUsers: Set<string>;
  
  // Conflict resolution
  conflicts: any[];
  pendingChanges: any[];
  
  // Actions
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  updateActiveUsers: (users: User[]) => void;
  setCurrentProject: (project: Project | null) => void;
  updateProjectTasks: (tasks: Task[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  updateUserPresence: (user: User) => void;
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;
  addConflict: (conflict: any) => void;
  resolveConflict: (conflictId: string) => void;
  addPendingChange: (change: any) => void;
  applyPendingChange: (changeId: string) => void;
  
  // Real-time actions
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  updateTask: (taskData: any) => void;
  updateProject: (projectData: any) => void;
  sendMessage: (message: string) => void;
  updatePresence: (status: 'online' | 'offline' | 'away') => void;
}

const useRealtimeStore = create<RealtimeState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isConnected: false,
    connectionStatus: 'disconnected',
    activeUsers: [],
    currentProject: null,
    projectTasks: [],
    chatMessages: [],
    onlineCollaborators: [],
    userPresence: new Map(),
    typingUsers: new Set(),
    conflicts: [],
    pendingChanges: [],

    // State setters
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    updateActiveUsers: (users) => set({ activeUsers: users }),
    setCurrentProject: (project) => set({ currentProject: project }),
    updateProjectTasks: (tasks) => set({ projectTasks: tasks }),
    addChatMessage: (message) => set((state) => ({ 
      chatMessages: [...state.chatMessages, message] 
    })),
    updateUserPresence: (user) => set((state) => {
      const newPresence = new Map(state.userPresence);
      newPresence.set(user.id, user);
      return { userPresence: newPresence };
    }),
    addTypingUser: (userId) => set((state) => {
      const newTypingUsers = new Set(state.typingUsers);
      newTypingUsers.add(userId);
      return { typingUsers: newTypingUsers };
    }),
    removeTypingUser: (userId) => set((state) => {
      const newTypingUsers = new Set(state.typingUsers);
      newTypingUsers.delete(userId);
      return { typingUsers: newTypingUsers };
    }),
    addConflict: (conflict) => set((state) => ({ 
      conflicts: [...state.conflicts, conflict] 
    })),
    resolveConflict: (conflictId) => set((state) => ({ 
      conflicts: state.conflicts.filter(c => c.id !== conflictId) 
    })),
    addPendingChange: (change) => set((state) => ({ 
      pendingChanges: [...state.pendingChanges, change] 
    })),
    applyPendingChange: (changeId) => set((state) => ({ 
      pendingChanges: state.pendingChanges.filter(c => c.id !== changeId) 
    })),

    // Real-time actions
    joinProject: (projectId) => {
      joinProject(projectId);
      set({ isConnected: getConnectionStatus() });
    },
    
    leaveProject: (projectId) => {
      leaveProject(projectId);
    },
    
    updateTask: (taskData) => {
      updateTask(taskData);
      // Optimistically update local state
      set((state) => ({
        projectTasks: state.projectTasks.map(task => 
          task.id === taskData.id ? { ...task, ...taskData, updatedAt: new Date() } : task
        )
      }));
    },
    
    updateProject: (projectData) => {
      updateProject(projectData);
      // Optimistically update local state
      set((state) => ({
        currentProject: state.currentProject?.id === projectData.id 
          ? { ...state.currentProject, ...projectData, lastModified: new Date() }
          : state.currentProject
      }));
    },
    
    sendMessage: (message) => {
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'current-user', // TODO: Get from auth
        userName: 'Current User', // TODO: Get from auth
        message,
        timestamp: new Date(),
        projectId: get().currentProject?.id
      };
      
      sendMessage(chatMessage);
      get().addChatMessage(chatMessage);
    },
    
    updatePresence: (status) => {
      const userData = {
        id: 'current-user', // TODO: Get from auth
        name: 'Current User', // TODO: Get from auth
        status,
        lastSeen: new Date()
      };
      
      updateUserPresence(userData);
      get().updateUserPresence(userData);
    }
  }))
);



// Initialize socket connection and set up event listeners
let isInitialized = false;

const initializeRealtimeSystem = () => {
  if (isInitialized) return;
  
  try {
    // Initialize socket connection
    const socket = initializeSocket();
    
    // Set up socket event listeners
    on('connect', () => {
      console.log('Realtime system connected');
      useRealtimeStore.getState().setConnectionStatus('connected');
      useRealtimeStore.getState().updatePresence('online');
    });

    on('disconnect', () => {
      console.log('Realtime system disconnected');
      useRealtimeStore.getState().setConnectionStatus('disconnected');
      useRealtimeStore.getState().updatePresence('offline');
    });

    on('connect_error', (error) => {
      console.warn('Realtime connection error:', error);
      useRealtimeStore.getState().setConnectionStatus('error');
      // Implement fallback mechanism
      useRealtimeStore.getState().updatePresence('offline');
    });

    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize realtime system:', error);
    // Fallback to offline mode
    useRealtimeStore.getState().setConnectionStatus('disconnected');
    useRealtimeStore.getState().updatePresence('offline');
  }
};

// Initialize when the store is first accessed
if (typeof window !== 'undefined') {
  initializeRealtimeSystem();
}

on('user_joined', (user: User) => {
  useRealtimeStore.getState().updateUserPresence(user);
});

on('user_left', (userId: string) => {
  const state = useRealtimeStore.getState();
  const user = state.userPresence.get(userId);
  if (user) {
    state.updateUserPresence({ ...user, status: 'offline' });
  }
});

on('task_updated', (taskData: Task) => {
  useRealtimeStore.getState().updateProjectTasks(
    useRealtimeStore.getState().projectTasks.map(task => 
      task.id === taskData.id ? { ...task, ...taskData } : task
    )
  );
});

on('project_updated', (projectData: Project) => {
  const state = useRealtimeStore.getState();
  if (state.currentProject?.id === projectData.id) {
    state.setCurrentProject({ ...state.currentProject, ...projectData });
  }
});

on('chat_message', (message: ChatMessage) => {
  useRealtimeStore.getState().addChatMessage(message);
});

on('user_typing', (userId: string) => {
  useRealtimeStore.getState().addTypingUser(userId);
});

on('user_stopped_typing', (userId: string) => {
  useRealtimeStore.getState().removeTypingUser(userId);
});

export default useRealtimeStore; 