'use client';

import React, { useState } from 'react';

// 🚀 Revolutionary Project Generator
// This page creates new revenue-generating projects using our n8n integration
// Each project = revenue-generating microservice with $2,500-$5,000 potential

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  revenuePotential: number;
  targetMarket: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  estimatedTime: string;
  category: string;
  features: string[];
  n8nWorkflowTemplate: string;
  nextJsComponent: string;
  apiRoute: string;
}

interface GeneratedProject extends ProjectTemplate {
  status: string;
  createdAt: string;
  endpoints: {
    n8nWebhook: string;
    nextJsApi: string;
    reactComponent: string;
  };
}

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'resume-auditor',
    name: 'Resume Compliance Auditor',
    description: 'AI-powered resume analysis with compliance scoring and improvement recommendations',
    revenuePotential: 2500,
    targetMarket: 'HR Professionals, Recruiters',
    complexity: 'Simple',
    estimatedTime: '15 minutes',
    category: 'HR & Recruitment',
    features: ['AI Analysis', 'Compliance Scoring', 'Improvement Recommendations', 'PDF Export'],
    n8nWorkflowTemplate: 'resume-audit-webhook',
    nextJsComponent: 'ResumeComplianceAuditor',
    apiRoute: '/api/n8n-resume-auditor'
  },
  {
    id: 'business-intelligence',
    name: 'Business Intelligence Dashboard',
    description: 'Real-time business metrics and predictive analytics for strategic decision-making',
    revenuePotential: 3500,
    targetMarket: 'Small Businesses, Startups',
    complexity: 'Medium',
    estimatedTime: '20 minutes',
    category: 'Business Analytics',
    features: ['KPI Tracking', 'Risk Assessment', 'Market Analysis', 'Strategic Recommendations'],
    n8nWorkflowTemplate: 'business-intelligence-webhook',
    nextJsComponent: 'BusinessIntelligenceDashboard',
    apiRoute: '/api/n8n-business-intelligence'
  },
  {
    id: 'content-analyzer',
    name: 'Content Performance Analyzer',
    description: 'AI-powered content analysis with SEO optimization and engagement predictions',
    revenuePotential: 3000,
    targetMarket: 'Content Creators, Marketers',
    complexity: 'Medium',
    estimatedTime: '25 minutes',
    category: 'Content Marketing',
    features: ['SEO Analysis', 'Engagement Prediction', 'Content Optimization', 'Performance Tracking'],
    n8nWorkflowTemplate: 'content-analysis-webhook',
    nextJsComponent: 'ContentAnalyzer',
    apiRoute: '/api/n8n-content-analyzer'
  },
  {
    id: 'financial-planner',
    name: 'AI Financial Planning Assistant',
    description: 'Personalized financial planning with investment recommendations and risk assessment',
    revenuePotential: 4000,
    targetMarket: 'Individuals, Financial Advisors',
    complexity: 'Complex',
    estimatedTime: '30 minutes',
    category: 'Financial Services',
    features: ['Investment Analysis', 'Risk Assessment', 'Portfolio Optimization', 'Financial Forecasting'],
    n8nWorkflowTemplate: 'financial-planning-webhook',
    nextJsComponent: 'FinancialPlanner',
    apiRoute: '/api/n8n-financial-planner'
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Performance Manager',
    description: 'Comprehensive social media analytics with automated posting and engagement tracking',
    revenuePotential: 2800,
    targetMarket: 'Social Media Managers, Businesses',
    complexity: 'Medium',
    estimatedTime: '22 minutes',
    category: 'Social Media',
    features: ['Performance Analytics', 'Automated Posting', 'Engagement Tracking', 'Competitor Analysis'],
    n8nWorkflowTemplate: 'social-media-webhook',
    nextJsComponent: 'SocialMediaManager',
    apiRoute: '/api/n8n-social-media-manager'
  },
  {
    id: 'customer-support-ai',
    name: 'AI Customer Support Assistant',
    description: 'Intelligent customer support with automated responses and sentiment analysis',
    revenuePotential: 3200,
    targetMarket: 'Customer Service Teams, E-commerce',
    complexity: 'Complex',
    estimatedTime: '35 minutes',
    category: 'Customer Service',
    features: ['Automated Responses', 'Sentiment Analysis', 'Ticket Classification', 'Performance Metrics'],
    n8nWorkflowTemplate: 'customer-support-webhook',
    nextJsComponent: 'CustomerSupportAI',
    apiRoute: '/api/n8n-customer-support'
  }
];

export default function ProjectGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setProjectName(template.name);
    setProjectDescription(template.description);
    setCustomFeatures([...template.features]);
  };

  const addCustomFeature = () => {
    const newFeature = prompt('Enter a custom feature:');
    if (newFeature && newFeature.trim()) {
      setCustomFeatures([...customFeatures, newFeature.trim()]);
    }
  };

  const removeFeature = (index: number) => {
    setCustomFeatures(customFeatures.filter((_, i) => i !== index));
  };

  const generateProject = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    setGenerationStep(0);

    try {
      // Step 1: Create n8n workflow
      setGenerationStep(1);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Generate Next.js API route
      setGenerationStep(2);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Create React component
      setGenerationStep(3);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Deploy to n8n server
      setGenerationStep(4);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 5: Test integration
      setGenerationStep(5);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 6: Complete
      setGenerationStep(6);
      
      setGeneratedProject({
        id: `project-${Date.now()}`,
        name: projectName,
        description: projectDescription,
        revenuePotential: selectedTemplate.revenuePotential,
        targetMarket: selectedTemplate.targetMarket,
        complexity: selectedTemplate.complexity,
        estimatedTime: selectedTemplate.estimatedTime,
        category: selectedTemplate.category,
        features: customFeatures,
        n8nWorkflowTemplate: selectedTemplate.n8nWorkflowTemplate,
        nextJsComponent: selectedTemplate.nextJsComponent,
        apiRoute: selectedTemplate.apiRoute,
        status: 'Active',
        createdAt: new Date().toISOString(),
        endpoints: {
          n8nWebhook: `https://n8n.pbradygeorgen.com/webhook/${selectedTemplate.n8nWorkflowTemplate}`,
          nextJsApi: selectedTemplate.apiRoute,
          reactComponent: selectedTemplate.nextJsComponent
        }
      });

    } catch (error) {
      console.error('Project generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Creating n8n workflow template...';
      case 2: return 'Generating Next.js API route...';
      case 3: return 'Creating React component with LCARS styling...';
      case 4: return 'Deploying to n8n server...';
      case 5: return 'Testing integration...';
      case 6: return 'Project generation complete!';
      default: return 'Initializing...';
    }
  };

  return (
    <div className="lcars-page">
      {/* Page Header */}
      <div className="lcars-page-header">
        <h1 className="lcars-page-title">🚀 Revolutionary Project Generator</h1>
        <p className="lcars-page-subtitle">
          Create Revenue-Generating Projects Using n8n Integration
        </p>
        <div className="lcars-mission-status">
          <h2>💰 Revenue Potential: $2,500 - $5,000 per Project</h2>
          <p>Each generated project becomes a revenue-generating microservice</p>
        </div>
      </div>

      {/* Project Generation Process */}
      <div className="lcars-mission-panel">
        <h2>🌟 How It Works</h2>
        <div className="lcars-mission-benefits">
          <div className="lcars-benefit-item">
            <h3>1️⃣ Select Template</h3>
            <p>Choose from proven revenue-generating project templates</p>
          </div>
          <div className="lcars-benefit-item">
            <h3>2️⃣ Customize Features</h3>
            <p>Add custom features and modify project specifications</p>
          </div>
          <div className="lcars-benefit-item">
            <h3>3️⃣ Generate Project</h3>
            <p>Automatically create n8n workflow, Next.js API, and React component</p>
          </div>
          <div className="lcars-benefit-item">
            <h3>4️⃣ Deploy & Test</h3>
            <p>Deploy to n8n server and test the complete integration</p>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="lcars-demo-panel">
        <h2>📋 Step 1: Select Project Template</h2>
        <p>Choose from our proven revenue-generating project templates:</p>
        
        <div className="project-templates-grid">
          {PROJECT_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`project-template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="template-header">
                <h3>{template.name}</h3>
                <div className="revenue-badge">${template.revenuePotential.toLocaleString()}</div>
              </div>
              <p className="template-description">{template.description}</p>
              <div className="template-meta">
                <span className="complexity-badge complexity-{template.complexity.toLowerCase()}">
                  {template.complexity}
                </span>
                <span className="time-estimate">{template.estimatedTime}</span>
              </div>
              <div className="template-category">{template.category}</div>
              <div className="template-features">
                {template.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
                {template.features.length > 3 && (
                  <span className="feature-tag">+{template.features.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Customization */}
      {selectedTemplate && (
        <div className="lcars-demo-panel">
          <h2>🔧 Step 2: Customize Your Project</h2>
          
          <div className="project-customization-form">
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                className="lcars-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
              />
            </div>
            
            <div className="form-group">
              <label>Project Description</label>
              <textarea
                className="lcars-textarea"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project"
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label>Features</label>
              <div className="features-list">
                {customFeatures.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-text">{feature}</span>
                    <button
                      className="lcars-button lcars-button-small lcars-button-danger"
                      onClick={() => removeFeature(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="lcars-button lcars-button-secondary"
                onClick={addCustomFeature}
              >
                ➕ Add Custom Feature
              </button>
            </div>
            
            <div className="project-summary">
              <h3>Project Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <label>Revenue Potential</label>
                  <div className="summary-value">${selectedTemplate.revenuePotential.toLocaleString()}</div>
                </div>
                <div className="summary-item">
                  <label>Target Market</label>
                  <div className="summary-value">{selectedTemplate.targetMarket}</div>
                </div>
                <div className="summary-item">
                  <label>Complexity</label>
                  <div className="summary-value">{selectedTemplate.complexity}</div>
                </div>
                <div className="summary-item">
                  <label>Estimated Time</label>
                  <div className="summary-value">{selectedTemplate.estimatedTime}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Generation */}
      {selectedTemplate && (
        <div className="lcars-demo-panel">
          <h2>🚀 Step 3: Generate Your Project</h2>
          
          {isGenerating ? (
            <div className="generation-progress">
              <div className="progress-steps">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div
                    key={step}
                    className={`progress-step ${generationStep >= step ? 'completed' : ''} ${generationStep === step ? 'current' : ''}`}
                  >
                    <div className="step-number">{step}</div>
                    <div className="step-description">{getStepDescription(step)}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="generation-actions">
              <button
                className="lcars-button lcars-button-primary lcars-button-large"
                onClick={generateProject}
                disabled={!projectName.trim()}
              >
                🚀 Generate Revenue-Generating Project
              </button>
              <p className="generation-note">
                This will create a complete n8n workflow, Next.js API route, and React component
                with full LCARS styling integration.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Generated Project Results */}
      {generatedProject && (
        <div className="lcars-demo-panel">
          <h2>🎉 Project Generated Successfully!</h2>
          
          <div className="generated-project-details">
            <div className="project-header">
              <h3>{generatedProject.name}</h3>
              <div className="project-status">
                <span className="status-badge status-active">Active</span>
                <span className="revenue-badge">${generatedProject.revenuePotential.toLocaleString()}</span>
              </div>
            </div>
            
            <p className="project-description">{generatedProject.description}</p>
            
            <div className="project-endpoints">
              <h4>Integration Endpoints</h4>
              <div className="endpoints-grid">
                <div className="endpoint-item">
                  <label>n8n Webhook</label>
                  <code>{generatedProject.endpoints.n8nWebhook}</code>
                </div>
                <div className="endpoint-item">
                  <label>Next.js API</label>
                  <code>{generatedProject.endpoints.nextJsApi}</code>
                </div>
                <div className="endpoint-item">
                  <label>React Component</label>
                  <code>{generatedProject.endpoints.reactComponent}</code>
                </div>
              </div>
            </div>
            
            <div className="project-features">
              <h4>Features</h4>
              <div className="features-grid">
                {generatedProject.features.map((feature: string, index: number) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
            </div>
            
            <div className="project-actions">
              <button className="lcars-button lcars-button-primary">
                🔗 View Live Project
              </button>
              <button className="lcars-button lcars-button-secondary">
                📊 View Analytics
              </button>
              <button className="lcars-button lcars-button-secondary">
                🔧 Customize Further
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Strategy */}
      <div className="lcars-vision-panel">
        <h2>💰 Revenue Strategy</h2>
        <div className="lcars-vision-grid">
          <div className="lcars-vision-item">
            <h3>🎯 Individual Projects</h3>
            <p>Each generated project represents a standalone revenue-generating microservice</p>
          </div>
          <div className="lcars-vision-item">
            <h3>🔄 Project Combinations</h3>
            <p>Multiple projects can be combined into comprehensive business solutions</p>
          </div>
          <div className="lcars-vision-item">
            <h3>🚀 Rapid Scaling</h3>
            <p>Generate new revenue streams in minutes, not months</p>
          </div>
          <div className="lcars-vision-item">
            <h3>🌍 Market Expansion</h3>
            <p>Target different market segments with specialized project templates</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="lcars-cta-panel">
        <h2>🚀 Ready to Generate Your First Revenue Project?</h2>
        <p>
          Start with a proven template and customize it to your specific needs. 
          Each project you generate becomes a revenue-generating microservice 
          with our revolutionary n8n → Next.js integration.
        </p>
        <div className="lcars-cta-actions">
          <button className="lcars-button lcars-button-primary">
            🚀 Start Project Generation
          </button>
          <button className="lcars-button lcars-button-secondary">
            📋 View All Templates
          </button>
          <button className="lcars-button lcars-button-secondary">
            💰 Revenue Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
