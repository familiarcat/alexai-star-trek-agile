'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  EyeIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

import QuarkHierarchicalDashboard from '@/components/market-intelligence/quark-hierarchical-dashboard';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'available' | 'busy' | 'offline';
  avatar: string;
  specialties: string[];
  consultation_count: number;
}

interface Consultation {
  id: string;
  agent_id: string;
  agent_name: string;
  message: string;
  timestamp: string;
  type: 'user' | 'ai';
}

interface MarketData {
  currentPosition: string;
  targetPosition: string;
  marketShare: number;
  targetShare: number;
  innovationRate: string;
  targetRate: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  marketTarget: string;
  innovationFocus: string;
  crewInvolvement: string[];
  progress: number;
}

export default function ObservationLoungePage() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'consultation' | 'market-intelligence' | 'project-orchestration' | 'profit-ethics' | 'hierarchical-dashboard'>('consultation');

  useEffect(() => {
    fetchAIAgents();
    fetchMarketData();
    fetchProjects();
  }, []);

  const fetchAIAgents = async () => {
    try {
      setLoading(true);
      // Mock AI agents data - in real implementation, this would come from API
      const mockAgents: AIAgent[] = [
        {
          id: 'picard',
          name: 'Captain Jean-Luc Picard',
          role: 'Strategic Leadership',
          description: 'Expert in diplomatic strategy, ethical decision-making, and team leadership. Specializes in complex project management and stakeholder relations.',
          status: 'available',
          avatar: '/api/placeholder/150/150',
          specialties: ['Leadership', 'Strategy', 'Diplomacy', 'Ethics'],
          consultation_count: 127
        },
        {
          id: 'data',
          name: 'Lieutenant Commander Data',
          role: 'Analytical Intelligence',
          description: 'Master of logical analysis, data processing, and systematic problem-solving. Perfect for technical challenges and optimization.',
          status: 'available',
          avatar: '/api/placeholder/150/150',
          specialties: ['Analysis', 'Logic', 'Optimization', 'Technical'],
          consultation_count: 89
        },
        {
          id: 'troi',
          name: 'Counselor Deanna Troi',
          role: 'Empathic Advisor',
          description: 'Specialist in team dynamics, emotional intelligence, and conflict resolution. Ideal for people management and organizational health.',
          status: 'busy',
          avatar: '/api/placeholder/150/150',
          specialties: ['Psychology', 'Team Dynamics', 'Conflict Resolution'],
          consultation_count: 156
        },
        {
          id: 'spock',
          name: 'Commander Spock',
          role: 'Logical Strategist',
          description: 'Vulcan logic expert specializing in risk assessment, efficiency analysis, and scientific methodology.',
          status: 'available',
          avatar: '/api/placeholder/150/150',
          specialties: ['Logic', 'Risk Assessment', 'Efficiency', 'Science'],
          consultation_count: 203
        },
        {
          id: 'scott',
          name: 'Chief Engineer Montgomery Scott',
          role: 'Technical Solutions',
          description: 'Engineering genius focused on practical solutions, resource optimization, and technical problem-solving.',
          status: 'offline',
          avatar: '/api/placeholder/150/150',
          specialties: ['Engineering', 'Technical Solutions', 'Resource Management'],
          consultation_count: 94
        },
        {
          id: 'worf',
          name: 'Lieutenant Worf',
          role: 'Security & Risk Assessment',
          description: 'Klingon warrior specializing in security protocols, risk management, and strategic defense planning.',
          status: 'available',
          avatar: '/api/placeholder/150/150',
          specialties: ['Security', 'Risk Management', 'Defense', 'Strategy'],
          consultation_count: 78
        },
        {
          id: 'crusher',
          name: 'Chief Medical Officer Beverly Crusher',
          role: 'System Health & Performance',
          description: 'Medical expert focused on system diagnostics, performance optimization, and preventive maintenance.',
          status: 'available',
          avatar: '/api/placeholder/150/150',
          specialties: ['Diagnostics', 'Performance', 'Maintenance', 'Health'],
          consultation_count: 112
        },
        {
          id: 'ships-computer',
          name: 'Ship\'s Computer',
          role: 'Central Coordination',
          description: 'Master coordinator and knowledge aggregator. Orchestrates all crew activities and synthesizes strategic insights.',
          status: 'available',
          avatar: '/api/placeholder/150/150',
          specialties: ['Coordination', 'Knowledge Synthesis', 'Strategic Planning', 'Orchestration'],
          consultation_count: 342
        },
        {
          id: 'quark',
          name: 'Quark (Deep Space 9)',
          role: 'Profit Optimization & Business Strategy',
          description: 'Ferengi entrepreneur with a heart of gold. Expert in profit maximization, market opportunities, and business ethics. Always seeks the best deal while maintaining moral integrity.',
          status: 'available',
          avatar: '/api/placeholder/150/150',
          specialties: ['Profit Optimization', 'Market Opportunities', 'Business Ethics', 'Deal Making', 'Risk Assessment'],
          consultation_count: 189
        }
      ];
      setAgents(mockAgents);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch AI agents');
      setLoading(false);
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market-intelligence/analysis');
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/project-orchestration/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  // New function for comprehensive crew consultation
  const conductCrewConsultation = async () => {
    setIsConsulting(true);
    
    // Simulate consultation with each crew member
    const crewInsights = [
      {
        agent: 'Captain Jean-Luc Picard',
        role: 'Strategic Leadership',
        insight: 'Make it so! Functionality first, elegance second. A working system that serves its purpose is better than a beautiful system that doesn\'t work. Focus on core features that drive your $10,000 revenue goal. The UI can be refined once we see what elements are actually needed.',
        priority: 'CRITICAL',
        recommendation: 'Complete the weekly execution plan system and revenue tracking before any UI polish.'
      },
      {
        agent: 'Lieutenant Commander Data',
        role: 'Analytical Intelligence',
        insight: 'Analysis complete. Current system has 100% test success rate but UI inconsistencies exist. However, functional completeness is 87% while UI polish is 65%. Mathematical conclusion: prioritize functionality to achieve 95%+ functional completeness before addressing UI elements.',
        priority: 'HIGH',
        recommendation: 'Implement missing business logic, database integration, and automated workflows.'
      },
      {
        agent: 'Counselor Deanna Troi',
        role: 'Empathic Advisor',
        insight: 'I sense your concern about UI quality, but I also feel the excitement about what this system can achieve. The crew needs to see the full potential before refining the presentation. Build the foundation first - the confidence will come from having a complete, working system.',
        priority: 'MEDIUM',
        recommendation: 'Focus on user experience through functionality, not just visual appeal.'
      },
      {
        agent: 'Commander Spock',
        role: 'Logical Strategist',
        insight: 'Illogical to prioritize aesthetics over function. The current approach follows the principle of progressive enhancement. Complete the core functionality, identify reusable UI patterns, then systematically apply consistent design. This is the most efficient path.',
        priority: 'HIGH',
        recommendation: 'Document UI patterns as you build functionality for systematic refinement later.'
      },
      {
        agent: 'Chief Engineer Montgomery Scott',
        role: 'Technical Solutions',
        insight: 'Aye, Captain! I\'ve seen many systems fail because they looked good but couldn\'t do the job. Build it solid first, make it pretty second. Besides, once you see how the pieces fit together, you\'ll know exactly which UI elements to keep and which to redesign.',
        priority: 'HIGH',
        recommendation: 'Focus on technical architecture and integration points. UI can be modularized later.'
      },
      {
        agent: 'Lieutenant Worf',
        role: 'Security & Risk Assessment',
        insight: 'Security through functionality! A system that works is more secure than one that looks secure. Complete the core features, establish proper data flow, then enhance the interface. This reduces attack surface during development.',
        priority: 'MEDIUM',
        recommendation: 'Implement security features as part of core functionality, not as UI add-ons.'
      },
      {
        agent: 'Chief Medical Officer Beverly Crusher',
        role: 'System Health & Performance',
        insight: 'The system is healthy at 100% test success, but incomplete functionality is like treating symptoms instead of the disease. Complete the core features first, then optimize performance and refine the interface. This ensures long-term system health.',
        priority: 'MEDIUM',
        recommendation: 'Monitor system performance as you add functionality, optimize bottlenecks early.'
      },
      {
        agent: 'Ship\'s Computer',
        role: 'Central Coordination',
        insight: 'Analysis complete. Current system demonstrates excellent test coverage but incomplete feature implementation. Recommendation: prioritize feature completion over UI refinement. Once all features are implemented, UI patterns will emerge naturally, allowing for systematic design improvements.',
        priority: 'CRITICAL',
        recommendation: 'Implement remaining core features, then conduct UI pattern analysis for systematic refinement.'
      },
      {
        agent: 'Quark (Deep Space 9)',
        role: 'Profit Optimization & Business Strategy',
        insight: 'Listen, my friend, profit comes from delivering value, not from looking pretty! Get your weekly execution plan working, get that revenue tracking solid, get your business processes automated. Once you\'re making money, then you can afford to make it beautiful. Besides, customers care more about what it does than how it looks.',
        priority: 'CRITICAL',
        recommendation: 'Focus on revenue-generating features first. UI can be enhanced once cash flow is established.'
      }
    ];

    // Add crew insights to consultations
    const newConsultations = crewInsights.map((insight, index) => ({
      id: `crew-consultation-${index}`,
      agent_id: insight.agent.toLowerCase().replace(/\s+/g, '-'),
      agent_name: insight.agent,
      message: `${insight.insight}\n\nPriority: ${insight.priority}\nRecommendation: ${insight.recommendation}`,
      timestamp: new Date().toISOString(),
      type: 'ai' as const
    }));

    setConsultations(prev => [...newConsultations, ...prev]);
    setIsConsulting(false);
  };

  const handleConsultation = async (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    setSelectedAgent(agent);
    setActiveTab('consultation');
    
    // Conduct full crew consultation if Ship's Computer is selected
    if (agentId === 'ships-computer') {
      await conductCrewConsultation();
    }
  };

  const startConsultation = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setActiveTab('consultation');
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || !selectedAgent) return;

    const newConsultation: Consultation = {
      id: Date.now().toString(),
      agent_id: selectedAgent.id,
      agent_name: selectedAgent.name,
      message: userMessage,
      timestamp: new Date().toISOString(),
      type: 'user'
    };

    setConsultations(prev => [...prev, newConsultation]);
    setUserMessage('');
    setIsConsulting(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Consultation = {
        id: (Date.now() + 1).toString(),
        agent_id: selectedAgent.id,
        agent_name: selectedAgent.name,
        message: `Thank you for your message. As ${selectedAgent.role}, I'm analyzing your request and will provide strategic guidance shortly.`,
        timestamp: new Date().toISOString(),
        type: 'ai'
      };
      setConsultations(prev => [...prev, aiResponse]);
      setIsConsulting(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return '🟢';
      case 'busy': return '🟡';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing Observation Lounge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <button 
            onClick={fetchAIAgents}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Strategic Command Center</h1>
              <p className="text-gray-600 mt-1">
                AI consultation, market intelligence, and project orchestration
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* AI Agents Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Available AI Agents</h2>
                <p className="text-sm text-gray-500 mt-1">Select an agent for consultation</p>
                
                {/* Special Crew Consultation Button */}
                <div className="mt-4">
                  <button
                    onClick={conductCrewConsultation}
                    disabled={isConsulting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isConsulting ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        <span>Consulting Crew...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-4 w-4" />
                        <span>🎯 FULL CREW STRATEGIC CONSULTATION</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Get insights from all crew members on functionality vs UI priorities
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedAgent?.id === agent.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleConsultation(agent.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {agent.name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                            {getStatusIcon(agent.status)} {agent.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{agent.role}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {agent.specialties.slice(0, 2).map((specialty) => (
                            <span
                              key={specialty}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {specialty}
                            </span>
                          ))}
                          {agent.specialties.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{agent.specialties.length - 2} more
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {agent.consultation_count} consultations
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('consultation')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'consultation'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                    AI Consultation
                  </button>
                  <button
                    onClick={() => setActiveTab('market-intelligence')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'market-intelligence'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <ChartBarIcon className="h-5 w-5 inline mr-2" />
                    Market Intelligence
                  </button>
                  <button
                    onClick={() => setActiveTab('project-orchestration')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'project-orchestration'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <RocketLaunchIcon className="h-5 w-5 inline mr-2" />
                    Project Orchestration
                  </button>
                  <button
                    onClick={() => setActiveTab('profit-ethics')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'profit-ethics'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <LightBulbIcon className="h-5 w-5 inline mr-2" />
                    Profit & Ethics
                  </button>
                  <button
                    onClick={() => setActiveTab('hierarchical-dashboard')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'hierarchical-dashboard'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <ChartBarIcon className="h-5 w-5 inline mr-2" />
                    Hierarchical Dashboard
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* AI Consultation Tab */}
                {activeTab === 'consultation' && selectedAgent && (
                  <>
                    {/* Agent Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="h-8 w-8 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {selectedAgent.name}
                          </h3>
                          <p className="text-sm text-gray-500">{selectedAgent.role}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAgent.status)}`}>
                        {selectedAgent.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">{selectedAgent.description}</p>
                    <div className="flex flex-wrap gap-1 mb-6">
                      {selectedAgent.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-6" style={{ maxHeight: '400px' }}>
                      {consultations.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">
                          <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Start a conversation with {selectedAgent.name}</p>
                          <p className="text-sm">Ask about project management, team dynamics, or strategic planning.</p>
                        </div>
                      ) : (
                        consultations.map((consultation) => (
                          <div
                            key={consultation.id}
                            className={`flex ${consultation.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                consultation.type === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{consultation.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(consultation.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      {isConsulting && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                              <span className="text-sm">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Crew Consensus Summary */}
                      {consultations.length > 0 && consultations.some(c => c.agent_name.includes('Captain') || c.agent_name.includes('Data') || c.agent_name.includes('Quark')) && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                            <SparklesIcon className="h-5 w-5 mr-2" />
                            🖖 CREW STRATEGIC CONSENSUS
                          </h3>
                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded border border-blue-100">
                              <h4 className="font-medium text-blue-800 mb-2">🎯 PRIORITY: FUNCTIONALITY OVER UI</h4>
                              <p className="text-sm text-gray-700">
                                <strong>Consensus:</strong> All crew members agree that completing core functionality should take precedence over UI refinement.
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded border border-green-100">
                              <h4 className="font-medium text-green-800 mb-2">✅ IMMEDIATE ACTIONS</h4>
                              <ul className="text-sm text-gray-700 space-y-1">
                                <li>• Complete weekly execution plan system</li>
                                <li>• Implement revenue tracking and automation</li>
                                <li>• Build missing business logic and workflows</li>
                                <li>• Focus on $10,000 revenue goal features</li>
                              </ul>
                            </div>
                            <div className="bg-white p-3 rounded border border-yellow-100">
                              <h4 className="font-medium text-yellow-800 mb-2">🔄 UI REFINEMENT STRATEGY</h4>
                              <p className="text-sm text-gray-700">
                                <strong>Approach:</strong> Document UI patterns during functionality development, then systematically refine once core features are complete.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          disabled={isConsulting}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!userMessage.trim() || isConsulting}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SparklesIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Market Intelligence Tab */}
                {activeTab === 'market-intelligence' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Market Intelligence Dashboard</h2>
                    {marketData ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold text-blue-900 mb-2">Market Position</h3>
                          <p className="text-3xl font-bold text-blue-600">{marketData.currentPosition}</p>
                          <p className="text-sm text-blue-700 mt-1">Target: {marketData.targetPosition}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold text-green-900 mb-2">Market Share</h3>
                          <p className="text-3xl font-bold text-green-600">{marketData.marketShare}%</p>
                          <p className="text-sm text-green-700 mt-1">Target: {marketData.targetShare}%</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold text-purple-900 mb-2">Innovation Rate</h3>
                          <p className="text-3xl font-bold text-purple-600">{marketData.innovationRate}</p>
                          <p className="text-sm text-purple-700 mt-1">Target: {marketData.targetRate}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Loading market intelligence data...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Project Orchestration Tab */}
                {activeTab === 'project-orchestration' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Project Orchestration</h2>
                    {projects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project) => (
                          <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'active' ? 'bg-green-100 text-green-800' :
                                project.status === 'development' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2"><strong>Market Target:</strong> {project.marketTarget}</p>
                            <p className="text-sm text-gray-600 mb-2"><strong>Innovation Focus:</strong> {project.innovationFocus}</p>
                            <p className="text-sm text-gray-600 mb-4"><strong>Crew:</strong> {project.crewInvolvement.join(', ')}</p>
                            <div className="mb-2">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        <RocketLaunchIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Loading project orchestration data...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Profit & Ethics Tab */}
                {activeTab === 'profit-ethics' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">💎 Profit & Ethics Analysis</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Quark's Profit Analysis */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-2xl">💎</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-yellow-900">Quark's Profit Analysis</h3>
                            <p className="text-sm text-yellow-700">Ferengi Business Strategy</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">Market Domination Opportunities</h4>
                            <ul className="text-sm text-yellow-800 space-y-2">
                              <li>• <strong>Enterprise Scaling:</strong> 30-50% profit increase (6-12 months)</li>
                              <li>• <strong>Global Expansion:</strong> 50-100% profit increase (12-18 months)</li>
                              <li>• <strong>Market Leadership:</strong> Sustainable competitive advantage</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">Ferengi Wisdom</h4>
                            <p className="text-sm text-yellow-800 italic">
                              "Rule of Acquisition #62: The riskier the road, the greater the profit."
                            </p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">Business Recommendations</h4>
                            <ul className="text-sm text-yellow-800 space-y-2">
                              <li>• Focus on low-risk, high-return opportunities first</li>
                              <li>• Implement aggressive scaling strategies</li>
                              <li>• Maximize market share while maintaining quality</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Troi's Ethical Guidance */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-2xl">🧠</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900">Counselor Troi's Ethical Guidance</h3>
                            <p className="text-sm text-blue-700">Empathic Business Ethics</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Ethical Considerations</h4>
                            <ul className="text-sm text-blue-800 space-y-2">
                              <li>• <strong>Customer Welfare:</strong> Profit must not harm user experience</li>
                              <li>• <strong>Market Fairness:</strong> Maintain competitive but fair practices</li>
                              <li>• <strong>Sustainability:</strong> Balance immediate gains with long-term growth</li>
                            </ul>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Emotional Intelligence</h4>
                            <p className="text-sm text-blue-800">
                              "Success without integrity is hollow. Our users trust us to do what's right, not just what's profitable."
                            </p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Ethical Recommendations</h4>
                            <ul className="text-sm text-blue-800 space-y-2">
                              <li>• Implement ethical review processes for all major decisions</li>
                              <li>• Prioritize user experience over pure profit maximization</li>
                              <li>• Build sustainable business models that benefit all stakeholders</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Combined Strategy */}
                    <div className="mt-8 bg-gradient-to-r from-yellow-50 to-blue-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🎯 Combined Strategy: Profit + Ethics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl">💎</span>
                          </div>
                          <h4 className="font-semibold text-yellow-900 mb-2">Quark's Profit Focus</h4>
                          <p className="text-sm text-yellow-800">Aggressive market expansion and profit optimization</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl">⚖️</span>
                          </div>
                          <h4 className="font-semibold text-blue-900 mb-2">Ethical Balance</h4>
                          <p className="text-sm text-blue-800">Counselor Troi ensures all decisions align with our values</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl">🚀</span>
                          </div>
                          <h4 className="font-semibold text-green-900 mb-2">Optimal Outcome</h4>
                          <p className="text-sm text-green-800">Maximum profit with complete ethical compliance</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <p className="text-lg font-medium text-gray-900">
                          "The best deal is one where everyone profits and no one loses their soul." - Quark
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          "And that's exactly what we'll achieve together." - Counselor Troi
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hierarchical Dashboard Tab */}
                {activeTab === 'hierarchical-dashboard' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">🧠 Hierarchical Dashboard</h2>
                    <QuarkHierarchicalDashboard />
                  </div>
                )}

                {/* No Agent Selected */}
                {activeTab === 'consultation' && !selectedAgent && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <EyeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Select an AI agent to begin consultation</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 