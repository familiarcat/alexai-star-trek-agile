'use client';

import { useEffect, useState } from 'react';
import { 
  SignalIcon, 
  SignalSlashIcon, 
  UserGroupIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import useRealtimeStore from '@/core/realtime-store';

interface RealtimeCollaborationProps {
  projectId?: string;
  className?: string;
}

export function RealtimeCollaboration({ projectId, className = '' }: RealtimeCollaborationProps) {
  const {
    connectionStatus,
    onlineCollaborators,
    typingUsers,
    userPresence,
    joinProject,
    leaveProject,
    updatePresence
  } = useRealtimeStore();

  const [isVisible, setIsVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    // Initialize real-time system with fallback
    const initializeRealtime = async () => {
      try {
        if (projectId) {
          joinProject(projectId);
          updatePresence('online');
          setIsInitialized(true);
        }
      } catch (error) {
        console.warn('Realtime initialization failed, using fallback mode:', error);
        setFallbackMode(true);
        setIsInitialized(true);
      }
    };

    initializeRealtime();

    return () => {
      if (projectId) {
        try {
          leaveProject(projectId);
          updatePresence('offline');
        } catch (error) {
          console.warn('Error leaving project:', error);
        }
      }
    };
  }, [projectId, joinProject, leaveProject, updatePresence]);



  const getConnectionText = () => {
    if (fallbackMode) {
      return 'FALLBACK MODE';
    }
    
    switch (connectionStatus) {
      case 'connected':
        return 'REAL-TIME ACTIVE';
      case 'connecting':
        return 'ESTABLISHING LINK';
      case 'disconnected':
        return 'OFFLINE MODE';
      case 'error':
        return 'CONNECTION ERROR';
      default:
        return 'INITIALIZING...';
    }
  };

  const getConnectionIcon = () => {
    if (fallbackMode) {
      return <ExclamationTriangleIcon className="w-4 h-4 text-lcars-yellow" />;
    }
    
    switch (connectionStatus) {
      case 'connected':
        return <SignalIcon className="w-4 h-4 text-lcars-green" />;
      case 'connecting':
        return <SignalIcon className="w-4 h-4 text-lcars-yellow animate-pulse" />;
      case 'disconnected':
        return <SignalSlashIcon className="w-4 h-4 text-lcars-red" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-lcars-red" />;
      default:
        return <SignalIcon className="w-4 h-4 text-lcars-grey animate-pulse" />;
    }
  };

  const onlineUsers = Array.from(userPresence.values()).filter(user => user.status === 'online');
  const typingUsersList = Array.from(typingUsers);

  // Fallback user presence for testing
  const fallbackUsers = fallbackMode ? [
    { id: 'current-user', name: 'Current User', status: 'online' as const, lastSeen: new Date() },
    { id: 'test-user-1', name: 'Test User 1', status: 'online' as const, lastSeen: new Date() },
    { id: 'test-user-2', name: 'Test User 2', status: 'away' as const, lastSeen: new Date() }
  ] : [];

  const displayUsers = fallbackMode ? fallbackUsers : onlineUsers;

  return (
    <div className={`lcars-panel ${className}`}>
      <div className="lcars-header">
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          <h3 className="lcars-text-sm font-bold">{getConnectionText()}</h3>
        </div>
      </div>
      
      <div className="lcars-content p-4">
        {/* Online Users */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <UserGroupIcon className="w-4 h-4 text-lcars-blue" />
            <span className="lcars-text-sm font-semibold">
              ACTIVE COLLABORATORS ({displayUsers.length})
              {fallbackMode && <span className="text-lcars-yellow"> (FALLBACK)</span>}
            </span>
          </div>
          
          <div className="space-y-1">
            {displayUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-lcars-green rounded-full"></div>
                <span className="lcars-text-xs">{user.name}</span>
                {typingUsersList.includes(user.id) && (
                  <div className="flex items-center gap-1">
                    <PencilIcon className="w-3 h-3 text-lcars-yellow" />
                    <span className="lcars-text-xs text-lcars-yellow">typing...</span>
                  </div>
                )}
              </div>
            ))}
            
            {onlineUsers.length === 0 && (
              <div className="lcars-text-xs text-lcars-grey">
                No active collaborators
              </div>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className="border-t border-lcars-grey pt-2">
          <div className="flex items-center justify-between">
            <span className="lcars-text-xs">STATUS:</span>
            <div className="flex items-center gap-1">
              {getConnectionIcon()}
              <span className="lcars-text-xs font-mono">
                {connectionStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Indicators */}
        {typingUsersList.length > 0 && (
          <div className="mt-2 p-2 bg-lcars-yellow bg-opacity-20 rounded">
            <div className="flex items-center gap-2">
              <PencilIcon className="w-3 h-3 text-lcars-yellow" />
              <span className="lcars-text-xs text-lcars-yellow">
                {typingUsersList.length} user{typingUsersList.length > 1 ? 's' : ''} typing...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function RealtimeStatus({ projectId }: { projectId?: string }) {
  const { connectionStatus, userPresence } = useRealtimeStore();
  
  const onlineUsers = Array.from(userPresence.values()).filter(user => user.status === 'online');

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-lcars-green';
      case 'connecting':
        return 'text-lcars-yellow';
      case 'disconnected':
        return 'text-lcars-red';
      case 'error':
        return 'text-lcars-red';
      default:
        return 'text-lcars-grey';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'LIVE';
      case 'connecting':
        return 'CONNECTING';
      case 'disconnected':
        return 'OFFLINE';
      case 'error':
        return 'ERROR';
      default:
        return 'INIT';
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-lcars-dark-grey bg-opacity-50 rounded">
      <SignalIcon className={`w-3 h-3 ${getStatusColor()}`} />
      <span className="lcars-text-xs font-bold">
        {getStatusText()}
      </span>
      {onlineUsers.length > 0 && (
        <div className="flex items-center gap-1">
          <UserGroupIcon className="w-3 h-3 text-lcars-blue" />
          <span className="lcars-text-xs">{onlineUsers.length}</span>
        </div>
      )}
    </div>
  );
} 