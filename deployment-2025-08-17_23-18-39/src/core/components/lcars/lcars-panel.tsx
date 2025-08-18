import { ReactNode } from 'react';
import { cn } from '@/core/utils';

interface LCARSPanelProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
  children: ReactNode;
}

export function LCARSPanel({ 
  variant = 'primary', 
  className = '', 
  children 
}: LCARSPanelProps) {
  return (
    <div className={cn(
      'lcars-panel',
      variant === 'primary' && 'lcars-panel-primary',
      variant === 'secondary' && 'lcars-panel-secondary',
      className
    )}>
      {children}
    </div>
  );
} 