'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import ModernUIPage from '@/app/modern-ui-page';

// Layout Context
interface LayoutContextType {
  currentLayout: 'lcars' | 'modern';
  setLayout: (layout: 'lcars' | 'modern') => void;
  isTransitioning: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Layout Provider Hook
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutSelector');
  }
  return context;
};

// Layout Selector Component
interface LayoutSelectorProps {
  children: React.ReactNode;
}

export function LayoutSelector({ children }: LayoutSelectorProps) {
  const [currentLayout, setCurrentLayout] = useState<'lcars' | 'modern'>('lcars');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSelector, setShowSelector] = useState(true);

  // Load saved layout preference
  useEffect(() => {
    const savedLayout = localStorage.getItem('alexai-layout-preference');
    if (savedLayout === 'modern' || savedLayout === 'lcars') {
      setCurrentLayout(savedLayout);
    }
  }, []);

  // Handle layout change
  const handleLayoutChange = async (newLayout: 'lcars' | 'modern') => {
    if (newLayout === currentLayout) return;
    
    setIsTransitioning(true);
    
    // Save preference
    localStorage.setItem('alexai-layout-preference', newLayout);
    
    // Smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentLayout(newLayout);
    setIsTransitioning(false);
    
    // Hide selector after choice
    setShowSelector(false);
    
    // Show selector again after 5 seconds for easy access
    setTimeout(() => setShowSelector(true), 5000);
  };

  // Context value
  const contextValue: LayoutContextType = {
    currentLayout,
    setLayout: handleLayoutChange,
    isTransitioning
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {/* Layout Selector Overlay */}
      {showSelector && (
        <div className="layout-selector-overlay">
          <div className="layout-selector-container">
            <div className="layout-selector-header">
              <h2>🚀 Choose Your Interface</h2>
              <p>Select your preferred user interface layout</p>
            </div>
            
            <div className="layout-options">
              <button
                className={`layout-option ${currentLayout === 'lcars' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('lcars')}
                disabled={isTransitioning}
              >
                <div className="layout-icon">🖖</div>
                <div className="layout-info">
                  <h3>LCARS Interface</h3>
                  <p>Classic Star Trek-inspired design with Ship's Computer coordination</p>
                  <div className="layout-features">
                    <span>• Ship's Computer Agent</span>
                    <span>• LCARS Color Scheme</span>
                    <span>• Traditional Navigation</span>
                  </div>
                </div>
              </button>
              
              <button
                className={`layout-option ${currentLayout === 'modern' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('modern')}
                disabled={isTransitioning}
              >
                <div className="layout-icon">✨</div>
                <div className="layout-info">
                  <h3>Modern UI 2025</h3>
                  <p>Cutting-edge design with glassmorphism and advanced interactions</p>
                  <div className="layout-features">
                    <span>• Glassmorphism Effects</span>
                    <span>• Advanced Animations</span>
                    <span>• Modern Design Trends</span>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="layout-selector-footer">
              <button 
                className="close-selector"
                onClick={() => setShowSelector(false)}
              >
                Close
              </button>
              <p className="layout-tip">
                💡 You can change layouts anytime using the floating selector
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Layout Toggle */}
      <button
        className="floating-layout-toggle"
        onClick={() => setShowSelector(true)}
        title="Change Layout"
      >
        {currentLayout === 'lcars' ? '🖖' : '✨'}
      </button>

      {/* Render children based on selected layout */}
      <div className={`layout-container layout-${currentLayout} ${isTransitioning ? 'transitioning' : ''}`}>
        {currentLayout === 'lcars' ? (
          // LCARS Layout (existing system)
          children
        ) : (
          // Modern UI Layout (new system)
          <ModernUIPage />
        )}
      </div>
    </LayoutContext.Provider>
  );
}
