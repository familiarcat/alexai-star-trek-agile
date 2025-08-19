/**
 * 🚀 Scroll Animations Utility - 2025 Design Trends
 * Implements scroll-triggered animations and microinteractions
 * for modern, engaging user experiences
 */

export class ScrollAnimations {
  private observer: IntersectionObserver;
  private animatedElements: Set<HTMLElement> = new Set();

  constructor() {
    this.initializeIntersectionObserver();
  }

  /**
   * Initialize the Intersection Observer for scroll-triggered animations
   */
  private initializeIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target as HTMLElement);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  /**
   * Animate an element with the appropriate animation class
   */
  private animateElement(element: HTMLElement): void {
    if (this.animatedElements.has(element)) return;

    // Add base animation class
    element.classList.add('animate');
    
    // Add directional animation if specified
    const direction = element.dataset.animationDirection;
    if (direction) {
      element.classList.add(`animate-${direction}`);
    }

    // Add stagger delay for multiple elements
    const staggerDelay = element.dataset.staggerDelay;
    if (staggerDelay) {
      element.style.transitionDelay = `${staggerDelay}ms`;
    }

    this.animatedElements.add(element);
  }

  /**
   * Observe elements for scroll animations
   */
  public observeElements(selector: string = '.animate-on-scroll'): void {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach((element) => {
      this.observer.observe(element);
    });
  }

  /**
   * Observe a specific element
   */
  public observeElement(element: HTMLElement): void {
    this.observer.observe(element);
  }

  /**
   * Stop observing an element
   */
  public unobserveElement(element: HTMLElement): void {
    this.observer.unobserve(element);
    this.animatedElements.delete(element);
  }

  /**
   * Reset all animations
   */
  public resetAnimations(): void {
    this.animatedElements.forEach((element) => {
      element.classList.remove('animate', 'animate-left', 'animate-right', 'animate-up', 'animate-down');
      element.style.transitionDelay = '';
    });
    this.animatedElements.clear();
  }

  /**
   * Add stagger animation to a group of elements
   */
  public addStaggerAnimation(elements: HTMLElement[], delay: number = 100): void {
    elements.forEach((element, index) => {
      element.dataset.staggerDelay = (index * delay).toString();
      this.observeElement(element);
    });
  }

  /**
   * Destroy the observer and clean up
   */
  public destroy(): void {
    this.observer.disconnect();
    this.animatedElements.clear();
  }
}

/**
 * 🌟 Microinteractions Utility
 * Implements modern microinteractions for enhanced UX
 */
export class Microinteractions {
  private activeElements: Set<HTMLElement> = new Set();

  /**
   * Add ripple effect to clickable elements
   */
  public addRippleEffect(element: HTMLElement): void {
    element.addEventListener('click', (event) => {
      this.createRipple(event, element);
    });
  }

  /**
   * Create a ripple effect on click
   */
  private createRipple(event: MouseEvent, element: HTMLElement): void {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Add hover lift effect
   */
  public addHoverLift(element: HTMLElement, liftAmount: number = 4): void {
    element.addEventListener('mouseenter', () => {
      element.style.transform = `translateY(-${liftAmount}px)`;
      element.style.boxShadow = 'var(--depth-3), var(--glow-primary)';
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translateY(0)';
      element.style.boxShadow = 'var(--depth-1)';
    });
  }

  /**
   * Add typing animation to text elements
   */
  public addTypingAnimation(element: HTMLElement, speed: number = 50): void {
    const text = element.textContent || '';
    element.textContent = '';
    element.style.borderRight = '2px solid var(--text-primary)';
    element.style.animation = 'blink 1s infinite';

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        element.style.borderRight = 'none';
        element.style.animation = 'none';
      }
    };

    typeWriter();
  }

  /**
   * Add parallax effect to elements
   */
  public addParallaxEffect(element: HTMLElement, speed: number = 0.5): void {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      element.style.transform = `translateY(${rate}px)`;
    });
  }

  /**
   * Clean up all microinteractions
   */
  public destroy(): void {
    this.activeElements.forEach((element) => {
      element.style.transform = '';
      element.style.boxShadow = '';
      element.style.borderRight = '';
      element.style.animation = '';
    });
    this.activeElements.clear();
  }
}

/**
 * 🎨 Modern Design System Initializer
 * Combines scroll animations and microinteractions
 */
export class ModernDesignSystem {
  private scrollAnimations: ScrollAnimations;
  private microinteractions: Microinteractions;

  constructor() {
    this.scrollAnimations = new ScrollAnimations();
    this.microinteractions = new Microinteractions();
    this.initialize();
  }

  /**
   * Initialize the modern design system
   */
  private initialize(): void {
    // Add CSS animations
    this.addCSSAnimations();
    
    // Initialize scroll animations
    this.scrollAnimations.observeElements();
    
    // Add microinteractions to interactive elements
    this.addMicrointeractions();
  }

  /**
   * Add CSS keyframe animations
   */
  private addCSSAnimations(): void {
    if (document.getElementById('modern-design-animations')) return;

    const style = document.createElement('style');
    style.id = 'modern-design-animations';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: var(--text-primary); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .float-animation {
        animation: float 3s ease-in-out infinite;
      }
      
      .pulse-animation {
        animation: pulse 2s ease-in-out infinite;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Add microinteractions to interactive elements
   */
  private addMicrointeractions(): void {
    // Add ripple effects to buttons
    const buttons = document.querySelectorAll<HTMLElement>('.glass-button, .neu-button, .interactive-element');
    buttons.forEach((button) => {
      this.microinteractions.addRippleEffect(button);
      this.microinteractions.addHoverLift(button);
    });

    // Add typing animation to headings
    const headings = document.querySelectorAll<HTMLElement>('h1, h2, h3');
    headings.forEach((heading, index) => {
      if (index < 2) { // Only animate first two headings
        this.microinteractions.addTypingAnimation(heading, 100 + index * 50);
      }
    });
  }

  /**
   * Get the scroll animations instance
   */
  public getScrollAnimations(): ScrollAnimations {
    return this.scrollAnimations;
  }

  /**
   * Get the microinteractions instance
   */
  public getMicrointeractions(): Microinteractions {
    return this.microinteractions;
  }

  /**
   * Destroy the design system
   */
  public destroy(): void {
    this.scrollAnimations.destroy();
    this.microinteractions.destroy();
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.modernDesignSystem = new ModernDesignSystem();
  });
}

// Export for module usage
export default ModernDesignSystem;
