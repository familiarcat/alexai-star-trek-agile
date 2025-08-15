'use client';

import React, { useState } from 'react';

// 🚀 n8n Business Intelligence Dashboard Component
// This component demonstrates the revolutionary n8n → Next.js integration
// for business intelligence and analytics - Revenue Potential: $3,500

interface BusinessIntelligenceData {
  timestamp: string;
  businessMetrics: {
    revenue: number;
    expenses: number;
    customers: number;
    growthRate: number;
    marketShare: number;
    employeeCount: number;
    projectCount: number;
    completionRate: number;
  };
  keyPerformanceIndicators: {
    profitMargin: number;
    customerValue: number;
    efficiencyRatio: number;
    projectSuccess: number;
  };
  insights: string[];
  recommendations: string[];
  riskAssessment: {
    financialRisk: 'Low' | 'Medium' | 'High';
    growthRisk: 'Low' | 'Medium' | 'High';
    operationalRisk: 'Low' | 'Medium' | 'High';
  };
  marketPosition: {
    competitiveAdvantage: 'Strong' | 'Moderate' | 'Developing';
    marketOpportunity: 'High' | 'Medium' | 'Low';
  };
  nextSteps: string[];
  source: string;
  workflowId: string;
}

const BusinessIntelligenceDashboard: React.FC = () => {
  const [businessData, setBusinessData] = useState({
    revenue: 0,
    expenses: 0,
    customers: 0,
    growthRate: 0,
    marketShare: 0,
    employeeCount: 0,
    projectCount: 0,
    completionRate: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BusinessIntelligenceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleAnalyze = async () => {
    if (!businessData.revenue && !businessData.customers && !businessData.growthRate) {
      setError('Please provide at least revenue, customers, or growth rate data');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/n8n-business-intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const analysisResult = await response.json();
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#00ff00';
      case 'Medium': return '#ffff00';
      case 'High': return '#ff0000';
      default: return '#666666';
    }
  };

  const getAdvantageColor = (advantage: string) => {
    switch (advantage) {
      case 'Strong': return '#00ff00';
      case 'Moderate': return '#ffff00';
      case 'Developing': return '#ff9900';
      default: return '#666666';
    }
  };

  return (
    <div className="lcars-container">
      {/* Header Panel */}
      <div className="lcars-panel lcars-primary-panel">
        <h2 className="lcars-title">🚀 AI Business Intelligence Dashboard</h2>
        <p className="lcars-subtitle">
          Powered by n8n Workflow: {result?.workflowId || 'business-intelligence-webhook'}
        </p>
        <p className="lcars-description">
          AI-powered business analytics with real-time insights and strategic recommendations
        </p>
        <div className="lcars-revenue-potential">
          <strong>Revenue Potential: $3,500</strong> - High demand from small businesses and startups
        </div>
      </div>

      {/* Input Panel */}
      <div className="lcars-panel lcars-secondary-panel">
        <h3 className="lcars-panel-title">📊 Business Data Input</h3>
        <div className="business-input-grid">
          <div className="input-group">
            <label>Revenue ($)</label>
            <input
              type="number"
              className="lcars-input"
              value={businessData.revenue || ''}
              onChange={(e) => handleInputChange('revenue', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="input-group">
            <label>Expenses ($)</label>
            <input
              type="number"
              className="lcars-input"
              value={businessData.expenses || ''}
              onChange={(e) => handleInputChange('expenses', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="input-group">
            <label>Customers</label>
            <input
              type="number"
              className="lcars-input"
              value={businessData.customers || ''}
              onChange={(e) => handleInputChange('customers', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="input-group">
            <label>Growth Rate (%)</label>
            <input
              type="number"
              className="lcars-input"
              value={businessData.growthRate || ''}
              onChange={(e) => handleInputChange('growthRate', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="input-group">
            <label>Market Share (%)</label>
            <input
              type="number"
              className="lcars-input"
              value={businessData.marketShare || ''}
              onChange={(e) => handleInputChange('marketShare', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="input-group">
            <label>Employees</label>
            <input
              type="number"
              className="lcars-input"
              value={businessData.employeeCount || ''}
              onChange={(e) => handleInputChange('employeeCount', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="input-group">
            <label>Projects</label>
            <input
              type="number"
              className="lcars-input"
              value={businessData.projectCount || ''}
              onChange={(e) => handleInputChange('projectCount', e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="input-group">
            <label>Completion Rate (%)</label>
            <input
              type="number"
              className="lcars-input"
              value={businessData.completionRate || ''}
              onChange={(e) => handleInputChange('completionRate', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <button
          className={`lcars-button ${isAnalyzing ? 'lcars-button-disabled' : 'lcars-button-primary'}`}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? '🔍 Analyzing...' : '🚀 Generate Business Intelligence'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="lcars-panel lcars-error-panel">
          <h3 className="lcars-panel-title">⚠️ Error</h3>
          <p className="lcars-error-text">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <>
          {/* KPI Overview Panel */}
          <div className="lcars-panel lcars-accent-panel">
            <h3 className="lcars-panel-title">📈 Key Performance Indicators</h3>
            <div className="kpi-grid">
              <div className="kpi-item">
                <h4>Profit Margin</h4>
                <div className="kpi-value" style={{ color: result.keyPerformanceIndicators.profitMargin > 20 ? '#00ff00' : result.keyPerformanceIndicators.profitMargin > 10 ? '#ffff00' : '#ff0000' }}>
                  {result.keyPerformanceIndicators.profitMargin}%
                </div>
              </div>
              <div className="kpi-item">
                <h4>Customer Value</h4>
                <div className="kpi-value">${result.keyPerformanceIndicators.customerValue.toLocaleString()}</div>
              </div>
              <div className="kpi-item">
                <h4>Efficiency Ratio</h4>
                <div className="kpi-value">${result.keyPerformanceIndicators.efficiencyRatio.toLocaleString()}</div>
              </div>
              <div className="kpi-item">
                <h4>Project Success</h4>
                <div className="kpi-value">{result.keyPerformanceIndicators.projectSuccess}%</div>
              </div>
            </div>
          </div>

          {/* Risk Assessment Panel */}
          <div className="lcars-panel lcars-warning-panel">
            <h3 className="lcars-panel-title">⚠️ Risk Assessment</h3>
            <div className="risk-grid">
              <div className="risk-item">
                <h4>Financial Risk</h4>
                <div className="risk-level" style={{ color: getRiskColor(result.riskAssessment.financialRisk) }}>
                  {result.riskAssessment.financialRisk}
                </div>
              </div>
              <div className="risk-item">
                <h4>Growth Risk</h4>
                <div className="risk-level" style={{ color: getRiskColor(result.riskAssessment.growthRisk) }}>
                  {result.riskAssessment.growthRisk}
                </div>
              </div>
              <div className="risk-item">
                <h4>Operational Risk</h4>
                <div className="risk-level" style={{ color: getRiskColor(result.riskAssessment.operationalRisk) }}>
                  {result.riskAssessment.operationalRisk}
                </div>
              </div>
            </div>
          </div>

          {/* Market Position Panel */}
          <div className="lcars-panel lcars-info-panel">
            <h3 className="lcars-panel-title">🌍 Market Position</h3>
            <div className="market-position-grid">
              <div className="position-item">
                <h4>Competitive Advantage</h4>
                <div className="position-level" style={{ color: getAdvantageColor(result.marketPosition.competitiveAdvantage) }}>
                  {result.marketPosition.competitiveAdvantage}
                </div>
              </div>
              <div className="position-item">
                <h4>Market Opportunity</h4>
                <div className="position-level" style={{ color: getAdvantageColor(result.marketPosition.marketOpportunity) }}>
                  {result.marketPosition.marketOpportunity}
                </div>
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          <div className="lcars-panel lcars-success-panel">
            <h3 className="lcars-panel-title">💡 AI-Generated Insights</h3>
            <ul className="lcars-list">
              {result.insights.map((insight, index) => (
                <li key={index} className="lcars-list-item">{insight}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations Panel */}
          <div className="lcars-panel lcars-warning-panel">
            <h3 className="lcars-panel-title">🔧 Strategic Recommendations</h3>
            <ul className="lcars-list">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="lcars-list-item">{recommendation}</li>
              ))}
            </ul>
          </div>

          {/* Next Steps Panel */}
          <div className="lcars-panel lcars-info-panel">
            <h3 className="lcars-panel-title">📋 Next Steps</h3>
            <ol className="lcars-list">
              {result.nextSteps.map((step, index) => (
                <li key={index} className="lcars-list-item">{step}</li>
              ))}
            </ol>
          </div>

          {/* Analysis Details Panel */}
          <div className="lcars-panel lcars-info-panel">
            <h3 className="lcars-panel-title">📊 Analysis Details</h3>
            <div className="analysis-details">
              <p><strong>Source:</strong> {result.source}</p>
              <p><strong>Workflow ID:</strong> {result.workflowId}</p>
              <p><strong>Analysis Time:</strong> {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </>
      )}

      {/* Integration Status Panel */}
      <div className="lcars-panel lcars-info-panel">
        <h3 className="lcars-panel-title">🔗 n8n Integration Status</h3>
        <div className="lcars-integration-status">
          <p><strong>Workflow:</strong> AI Business Intelligence Dashboard</p>
          <p><strong>Status:</strong> {result ? 'Active' : 'Standby'}</p>
          <p><strong>Source:</strong> {result?.source || 'Next.js API'}</p>
          <p><strong>Fallback:</strong> Local business intelligence engine</p>
          <p><strong>Revenue Potential:</strong> $3,500</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligenceDashboard;
