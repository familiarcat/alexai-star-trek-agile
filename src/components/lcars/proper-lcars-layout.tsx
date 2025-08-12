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
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleNavigation = () => {
    setIsNavVisible(!isNavVisible);
  };

  const closeNavigation = () => {
    setIsNavVisible(false);
  };

  // Functional navigation handlers
  const handleNavigation = (route: string) => {
    setActiveNavigation(route);
    console.log(`Navigating to: ${route}`);
    
    // Close mobile navigation if open
    if (isNavVisible) {
      setIsNavVisible(false);
    }
    
    // Navigate to route
    switch (route) {
      case 'dashboard':
        window.location.href = '/';
        break;
      case 'projects':
        window.location.href = '/projects';
        break;
      case 'tasks':
        window.location.href = '/tasks';
        break;
      case 'workflows':
        window.location.href = '/workflows';
        break;
      case 'analytics':
        window.location.href = '/analytics';
        break;
      case 'crew':
        window.location.href = '/crew';
        break;
      case 'settings':
        window.location.href = '/settings';
        break;
      case 'security':
        window.location.href = '/security';
        break;
      case 'help':
        window.location.href = '/help';
        break;
      case 'about':
        window.location.href = '/about';
        break;
      case 'exit':
        if (confirm('Are you sure you want to exit the system?')) {
          window.close();
        }
        break;
      default:
        console.log(`Unknown route: ${route}`);
    }
  };

  const formatLCARSTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatLCARSDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  return (
    <div className={`lcars-container ${className}`}>
      {/* Navigation Toggle Button - Mobile/Tablet */}
      <button 
        className="mobile-nav-toggle"
        onClick={toggleNavigation}
        aria-label="Toggle navigation"
      >
        <Bars3Icon style={{ width: '20px', height: '20px' }} />
      </button>

      {/* Navigation Overlay */}
      {isNavVisible && (
        <div className="nav-overlay active" onClick={closeNavigation} />
      )}

      <div className="wrap-everything">
        {/* Left Frame - Main Navigation */}
        <section className={`lcars-left-frame ${isNavVisible ? 'nav-visible' : ''}`}>
          {/* Mobile Close Button */}
          <button 
            className="mobile-nav-close"
            onClick={closeNavigation}
            aria-label="Close navigation"
          >
            <XMarkIcon style={{ width: '16px', height: '16px' }} />
          </button>

          {/* LCARS Frame Structure */}
          <div className="lcars-frame">
            <div className="frame-col-1">
              <div className="frame-col-1-cell-a"></div>
              <div className="frame-col-1-cell-b"></div>
              <div className="frame-col-1-cell-c"></div>
            </div>
            <div className="frame-col-2"></div>
            <div className="frame-col-3 display-vertical">
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
            </div>
            <div className="frame-col-4"></div>
            <div className="frame-col-5">
              <div className="frame-col-5-cell-a"></div>
              <div className="frame-col-5-cell-b"></div>
              <div className="frame-col-5-cell-c"></div>
            </div>
          </div>

          {/* Primary Navigation Pills */}
          <div className="pillbox">
            <button 
              className={`pill ${activeNavigation === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavigation('dashboard')}
            >
              DASHBOARD
            </button>
            <button 
              className={`pill ${activeNavigation === 'projects' ? 'active' : ''}`}
              onClick={() => handleNavigation('projects')}
            >
              PROJECTS
            </button>
            <button 
              className={`pill ${activeNavigation === 'tasks' ? 'active' : ''}`}
              onClick={() => handleNavigation('tasks')}
            >
              TASKS
            </button>
            <button 
              className={`pill ${activeNavigation === 'workflows' ? 'active' : ''}`}
              onClick={() => handleNavigation('workflows')}
            >
              WORKFLOWS
            </button>
            <button 
              className={`pill ${activeNavigation === 'analytics' ? 'active' : ''}`}
              onClick={() => handleNavigation('analytics')}
            >
              ANALYTICS
            </button>
            <button 
              className={`pill ${activeNavigation === 'crew' ? 'active' : ''}`}
              onClick={() => handleNavigation('crew')}
            >
              CREW
            </button>
          </div>

          {/* Status Information */}
          <div className="lcars-list-2 uppercase">
            <ul>
              <li>Subspace Link: Established</li>
              <li>Starfleet Database: Connected</li>
              <li>Quantum Memory Field: Stable</li>
              <li className="bullet-almond-creme font-almond-creme">Optical Data Network: Active</li>
            </ul>
          </div>

          {/* Secondary Navigation Pills */}
          <div className="pillbox-2">
            <button 
              className={`pill-2 ${activeNavigation === 'settings' ? 'active' : ''}`}
              onClick={() => handleNavigation('settings')}
            >
              SETTINGS
            </button>
            <button 
              className={`pill-2 ${activeNavigation === 'security' ? 'active' : ''}`}
              onClick={() => handleNavigation('security')}
            >
              SECURITY
            </button>
            <div className="pill-2"></div>
            <button 
              className={`pill-2 ${activeNavigation === 'help' ? 'active' : ''}`}
              onClick={() => handleNavigation('help')}
            >
              HELP
            </button>
            <button 
              className={`pill-2 ${activeNavigation === 'about' ? 'active' : ''}`}
              onClick={() => handleNavigation('about')}
            >
              ABOUT
            </button>
            <button 
              className={`pill-2 ${activeNavigation === 'exit' ? 'active' : ''}`}
              onClick={() => handleNavigation('exit')}
            >
              EXIT
            </button>
          </div>
        </section>

        {/* Middle Frame - Sidebar Panels */}
        <section className={`lcars-middle-frame ${isNavVisible ? 'nav-visible' : ''}`}>
          <div className="panel-11">11-1524</div>
          
          {/* Sidebar Buttons */}
          <button className="sidebar-button button-almond-creme">JS2B-01</button>
          <button className="sidebar-button button-butterscotch">JS2B-02</button>
          <button className="sidebar-button button-african-violet">MS2B-03</button>
          
          <div className="panel-12">12-0730</div>
          <div className="panel-13">13-318</div>
          <div className="panel-14">14-DL44</div>
          <div className="panel-15">15-3504</div>
        </section>

        {/* Main Content Area */}
        <section className="lcars-main-content">
          <div className="wrap">
            {/* Top Header */}
            <div className="header-content">
              <div className="banner">
                <h1>LCARS • ALEXAI AGILE MANAGER</h1>
                {isClient && currentTime ? (
                  <p>Stardate: {formatLCARSDate(currentTime)} • Time: {formatLCARSTime(currentTime)}</p>
                ) : (
                  <p>Stardate: -- • Time: --</p>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
              {children}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
