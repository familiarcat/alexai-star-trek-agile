'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ScalingContextType {
  scaleFactor: number;
  viewportWidth: number;
  viewportHeight: number;
  aspectRatio: number;
  devicePixelRatio: number;
  updateScaling: () => void;
}

const ScalingContext = createContext<ScalingContextType | null>(null);

export function useDynamicScaling() {
  const context = useContext(ScalingContext);
  if (!context) {
    throw new Error('useDynamicScaling must be used within a DynamicScalingProvider');
  }
  return context;
}

interface DynamicScalingProviderProps {
  children: ReactNode;
}

export function DynamicScalingProvider({ children }: DynamicScalingProviderProps) {
  const [scaleFactor, setScaleFactor] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(16/9);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);

  const calculateScaleFactor = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    
    setViewportWidth(width);
    setViewportHeight(height);
    setDevicePixelRatio(dpr);
    setAspectRatio(width / height);

    // Base scaling calculation
    let baseScale = 1;
    
    // Width-based scaling
    if (width < 480) baseScale = 0.75;
    else if (width < 768) baseScale = 0.875;
    else if (width < 1024) baseScale = 1;
    else if (width < 1440) baseScale = 1.125;
    else if (width < 1920) baseScale = 1.25;
    else if (width < 2560) baseScale = 1.5;
    else baseScale = 2;

    // Height-based scaling adjustment
    let heightScale = 1;
    if (height < 600) heightScale = 0.8;
    else if (height < 800) heightScale = 0.9;
    else if (height < 1080) heightScale = 1;
    else heightScale = 1.1;

    // Aspect ratio adjustments
    let aspectScale = 1;
    if (width / height > 21/9) aspectScale = 1.2; // Ultra-wide
    else if (width / height < 4/3) aspectScale = 0.9; // Portrait

    // DPI adjustments
    let dpiScale = 1;
    if (dpr >= 2) dpiScale = 1.1;
    if (dpr >= 3) dpiScale = 1.2;

    // Calculate final scale factor
    const finalScale = baseScale * heightScale * aspectScale * dpiScale;
    
    // Apply limits
    const limitedScale = Math.max(0.5, Math.min(2.5, finalScale));
    
    setScaleFactor(limitedScale);
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--lcars-scale-factor', limitedScale.toString());
    document.documentElement.style.setProperty('--lcars-viewport-width', `${width}px`);
    document.documentElement.style.setProperty('--lcars-viewport-height', `${height}px`);
    document.documentElement.style.setProperty('--lcars-aspect-ratio', (width / height).toString());
  };

  const updateScaling = () => {
    calculateScaleFactor();
  };

  useEffect(() => {
    // Initial calculation
    calculateScaleFactor();

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateScaleFactor, 100);
    };

    // Orientation change handler
    const handleOrientationChange = () => {
      setTimeout(calculateScaleFactor, 100);
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Media query change handlers
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(pointer: coarse)')
    ];

    mediaQueries.forEach(mq => {
      mq.addEventListener('change', calculateScaleFactor);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      mediaQueries.forEach(mq => {
        mq.removeEventListener('change', calculateScaleFactor);
      });
      clearTimeout(resizeTimeout);
    };
  }, []);

  const contextValue: ScalingContextType = {
    scaleFactor,
    viewportWidth,
    viewportHeight,
    aspectRatio,
    devicePixelRatio,
    updateScaling
  };

  return (
    <ScalingContext.Provider value={contextValue}>
      {children}
    </ScalingContext.Provider>
  );
}
