'use client';

import React from 'react';
import { useDynamicScaling } from './dynamic-scaling-provider';

export function ScalingIndicator() {
  const { scaleFactor, viewportWidth, viewportHeight, aspectRatio, devicePixelRatio } = useDynamicScaling();

  return (
    <div className="scaling-indicator">
      <div className="scaling-info">
        <div className="scaling-factor">
          <span className="label">SCALE:</span>
          <span className="value">{scaleFactor.toFixed(2)}x</span>
        </div>
        <div className="viewport-info">
          <span className="label">VIEWPORT:</span>
          <span className="value">{viewportWidth} × {viewportHeight}</span>
        </div>
        <div className="aspect-ratio">
          <span className="label">ASPECT:</span>
          <span className="value">{aspectRatio.toFixed(2)}:1</span>
        </div>
        <div className="dpi-info">
          <span className="label">DPI:</span>
          <span className="value">{devicePixelRatio.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
}
