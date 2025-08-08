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
      <div id="column-1" className="lcars-sidebar">
        <LCARSSidebar />
      </div>
      <div id="column-2">
        {/* Middle section - can be used for additional navigation or status */}
      </div>
      <div id="column-3" className="lcars-main">
        <div className="wrap wrap-standard">
          {children}
        </div>
      </div>
    </div>
  );
} 