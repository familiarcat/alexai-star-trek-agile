'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  MessageSquare, 
  Activity, 
  Wifi, 
  WifiOff,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  role: string
  status: 'online' | 'offline' | 'busy' | 'error'
  lastActivity: string
  currentTask?: string
  performance: number
  communicationLog: Array<{
    id: string
    timestamp: string
    message: string
    type: 'info' | 'warning' | 'error' | 'success'
  }>
}

const mockAgents: Agent[] = [
  {
    id: 'picard',
    name: 'Captain Jean-Luc Picard',
    role: 'Strategic Commander',
    status: 'online',
    lastActivity: '2 minutes ago',
    currentTask: 'Reviewing enterprise architecture decisions',
    performance: 95,
    communicationLog: [
      {
        id: '1',
        timestamp: '2 min ago',
        message: 'Approved deployment strategy for AWS infrastructure',
        type: 'success'
      },
      {
        id: '2',
        timestamp: '5 min ago',
        message: 'Analyzing cost optimization recommendations',
        type: 'info'
      }
    ]
  },
  {
    id: 'troi',
    name: 'Counselor Deanna Troi',
    role: 'User Experience Advisor',
    status: 'online',
    lastActivity: '1 minute ago',
    currentTask: 'Evaluating dashboard user feedback',
    performance: 88,
    communicationLog: [
      {
        id: '3',
        timestamp: '1 min ago',
        message: 'Identified UI/UX improvement opportunities',
        type: 'info'
      },
      {
        id: '4',
        timestamp: '3 min ago',
        message: 'Analyzing user interaction patterns',
        type: 'info'
      }
    ]
  },
  {
    id: 'data',
    name: 'Commander Data',
    role: 'Technical Operations',
    status: 'busy',
    lastActivity: '30 seconds ago',
    currentTask: 'Optimizing database queries',
    performance: 99,
    communicationLog: [
      {
        id: '5',
        timestamp: '30 sec ago',
        message: 'Database optimization in progress',
        type: 'info'
      },
      {
        id: '6',
        timestamp: '2 min ago',
        message: 'Performance metrics analysis complete',
        type: 'success'
      }
    ]
  },
  {
    id: 'laforge',
    name: 'Lieutenant Commander Geordi La Forge',
    role: 'Infrastructure Engineer',
    status: 'online',
    lastActivity: '45 seconds ago',
    currentTask: 'Monitoring AWS deployment',
    performance: 92,
    communicationLog: [
      {
        id: '7',
        timestamp: '45 sec ago',
        message: 'AWS infrastructure deployment successful',
        type: 'success'
      },
      {
        id: '8',
        timestamp: '1 min ago',
        message: 'Cost optimization analysis complete',
        type: 'success'
      }
    ]
  },
  {
    id: 'scott',
    name: 'Lieutenant Commander Montgomery Scott',
    role: 'Systems Integration',
    status: 'error',
    lastActivity: '5 minutes ago',
    currentTask: 'Troubleshooting deployment issues',
    performance: 75,
    communicationLog: [
      {
        id: '9',
        timestamp: '5 min ago',
        message: 'Deployment pipeline error detected',
        type: 'error'
      },
      {
        id: '10',
        timestamp: '6 min ago',
        message: 'Attempting to resolve CI/CD issues',
        type: 'warning'
      }
    ]
  }
]

const getStatusColor = (status: Agent['status']) => {
  switch (status) {
    case 'online': return 'text-green-400'
    case 'busy': return 'text-yellow-400'
    case 'error': return 'text-red-400'
    case 'offline': return 'text-gray-400'
    default: return 'text-gray-400'
  }
}

const getStatusIcon = (status: Agent['status']) => {
  switch (status) {
    case 'online': return <Wifi className="h-4 w-4" />
    case 'busy': return <Activity className="h-4 w-4" />
    case 'error': return <XCircle className="h-4 w-4" />
    case 'offline': return <WifiOff className="h-4 w-4" />
    default: return <WifiOff className="h-4 w-4" />
  }
}

const getLogIcon = (type: string) => {
  switch (type) {
    case 'success': return <CheckCircle className="h-3 w-3 text-green-400" />
    case 'warning': return <AlertCircle className="h-3 w-3 text-yellow-400" />
    case 'error': return <XCircle className="h-3 w-3 text-red-400" />
    default: return <MessageSquare className="h-3 w-3 text-blue-400" />
  }
}

export function AgentStatus() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        lastActivity: `${Math.floor(Math.random() * 5) + 1} minutes ago`,
        performance: Math.max(70, Math.min(100, agent.performance + (Math.random() - 0.5) * 5))
      })))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const selectedAgentData = agents.find(agent => agent.id === selectedAgent)

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-400" />
          Multi-Agent Status
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${selectedAgent === agent.id 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }
            `}
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`
                  p-2 rounded-lg mr-3
                  ${getStatusColor(agent.status)}
                `}>
                  {getStatusIcon(agent.status)}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-gray-400">{agent.role}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{agent.lastActivity}</div>
                <div className="text-sm font-semibold text-green-400">
                  {agent.performance}%
                </div>
              </div>
            </div>

            {agent.currentTask && (
              <div className="text-xs text-gray-300 mb-2">
                <span className="text-gray-400">Current:</span> {agent.currentTask}
              </div>
            )}

            <div className="w-full bg-gray-600 rounded-full h-1">
              <div 
                className="bg-green-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${agent.performance}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAgent && selectedAgentData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-700 pt-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">
                {selectedAgentData.name} - Communication Log
              </h4>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedAgentData.communicationLog.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg"
                >
                  {getLogIcon(log.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white">{log.message}</p>
                      <span className="text-xs text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 