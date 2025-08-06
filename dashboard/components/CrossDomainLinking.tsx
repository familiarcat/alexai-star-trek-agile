'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Link, 
  GitBranch, 
  Share2, 
  ArrowRight,
  Plus,
  Search,
  Filter,
  Network
} from 'lucide-react'

interface Project {
  id: string
  name: string
  domain: 'agile' | 'software' | 'business' | 'startup'
  status: 'active' | 'completed' | 'paused' | 'planning'
  description: string
  relatedProjects: string[]
  dependencies: string[]
  team: string[]
  progress: number
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Enterprise Dashboard',
    domain: 'software',
    status: 'active',
    description: 'Central dashboard for all enterprise operations',
    relatedProjects: ['2', '3'],
    dependencies: ['4'],
    team: ['Picard', 'Data'],
    progress: 85
  },
  {
    id: '2',
    name: 'Agile Workflow System',
    domain: 'agile',
    status: 'active',
    description: 'Sprint planning and task management',
    relatedProjects: ['1', '5'],
    dependencies: [],
    team: ['Troi', 'Worf'],
    progress: 92
  },
  {
    id: '3',
    name: 'Business Strategy Platform',
    domain: 'business',
    status: 'planning',
    description: 'Strategic planning and market analysis',
    relatedProjects: ['1', '6'],
    dependencies: ['2'],
    team: ['Picard', 'Troi'],
    progress: 35
  },
  {
    id: '4',
    name: 'AWS Infrastructure',
    domain: 'software',
    status: 'completed',
    description: 'Cloud infrastructure deployment',
    relatedProjects: ['1'],
    dependencies: [],
    team: ['La Forge', 'Scott'],
    progress: 100
  },
  {
    id: '5',
    name: 'Startup Innovation Hub',
    domain: 'startup',
    status: 'active',
    description: 'Idea validation and pitch generation',
    relatedProjects: ['2', '6'],
    dependencies: ['3'],
    team: ['Troi', 'Data'],
    progress: 78
  },
  {
    id: '6',
    name: 'Market Analysis Engine',
    domain: 'business',
    status: 'paused',
    description: 'Real-time market data analysis',
    relatedProjects: ['3', '5'],
    dependencies: ['1'],
    team: ['Data', 'La Forge'],
    progress: 45
  }
]

const domainColors = {
  agile: 'bg-green-500',
  software: 'bg-blue-500',
  business: 'bg-orange-500',
  startup: 'bg-purple-500'
}

const statusColors = {
  active: 'text-green-400',
  completed: 'text-blue-400',
  paused: 'text-yellow-400',
  planning: 'text-gray-400'
}

export function CrossDomainLinking() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDomain, setFilterDomain] = useState<string>('all')
  const [showRelationships, setShowRelationships] = useState(true)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDomain = filterDomain === 'all' || project.domain === filterDomain
    return matchesSearch && matchesDomain
  })

  const selectedProjectData = projects.find(p => p.id === selectedProject)

  const getRelatedProjects = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return []
    
    const related = [...project.relatedProjects, ...project.dependencies]
    return projects.filter(p => related.includes(p.id))
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Network className="h-5 w-5 mr-2 text-blue-400" />
          Cross-Domain Project Linking
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowRelationships(!showRelationships)}
            className={`p-2 rounded-lg transition-colors ${
              showRelationships ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Link className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            <Plus className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Domains</option>
          <option value="agile">Agile</option>
          <option value="software">Software</option>
          <option value="business">Business</option>
          <option value="startup">Startup</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project List */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Projects ({filteredProjects.length})</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${selectedProject === project.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }
                `}
                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${domainColors[project.domain]}`} />
                    <div>
                      <h5 className="font-semibold text-white">{project.name}</h5>
                      <p className="text-sm text-gray-400 capitalize">{project.domain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${statusColors[project.status]}`}>
                      {project.status}
                    </div>
                    <div className="text-xs text-gray-400">{project.progress}%</div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-3">{project.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Team:</span>
                    {project.team.slice(0, 2).map((member, index) => (
                      <span key={index} className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {member}
                      </span>
                    ))}
                    {project.team.length > 2 && (
                      <span className="text-xs text-gray-400">+{project.team.length - 2}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {project.relatedProjects.length + project.dependencies.length} links
                    </span>
                    <Link className="h-3 w-3 text-gray-400" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-600 rounded-full h-1">
                  <div 
                    className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Relationship Visualization */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Project Relationships</h4>
          
          {selectedProjectData ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h5 className="font-semibold text-white mb-2">{selectedProjectData.name}</h5>
                <p className="text-sm text-gray-300 mb-3">{selectedProjectData.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h6 className="text-sm font-semibold text-gray-400 mb-2">Related Projects</h6>
                    <div className="space-y-2">
                      {getRelatedProjects(selectedProjectData.id).map((related) => (
                        <motion.div
                          key={related.id}
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center space-x-2 p-2 bg-gray-600 rounded"
                        >
                          <div className={`w-2 h-2 rounded-full ${domainColors[related.domain]}`} />
                          <span className="text-sm text-white">{related.name}</span>
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-semibold text-gray-400 mb-2">Dependencies</h6>
                    <div className="space-y-2">
                      {selectedProjectData.dependencies.map((depId) => {
                        const dep = projects.find(p => p.id === depId)
                        if (!dep) return null
                        return (
                          <motion.div
                            key={dep.id}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-2 p-2 bg-gray-600 rounded"
                          >
                            <div className={`w-2 h-2 rounded-full ${domainColors[dep.domain]}`} />
                            <span className="text-sm text-white">{dep.name}</span>
                            <GitBranch className="h-3 w-3 text-gray-400" />
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Visualization */}
              {showRelationships && (
                <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <h6 className="text-sm font-semibold text-gray-400 mb-3">Network Map</h6>
                  <div className="relative h-48 bg-gray-800 rounded border border-gray-600">
                    {/* Simple network visualization */}
                    <svg className="w-full h-full">
                      {getRelatedProjects(selectedProjectData.id).map((related, index) => {
                        const angle = (index * 360) / getRelatedProjects(selectedProjectData.id).length
                        const x = 50 + 30 * Math.cos(angle * Math.PI / 180)
                        const y = 50 + 30 * Math.sin(angle * Math.PI / 180)
                        
                        return (
                          <g key={related.id}>
                            <line
                              x1="50%"
                              y1="50%"
                              x2={`${x}%`}
                              y2={`${y}%`}
                              stroke="rgba(59, 130, 246, 0.5)"
                              strokeWidth="1"
                              strokeDasharray="3,3"
                            />
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="3"
                              fill={domainColors[related.domain].replace('bg-', '').includes('green') ? '#10B981' :
                                    domainColors[related.domain].replace('bg-', '').includes('blue') ? '#3B82F6' :
                                    domainColors[related.domain].replace('bg-', '').includes('orange') ? '#F59E0B' :
                                    '#8B5CF6'}
                            />
                          </g>
                        )
                      })}
                      <circle cx="50%" cy="50%" r="4" fill="#3B82F6" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a project to view relationships</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 