'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useShipsComputer } from './ships-computer-orchestrator';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface ProperLCARSLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ProperLCARSLayout({ children, className = '' }: ProperLCARSLayoutProps) {
  const { state } = useShipsComputer();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState('dashboard');

  // Fix hydration error by only rendering time on client
  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className={`functional-container ${className}`}>
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
                <span>Date: --</span>
                <span>Time: --</span>
              </>
            )}
          </div>
        </div>
        
        <div className="nav-controls">
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
          {children}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
