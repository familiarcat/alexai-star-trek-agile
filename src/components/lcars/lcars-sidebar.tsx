'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  FolderIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon,
  CogIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface LCARSSidebarProps {
  collapsed?: boolean;
}

export function LCARSSidebar({ collapsed = false }: LCARSSidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/',
      label: 'DASHBOARD',
      description: 'SYSTEM OVERVIEW',
      icon: HomeIcon,
      active: pathname === '/'
    },
    {
      href: '/projects',
      label: 'PROJECTS',
      description: 'MISSION LOG',
      icon: FolderIcon,
      active: pathname.startsWith('/projects')
    },
    {
      href: '/tasks',
      label: 'TASKS',
      description: 'TASK MANAGEMENT',
      icon: ClipboardDocumentListIcon,
      active: pathname.startsWith('/tasks')
    },
    {
      href: '/weekly-execution',
      label: 'WEEKLY PLAN',
      description: 'EXECUTION STRATEGY',
      icon: RocketLaunchIcon,
      active: pathname.startsWith('/weekly-execution')
    },
    {
      href: '/analytics',
      label: 'ANALYTICS',
      description: 'PERFORMANCE METRICS',
      icon: ChartBarIcon,
      active: pathname.startsWith('/analytics')
    },
    {
      href: '/workflow-management',
      label: 'WORKFLOWS',
      description: 'N8N INTEGRATION',
      icon: CogIcon,
      active: pathname.startsWith('/workflow')
    },
    {
      href: '/observation-lounge',
      label: 'OBSERVATION LOUNGE',
      description: 'AI CONSULTATION',
      icon: ChatBubbleLeftRightIcon,
      active: pathname.startsWith('/observation')
    },
    {
      href: '/crew',
      label: 'CREW',
      description: 'STARFLEET PERSONNEL',
      icon: UserGroupIcon,
      active: pathname.startsWith('/crew')
    },
    {
      href: '/security',
      label: 'SECURITY',
      description: 'DEFENSE SYSTEMS',
      icon: ShieldCheckIcon,
      active: pathname.startsWith('/security')
    }
  ];

  return (
    <div className={cn('lcars-sidebar', collapsed && 'lcars-sidebar-collapsed')}>
      {/* Top Bar */}
      <div className="lcars-top-bar">
        {!collapsed ? (
          <>
            <div>LCARS MENU</div>
            <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>LCARS SYSTEM 3</div>
            <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>ALEXAI AGILE MANAGER</div>
          </>
        ) : (
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>LCARS</div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="lcars-nav-menu">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('lcars-nav-item', item.active && 'active')}
              title={collapsed ? `${item.label} - ${item.description}` : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconComponent style={{ width: '20px', height: '20px', minWidth: '20px' }} />
                {!collapsed && (
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{item.label}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{item.description}</div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: 'bold', 
            color: '#000', 
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            QUICK ACTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/projects/new" className="lcars-quick-action">
              <RocketLaunchIcon style={{ width: '16px', height: '16px' }} />
              <span>NEW MISSION</span>
            </Link>
            <Link href="/observation-lounge" className="lcars-quick-action">
              <BeakerIcon style={{ width: '16px', height: '16px' }} />
              <span>AI CONSULT</span>
            </Link>
          </div>
        </div>
      )}

      {/* System Status Footer */}
      <div style={{ 
        marginTop: 'auto', 
        padding: '15px', 
        background: 'rgba(0,0,0,0.3)', 
        borderRadius: 'var(--lcars-inner-radius)',
        border: '2px solid #000'
      }}>
        {!collapsed ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#000' }}>SYSTEM STATUS</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#000' }}>SUBSPACE LINK</span>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: 'var(--lcars-green)',
                  boxShadow: '0 0 5px var(--lcars-green)'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#000' }}>DATABASE</span>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: 'var(--lcars-green)',
                  boxShadow: '0 0 5px var(--lcars-green)'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#000' }}>AI CORE</span>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: 'var(--lcars-green)',
                  boxShadow: '0 0 5px var(--lcars-green)'
                }}></div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: 'var(--lcars-green)',
              boxShadow: '0 0 5px var(--lcars-green)',
              margin: '0 auto 5px'
            }}></div>
            <div style={{ fontSize: '0.6rem', color: '#000', fontWeight: 'bold' }}>ONLINE</div>
          </div>
        )}
      </div>

      {/* LCARS Branding */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '15px', 
        padding: '10px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 'var(--lcars-inner-radius)',
        border: '1px solid #000'
      }}>
        {!collapsed ? (
          <>
            <div style={{ fontSize: '0.6rem', color: '#000', fontWeight: 'bold' }}>LCARS</div>
            <div style={{ fontSize: '0.5rem', color: '#000', opacity: 0.7 }}>v3.0</div>
          </>
        ) : (
          <div style={{ fontSize: '0.8rem', color: '#000', fontWeight: 'bold' }}>LCARS</div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
} 