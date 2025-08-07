'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LCARSSidebarProps {
  className?: string;
}

export function LCARSSidebar({ className = '' }: LCARSSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      description: 'System Overview'
    },
    {
      path: '/projects',
      label: 'Projects',
      icon: 'fas fa-project-diagram',
      description: 'Mission Log'
    },
    {
      path: '/tasks',
      label: 'Tasks',
      icon: 'fas fa-tasks',
      description: 'Task Management'
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: 'fas fa-chart-bar',
      description: 'Performance Metrics'
    },
    {
      path: '/observation-lounge',
      label: 'Observation Lounge',
      icon: 'fas fa-eye',
      description: 'AI Consultation'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className={cn('lcars-sidebar', className)}>
      <div className="lcars-menu-header">
        <i className="fas fa-star-trek lcars-mr-10"></i>
        LCARS SYSTEM
      </div>
      
      <nav className="lcars-menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={cn(
              'lcars-menu-item',
              isActive(item.path) && 'active'
            )}
            onClick={() => router.push(item.path)}
          >
            <i className={cn(item.icon, 'lcars-mr-10')}></i>
            <div>
              <div className="lcars-menu-label">{item.label}</div>
              <div className="lcars-menu-description">{item.description}</div>
            </div>
          </div>
        ))}
      </nav>
      
      <div className="lcars-sidebar-footer">
        <div className="lcars-status-indicator lcars-status-success"></div>
        <span className="lcars-status-text">SYSTEM ONLINE</span>
      </div>
    </div>
  );
} 