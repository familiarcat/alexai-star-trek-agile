'use client';

import React, { useState, useEffect } from 'react';
import { useShipsComputer } from './ships-computer-orchestrator';

interface DynamicLCARSLayoutProps {
  children?: React.ReactNode;
  initialIntent?: string;
  onLayoutChange?: (layout: any) => void;
}

export const DynamicLCARSLayout: React.FC<DynamicLCARSLayoutProps> = ({
  children,
  initialIntent,
  onLayoutChange
}) => {
  const { state, analyzeUserIntent, generateOptimalLayout } = useShipsComputer();
  const [currentLayout, setCurrentLayout] = useState<any>(null);
  const [isAdapting, setIsAdapting] = useState(false);

  useEffect(() => {
    if (initialIntent) {
      handleIntentChange(initialIntent);
    }
  }, [initialIntent]);

  useEffect(() => {
    if (state.activeLayout) {
      setCurrentLayout(state.activeLayout);
      onLayoutChange?.(state.activeLayout);
    }
  }, [state.activeLayout, onLayoutChange]);

  const handleIntentChange = (intent: string) => {
    setIsAdapting(true);
    
    // Analyze user intent using Counselor Troi's emotional intelligence
    const userIntent = analyzeUserIntent(intent);
    
    // Generate optimal layout using Commander Data's efficiency analysis
    const optimalLayout = generateOptimalLayout(userIntent);
    
    // Simulate adaptation delay
    setTimeout(() => {
      setCurrentLayout(optimalLayout);
      setIsAdapting(false);
    }, 500);
  };

  const getLayoutStyle = () => {
    if (!currentLayout) return {};
    
    return {
      display: 'grid',
      gridTemplateAreas: currentLayout.gridTemplate.replace('grid-template-areas: ', '').replace(/"/g, ''),
      gap: '10px',
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: currentLayout.colorScheme.background,
      color: currentLayout.colorScheme.text,
      transition: 'all 0.3s ease-in-out'
    };
  };

  const renderLayoutComponent = (component: any) => {
    const componentStyle: React.CSSProperties = {
      gridArea: `${component.position.x} ${component.position.y} / span ${component.position.width} / span ${component.position.height}`,
      backgroundColor: currentLayout.colorScheme.primary,
      border: `2px solid ${currentLayout.colorScheme.secondary}`,
      borderRadius: '8px',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px'
    };

    return (
      <div key={component.id} style={componentStyle} className="lcars-component">
        <div className="lcars-text-large lcars-text-white lcars-mb-10">
          {component.type.toUpperCase()}
        </div>
        <div className="lcars-text-medium lcars-text-gold">
          Priority: {component.priority}
        </div>
        {component.adaptive && (
          <div className="lcars-text-small lcars-text-purple lcars-mt-5">
            Adaptive Component
          </div>
        )}
      </div>
    );
  };

  const renderAdaptationOverlay = () => {
    if (!isAdapting) return null;

    return (
      <div className="lcars-adaptation-overlay">
        <div className="lcars-panel lcars-p-20 lcars-text-center">
          <div className="lcars-text-xlarge lcars-text-gold lcars-mb-10">
            ADAPTING LAYOUT
          </div>
          <div className="lcars-loading-spinner">
            <div className="lcars-spinner-icon">🔄</div>
          </div>
          <div className="lcars-text-large lcars-text-white lcars-mt-10">
            Ship's Computer analyzing user intent...
          </div>
          <div className="lcars-text-medium lcars-text-orange lcars-mt-5">
            Counselor Troi: Assessing emotional context
          </div>
          <div className="lcars-text-medium lcars-text-blue lcars-mt-5">
            Commander Data: Optimizing efficiency
          </div>
        </div>
      </div>
    );
  };

  const renderIntentControls = () => {
    const intentOptions = [
      { label: 'Navigation', value: 'Navigate to main bridge' },
      { label: 'Analysis', value: 'Analyze sensor data' },
      { label: 'Monitoring', value: 'Monitor system status' },
      { label: 'Command', value: 'Execute tactical command' },
      { label: 'Communication', value: 'Open communication channel' },
      { label: 'Research', value: 'Research alien technology' }
    ];

    return (
      <div className="lcars-intent-controls lcars-panel lcars-p-15 lcars-mb-20">
        <div className="lcars-text-large lcars-text-orange lcars-mb-10">
          USER INTENT CONTROLS
        </div>
        <div className="lcars-grid lcars-grid-cols-2 lcars-md-grid-cols-3 lcars-gap-10">
          {intentOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleIntentChange(option.value)}
              className="lcars-button lcars-button-secondary"
              disabled={isAdapting}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderLayoutInfo = () => {
    if (!currentLayout) return null;

    return (
      <div className="lcars-layout-info lcars-panel lcars-p-15 lcars-mb-20">
        <div className="lcars-text-large lcars-text-orange lcars-mb-10">
          ACTIVE LAYOUT: {currentLayout.name}
        </div>
        <div className="lcars-text-medium lcars-text-white lcars-mb-5">
          {currentLayout.description}
        </div>
        <div className="lcars-grid lcars-grid-cols-2 lcars-md-grid-cols-4 lcars-gap-10">
          <div className="lcars-text-small lcars-text-gold">
            Components: {currentLayout.components.length}
          </div>
          <div className="lcars-text-small lcars-text-gold">
            Adaptive: {currentLayout.components.filter((c: any) => c.adaptive).length}
          </div>
          <div className="lcars-text-small lcars-text-gold">
            Interactions: {currentLayout.interactionPatterns.length}
          </div>
          <div className="lcars-text-small lcars-text-gold">
            Accessibility: {Object.values(currentLayout.accessibility).filter(Boolean).length}/5
          </div>
        </div>
      </div>
    );
  };

  const renderColorScheme = () => {
    if (!currentLayout) return null;

    return (
      <div className="lcars-color-scheme lcars-panel lcars-p-15 lcars-mb-20">
        <div className="lcars-text-large lcars-text-orange lcars-mb-10">
          COLOR SCHEME
        </div>
        <div className="lcars-grid lcars-grid-cols-2 lcars-md-grid-cols-4 lcars-gap-10">
          {Object.entries(currentLayout.colorScheme).map(([key, value]) => (
            <div key={key} className="lcars-color-sample">
              <div 
                className="lcars-color-preview"
                style={{ backgroundColor: value as string }}
              ></div>
              <div className="lcars-text-small lcars-text-white lcars-mt-5">
                {key.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInteractionPatterns = () => {
    if (!currentLayout) return null;

    return (
      <div className="lcars-interaction-patterns lcars-panel lcars-p-15 lcars-mb-20">
        <div className="lcars-text-large lcars-text-orange lcars-mb-10">
          INTERACTION PATTERNS
        </div>
        <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-2 lcars-gap-10">
          {currentLayout.interactionPatterns.map((pattern: any, index: number) => (
            <div key={index} className="lcars-panel lcars-p-10">
              <div className="lcars-text-medium lcars-text-gold">
                {pattern.type.toUpperCase()}
              </div>
              <div className="lcars-text-small lcars-text-white lcars-mt-5">
                Action: {pattern.action}
              </div>
              <div className="lcars-text-small lcars-text-white">
                Feedback: {pattern.feedback}
              </div>
              {pattern.accessibility && (
                <div className="lcars-text-small lcars-text-green lcars-mt-5">
                  Accessibility Enabled
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="lcars-dynamic-layout">
      {/* Intent Controls */}
      {renderIntentControls()}
      
      {/* Layout Information */}
      {renderLayoutInfo()}
      
      {/* Color Scheme Display */}
      {renderColorScheme()}
      
      {/* Interaction Patterns */}
      {renderInteractionPatterns()}
      
      {/* Main Layout */}
      <div className="lcars-main-layout" style={getLayoutStyle()}>
        {currentLayout?.components.map(renderLayoutComponent)}
        {children}
      </div>
      
      {/* Adaptation Overlay */}
      {renderAdaptationOverlay()}
      
      {/* CSS for additional styling */}
      <style jsx>{`
        .lcars-dynamic-layout {
          position: relative;
          min-height: 100vh;
        }
        
        .lcars-adaptation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .lcars-color-sample {
          text-align: center;
        }
        
        .lcars-color-preview {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 2px solid var(--lcars-white);
          margin: 0 auto;
        }
        
        .lcars-component {
          transition: all 0.3s ease-in-out;
        }
        
        .lcars-component:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 8px rgba(255, 156, 0, 0.3);
        }
        
        .lcars-loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
        }
        
        .lcars-spinner-icon {
          width: 48px;
          height: 48px;
          animation: spin 2s linear infinite;
          font-size: 48px;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DynamicLCARSLayout;

