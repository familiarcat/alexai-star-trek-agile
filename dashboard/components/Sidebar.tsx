'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Target, 
  Code, 
  TrendingUp, 
  Rocket, 
  Settings,
  Activity,
  Users,
  Database,
  Workflow
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: BarChart3,
    color: 'bg-blue-500',
  },
  {
    name: 'Agile',
    href: '/agile',
    icon: Target,
    color: 'bg-green-500',
    subdomain: 'agile.pbradygeorgen.com',
  },
  {
    name: 'Software',
    href: '/software',
    icon: Code,
    color: 'bg-purple-500',
    subdomain: 'software.pbradygeorgen.com',
  },
  {
    name: 'Business',
    href: '/business',
    icon: TrendingUp,
    color: 'bg-orange-500',
    subdomain: 'business.pbradygeorgen.com',
  },
  {
    name: 'Startup',
    href: '/startup',
    icon: Rocket,
    color: 'bg-red-500',
    subdomain: 'startup.pbradygeorgen.com',
  },
  {
    name: 'Workflows',
    href: '/workflows',
    icon: Workflow,
    color: 'bg-indigo-500',
    subdomain: 'n8n.pbradygeorgen.com',
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
    color: 'bg-pink-500',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: Activity,
    color: 'bg-cyan-500',
  },
  {
    name: 'Database',
    href: '/database',
    icon: Database,
    color: 'bg-emerald-500',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    color: 'bg-gray-500',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AlexAI</h1>
            <p className="text-xs text-gray-400">Enterprise Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <motion.div
              key={item.name}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'hover:bg-gray-800 border border-transparent'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg
                  ${item.color}
                  ${isActive ? 'ring-2 ring-blue-400' : ''}
                `}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <span className={`
                    font-medium
                    ${isActive ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'}
                  `}>
                    {item.name}
                  </span>
                  
                  {item.subdomain && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.subdomain}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">
            Enterprise Dashboard v1.0
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">All Systems Online</span>
          </div>
        </div>
      </div>
    </div>
  )
} 