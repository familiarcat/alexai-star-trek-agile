'use client'

import { motion } from 'framer-motion'
import { LucideIcon, CheckCircle, XCircle } from 'lucide-react'

interface Subdomain {
  id: string
  name: string
  icon: LucideIcon
  color: string
  description: string
}

interface SubdomainSelectorProps {
  subdomains: Subdomain[]
  selectedSubdomain: string
  onSelectSubdomain: (subdomain: string) => void
}

export function SubdomainSelector({
  subdomains,
  selectedSubdomain,
  onSelectSubdomain,
}: SubdomainSelectorProps) {
  // Mock subdomain status for demonstration
  const subdomainStatus = {
    agile: true,
    software: true,
    business: true,
    startup: true,
    n8n: true,
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Select Domain
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subdomains.map((subdomain) => {
          const Icon = subdomain.icon
          const isSelected = selectedSubdomain === subdomain.id
          const isOnline = subdomainStatus[subdomain.id as keyof typeof subdomainStatus] || subdomain.id === 'all'
          
          return (
            <motion.div
              key={subdomain.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }
                ${!isOnline && subdomain.id !== 'all' ? 'opacity-50' : ''}
              `}
              onClick={() => onSelectSubdomain(subdomain.id)}
            >
              {/* Status Indicator */}
              {subdomain.id !== 'all' && (
                <div className="absolute top-2 right-2">
                  {isOnline ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
              
              {/* Icon */}
              <div className="flex items-center mb-3">
                <div className={`
                  p-2 rounded-lg mr-3
                  ${subdomain.color}
                `}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">
                    {subdomain.name}
                  </h4>
                  {subdomain.id !== 'all' && (
                    <span className={`text-xs ${
                      isOnline ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-300">
                {subdomain.description}
              </p>
              
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
      
      {/* Status Summary */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Service Status:</span>
          <div className="flex items-center space-x-4">
            {Object.entries(subdomainStatus).map(([subdomain, status]) => (
              <div key={subdomain} className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  status ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-gray-300 capitalize">{subdomain}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 