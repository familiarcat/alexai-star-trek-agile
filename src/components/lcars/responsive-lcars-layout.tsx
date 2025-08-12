'use client';

import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { useShipsComputer } from './ships-computer-orchestrator';
import { LCARSSidebar } from './lcars-sidebar';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ComputerDesktopIcon,
  SignalIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface ResponsiveLCARSLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveLCARSLayout({ children, className = '' }: ResponsiveLCARSLayoutProps) {
  const { state, updateLayoutElement, executeAction } = useShipsComputer();
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Responsive behavior based on AI agent recommendations
  useEffect(() => {
    const device = state.userContext.device;
    
    // Apply AI recommendations for responsive behavior
    if (device === 'mobile') {
      setShowSidebar(false);
      setSidebarCollapsed(false);
    } else if (device === 'tablet') {
      setShowSidebar(true);
      setSidebarCollapsed(true);
    } else {
      setShowSidebar(true);
      setSidebarCollapsed(false);
    }
  }, [state.userContext.device]);

  // Handle sidebar toggle
  const toggleSidebar = useCallback(async () => {
    const newState = !showSidebar;
    setShowSidebar(newState);
    
    // Execute action through AI system
    try {
      await executeAction(`toggle_sidebar_${newState ? 'show' : 'hide'}`);
    } catch (error) {
      console.warn('AI action execution failed:', error);
    }
  }, [showSidebar, executeAction]);

  // Handle sidebar collapse
  const toggleCollapse = useCallback(async () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    
    // Execute action through AI system
    try {
      await executeAction(`collapse_sidebar_${newCollapsed ? 'true' : 'false'}`);
    } catch (error) {
      console.warn('AI action execution failed:', error);
    }
  }, [sidebarCollapsed, executeAction]);

  // Format time for LCARS display
  const formatLCARSTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Format date for LCARS display
  const formatLCARSDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}-${year}`;
  };

  // Get responsive classes based on AI recommendations
  const getResponsiveClasses = () => {
    const device = state.userContext.device;
    const intent = state.currentIntent.toLowerCase();
    
    let classes = 'lcars-responsive-layout';
    
    // Device-specific classes
    if (device === 'mobile') {
      classes += ' lcars-mobile-layout';
    } else if (device === 'tablet') {
      classes += ' lcars-tablet-layout';
    } else {
      classes += ' lcars-desktop-layout';
    }
    
    // Intent-specific classes
    if (intent.includes('navigate')) {
      classes += ' lcars-navigation-intent';
    } else if (intent.includes('analyze')) {
      classes += ' lcars-analysis-intent';
    } else if (intent.includes('monitor')) {
      classes += ' lcars-monitoring-intent';
    } else if (intent.includes('tactical')) {
      classes += ' lcars-tactical-intent';
    }
    
    return classes;
  };

  return (
    <div className={cn('lcars-container', getResponsiveClasses(), className)}>
      {/* LCARS Frame Structure - Responsive */}
      <div className="lcars-frame">
        {/* Left Frame Column */}
        <div className="frame-col-1"></div>
        
        {/* Middle Frame Column */}
        <div className="frame-col-2"></div>
        
        {/* Vertical Lines Column */}
        <div className="frame-col-3 display-vertical">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="line"></div>
          ))}
        </div>
        
        {/* Right Frame Column */}
        <div className="frame-col-4"></div>
        
        {/* Right Frame Column with Cells */}
        <div className="frame-col-5">
          <div className="frame-col-5-cell-a"></div>
          <div className="frame-col-5-cell-b"></div>
          <div className="frame-col-5-cell-c"></div>
        </div>
      </div>

      {/* Main Layout Container - AI-Driven Responsive */}
      <div className="wrap-everything">
        {/* Column 1: Sidebar - AI-Responsive */}
        <section 
          id="column-1" 
          className={cn(
            'lcars-sidebar-section',
            showSidebar && 'lcars-sidebar-visible',
            sidebarCollapsed && 'lcars-sidebar-collapsed',
            !showSidebar && 'lcars-sidebar-hidden',
            `lcars-sidebar-${state.userContext.device}`
          )}
        >
          <LCARSSidebar collapsed={sidebarCollapsed} />
          
          {/* Enhanced Sidebar Toggle Button - AI-Responsive */}
          <button
            onClick={toggleCollapse}
            className={cn(
              'lcars-sidebar-toggle',
              sidebarCollapsed && 'lcars-sidebar-toggle-collapsed',
              `lcars-sidebar-toggle-${state.userContext.device}`
            )}
            aria-label={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon style={{ width: '16px', height: '16px' }} />
            ) : (
              <ChevronLeftIcon style={{ width: '16px', height: '20px' }} />
            )}
          </button>
        </section>

        {/* Column 2: Middle Navigation - AI-Responsive */}
        <section 
          id="column-2" 
          className={cn(
            'lcars-middle-section',
            `lcars-middle-${state.userContext.device}`
          )}
        >
          <div className="section-2-panel-a">
            {/* Enhanced Sidebar Toggle with AI Feedback */}
            <div 
              className={cn(
                'lcars-nav-toggle',
                showSidebar && 'lcars-nav-toggle-active',
                `lcars-nav-toggle-${state.userContext.device}`
              )} 
              onClick={toggleSidebar}
              title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
            >
              {showSidebar ? (
                <XMarkIcon style={{ width: '20px', height: '20px' }} />
              ) : (
                <Bars3Icon style={{ width: '20px', height: '20px' }} />
              )}
            </div>
          </div>
          
          <div className="section-2-panel-b">
            <div className="lcars-status-display">
              <div className="status-item">
                <SignalIcon style={{ width: '16px', height: '16px', color: 'var(--lcars-green)' }} />
                <span>SUBSPACE</span>
              </div>
            </div>
          </div>
          
          <div className="section-2-panel-c">
            <div className="lcars-time-display">
              {formatLCARSTime(currentTime)}
            </div>
          </div>
          
          <div className="section-2-panel-d">
            <div className="lcars-date-display">
              {formatLCARSDate(currentTime)}
            </div>
          </div>
          
          <div className="section-2-panel-e">
            <div className="lcars-system-status">
              <CogIcon style={{ width: '16px', height: '16px', color: 'var(--lcars-green)' }} />
              <span>ONLINE</span>
            </div>
          </div>
        </section>

        {/* Column 3: Main Content - AI-Responsive */}
        <section 
          id="column-3" 
          className={cn(
            'lcars-main-section',
            `lcars-main-${state.userContext.device}`,
            `lcars-main-intent-${state.currentIntent.toLowerCase().replace(/\s+/g, '-')}`
          )}
        >
          <div className="wrap wrap-standard">
            {/* Top Frame - AI-Responsive */}
            <div className="left-frame-top">
              <div className="panel-1">
                <ComputerDesktopIcon style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                <span>ALEXAI LCARS</span>
              </div>
              
              {/* AI Status Indicator */}
              <div className="ai-status-indicator">
                <div className="ai-status-text">
                  {state.isProcessing ? 'AI AGENTS COORDINATING...' : 'AI READY'}
                </div>
                <div className="ai-status-dots">
                  {state.agents.map(agent => (
                    <div 
                      key={agent.id}
                      className={cn(
                        'ai-status-dot',
                        agent.status === 'active' && 'ai-status-dot-active',
                        agent.status === 'processing' && 'ai-status-dot-processing'
                      )}
                      title={`${agent.name}: ${agent.status}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area - AI-Responsive */}
            <div className="lcars-content-area">
              {/* AI Intent Display */}
              <div className="ai-intent-display">
                <div className="ai-intent-label">CURRENT INTENT:</div>
                <div className="ai-intent-value">{state.currentIntent}</div>
                <div className="ai-intent-device">Device: {state.userContext.device.toUpperCase()}</div>
              </div>

              {/* Main Content */}
              <div className="lcars-main-content">
                {children}
              </div>

              {/* AI Recommendations Display */}
              {state.recommendations.length > 0 && (
                <div className="ai-recommendations-display">
                  <div className="ai-recommendations-label">
                    AI RECOMMENDATIONS ({state.recommendations.length})
                  </div>
                  <div className="ai-recommendations-list">
                    {state.recommendations.slice(0, 3).map(rec => (
                      <div key={rec.id} className="ai-recommendation-item">
                        <div className="ai-recommendation-title">{rec.title}</div>
                        <div className="ai-recommendation-priority">{rec.priority}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
