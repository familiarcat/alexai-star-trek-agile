/**
 * 🛡️ Performance Monitor - Lieutenant Worf's Security & Performance Framework
 * Comprehensive performance monitoring for the modern UI transformation
 * Tracks Core Web Vitals, animation performance, and accessibility metrics
 */

export interface PerformanceMetrics {
  timestamp: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  animationFPS: number;
  memoryUsage: number;
  bundleSize: number;
  accessibilityScore: number;
}

export interface PerformanceThresholds {
  fcp: { good: number; needsImprovement: number; poor: number };
  lcp: { good: number; needsImprovement: number; poor: number };
  fid: { good: number; needsImprovement: number; poor: number };
  cls: { good: number; needsImprovement: number; poor: number };
  animationFPS: { good: number; needsImprovement: number; poor: number };
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private thresholds: PerformanceThresholds;
  private observers: Map<string, PerformanceObserver> = new Map();
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private isMonitoring: boolean = false;

  constructor() {
    this.thresholds = {
      fcp: { good: 1800, needsImprovement: 3000, poor: 3000 },
      lcp: { good: 2500, needsImprovement: 4000, poor: 4000 },
      fid: { good: 100, needsImprovement: 300, poor: 300 },
      cls: { good: 0.1, needsImprovement: 0.25, poor: 0.25 },
      animationFPS: { good: 60, needsImprovement: 30, poor: 30 }
    };
  }

  /**
   * 🚀 Start comprehensive performance monitoring
   */
  public startMonitoring(): void {
    if (this.isMonitoring) return;
    
    console.log('🛡️ Lieutenant Worf: Performance monitoring initiated');
    this.isMonitoring = true;
    
    this.observeCoreWebVitals();
    this.observeLayoutShifts();
    this.startAnimationMonitoring();
    this.startMemoryMonitoring();
    this.measureBundleSize();
    this.assessAccessibility();
  }

  /**
   * 📊 Monitor Core Web Vitals using Performance Observer
   */
  private observeCoreWebVitals(): void {
    if (!('PerformanceObserver' in window)) return;

    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.recordMetric('fcp', fcpEntry.startTime);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.set('fcp', fcpObserver);
    } catch (error) {
      console.warn('FCP monitoring not supported:', error);
    }

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        if (lcpEntry) {
          this.recordMetric('lcp', lcpEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    } catch (error) {
      console.warn('LCP monitoring not supported:', error);
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric('fid', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    } catch (error) {
      console.warn('FID monitoring not supported:', error);
    }
  }

  /**
   * 📐 Monitor Cumulative Layout Shift
   */
  private observeLayoutShifts(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        
        this.recordMetric('cls', clsValue);
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    } catch (error) {
      console.warn('CLS monitoring not supported:', error);
    }
  }

  /**
   * 🎬 Monitor animation performance and FPS
   */
  private startAnimationMonitoring(): void {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = () => {
      const currentTime = performance.now();
      frames++;
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.recordMetric('animationFPS', fps);
        frames = 0;
        lastTime = currentTime;
      }
      
      this.animationFrameId = requestAnimationFrame(measureFPS);
    };
    
    this.animationFrameId = requestAnimationFrame(measureFPS);
  }

  /**
   * 💾 Monitor memory usage
   */
  private startMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric('memoryUsage', memory.usedJSHeapSize / 1024 / 1024); // MB
      }, 5000);
    }
  }

  /**
   * 📦 Measure bundle size and performance
   */
  private measureBundleSize(): void {
    // Measure initial load time
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.recordMetric('ttfb', navigationEntry.responseStart - navigationEntry.requestStart);
      
      // Estimate bundle size based on transfer size
      const transferSize = navigationEntry.transferSize;
      if (transferSize > 0) {
        this.recordMetric('bundleSize', transferSize / 1024); // KB
      }
    }
  }

  /**
   * ♿ Assess accessibility score
   */
  private assessAccessibility(): void {
    // Basic accessibility checks
    let score = 100;
    
    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) score -= 20;
    
    // Check for alt text on images
    const images = document.querySelectorAll('img');
    const imagesWithAlt = Array.from(images).filter(img => img.hasAttribute('alt'));
    if (images.length > 0 && imagesWithAlt.length < images.length) {
      score -= Math.round((images.length - imagesWithAlt.length) / images.length * 20);
    }
    
    // Check for proper contrast (basic check)
    const hasHighContrast = document.documentElement.style.getPropertyValue('--text-primary') === '#000000';
    if (!hasHighContrast) score -= 10;
    
    this.recordMetric('accessibilityScore', Math.max(0, score));
  }

  /**
   * 📝 Record a performance metric
   */
  private recordMetric(key: keyof PerformanceMetrics, value: number): void {
    const metric: Partial<PerformanceMetrics> = {
      timestamp: Date.now(),
      [key]: value
    };
    
    // Find existing metric entry or create new one
    const existingIndex = this.metrics.findIndex(m => 
      m.timestamp > Date.now() - 60000 // Within last minute
    );
    
    if (existingIndex >= 0) {
      this.metrics[existingIndex] = { ...this.metrics[existingIndex], ...metric };
    } else {
      this.metrics.push(metric as PerformanceMetrics);
    }
    
    // Keep only last 100 entries
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
    
    // Log significant performance issues
    this.checkPerformanceThresholds(key, value);
  }

  /**
   * ⚠️ Check performance against thresholds
   */
  private checkPerformanceThresholds(key: keyof PerformanceMetrics, value: number): void {
    const threshold = this.thresholds[key];
    if (!threshold) return;
    
    let status: 'good' | 'needsImprovement' | 'poor' = 'good';
    
    if (value > threshold.poor) {
      status = 'poor';
    } else if (value > threshold.needsImprovement) {
      status = 'needsImprovement';
    }
    
    if (status !== 'good') {
      console.warn(`🛡️ Lieutenant Worf: ${key.toUpperCase()} performance issue detected:`, {
        value,
        threshold: threshold[status],
        status,
        recommendation: this.getPerformanceRecommendation(key, value)
      });
    }
  }

  /**
   * 💡 Get performance improvement recommendations
   */
  private getPerformanceRecommendation(key: keyof PerformanceMetrics, value: number): string {
    const recommendations: Record<keyof PerformanceMetrics, string[]> = {
      fcp: [
        'Optimize critical rendering path',
        'Reduce server response time',
        'Minimize render-blocking resources'
      ],
      lcp: [
        'Optimize image loading',
        'Implement lazy loading',
        'Use next-gen image formats'
      ],
      fid: [
        'Reduce JavaScript execution time',
        'Implement code splitting',
        'Optimize event handlers'
      ],
      cls: [
        'Set explicit dimensions for images',
        'Avoid inserting content above existing content',
        'Use transform animations instead of layout changes'
      ],
      animationFPS: [
        'Use transform3d for hardware acceleration',
        'Reduce animation complexity',
        'Implement frame rate limiting'
      ],
      memoryUsage: [
        'Implement memory leak detection',
        'Optimize object creation/destruction',
        'Use object pooling for frequent operations'
      ],
      bundleSize: [
        'Implement code splitting',
        'Use tree shaking',
        'Optimize dependencies'
      ],
      accessibilityScore: [
        'Improve heading hierarchy',
        'Add alt text to images',
        'Enhance color contrast'
      ],
      ttfb: [
        'Optimize server response time',
        'Use CDN for static assets',
        'Implement caching strategies'
      ]
    };
    
    return recommendations[key]?.join(', ') || 'Review and optimize';
  }

  /**
   * 📊 Get current performance metrics
   */
  public getCurrentMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null;
    return this.metrics[this.metrics.length - 1];
  }

  /**
   * 📈 Get performance trends
   */
  public getPerformanceTrends(): Record<string, { trend: 'improving' | 'stable' | 'declining'; change: number }> {
    if (this.metrics.length < 2) return {};
    
    const trends: Record<string, { trend: 'improving' | 'stable' | 'declining'; change: number }> = {};
    const recent = this.metrics.slice(-5);
    const older = this.metrics.slice(-10, -5);
    
    Object.keys(this.thresholds).forEach(key => {
      const recentAvg = this.calculateAverage(recent, key as keyof PerformanceMetrics);
      const olderAvg = this.calculateAverage(older, key as keyof PerformanceMetrics);
      
      if (recentAvg && olderAvg) {
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;
        let trend: 'improving' | 'stable' | 'declining' = 'stable';
        
        if (change < -5) trend = 'improving';
        else if (change > 5) trend = 'declining';
        
        trends[key] = { trend, change: Math.abs(change) };
      }
    });
    
    return trends;
  }

  /**
   * 🧮 Calculate average for a metric
   */
  private calculateAverage(metrics: PerformanceMetrics[], key: keyof PerformanceMetrics): number | null {
    const values = metrics
      .map(m => m[key])
      .filter(v => typeof v === 'number' && !isNaN(v)) as number[];
    
    if (values.length === 0) return null;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * 📋 Generate performance report
   */
  public generateReport(): string {
    const current = this.getCurrentMetrics();
    const trends = this.getPerformanceTrends();
    
    if (!current) return 'No performance data available';
    
    let report = '🛡️ Lieutenant Worf: Performance Report\n';
    report += '=====================================\n\n';
    
    // Core Web Vitals
    report += '📊 Core Web Vitals:\n';
    report += `  FCP: ${current.fcp?.toFixed(0)}ms ${this.getStatusIndicator('fcp', current.fcp)}\n`;
    report += `  LCP: ${current.lcp?.toFixed(0)}ms ${this.getStatusIndicator('lcp', current.lcp)}\n`;
    report += `  FID: ${current.fid?.toFixed(0)}ms ${this.getStatusIndicator('fid', current.fid)}\n`;
    report += `  CLS: ${current.cls?.toFixed(3)} ${this.getStatusIndicator('cls', current.cls)}\n\n`;
    
    // Performance metrics
    report += '🚀 Performance Metrics:\n';
    report += `  Animation FPS: ${current.animationFPS?.toFixed(0)} ${this.getStatusIndicator('animationFPS', current.animationFPS)}\n`;
    report += `  Memory Usage: ${current.memoryUsage?.toFixed(1)}MB\n`;
    report += `  Bundle Size: ${current.bundleSize?.toFixed(1)}KB\n`;
    report += `  TTFB: ${current.ttfb?.toFixed(0)}ms\n`;
    report += `  Accessibility Score: ${current.accessibilityScore}/100\n\n`;
    
    // Trends
    report += '📈 Performance Trends:\n';
    Object.entries(trends).forEach(([key, data]) => {
      const emoji = data.trend === 'improving' ? '📈' : data.trend === 'declining' ? '📉' : '➡️';
      report += `  ${key.toUpperCase()}: ${emoji} ${data.trend} (${data.change.toFixed(1)}%)\n`;
    });
    
    return report;
  }

  /**
   * 🎯 Get status indicator for metrics
   */
  private getStatusIndicator(key: keyof PerformanceMetrics, value: number): string {
    const threshold = this.thresholds[key];
    if (!threshold || value === undefined) return '';
    
    if (value <= threshold.good) return '✅';
    if (value <= threshold.needsImprovement) return '⚠️';
    return '❌';
  }

  /**
   * 🛑 Stop performance monitoring
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    console.log('🛡️ Lieutenant Worf: Performance monitoring stopped');
  }

  /**
   * 🧹 Clean up and destroy
   */
  public destroy(): void {
    this.stopMonitoring();
    this.metrics = [];
  }
}

// Export for module usage
export default PerformanceMonitor;
