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
import { ProjectCard } from '@/components/ProjectCard'
import { StatsCard } from '@/components/StatsCard'
import { SubdomainSelector } from '@/components/SubdomainSelector'
import { useDashboard } from '@/hooks/useDashboard'

export default function DashboardPage() {
  const { 
    projects, 
    stats, 
    loading, 
    error,
    selectedSubdomain,
    setSelectedSubdomain 
  } = useDashboard()

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading Enterprise Dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">Connection Error</h2>
          <p className="text-gray-300">Unable to connect to subdomain services</p>
        </div>
      </div>
    )
  }

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

      {/* Subdomain Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SubdomainSelector
          subdomains={subdomains}
          selectedSubdomain={selectedSubdomain}
          onSelectSubdomain={setSelectedSubdomain}
        />
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={BarChart3}
          color="blue"
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="Active Tasks"
          value={stats.activeTasks}
          icon={CheckCircle}
          color="green"
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon={Users}
          color="purple"
          change="+3"
          changeType="positive"
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={Target}
          color="orange"
          change="+5%"
          changeType="positive"
        />
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
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {projects.length === 0 ? (
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
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
} 