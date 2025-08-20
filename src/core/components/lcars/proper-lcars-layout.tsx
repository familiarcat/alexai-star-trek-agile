'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useShipsComputer } from './ships-computer-orchestrator';
import useShipComputerLayout from '../../hooks/useShipComputerLayout';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface ProperLCARSLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ProperLCARSLayout({ children, className = '' }: ProperLCARSLayoutProps) {
  const { state } = useShipsComputer();
  
  // Initialize Ship Computer Layout Orchestrator for responsive boundaries
  const {
    layoutAnalysis,
    componentHierarchy,
    isAnalyzing,
    manageResponsiveBoundaries,
    generateResponsiveCSS,
    validateBoundaries,
    crewRecommendations,
    error,
    clearError
  } = useShipComputerLayout({
    pageId: 'main-layout',
    userBehavior: {
      userRole: 'user',
      urgency: 'medium',
      navigationPattern: ['navigation', 'content', 'actions']
    },
    contentContext: {
      pageType: 'layout',
      hasForms: false,
      components: 10
    },
    autoAnalyze: true
  });
  
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState('dashboard');
  
  // Ref to prevent infinite loop in responsive boundaries
  const lastProcessedHierarchy = React.useRef<string>('');

  // Fix hydration error by only rendering time on client
  useEffect(() => {
    setIsClient(true);
    // Set initial time immediately
    setCurrentTime(new Date());
    
    // Only set timer if we're on the client side
    if (typeof window !== 'undefined') {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);
  
  // Manage responsive boundaries when layout changes
  useEffect(() => {
    if (componentHierarchy.length > 0 && typeof window !== 'undefined') {
      // Use ref to prevent infinite loop - only process if hierarchy actually changed
      const currentHierarchyHash = JSON.stringify(componentHierarchy.map(c => c.id));
      
      if (currentHierarchyHash !== lastProcessedHierarchy.current) {
        lastProcessedHierarchy.current = currentHierarchyHash;
        
        const screenDimensions = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        const deviceType = screenDimensions.width < 768 ? 'mobile' : 
                          screenDimensions.width < 1024 ? 'tablet' : 'desktop';
        
        manageResponsiveBoundaries(screenDimensions, deviceType);
      }
    }
  }, [componentHierarchy]); // Only depend on componentHierarchy
  
  // Handle window resize for responsive boundaries
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      if (componentHierarchy.length > 0) {
        // Use ref to prevent infinite loop - only process if hierarchy actually changed
        const currentHierarchyHash = JSON.stringify(componentHierarchy.map(c => c.id));
        
        if (currentHierarchyHash !== lastProcessedHierarchy.current) {
          lastProcessedHierarchy.current = currentHierarchyHash;
          
          const screenDimensions = {
            width: window.innerWidth,
            height: window.innerHeight
          };
          const deviceType = screenDimensions.width < 768 ? 'mobile' : 
                            screenDimensions.width < 1024 ? 'tablet' : 'desktop';
          
          manageResponsiveBoundaries(screenDimensions, deviceType);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [componentHierarchy]); // Only depend on componentHierarchy

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className={`functional-container ship-computer-layout ${className}`}>
      {/* Top Navigation Bar - Functional and Interactive */}
      <nav className="top-navigation">
        <div className="nav-brand">
          <h1>AlexAI Agile Management System</h1>
          <div className="nav-time">
            {isClient && currentTime ? (
              <>
                <span>Date: {formatDate(currentTime)}</span>
                <span>Time: {formatTime(currentTime)}</span>
              </>
            ) : (
              <>
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Time: {new Date().toLocaleTimeString()}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="nav-controls">
          {/* Ship Computer Status Indicator */}
          {isAnalyzing && (
            <div className="ship-computer-status">
              <span className="status-indicator">🧠</span>
              <span className="status-text">Ship Computer Active</span>
            </div>
          )}
          
          {/* Responsive Boundary Status */}
          {componentHierarchy.length > 0 && (
            <div className="responsive-boundary-status">
              <span className="status-indicator">📱</span>
              <span className="status-text">Boundaries Managed</span>
            </div>
          )}
          
          <button 
            className="nav-toggle" 
            onClick={() => setIsNavVisible(!isNavVisible)}
            aria-label="Toggle navigation"
          >
            <Bars3Icon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </nav>

      {/* Main Content Area - No Sidebar, Pure Functionality */}
      <main className="main-content-area">
        <div className="content-wrapper">
          {/* Ship Computer Layout Orchestrator Integration */}
          {isAnalyzing && (
            <div className="ship-computer-overlay">
              <div className="ship-computer-status-bar">
                <span>🧠 Ship Computer: Analyzing layout and managing responsive boundaries...</span>
                {crewRecommendations.length > 0 && (
                  <span>👥 Crew Recommendations: {crewRecommendations.length}</span>
                )}
              </div>
            </div>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="ship-computer-error">
              <span>❌ Ship Computer Error: {error}</span>
              <button onClick={clearError}>Clear</button>
            </div>
          )}
          
          {/* Main Content with Responsive Boundaries */}
          <div className="ship-computer-layout" style={{ overflow: 'hidden' }}>
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Navigation Overlay - Functional and Interactive */}
      {isNavVisible && (
        <div className="mobile-nav-overlay">
          <div className="mobile-nav-content">
            <div className="mobile-nav-header">
              <h2>Navigation</h2>
              <button 
                className="close-nav"
                onClick={() => setIsNavVisible(false)}
                aria-label="Close navigation"
              >
                <XMarkIcon style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            <div className="mobile-nav-links">
              <a href="/" className="nav-link">Dashboard</a>
              <a href="/projects" className="nav-link">Projects</a>
              <a href="/tasks" className="nav-link">Tasks</a>
              <a href="/workflows" className="nav-link">Workflows</a>
              <a href="/analytics" className="nav-link">Analytics</a>
              <a href="/crew" className="nav-link">Team</a>
              <a href="/agile-project-management" className="nav-link">Agile Management</a>
              <a href="/ship-computer-demo" className="nav-link">Ship Computer Demo</a>
              <a href="/responsive-boundary-demo" className="nav-link">Responsive Boundaries</a>
            </div>
          </div>
        </div>
      )}
      
      {/* Ship Computer Responsive CSS Injection */}
      <style jsx>{`
        .ship-computer-layout {
          overflow-x: hidden;
          max-width: 100vw;
        }
        
        .ship-computer-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(0, 123, 255, 0.1);
          border-radius: 6px;
          margin-right: 16px;
        }
        
        .responsive-boundary-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(40, 167, 69, 0.1);
          border-radius: 6px;
          margin-right: 16px;
        }
        
        .status-indicator {
          font-size: 16px;
        }
        
        .status-text {
          font-size: 12px;
          font-weight: 500;
          color: #333;
        }
        
        .ship-computer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(0, 123, 255, 0.1);
          border-bottom: 1px solid rgba(0, 123, 255, 0.2);
          padding: 8px 16px;
        }
        
        .ship-computer-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #333;
        }
        
        .ship-computer-error {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.2);
          border-radius: 6px;
          padding: 12px 16px;
          margin: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .ship-computer-error button {
          background: #dc3545;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .ship-computer-layout {
            max-width: 100vw;
            overflow-x: hidden;
          }
          
          .ship-computer-status,
          .responsive-boundary-status {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
