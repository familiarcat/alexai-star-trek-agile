'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  RocketLaunchIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';

interface ProfitabilityResultsFlowProps {
  analysisResult?: any;
  onLaunchProject?: (project: any) => void;
}

interface ProfitabilityPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedROI: number;
  timeline: string;
  crewMembers: string[];
  resources: string[];
  successMetrics: string[];
  blockers: string[];
  nextActions: string[];
}

export function ProfitabilityResultsFlow({ analysisResult, onLaunchProject }: ProfitabilityResultsFlowProps) {
  const [currentPhase, setCurrentPhase] = useState<string>('planning');
  const [phases, setPhases] = useState<ProfitabilityPhase[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectLauncher, setShowProjectLauncher] = useState(false);

  useEffect(() => {
    if (analysisResult) {
      generateProfitabilityPhases(analysisResult);
    }
  }, [analysisResult]);

  const generateProfitabilityPhases = (result: any) => {
    const generatedPhases: ProfitabilityPhase[] = [
      {
        id: 'phase-1',
        name: 'Immediate Revenue Generation',
        description: 'Focus on consulting services and quick wins for immediate cash flow',
        status: 'active',
        priority: 'critical',
        estimatedROI: 600,
        timeline: '2-4 weeks',
        crewMembers: ['Captain Picard', 'Chief Communications Officer'],
        resources: ['Sales enablement materials', 'Client presentation templates', 'Pricing strategy'],
        successMetrics: ['First client signed', 'Revenue generated', 'Case study created'],
        blockers: ['Client acquisition strategy', 'Pricing model validation'],
        nextActions: ['Create sales pitch', 'Identify target clients', 'Set up billing system']
      },
      {
        id: 'phase-2',
        name: 'MVP Development',
        description: 'Build core automation platform components for demonstration',
        status: 'pending',
        priority: 'high',
        estimatedROI: 450,
        timeline: '6-8 weeks',
        crewMembers: ['Commander Data', 'Chief Engineer Scott'],
        resources: ['Development environment', 'API access', 'Cloud infrastructure'],
        successMetrics: ['Core functionality working', 'Demo ready', 'Performance benchmarks'],
        blockers: ['Technical architecture', 'API integrations'],
        nextActions: ['Set up development environment', 'Design system architecture', 'Begin core development']
      },
      {
        id: 'phase-3',
        name: 'Pilot Customer Program',
        description: 'Launch beta program with select customers for validation',
        status: 'pending',
        priority: 'high',
        estimatedROI: 320,
        timeline: '8-12 weeks',
        crewMembers: ['Chief Communications Officer', 'Enhanced Knowledge Integration'],
        resources: ['Pilot customer selection', 'Implementation support', 'Feedback collection'],
        successMetrics: ['Pilot customers onboarded', 'ROI demonstrated', 'Testimonials collected'],
        blockers: ['Customer selection criteria', 'Implementation timeline'],
        nextActions: ['Identify pilot customers', 'Create implementation plan', 'Set up feedback system']
      },
      {
        id: 'phase-4',
        name: 'Market Expansion',
        description: 'Scale successful pilots to broader market penetration',
        status: 'pending',
        priority: 'medium',
        estimatedROI: 280,
        timeline: '12-16 weeks',
        crewMembers: ['Captain Picard', 'Counselor Troi'],
        resources: ['Marketing materials', 'Sales team', 'Partnership strategy'],
        successMetrics: ['Market share growth', 'Revenue scaling', 'Brand recognition'],
        blockers: ['Marketing budget', 'Sales team scaling'],
        nextActions: ['Develop marketing strategy', 'Scale sales operations', 'Establish partnerships']
      }
    ];

    setPhases(generatedPhases);
  };

  const getPhaseStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayIcon className="w-5 h-5 text-green-500" />;
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'blocked': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default: return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500 bg-green-50';
      case 'completed': return 'border-blue-500 bg-blue-50';
      case 'blocked': return 'border-red-500 bg-red-50';
      default: return 'border-yellow-500 bg-yellow-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const launchPhase = (phase: ProfitabilityPhase) => {
    setSelectedProject({
      name: phase.name,
      description: phase.description,
      roi: phase.estimatedROI,
      timeline: phase.timeline,
      crew: phase.crewMembers,
      resources: phase.resources,
      metrics: phase.successMetrics
    });
    setShowProjectLauncher(true);
  };

  const executeNextAction = (phaseId: string, action: string) => {
    // Simulate action execution
    console.log(`Executing: ${action} for phase ${phaseId}`);
    
    // Update phase status
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          status: phase.status === 'pending' ? 'active' : phase.status,
          nextActions: phase.nextActions.filter(a => a !== action)
        };
      }
      return phase;
    }));
  };

  const calculateTotalROI = () => {
    return phases.reduce((sum, phase) => sum + phase.estimatedROI, 0);
  };

  const calculateTimeToProfitability = () => {
    const criticalPhases = phases.filter(p => p.priority === 'critical');
    const maxTimeline = Math.max(...criticalPhases.map(p => parseInt(p.timeline.split('-')[0])));
    return `${maxTimeline} weeks`;
  };

  return (
    <div className="lcars-panel">
      <h2>💰 PROFITABILITY RESULTS FLOW</h2>
      
      {/* Executive Summary */}
      <div className="lcars-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#000', marginBottom: '15px' }}>Profitability Roadmap</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lcars-green)' }}>
              ${(calculateTotalROI() * 1000).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>
              Total Projected Revenue
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lcars-orange)' }}>
              {calculateTimeToProfitability()}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>
              Time to Profitability
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lcars-violet)' }}>
              {phases.filter(p => p.status === 'active').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>
              Active Phases
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lcars-sky)' }}>
              {phases.filter(p => p.priority === 'critical').length}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>
              Critical Priorities
            </div>
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="lcars-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#000', marginBottom: '15px' }}>Phase Navigation</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setCurrentPhase(phase.id)}
              className={`lcars-button ${currentPhase === phase.id ? 'primary' : 'secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {getPhaseStatusIcon(phase.status)}
              {phase.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Phase Details */}
      {phases.map((phase) => (
        <div key={phase.id} style={{ display: currentPhase === phase.id ? 'block' : 'none' }}>
          <div className="lcars-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h3 style={{ color: '#000', margin: 0, marginBottom: '10px' }}>{phase.name}</h3>
                <p style={{ color: 'var(--lcars-text-purple)', margin: 0 }}>{phase.description}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div className={`lcars-priority-${phase.priority}`} style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {phase.priority.toUpperCase()}
                </div>
                
                <button 
                  onClick={() => launchPhase(phase)}
                  className="lcars-button primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RocketLaunchIcon className="w-4 h-4" />
                  Launch
                </button>
              </div>
            </div>

            {/* Phase Status Bar */}
            <div style={{ 
              padding: '15px', 
              border: '2px solid', 
              borderRadius: '8px',
              ...getPhaseStatusColor(phase.status)
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                {getPhaseStatusIcon(phase.status)}
                <span style={{ fontWeight: 'bold' }}>
                  Status: {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--lcars-text-purple)' }}>Timeline</div>
                  <div>{phase.timeline}</div>
                </div>
                
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--lcars-text-purple)' }}>Estimated ROI</div>
                  <div style={{ color: 'var(--lcars-green)', fontWeight: 'bold' }}>{phase.estimatedROI}%</div>
                </div>
                
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--lcars-text-purple)' }}>Crew Members</div>
                  <div>{phase.crewMembers.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase Components */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            {/* Resources */}
            <div className="lcars-card">
              <h4 style={{ color: '#000', marginBottom: '15px' }}>Required Resources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {phase.resources.map((resource, index) => (
                  <div key={index} className="lcars-status info">
                    {resource}
                  </div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="lcars-card">
              <h4 style={{ color: '#000', marginBottom: '15px' }}>Success Metrics</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {phase.successMetrics.map((metric, index) => (
                  <div key={index} className="lcars-status success">
                    {metric}
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers */}
            <div className="lcars-card">
              <h4 style={{ color: '#000', marginBottom: '15px' }}>Potential Blockers</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {phase.blockers.map((blocker, index) => (
                  <div key={index} className="lcars-status warning">
                    {blocker}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Actions */}
            <div className="lcars-card">
              <h4 style={{ color: '#000', marginBottom: '15px' }}>Next Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {phase.nextActions.map((action, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem' }}>{action}</span>
                    <button 
                      onClick={() => executeNextAction(phase.id, action)}
                      className="lcars-button"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      Execute
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Project Launcher Modal */}
      {showProjectLauncher && selectedProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="lcars-card" style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <h3 style={{ color: '#000', marginBottom: '20px' }}>🚀 Launch Project: {selectedProject.name}</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Project Details:</div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Description:</strong> {selectedProject.description}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>ROI:</strong> <span style={{ color: 'var(--lcars-green)' }}>{selectedProject.roi}%</span>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Timeline:</strong> {selectedProject.timeline}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Crew:</strong> {selectedProject.crew.join(', ')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowProjectLauncher(false)}
                className="lcars-button secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onLaunchProject?.(selectedProject);
                  setShowProjectLauncher(false);
                }}
                className="lcars-button primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RocketLaunchIcon className="w-4 h-4" />
                Launch Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="lcars-card" style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#000', marginBottom: '15px' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button className="lcars-button primary">
            📊 Generate Financial Report
          </button>
          <button className="lcars-button secondary">
            👥 Assemble Crew Team
          </button>
          <button className="lcars-button success">
            💰 Set Up Billing System
          </button>
          <button className="lcars-button">
            📈 Track Progress
          </button>
        </div>
      </div>
    </div>
  );
}
