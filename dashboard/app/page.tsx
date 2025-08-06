'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Code, 
  TrendingUp, 
  Rocket, 
  Activity,
  Calendar,
  Target,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

// Mock data for demonstration
const mockProjects = [
  {
    id: '1',
    name: 'Enterprise Dashboard',
    description: 'Central dashboard for all enterprise operations',
    project_type: 'software',
    status: 'active',
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind'],
    team_members: ['Captain Picard', 'Commander Data'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    subdomain: 'dashboard'
  },
  {
    id: '2',
    name: 'Agile Management System',
    description: 'Sprint planning and task management platform',
    project_type: 'agile',
    status: 'active',
    tech_stack: ['Flask', 'Python', 'SQLite'],
    team_members: ['Counselor Troi', 'Lieutenant Worf'],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    subdomain: 'agile'
  },
  {
    id: '3',
    name: 'Software Development Hub',
    description: 'Code review and deployment automation',
    project_type: 'software',
    status: 'in_progress',
    tech_stack: ['React', 'Node.js', 'Docker'],
    team_members: ['Lieutenant La Forge', 'Ensign Crusher'],
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    subdomain: 'software'
  }
]

const mockStats = {
  totalProjects: 12,
  activeTasks: 45,
  teamMembers: 8,
  completionRate: 78
}

const subdomains = [
  {
    id: 'all',
    name: 'All Domains',
    icon: BarChart3,
    color: 'bg-blue-500',
    description: 'View all projects across all domains'
  },
  {
    id: 'agile',
    name: 'Agile Management',
    icon: Target,
    color: 'bg-green-500',
    description: 'Sprint planning, task management, team collaboration'
  },
  {
    id: 'software',
    name: 'Software Development',
    icon: Code,
    color: 'bg-purple-500',
    description: 'Code review, deployment automation, testing'
  },
  {
    id: 'business',
    name: 'Business Strategy',
    icon: TrendingUp,
    color: 'bg-orange-500',
    description: 'Strategy planning, market analysis, financial modeling'
  },
  {
    id: 'startup',
    name: 'Startup Innovation',
    icon: Rocket,
    color: 'bg-red-500',
    description: 'Idea validation, pitch deck generation, investor matching'
  }
]

export default function DashboardPage() {
  const [selectedSubdomain, setSelectedSubdomain] = useState('all')
  const [projects, setProjects] = useState(mockProjects)
  const [stats, setStats] = useState(mockStats)
  const [loading, setLoading] = useState(false)

  const filteredProjects = selectedSubdomain === 'all' 
    ? projects 
    : projects.filter(p => p.subdomain === selectedSubdomain)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          AlexAI Enterprise Dashboard
        </h1>
        <p className="text-gray-300 text-lg">
          Central command center for all enterprise projects and workflows
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-sm text-green-400">+12%</div>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Total Projects</h3>
          <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-sm text-green-400">+8%</div>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Active Tasks</h3>
          <p className="text-2xl font-bold text-white">{stats.activeTasks}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-sm text-green-400">+3</div>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Team Members</h3>
          <p className="text-2xl font-bold text-white">{stats.teamMembers}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-500">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="text-sm text-green-400">+5%</div>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Completion Rate</h3>
          <p className="text-2xl font-bold text-white">{stats.completionRate}%</p>
        </div>
      </motion.div>

      {/* Subdomain Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Select Domain</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subdomains.map((subdomain) => {
            const Icon = subdomain.icon
            const isSelected = selectedSubdomain === subdomain.id
            
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
                `}
                onClick={() => setSelectedSubdomain(subdomain.id)}
              >
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
                  </div>
                </div>
                
                <p className="text-sm text-gray-300">
                  {subdomain.description}
                </p>
                
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
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedSubdomain === 'all' ? 'All Projects' : `${subdomains.find(s => s.id === selectedSubdomain)?.name} Projects`}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500">
              {selectedSubdomain === 'all' 
                ? 'No projects are currently active across all domains.'
                : `No projects found in ${subdomains.find(s => s.id === selectedSubdomain)?.name}.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500">
                      <Code className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {project.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 rounded-full text-green-400 bg-gray-700">
                          {project.status}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">
                          {project.subdomain}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {project.team_members.length} members
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                      View Details
                    </button>
                    <button className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
} 