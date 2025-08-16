'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ChatBubbleLeftIcon, 
  PaperAirplaneIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import useRealtimeStore from '@/lib/realtime-store';

interface RealtimeChatProps {
  projectId?: string;
  className?: string;
}

export function RealtimeChat({ projectId, className = '' }: RealtimeChatProps) {
  const {
    chatMessages,
    typingUsers,
    sendMessage,
    addTypingUser,
    removeTypingUser
  } = useRealtimeStore();

  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      addTypingUser('current-user'); // TODO: Get from auth
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      removeTypingUser('current-user'); // TODO: Get from auth
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      removeTypingUser('current-user'); // TODO: Get from auth
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const typingUsersList = Array.from(typingUsers).filter(id => id !== 'current-user');

  return (
    <div className={`lcars-panel ${className}`}>
      <div className="lcars-header">
        <div className="flex items-center gap-2">
          <ChatBubbleLeftIcon className="w-4 h-4 text-lcars-blue" />
          <h3 className="lcars-text-sm font-bold">PROJECT COMMUNICATIONS</h3>
        </div>
      </div>
      
      <div className="lcars-content flex flex-col h-96">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.length === 0 ? (
            <div className="text-center text-lcars-grey lcars-text-sm">
              No messages yet. Start the conversation!
            </div>
          ) : (
            chatMessages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-lcars-blue rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="lcars-text-xs font-semibold text-lcars-blue">
                      {msg.userName}
                    </span>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3 text-lcars-grey" />
                      <span className="lcars-text-xs text-lcars-grey">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="lcars-text-sm bg-lcars-dark-grey bg-opacity-30 p-2 rounded">
                    {msg.message}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Typing Indicators */}
          {typingUsersList.length > 0 && (
            <div className="flex gap-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-lcars-yellow rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="flex-1">
                <div className="lcars-text-xs text-lcars-yellow mb-1">
                  {typingUsersList.length === 1 ? 'Someone' : `${typingUsersList.length} people`} typing...
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-lcars-yellow rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-lcars-yellow rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-lcars-yellow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <div className="border-t border-lcars-grey p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type your message..."
              className="flex-1 lcars-input lcars-text-sm"
              disabled={!projectId}
            />
            <button
              type="submit"
              disabled={!message.trim() || !projectId}
              className="lcars-button lcars-button-primary"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Compact chat widget for smaller spaces
export function ChatWidget({ projectId }: { projectId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { chatMessages, connectionStatus } = useRealtimeStore();
  
  const unreadCount = chatMessages.length; // TODO: Implement unread tracking

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="lcars-panel w-80 h-96">
          <div className="lcars-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChatBubbleLeftIcon className="w-4 h-4 text-lcars-blue" />
                <h3 className="lcars-text-sm font-bold">CHAT</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lcars-button lcars-button-secondary"
              >
                ×
              </button>
            </div>
          </div>
          <RealtimeChat projectId={projectId} />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="lcars-button lcars-button-primary rounded-full w-12 h-12 relative"
        >
          <ChatBubbleLeftIcon className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-lcars-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
} 