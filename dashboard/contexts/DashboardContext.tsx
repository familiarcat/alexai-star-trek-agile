'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'

// Types
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

interface Stats {
  totalProjects: number
  activeTasks: number
  teamMembers: number
  completionRate: number
}

interface DashboardState {
  projects: Project[]
  stats: Stats
  loading: boolean
  error: string | null
  selectedSubdomain: string
  subdomainStatus: Record<string, boolean>
}

type DashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_STATS'; payload: Stats }
  | { type: 'SET_SELECTED_SUBDOMAIN'; payload: string }
  | { type: 'SET_SUBDOMAIN_STATUS'; payload: { subdomain: string; status: boolean } }

// Initial state
const initialState: DashboardState = {
  projects: [],
  stats: {
    totalProjects: 0,
    activeTasks: 0,
    teamMembers: 0,
    completionRate: 0,
  },
  loading: true,
  error: null,
  selectedSubdomain: 'all',
  subdomainStatus: {
    agile: false,
    software: false,
    business: false,
    startup: false,
    n8n: false,
  },
}

// Reducer
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload }
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'SET_SELECTED_SUBDOMAIN':
      return { ...state, selectedSubdomain: action.payload }
    case 'SET_SUBDOMAIN_STATUS':
      return {
        ...state,
        subdomainStatus: {
          ...state.subdomainStatus,
          [action.payload.subdomain]: action.payload.status,
        },
      }
    default:
      return state
  }
}

// Context
const DashboardContext = createContext<{
  state: DashboardState
  dispatch: React.Dispatch<DashboardAction>
  fetchProjects: (subdomain?: string) => Promise<void>
  fetchStats: () => Promise<void>
  checkSubdomainStatus: () => Promise<void>
} | null>(null)

// Provider
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // Check subdomain status
  const checkSubdomainStatus = async () => {
    const subdomains = ['agile', 'software', 'business', 'startup', 'n8n']
    
    for (const subdomain of subdomains) {
      try {
        const response = await axios.get(`/api/${subdomain}/health`, {
          timeout: 5000,
        })
        dispatch({
          type: 'SET_SUBDOMAIN_STATUS',
          payload: { subdomain, status: response.status === 200 },
        })
      } catch (error) {
        dispatch({
          type: 'SET_SUBDOMAIN_STATUS',
          payload: { subdomain, status: false },
        })
      }
    }
  }

  // Fetch projects from subdomains
  const fetchProjects = async (subdomain?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      let allProjects: Project[] = []

      if (subdomain && subdomain !== 'all') {
        // Fetch from specific subdomain
        const response = await axios.get(`/api/${subdomain}/projects`)
        allProjects = response.data.map((project: any) => ({
          ...project,
          subdomain,
        }))
      } else {
        // Fetch from all subdomains
        const subdomains = ['agile', 'software', 'business', 'startup']
        
        for (const domain of subdomains) {
          try {
            const response = await axios.get(`/api/${domain}/projects`)
            const domainProjects = response.data.map((project: any) => ({
              ...project,
              subdomain: domain,
            }))
            allProjects = [...allProjects, ...domainProjects]
          } catch (error) {
            console.warn(`Failed to fetch projects from ${domain}:`, error)
          }
        }
      }

      dispatch({ type: 'SET_PROJECTS', payload: allProjects })
    } catch (error) {
      console.error('Error fetching projects:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch projects' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Fetch aggregated stats
  const fetchStats = async () => {
    try {
      const subdomains = ['agile', 'software', 'business', 'startup']
      let totalProjects = 0
      let totalTasks = 0
      let totalMembers = 0
      let completedTasks = 0

      for (const domain of subdomains) {
        try {
          const [projectsResponse, tasksResponse] = await Promise.all([
            axios.get(`/api/${domain}/projects`),
            axios.get(`/api/${domain}/tasks`),
          ])

          totalProjects += projectsResponse.data.length
          totalTasks += tasksResponse.data.length

          // Count team members across all projects
          projectsResponse.data.forEach((project: any) => {
            totalMembers += project.team_members?.length || 0
          })

          // Count completed tasks
          tasksResponse.data.forEach((task: any) => {
            if (task.status === 'done' || task.status === 'completed') {
              completedTasks++
            }
          })
        } catch (error) {
          console.warn(`Failed to fetch stats from ${domain}:`, error)
        }
      }

      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      dispatch({
        type: 'SET_STATS',
        payload: {
          totalProjects,
          activeTasks: totalTasks - completedTasks,
          teamMembers: totalMembers,
          completionRate,
        },
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Initial load
  useEffect(() => {
    checkSubdomainStatus()
    fetchProjects()
    fetchStats()
  }, [])

  // Fetch projects when subdomain changes
  useEffect(() => {
    if (state.selectedSubdomain) {
      fetchProjects(state.selectedSubdomain)
    }
  }, [state.selectedSubdomain])

  return (
    <DashboardContext.Provider
      value={{
        state,
        dispatch,
        fetchProjects,
        fetchStats,
        checkSubdomainStatus,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

// Hook
export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }

  const { state, dispatch } = context

  return {
    ...state,
    setSelectedSubdomain: (subdomain: string) =>
      dispatch({ type: 'SET_SELECTED_SUBDOMAIN', payload: subdomain }),
    fetchProjects: context.fetchProjects,
    fetchStats: context.fetchStats,
    checkSubdomainStatus: context.checkSubdomainStatus,
  }
} 