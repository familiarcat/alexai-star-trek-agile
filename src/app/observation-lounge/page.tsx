'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  EyeIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

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

export default function ObservationLoungePage() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  useEffect(() => {
    fetchAIAgents();
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
        }
      ];
      
      setAgents(mockAgents);
    } catch (err) {
      setError('Failed to load AI agents');
      console.error('AI agents fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startConsultation = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setConsultations([]);
    setUserMessage('');
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || !selectedAgent) return;

    const userConsultation: Consultation = {
      id: Date.now().toString(),
      agent_id: selectedAgent.id,
      agent_name: selectedAgent.name,
      message: userMessage,
      timestamp: new Date().toISOString(),
      type: 'user'
    };

    setConsultations(prev => [...prev, userConsultation]);
    setUserMessage('');
    setIsConsulting(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Consultation = {
        id: (Date.now() + 1).toString(),
        agent_id: selectedAgent.id,
        agent_name: selectedAgent.name,
        message: `Thank you for your inquiry. As ${selectedAgent.role}, I would recommend analyzing this situation from a ${selectedAgent.specialties[0].toLowerCase()} perspective. Would you like me to elaborate on any specific aspect?`,
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
              <h1 className="text-3xl font-bold text-gray-900">Observation Lounge</h1>
              <p className="text-gray-600 mt-1">
                AI consultation interface with Star Trek characters
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Agents Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Available AI Agents</h2>
                <p className="text-sm text-gray-500 mt-1">Select an agent for consultation</p>
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
                    onClick={() => startConsultation(agent)}
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
                          <span className="text-lg">{getStatusIcon(agent.status)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{agent.role}</p>
                        <div className="flex items-center mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                            {agent.status}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {agent.consultation_count} consultations
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consultation Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg h-[600px] flex flex-col">
              {selectedAgent ? (
                <>
                  {/* Agent Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {selectedAgent.name}
                          </h3>
                          <p className="text-sm text-gray-500">{selectedAgent.role}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAgent.status)}`}>
                        {selectedAgent.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{selectedAgent.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedAgent.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                  </div>

                  {/* Message Input */}
                  <div className="px-6 py-4 border-t border-gray-200">
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
              ) : (
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
      </main>
    </div>
  );
} 