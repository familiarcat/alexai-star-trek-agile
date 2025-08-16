'use client';

import React, { useEffect, useState } from 'react';
import { UserIcon, SignalIcon, WifiIcon } from '@heroicons/react/24/outline';
import { useWorkflowStore } from '@/lib/workflow-store';
import { useConnectionStatus } from '@/lib/socket-client';
import { WorkflowPresence } from '@/types/workflow';

// LCARS User Presence Component
// Mr. Data - Analytical Intelligence Division

interface LCARSPresenceProps {
  boardId: string;
  currentUserId: string;
  currentUserName: string;
}

export function LCARSPresence({ boardId, currentUserId, currentUserName }: LCARSPresenceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const connectionStatus = useConnectionStatus();
  const presence = useWorkflowStore((state) => 
    state.presence.filter(p => p.boardId === boardId)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'lcars-presence-online';
      case 'away': return 'lcars-presence-away';
      case 'busy': return 'lcars-presence-busy';
      default: return 'lcars-presence-away';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <SignalIcon className="w-4 h-4" />;
      case 'away': return <WifiIcon className="w-4 h-4" />;
      case 'busy': return <UserIcon className="w-4 h-4" />;
      default: return <WifiIcon className="w-4 h-4" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'error': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'online': return 'Connected';
      case 'offline': return 'Disconnected';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="lcars-presence-container">
      {/* Connection Status */}
      <div className="lcars-connection-status">
        <div className={`lcars-connection-indicator ${getConnectionStatusColor()}`}>
          <SignalIcon className="w-4 h-4" />
          <span className="lcars-connection-text">{getConnectionStatusText()}</span>
        </div>
      </div>

      {/* Presence Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lcars-presence-toggle"
      >
        <div className="lcars-presence-summary">
          <UserIcon className="w-5 h-5" />
          <span className="lcars-presence-count">{presence.length}</span>
          <span className="lcars-presence-label">Crew Members</span>
        </div>
      </button>

      {/* Expanded Presence List */}
      {isExpanded && (
        <div className="lcars-presence-list">
          <div className="lcars-presence-header">
            <h3 className="lcars-presence-title">Active Crew</h3>
            <span className="lcars-presence-subtitle">Real-time collaboration</span>
          </div>

          <div className="lcars-presence-users">
            {presence.map((user) => (
              <div key={user.userId} className="lcars-presence-user">
                <div className="lcars-presence-user-info">
                  <div className={`lcars-presence-indicator ${getStatusColor(user.status)}`} />
                  <div className="lcars-presence-user-details">
                    <span className="lcars-presence-user-name">
                      {user.userName}
                      {user.userId === currentUserId && ' (You)'}
                    </span>
                    <span className="lcars-presence-user-status">
                      {getStatusIcon(user.status)}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                </div>

                {user.currentTaskId && (
                  <div className="lcars-presence-task">
                    <span className="lcars-presence-task-label">Working on:</span>
                    <span className="lcars-presence-task-title">Task #{user.currentTaskId.slice(-6)}</span>
                  </div>
                )}

                <div className="lcars-presence-time">
                  <span className="lcars-presence-time-label">Last seen:</span>
                  <span className="lcars-presence-time-value">
                    {new Date(user.lastSeen).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {presence.length === 0 && (
            <div className="lcars-presence-empty">
              <UserIcon className="w-8 h-8" />
              <span className="lcars-presence-empty-text">No crew members online</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// LCARS Activity Feed Component
interface LCARSActivityFeedProps {
  boardId: string;
}

export function LCARSActivityFeed({ boardId }: LCARSActivityFeedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const activities = useWorkflowStore((state) => 
    state.activities
      .filter(a => a.boardId === boardId)
      .slice(-10) // Show last 10 activities
      .reverse()
  );

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'task-created': return '➕';
      case 'task-moved': return '➡️';
      case 'task-assigned': return '👤';
      case 'task-completed': return '✅';
      case 'user-joined': return '🖖';
      case 'stage-added': return '📋';
      default: return '📝';
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.action) {
      case 'task-created':
        return `Created task "${activity.details.taskTitle}"`;
      case 'task-moved':
        return `Moved task to ${activity.details.toStage}`;
      case 'task-assigned':
        return `Updated task "${activity.details.taskTitle}"`;
      case 'task-completed':
        return `Completed task`;
      case 'user-joined':
        return `${activity.details.userName} joined the board`;
      case 'stage-added':
        return `Added stage "${activity.details.stageName}"`;
      default:
        return 'Activity performed';
    }
  };

  return (
    <div className="lcars-activity-container">
      {/* Activity Toggle */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="lcars-activity-toggle"
      >
        <span className="lcars-activity-icon">📋</span>
        <span className="lcars-activity-label">Activity Feed</span>
        <span className="lcars-activity-count">{activities.length}</span>
      </button>

      {/* Activity Feed */}
      {isVisible && (
        <div className="lcars-activity-feed">
          <div className="lcars-activity-header">
            <h3 className="lcars-activity-title">Recent Activity</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="lcars-activity-close"
            >
              ✕
            </button>
          </div>

          <div className="lcars-activity-list">
            {activities.map((activity) => (
              <div key={activity.id} className="lcars-activity-item">
                <div className="lcars-activity-icon">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="lcars-activity-content">
                  <div className="lcars-activity-text">
                    {getActivityText(activity)}
                  </div>
                  <div className="lcars-activity-time">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activities.length === 0 && (
            <div className="lcars-activity-empty">
              <span className="lcars-activity-empty-text">No recent activity</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// LCARS Conflict Resolution Component
interface LCARSConflictResolutionProps {
  boardId: string;
}

export function LCARSConflictResolution({ boardId }: LCARSConflictResolutionProps) {
  const conflicts = useWorkflowStore((state) => 
    state.conflicts.filter(c => !c.resolvedAt)
  );
  const resolveConflict = useWorkflowStore((state) => state.resolveConflict);

  const handleResolveConflict = (conflictId: string, resolution: 'auto-resolve' | 'manual-resolve' | 'user-choice') => {
    resolveConflict(conflictId, resolution);
  };

  if (conflicts.length === 0) return null;

  return (
    <div className="lcars-conflict-container">
      {conflicts.map((conflict) => (
        <div key={conflict.id} className="lcars-conflict-modal">
          <div className="lcars-conflict-content">
            <div className="lcars-conflict-header">
              <h3 className="lcars-conflict-title">Conflict Detected</h3>
              <span className="lcars-conflict-type">{conflict.conflictType}</span>
            </div>

            <div className="lcars-conflict-description">
              A conflict has been detected while editing task #{conflict.taskId.slice(-6)}. 
              Please choose how to resolve this conflict.
            </div>

            <div className="lcars-conflict-actions">
              <button
                onClick={() => handleResolveConflict(conflict.id, 'manual-resolve')}
                className="lcars-button lcars-button-primary"
              >
                Keep My Changes
              </button>
              <button
                onClick={() => handleResolveConflict(conflict.id, 'manual-resolve')}
                className="lcars-button lcars-button-secondary"
              >
                Use Remote Changes
              </button>
              <button
                onClick={() => handleResolveConflict(conflict.id, 'auto-resolve')}
                className="lcars-button lcars-button-secondary"
              >
                Merge Changes
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
