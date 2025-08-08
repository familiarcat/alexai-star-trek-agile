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
import useRealtimeStore from '@/lib/realtime-store';

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

  useEffect(() => {
    if (projectId) {
      joinProject(projectId);
      updatePresence('online');
      
      return () => {
        leaveProject(projectId);
        updatePresence('offline');
      };
    }
  }, [projectId, joinProject, leaveProject, updatePresence]);

  const getConnectionIcon = () => {
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
        return <SignalSlashIcon className="w-4 h-4 text-lcars-grey" />;
    }
  };

  const getConnectionText = () => {
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
        return 'UNKNOWN STATUS';
    }
  };

  const onlineUsers = Array.from(userPresence.values()).filter(user => user.status === 'online');
  const typingUsersList = Array.from(typingUsers);

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
              ACTIVE COLLABORATORS ({onlineUsers.length})
            </span>
          </div>
          
          <div className="space-y-1">
            {onlineUsers.map((user) => (
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

  return (
    <div className="flex items-center gap-2 p-2 bg-lcars-dark-grey bg-opacity-50 rounded">
      <SignalIcon className={`w-3 h-3 ${
        connectionStatus === 'connected' ? 'text-lcars-green' : 'text-lcars-red'
      }`} />
      <span className="lcars-text-xs">
        {connectionStatus === 'connected' ? 'LIVE' : 'OFFLINE'}
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