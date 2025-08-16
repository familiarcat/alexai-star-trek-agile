'use client';

import { ReactNode, useState, useEffect } from 'react';
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

interface LCARSLayoutProps {
  children: ReactNode;
  className?: string;
  showSidebar?: boolean;
  onSidebarToggle?: (show: boolean) => void;
  shipComputerMode?: boolean;
}

export function LCARSLayout({ 
  children, 
  className = '', 
  showSidebar: initialShowSidebar = true,
  onSidebarToggle,
  shipComputerMode = false
}: LCARSLayoutProps) {
  const [showSidebar, setShowSidebar] = useState(initialShowSidebar);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false);
        setSidebarCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    const newState = !showSidebar;
    setShowSidebar(newState);
    onSidebarToggle?.(newState);
  };

  // Handle sidebar collapse
  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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

  return (
    <div className={cn('lcars-container', className)}>
      {/* LCARS Frame Structure - Ultra-Classic Style */}
      <div className="lcars-frame">
        {/* Left Frame Column */}
        <div className="frame-col-1">
          <div className="frame-col-1-cell-a"></div>
          <div className="frame-col-1-cell-b"></div>
          <div className="frame-col-1-cell-c"></div>
        </div>
        
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

      {/* Main Layout Container */}
      <div className="wrap-everything">
        {/* Column 1: Sidebar - Enhanced with proper hide/show functionality */}
        <section id="column-1" className={cn(
          'lcars-sidebar-section',
          showSidebar && 'lcars-sidebar-visible',
          sidebarCollapsed && 'lcars-sidebar-collapsed',
          !showSidebar && 'lcars-sidebar-hidden'
        )}>
          <LCARSSidebar collapsed={sidebarCollapsed} />
          
          {/* Enhanced Sidebar Toggle Button with proper UX */}
          <button
            onClick={toggleCollapse}
            className={cn(
              'lcars-sidebar-toggle',
              sidebarCollapsed && 'lcars-sidebar-toggle-collapsed'
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

        {/* Column 2: Middle Navigation - Simplified and non-redundant */}
        <section id="column-2" className="lcars-middle-section">
          <div className="section-2-panel-a">
            {/* Enhanced Sidebar Toggle with proper visual feedback */}
            <div 
              className={cn(
                'lcars-nav-toggle',
                showSidebar && 'lcars-nav-toggle-active'
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
          
          {/* Removed redundant navigation buttons - they're in the sidebar */}
          
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

        {/* Column 3: Main Content */}
        <section id="column-3" className="lcars-main-section">
          <div className="wrap wrap-standard">
            {/* Top Frame */}
            <div className="left-frame-top">
              <div className="panel-1">
                <ComputerDesktopIcon style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                <span>ALEXAI LCARS</span>
              </div>
              <div className="panel-2">
                {formatLCARSDate(currentTime)}
              </div>
            </div>
            
            <div className="right-frame-top">
              <div className="banner">
                LCARS • <span className="blink">Online</span>
              </div>
              
              {/* Data Cascade Display */}
              <div className="data-cascade-button-group">
                <div className="cascade-wrapper">
                  <div className="data-cascade" id="default">
                    <div className="row-1">
                      <div className="dc1">101</div>
                      <div className="dc2">7109</div>
                      <div className="dc3">1966</div>
                      <div className="dc4">36</div>
                      <div className="dc5">880</div>
                      <div className="dc6">11.03</div>
                      <div className="dc7">1954</div>
                      <div className="dc8">03</div>
                    </div>
                    <div className="row-2">
                      <div className="dc1">102</div>
                      <div className="dc2">8102</div>
                      <div className="dc3">1987</div>
                      <div className="dc4">044</div>
                      <div className="dc5">0051</div>
                      <div className="dc6">1968</div>
                      <div className="dc7">704</div>
                      <div className="dc8">10.31</div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Pills */}
                <nav className="lcars-nav-pills">
                  <a href="/" id="b-one" className="lcars-nav-pill">01</a>
                  <div id="blank"></div>
                  <a href="/projects" id="b-two" className="lcars-nav-pill">02</a>
                  <a href="/tasks" id="b-three" className="lcars-nav-pill">03</a>
                  <a href="/analytics" id="b-four" className="lcars-nav-pill">04</a>
                  <a href="/workflow-management" id="b-five" className="lcars-nav-pill">05</a>
                </nav>
              </div>
              
              {/* Bar Panel */}
              <div className="bar-panel first-bar-panel">
                <div className="bar-1"></div>
                <div className="bar-2"></div>
                <div className="bar-3"></div>
                <div className="bar-4"></div>
                <div className="bar-5"></div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="wrap" id="gap">
            <div className="left-frame">
              <div>
                <div className="panel-3">03<span className="hop">-111968</span></div>
                <div className="panel-4">04<span className="hop">-041969</span></div>
                <div className="panel-5">05<span className="hop">-1701D</span></div>
                <div className="panel-6">06<span className="hop">-071984</span></div>
                <div className="panel-7">07<span className="hop">-081940</span></div>
                <div className="panel-8">08<span className="hop">-47148</span></div>
                <div className="panel-9">09<span className="hop">-081966</span></div>
              </div>
              <div>
                <div className="panel-10">10<span className="hop">-31</span></div>
              </div>
            </div>
            
            <div className="right-frame">
              <div className="bar-panel">
                <div className="bar-6"></div>
                <div className="bar-7"></div>
                <div className="bar-8"></div>
                <div className="bar-9"></div>
                <div className="bar-10"></div>
              </div>
              
              <main className="lcars-main-content">
                {/* Content Wrapper */}
                <div className="lcars-content-wrapper">
                  {children}
                </div>
                
                {/* Footer */}
                <footer className="lcars-footer">
                  <div className="footer-inside">
                    <div className="footer-text">
                      <p>AlexAI Star Trek Agile Management System</p>
                      <p>LCARS Interface Powered by Ship's Computer Agent</p>
                    </div>
                  </div>
                  <div className="footer-panel">
                    <span className="hop">25</span>47
                  </div>
                </footer>
              </main>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="lcars-mobile-overlay"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
} 