'use client';

import React, { useState } from 'react';

// 🚀 n8n Resume Compliance Auditor Component
// This component demonstrates the revolutionary n8n → Next.js integration
// where n8n workflows generate UI components that render seamlessly in Next.js

interface ResumeAnalysisResult {
  overallScore: number;
  breakdown: {
    actionVerbs: { count: number; score: number };
    metrics: { count: number; score: number };
    leadership: { count: number; score: number };
    technical: { count: number; score: number };
  };
  strengths: string[];
  improvements: string[];
  analysis: {
    textLength: number;
    wordCount: number;
    timestamp: string;
  };
  source: string;
  workflowId: string;
}

const ResumeComplianceAuditor: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please enter resume content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/n8n-resume-auditor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume: resumeText }),
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#00ff00'; // Green
    if (score >= 60) return '#ffff00'; // Yellow
    return '#ff0000'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="lcars-container">
      {/* Header Panel */}
      <div className="lcars-panel lcars-primary-panel">
        <h2 className="lcars-title">🚀 Resume Compliance Auditor</h2>
        <p className="lcars-subtitle">
          Powered by n8n Workflow: {result?.workflowId || 'RRowJtIqlNLGnyjM'}
        </p>
        <p className="lcars-description">
          AI-powered resume analysis with real-time scoring and actionable feedback
        </p>
      </div>

      {/* Input Panel */}
      <div className="lcars-panel lcars-secondary-panel">
        <h3 className="lcars-panel-title">📝 Resume Content</h3>
        <textarea
          className="lcars-textarea"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume content here for analysis..."
          rows={8}
        />
        <button
          className={`lcars-button ${isAnalyzing ? 'lcars-button-disabled' : 'lcars-button-primary'}`}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? '🔍 Analyzing...' : '🚀 Analyze Resume'}
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
          {/* Overall Score Panel */}
          <div className="lcars-panel lcars-accent-panel">
            <h3 className="lcars-panel-title">📊 Overall Score</h3>
            <div className="lcars-score-display">
              <div 
                className="lcars-score-circle"
                style={{ 
                  borderColor: getScoreColor(result.overallScore),
                  color: getScoreColor(result.overallScore)
                }}
              >
                <span className="lcars-score-number">{result.overallScore}</span>
                <span className="lcars-score-label">{getScoreLabel(result.overallScore)}</span>
              </div>
              <div className="lcars-score-details">
                <p><strong>Source:</strong> {result.source}</p>
                <p><strong>Workflow ID:</strong> {result.workflowId}</p>
                <p><strong>Analysis Time:</strong> {new Date(result.analysis.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Breakdown Panel */}
          <div className="lcars-panel lcars-secondary-panel">
            <h3 className="lcars-panel-title">🔍 Detailed Breakdown</h3>
            <div className="lcars-breakdown-grid">
              <div className="lcars-breakdown-item">
                <h4>Action Verbs</h4>
                <div className="lcars-breakdown-score">
                  <span className="lcars-score">{result.breakdown.actionVerbs.score}</span>
                  <span className="lcars-count">({result.breakdown.actionVerbs.count} found)</span>
                </div>
              </div>
              <div className="lcars-breakdown-item">
                <h4>Metrics</h4>
                <div className="lcars-breakdown-score">
                  <span className="lcars-score">{result.breakdown.metrics.score}</span>
                  <span className="lcars-count">({result.breakdown.metrics.count} found)</span>
                </div>
              </div>
              <div className="lcars-breakdown-item">
                <h4>Leadership</h4>
                <div className="lcars-breakdown-score">
                  <span className="lcars-score">{result.breakdown.leadership.score}</span>
                  <span className="lcars-count">({result.breakdown.leadership.count} found)</span>
                </div>
              </div>
              <div className="lcars-breakdown-item">
                <h4>Technical</h4>
                <div className="lcars-breakdown-score">
                  <span className="lcars-score">{result.breakdown.technical.score}</span>
                  <span className="lcars-count">({result.breakdown.technical.count} found)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths Panel */}
          <div className="lcars-panel lcars-success-panel">
            <h3 className="lcars-panel-title">✅ Strengths</h3>
            <ul className="lcars-list">
              {result.strengths.map((strength, index) => (
                <li key={index} className="lcars-list-item">{strength}</li>
              ))}
            </ul>
          </div>

          {/* Improvements Panel */}
          <div className="lcars-panel lcars-warning-panel">
            <h3 className="lcars-panel-title">🔧 Areas for Improvement</h3>
            <ul className="lcars-list">
              {result.improvements.map((improvement, index) => (
                <li key={index} className="lcars-list-item">{improvement}</li>
              ))}
            </ul>
          </div>

          {/* Analysis Details Panel */}
          <div className="lcars-panel lcars-info-panel">
            <h3 className="lcars-panel-title">📈 Analysis Details</h3>
            <div className="lcars-analysis-details">
              <p><strong>Text Length:</strong> {result.analysis.textLength} characters</p>
              <p><strong>Word Count:</strong> {result.analysis.wordCount} words</p>
              <p><strong>Processing Time:</strong> {new Date(result.analysis.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </>
      )}

      {/* Integration Status Panel */}
      <div className="lcars-panel lcars-info-panel">
        <h3 className="lcars-panel-title">🔗 n8n Integration Status</h3>
        <div className="lcars-integration-status">
          <p><strong>Workflow:</strong> Resume Compliance Auditor</p>
          <p><strong>Status:</strong> {result ? 'Active' : 'Standby'}</p>
          <p><strong>Source:</strong> {result?.source || 'Next.js API'}</p>
          <p><strong>Fallback:</strong> Local analysis engine</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeComplianceAuditor;
