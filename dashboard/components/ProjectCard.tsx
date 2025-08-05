'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  Code, 
  Target, 
  TrendingUp, 
  Rocket,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Project {
  id: string
  name: string
  description: string
  project_type: string
  status: string
  tech_stack: string[]
  team_members: string[]
  created_at: string
  updated_at: string
  subdomain: string
}

interface ProjectCardProps {
  project: Project
}

const subdomainConfig = {
  agile: {
    icon: Target,
    color: 'bg-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  software: {
    icon: Code,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  business: {
    icon: TrendingUp,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  startup: {
    icon: Rocket,
    color: 'bg-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
}

export function ProjectCard({ project }: ProjectCardProps) {
  const config = subdomainConfig[project.subdomain as keyof typeof subdomainConfig] || subdomainConfig.agile
  const Icon = config.icon

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in_progress':
        return 'text-green-400'
      case 'completed':
      case 'done':
        return 'text-blue-400'
      case 'paused':
      case 'on_hold':
        return 'text-yellow-400'
      case 'cancelled':
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const handleViewDetails = () => {
    // Navigate to the specific subdomain with the project
    window.open(`https://${project.subdomain}.pbradygeorgen.com/projects/${project.id}`, '_blank')
  }

  const handleManageProject = () => {
    // Open the project management interface
    window.open(`https://${project.subdomain}.pbradygeorgen.com/dashboard`, '_blank')
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`
        bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600
        transition-all duration-200 cursor-pointer
        ${config.borderColor}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`
            p-2 rounded-lg
            ${config.color}
          `}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">
              {project.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)} bg-gray-700`}>
                {project.status}
              </span>
              <span className="text-xs text-gray-400 capitalize">
                {project.subdomain}
              </span>
            </div>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Tech Stack */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-400 mb-2">Tech Stack</h4>
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Team Members */}
      {project.team_members && project.team_members.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-400">
              Team ({project.team_members.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.team_members.slice(0, 3).map((member, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300"
              >
                {member}
              </span>
            ))}
            {project.team_members.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                +{project.team_members.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleViewDetails}
            className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={handleManageProject}
            className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Manage
          </button>
        </div>
      </div>
    </motion.div>
  )
} 