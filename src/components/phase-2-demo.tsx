import React, { useState } from 'react';
import {
  EnhancedGlassCard,
  EnhancedGlowButton,
  EnhancedInteractivePanel,
  EnhancedScrollTrigger,
  EnhancedThemeToggle,
  EnhancedPerformanceDisplay
} from './enhanced-modern-components';

/**
 * 🌟 Phase 2 Demo - Showcase of Enhanced Modern Components
 * Demonstrates advanced interactions, accessibility, and performance monitoring
 */
const Phase2Demo: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string>('overview');
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  const handlePanelToggle = (panelId: string) => {
    setActivePanel(activePanel === panelId ? 'none' : panelId);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    setCurrentTheme(theme);
    console.log(`Theme changed to: ${theme}`);
  };

  return (
    <div className="phase-2-demo">
      {/* Header Section */}
      <header className="demo-header">
        <div className="header-content">
          <h1 className="demo-title">🚀 Phase 2: Enhanced Modern Components</h1>
          <p className="demo-subtitle">
            Advanced interactions, accessibility, and performance monitoring
          </p>
          <div className="header-controls">
            <EnhancedThemeToggle
              onThemeChange={handleThemeChange}
              defaultTheme={currentTheme}
            />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="demo-navigation">
        <EnhancedGlowButton
          variant="primary"
          size="small"
          onClick={() => setActivePanel('overview')}
          className={activePanel === 'overview' ? 'active' : ''}
        >
          Overview
        </EnhancedGlowButton>
        <EnhancedGlowButton
          variant="secondary"
          size="small"
          onClick={() => setActivePanel('components')}
          className={activePanel === 'components' ? 'active' : ''}
        >
          Components
        </EnhancedGlowButton>
        <EnhancedGlowButton
          variant="accent"
          size="small"
          onClick={() => setActivePanel('performance')}
          className={activePanel === 'performance' ? 'active' : ''}
        >
          Performance
        </EnhancedGlowButton>
        <EnhancedGlowButton
          variant="success"
          size="small"
          onClick={() => setActivePanel('interactions')}
          className={activePanel === 'interactions' ? 'active' : ''}
        >
          Interactions
        </EnhancedGlowButton>
      </nav>

      {/* Main Content */}
      <main className="demo-main">
        {/* Overview Section */}
        {activePanel === 'overview' && (
          <EnhancedScrollTrigger trigger="auto" animation="fade" delay={100}>
            <section className="overview-section">
              <h2>🎯 Phase 2 Achievements</h2>
              
              <div className="achievements-grid">
                <EnhancedGlassCard variant="elevated" animation="slide-up" delay={200}>
                  <h3>🛡️ Performance Monitoring</h3>
                  <p>Lieutenant Worf's comprehensive performance framework</p>
                  <ul>
                    <li>Core Web Vitals tracking</li>
                    <li>Real-time performance metrics</li>
                    <li>Automated performance recommendations</li>
                  </ul>
                </EnhancedGlassCard>

                <EnhancedGlassCard variant="elevated" animation="slide-up" delay={300}>
                  <h3>🎨 Component Modernization</h3>
                  <p>Counselor Troi's enhanced component system</p>
                  <ul>
                    <li>Advanced glassmorphism variants</li>
                    <li>Interactive glow effects</li>
                    <li>Accessibility-first design</li>
                  </ul>
                </EnhancedGlassCard>

                <EnhancedGlassCard variant="elevated" animation="slide-up" delay={400}>
                  <h3>🚀 Advanced Interactions</h3>
                  <p>Scroll-triggered animations and microinteractions</p>
                  <ul>
                    <li>Intersection Observer integration</li>
                    <li>Smooth scroll animations</li>
                    <li>Performance-optimized effects</li>
                  </ul>
                </EnhancedGlassCard>

                <EnhancedGlassCard variant="elevated" animation="slide-up" delay={500}>
                  <h3>🌈 Theme System</h3>
                  <p>Dynamic theming with smooth transitions</p>
                  <ul>
                    <li>Light/Dark/Auto themes</li>
                    <li>CSS custom properties</li>
                    <li>Accessibility compliance</li>
                  </ul>
                </EnhancedGlassCard>
              </div>
            </section>
          </EnhancedScrollTrigger>
        )}

        {/* Components Section */}
        {activePanel === 'components' && (
          <section className="components-section">
            <h2>🎨 Enhanced Component Showcase</h2>
            
            <div className="component-showcase">
              {/* Glass Card Variants */}
              <div className="showcase-group">
                <h3>Glass Card Variants</h3>
                <div className="card-variants">
                  <EnhancedGlassCard variant="default" animation="fade-in">
                    <h4>Default Glass Card</h4>
                    <p>Standard glassmorphism with backdrop blur</p>
                  </EnhancedGlassCard>

                  <EnhancedGlassCard variant="elevated" animation="fade-in" delay={100}>
                    <h4>Elevated Glass Card</h4>
                    <p>Enhanced depth with stronger shadows</p>
                  </EnhancedGlassCard>

                  <EnhancedGlassCard variant="interactive" animation="fade-in" delay={200}>
                    <h4>Interactive Glass Card</h4>
                    <p>Hover effects and click interactions</p>
                  </EnhancedGlassCard>

                  <EnhancedGlassCard variant="loading" animation="fade-in" delay={300}>
                    <h4>Loading Glass Card</h4>
                    <p>Shimmer effect overlay</p>
                  </EnhancedGlassCard>
                </div>
              </div>

              {/* Glow Button Variants */}
              <div className="showcase-group">
                <h3>Glow Button Variants</h3>
                <div className="button-variants">
                  <EnhancedGlowButton variant="primary" size="medium">
                    Primary Button
                  </EnhancedGlowButton>
                  <EnhancedGlowButton variant="secondary" size="medium">
                    Secondary Button
                  </EnhancedGlowButton>
                  <EnhancedGlowButton variant="accent" size="medium">
                    Accent Button
                  </EnhancedGlowButton>
                  <EnhancedGlowButton variant="success" size="medium">
                    Success Button
                  </EnhancedGlowButton>
                  <EnhancedGlowButton variant="warning" size="medium">
                    Warning Button
                  </EnhancedGlowButton>
                  <EnhancedGlowButton variant="error" size="medium">
                    Error Button
                  </EnhancedGlowButton>
                </div>

                <div className="button-sizes">
                  <h4>Button Sizes</h4>
                  <EnhancedGlowButton variant="primary" size="small">
                    Small
                  </EnhancedGlowButton>
                  <EnhancedGlowButton variant="primary" size="medium">
                    Medium
                  </EnhancedGlowButton>
                  <EnhancedGlowButton variant="primary" size="large">
                    Large
                  </EnhancedGlowButton>
                </div>

                <div className="button-states">
                  <h4>Button States</h4>
                  <EnhancedGlowButton variant="primary" loading>
                    Loading State
                  </EnhancedGlowButton>
                  <EnhancedGlowButton variant="primary" disabled>
                    Disabled State
                  </EnhancedGlowButton>
                </div>
              </div>

              {/* Interactive Panels */}
              <div className="showcase-group">
                <h3>Interactive Panels</h3>
                <div className="panel-showcase">
                  <EnhancedInteractivePanel
                    title="Collapsible Panel"
                    variant="default"
                    collapsible
                    onToggle={(collapsed) => console.log('Panel toggled:', collapsed)}
                  >
                    <p>This panel can be collapsed and expanded. Click the toggle button to see it in action.</p>
                    <p>The content smoothly animates in and out with proper accessibility support.</p>
                  </EnhancedInteractivePanel>

                  <EnhancedInteractivePanel
                    title="Accent Panel"
                    variant="accent"
                    collapsible
                    defaultCollapsed
                  >
                    <p>This panel starts collapsed and uses the accent variant styling.</p>
                    <p>It demonstrates the smooth animation and hover effects.</p>
                  </EnhancedInteractivePanel>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Performance Section */}
        {activePanel === 'performance' && (
          <section className="performance-section">
            <h2>📊 Performance Monitoring Dashboard</h2>
            
            <div className="performance-overview">
              <EnhancedPerformanceDisplay
                showDetails={showPerformanceDetails}
                autoRefresh={true}
                refreshInterval={3000}
              />
              
              <div className="performance-controls">
                <EnhancedGlowButton
                  variant="secondary"
                  onClick={() => setShowPerformanceDetails(!showPerformanceDetails)}
                >
                  {showPerformanceDetails ? 'Hide Details' : 'Show Details'}
                </EnhancedGlowButton>
              </div>
            </div>

            <div className="performance-info">
              <EnhancedGlassCard variant="elevated">
                <h3>🛡️ Lieutenant Worf's Performance Framework</h3>
                <p>Comprehensive monitoring system that tracks:</p>
                <ul>
                  <li><strong>Core Web Vitals:</strong> FCP, LCP, FID, CLS</li>
                  <li><strong>Animation Performance:</strong> FPS monitoring and optimization</li>
                  <li><strong>Memory Usage:</strong> Real-time memory tracking</li>
                  <li><strong>Bundle Analysis:</strong> Size and loading performance</li>
                  <li><strong>Accessibility Score:</strong> Automated accessibility assessment</li>
                </ul>
                <p>The system provides real-time recommendations and performance trends to ensure optimal user experience.</p>
              </EnhancedGlassCard>
            </div>
          </section>
        )}

        {/* Interactions Section */}
        {activePanel === 'interactions' && (
          <section className="interactions-section">
            <h2>🎯 Advanced Interactions & Animations</h2>
            
            <div className="interaction-showcase">
              {/* Scroll Triggers */}
              <div className="showcase-group">
                <h3>Scroll-Triggered Animations</h3>
                <div className="scroll-triggers">
                  <EnhancedScrollTrigger trigger="scroll" animation="fade" direction="up">
                    <EnhancedGlassCard variant="interactive">
                      <h4>Fade In Animation</h4>
                      <p>This card fades in when scrolled into view</p>
                    </EnhancedGlassCard>
                  </EnhancedScrollTrigger>

                  <EnhancedScrollTrigger trigger="scroll" animation="slide" direction="left" delay={200}>
                    <EnhancedGlassCard variant="interactive">
                      <h4>Slide Left Animation</h4>
                      <p>This card slides in from the left with a delay</p>
                    </EnhancedGlassCard>
                  </EnhancedScrollTrigger>

                  <EnhancedScrollTrigger trigger="scroll" animation="scale" delay={400}>
                    <EnhancedGlassCard variant="interactive">
                      <h4>Scale Animation</h4>
                      <p>This card scales in when it becomes visible</p>
                    </EnhancedGlassCard>
                  </EnhancedScrollTrigger>

                  <EnhancedScrollTrigger trigger="scroll" animation="slide" direction="right" delay={600}>
                    <EnhancedGlassCard variant="interactive">
                      <h4>Slide Right Animation</h4>
                      <p>This card slides in from the right with a longer delay</p>
                    </EnhancedGlassCard>
                  </EnhancedScrollTrigger>
                </div>
              </div>

              {/* Microinteractions */}
              <div className="showcase-group">
                <h3>Microinteractions</h3>
                <div className="microinteractions">
                  <EnhancedGlassCard variant="interactive" className="interaction-demo">
                    <h4>Hover Effects</h4>
                    <p>Hover over this card to see smooth animations</p>
                    <p>Notice the lift effect and enhanced shadows</p>
                  </EnhancedGlassCard>

                  <div className="interaction-buttons">
                    <EnhancedGlowButton variant="primary" size="large">
                      Hover for Glow Effect
                    </EnhancedGlowButton>
                    <EnhancedGlowButton variant="accent" size="large">
                      Click for Ripple
                    </EnhancedGlowButton>
                  </div>
                </div>
              </div>

              {/* Theme Toggle Demo */}
              <div className="showcase-group">
                <h3>Theme System</h3>
                <div className="theme-demo">
                  <p>Current theme: <strong>{currentTheme}</strong></p>
                  <p>Watch how the entire interface adapts to theme changes with smooth transitions.</p>
                  <div className="theme-controls">
                    <EnhancedThemeToggle
                      onThemeChange={handleThemeChange}
                      defaultTheme={currentTheme}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="demo-footer">
        <div className="footer-content">
          <p>🚀 Phase 2 Complete: Enhanced Modern Components</p>
          <p>Advanced interactions, accessibility, and performance monitoring successfully implemented</p>
        </div>
      </footer>
    </div>
  );
};

export default Phase2Demo;
