import React, { useEffect, useRef } from 'react';
import { ModernDesignSystem } from '../core/scroll-animations';

/**
 * 🌟 Modern UI Demo Component - 2025 Design Trends Showcase
 * Demonstrates glassmorphism, glow effects, scroll animations, and microinteractions
 */
const ModernUIDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const designSystemRef = useRef<ModernDesignSystem | null>(null);

  useEffect(() => {
    // Initialize the modern design system
    designSystemRef.current = new ModernDesignSystem();

    return () => {
      // Cleanup
      if (designSystemRef.current) {
        designSystemRef.current.destroy();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="modern-ui-demo">
      {/* Hero Section with Glassmorphism */}
      <section className="hero-section animate-on-scroll" data-animation-direction="up">
        <div className="glass-card hero-card">
          <h1 className="glow-text">🚀 Modern UI Transformation 2025</h1>
          <p className="hero-description">
            Experience the future of web design with glassmorphism, glow effects, 
            and sophisticated microinteractions
          </p>
          <div className="hero-buttons">
            <button className="glass-button">Explore Features</button>
            <button className="neu-button">Get Started</button>
          </div>
        </div>
      </section>

      {/* Feature Cards with Stagger Animation */}
      <section className="features-section">
        <h2 className="section-title animate-on-scroll" data-animation-direction="left">
          ✨ 2025 Design Trends
        </h2>
        
        <div className="features-grid">
          <div className="glass-card feature-card animate-on-scroll" data-stagger-delay="0">
            <div className="feature-icon">🌟</div>
            <h3>Glassmorphism</h3>
            <p>Translucent panels with backdrop blur effects for modern depth</p>
            <button className="glass-button feature-button">Learn More</button>
          </div>

          <div className="glass-card feature-card animate-on-scroll" data-stagger-delay="100">
            <div className="feature-icon">✨</div>
            <h3>Glow Effects</h3>
            <p>Luminous aesthetics with sophisticated glows and light blooms</p>
            <button className="glass-button feature-button">Learn More</button>
          </div>

          <div className="glass-card feature-card animate-on-scroll" data-stagger-delay="200">
            <div className="feature-icon">🎭</div>
            <h3>3D Depth</h3>
            <p>Advanced shadow systems for realistic depth perception</p>
            <button className="glass-button feature-button">Learn More</button>
          </div>

          <div className="glass-card feature-card animate-on-scroll" data-stagger-delay="300">
            <div className="feature-icon">🌈</div>
            <h3>Neumorphism</h3>
            <p>Soft, extruded plastic look with subtle shadows</p>
            <button className="glass-button feature-button">Learn More</button>
          </div>
        </div>
      </section>

      {/* Interactive Elements Showcase */}
      <section className="interactive-section">
        <h2 className="section-title animate-on-scroll" data-animation-direction="right">
          🎯 Interactive Elements
        </h2>
        
        <div className="interactive-showcase">
          <div className="interactive-element showcase-item">
            <h3>Hover Effects</h3>
            <p>Experience smooth hover animations and microinteractions</p>
          </div>

          <div className="interactive-element showcase-item">
            <h3>Click Ripples</h3>
            <p>Material Design-inspired ripple effects on interaction</p>
          </div>

          <div className="interactive-element showcase-item">
            <h3>Scroll Animations</h3>
            <p>Elements animate as they come into view</p>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="metrics-section">
        <h2 className="section-title animate-on-scroll" data-animation-direction="up">
          📊 Performance & Accessibility
        </h2>
        
        <div className="metrics-grid">
          <div className="depth-card metric-card">
            <div className="metric-value">90+</div>
            <div className="metric-label">Lighthouse Score</div>
          </div>

          <div className="depth-card metric-card">
            <div className="metric-value">AA</div>
            <div className="metric-label">WCAG Compliance</div>
          </div>

          <div className="depth-card metric-card">
            <div className="metric-value">60fps</div>
            <div className="metric-label">Animation Performance</div>
          </div>

          <div className="depth-card metric-card">
            <div className="metric-value">25%+</div>
            <div className="metric-label">User Engagement</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section animate-on-scroll" data-animation-direction="up">
        <div className="glass-card cta-card">
          <h2>Ready to Transform Your UI?</h2>
          <p>Join the future of web design with our modern design system</p>
          <div className="cta-buttons">
            <button className="glass-button cta-button">Start Building</button>
            <button className="neu-button cta-button">View Documentation</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernUIDemo;
