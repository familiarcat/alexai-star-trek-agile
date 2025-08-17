/**
 * Ship Computer Demo Component
 * Demonstrates the intelligent layout orchestration system
 * Shows how all 8 Star Trek crew members work together
 */

import React, { useState, useEffect } from 'react';
import useShipComputerLayout from '../core/hooks/useShipComputerLayout';

interface DemoUserBehavior {
  navigationPattern: string[];
  errorRate: number;
  completionRate: number;
  sessionDuration: number;
  pageViews: number;
  interactions: number;
  searchQueries: string[];
  explorationTime: number;
}

interface DemoContentContext {
  pageType: string;
  hasForms: boolean;
  components: number;
}

const ShipComputerDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userBehavior, setUserBehavior] = useState<DemoUserBehavior>({
    navigationPattern: ['dashboard'],
    errorRate: 0.05,
    completionRate: 0.85,
    sessionDuration: 300,
    pageViews: 5,
    interactions: 12,
    searchQueries: ['project status'],
    explorationTime: 120
  });

  const [contentContext, setContentContext] = useState<DemoContentContext>({
    pageType: 'dashboard',
    hasForms: false,
    components: 15
  });

  // Initialize Ship Computer Layout Orchestrator
  const {
    layoutAnalysis,
    userIntent,
    layoutStrategy,
    componentHierarchy,
    isAnalyzing,
    isOptimizing,
    lastAnalysis,
    optimizationScore,
    analyzeLayout,
    optimizeLayout,
    updateUserBehavior,
    updateContentContext,
    crewMembers,
    crewRecommendations,
    error,
    clearError
  } = useShipComputerLayout({
    pageId: currentPage,
    userBehavior,
    contentContext,
    autoAnalyze: true,
    optimizationInterval: 15000 // 15 seconds for demo
  });

  // Simulate user behavior changes
  useEffect(() => {
    const behaviorInterval = setInterval(() => {
      const newBehavior = {
        ...userBehavior,
        sessionDuration: userBehavior.sessionDuration + 10,
        interactions: userBehavior.interactions + Math.floor(Math.random() * 3),
        pageViews: userBehavior.pageViews + Math.floor(Math.random() * 2)
      };
      
      setUserBehavior(newBehavior);
      updateUserBehavior(newBehavior);
    }, 5000);

    return () => clearInterval(behaviorInterval);
  }, [userBehavior, updateUserBehavior]);

  // Simulate page navigation
  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    const newContext = {
      ...contentContext,
      pageType: page,
      components: page === 'dashboard' ? 15 : page === 'tasks' ? 25 : page === 'analytics' ? 35 : 20,
      hasForms: page === 'tasks' || page === 'projects'
    };
    
    setContentContext(newContext);
    updateContentContext(newContext);
  };

  // Simulate user errors or successes
  const simulateUserAction = (action: 'success' | 'error' | 'exploration') => {
    let newBehavior = { ...userBehavior };
    
    switch (action) {
      case 'success':
        newBehavior.completionRate = Math.min(1.0, newBehavior.completionRate + 0.05);
        newBehavior.errorRate = Math.max(0, newBehavior.errorRate - 0.02);
        break;
      case 'error':
        newBehavior.errorRate = Math.min(1.0, newBehavior.errorRate + 0.1);
        newBehavior.completionRate = Math.max(0, newBehavior.completionRate - 0.05);
        break;
      case 'exploration':
        newBehavior.explorationTime += 30;
        newBehavior.interactions += 2;
        break;
    }
    
    setUserBehavior(newBehavior);
    updateUserBehavior(newBehavior);
  };

  return (
    <div className="ship-computer-demo p-6 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">
          🚀 Ship Computer Layout Orchestrator
        </h1>
        <p className="text-xl text-gray-300">
          Intelligent Layout Management Powered by All 8 Star Trek Crew Members
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border border-red-500 text-white px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>🚨 {error}</span>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => navigateToPage('dashboard')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            currentPage === 'dashboard'
              ? 'border-yellow-400 bg-yellow-900 text-yellow-100'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
        >
          🏠 Dashboard
        </button>
        <button
          onClick={() => navigateToPage('tasks')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            currentPage === 'tasks'
              ? 'border-yellow-400 bg-yellow-900 text-yellow-100'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
        >
          ✅ Tasks
        </button>
        <button
          onClick={() => navigateToPage('analytics')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            currentPage === 'analytics'
              ? 'border-yellow-400 bg-yellow-900 text-yellow-100'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
        >
          📊 Analytics
        </button>
        <button
          onClick={() => navigateToPage('projects')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            currentPage === 'projects'
              ? 'border-yellow-400 bg-yellow-900 text-yellow-100'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}
        >
          🚀 Projects
        </button>
      </div>

      {/* User Behavior Simulation */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          🎭 User Behavior Simulation
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">
              {userBehavior.errorRate.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Error Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {userBehavior.completionRate.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {userBehavior.interactions}
            </div>
            <div className="text-sm text-gray-400">Interactions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">
              {Math.floor(userBehavior.sessionDuration / 60)}m
            </div>
            <div className="text-sm text-gray-400">Session Time</div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => simulateUserAction('success')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            🎯 Simulate Success
          </button>
          <button
            onClick={() => simulateUserAction('error')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            ❌ Simulate Error
          </button>
          <button
            onClick={() => simulateUserAction('exploration')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            🔍 Simulate Exploration
          </button>
        </div>
      </div>

      {/* Ship Computer Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Layout Analysis */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            🧠 Layout Analysis Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Analysis Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isAnalyzing ? 'bg-blue-600 text-blue-100' : 'bg-green-600 text-green-100'
              }`}>
                {isAnalyzing ? 'Analyzing...' : 'Ready'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Optimization Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isOptimizing ? 'bg-purple-600 text-purple-100' : 'bg-green-600 text-green-100'
              }`}>
                {isOptimizing ? 'Optimizing...' : 'Ready'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Optimization Score:</span>
              <span className="text-2xl font-bold text-yellow-400">
                {optimizationScore}/100
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Last Analysis:</span>
              <span className="text-gray-300">
                {lastAnalysis ? lastAnalysis.toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <button
              onClick={analyzeLayout}
              disabled={isAnalyzing}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded transition-colors"
            >
              {isAnalyzing ? '🔍 Analyzing...' : '🔍 Analyze Layout'}
            </button>
            
            <button
              onClick={optimizeLayout}
              disabled={isOptimizing || !layoutAnalysis}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded transition-colors"
            >
              {isOptimizing ? '🔄 Optimizing...' : '🔄 Optimize Layout'}
            </button>
          </div>
        </div>

        {/* User Intent Analysis */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            🎯 User Intent Analysis
          </h2>
          
          {userIntent ? (
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Primary Intent:</span>
                <div className="text-lg font-medium text-white">{userIntent.primary}</div>
              </div>
              
              <div>
                <span className="text-gray-400">Secondary Intents:</span>
                <div className="text-sm text-gray-300">
                  {userIntent.secondary.join(', ')}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Urgency:</span>
                  <div className={`px-2 py-1 rounded text-sm font-medium ${
                    userIntent.urgency === 'critical' ? 'bg-red-600' :
                    userIntent.urgency === 'high' ? 'bg-orange-600' :
                    userIntent.urgency === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                  }`}>
                    {userIntent.urgency}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400">Complexity:</span>
                  <div className={`px-2 py-1 rounded text-sm font-medium ${
                    userIntent.complexity === 'complex' ? 'bg-red-600' :
                    userIntent.complexity === 'moderate' ? 'bg-yellow-600' : 'bg-green-600'
                  }`}>
                    {userIntent.complexity}
                  </div>
                </div>
              </div>
              
              <div>
                <span className="text-gray-400">Emotional State:</span>
                <div className={`px-2 py-1 rounded text-sm font-medium ${
                  userIntent.emotionalState === 'frustrated' ? 'bg-red-600' :
                  userIntent.emotionalState === 'excited' ? 'bg-green-600' :
                  userIntent.emotionalState === 'exploratory' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  {userIntent.emotionalState}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              No user intent analysis available yet.
              <br />
              Click "Analyze Layout" to begin.
            </div>
          )}
        </div>
      </div>

      {/* Crew Members Status */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          👥 Star Trek Crew Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {crewMembers.map((crew) => (
            <div key={crew.id} className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">
                {crew.id === 'captain-picard' && '👨‍✈️'}
                {crew.id === 'commander-data' && '🤖'}
                {crew.id === 'counselor-troi' && '👩‍⚕️'}
                {crew.id === 'chief-engineer-scott' && '🔧'}
                {crew.id === 'commander-spock' && '🖖'}
                {crew.id === 'lieutenant-worf' && '🛡️'}
                {crew.id === 'quark' && '💰'}
                {crew.id === 'observation-lounge' && '🏛️'}
              </div>
              <div className="font-medium text-white mb-1">
                {crew.name.split('(')[0].trim()}
              </div>
              <div className="text-sm text-gray-400">
                {crew.role}
              </div>
              <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${
                crew.isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
              }`}>
                {crew.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Component Hierarchy */}
      {componentHierarchy.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            🏗️ Intelligent Component Hierarchy
          </h2>
          
          <div className="space-y-3">
            {componentHierarchy.map((component, index) => (
              <div key={component.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {component.type === 'navigation' && '🧭'}
                      {component.type === 'content' && '📄'}
                      {component.type === 'action' && '🎯'}
                      {component.type === 'information' && 'ℹ️'}
                      {component.type === 'interaction' && '🔄'}
                    </span>
                    <div>
                      <div className="font-medium text-white">{component.id}</div>
                      <div className="text-sm text-gray-400">{component.type}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-400">
                      Priority {component.priority}
                    </div>
                    <div className="text-sm text-gray-400">
                      {component.position} • {component.size}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Position:</span>
                    <div className="text-white">{component.position}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <div className="text-white">{component.size}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Visibility:</span>
                    <div className="text-white">{component.visibility}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Intent Alignment:</span>
                    <div className="text-white">{(component.userIntentAlignment * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Plan */}
      {crewRecommendations.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            📋 Crew Implementation Plan
          </h2>
          
          <div className="space-y-3">
            {crewRecommendations.map((step) => (
              <div key={step.step} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">{step.description}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        step.estimatedEffort === 'high' ? 'bg-red-600' :
                        step.estimatedEffort === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {step.estimatedEffort} effort
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-2">
                      <strong>Responsible:</strong> {step.crewResponsible}
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      <strong>Success Criteria:</strong>
                      <ul className="list-disc list-inside mt-1 ml-4">
                        {step.successCriteria.map((criterion: string, idx: number) => (
                          <li key={idx}>{criterion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-gray-400">
        <p>
          🚀 Ship Computer Layout Orchestrator - 
          Coordinating all 8 Star Trek crew members for intelligent UI/UX design
        </p>
        <p className="text-sm mt-2">
          "Make it so." - Captain Jean-Luc Picard
        </p>
      </div>
    </div>
  );
};

export default ShipComputerDemo;
