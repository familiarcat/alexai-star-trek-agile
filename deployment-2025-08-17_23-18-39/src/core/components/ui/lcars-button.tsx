'use client';

import { ReactNode } from 'react';
import { cn } from '@/core/utils';

interface LCARSButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function LCARSButton({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  onClick,
  disabled = false 
}: LCARSButtonProps) {
  return (
    <button
      className={cn(
        'lcars-button',
        variant === 'secondary' && 'lcars-button-secondary',
        size === 'sm' && 'lcars-button-sm',
        size === 'lg' && 'lcars-button-lg',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
} 