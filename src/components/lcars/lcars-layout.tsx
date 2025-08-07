'use client';

import { ReactNode } from 'react';
import { LCARSSidebar } from './lcars-sidebar';
import { cn } from '@/lib/utils';

interface LCARSLayoutProps {
  children: ReactNode;
  className?: string;
}

export function LCARSLayout({ children, className = '' }: LCARSLayoutProps) {
  return (
    <div className={cn('lcars-container', className)}>
      <LCARSSidebar />
      <main className="lcars-main">
        {children}
      </main>
    </div>
  );
} 