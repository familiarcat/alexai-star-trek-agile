'use client';

import { useState, useEffect } from 'react';
import { 
  RocketLaunchIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CogIcon,
  LightBulbIcon,
  DocumentTextIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface AutomatedBusinessExecutorProps {
  onBusinessLaunched?: (business: any) => void;
}

interface BusinessOpportunity {
  id: string;
  title: string;
  description: string;
  estimatedROI: number;
  complexity: 'low' | 'medium' | 'high';
  timeline: string;
  requiredResources: string[];
  crewMembers: string[];
  status: 'identified' | 'planning' | 'executing' | 'launched' | 'profitable';
  progress: number;
  nextActions: string[];
  revenueProjections: RevenueProjection[];
}

interface RevenueProjection {
  month: number;
  projectedRevenue: number;
  actualRevenue?: number;
  expenses: number;
  profit: number;
  profitMargin: number;
}

interface ExecutionPhase {
  id: string;
  name: string;
  description: string;
  duration: string;
  tasks: ExecutionTask[];
  status: 'pending' | 'active' | 'completed';
  progress: number;
}

interface ExecutionTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  actualHours?: number;
}

export function AutomatedBusinessExecutor({ onBusinessLaunched }: AutomatedBusinessExecutorProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<BusinessOpportunity | null>(null);
  const [executionPhases, setExecutionPhases] = useState<ExecutionPhase[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [executionMetrics, setExecutionMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalHours: 0,
    actualHours: 0,
    projectedRevenue: 0,
    actualRevenue: 0
  });

  // Pre-populated business opportunities from our analysis
  const businessOpportunities: BusinessOpportunity[] = [
    {
      id: '1',
      title: 'AI Automation Consulting Services',
      description: 'Enterprise AI automation consulting with proven methodologies and case studies',
      estimatedROI: 600,
      complexity: 'low',
      timeline: '2-4 months',
      requiredResources: ['Consultants', 'Sales Team', 'Case Studies', 'Methodology Framework'],
      crewMembers: ['Captain Picard', 'Chief Communications Officer'],
      status: 'identified',
      progress: 0,
      nextActions: [
        'Create consulting service packages',
        'Develop sales pitch materials',
        'Set up billing and invoicing system',
        'Create case study templates',
        'Build client presentation deck'
      ],
      revenueProjections: [
        { month: 1, projectedRevenue: 15000, expenses: 5000, profit: 10000, profitMargin: 66.7 },
        { month: 2, projectedRevenue: 25000, expenses: 8000, profit: 17000, profitMargin: 68.0 },
        { month: 3, projectedRevenue: 40000, expenses: 12000, profit: 28000, profitMargin: 70.0 },
        { month: 4, projectedRevenue: 60000, expenses: 15000, profit: 45000, profitMargin: 75.0 }
      ]
    },
    {
      id: '2',
      title: 'Multi-LLM Orchestration Platform',
      description: 'Advanced framework for orchestrating multiple language models with intelligent routing',
      estimatedROI: 520,
      complexity: 'high',
      timeline: '5-7 months',
      requiredResources: ['AI Architects', 'Backend Engineers', 'DevOps', 'Cloud Infrastructure'],
      crewMembers: ['Commander Data', 'Chief Engineer Scott'],
      status: 'identified',
      progress: 0,
      nextActions: [
        'Design system architecture',
        'Create technical specifications',
        'Set up development environment',
        'Build MVP prototype',
        'Implement core orchestration logic'
      ],
      revenueProjections: [
        { month: 1, projectedRevenue: 0, expenses: 15000, profit: -15000, profitMargin: 0 },
        { month: 2, projectedRevenue: 0, expenses: 20000, profit: -20000, profitMargin: 0 },
        { month: 3, projectedRevenue: 0, expenses: 25000, profit: -25000, profitMargin: 0 },
        { month: 4, projectedRevenue: 0, expenses: 30000, profit: -30000, profitMargin: 0 },
        { month: 5, projectedRevenue: 0, expenses: 35000, profit: -35000, profitMargin: 0 },
        { month: 6, projectedRevenue: 50000, expenses: 40000, profit: 10000, profitMargin: 20.0 },
        { month: 7, projectedRevenue: 100000, expenses: 45000, profit: 55000, profitMargin: 55.0 }
      ]
    },
    {
      id: '3',
      title: 'AI Workflow Automation Tools',
      description: 'n8n integration platform with AI-powered workflow design and optimization',
      estimatedROI: 390,
      complexity: 'medium',
      timeline: '4-6 months',
      requiredResources: ['Workflow Engineers', 'AI Integration Specialists', 'n8n Expertise'],
      crewMembers: ['Commander Data', 'Chief Engineer Scott'],
      status: 'identified',
      progress: 0,
      nextActions: [
        'Research n8n integration requirements',
        'Design AI workflow templates',
        'Build workflow optimization engine',
        'Create user interface',
        'Develop documentation and training'
      ],
      revenueProjections: [
        { month: 1, projectedRevenue: 0, expenses: 12000, profit: -12000, profitMargin: 0 },
        { month: 2, projectedRevenue: 0, expenses: 15000, profit: -15000, profitMargin: 0 },
        { month: 3, projectedRevenue: 0, expenses: 18000, profit: -18000, profitMargin: 0 },
        { month: 4, projectedRevenue: 30000, expenses: 20000, profit: 10000, profitMargin: 33.3 },
        { month: 5, projectedRevenue: 50000, expenses: 22000, profit: 28000, profitMargin: 56.0 },
        { month: 6, projectedRevenue: 80000, expenses: 25000, profit: 55000, profitMargin: 68.8 }
      ]
    }
  ];

  useEffect(() => {
    if (selectedOpportunity) {
      generateExecutionPhases(selectedOpportunity);
    }
  }, [selectedOpportunity]);

  const generateExecutionPhases = (opportunity: BusinessOpportunity) => {
    const phases: ExecutionPhase[] = [];
    
    if (opportunity.complexity === 'low') {
      // Low complexity: 2 phases
      phases.push({
        id: 'phase-1',
        name: 'Foundation & Launch',
        description: 'Set up business infrastructure and launch services',
        duration: '2-4 weeks',
        tasks: generateFoundationTasks(opportunity),
        status: 'pending',
        progress: 0
      });
      
      phases.push({
        id: 'phase-2',
        name: 'Scale & Optimize',
        description: 'Scale operations and optimize for growth',
        duration: '5-12 weeks',
        tasks: generateScaleTasks(opportunity),
        status: 'pending',
        progress: 0
      });
    } else if (opportunity.complexity === 'medium') {
      // Medium complexity: 3 phases
      phases.push({
        id: 'phase-1',
        name: 'Research & Planning',
        description: 'Research requirements and create detailed plan',
        duration: '3-4 weeks',
        tasks: generateResearchTasks(opportunity),
        status: 'pending',
        progress: 0
      });
      
      phases.push({
        id: 'phase-2',
        name: 'Development & Testing',
        description: 'Build MVP and test with users',
        duration: '6-8 weeks',
        tasks: generateDevelopmentTasks(opportunity),
        status: 'pending',
        progress: 0
      });
      
      phases.push({
        id: 'phase-3',
        name: 'Launch & Market',
        description: 'Launch product and begin marketing',
        duration: '4-6 weeks',
        tasks: generateLaunchTasks(opportunity),
        status: 'pending',
        progress: 0
      });
    } else {
      // High complexity: 4 phases
      phases.push({
        id: 'phase-1',
        name: 'Architecture & Design',
        description: 'Design system architecture and technical specifications',
        duration: '4-6 weeks',
        tasks: generateArchitectureTasks(opportunity),
        status: 'pending',
        progress: 0
      });
      
      phases.push({
        id: 'phase-2',
        name: 'Core Development',
        description: 'Build core system functionality',
        duration: '8-12 weeks',
        tasks: generateCoreDevelopmentTasks(opportunity),
        status: 'pending',
        progress: 0
      });
      
      phases.push({
        id: 'phase-3',
        name: 'Integration & Testing',
        description: 'Integrate components and comprehensive testing',
        duration: '4-6 weeks',
        tasks: generateIntegrationTasks(opportunity),
        status: 'pending',
        progress: 0
      });
      
      phases.push({
        id: 'phase-4',
        name: 'Launch & Scale',
        description: 'Launch product and scale operations',
        duration: '6-8 weeks',
        tasks: generateScaleTasks(opportunity),
        status: 'pending',
        progress: 0
      });
    }
    
    setExecutionPhases(phases);
  };

  const generateFoundationTasks = (opportunity: BusinessOpportunity): ExecutionTask[] => {
    return [
      {
        id: 'task-1',
        title: 'Create Service Packages',
        description: 'Define consulting service tiers and pricing',
        assignedTo: 'Captain Picard',
        dueDate: getDateInDays(7),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 16
      },
      {
        id: 'task-2',
        title: 'Develop Sales Materials',
        description: 'Create compelling sales pitch and presentation deck',
        assignedTo: 'Chief Communications Officer',
        dueDate: getDateInDays(10),
        status: 'pending',
        priority: 'high',
        estimatedHours: 20
      },
      {
        id: 'task-3',
        title: 'Set Up Business Infrastructure',
        description: 'Configure billing, invoicing, and project management',
        assignedTo: 'Chief Engineer Scott',
        dueDate: getDateInDays(14),
        status: 'pending',
        priority: 'high',
        estimatedHours: 24
      },
      {
        id: 'task-4',
        title: 'Create Case Study Templates',
        description: 'Develop templates for documenting client success',
        assignedTo: 'Captain Picard',
        dueDate: getDateInDays(21),
        status: 'pending',
        priority: 'medium',
        estimatedHours: 12
      }
    ];
  };

  const generateScaleTasks = (opportunity: BusinessOpportunity): ExecutionTask[] => {
    return [
      {
        id: 'task-5',
        title: 'Secure First 3 Clients',
        description: 'Close initial consulting engagements',
        assignedTo: 'Captain Picard',
        dueDate: getDateInDays(35),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 40
      },
      {
        id: 'task-6',
        title: 'Optimize Service Delivery',
        description: 'Streamline processes based on client feedback',
        assignedTo: 'Commander Data',
        dueDate: getDateInDays(42),
        status: 'pending',
        priority: 'high',
        estimatedHours: 24
      },
      {
        id: 'task-7',
        title: 'Build Reference Network',
        description: 'Develop testimonials and case studies',
        assignedTo: 'Chief Communications Officer',
        dueDate: getDateInDays(56),
        status: 'pending',
        priority: 'medium',
        estimatedHours: 16
      }
    ];
  };

  const generateResearchTasks = (opportunity: BusinessOpportunity): ExecutionTask[] => {
    return [
      {
        id: 'task-1',
        title: 'Market Research',
        description: 'Analyze competition and market opportunities',
        assignedTo: 'Captain Picard',
        dueDate: getDateInDays(14),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 24
      },
      {
        id: 'task-2',
        title: 'Technical Requirements',
        description: 'Define technical specifications and architecture',
        assignedTo: 'Commander Data',
        dueDate: getDateInDays(21),
        status: 'pending',
        priority: 'high',
        estimatedHours: 32
      },
      {
        id: 'task-3',
        title: 'Resource Planning',
        description: 'Plan team composition and resource allocation',
        assignedTo: 'Chief Engineer Scott',
        dueDate: getDateInDays(28),
        status: 'pending',
        priority: 'high',
        estimatedHours: 16
      }
    ];
  };

  const generateDevelopmentTasks = (opportunity: BusinessOpportunity): ExecutionTask[] => {
    return [
      {
        id: 'task-4',
        title: 'Build MVP',
        description: 'Develop minimum viable product',
        assignedTo: 'Commander Data',
        dueDate: getDateInDays(56),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 80
      },
      {
        id: 'task-5',
        title: 'User Testing',
        description: 'Conduct user testing and gather feedback',
        assignedTo: 'Chief Engineer Scott',
        dueDate: getDateInDays(70),
        status: 'pending',
        priority: 'high',
        estimatedHours: 24
      }
    ];
  };

  const generateLaunchTasks = (opportunity: BusinessOpportunity): ExecutionTask[] => {
    return [
      {
        id: 'task-6',
        title: 'Product Launch',
        description: 'Launch product to market',
        assignedTo: 'Captain Picard',
        dueDate: getDateInDays(84),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 16
      },
      {
        id: 'task-7',
        title: 'Marketing Campaign',
        description: 'Execute marketing and sales campaigns',
        assignedTo: 'Chief Communications Officer',
        dueDate: getDateInDays(98),
        status: 'pending',
        priority: 'high',
        estimatedHours: 32
      }
    ];
  };

  const generateArchitectureTasks = (opportunity: BusinessOpportunity): ExecutionTask[] => {
    return [
      {
        id: 'task-1',
        title: 'System Architecture Design',
        description: 'Design comprehensive system architecture',
        assignedTo: 'Commander Data',
        dueDate: getDateInDays(28),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 48
      },
      {
        id: 'task-2',
        title: 'Technical Specifications',
        description: 'Create detailed technical specifications',
        assignedTo: 'Commander Data',
        dueDate: getDateInDays(35),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 32
      },
      {
        id: 'task-3',
        title: 'Infrastructure Planning',
        description: 'Plan cloud infrastructure and deployment',
        assignedTo: 'Chief Engineer Scott',
        dueDate: getDateInDays(42),
        status: 'pending',
        priority: 'high',
        estimatedHours: 24
      }
    ];
  };

  const generateCoreDevelopmentTasks = (opportunity: BusinessOpportunity): ExecutionTask[] => {
    return [
      {
        id: 'task-4',
        title: 'Core System Development',
        description: 'Build core system functionality',
        assignedTo: 'Commander Data',
        dueDate: getDateInDays(98),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 160
      },
      {
        id: 'task-5',
        title: 'Backend Infrastructure',
        description: 'Develop backend services and APIs',
        assignedTo: 'Chief Engineer Scott',
        dueDate: getDateInDays(112),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 120
      }
    ];
  };

  const generateIntegrationTasks = (opportunity: BusinessOpportunity): ExecutionTask[] => {
    return [
      {
        id: 'task-6',
        title: 'System Integration',
        description: 'Integrate all system components',
        assignedTo: 'Commander Data',
        dueDate: getDateInDays(140),
        status: 'pending',
        priority: 'critical',
        estimatedHours: 48
      },
      {
        id: 'task-7',
        title: 'Comprehensive Testing',
        description: 'Execute full system testing',
        assignedTo: 'Chief Engineer Scott',
        dueDate: getDateInDays(154),
        status: 'pending',
        priority: 'high',
        estimatedHours: 64
      }
    ];
  };

  const getDateInDays = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const launchBusiness = async (opportunity: BusinessOpportunity) => {
    setIsExecuting(true);
    setSelectedOpportunity(opportunity);
    
    // Simulate business launch process
    for (let i = 0; i < executionPhases.length; i++) {
      const phase = executionPhases[i];
      setCurrentPhase(phase.name);
      
      // Update phase status
      setExecutionPhases(prev => prev.map(p => 
        p.id === phase.id ? { ...p, status: 'active' as const } : p
      ));
      
      // Simulate phase execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete phase
      setExecutionPhases(prev => prev.map(p => 
        p.id === phase.id ? { ...p, status: 'completed' as const, progress: 100 } : p
      ));
      
      // Update opportunity progress
      const progress = ((i + 1) / executionPhases.length) * 100;
      setSelectedOpportunity(prev => prev ? { ...prev, progress } : null);
    }
    
    // Mark business as launched
    setSelectedOpportunity(prev => prev ? { ...prev, status: 'launched' } : null);
    setIsExecuting(false);
    
    onBusinessLaunched?.(opportunity);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'active': return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'launched': return <RocketLaunchIcon className="w-5 h-5 text-purple-500" />;
      case 'profitable': return <CurrencyDollarIcon className="w-5 h-5 text-green-600" />;
      default: return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'var(--lcars-red)';
      case 'high': return 'var(--lcars-orange)';
      case 'medium': return 'var(--lcars-blue)';
      case 'low': return 'var(--lcars-green)';
      default: return 'var(--lcars-text-purple)';
    }
  };

  const calculateTotalProjectedRevenue = (opportunity: BusinessOpportunity) => {
    return opportunity.revenueProjections.reduce((sum, proj) => sum + proj.projectedRevenue, 0);
  };

  const calculateTotalProjectedProfit = (opportunity: BusinessOpportunity) => {
    return opportunity.revenueProjections.reduce((sum, proj) => sum + proj.profit, 0);
  };

  return (
    <div className="lcars-panel">
      <h2>🚀 AUTOMATED BUSINESS EXECUTOR</h2>
      
      {/* Business Opportunities Selection */}
      <div className="lcars-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#000', marginBottom: '15px' }}>Select Business Opportunity to Launch</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' }}>
          {businessOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="lcars-card" style={{ padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h4 style={{ color: '#000', margin: 0, flex: 1 }}>{opportunity.title}</h4>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  backgroundColor: opportunity.complexity === 'low' ? 'var(--lcars-green)' :
                                 opportunity.complexity === 'medium' ? 'var(--lcars-orange)' : 'var(--lcars-red)',
                  color: '#000'
                }}>
                  {opportunity.complexity.toUpperCase()}
                </span>
              </div>
              
              <p style={{ color: 'var(--lcars-text)', fontSize: '0.9rem', marginBottom: '10px' }}>
                {opportunity.description}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '15px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lcars-green)' }}>
                    {opportunity.estimatedROI}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-purple)' }}>ROI</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lcars-blue)' }}>
                    {opportunity.timeline}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-purple)' }}>Timeline</div>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: 'var(--lcars-text-purple)', fontSize: '0.9rem' }}>Crew Members:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                  {opportunity.crewMembers.map((member, index) => (
                    <span key={index} className="lcars-status info" style={{ fontSize: '0.8rem' }}>
                      {member}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: 'var(--lcars-text-purple)', fontSize: '0.9rem' }}>Revenue Projections:</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text)' }}>
                  Total: ${calculateTotalProjectedRevenue(opportunity).toLocaleString()} | 
                  Profit: ${calculateTotalProjectedProfit(opportunity).toLocaleString()}
                </div>
              </div>
              
              <button
                onClick={() => launchBusiness(opportunity)}
                disabled={isExecuting}
                className="lcars-button success"
                style={{ 
                  width: '100%',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <RocketLaunchIcon className="w-4 h-4" />
                {isExecuting ? 'Launching...' : 'Launch Business'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Progress */}
      {selectedOpportunity && (
        <div className="lcars-card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#000', marginBottom: '15px' }}>
            🚀 {selectedOpportunity.title} - Execution Progress
          </h3>
          
          {/* Overall Progress */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: 'var(--lcars-text-purple)' }}>Overall Progress</span>
              <span style={{ color: 'var(--lcars-text)' }}>{Math.round(selectedOpportunity.progress)}%</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              backgroundColor: 'var(--lcars-bg-light)', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${selectedOpportunity.progress}%`, 
                height: '100%', 
                backgroundColor: 'var(--lcars-green)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          
          {/* Execution Phases */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {executionPhases.map((phase) => (
              <div key={phase.id} className="lcars-card" style={{ padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ color: '#000', margin: 0 }}>{phase.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getStatusIcon(phase.status)}
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <p style={{ color: 'var(--lcars-text)', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {phase.description} - Duration: {phase.duration}
                </p>
                
                {/* Phase Progress */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--lcars-text-purple)' }}>Phase Progress</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--lcars-text)' }}>{phase.progress}%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '12px', 
                    backgroundColor: 'var(--lcars-bg-light)', 
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${phase.progress}%`, 
                      height: '100%', 
                      backgroundColor: 'var(--lcars-blue)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                
                {/* Phase Tasks */}
                <div>
                  <strong style={{ color: 'var(--lcars-text-purple)', fontSize: '0.9rem' }}>Tasks:</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    {phase.tasks.map((task) => (
                      <div key={task.id} style={{ 
                        padding: '8px', 
                        backgroundColor: 'var(--lcars-bg-light)', 
                        borderRadius: '4px',
                        border: '2px solid',
                        borderColor: task.status === 'completed' ? 'var(--lcars-green)' : 
                                   task.status === 'in-progress' ? 'var(--lcars-blue)' : 'var(--lcars-orange)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--lcars-text)' }}>
                            {task.title}
                          </span>
                          <span style={{ 
                            padding: '2px 6px', 
                            borderRadius: '8px', 
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            backgroundColor: getPriorityColor(task.priority),
                            color: '#000'
                          }}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <p style={{ fontSize: '0.8rem', color: 'var(--lcars-text-purple)', margin: '0 0 5px 0' }}>
                          {task.description}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--lcars-text)' }}>
                            👤 {task.assignedTo}
                          </span>
                          <span style={{ color: 'var(--lcars-text)' }}>
                            📅 {task.dueDate}
                          </span>
                          <span style={{ color: 'var(--lcars-text)' }}>
                            ⏱️ {task.estimatedHours}h
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Metrics Dashboard */}
      {selectedOpportunity && (
        <div className="lcars-card">
          <h3 style={{ color: '#000', marginBottom: '15px' }}>📊 Business Metrics Dashboard</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'var(--lcars-bg-light)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lcars-green)' }}>
                ${calculateTotalProjectedRevenue(selectedOpportunity).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>Total Projected Revenue</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'var(--lcars-bg-light)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lcars-blue)' }}>
                ${calculateTotalProjectedProfit(selectedOpportunity).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>Total Projected Profit</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'var(--lcars-bg-light)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lcars-orange)' }}>
                {selectedOpportunity.estimatedROI}%
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>Estimated ROI</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'var(--lcars-bg-light)', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lcars-violet)' }}>
                {executionPhases.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>Execution Phases</div>
            </div>
          </div>
          
          {/* Revenue Projections Chart */}
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: '#000', marginBottom: '15px' }}>📈 Monthly Revenue Projections</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
              {selectedOpportunity.revenueProjections.map((proj, index) => (
                <div key={index} style={{ 
                  padding: '12px', 
                  backgroundColor: 'var(--lcars-bg-light)', 
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--lcars-text)' }}>
                    Month {proj.month}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--lcars-green)', marginBottom: '5px' }}>
                    ${proj.projectedRevenue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-purple)' }}>
                    Profit: ${proj.profit.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-purple)' }}>
                    Margin: {proj.profitMargin}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
