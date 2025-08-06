'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Box, 
  Globe, 
  Network, 
  Zap, 
  RotateCcw,
  Play,
  Pause,
  Settings
} from 'lucide-react'

interface HolographicData {
  id: string
  type: 'project' | 'system' | 'network' | 'analytics'
  name: string
  status: 'active' | 'inactive' | 'warning' | 'error'
  data: any
  position: { x: number; y: number; z: number }
}

const mockHolographicData: HolographicData[] = [
  {
    id: '1',
    type: 'project',
    name: 'Enterprise Dashboard',
    status: 'active',
    data: { progress: 85, tasks: 12, team: 8 },
    position: { x: 0, y: 0, z: 0 }
  },
  {
    id: '2',
    type: 'system',
    name: 'AWS Infrastructure',
    status: 'active',
    data: { instances: 3, cost: 80, uptime: 99.9 },
    position: { x: 100, y: 50, z: 20 }
  },
  {
    id: '3',
    type: 'network',
    name: 'Subdomain Network',
    status: 'warning',
    data: { connections: 6, latency: 45, errors: 2 },
    position: { x: -50, y: 100, z: -30 }
  },
  {
    id: '4',
    type: 'analytics',
    name: 'Performance Metrics',
    status: 'active',
    data: { responseTime: 120, throughput: 95, efficiency: 88 },
    position: { x: 150, y: -30, z: 50 }
  }
]

export function HolographicElements() {
  const [isActive, setIsActive] = useState(true)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [data, setData] = useState<HolographicData[]>(mockHolographicData)

  // Auto-rotation effect
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [isActive])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => ({
        ...item,
        data: {
          ...item.data,
          ...(item.type === 'analytics' && {
            responseTime: Math.max(50, Math.min(200, item.data.responseTime + (Math.random() - 0.5) * 10)),
            throughput: Math.max(80, Math.min(100, item.data.throughput + (Math.random() - 0.5) * 5))
          }),
          ...(item.type === 'system' && {
            cost: Math.max(60, Math.min(100, item.data.cost + (Math.random() - 0.5) * 5))
          })
        }
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <Box className="h-4 w-4" />
      case 'system': return <Globe className="h-4 w-4" />
      case 'network': return <Network className="h-4 w-4" />
      case 'analytics': return <Zap className="h-4 w-4" />
      default: return <Box className="h-4 w-4" />
    }
  }

  const selectedData = data.find(item => item.id === selectedElement)

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Box className="h-5 w-5 mr-2 text-purple-400" />
          Holographic Visualization
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {isActive ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
          </button>
          <button
            onClick={() => setRotation(0)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-white" />
          </button>
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            <Settings className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* 3D Holographic Container */}
      <div className="relative h-96 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden border border-purple-500/30">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Holographic Elements */}
        <div 
          className="relative w-full h-full"
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          {data.map((item) => (
            <motion.div
              key={item.id}
              className="absolute cursor-pointer"
              style={{
                left: `${50 + item.position.x / 4}%`,
                top: `${50 + item.position.y / 4}%`,
                transform: `translateZ(${item.position.z}px)`
              }}
              whileHover={{ scale: 1.2, z: 50 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedElement(selectedElement === item.id ? null : item.id)}
            >
              <motion.div
                className={`
                  p-3 rounded-lg border-2 backdrop-blur-sm
                  ${selectedElement === item.id 
                    ? 'border-purple-400 bg-purple-500/20' 
                    : 'border-gray-500 bg-gray-800/50'
                  }
                `}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(147, 51, 234, 0.3)',
                    '0 0 20px rgba(147, 51, 234, 0.6)',
                    '0 0 10px rgba(147, 51, 234, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center space-x-2">
                  {getTypeIcon(item.type)}
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {data.map((item, index) => {
            const nextItem = data[(index + 1) % data.length]
            const x1 = 50 + item.position.x / 4
            const y1 = 50 + item.position.y / 4
            const x2 = 50 + nextItem.position.x / 4
            const y2 = 50 + nextItem.position.y / 4

            return (
              <motion.line
                key={`line-${index}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="rgba(147, 51, 234, 0.4)"
                strokeWidth="1"
                strokeDasharray="5,5"
                animate={{
                  strokeDashoffset: [0, -10]
                }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )
          })}
        </svg>
      </div>

      {/* Data Panel */}
      <AnimatePresence>
        {selectedElement && selectedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white flex items-center">
                {getTypeIcon(selectedData.type)}
                <span className="ml-2">{selectedData.name}</span>
              </h4>
              <button
                onClick={() => setSelectedElement(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                             {Object.entries(selectedData.data).map(([key, value]) => (
                 <div key={key} className="text-center">
                   <div className="text-2xl font-bold text-purple-400">
                     {typeof value === 'number' && key.includes('Time') ? `${value}ms` :
                      typeof value === 'number' && key.includes('cost') ? `$${value}` :
                      typeof value === 'number' && key.includes('uptime') ? `${value}%` :
                      typeof value === 'number' && key.includes('throughput') ? `${value}%` :
                      typeof value === 'number' && key.includes('efficiency') ? `${value}%` :
                      typeof value === 'number' && key.includes('progress') ? `${value}%` :
                      String(value)}
                   </div>
                   <div className="text-xs text-gray-400 capitalize">
                     {key.replace(/([A-Z])/g, ' $1').trim()}
                   </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div>Rotation: {Math.round(rotation)}°</div>
        <div>Elements: {data.length}</div>
        <div>Status: {isActive ? 'Active' : 'Paused'}</div>
      </div>
    </div>
  )
} 