'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  CogIcon, 
  BrainIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface AISystem {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  version: string;
  uptime: number;
  performance: number;
  memory_usage: number;
  cpu_usage: number;
  active_consultations: number;
  total_consultations: number;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'busy';
  consultation_count: number;
  response_time: number;
  accuracy: number;
  specialties: string[];
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  agent?: string;
}

export default function AlexAICorePage() {
  const [aiSystem, setAiSystem] = useState<AISystem | null>(null);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAISystemData();
  }, []);

  const fetchAISystemData = async () => {
    try {
      setLoading(true);
      
      // Mock AI system data
      const mockSystem: AISystem = {
        id: 'alexai-core-1',
        name: 'AlexAI Core System',
        status: 'online',
        version: '2.1.0',
        uptime: 99.8,
        performance: 94.2,
        memory_usage: 67.3,
        cpu_usage: 42.1,
        active_consultations: 8,
        total_consultations: 1247
      };

      const mockAgents: AIAgent[] = [
        {
          id: 'picard',
          name: 'Captain Jean-Luc Picard',
          role: 'Strategic Leadership',
          status: 'active',
          consultation_count: 127,
          response_time: 1.2,
          accuracy: 98.5,
          specialties: ['Leadership', 'Strategy', 'Diplomacy']
        },
        {
          id: 'data',
          name: 'Lieutenant Commander Data',
          role: 'Analytical Intelligence',
          status: 'active',
          consultation_count: 89,
          response_time: 0.8,
          accuracy: 99.2,
          specialties: ['Analysis', 'Logic', 'Optimization']
        },
        {
          id: 'troi',
          name: 'Counselor Deanna Troi',
          role: 'Empathic Advisor',
          status: 'busy',
          consultation_count: 156,
          response_time: 1.5,
          accuracy: 97.8,
          specialties: ['Psychology', 'Team Dynamics']
        },
        {
          id: 'spock',
          name: 'Commander Spock',
          role: 'Logical Strategist',
          status: 'active',
          consultation_count: 203,
          response_time: 1.0,
          accuracy: 99.1,
          specialties: ['Logic', 'Risk Assessment']
        },
        {
          id: 'scott',
          name: 'Chief Engineer Montgomery Scott',
          role: 'Technical Solutions',
          status: 'idle',
          consultation_count: 94,
          response_time: 1.8,
          accuracy: 96.3,
          specialties: ['Engineering', 'Technical Solutions']
        }
      ];

      const mockLogs: SystemLog[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          level: 'info',
          message: 'System performance optimization completed',
          agent: 'Data'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          level: 'info',
          message: 'New consultation session started',
          agent: 'Picard'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          level: 'warning',
          message: 'High memory usage detected',
          agent: 'System'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          level: 'info',
          message: 'Agent Troi completed consultation',
          agent: 'Troi'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          level: 'info',
          message: 'System backup completed successfully',
          agent: 'System'
        }
      ];

      setAiSystem(mockSystem);
      setAgents(mockAgents);
      setSystemLogs(mockLogs);
    } catch (err) {
      setError('Failed to load AI system data');
      console.error('AI system fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'idle': return 'text-blue-600 bg-blue-100';
      case 'offline':
      case 'maintenance': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing AlexAI Core...</p>
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
            onClick={fetchAISystemData}
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
              <h1 className="text-3xl font-bold text-gray-900">AlexAI Core System</h1>
              <p className="text-gray-600 mt-1">
                Advanced AI management and monitoring interface
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/observation-lounge"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Start Consultation
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Overview */}
        {aiSystem && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">System Overview</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{aiSystem.uptime}%</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getPerformanceColor(aiSystem.performance)}`}>
                    {aiSystem.performance}%
                  </div>
                  <div className="text-sm text-gray-500">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{aiSystem.active_consultations}</div>
                  <div className="text-sm text-gray-500">Active Consultations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{aiSystem.total_consultations}</div>
                  <div className="text-sm text-gray-500">Total Consultations</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Memory Usage</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${aiSystem.memory_usage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{aiSystem.memory_usage}%</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">CPU Usage</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${aiSystem.cpu_usage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{aiSystem.cpu_usage}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Agents */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">AI Agents Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{agent.name}</h3>
                          <p className="text-xs text-gray-500">{agent.role}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{agent.consultation_count}</div>
                        <div className="text-xs text-gray-500">Consultations</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{agent.response_time}s</div>
                        <div className="text-xs text-gray-500">Avg Response</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{agent.accuracy}%</div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {agent.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">System Logs</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      log.level === 'error' ? 'bg-red-500' :
                      log.level === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${getLogLevelColor(log.level)}`}>
                        {log.message}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {log.agent && (
                          <span className="text-xs text-gray-400">• {log.agent}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/observation-lounge"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Start AI Consultation
              </Link>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <CogIcon className="h-4 w-4 mr-2" />
                System Settings
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 