'use client';

import React, { useState, useEffect } from 'react';

// 🏛️ Observation Lounge: Strategic Revenue Workflow Design
// The crew meets here to design n8n workflows that generate revenue
// Each workflow becomes a microservice that can be combined into startup solutions

interface CrewMember {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  avatar: string;
  status: 'active' | 'thinking' | 'speaking' | 'listening';
  currentThought: string;
  revenueIdeas: string[];
}

interface RevenueWorkflow {
  id: string;
  name: string;
  description: string;
  revenuePotential: number;
  complexity: 'low' | 'medium' | 'high';
  timeToMarket: string;
  targetMarket: string[];
  integrationPoints: string[];
  crewRecommendations: string[];
  status: 'proposed' | 'designed' | 'implemented' | 'revenue-generating';
}

const ObservationLounge: React.FC = () => {
  const [crew, setCrew] = useState<CrewMember[]>([
    {
      id: 'picard',
      name: 'Captain Jean-Luc Picard',
      role: 'Strategic Vision & Leadership',
      expertise: ['Strategic Planning', 'Risk Assessment', 'Mission Coordination'],
      avatar: '👨‍✈️',
      status: 'active',
      currentThought: 'We need to identify the highest-impact revenue opportunities that align with our mission.',
      revenueIdeas: [
        'AI-powered business intelligence dashboards',
        'Automated compliance monitoring systems',
        'Strategic planning workflow automation'
      ]
    },
    {
      id: 'riker',
      name: 'Commander William Riker',
      role: 'Operations & Execution',
      expertise: ['Tactical Operations', 'Team Leadership', 'Resource Management'],
      avatar: '🖖',
      status: 'thinking',
      currentThought: 'Each workflow must be operationally sound and scalable.',
      revenueIdeas: [
        'Project management automation suites',
        'Team collaboration workflow platforms',
        'Resource optimization systems'
      ]
    },
    {
      id: 'data',
      name: 'Lieutenant Commander Data',
      role: 'Technical Analysis & AI',
      expertise: ['AI/ML', 'Data Analysis', 'Pattern Recognition', 'Efficiency Optimization'],
      avatar: '🤖',
      status: 'speaking',
      currentThought: 'The mathematical probability of success increases with each integrated workflow.',
      revenueIdeas: [
        'Predictive analytics engines',
        'Machine learning workflow automation',
        'Data processing optimization tools',
        'AI-powered decision support systems'
      ]
    },
    {
      id: 'geordi',
      name: 'Lieutenant Commander Geordi La Forge',
      role: 'Engineering & Innovation',
      expertise: ['Systems Engineering', 'Innovation', 'Problem Solving', 'Technical Architecture'],
      avatar: '👁️',
      status: 'listening',
      currentThought: 'We need to ensure each workflow is technically robust and maintainable.',
      revenueIdeas: [
        'API integration platforms',
        'Workflow orchestration engines',
        'System monitoring and alerting',
        'Technical debt reduction tools'
      ]
    },
    {
      id: 'beverly',
      name: 'Dr. Beverly Crusher',
      role: 'User Experience & Human Factors',
      expertise: ['User Research', 'Experience Design', 'Human-Centered Design', 'Accessibility'],
      avatar: '👩‍⚕️',
      status: 'active',
      currentThought: 'Each workflow must provide genuine value to users and solve real problems.',
      revenueIdeas: [
        'User onboarding automation',
        'Customer success workflow platforms',
        'Accessibility compliance tools',
        'User feedback collection systems'
      ]
    }
  ]);

  const [revenueWorkflows, setRevenueWorkflows] = useState<RevenueWorkflow[]>([
    {
      id: 'resume-auditor',
      name: 'Resume Compliance Auditor',
      description: 'AI-powered resume analysis with compliance scoring and improvement recommendations',
      revenuePotential: 2500,
      complexity: 'medium',
      timeToMarket: '2-3 weeks',
      targetMarket: ['HR Professionals', 'Recruiters', 'Job Seekers', 'Career Coaches'],
      integrationPoints: ['ATS Systems', 'HR Platforms', 'Career Websites'],
      crewRecommendations: [
        'Data: "High accuracy potential with ML integration"',
        'Beverly: "Solves real pain point for recruiters"',
        'Geordi: "Can be extended to other document types"'
      ],
      status: 'implemented'
    },
    {
      id: 'business-intelligence',
      name: 'AI Business Intelligence Dashboard',
      description: 'Real-time business metrics and predictive analytics powered by n8n workflows',
      revenuePotential: 3500,
      complexity: 'high',
      timeToMarket: '4-6 weeks',
      targetMarket: ['Small Business Owners', 'Startups', 'Consultants', 'Analysts'],
      integrationPoints: ['CRM Systems', 'Accounting Software', 'Marketing Platforms'],
      crewRecommendations: [
        'Picard: "Strategic value for business decision-making"',
        'Data: "Can leverage existing AI capabilities"',
        'Riker: "High demand in current market"'
      ],
      status: 'proposed'
    },
    {
      id: 'compliance-monitor',
      name: 'Automated Compliance Monitoring',
      description: 'Real-time compliance tracking and automated reporting for regulatory requirements',
      revenuePotential: 4000,
      complexity: 'high',
      timeToMarket: '5-7 weeks',
      targetMarket: ['Financial Services', 'Healthcare', 'Legal Firms', 'Manufacturing'],
      integrationPoints: ['ERP Systems', 'Regulatory Databases', 'Reporting Platforms'],
      crewRecommendations: [
        'Picard: "Critical need in regulated industries"',
        'Geordi: "Can integrate with existing enterprise systems"',
        'Beverly: "Reduces human error and stress"'
      ],
      status: 'proposed'
    }
  ]);

  const [currentDiscussion, setCurrentDiscussion] = useState<string>('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<RevenueWorkflow | null>(null);
  const [discussionMode, setDiscussionMode] = useState<'brainstorming' | 'analysis' | 'planning'>('brainstorming');

  const addRevenueWorkflow = () => {
    const newWorkflow: RevenueWorkflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Revenue Workflow',
      description: 'Describe the revenue-generating potential...',
      revenuePotential: 0,
      complexity: 'medium',
      timeToMarket: 'TBD',
      targetMarket: [],
      integrationPoints: [],
      crewRecommendations: [],
      status: 'proposed'
    };
    setRevenueWorkflows([...revenueWorkflows, newWorkflow]);
  };

  const updateWorkflow = (id: string, updates: Partial<RevenueWorkflow>) => {
    setRevenueWorkflows(workflows => 
      workflows.map(w => w.id === id ? { ...w, ...updates } : w)
    );
  };

  const calculateTotalRevenue = () => {
    return revenueWorkflows.reduce((total, workflow) => total + workflow.revenuePotential, 0);
  };

  const getCrewStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00ff00';
      case 'thinking': return '#ffff00';
      case 'speaking': return '#ff9900';
      case 'listening': return '#9999ff';
      default: return '#666666';
    }
  };

  return (
    <div className="lcars-page">
      {/* Page Header */}
      <div className="lcars-page-header">
        <h1 className="lcars-page-title">🏛️ Observation Lounge</h1>
        <p className="lcars-page-subtitle">
          Strategic Revenue Workflow Design Session
        </p>
        <div className="lcars-mission-status">
          <h2>🎯 Mission: $10,000+ Revenue Through n8n Microservices</h2>
          <p>Current Revenue Potential: <strong>${calculateTotalRevenue().toLocaleString()}</strong></p>
        </div>
      </div>

      {/* Crew Assembly */}
      <div className="lcars-mission-panel">
        <h2>👥 Crew Assembly</h2>
        <p>The senior staff has gathered to design revenue-generating n8n workflows that can be combined into startup solutions.</p>
        
        <div className="crew-grid">
          {crew.map((member) => (
            <div key={member.id} className="crew-member-card">
              <div className="crew-avatar">{member.avatar}</div>
              <h3>{member.name}</h3>
              <p className="crew-role">{member.role}</p>
              <div className="crew-expertise">
                {member.expertise.map((skill, index) => (
                  <span key={index} className="expertise-tag">{skill}</span>
                ))}
              </div>
              <div className="crew-status" style={{ color: getCrewStatusColor(member.status) }}>
                Status: {member.status}
              </div>
              <div className="crew-thought">
                <strong>Current Thought:</strong> {member.currentThought}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Workflow Design */}
      <div className="lcars-architecture-panel">
        <h2>💰 Revenue Workflow Design</h2>
        <p>Each workflow represents a revenue vector that can be combined with others to create comprehensive startup solutions.</p>
        
        <div className="workflow-controls">
          <button className="lcars-button lcars-button-primary" onClick={addRevenueWorkflow}>
            🚀 Add New Revenue Workflow
          </button>
          <select 
            className="lcars-select"
            value={discussionMode}
            onChange={(e) => setDiscussionMode(e.target.value as any)}
          >
            <option value="brainstorming">🧠 Brainstorming Mode</option>
            <option value="analysis">📊 Analysis Mode</option>
            <option value="planning">📋 Planning Mode</option>
          </select>
        </div>

        <div className="workflows-grid">
          {revenueWorkflows.map((workflow) => (
            <div key={workflow.id} className="workflow-card">
              <div className="workflow-header">
                <h3>{workflow.name}</h3>
                <span className={`workflow-status workflow-status-${workflow.status}`}>
                  {workflow.status}
                </span>
              </div>
              
              <p className="workflow-description">{workflow.description}</p>
              
              <div className="workflow-metrics">
                <div className="metric">
                  <label>Revenue Potential:</label>
                  <span className="revenue-amount">${workflow.revenuePotential.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <label>Complexity:</label>
                  <span className={`complexity-${workflow.complexity}`}>{workflow.complexity}</span>
                </div>
                <div className="metric">
                  <label>Time to Market:</label>
                  <span>{workflow.timeToMarket}</span>
                </div>
              </div>

              <div className="workflow-details">
                <div className="target-market">
                  <h4>Target Market:</h4>
                  <div className="tags">
                    {workflow.targetMarket.map((market, index) => (
                      <span key={index} className="tag">{market}</span>
                    ))}
                  </div>
                </div>

                <div className="integration-points">
                  <h4>Integration Points:</h4>
                  <div className="tags">
                    {workflow.integrationPoints.map((point, index) => (
                      <span key={index} className="tag">{point}</span>
                    ))}
                  </div>
                </div>

                <div className="crew-recommendations">
                  <h4>Crew Recommendations:</h4>
                  <ul>
                    {workflow.crewRecommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="workflow-actions">
                <button 
                  className="lcars-button lcars-button-secondary"
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  📝 Edit Workflow
                </button>
                <button 
                  className="lcars-button lcars-button-primary"
                  onClick={() => updateWorkflow(workflow.id, { status: 'implemented' })}
                >
                  🚀 Implement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Discussion */}
      <div className="lcars-demo-panel">
        <h2>🗣️ Strategic Discussion</h2>
        <p>The crew discusses how to combine these workflows into comprehensive startup solutions.</p>
        
        <div className="discussion-area">
          <textarea
            className="lcars-textarea"
            value={currentDiscussion}
            onChange={(e) => setCurrentDiscussion(e.target.value)}
            placeholder="Add to the strategic discussion..."
            rows={4}
          />
          <button className="lcars-button lcars-button-primary">
            💬 Add to Discussion
          </button>
        </div>

        <div className="discussion-topics">
          <h3>Key Discussion Topics:</h3>
          <ul>
            <li>🎯 Which workflows have the highest revenue potential when combined?</li>
            <li>🔗 How can we create integration points between workflows?</li>
            <li>📈 What's the fastest path to $10,000 revenue?</li>
            <li>🚀 Which workflows can be implemented first?</li>
            <li>💡 What new workflows should we design?</li>
          </ul>
        </div>
      </div>

      {/* Revenue Combination Strategies */}
      <div className="lcars-technical-panel">
        <h2>🧩 Revenue Combination Strategies</h2>
        <p>Different ways to combine workflows into comprehensive startup solutions:</p>
        
        <div className="combination-strategies">
          <div className="strategy-card">
            <h3>🎯 Vertical Integration</h3>
            <p>Combine workflows that serve the same industry (e.g., Healthcare Compliance Suite)</p>
            <div className="strategy-example">
              <strong>Example:</strong> Compliance Monitor + Document Auditor + Reporting System
              <br />
              <strong>Revenue Potential:</strong> $8,000 - $12,000
            </div>
          </div>

          <div className="strategy-card">
            <h3>🔄 Workflow Orchestration</h3>
            <p>Create a master workflow that coordinates multiple microservices</p>
            <div className="strategy-example">
              <strong>Example:</strong> Business Intelligence + Compliance + Project Management
              <br />
              <strong>Revenue Potential:</strong> $6,000 - $10,000
            </div>
          </div>

          <div className="strategy-card">
            <h3>🚀 Platform-as-a-Service</h3>
            <p>Offer workflows as configurable services on a unified platform</p>
            <div className="strategy-example">
              <strong>Example:</strong> All workflows + Customization + Support
              <br />
              <strong>Revenue Potential:</strong> $10,000 - $20,000
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="lcars-cta-panel">
        <h2>🚀 Ready to Execute Revenue Strategy?</h2>
        <p>The crew has designed a comprehensive revenue generation strategy. Each workflow is a puzzle piece that can be combined into startup solutions.</p>
        
        <div className="next-steps">
          <h3>Immediate Next Steps:</h3>
          <ol>
            <li>🎯 Prioritize workflows by revenue potential and implementation speed</li>
            <li>🔧 Begin implementing the Resume Auditor workflow (already in progress)</li>
            <li>📊 Design the Business Intelligence Dashboard workflow</li>
            <li>🔗 Create integration points between workflows</li>
            <li>💰 Launch first revenue-generating microservice</li>
          </ol>
        </div>

        <div className="lcars-cta-actions">
          <button className="lcars-button lcars-button-primary">
            🚀 Start Implementation
          </button>
          <button className="lcars-button lcars-button-secondary">
            📋 View Detailed Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObservationLounge; 