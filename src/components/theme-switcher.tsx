'use client';

import React, { useState, useEffect } from 'react';

interface ThemeSwitcherProps {
  onThemeChange?: (theme: 'lcars' | 'modern') => void;
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  onThemeChange, 
  className = '' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<'lcars' | 'modern'>('lcars');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('app-theme') as 'lcars' | 'modern';
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: 'lcars' | 'modern') => {
    const root = document.documentElement;
    
    if (theme === 'modern') {
      root.setAttribute('data-theme', 'modern');
      root.classList.add('modern-theme');
      root.classList.remove('lcars-theme');
    } else {
      root.setAttribute('data-theme', 'lcars');
      root.classList.add('lcars-theme');
      root.classList.remove('modern-theme');
    }
  };

  const handleThemeChange = async (newTheme: 'lcars' | 'modern') => {
    if (isAnimating || newTheme === currentTheme) return;
    
    setIsAnimating(true);
    
    // Add transition class for smooth theme change
    document.body.classList.add('theme-transitioning');
    
    // Wait for transition to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
    
    // Remove transition class
    document.body.classList.remove('theme-transitioning');
    setIsAnimating(false);
  };

  return (
    <div className={`theme-switcher ${className}`}>
      <div className="theme-switcher-container">
        <button
          className={`theme-option ${currentTheme === 'lcars' ? 'active' : ''} ${isAnimating ? 'disabled' : ''}`}
          onClick={() => handleThemeChange('lcars')}
          disabled={isAnimating}
          aria-label="Switch to LCARS theme"
        >
          <div className="theme-icon lcars-icon">
            <div className="lcars-bar"></div>
            <div className="lcars-bar"></div>
            <div className="lcars-bar"></div>
          </div>
          <span className="theme-label">LCARS</span>
        </button>
        
        <button
          className={`theme-option ${currentTheme === 'modern' ? 'active' : ''} ${isAnimating ? 'disabled' : ''}`}
          onClick={() => handleThemeChange('modern')}
          disabled={isAnimating}
          aria-label="Switch to Modern theme"
        >
          <div className="theme-icon modern-icon">
            <div className="modern-dot"></div>
            <div className="modern-dot"></div>
            <div className="modern-dot"></div>
          </div>
          <span className="theme-label">Modern</span>
        </button>
      </div>
      
      <style jsx>{`
        .theme-switcher {
          position: relative;
          z-index: 1000;
        }
        
        .theme-switcher-container {
          display: flex;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 3px solid var(--glass-border);
          border-radius: 16px;
          padding: 6px;
          gap: 6px;
          box-shadow: var(--shadow-lg);
        }
        
        .theme-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          border-radius: 12px;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
          font-weight: 600;
        }
        
        .theme-option:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
          transform: translateY(-2px);
        }
        
        .theme-option.active {
          background: rgba(30, 64, 175, 0.2);
          color: var(--modern-primary);
          box-shadow: 0 0 25px rgba(30, 64, 175, 0.4);
          border: 2px solid var(--modern-primary);
        }
        
        .theme-option.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .theme-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }
        
        /* LCARS Icon */
        .lcars-icon {
          flex-direction: column;
          gap: 3px;
        }
        
        .lcars-bar {
          height: 4px;
          background: currentColor;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        
        .lcars-bar:nth-child(1) { width: 20px; }
        .lcars-bar:nth-child(2) { width: 28px; }
        .lcars-bar:nth-child(3) { width: 16px; }
        
        .theme-option:hover .lcars-bar {
          transform: scaleX(1.1);
        }
        
        /* Modern Icon */
        .modern-icon {
          gap: 6px;
        }
        
        .modern-dot {
          width: 8px;
          height: 8px;
          background: currentColor;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .theme-option:hover .modern-dot {
          transform: scale(1.2);
        }
        
        .theme-label {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }
        
        .theme-option:hover .theme-label {
          transform: translateY(-1px);
        }
        
        /* Theme Transition */
        :global(.theme-transitioning) * {
          transition: all 0.3s ease !important;
        }
        
        /* Responsive */
        @media (max-width: 640px) {
          .theme-switcher-container {
            padding: 4px;
            gap: 4px;
          }
          
          .theme-option {
            padding: 12px 16px;
            min-width: 80px;
          }
          
          .theme-label {
            font-size: 12px;
          }
          
          .theme-icon {
            width: 28px;
            height: 28px;
          }
        }
        
        /* Enhanced Focus States */
        .theme-option:focus-visible {
          outline: 3px solid var(--modern-primary);
          outline-offset: 3px;
        }
        
        /* Enhanced Active States */
        .theme-option:active:not(.disabled) {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default ThemeSwitcher;
