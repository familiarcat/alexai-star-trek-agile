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
      label: 'DASHBOARD',
      description: 'SYSTEM OVERVIEW'
    },
    {
      path: '/projects',
      label: 'PROJECTS',
      description: 'MISSION LOG'
    },
    {
      path: '/tasks',
      label: 'TASKS',
      description: 'TASK MANAGEMENT'
    },
    {
      path: '/analytics',
      label: 'ANALYTICS',
      description: 'PERFORMANCE METRICS'
    },
    {
      path: '/observation-lounge',
      label: 'OBSERVATION LOUNGE',
      description: 'AI CONSULTATION'
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
      {/* Top Bar */}
      <div className="lcars-top-bar">
        <div className="lcars-top-left">LCARS MENU</div>
        <div className="lcars-top-center">LCARS SYSTEM 3 - ALEXAI AGILE MANAGER</div>
        <div className="lcars-top-right">
          <div className="lcars-top-button">
            <span>SYSTEM HEALTH</span>
          </div>
          <div className="lcars-top-button">
            <span>STATISTICS</span>
          </div>
        </div>
      </div>
      
      {/* Menu Items */}
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
            <div className="lcars-menu-content">
              <div className="lcars-menu-label">{item.label}</div>
              <div className="lcars-menu-description">{item.description}</div>
            </div>
          </div>
        ))}
      </nav>
      
      {/* System Status */}
      <div className="lcars-system-status">
        <div className="lcars-status-title">SYSTEM STATUS</div>
        <div className="lcars-status-items">
          <div className="lcars-status-item">
            <div className="lcars-status-indicator lcars-status-success"></div>
            <span>SUBSPACE LINK: ESTABLISHED</span>
          </div>
          <div className="lcars-status-item">
            <div className="lcars-status-indicator lcars-status-success"></div>
            <span>STARFLEET DATABASE: CONNECTED</span>
          </div>
          <div className="lcars-status-item">
            <div className="lcars-status-indicator lcars-status-success"></div>
            <span>QUANTUM MEMORY FIELD: STABLE</span>
          </div>
          <div className="lcars-status-item">
            <div className="lcars-status-indicator lcars-status-success"></div>
            <span>OPTICAL DATA NETWORK: ONLINE</span>
          </div>
        </div>
      </div>
      
      <div className="lcars-sidebar-footer">
        <div className="lcars-status-indicator lcars-status-success"></div>
        <span className="lcars-status-text">SYSTEM ONLINE</span>
      </div>
    </div>
  );
} 