'use client';

/**
 * Responsive Boundary Manager Component
 * Demonstrates the Ship Computer's ability to prevent components from bleeding outside screen bounds
 * Shows real-time responsive constraint management across different device types
 */

import React, { useState, useEffect, useRef } from 'react';
import useShipComputerLayout from '../core/hooks/useShipComputerLayout';

interface ScreenDimensions {
  width: number;
  height: number;
}

interface BoundaryValidation {
  componentId: string;
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}

const ResponsiveBoundaryManager: React.FC = () => {
  const [currentDevice, setCurrentDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [screenDimensions, setScreenDimensions] = useState<ScreenDimensions>({ width: 1920, height: 1080 });
  const [boundaryValidations, setBoundaryValidations] = useState<BoundaryValidation[]>([]);
  const [isManagingBoundaries, setIsManagingBoundaries] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Ship Computer Layout Orchestrator
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
    pageId: 'responsive-boundary-demo',
    userBehavior: {
      userRole: 'developer',
      urgency: 'medium',
      navigationPattern: ['responsive', 'boundary', 'management']
    },
    contentContext: {
      pageType: 'demo',
      hasForms: false,
      components: 8
    },
    autoAnalyze: true
  });

  // Detect screen dimensions and device type
  useEffect(() => {
    const updateScreenDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenDimensions({ width, height });
      
      // Determine device type based on screen width
      if (width < 768) {
        setCurrentDevice('mobile');
      } else if (width < 1024) {
        setCurrentDevice('tablet');
      } else {
        setCurrentDevice('desktop');
      }
    };

    updateScreenDimensions();
    window.addEventListener('resize', updateScreenDimensions);
    
    return () => window.removeEventListener('resize', updateScreenDimensions);
  }, []);

  // Manage responsive boundaries when screen dimensions change
  useEffect(() => {
    if (componentHierarchy.length > 0 && screenDimensions.width > 0) {
      handleManageBoundaries();
    }
  }, [screenDimensions, componentHierarchy]);

  const handleManageBoundaries = async () => {
    setIsManagingBoundaries(true);
    
    try {
      // Apply responsive boundary management
      manageResponsiveBoundaries(screenDimensions, currentDevice);
      
      // Validate all components
      const validations: BoundaryValidation[] = [];
      for (const component of componentHierarchy) {
        const validation = validateBoundaries(component.id, screenDimensions);
        validations.push({
          componentId: component.id,
          ...validation
        });
      }
      
      setBoundaryValidations(validations);
      
    } catch (err) {
      console.error('Boundary management failed:', err);
    } finally {
      setIsManagingBoundaries(false);
    }
  };

  const getDeviceIcon = (device: 'mobile' | 'tablet' | 'desktop') => {
    switch (device) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      case 'desktop': return '💻';
      default: return '🖥️';
    }
  };

  const getValidationStatusIcon = (isValid: boolean) => {
    return isValid ? '✅' : '❌';
  };

  const getValidationStatusColor = (isValid: boolean) => {
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🚀 Ship Computer Responsive Boundary Manager
          </h1>
          <p className="text-gray-600 text-lg">
            Intelligent layout management that prevents components from bleeding outside screen bounds
          </p>
        </div>

        {/* Device Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Device</h3>
                <p className="text-2xl font-bold text-blue-600">{getDeviceIcon(currentDevice)} {currentDevice.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Screen Size</p>
                <p className="text-lg font-mono">{screenDimensions.width} × {screenDimensions.height}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Components</h3>
                <p className="text-2xl font-bold text-green-600">{componentHierarchy.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-mono">{isAnalyzing ? 'Analyzing...' : 'Ready'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Boundary Status</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {boundaryValidations.length > 0 ? 
                    boundaryValidations.filter(v => v.isValid).length + '/' + boundaryValidations.length : 
                    'Pending'
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Management</p>
                <p className="text-lg font-mono">{isManagingBoundaries ? 'Active' : 'Idle'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Boundary Management Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Boundary Management Controls</h2>
            <button
              onClick={handleManageBoundaries}
              disabled={isManagingBoundaries || componentHierarchy.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isManagingBoundaries ? 'Managing...' : 'Manage Boundaries'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
              <select
                value={currentDevice}
                onChange={(e) => setCurrentDevice(e.target.value as 'mobile' | 'tablet' | 'desktop')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mobile">Mobile (375×667)</option>
                <option value="tablet">Tablet (1024×768)</option>
                <option value="desktop">Desktop (1920×1080)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Screen Dimensions</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={screenDimensions.width}
                  onChange={(e) => setScreenDimensions(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Width"
                />
                <span className="text-gray-500 self-center">×</span>
                <input
                  type="number"
                  value={screenDimensions.height}
                  onChange={(e) => setScreenDimensions(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Height"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Component Hierarchy with Boundary Validation */}
        {componentHierarchy.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Component Boundary Validation</h2>
            <div className="space-y-4">
              {componentHierarchy.map((component) => {
                const validation = boundaryValidations.find(v => v.componentId === component.id);
                const css = generateResponsiveCSS(component.id, currentDevice);
                
                return (
                  <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{component.id}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getValidationStatusColor(validation?.isValid || false)}`}>
                          {getValidationStatusIcon(validation?.isValid || false)} {validation?.isValid ? 'Valid' : 'Invalid'}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {component.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Position</p>
                        <p className="font-mono">{component.position}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Size</p>
                        <p className="font-mono">{component.size}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <p className="font-mono">{component.priority}</p>
                      </div>
                    </div>
                    
                    {css && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Responsive CSS</p>
                        <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                          {css}
                        </code>
                      </div>
                    )}
                    
                    {validation && !validation.isValid && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-red-800 mb-2">Boundary Issues:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {validation.issues.map((issue, idx) => (
                            <li key={idx}>• {issue}</li>
                          ))}
                        </ul>
                        {validation.recommendations.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium text-red-800 mb-1">Recommendations:</h5>
                            <ul className="text-sm text-red-700 space-y-1">
                              {validation.recommendations.map((rec, idx) => (
                                <li key={idx}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Crew Recommendations */}
        {crewRecommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Crew Recommendations</h2>
            <div className="space-y-3">
              {crewRecommendations.map((rec, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">{rec.crewMember}</h4>
                      <p className="text-sm text-blue-700 mt-1">{rec.recommendation}</p>
                      {rec.reasoning && (
                        <p className="text-xs text-blue-600 mt-2">{rec.reasoning}</p>
                      )}
                    </div>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      Priority {rec.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-400 mr-2">❌</span>
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Live Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Boundary Preview</h2>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50"
            style={{
              width: `${Math.min(screenDimensions.width, 800)}px`,
              height: `${Math.min(screenDimensions.height, 600)}px`,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Screen Boundary Preview</p>
              <p className="text-sm">{screenDimensions.width} × {screenDimensions.height} pixels</p>
              <p className="text-sm">Device: {currentDevice}</p>
              <p className="text-sm">Components: {componentHierarchy.length}</p>
            </div>
            
            {/* Show component boundaries */}
            {componentHierarchy.map((component, idx) => {
              const validation = boundaryValidations.find(v => v.componentId === component.id);
              const isOverflowing = validation && !validation.isValid;
              
              return (
                <div
                  key={component.id}
                  className={`absolute border-2 rounded p-2 text-xs ${
                    isOverflowing 
                      ? 'border-red-500 bg-red-100 text-red-800' 
                      : 'border-green-500 bg-green-100 text-green-800'
                  }`}
                  style={{
                    top: `${20 + (idx * 60)}px`,
                    left: `${20 + (idx * 20)}px`,
                    maxWidth: '150px',
                    maxHeight: '80px',
                    overflow: 'hidden'
                  }}
                >
                  {component.id}
                  <br />
                  {component.type}
                  <br />
                  {isOverflowing ? '❌ Overflow' : '✅ Bounded'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveBoundaryManager;
