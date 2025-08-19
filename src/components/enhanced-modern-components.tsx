import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PerformanceMonitor } from '../core/performance-monitor';

/**
 * 🌟 Enhanced Modern Components - Counselor Troi's Component Modernization
 * High-impact components with advanced interactions, accessibility, and performance
 */

// ============================================================================
// 🎨 ENHANCED GLASSMORPHISM CARD COMPONENT
// ============================================================================

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'interactive' | 'loading';
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'none';
  delay?: number;
  onClick?: () => void;
  disabled?: boolean;
}

export const EnhancedGlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  animation = 'fade-in',
  delay = 0,
  onClick,
  disabled = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animation !== 'none') {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(true);
    }
  }, [animation, delay]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!disabled) setIsPressed(true);
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'glass-card-elevated';
      case 'interactive':
        return 'glass-card-interactive';
      case 'loading':
        return 'glass-card-loading';
      default:
        return 'glass-card';
    }
  };

  const getAnimationClasses = () => {
    if (!isLoaded) return '';
    
    switch (animation) {
      case 'fade-in':
        return 'animate-fade-in';
      case 'slide-up':
        return 'animate-slide-up';
      case 'scale-in':
        return 'animate-scale-in';
      default:
        return '';
    }
  };

  const getStateClasses = () => {
    let classes = '';
    if (isHovered) classes += ' state-hovered';
    if (isPressed) classes += ' state-pressed';
    if (disabled) classes += ' state-disabled';
    return classes;
  };

  return (
    <div
      ref={cardRef}
      className={`${getVariantClasses()} ${getAnimationClasses()} ${getStateClasses()} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      style={{
        '--hover-lift': isHovered ? '8px' : '0px',
        '--press-scale': isPressed ? '0.98' : '1',
        '--animation-delay': `${delay}ms`
      } as React.CSSProperties}
    >
      {variant === 'loading' && (
        <div className="loading-overlay">
          <div className="loading-shimmer"></div>
        </div>
      )}
      <div className="glass-card-content">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// ✨ ENHANCED GLOW BUTTON COMPONENT
// ============================================================================

interface GlowButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const EnhancedGlowButton: React.FC<GlowButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  iconPosition = 'left'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!disabled && !loading && onClick) {
      e.preventDefault();
      onClick();
    }
  }, [disabled, loading, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !loading && onClick) {
        onClick();
      }
    }
  }, [disabled, loading, onClick]);

  const getVariantClasses = () => {
    return `glow-button-${variant}`;
  };

  const getSizeClasses = () => {
    return `glow-button-${size}`;
  };

  const getStateClasses = () => {
    let classes = '';
    if (isHovered) classes += ' state-hovered';
    if (isPressed) classes += ' state-pressed';
    if (isFocused) classes += ' state-focused';
    if (disabled) classes += ' state-disabled';
    if (loading) classes += ' state-loading';
    return classes;
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <span className={`button-icon ${iconPosition === 'right' ? 'icon-right' : 'icon-left'}`}>
        {icon}
      </span>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="loading-spinner"></span>
          <span className="loading-text">Loading...</span>
        </>
      );
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        <span className="button-text">{children}</span>
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <button
      ref={buttonRef}
      className={`enhanced-glow-button ${getVariantClasses()} ${getSizeClasses()} ${getStateClasses()} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-busy={loading}
      style={{
        '--glow-intensity': isHovered ? '1.2' : '1',
        '--press-scale': isPressed ? '0.95' : '1',
        '--focus-glow': isFocused ? '1.5' : '1'
      } as React.CSSProperties}
    >
      {renderContent()}
    </button>
  );
};

// ============================================================================
// 🎭 ENHANCED INTERACTIVE PANEL COMPONENT
// ============================================================================

interface InteractivePanelProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'warning' | 'info';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  onToggle?: (collapsed: boolean) => void;
}

export const EnhancedInteractivePanel: React.FC<InteractivePanelProps> = ({
  title,
  children,
  variant = 'default',
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  onToggle
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isHovered, setIsHovered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    if (collapsible) {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      onToggle?.(newState);
    }
  }, [collapsible, isCollapsed, onToggle]);

  const getVariantClasses = () => {
    return `interactive-panel-${variant}`;
  };

  const getStateClasses = () => {
    let classes = '';
    if (isHovered) classes += ' state-hovered';
    if (isCollapsed) classes += ' state-collapsed';
    return classes;
  };

  return (
    <div
      ref={panelRef}
      className={`enhanced-interactive-panel ${getVariantClasses()} ${getStateClasses()} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title && (
        <div className="panel-header">
          <h3 className="panel-title">{title}</h3>
          {collapsible && (
            <button
              className="panel-toggle-button"
              onClick={handleToggle}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              <span className={`toggle-icon ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                {isCollapsed ? '▶' : '▼'}
              </span>
            </button>
          )}
        </div>
      )}
      <div className={`panel-content ${isCollapsed ? 'collapsed' : ''}`}>
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// 🌟 ENHANCED SCROLL TRIGGER COMPONENT
// ============================================================================

interface ScrollTriggerProps {
  children: React.ReactNode;
  trigger?: 'scroll' | 'hover' | 'click' | 'auto';
  animation?: 'fade' | 'slide' | 'scale' | 'rotate' | 'custom';
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  onTrigger?: () => void;
}

export const EnhancedScrollTrigger: React.FC<ScrollTriggerProps> = ({
  children,
  trigger = 'scroll',
  animation = 'fade',
  direction = 'none',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  className = '',
  onTrigger
}) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (trigger === 'scroll' && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isTriggered) {
              setIsVisible(true);
              setTimeout(() => {
                setIsTriggered(true);
                onTrigger?.();
              }, delay);
            }
          });
        },
        { threshold }
      );

      if (elementRef.current) {
        observerRef.current.observe(elementRef.current);
      }
    } else if (trigger === 'auto') {
      setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => {
          setIsTriggered(true);
          onTrigger?.();
        }, delay);
      }, 100);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [trigger, threshold, delay, isTriggered, onTrigger]);

  const getAnimationClasses = () => {
    if (!isVisible) return 'scroll-trigger-hidden';
    if (!isTriggered) return 'scroll-trigger-visible';
    return `scroll-trigger-triggered animation-${animation} direction-${direction}`;
  };

  return (
    <div
      ref={elementRef}
      className={`enhanced-scroll-trigger ${getAnimationClasses()} ${className}`}
      style={{
        '--animation-delay': `${delay}ms`,
        '--animation-duration': `${duration}ms`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// ============================================================================
// 🎨 ENHANCED THEME TOGGLE COMPONENT
// ============================================================================

interface ThemeToggleProps {
  className?: string;
  onThemeChange?: (theme: 'light' | 'dark' | 'auto') => void;
  defaultTheme?: 'light' | 'dark' | 'auto';
}

export const EnhancedThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  onThemeChange,
  defaultTheme = 'auto'
}) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'auto'>(defaultTheme);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (currentTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', currentTheme);
    }
  }, [currentTheme]);

  const handleThemeChange = useCallback((theme: 'light' | 'dark' | 'auto') => {
    setIsAnimating(true);
    setCurrentTheme(theme);
    onThemeChange?.(theme);
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [onThemeChange]);

  const getThemeIcon = (theme: 'light' | 'dark' | 'auto') => {
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'auto': return '🔄';
    }
  };

  return (
    <div className={`enhanced-theme-toggle ${className}`}>
      <div className="theme-toggle-container">
        {(['light', 'dark', 'auto'] as const).map((theme) => (
          <button
            key={theme}
            className={`theme-option ${currentTheme === theme ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={() => handleThemeChange(theme)}
            aria-label={`Switch to ${theme} theme`}
            aria-pressed={currentTheme === theme}
          >
            <span className="theme-icon">{getThemeIcon(theme)}</span>
            <span className="theme-label">{theme}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 🚀 ENHANCED PERFORMANCE MONITORING COMPONENT
// ============================================================================

interface PerformanceDisplayProps {
  className?: string;
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const EnhancedPerformanceDisplay: React.FC<PerformanceDisplayProps> = ({
  className = '',
  showDetails = false,
  autoRefresh = true,
  refreshInterval = 5000
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const performanceMonitorRef = useRef<PerformanceMonitor | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      performanceMonitorRef.current = new PerformanceMonitor();
      performanceMonitorRef.current.startMonitoring();
      setIsMonitoring(true);
    }

    return () => {
      if (performanceMonitorRef.current) {
        performanceMonitorRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!autoRefresh || !isMonitoring) return;

    const interval = setInterval(() => {
      if (performanceMonitorRef.current) {
        const currentMetrics = performanceMonitorRef.current.getCurrentMetrics();
        if (currentMetrics) {
          setMetrics(currentMetrics);
        }
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isMonitoring]);

  if (!metrics) {
    return (
      <div className={`enhanced-performance-display loading ${className}`}>
        <div className="loading-shimmer">Initializing performance monitoring...</div>
      </div>
    );
  }

  const getPerformanceScore = () => {
    let score = 0;
    let total = 0;

    // Core Web Vitals scoring
    if (metrics.fcp <= 1800) score += 25;
    if (metrics.lcp <= 2500) score += 25;
    if (metrics.fid <= 100) score += 25;
    if (metrics.cls <= 0.1) score += 25;
    total += 100;

    return Math.round((score / total) * 100);
  };

  const performanceScore = getPerformanceScore();

  return (
    <div className={`enhanced-performance-display ${className}`}>
      <div className="performance-header">
        <h3>Performance Monitor</h3>
        <div className={`performance-score score-${performanceScore >= 90 ? 'excellent' : performanceScore >= 70 ? 'good' : 'needs-improvement'}`}>
          {performanceScore}/100
        </div>
      </div>
      
      <div className="performance-metrics">
        <div className="metric-row">
          <span className="metric-label">FCP</span>
          <span className="metric-value">{metrics.fcp?.toFixed(0)}ms</span>
          <span className="metric-status">{metrics.fcp <= 1800 ? '✅' : metrics.fcp <= 3000 ? '⚠️' : '❌'}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">LCP</span>
          <span className="metric-value">{metrics.lcp?.toFixed(0)}ms</span>
          <span className="metric-status">{metrics.lcp <= 2500 ? '✅' : metrics.lcp <= 4000 ? '⚠️' : '❌'}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">FID</span>
          <span className="metric-value">{metrics.fid?.toFixed(0)}ms</span>
          <span className="metric-status">{metrics.fid <= 100 ? '✅' : metrics.fid <= 300 ? '⚠️' : '❌'}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">CLS</span>
          <span className="metric-value">{metrics.cls?.toFixed(3)}</span>
          <span className="metric-status">{metrics.cls <= 0.1 ? '✅' : metrics.cls <= 0.25 ? '⚠️' : '❌'}</span>
        </div>
      </div>

      {showDetails && (
        <div className="performance-details">
          <div className="detail-row">
            <span>Animation FPS:</span>
            <span>{metrics.animationFPS?.toFixed(0)}</span>
          </div>
          <div className="detail-row">
            <span>Memory Usage:</span>
            <span>{metrics.memoryUsage?.toFixed(1)}MB</span>
          </div>
          <div className="detail-row">
            <span>Bundle Size:</span>
            <span>{metrics.bundleSize?.toFixed(1)}KB</span>
          </div>
          <div className="detail-row">
            <span>Accessibility:</span>
            <span>{metrics.accessibilityScore}/100</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Export all enhanced components
export {
  EnhancedGlassCard,
  EnhancedGlowButton,
  EnhancedInteractivePanel,
  EnhancedScrollTrigger,
  EnhancedThemeToggle,
  EnhancedPerformanceDisplay
};
