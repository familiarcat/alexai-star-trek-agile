'use client'

import { motion } from 'framer-motion'
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  Activity,
  Wifi,
  Shield
} from 'lucide-react'
import { useDashboard } from '@/contexts/DashboardContext'

export function Header() {
  const { subdomainStatus } = useDashboard()

  const onlineServices = Object.values(subdomainStatus).filter(Boolean).length
  const totalServices = Object.keys(subdomainStatus).length

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-300">
                {onlineServices}/{totalServices} Services Online
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300">Enterprise Network</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">Secure Connection</span>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, tasks, or team members..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
          </motion.button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Captain Picard</p>
              <p className="text-xs text-gray-400">Enterprise Command</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </motion.button>
          </div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-6">
          <span>Enterprise Dashboard v1.0</span>
          <span>•</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          <span>•</span>
          <span>UTC: {new Date().toISOString().split('T')[1].split('.')[0]}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Memory: 64%</span>
          <span>•</span>
          <span>CPU: 23%</span>
          <span>•</span>
          <span>Network: 1.2 Gbps</span>
        </div>
      </div>
    </header>
  )
} 