'use client';

import { useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DynamicLCARSLayoutProps {
  children: ReactNode;
  className?: string;
  uiConfiguration?: UIConfiguration;
  onLayoutChange?: (layout: UIConfiguration) => void;
}

interface UIConfiguration {
  layout: string;
  elements: string[];
  priority: string;
  crew_highlight: string;
  mission_status: string;
  dynamic_layout?: {
    sidebar_config: {
      active_crew: string;
      mission_priority: string;
      status_indicators: string[];
    };
    main_content: {
      layout_type: string;
      primary_elements: string[];
      secondary_elements: string[];
    };
    responsive_config: {
      mobile_optimized: boolean;
      tablet_optimized: boolean;
      desktop_optimized: boolean;
    };
  };
}

export function DynamicLCARSLayout({ 
  children, 
  className = '', 
  uiConfiguration,
  onLayoutChange 
}: DynamicLCARSLayoutProps) {
  const [currentLayout, setCurrentLayout] = useState<UIConfiguration | null>(uiConfiguration || null);
  const [isAdapting, setIsAdapting] = useState(false);

  // Default layout configuration
  const defaultLayout: UIConfiguration = {
    layout: 'standard-lcars',
    elements: ['standard-panel'],
    priority: 'medium',
    crew_highlight: 'none',
    mission_status: 'standard-operations',
    dynamic_layout: {
      sidebar_config: {
        active_crew: 'System Ready',
        mission_priority: 'medium',
        status_indicators: ['system-health', 'crew-status']
      },
      main_content: {
        layout_type: 'standard-lcars',
        primary_elements: ['main-panel'],
        secondary_elements: ['crew-status', 'mission-timeline', 'system-health']
      },
      responsive_config: {
        mobile_optimized: true,
        tablet_optimized: true,
        desktop_optimized: true
      }
    }
  };

  useEffect(() => {
    if (uiConfiguration) {
      setIsAdapting(true);
      // Simulate layout adaptation animation
      setTimeout(() => {
        setCurrentLayout(uiConfiguration);
        setIsAdapting(false);
        onLayoutChange?.(uiConfiguration);
      }, 500);
    }
  }, [uiConfiguration, onLayoutChange]);

  const getLayoutClass = (layout: string) => {
    const layoutClasses = {
      'strategic-command': 'lcars-layout-strategic',
      'technical-operations': 'lcars-layout-technical',
      'emotional-support': 'lcars-layout-emotional',
      'engineering-solutions': 'lcars-layout-engineering',
      'logical-analysis': 'lcars-layout-logical',
      'security-validation': 'lcars-layout-security',
      'group-collaboration': 'lcars-layout-collaboration',
      'standard-lcars': 'lcars-layout-standard'
    };
    return layoutClasses[layout as keyof typeof layoutClasses] || 'lcars-layout-standard';
  };

  const getPriorityClass = (priority: string) => {
    const priorityClasses = {
      'low': 'lcars-priority-low',
      'medium': 'lcars-priority-medium',
      'high': 'lcars-priority-high',
      'critical': 'lcars-priority-critical'
    };
    return priorityClasses[priority as keyof typeof priorityClasses] || 'lcars-priority-medium';
  };

  const getCrewHighlightClass = (crew: string) => {
    const crewClasses = {
      'captain-picard': 'lcars-crew-captain',
      'lieutenant-data': 'lcars-crew-data',
      'counselor-troi': 'lcars-crew-counselor',
      'chief-engineer-scott': 'lcars-crew-engineer',
      'commander-spock': 'lcars-crew-spock',
      'lieutenant-worf': 'lcars-crew-worf',
      'observation-lounge': 'lcars-crew-lounge'
    };
    return crewClasses[crew as keyof typeof crewClasses] || '';
  };

  const activeLayout = currentLayout || defaultLayout;
  const layoutClass = getLayoutClass(activeLayout.layout);
  const priorityClass = getPriorityClass(activeLayout.priority);
  const crewClass = getCrewHighlightClass(activeLayout.crew_highlight);

  return (
    <div className={cn(
      'dynamic-lcars-container',
      layoutClass,
      priorityClass,
      crewClass,
      className,
      isAdapting && 'lcars-adapting'
    )}>
      {/* Dynamic Layout Adaptation Indicator */}
      {isAdapting && (
        <div className="lcars-adaptation-indicator">
          <div className="lcars-adaptation-spinner"></div>
          <span>ADAPTING LCARS INTERFACE...</span>
        </div>
      )}

      {/* Mission Status Bar */}
      <div className="lcars-mission-status-bar">
        <div className="lcars-mission-priority">
          <span className="lcars-priority-label">MISSION PRIORITY:</span>
          <span className={cn('lcars-priority-value', priorityClass)}>
            {activeLayout.priority.toUpperCase()}
          </span>
        </div>
        <div className="lcars-mission-status">
          <span className="lcars-status-label">STATUS:</span>
          <span className="lcars-status-value">{activeLayout.mission_status.toUpperCase()}</span>
        </div>
        <div className="lcars-crew-highlight">
          <span className="lcars-crew-label">ACTIVE CREW:</span>
          <span className="lcars-crew-value">{activeLayout.dynamic_layout?.sidebar_config.active_crew}</span>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="lcars-dynamic-content">
        <div className="lcars-primary-elements">
          {activeLayout.dynamic_layout?.main_content.primary_elements.map((element, index) => (
            <div key={index} className={cn('lcars-element', `lcars-element-${element}`)}>
              {element === 'main-panel' ? children : (
                <div className="lcars-element-content">
                  <span className="lcars-element-label">{element.toUpperCase()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="lcars-secondary-elements">
          {activeLayout.dynamic_layout?.main_content.secondary_elements.map((element, index) => (
            <div key={index} className={cn('lcars-element', 'lcars-element-secondary', `lcars-element-${element}`)}>
              <div className="lcars-element-content">
                <span className="lcars-element-label">{element.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Interface Elements */}
      <div className="lcars-interface-elements">
        {activeLayout.elements.map((element, index) => (
          <div key={index} className={cn('lcars-interface-element', `lcars-interface-${element}`)}>
            <span className="lcars-interface-label">{element.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* Responsive Configuration Indicator */}
      <div className="lcars-responsive-config">
        <div className="lcars-responsive-indicators">
          {activeLayout.dynamic_layout?.responsive_config.mobile_optimized && (
            <span className="lcars-responsive-indicator lcars-mobile">📱</span>
          )}
          {activeLayout.dynamic_layout?.responsive_config.tablet_optimized && (
            <span className="lcars-responsive-indicator lcars-tablet">📱</span>
          )}
          {activeLayout.dynamic_layout?.responsive_config.desktop_optimized && (
            <span className="lcars-responsive-indicator lcars-desktop">💻</span>
          )}
        </div>
      </div>
    </div>
  );
}

