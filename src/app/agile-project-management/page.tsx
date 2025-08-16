import React from 'react';
import AgileProjectManagement from '@/components/agile/AgileProjectManagement';

// 🚀 Agile Project Management - Ship Operations Center
// This page represents Data as Ship Operations Lead managing multiple n8n workflow "ship functions"

export default function AgileProjectManagementPage() {
  return (
    <div className="lcars-page">
      {/* Page Header */}
      <div className="lcars-page-header">
        <h1 className="lcars-page-title">🖖 Project Operations Center - Agile Project Management</h1>
        <p className="lcars-page-subtitle">
          Technical Lead - Project Operations Manager
        </p>
        <div className="lcars-mission-status">
          <h2>🎯 Mission: Manage Multiple Project Functions (n8n Workflows) for Optimal Performance</h2>
          <p>Coordinating YouTube-extracted projects as specialized project systems</p>
        </div>
      </div>

      {/* Project Operations Dashboard */}
      <div className="ship-operations-dashboard">
        <div className="operations-header">
          <h3>🚀 Project Systems Status</h3>
          <p>All systems operational - Technical Lead monitoring 8 active project functions</p>
        </div>
        
        <div className="ship-systems-grid">
          <div className="ship-system-card operational">
            <h4>🛰️ YouTube Extraction System</h4>
            <p>Status: Operational</p>
            <p>Efficiency: 98.7%</p>
          </div>
          <div className="ship-system-card operational">
            <h4>🤖 AI Automation Core</h4>
            <p>Status: Operational</p>
            <p>Efficiency: 97.3%</p>
          </div>
          <div className="ship-system-card operational">
            <h4>📊 Business Intelligence</h4>
            <p>Status: Operational</p>
            <p>Efficiency: 96.8%</p>
          </div>
          <div className="ship-system-card operational">
            <h4>💼 Project Generation</h4>
            <p>Status: Operational</p>
            <p>Efficiency: 95.9%</p>
          </div>
        </div>
      </div>

      {/* Agile Project Management Component */}
      <AgileProjectManagement />
    </div>
  );
}
