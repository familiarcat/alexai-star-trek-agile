import React from 'react';
import { clsx } from 'clsx';

interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

export function Progress({ value = 0, max = 100, className }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={clsx('w-full bg-secondary rounded-full h-2', className)}>
      <div 
        className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
