'use client';

import React from 'react';
import ShipsComputerLCARSOrchestrator from '@/components/lcars/ships-computer-lcars-orchestrator';
import './ships-computer.css';

export default function ShipsComputerPage() {
  return (
    <div className="ships-computer-page">
      <div className="page-header">
        <h1>🖖 Ship's Computer - LCARS Orchestrator</h1>
        <p>Unified Intelligence Integration & Dynamic Layout Management</p>
      </div>
      
      <div className="page-description">
        <div className="description-card">
          <h2>🚀 Mission Overview</h2>
          <p>
            The Ship's Computer agent orchestrates dynamic LCARS layouts based on mission context, 
            agent learning, and collective intelligence. This unified system integrates Next.js UI, 
            n8n agents, CursorAI, and Supabase collective memory for maximum operational efficiency.
          </p>
        </div>
        
        <div className="description-card">
          <h2>🎯 Key Capabilities</h2>
          <ul>
            <li><strong>Dynamic LCARS Layouts:</strong> Adaptive UI based on mission context and priority</li>
            <li><strong>Agent Coordination:</strong> Multi-agent learning synchronization and collaboration</li>
            <li><strong>Collective Memory:</strong> Shared knowledge base with success/failure pattern learning</li>
            <li><strong>CursorAI Integration:</strong> Enhanced development with AI-powered code generation</li>
            <li><strong>Real-time Adaptation:</strong> Continuous UI optimization based on performance metrics</li>
          </ul>
        </div>
        
        <div className="description-card">
          <h2>🔄 Integration Components</h2>
          <div className="integration-grid">
            <div className="integration-item">
              <h3>Next.js UI</h3>
              <p>Dynamic, responsive interface with LCARS design system</p>
            </div>
            <div className="integration-item">
              <h3>n8n Agents</h3>
              <p>Coordinated AI agents with collective learning capabilities</p>
            </div>
            <div className="integration-item">
              <h3>CursorAI</h3>
              <p>Enhanced development with pattern recognition and optimization</p>
            </div>
            <div className="integration-item">
              <h3>Supabase Memory</h3>
              <p>Persistent collective knowledge and learning patterns</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ship's Computer LCARS Orchestrator Component */}
      <div className="orchestrator-container">
        <ShipsComputerLCARSOrchestrator />
      </div>
      
      <div className="page-footer">
        <div className="footer-card">
          <h3>🖖 Live Long and Prosper</h3>
          <p>
            The Ship's Computer is now operational with unified intelligence capabilities. 
            Dynamic LCARS layouts, agent coordination, and collective learning are all 
            synchronized for maximum operational efficiency.
          </p>
        </div>
      </div>
    </div>
  );
}
