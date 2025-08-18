'use client';

import React, { useState } from 'react';
import { ShipsComputerOrchestrator } from '@/core/components/lcars/ships-computer-orchestrator';
import DynamicLCARSLayout from '@/core/components/lcars/dynamic-lcars-layout';
import { LCARSLayout } from '@/core/components/lcars/lcars-layout';

const AIOrchestrationPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'orchestrator' | 'dynamic-layout'>('orchestrator');
  const [demoIntent, setDemoIntent] = useState<string>('Navigate to main bridge');

  const demoScenarios = [
    {
      name: 'Navigation Command',
      intent: 'Navigate to main bridge',
      description: 'Primary navigation and command interface',
      crew: ['Ship&apos;s Computer', 'Counselor Troi', 'Commander Data']
    },
    {
      name: 'Data Analysis',
      intent: 'Analyze sensor data',
      description: 'Scientific analysis and research interface',
      crew: ['Commander Data', 'Ship&apos;s Computer', 'Counselor Troi']
    },
    {
      name: 'System Monitoring',
      intent: 'Monitor system status',
      description: 'System monitoring and status interface',
      crew: ['Ship&apos;s Computer', 'Lieutenant Worf', 'Chief Engineer Scott']
    },
    {
      name: 'Tactical Command',
      intent: 'Execute tactical command',
      description: 'Tactical operations and security interface',
      crew: ['Lieutenant Worf', 'Ship&apos;s Computer', 'Captain Picard']
    },
    {
      name: 'Communication',
      intent: 'Open communication channel',
      description: 'Communication and diplomatic interface',
      crew: ['Lieutenant Uhura', 'Counselor Troi', 'Ship&apos;s Computer']
    },
    {
      name: 'Research Mission',
      intent: 'Research alien technology',
      description: 'Research and development interface',
      crew: ['Commander Spock', 'Commander Data', 'Ship&apos;s Computer']
    }
  ];

  const handleDemoScenario = (scenario: typeof demoScenarios[0]) => {
    setDemoIntent(scenario.intent);
    setActiveDemo('dynamic-layout');
  };

  return (
    <ShipsComputerOrchestrator>
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30">
          <div className="lcars-text-xlarge lcars-text-gold lcars-mb-20">
            AI ORCHESTRATION SYSTEM
          </div>
          
          <div className="lcars-text-large lcars-text-white lcars-mb-30">
                         Dynamic LCARS Interface Powered by Ship&apos;s Computer, Counselor Troi, and Commander Data
          </div>

          {/* Demo Mode Selector */}
          <div className="lcars-panel lcars-p-20 lcars-mb-30">
            <div className="lcars-text-large lcars-text-orange lcars-mb-15">
              DEMO MODE SELECTOR
            </div>
            <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-2 lcars-gap-15">
              <button
                onClick={() => setActiveDemo('orchestrator')}
                className={`lcars-button lcars-button-primary ${activeDemo === 'orchestrator' ? 'lcars-button-active' : ''}`}
              >
                SHIP&apos;S COMPUTER ORCHESTRATOR
              </button>
              <button
                onClick={() => setActiveDemo('dynamic-layout')}
                className={`lcars-button lcars-button-primary ${activeDemo === 'dynamic-layout' ? 'lcars-button-active' : ''}`}
              >
                DYNAMIC LCARS LAYOUT
              </button>
            </div>
          </div>

          {/* Demo Scenarios */}
          <div className="lcars-panel lcars-p-20 lcars-mb-30">
            <div className="lcars-text-large lcars-text-orange lcars-mb-15">
              DEMO SCENARIOS
            </div>
            <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-2 lcars-lg-grid-cols-3 lcars-gap-15">
              {demoScenarios.map((scenario, index) => (
                <div key={index} className="lcars-panel lcars-p-15">
                  <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                    {scenario.name}
                  </div>
                  <div className="lcars-text-small lcars-text-white lcars-mb-10">
                    {scenario.description}
                  </div>
                  <div className="lcars-text-small lcars-text-purple lcars-mb-15">
                    Crew: {scenario.crew.join(', ')}
                  </div>
                  <button
                    onClick={() => handleDemoScenario(scenario)}
                    className="lcars-button lcars-button-secondary"
                  >
                    Launch Demo
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* System Overview */}
          <div className="lcars-panel lcars-p-20 lcars-mb-30">
            <div className="lcars-text-large lcars-text-orange lcars-mb-15">
              SYSTEM OVERVIEW
            </div>
            <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-3 lcars-gap-20">
              <div className="lcars-panel lcars-p-15">
                <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                                     🖥️ SHIP&apos;S COMPUTER
                </div>
                <div className="lcars-text-small lcars-text-white">
                  • Dynamic layout orchestration<br/>
                  • User intent recognition<br/>
                  • Adaptive interface management<br/>
                  • Performance optimization
                </div>
              </div>
              <div className="lcars-panel lcars-p-15">
                <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                  💙 COUNSELOR TROI
                </div>
                <div className="lcars-text-small lcars-text-white">
                  • Emotional intelligence analysis<br/>
                  • User experience optimization<br/>
                  • Accessibility considerations<br/>
                  • User journey mapping
                </div>
              </div>
              <div className="lcars-panel lcars-p-15">
                <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                  🤖 COMMANDER DATA
                </div>
                <div className="lcars-text-small lcars-text-white">
                  • Efficiency analysis<br/>
                  • Data-driven optimization<br/>
                  • Logical consistency<br/>
                  • Performance metrics
                </div>
              </div>
            </div>
          </div>

          {/* Active Demo Display */}
          <div className="lcars-panel lcars-p-20">
            <div className="lcars-text-large lcars-text-orange lcars-mb-15">
              ACTIVE DEMO: {activeDemo.toUpperCase()}
            </div>
            
            {activeDemo === 'orchestrator' && (
              <div className="lcars-orchestrator-demo">
                <ShipsComputerOrchestrator>
                  <div className="lcars-content-area lcars-p-20">
                    <div className="lcars-text-large lcars-text-white lcars-mb-10">
                      SHIP&apos;S COMPUTER ORCHESTRATOR
                    </div>
                    <div className="lcars-text-medium lcars-text-gold">
                      The Ship&apos;s Computer is actively orchestrating the LCARS interface based on your current mission context.
                    </div>
                  </div>
                </ShipsComputerOrchestrator>
              </div>
            )}
            
            {activeDemo === 'dynamic-layout' && (
              <div className="lcars-dynamic-demo">
                <div className="lcars-panel lcars-p-15 lcars-mb-20">
                  <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                    Current Intent: {demoIntent}
                  </div>
                  <div className="lcars-text-small lcars-text-white">
                                         The Ship&apos;s Computer is analyzing your intent and adapting the LCARS interface accordingly.
                     Counselor Troi is assessing the emotional context, while Commander Data optimizes for efficiency.
                  </div>
                </div>
                <DynamicLCARSLayout initialIntent={demoIntent}>
                  <div className="lcars-content-area lcars-p-20">
                    <div className="lcars-text-large lcars-text-white lcars-mb-10">
                      DYNAMIC CONTENT AREA
                    </div>
                    <div className="lcars-text-medium lcars-text-gold">
                                             This content adapts based on the selected user intent and the Ship&apos;s Computer&apos;s orchestration.
                    </div>
                  </div>
                </DynamicLCARSLayout>
              </div>
            )}
          </div>

          {/* Technical Specifications */}
          <div className="lcars-panel lcars-p-20 lcars-mt-30">
            <div className="lcars-text-large lcars-text-orange lcars-mb-15">
              TECHNICAL SPECIFICATIONS
            </div>
            <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-2 lcars-gap-20">
              <div className="lcars-panel lcars-p-15">
                <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                  FRONTEND ARCHITECTURE
                </div>
                <div className="lcars-text-small lcars-text-white">
                  • Next.js 15 with TypeScript<br/>
                  • React Context for state management<br/>
                  • Tailwind CSS with LCARS design tokens<br/>
                  • Responsive grid system<br/>
                  • Accessibility-first design
                </div>
              </div>
              <div className="lcars-panel lcars-p-15">
                <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                  AI INTEGRATION
                </div>
                <div className="lcars-text-small lcars-text-white">
                  • n8n workflow orchestration<br/>
                  • OpenRouter multi-model AI<br/>
                  • Real-time intent analysis<br/>
                  • Adaptive layout generation<br/>
                  • Crew collaboration system
                </div>
              </div>
            </div>
          </div>

          {/* Michael Okuda Design Principles */}
          <div className="lcars-panel lcars-p-20 lcars-mt-30">
            <div className="lcars-text-large lcars-text-orange lcars-mb-15">
              MICHAEL OKUDA DESIGN PRINCIPLES
            </div>
            <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-2 lcars-gap-20">
              <div className="lcars-panel lcars-p-15">
                <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                  USER INTENT-DRIVEN DESIGN
                </div>
                <div className="lcars-text-small lcars-text-white">
                  LCARS adapts to user intention rather than fixed station layouts.
                  The interface responds to what the user wants to accomplish,
                  not where they happen to be sitting.
                </div>
              </div>
              <div className="lcars-panel lcars-p-15">
                <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                  INFORMATION HIERARCHY
                </div>
                <div className="lcars-text-small lcars-text-white">
                  Critical information is prioritized through visual hierarchy,
                  color coding, and spatial organization. The most important
                  functions are always easily accessible.
                </div>
              </div>
              <div className="lcars-panel lcars-p-15">
                <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                  EFFICIENCY THROUGH FAMILIARITY
                </div>
                <div className="lcars-text-small lcars-text-white">
                  Consistent patterns become intuitive over time. Once users
                  learn the interface, they can operate it efficiently without
                  conscious thought.
                </div>
              </div>
              <div className="lcars-panel lcars-p-15">
                <div className="lcars-text-medium lcars-text-gold lcars-mb-10">
                  ADAPTIVE LAYOUTS
                </div>
                <div className="lcars-text-small lcars-text-white">
                  A single interface adapts to multiple user roles and contexts.
                  The same LCARS system serves everyone from the captain to
                  the engineering crew.
                </div>
              </div>
            </div>
          </div>
        </div>
              </LCARSLayout>
      </ShipsComputerOrchestrator>
    );
};

export default AIOrchestrationPage;
