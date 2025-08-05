'use client'

import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'bg-blue-500',
    text: 'text-blue-400',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'bg-green-500',
    text: 'text-green-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: 'bg-purple-500',
    text: 'text-purple-400',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: 'bg-orange-500',
    text: 'text-orange-400',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'bg-red-500',
    text: 'text-red-400',
  },
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeType = 'neutral',
}: StatsCardProps) {
  const config = colorConfig[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`
        bg-gray-800 rounded-lg p-6 border border-gray-700
        transition-all duration-200 cursor-pointer
        ${config.border}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`
          p-3 rounded-lg
          ${config.icon}
        `}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        {change && (
          <div className={`
            flex items-center space-x-1 text-sm font-medium
            ${changeType === 'positive' ? 'text-green-400' : 
              changeType === 'negative' ? 'text-red-400' : 'text-gray-400'}
          `}>
            {changeType === 'positive' ? (
              <TrendingUp className="h-4 w-4" />
            ) : changeType === 'negative' ? (
              <TrendingDown className="h-4 w-4" />
            ) : null}
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">
          {title}
        </h3>
        <p className="text-2xl font-bold text-white">
          {value}
        </p>
      </div>
      
      {/* Animated background */}
      <motion.div
        className={`
          absolute inset-0 rounded-lg opacity-0
          ${config.bg}
        `}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
} 