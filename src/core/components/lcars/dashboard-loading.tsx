'use client';

import React from 'react';
import { CpuChipIcon } from '@heroicons/react/24/outline';

interface DashboardLoadingProps {
  message?: string;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ 
  message = "Initializing AlexAI Star Trek System..." 
}) => {
  return (
    <div className="lcars-loading-state">
      <div className="lcars-loading-content">
        <div className="lcars-loading-spinner">
          <CpuChipIcon className="lcars-spinner-icon" />
        </div>
        <div className="lcars-loading-text">
          <h2 className="lcars-loading-title">System Initialization</h2>
          <p className="lcars-loading-message">{message}</p>
          <div className="lcars-loading-progress">
            <div className="lcars-progress-bar">
              <div className="lcars-progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
